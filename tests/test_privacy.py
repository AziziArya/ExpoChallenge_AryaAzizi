from src.privacy_guard.privacy import PrivacyGuard

guard = PrivacyGuard()

SAMPLE_TEXT = (
    "Hi, my name is Ali Rezaei.\n"
    "My email is ali@example.com\n"
    "My phone is +98 912 123 4567\n"
    "Visit https://example.com\n"
    "I feel hopeless and alone.\n"
)


def test_process_returns_expected_shape():
    result = guard.process(SAMPLE_TEXT)

    assert "original_text" in result
    assert "anonymized_text" in result
    assert "detected_entities" in result
    assert "entity_count" in result
    assert result["original_text"] == SAMPLE_TEXT


def test_email_is_detected_and_removed():
    result = guard.process(SAMPLE_TEXT)

    assert "EMAIL" in result["detected_entities"]
    assert "ali@example.com" in result["detected_entities"]["EMAIL"]
    assert "ali@example.com" not in result["anonymized_text"]
    assert "[EMAIL]" in result["anonymized_text"]


def test_phone_is_detected_and_removed():
    result = guard.process(SAMPLE_TEXT)

    assert "PHONE" in result["detected_entities"]
    assert "[PHONE]" in result["anonymized_text"]


def test_url_is_detected_and_removed():
    result = guard.process(SAMPLE_TEXT)

    assert "URL" in result["detected_entities"]
    assert "[URL]" in result["anonymized_text"]


def test_non_pii_content_is_preserved():
    result = guard.process(SAMPLE_TEXT)

    # The emotional content itself must never be stripped -- only PII.
    assert "hopeless" in result["anonymized_text"]
    assert "alone" in result["anonymized_text"]


def test_clean_text_has_no_false_positives():
    clean_text = "I feel really sad and tired today, nothing specific happened."

    result = guard.process(clean_text)

    assert result["entity_count"] == 0
    assert result["anonymized_text"] == clean_text


def test_name_and_location_detected_when_ner_model_available():
    """
    NER-based detection (PERSON/LOCATION/ORGANIZATION) depends on the
    spaCy model being installed and loadable in the current environment.
    If it isn't available, PrivacyGuard degrades gracefully to
    regex-only detection -- this test skips itself in that case instead
    of failing the whole suite.
    """
    result = guard.process(SAMPLE_TEXT)

    if guard._nlp is None:
        import pytest

        pytest.skip("spaCy NER model not available in this environment")

    assert "PERSON" in result["detected_entities"]
    assert "[PERSON]" in result["anonymized_text"]
