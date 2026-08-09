import json
import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.database.database import Base
from backend.services import chat_service


@pytest.fixture()
def client(monkeypatch):
    """
    Runs each chat test against its own throwaway SQLite file instead
    of the real mental_health.db -- keeps these tests from ever
    colliding with a developer's running server or with other test
    files (the exact class of bug that bit /conversations earlier).
    """

    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)

    test_engine = create_engine(f"sqlite:///{path}", connect_args={"check_same_thread": False})
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    Base.metadata.create_all(bind=test_engine)

    monkeypatch.setattr(chat_service, "SessionLocal", TestSessionLocal)

    from backend.app import app

    yield TestClient(app)

    os.unlink(path)


def test_chat_start_returns_session_id(client):
    response = client.post("/chat/start")

    assert response.status_code == 200

    data = response.json()

    assert "session_id" in data
    assert data["chatbot_mode"] == "error"  # no OPENAI_API_KEY in the test environment


def test_chat_message_gets_reply_and_runs_safety_analysis(client):
    session_id = client.post("/chat/start").json()["session_id"]

    response = client.post(f"/chat/{session_id}/message", json={"text": "hey, how's it going?"})

    assert response.status_code == 200

    data = response.json()

    assert data["reply"]
    assert data["chatbot_mode"] == "error"
    assert "risk_level" in data
    assert "privacy_summary" in data


def test_chat_risk_level_escalates_with_distressed_messages(client):
    session_id = client.post("/chat/start").json()["session_id"]

    client.post(f"/chat/{session_id}/message", json={"text": "hi there"})

    response = client.post(
        f"/chat/{session_id}/message",
        json={"text": "I feel hopeless and alone, nothing feels worth it anymore"},
    )

    data = response.json()

    assert data["risk_level"] in ("Moderate Risk", "High Risk", "Critical Emergency")


def test_chat_session_persists_and_resumes(client):
    session_id = client.post("/chat/start").json()["session_id"]

    client.post(f"/chat/{session_id}/message", json={"text": "first message"})
    client.post(f"/chat/{session_id}/message", json={"text": "second message"})

    response = client.get(f"/chat/{session_id}")

    assert response.status_code == 200

    data = response.json()

    # 2 user turns + 2 assistant replies, saved immediately after each turn
    assert data["message_count"] == 4
    assert len(data["messages"]) == 4
    assert data["messages"][0]["role"] == "user"
    assert data["messages"][1]["role"] == "assistant"


def test_chat_message_to_unknown_session_returns_404(client):
    response = client.post("/chat/does-not-exist/message", json={"text": "hello"})

    assert response.status_code == 404


def test_chat_get_unknown_session_returns_404(client):
    response = client.get("/chat/does-not-exist")

    assert response.status_code == 404


def test_chat_message_rate_limit_per_minute(client, monkeypatch):
    """
    Independent of the per-session message cap: a burst of messages in
    a short window should get rate-limited (429) well before the
    session-level cap is hit, protecting against runaway API costs
    from e.g. a stuck client-side retry loop.
    """

    from src.chatbot import rate_limiter

    rate_limiter._requests.clear()
    monkeypatch.setattr(rate_limiter, "DEFAULT_MAX_REQUESTS", 5)

    session_id = client.post("/chat/start").json()["session_id"]

    statuses = []
    for i in range(7):
        resp = client.post(f"/chat/{session_id}/message", json={"text": f"msg {i}"})
        statuses.append(resp.status_code)

    assert statuses[:5] == [200] * 5
    assert 429 in statuses[5:]


def test_chat_session_rate_limit(client, monkeypatch):
    """A session can't be sent more than MAX_MESSAGES_PER_SESSION messages."""

    from backend import app as backend_app

    monkeypatch.setattr(backend_app, "MAX_MESSAGES_PER_SESSION", 2)

    session_id = client.post("/chat/start").json()["session_id"]

    ok1 = client.post(f"/chat/{session_id}/message", json={"text": "first"})
    assert ok1.status_code == 200

    limited = client.post(f"/chat/{session_id}/message", json={"text": "second"})
    assert limited.status_code == 429


def test_chat_sends_anonymized_text_to_llm_not_raw_pii(client, monkeypatch):
    """
    Personal information the user types (email, in this case) must be
    anonymized before it's sent to the external LLM -- the model
    should only ever see '[EMAIL]', never the real address.
    """

    captured_history = {}

    def fake_generate_reply(history, risk_level=None):
        captured_history["history"] = history
        return {"reply": "ok", "mode": "live", "usage": {}}

    from backend import app as backend_app

    monkeypatch.setattr(backend_app.llm_client, "generate_reply", fake_generate_reply)

    session_id = client.post("/chat/start").json()["session_id"]

    client.post(
        f"/chat/{session_id}/message",
        json={"text": "Hi, my email is realuser@example.com, feeling kind of low today"},
    )

    sent_text = captured_history["history"][-1]["content"]

    assert "realuser@example.com" not in sent_text
    assert "[EMAIL]" in sent_text


def test_chat_does_not_reanalyze_prior_messages_each_turn(client, monkeypatch):
    """
    Regression test for the incremental analysis fix: without it, turn N
    re-runs the full pipeline on all N prior messages every time, so a
    5-message conversation would trigger 1+2+3+4+5=15 analyze() calls.
    With it, each turn should only analyze the newest message, so 5
    messages = 5 analyze() calls total.
    """
    from backend.app import analyzer as backend_analyzer

    call_count = {"n": 0}
    original_analyze = backend_analyzer.analyze

    def counting_analyze(text):
        call_count["n"] += 1
        return original_analyze(text)

    monkeypatch.setattr(backend_analyzer, "analyze", counting_analyze)

    session_id = client.post("/chat/start").json()["session_id"]

    for i in range(5):
        client.post(f"/chat/{session_id}/message", json={"text": f"message number {i}"})

    assert call_count["n"] == 5
