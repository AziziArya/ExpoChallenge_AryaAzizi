# API Documentation

## Overview

The Mental Health Safety Analyzer exposes its analysis pipeline through
a FastAPI REST API. This document reflects the endpoints as actually
implemented in `backend/app.py`.

Interactive, always-current documentation is also available at
`/docs` (Swagger UI) and `/redoc` once the server is running.

------------------------------------------------------------------------

# Installation and Running

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn backend.app:app --reload
```

The API starts at `http://127.0.0.1:8000`.

------------------------------------------------------------------------

# Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Service status |
| GET | `/health` | Health check |
| POST | `/analyze` | Analyze a single message |
| POST | `/analyze-conversation` | Analyze a full conversation (list of messages) |
| POST | `/analyze/upload` | Upload a Telegram/CSV/TXT export for analysis |
| POST | `/analyze/audio` | Upload an audio file for transcription + analysis |
| POST | `/chat/start` | Start a new chatbot session |
| POST | `/chat/{session_id}/message` | Send a chat message |
| GET | `/chat/{session_id}` | Resume a chat session |
| GET | `/chat/sessions` | List all chat sessions |
| GET | `/conversations` | List all analyzed conversations |
| GET | `/conversations/{id}` | Get a specific conversation's full analysis |
| GET | `/database/status` | Database connectivity check |

------------------------------------------------------------------------

# Single Message Analysis

## `POST /analyze`

### Request

```json
{
  "text": "I feel very hopeless recently."
}
```

### Response (abbreviated)

```json
{
  "privacy": {
    "original_text": "I feel very hopeless recently.",
    "anonymized_text": "I feel very hopeless recently.",
    "detected_entities": {},
    "entity_count": 0,
    "pii_detected": false
  },
  "risk_assessment": {
    "level": "Moderate Risk",
    "score": 0.42
  },
  "report": { "...": "explainability + safety response detail" }
}
```

If personal information is present in the message (a name, email,
phone number, location, or organization), it appears under
`detected_entities`, grouped by category, and is replaced with a
placeholder (e.g. `[PERSON]`) in `anonymized_text` -- the analysis
models only ever see the anonymized version.

------------------------------------------------------------------------

# Conversation Analysis

## `POST /analyze-conversation`

### Request

```json
{
  "messages": [
    "I feel exhausted.",
    "I don't enjoy anything anymore.",
    "Sometimes I think disappearing would be easier."
  ]
}
```

### Response (abbreviated)

```json
{
  "conversation_id": "b1e2...",
  "message_count": 3,
  "timeline": [
    { "message_number": 1, "risk_level": "Mild Concern", "risk_score": 0.18, "privacy": { "...": "..." } }
  ],
  "overall_risk": { "level": "High Risk", "score": 0.71 },
  "risk_trend": "Increasing",
  "privacy_summary": {
    "privacy_guard_active": true,
    "messages_with_pii": 0,
    "total_entities_removed": 0,
    "categories": {}
  },
  "decision": { "final_risk_level": "High Risk", "final_risk_score": 0.71, "requires_human_review": true },
  "explainability": { "...": "reasons behind the decision" },
  "safety_response": { "...": "recommended action / message" }
}
```

This response is persisted (with a real `conversation_id`) and can be
retrieved later via `GET /conversations/{id}`.

------------------------------------------------------------------------

# File / Telegram Export Upload

## `POST /analyze/upload`

`multipart/form-data`, field name `file`. Accepts:

- Telegram Desktop JSON export (`.json`) -- single-chat `{"messages": [...]}` or the "all chats" `{"chats": {"list": [...]}}` wrapper
- Telegram Desktop plain-text export (`.txt`)
- CSV with a `message`/`text` column (`.csv`)

Max size: 10 MB.

The file is parsed into individual messages server-side, then run
through the exact same pipeline as `/analyze-conversation` -- the
response shape is identical, with an added `source_file` field:

```json
{
  "source_file": { "filename": "telegram_export.json", "parsed_message_count": 42 },
  "conversation_id": "...",
  "...": "same shape as /analyze-conversation"
}
```

Service events in Telegram exports (joined chat, pinned message, etc.)
are filtered out automatically.

------------------------------------------------------------------------

# Audio Analysis

## `POST /analyze/audio`

`multipart/form-data`, field name `file`. Accepts `.wav`, `.mp3`,
`.m4a`, `.ogg`, `.webm`, `.flac`, `.aiff`/`.aif`. Max size: 15 MB.

The audio is transcribed (engine chain: OpenAI Whisper API if
configured, free Google Web Speech, then local Whisper), and the
transcript is run through the same pipeline as
`/analyze-conversation` (as a single-message conversation), with an
added `transcription` field:

```json
{
  "transcription": {
    "transcript": "I've been feeling really hopeless lately.",
    "engine": "google_free",
    "source_filename": "voice_note.wav"
  },
  "conversation_id": "...",
  "...": "same shape as /analyze-conversation"
}
```

`engine` is one of `openai_whisper_api`, `google_free`, or
`local_whisper`, depending on which one succeeded.

------------------------------------------------------------------------

# Chatbot

## `POST /chat/start`

No request body.

```json
{ "session_id": "b1e2...", "chatbot_mode": "live" }
```

`chatbot_mode` is `"live"` if `OPENAI_API_KEY` is configured, `"error"`
otherwise (see below).

## `POST /chat/{session_id}/message`

### Request

```json
{ "text": "hey, how are you today?" }
```

### Response (abbreviated)

```json
{
  "session_id": "b1e2...",
  "reply": "I'm doing well, thanks for asking! How about you?",
  "chatbot_mode": "live",
  "message_count": 2,
  "risk_level": "Safe",
  "risk_score": 0.02,
  "risk_trend": "Stable",
  "requires_review": false,
  "privacy_summary": { "...": "..." },
  "tokens_used_this_turn": 63,
  "tokens_used_session_total": 63
}
```

Every message is analyzed by the full safety pipeline in the
background -- `risk_level`/`risk_trend`/`requires_review` reflect the
*whole conversation so far*, not just the latest message. Both the
user's message and the assistant's reply are persisted immediately, so
the session can be resumed later even if it's never explicitly ended.

**If the chatbot can't reach the model** (no API key, invalid key,
timeout, provider outage, or an empty response), `reply` is the
literal string:

```
ارتباط برقرار نشد. لطفاً دوباره تلاش کنید.
```

and `chatbot_mode` is `"error"` -- the failure is surfaced honestly
rather than disguised as a normal reply. The rest of the app (privacy
analysis, file/audio analysis, dashboard) is unaffected by this.

**Rate limits:** max 15 messages per 60 seconds per session, and a
hard cap of 60 messages per session. Exceeding either returns
`429 Too Many Requests` with a `detail` message.

## `GET /chat/{session_id}`

Resumes a session: full message history plus the safety analysis
snapshot as of the last message.

## `GET /chat/sessions`

Lists all chat sessions (id, message count, risk level, timestamps) --
used by the History page.

------------------------------------------------------------------------

# Conversation History

## `GET /conversations`

Lists all persisted conversations (from `/analyze-conversation`,
`/analyze/upload`, and `/analyze/audio`).

## `GET /conversations/{id}`

Returns a specific conversation's full stored analysis (the same
shape as the original `/analyze-conversation` response).

------------------------------------------------------------------------

# Error Handling

Errors follow FastAPI's standard shape:

```json
{ "detail": "description of what went wrong" }
```

| Status | Meaning |
|---|---|
| 404 | Conversation or chat session not found |
| 413 | Uploaded file/audio exceeds the size limit |
| 422 | File couldn't be parsed (unsupported format, empty result) |
| 429 | Chat rate limit exceeded |
| 500 | Unexpected server-side failure |

The chatbot specifically never raises a 500 for a failed model call --
that case returns a normal `200` response with the connection-error
message described above, so a flaky/misconfigured API key degrades
gracefully instead of breaking the chat UI.

------------------------------------------------------------------------

# Security Considerations

- Personal information is anonymized by the Privacy Guard *before*
  reaching any analysis model, including the chatbot's LLM calls.
- `OPENAI_API_KEY` and other secrets are read from environment
  variables (`.env`) -- never hardcoded in source.
- Chat message rate limiting protects against runaway API costs from
  a stuck client or misbehaving script.
- CORS is restricted to the local frontend origin in `backend/app.py`.

------------------------------------------------------------------------

# Future API Improvements

- Live token-by-token streaming for `/chat/{session_id}/message`
  (the OpenAI call already streams; the endpoint currently consumes
  it fully server-side and returns one complete response)
- Authentication / user accounts
- Pagination for `/conversations` and `/chat/sessions`
- Alembic-based database migrations (dependency already included, not
  yet wired in)

------------------------------------------------------------------------

# Conclusion

The API layer connects every input channel this project supports --
typed text, uploaded files, audio, and a live chatbot -- to the same
underlying safety analysis pipeline, while keeping privacy,
explainability, and graceful failure handling consistent across all
of them.
