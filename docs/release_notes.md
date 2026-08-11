# Release Notes

## Version 1.2.1

Release Date

August 2026

------------------------------------------------------------------------

## Overview

Bug-fix and hardening release on top of 1.2.0 -- no new user-facing
features, but two correctness/privacy issues found during review are
fixed, and the Persistent History capability that already existed in
1.2.0's database layer is now properly documented and surfaced in the
UI.

------------------------------------------------------------------------

# What's New in Version 1.2.1

## CI Reliability

- Chat tests no longer depend on the absence of a real `OPENAI_API_KEY`
  in the environment -- `tests/conftest.py` now locks the variable to
  an empty value at test-collection time, so `load_dotenv()` in
  `backend/app.py` can never pull a working key from a local/CI `.env`
  into the test session. Fixes a flaky/incorrect
  `chatbot_mode == "error"` assertion in `test_chat.py`.
- The chatbot's system prompt was reworded (semantics unchanged) so
  its required safety language ("do not diagnose", deferring to the
  safety analyzer, encouraging human support) is asserted verbatim by
  `test_llm_client.py`, matching the intended safety contract.

## Privacy Fix -- Chat Persistence

- The live chat endpoint was anonymizing user messages before sending
  them to the LLM, but persisting the **raw** (pre-anonymization) text
  to the database. Personal information that was correctly kept out of
  the LLM call was still landing at rest in `chat_messages` /
  `chat_sessions.raw_data`. Fixed: the same anonymized text sent to the
  LLM is now what gets persisted. Covered by a new regression test,
  `test_chat_persists_anonymized_text_not_raw_pii`.

## Persistent Conversation & Safety History -- Documented and Surfaced

- Added `docs/architecture.md` §14 describing the database tables
  (`Conversation`, `ChatSession`, `ChatMessage`), the retrieval
  endpoints (`GET /conversations`, `GET /conversations/{id}`,
  `GET /chat/sessions`, `GET /chat/{id}`), and the privacy-by-design
  storage behavior -- this persistence layer existed in the code since
  1.2.0 but wasn't previously documented as a standalone capability.
- New **Chat History** page in the frontend (`/chat-history`), listing
  saved chat sessions via `GET /chat/sessions` -- mirrors the existing
  file/audio `History` page, which only covered `/conversations`.
- Clarified in `src/context_memory/memory.py` that this module (and
  `src/database/`) is an earlier, unwired persistence prototype, not
  the persistence layer the running app actually uses
  (`backend/database/`).

## Housekeeping

- Removed stray `.patch` files that had been accidentally committed to
  the repository root.
- Test count corrected across README/docs: 67 automated tests (66 run
  and pass; 1 auto-skips without the spaCy NER model installed),
  up from the previously documented 65 -- the count had drifted out of
  sync with the code in the 1.2.0 release.

------------------------------------------------------------------------

## Version 1.2.0

Release Date

August 2026

------------------------------------------------------------------------

## Overview

Version 1.2.0 extends the safety analysis pipeline to every way a
conversation can enter the system -- not just typed text -- and adds
a live conversational interface with the same background safety
monitoring as every other input channel.

------------------------------------------------------------------------

# What's New in Version 1.2.0

## Privacy Guard -- NER-Based Detection

- Upgraded from regex-only to a combined regex + NER (spaCy
  `en_core_web_sm`) detection layer
- Now detects person names, locations, and organizations in addition
  to emails, phone numbers, URLs, and IPs
- Falls back to regex-only detection automatically if the NER model
  isn't available in a given environment, instead of failing
- Full Privacy Panel added to the dashboard UI, showing exactly what
  was detected and anonymized per conversation

## Conversation File / Telegram Export Import

- New `POST /analyze/upload` endpoint
- Parses Telegram Desktop JSON exports (single-chat and the "all
  chats" wrapper), Telegram plain-text exports, and CSV files into the
  same internal message format used everywhere else
- Service events (joined chat, pinned message, etc.) filtered out
  automatically
- Duplicate message text across a conversation is analyzed once and
  cached, instead of re-running the full pipeline for every repeat

## Speech-to-Text

- New `POST /analyze/audio` endpoint, plus in-browser microphone
  recording in the dashboard
- Three-tier engine chain: OpenAI Whisper API (if configured) → free
  Google Web Speech (default) → local Whisper (offline fallback)
- Transcript runs through the exact same safety pipeline as typed text

## AI Chatbot with Background Safety Monitoring

- New `/chat/start`, `/chat/{session_id}/message`, `/chat/{session_id}`,
  and `/chat/sessions` endpoints, plus a full Chat page in the
  dashboard
- Every message is analyzed by the safety pipeline in the background
  while the person has a normal conversation with the assistant
- Uses OpenAI's Responses API, with model/provider/temperature/timeout
  fully configurable via environment variables (works with any
  OpenAI-compatible endpoint)
- Conversation history is windowed before being sent to the model, so
  cost and latency don't grow unbounded as a chat gets longer
- Every turn is persisted immediately, so a session can be resumed
  exactly where it was left
- Failures (missing/invalid key, timeout, provider outage) return an
  explicit "connection failed" message rather than a disguised
  fallback reply
- Per-session token usage tracking, and rate limiting (15
  messages/minute, 60 messages/session cap) to protect against
  runaway API costs

## Bug Fixes

- Fixed a database schema collision: two separate SQLite modules
  (`src/database` and `backend/database`) were writing to the same
  physical file with different schemas, causing intermittent `no such
  column` errors depending on which ran first
- Fixed the conversation analyzer re-analyzing every prior message on
  every new call instead of just the new one, which doubled (or, for
  growing chats, multiplied) pipeline latency unnecessarily
- Fixed the chatbot silently falling back to a generic reply on every
  real API call for GPT-5.x-family models, caused by using the legacy
  `max_tokens` parameter where those models require
  `max_completion_tokens`

------------------------------------------------------------------------

## Version 1.1.0

Release Date

July 2026

------------------------------------------------------------------------

## Overview

Version 1.1.0 represents the current stable research release of the Mental Health Safety Analyzer.

This release focuses on improving software engineering quality, documentation, repository organization, automated testing, and development workflow while preserving the complete AI safety analysis pipeline.

------------------------------------------------------------------------

# What's New in Version 1.1.0

## Software Engineering Improvements

- Improved project documentation
- Added comprehensive GitHub documentation
- Added contribution guidelines
- Added security policy
- Added code of conduct
- Added issue templates
- Added pull request template
- Improved repository organization

------------------------------------------------------------------------

## Continuous Integration

Implemented automated GitHub Actions workflows including:

- Automated testing
- Code quality verification
- Continuous Integration
- Repository health monitoring

------------------------------------------------------------------------

## Code Quality

Integrated professional development tools:

- Ruff
- Black
- isort

Ensuring a consistent and maintainable codebase.

------------------------------------------------------------------------

## Documentation

Completed technical documentation covering:

- System architecture
- AI pipeline
- Privacy and safety
- Models overview
- Testing strategy
- API documentation
- Future improvements
- Release documentation

------------------------------------------------------------------------

# Core AI Capabilities

The current release includes:

- Emotion Analysis
- Distress Detection
- Crisis Detection
- Conversation Pattern Analysis
- Context Memory
- Context Fusion Engine
- Explainable AI
- Privacy Guard
- Safe Response Generation
- Final Safety Decision Engine

------------------------------------------------------------------------

# Risk Assessment

Supported safety levels:

- Safe
- Mild Concern
- Moderate Risk
- High Risk
- Critical Emergency

------------------------------------------------------------------------

# Privacy Protection

Current privacy features include:

- Personal information detection
- Anonymous conversation processing
- Sensitive information protection

------------------------------------------------------------------------

# Explainable AI

The system generates explainable outputs including:

- Risk Level
- Confidence Score
- Safety Indicators
- Decision Explanation

------------------------------------------------------------------------

# API

The current version supports:

- Conversation Analysis API
- JSON Responses
- API Testing

------------------------------------------------------------------------

# Testing

Current testing status:

- ✅ 65 / 65 Tests Passed (1 additional test auto-skips if the spaCy
  NER model isn't installed in a given environment)

Validated modules include:

- API (including file upload, audio, and chat endpoints)
- AI Pipeline
- Risk Assessment
- Privacy Guard (regex + NER)
- Conversation File / Telegram Import Parser
- Speech-to-Text Transcriber
- Chatbot (LLM client, rate limiting, session persistence)
- Explainability
- Database
- Full Workflow

------------------------------------------------------------------------

# Technology Stack

Main technologies:

- Python
- FastAPI
- Transformers (emotion model)
- spaCy + Presidio (Privacy Guard NER)
- SpeechRecognition, faster-whisper (speech-to-text)
- OpenAI SDK (Responses API -- chatbot + Whisper API)
- Scikit-learn
- Pandas
- NumPy
- SQLAlchemy
- PyTest
- React, TypeScript, Vite, Tailwind CSS (frontend)

------------------------------------------------------------------------

# Current Limitations

The current version is a research prototype.

It:

- Does not provide medical diagnosis.
- Does not replace psychologists or psychiatrists.
- Requires human supervision for medium and high-risk conversations.
- Requires additional validation before real-world deployment.

------------------------------------------------------------------------

# Future Vision

The architecture of the project has been designed to support future clinical integration.

Future versions may assist psychologists by generating explainable conversation summaries, emotional trend analysis, long-term risk monitoring, and AI-assisted clinical reports while ensuring that all diagnosis and treatment decisions remain entirely under human supervision.

------------------------------------------------------------------------

# Planned Improvements

Future development includes:

- Live token-by-token streaming of chatbot replies to the UI
- Fine-tuned distress/crisis models (currently rule/lexicon-based)
- Alembic-based database migrations (dependency already included, not
  yet wired in)
- Larger benchmark datasets and clinical validation
- Longitudinal conversation analysis
- Explainable clinician reports
- Enterprise / hosted deployment

------------------------------------------------------------------------

# Project Status

Current Status

Stable Research Prototype

The project provides a modular foundation for developing responsible, explainable, and privacy-aware AI systems for mental health conversation safety analysis and future clinical decision support.