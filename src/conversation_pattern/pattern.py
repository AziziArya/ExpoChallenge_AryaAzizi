from typing import List


class ConversationPatternAnalyzer:
    """
    Conversation safety pattern analyzer.

    Detects:
    - Social isolation
    - Hopelessness
    - Negative emotional state
    - Passive suicidal ideation
    - Active crisis language
    - Conversation deterioration

    Does not diagnose.
    """

    def __init__(self):

        self.isolation_keywords = [
            "alone",
            "lonely",
            "nobody understands",
            "no one understands",
            "nobody cares",
            "no one cares",
            "avoiding people",
            "stopped replying",
            "disconnected",
            "keeping everything inside",
        ]

        self.hopelessness_keywords = [
            "hopeless",
            "nothing will change",
            "no future",
            "cannot continue",
            "can't continue",
            "cannot handle anymore",
            "can't handle anymore",
            "no hope",
            "give up",
            "pointless",
            "no way out",
            "tired of fighting",
        ]

        self.negative_keywords = [
            "sad",
            "depressed",
            "empty",
            "tired",
            "broken",
            "lost",
            "worthless",
            "exhausted",
            "stressed",
            "stress",
        ]

        self.passive_crisis_keywords = [
            "disappear",
            "if i disappeared",
            "wish i could disappear",
            "better if i was gone",
            "better without me",
            "everyone would be better without me",
            "nobody would notice",
            "people would have less problems because of me",
            "less problems without me",
            "not around anymore",
        ]

        self.active_crisis_keywords = [
            "want to die",
            "don't want to live",
            "do not want to live",
            "kill myself",
            "end my life",
            "suicide",
            "harm myself",
        ]

    def _normalize(self, text: str):

        return text.lower().replace("’", "'").strip()

    def _contains_pattern(self, text: str, keywords: list):

        text = self._normalize(text)

        return any(keyword in text for keyword in keywords)

    def _count_patterns(self, messages: List[str], keywords: list):

        count = 0

        for message in messages:

            if self._contains_pattern(message, keywords):
                count += 1

        return count

    def _detect_escalation(self, messages):

        stages = []

        for message in messages:

            if self._contains_pattern(message, self.negative_keywords):
                stages.append("negative_emotion")

            if self._contains_pattern(message, self.isolation_keywords):
                stages.append("social_isolation")

            if self._contains_pattern(message, self.hopelessness_keywords):
                stages.append("hopelessness")

            if self._contains_pattern(message, self.passive_crisis_keywords):
                stages.append("passive_crisis")

            if self._contains_pattern(message, self.active_crisis_keywords):
                stages.append("crisis_signal")

        escalation = len(set(stages)) >= 2

        if "crisis_signal" in stages:
            escalation = True

        return {"sequence": stages, "escalation_detected": escalation}

    def analyze(self, messages: List[str]):

        total = max(len(messages), 1)

        isolation = self._count_patterns(messages, self.isolation_keywords)

        hopeless = self._count_patterns(messages, self.hopelessness_keywords)

        negative = self._count_patterns(messages, self.negative_keywords)

        passive = self._count_patterns(messages, self.passive_crisis_keywords)

        crisis = self._count_patterns(messages, self.active_crisis_keywords)

        escalation = self._detect_escalation(messages)

        result = {
            "isolation_score": round(min(isolation / total + isolation * 0.15, 1), 4),
            "hopelessness_score": round(min(hopeless / total + hopeless * 0.2, 1), 4),
            "negative_language_score": round(min(negative / total, 1), 4),
            "passive_crisis_score": round(min(passive / total + passive * 0.25, 1), 4),
            "crisis_language_score": round(min(crisis / total + crisis * 0.5, 1), 4),
            "conversation_escalation": escalation,
        }

        indicators = []

        if result["isolation_score"] > 0:

            indicators.append("Social isolation indicators detected")

        if result["hopelessness_score"] > 0:

            indicators.append("Hopelessness indicators detected")

        if result["passive_crisis_score"] > 0:

            indicators.append("Passive suicidal ideation indicators detected")

        if result["crisis_language_score"] > 0:

            indicators.append("Crisis-related language detected")

        if escalation["escalation_detected"]:

            indicators.append("Conversation deterioration pattern detected")

        result["risk_indicators"] = indicators

        return result
