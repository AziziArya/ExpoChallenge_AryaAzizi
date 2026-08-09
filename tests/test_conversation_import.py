import json

import pytest

from src.conversation_import.parser import (
    ConversationParseError,
    parse_conversation_file,
    parse_csv_file,
    parse_telegram_json,
    parse_telegram_txt,
)


# ----------------------------------------------------------------
# Telegram JSON export
# ----------------------------------------------------------------


def test_telegram_json_basic_messages():
    export = {
        "messages": [
            {"type": "message", "from": "Ali", "text": "Hi there"},
            {"type": "message", "from": "Sara", "text": "Hello!"},
        ]
    }

    raw = json.dumps(export).encode("utf-8")

    messages = parse_telegram_json(raw)

    assert messages == ["Hi there", "Hello!"]


def test_telegram_json_skips_service_messages():
    export = {
        "messages": [
            {"type": "service", "action": "pin_message"},
            {"type": "message", "from": "Ali", "text": "Real message"},
        ]
    }

    raw = json.dumps(export).encode("utf-8")

    messages = parse_telegram_json(raw)

    assert messages == ["Real message"]


def test_telegram_json_handles_rich_text_entities():
    export = {
        "messages": [
            {
                "type": "message",
                "text": [
                    {"type": "bold", "text": "important"},
                    " and plain text",
                ],
            }
        ]
    }

    raw = json.dumps(export).encode("utf-8")

    messages = parse_telegram_json(raw)

    assert messages == ["important and plain text"]


def test_telegram_json_invalid_raises():
    with pytest.raises(ConversationParseError):
        parse_telegram_json(b"{not valid json")


def test_telegram_json_wrong_shape_raises():
    with pytest.raises(ConversationParseError):
        parse_telegram_json(b'{"not_messages": []}')


def test_telegram_json_multi_chat_export_wrapper():
    export = {
        "chats": {
            "list": [
                {
                    "name": "Chat A",
                    "messages": [
                        {"type": "message", "text": "Hi from chat A"},
                    ],
                },
                {
                    "name": "Chat B",
                    "messages": [
                        {"type": "message", "text": "Hi from chat B"},
                    ],
                },
            ]
        }
    }

    raw = json.dumps(export).encode("utf-8")

    messages = parse_telegram_json(raw)

    assert messages == ["Hi from chat A", "Hi from chat B"]


def test_telegram_json_falls_back_to_message_field():
    export = {
        "messages": [
            {"from": "Ali", "message": "Hello using 'message' key instead of 'text'"},
        ]
    }

    raw = json.dumps(export).encode("utf-8")

    messages = parse_telegram_json(raw)

    assert messages == ["Hello using 'message' key instead of 'text'"]


def test_telegram_json_message_without_type_field_is_kept():
    export = {"messages": [{"from": "Ali", "text": "No type field on this one"}]}

    raw = json.dumps(export).encode("utf-8")

    messages = parse_telegram_json(raw)

    assert messages == ["No type field on this one"]


# ----------------------------------------------------------------
# Telegram TXT export
# ----------------------------------------------------------------


def test_telegram_txt_with_headers():
    raw = (
        "John Doe, [12.01.2023 14:30]\n"
        "Hello there\n"
        "\n"
        "Jane Doe, [12.01.2023 14:31]\n"
        "Hi!\n"
    ).encode("utf-8")

    messages = parse_telegram_txt(raw)

    assert messages == ["Hello there", "Hi!"]


def test_telegram_txt_multiline_message_body():
    raw = (
        "John Doe, [12.01.2023 14:30]\n"
        "Line one\n"
        "Line two\n"
    ).encode("utf-8")

    messages = parse_telegram_txt(raw)

    assert messages == ["Line one\nLine two"]


def test_plain_txt_fallback_when_no_headers():
    raw = "I feel sad today\nI don't know what to do\n".encode("utf-8")

    messages = parse_telegram_txt(raw)

    assert messages == ["I feel sad today", "I don't know what to do"]


# ----------------------------------------------------------------
# CSV
# ----------------------------------------------------------------


def test_csv_with_message_column():
    raw = "sender,message\nAli,Hello there\nSara,Hi!\n".encode("utf-8")

    messages = parse_csv_file(raw)

    assert messages == ["Hello there", "Hi!"]


def test_csv_without_recognizable_header_uses_last_column():
    raw = "Ali,Hello there\nSara,Hi!\n".encode("utf-8")

    messages = parse_csv_file(raw)

    assert messages == ["Hello there", "Hi!"]


def test_csv_empty_file_returns_empty_list():
    assert parse_csv_file(b"") == []


# ----------------------------------------------------------------
# Dispatcher
# ----------------------------------------------------------------


def test_dispatcher_routes_by_extension():
    export = {"messages": [{"type": "message", "text": "Hi"}]}
    raw = json.dumps(export).encode("utf-8")

    assert parse_conversation_file("chat.json", raw) == ["Hi"]


def test_dispatcher_rejects_unsupported_extension():
    with pytest.raises(ConversationParseError):
        parse_conversation_file("chat.pdf", b"whatever")


def test_dispatcher_rejects_empty_result():
    with pytest.raises(ConversationParseError):
        parse_conversation_file("chat.json", json.dumps({"messages": []}).encode())
