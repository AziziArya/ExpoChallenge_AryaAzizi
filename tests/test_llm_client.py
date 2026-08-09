from unittest.mock import MagicMock, patch

from src.chatbot import llm_client


def _fake_event(event_type, **attrs):
    event = MagicMock()
    event.type = event_type
    for key, value in attrs.items():
        setattr(event, key, value)
    return event


def _fake_stream(text_chunks, prompt_tokens=10, completion_tokens=5, total_tokens=15):
    events = [_fake_event("response.output_text.delta", delta=chunk) for chunk in text_chunks]

    usage = MagicMock(input_tokens=prompt_tokens, output_tokens=completion_tokens, total_tokens=total_tokens)
    completed = _fake_event("response.completed", response=MagicMock(usage=usage))
    events.append(completed)

    return iter(events)


def test_error_message_when_no_api_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    assert llm_client.is_live() is False

    result = llm_client.generate_reply([{"role": "user", "content": "hi"}])

    assert result["mode"] == "error"
    assert result["reply"] == llm_client.CONNECTION_ERROR_MESSAGE
    assert result["usage"] == {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}


def test_is_live_true_when_key_present(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")

    assert llm_client.is_live() is True


def test_live_reply_uses_responses_api_with_streaming(monkeypatch):
    """
    Regression test matching the exact API surface verified against a
    real key: client.responses.create(..., stream=True), consumed as a
    stream of response.output_text.delta events and a final
    response.completed event carrying usage.
    """

    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")

    captured = {}

    def fake_create(**kwargs):
        captured.update(kwargs)
        return _fake_stream(["Hey", " there", "!"])

    fake_client = MagicMock()
    fake_client.responses.create = fake_create

    with patch("openai.OpenAI", return_value=fake_client):
        result = llm_client.generate_reply([{"role": "user", "content": "hi"}])

    assert result["mode"] == "live"
    assert result["reply"] == "Hey there!"
    assert result["usage"] == {"prompt_tokens": 10, "completion_tokens": 5, "total_tokens": 15}

    assert captured["stream"] is True
    assert captured["model"] == "gpt-5.6-luna"
    assert "input" in captured
    assert "instructions" in captured


def test_timeout_and_temperature_are_passed_through(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")

    captured_client_kwargs = {}

    class FakeOpenAI:
        def __init__(self, **kwargs):
            captured_client_kwargs.update(kwargs)
            self.responses = MagicMock()
            self.responses.create = MagicMock(return_value=_fake_stream(["ok"]))

    with patch("openai.OpenAI", FakeOpenAI):
        llm_client.generate_reply([{"role": "user", "content": "hi"}])

    assert captured_client_kwargs["timeout"] == llm_client.DEFAULT_TIMEOUT_SECONDS


def test_timeout_env_override(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")
    monkeypatch.setenv("OPENAI_TIMEOUT_SECONDS", "45")

    captured_client_kwargs = {}

    class FakeOpenAI:
        def __init__(self, **kwargs):
            captured_client_kwargs.update(kwargs)
            self.responses = MagicMock()
            self.responses.create = MagicMock(return_value=_fake_stream(["ok"]))

    with patch("openai.OpenAI", FakeOpenAI):
        llm_client.generate_reply([{"role": "user", "content": "hi"}])

    assert captured_client_kwargs["timeout"] == 45


def test_temperature_is_not_sent_for_gpt5_models(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")

    captured = {}

    def fake_create(**kwargs):
        captured.update(kwargs)
        return _fake_stream(["ok"])

    fake_client = MagicMock()
    fake_client.responses.create = fake_create

    with patch("openai.OpenAI", return_value=fake_client):
        llm_client.generate_reply([{"role": "user", "content": "hi"}])

    assert "temperature" not in captured

def test_history_is_windowed_before_being_sent(monkeypatch):
    """
    A long-running chat must not resend its entire history forever --
    only the most recent MAX_HISTORY_MESSAGES should reach the model,
    or cost/latency would grow without bound as the chat gets longer.
    """

    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")

    long_history = [
        {"role": "user" if i % 2 == 0 else "assistant", "content": f"message {i}"}
        for i in range(50)
    ]

    captured = {}

    def fake_create(**kwargs):
        captured.update(kwargs)
        return _fake_stream(["ok"])

    fake_client = MagicMock()
    fake_client.responses.create = fake_create

    with patch("openai.OpenAI", return_value=fake_client):
        result = llm_client.generate_reply(long_history)

    # Unlike Chat Completions, the Responses API takes the system
    # prompt via a separate `instructions` param, not folded into
    # `input` -- so `input` itself should be exactly the windowed size.
    assert len(captured["input"]) == llm_client.MAX_HISTORY_MESSAGES
    assert result["mode"] == "live"


def test_returns_connection_error_message_on_api_error(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")

    def raise_error(*a, **k):
        raise RuntimeError("simulated API outage")

    fake_client = MagicMock()
    fake_client.responses.create = raise_error

    with patch("openai.OpenAI", return_value=fake_client):
        result = llm_client.generate_reply([{"role": "user", "content": "hi"}])

    # The whole app must keep working even if the API is down/misconfigured
    # -- but the failure must be honest, not disguised as a normal reply.
    assert result["mode"] == "error"
    assert result["reply"] == llm_client.CONNECTION_ERROR_MESSAGE


def test_returns_connection_error_message_on_empty_reply(monkeypatch):
    """A stream that produces no text deltas at all should not be treated as a successful live reply."""

    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")

    fake_client = MagicMock()
    fake_client.responses.create = MagicMock(return_value=_fake_stream([]))

    with patch("openai.OpenAI", return_value=fake_client):
        result = llm_client.generate_reply([{"role": "user", "content": "hi"}])

    assert result["mode"] == "error"
    assert result["reply"] == llm_client.CONNECTION_ERROR_MESSAGE


def test_default_model_matches_purchased_plan():
    assert llm_client.DEFAULT_MODEL == "gpt-5.6-luna"


def test_max_reply_tokens_env_override(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-fake-key")
    monkeypatch.setenv("OPENAI_MAX_REPLY_TOKENS", "123")

    captured = {}

    def fake_create(**kwargs):
        captured.update(kwargs)
        return _fake_stream(["ok"])

    fake_client = MagicMock()
    fake_client.responses.create = fake_create

    with patch("openai.OpenAI", return_value=fake_client):
        result = llm_client.generate_reply([{"role": "user", "content": "hi"}])

    assert captured["max_output_tokens"] == 123
    assert result["mode"] == "live"


def test_system_prompt_matches_required_safety_language():
    prompt = llm_client._build_system_prompt(None)

    assert "do not diagnose" in prompt.lower()
    assert "safety analysis result provided by the analyzer" in prompt.lower()
    assert "encourage human support" in prompt.lower()


def test_system_prompt_flags_high_risk():
    prompt = llm_client._build_system_prompt("Critical Emergency")

    assert "high risk" in prompt.lower()
