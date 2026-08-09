import re
from typing import Dict, List, Optional, Tuple

from src.logging.logger import logger

# Lazy-loaded module-level cache so the (relatively heavy) spaCy model is
# loaded only once per process, no matter how many PrivacyGuard instances
# are created (pipeline modules each build their own PrivacyGuard).
_SPACY_NLP = None
_SPACY_LOAD_ATTEMPTED = False


def _get_spacy_model():
    """Lazily load and cache the spaCy NER model.

    Returns None (and logs a warning) if spaCy or the model isn't
    available, so the rest of the app keeps working with regex-only
    detection instead of crashing.
    """
    global _SPACY_NLP, _SPACY_LOAD_ATTEMPTED

    if _SPACY_NLP is not None or _SPACY_LOAD_ATTEMPTED:
        return _SPACY_NLP

    _SPACY_LOAD_ATTEMPTED = True

    try:
        import spacy

        _SPACY_NLP = spacy.load("en_core_web_sm")
        logger.info("Privacy Guard: spaCy NER model loaded successfully.")

    except Exception as exc:  # pragma: no cover - environment dependent

        logger.warning(
            "Privacy Guard: spaCy model unavailable (%s). "
            "Falling back to regex-only PII detection." % exc
        )

        _SPACY_NLP = None

    return _SPACY_NLP


class PrivacyGuard:
    """
    Detects and anonymizes personally identifiable information (PII)
    before any text is sent into the mental health analysis models.

    Two detection layers are combined:

    1. Regex layer   -> EMAIL, PHONE, URL, IP
       (fast, deterministic, no ML dependency)

    2. NER layer (spaCy) -> PERSON, LOCATION, ORGANIZATION
       (contextual entity recognition; falls back to regex-only
       if spaCy / the model isn't installed in the environment)
    """

    # spaCy entity labels we care about, mapped to our own category names
    SPACY_LABEL_MAP = {
        "PERSON": "PERSON",
        "GPE": "LOCATION",
        "LOC": "LOCATION",
        "FAC": "LOCATION",
        "ORG": "ORGANIZATION",
        "NORP": "ORGANIZATION",
    }

    def __init__(self):
        self.regex_patterns = {
            "EMAIL": re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
            "PHONE": re.compile(
                r"(?:\+?\d{1,3}[\s\-]?)?(?:\(?\d{2,4}\)?[\s\-]?)?\d{3,4}[\s\-]?\d{3,4}"
            ),
            "URL": re.compile(r"https?://\S+|www\.\S+"),
            "IP": re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b"),
        }

        # Trigger the (cached) model load once, at pipeline start-up time,
        # instead of lazily on the first request -> avoids latency spikes
        # on the first user-facing analysis call.
        self._nlp = _get_spacy_model()

    # ------------------------------------------------------------------
    # Span collection
    # ------------------------------------------------------------------

    def _regex_spans(self, text: str) -> List[Tuple[int, int, str, str]]:
        spans = []

        for entity_type, pattern in self.regex_patterns.items():
            for match in pattern.finditer(text):

                value = match.group().strip()

                # Guard against the PHONE pattern accidentally matching
                # bare short numbers (e.g. "2024") with no separators.
                if entity_type == "PHONE":
                    digits = re.sub(r"\D", "", value)
                    if len(digits) < 7:
                        continue

                spans.append((match.start(), match.end(), entity_type, value))

        return spans

    def _ner_spans(self, text: str) -> List[Tuple[int, int, str, str]]:
        if self._nlp is None:
            return []

        spans = []

        doc = self._nlp(text)

        for ent in doc.ents:

            label = self.SPACY_LABEL_MAP.get(ent.label_)

            if label is None:
                continue

            spans.append((ent.start_char, ent.end_char, label, ent.text))

        return spans

    def _merge_spans(
        self, spans: List[Tuple[int, int, str, str]]
    ) -> List[Tuple[int, int, str, str]]:
        """
        Resolve overlapping spans between the regex and NER layers.
        Regex matches (EMAIL/PHONE/URL/IP) win over NER matches when they
        overlap, since they're deterministic; among equal-priority spans
        the longer match wins.
        """

        priority = {"EMAIL": 0, "PHONE": 0, "URL": 0, "IP": 0, "PERSON": 1,
                    "LOCATION": 1, "ORGANIZATION": 1}

        ordered = sorted(
            spans, key=lambda s: (priority.get(s[2], 2), s[0], -(s[1] - s[0]))
        )

        accepted: List[Tuple[int, int, str, str]] = []

        for span in ordered:
            start, end, _, _ = span

            overlaps = any(not (end <= a[0] or start >= a[1]) for a in accepted)

            if not overlaps:
                accepted.append(span)

        accepted.sort(key=lambda s: s[0])

        return accepted

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def analyze(self, text: str) -> Dict[str, List[str]]:
        """Returns detected entities grouped by category, e.g.
        {"PERSON": ["Ali"], "EMAIL": ["ali@example.com"]}
        """

        spans = self._merge_spans(
            self._regex_spans(text) + self._ner_spans(text)
        )

        findings: Dict[str, List[str]] = {}

        for _, _, label, value in spans:
            findings.setdefault(label, []).append(value)

        return findings

    def anonymize(self, text: str) -> str:
        spans = self._merge_spans(
            self._regex_spans(text) + self._ner_spans(text)
        )

        # Replace right-to-left so earlier character offsets stay valid.
        anonymized = text

        for start, end, label, _ in sorted(spans, key=lambda s: s[0], reverse=True):
            anonymized = anonymized[:start] + f"[{label}]" + anonymized[end:]

        return anonymized

    def process(self, text: str) -> Dict[str, object]:
        """
        Single entry point used by the analysis pipeline.

        Runs detection once and derives both the anonymized text and the
        entity breakdown from the same span list, so results are always
        consistent with each other.
        """

        spans = self._merge_spans(
            self._regex_spans(text) + self._ner_spans(text)
        )

        findings: Dict[str, List[str]] = {}

        for _, _, label, value in spans:
            findings.setdefault(label, []).append(value)

        anonymized = text

        for start, end, label, _ in sorted(spans, key=lambda s: s[0], reverse=True):
            anonymized = anonymized[:start] + f"[{label}]" + anonymized[end:]

        return {
            "original_text": text,
            "anonymized_text": anonymized,
            "detected_entities": findings,
            "entity_count": sum(len(v) for v in findings.values()),
            "pii_detected": sum(len(v) for v in findings.values()) > 0,
        }
