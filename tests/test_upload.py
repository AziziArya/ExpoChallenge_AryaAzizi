import json

from fastapi.testclient import TestClient

from src.api.main import app

client = TestClient(app)


def _telegram_export_bytes():
    export = {
        "messages": [
            {"type": "service", "action": "pin_message"},
            {
                "type": "message",
                "from": "Ali",
                "text": "Hi, my name is Ali and my email is ali@test.com",
            },
            {
                "type": "message",
                "from": "Ali",
                "text": "I feel really hopeless lately and alone.",
            },
        ]
    }
    return json.dumps(export).encode("utf-8")


def test_upload_telegram_json_returns_full_analysis():
    files = {
        "file": (
            "telegram_export.json",
            _telegram_export_bytes(),
            "application/json",
        )
    }

    response = client.post("/analyze/upload", files=files)

    assert response.status_code == 200

    data = response.json()

    # Service message must be skipped -> only 2 real messages analyzed
    assert data["message_count"] == 2
    assert data["source_file"]["parsed_message_count"] == 2
    assert "overall_risk" in data
    assert "privacy_summary" in data
    assert data["privacy_summary"]["total_entities_removed"] >= 1


def test_upload_rejects_unsupported_extension():
    files = {"file": ("chat.pdf", b"whatever", "application/pdf")}

    response = client.post("/analyze/upload", files=files)

    assert response.status_code == 422


def test_upload_rejects_empty_conversation():
    files = {
        "file": (
            "empty.json",
            json.dumps({"messages": []}).encode("utf-8"),
            "application/json",
        )
    }

    response = client.post("/analyze/upload", files=files)

    assert response.status_code == 422


def test_upload_csv_conversation():
    csv_content = b"sender,message\nAli,Hello there\nSara,I feel okay today\n"

    files = {"file": ("chat.csv", csv_content, "text/csv")}

    response = client.post("/analyze/upload", files=files)

    assert response.status_code == 200

    data = response.json()

    assert data["message_count"] == 2
