"""
Conversation file parser.

Turns an uploaded conversation export (Telegram JSON/TXT export, a
generic CSV, or a plain pasted .txt) into the internal message format
the rest of the pipeline already expects: a simple `List[str]` of
message texts, in chronological order.

Supported inputs
-----------------
1. Telegram Desktop JSON export ("Export chat history" -> JSON)
   {
     "messages": [
       {"type": "message", "from": "...", "text": "hello"},
       {"type": "message", "text": [{"type": "bold", "text": "hi"}, " there"]},
       {"type": "service", ...}   <- skipped (joins, pins, calls, etc.)
     ]
   }

2. Telegram Desktop plain-text export ("Export chat history" -> TXT)
   John Doe, [12.01.2023 14:30]
   Hello there

   Jane Doe, [12.01.2023 14:31]
   Hi!

3. Generic CSV with a text/message column (header row required):
   sender,message
   John,Hello there
   Jane,Hi!

4. Plain .txt with one message per line (fallback / manually pasted
   conversations) -- this preserves the previous behaviour for text
   that isn't a real export.

Design notes
------------
Parsing lives entirely on the backend (not duplicated in the frontend)
so there is a single source of truth for "what counts as a message"
regardless of which client uploads the file.
"""

import csv
import io
import json
import re
from typing import List

# Telegram plain-text export message header, e.g. "John Doe, [12.01.2023 14:30]"
_TG_TXT_HEADER = re.compile(
    r"^(?P<sender>.{1,120}?),?\s*\[(?P<date>\d{1,2}\.\d{1,2}\.\d{2,4}[^\]]*)\]\s*$"
)

# Reasonable safety limits so a malformed / huge file can't hang the pipeline.
MAX_MESSAGES = 5000
MAX_MESSAGE_LENGTH = 4000


class ConversationParseError(ValueError):
    """Raised when a file can't be parsed into conversation messages."""


def _clean(text: str) -> str:
    text = text.strip()
    if len(text) > MAX_MESSAGE_LENGTH:
        text = text[:MAX_MESSAGE_LENGTH]
    return text


def _extract_telegram_text_field(value) -> str:
    """
    Telegram's `text` field is either a plain string, or a list mixing
    plain strings with rich-text entity objects like
    {"type": "bold", "text": "..."}. Either way we only want the
    concatenated plain text.
    """

    if isinstance(value, str):
        return value

    if isinstance(value, list):
        parts = []

        for item in value:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                parts.append(str(item.get("text", "")))

        return "".join(parts)

    return ""


def parse_telegram_json(raw: bytes) -> List[str]:
    try:
        data = json.loads(raw.decode("utf-8-sig"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ConversationParseError(f"Invalid JSON file: {exc}") from exc

    raw_messages: List = []

    # Official single-chat export: {"messages": [...]}
    if isinstance(data, dict) and isinstance(data.get("messages"), list):
        raw_messages = data["messages"]

    # "Export all chats" wrapper: {"chats": {"list": [{"messages": [...]}, ...]}}
    elif isinstance(data, dict) and isinstance(data.get("chats"), dict) and isinstance(
        data["chats"].get("list"), list
    ):
        for chat in data["chats"]["list"]:
            if isinstance(chat, dict) and isinstance(chat.get("messages"), list):
                raw_messages.extend(chat["messages"])

    # Generic fallback: a bare list of message objects or strings.
    elif isinstance(data, list):
        raw_messages = data

    else:
        raise ConversationParseError(
            "Unrecognized JSON structure: expected a Telegram export with a "
            "top-level 'messages' array (single chat) or 'chats.list' "
            "(all-chats export)."
        )

    messages: List[str] = []

    for item in raw_messages:

        if isinstance(item, str):
            text = item

        elif isinstance(item, dict):

            # Skip Telegram "service" events (joined chat, pinned
            # message, call started, etc.) -- they aren't conversation
            # content and would just add noise to the analysis. Only
            # skip when the type is explicitly "service"; other export
            # tools may omit the "type" key entirely.
            if item.get("type") == "service":
                continue

            # Different export tools use different field names for the
            # message body -- try the common ones in order.
            text = (
                _extract_telegram_text_field(item.get("text", ""))
                or _extract_telegram_text_field(item.get("message", ""))
                or _extract_telegram_text_field(item.get("caption", ""))
            )

        else:
            continue

        text = _clean(text)

        if text:
            messages.append(text)

    return messages


def parse_telegram_txt(raw: bytes) -> List[str]:
    text = raw.decode("utf-8-sig", errors="replace")
    lines = text.splitlines()

    messages: List[str] = []
    current: List[str] = []
    header_seen = False

    def _flush():
        if current:
            body = _clean("\n".join(current))
            if body:
                messages.append(body)

    for line in lines:

        if _TG_TXT_HEADER.match(line):
            header_seen = True
            _flush()
            current = []
            continue

        if line.strip():
            current.append(line)

    _flush()

    if header_seen and messages:
        return messages

    # Not a recognizable Telegram TXT export -- fall back to
    # "one non-empty line = one message" so plain pasted text still
    # works exactly as before.
    return [_clean(line) for line in lines if line.strip()]


def parse_csv_file(raw: bytes) -> List[str]:
    text = raw.decode("utf-8-sig", errors="replace")

    reader = csv.reader(io.StringIO(text))
    rows = list(reader)

    if not rows:
        return []

    header = [h.strip().lower() for h in rows[0]]

    text_column_candidates = ["text", "message", "content", "body"]
    text_index = next(
        (header.index(c) for c in text_column_candidates if c in header),
        None,
    )

    data_rows = rows[1:] if text_index is not None else rows

    # No recognizable header -- assume the last column of every row is
    # the message text (common for simple "sender,message" exports).
    if text_index is None:
        text_index = len(header) - 1

    messages: List[str] = []

    for row in data_rows:
        if not row or text_index >= len(row):
            continue

        text = _clean(row[text_index])

        if text:
            messages.append(text)

    return messages


def parse_plain_text(raw: bytes) -> List[str]:
    text = raw.decode("utf-8-sig", errors="replace")
    return [_clean(line) for line in text.splitlines() if line.strip()]


def parse_conversation_file(filename: str, raw: bytes) -> List[str]:
    """
    Dispatches to the right parser based on file extension, then
    applies shared safety limits (message count / length).
    """

    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if extension == "json":
        messages = parse_telegram_json(raw)
    elif extension == "csv":
        messages = parse_csv_file(raw)
    elif extension == "txt":
        messages = parse_telegram_txt(raw)
    else:
        raise ConversationParseError(
            f"Unsupported file type: .{extension or 'unknown'}. "
            "Supported formats: .json, .txt, .csv"
        )

    if not messages:
        raise ConversationParseError(
            "No messages could be extracted from this file. "
            "Please check the export format."
        )

    if len(messages) > MAX_MESSAGES:
        messages = messages[:MAX_MESSAGES]

    return messages
