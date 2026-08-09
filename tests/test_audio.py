from unittest.mock import patch

from fastapi.testclient import TestClient

from src.api.main import app

client = TestClient(app)


def test_audio_analysis_runs_full_pipeline_on_transcript():
    fake_transcription = {
        "text": "I feel really hopeless and alone lately.",
        "engine": "google_free",
    }

    with patch("src.api.main.transcribe_audio", return_value=fake_transcription):
        files = {"file": ("voice_note.wav", b"fake-audio-bytes", "audio/wav")}
        response = client.post("/analyze/audio", files=files)

    assert response.status_code == 200

    data = response.json()

    assert data["transcription"]["transcript"] == fake_transcription["text"]
    assert data["transcription"]["engine"] == "google_free"
    assert data["transcription"]["source_filename"] == "voice_note.wav"

    # Routed through the conversation pipeline (same shape as
    # /analyze-conversation and /analyze/upload) so it gets a real
    # conversation_id and can be persisted/reloaded.
    assert "conversation_id" in data
    assert data["message_count"] == 1
    assert "overall_risk" in data
    assert "privacy_summary" in data


def test_audio_analysis_reports_transcription_failure():
    from src.speech_to_text.transcriber import TranscriptionError

    with patch(
        "src.api.main.transcribe_audio",
        side_effect=TranscriptionError("Could not transcribe this audio with any available engine."),
    ):
        files = {"file": ("silence.wav", b"fake-audio-bytes", "audio/wav")}
        response = client.post("/analyze/audio", files=files)

    assert response.status_code == 422
    assert "transcribe" in response.json()["detail"].lower()


def test_audio_analysis_rejects_oversized_file():
    oversized = b"0" * (16 * 1024 * 1024)  # 16 MB > 15 MB limit

    files = {"file": ("big.wav", oversized, "audio/wav")}
    response = client.post("/analyze/audio", files=files)

    assert response.status_code == 413
