# Mental Health Safety Analyzer

![Python](https://img.shields.io/badge/Python-3.10-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Release](https://img.shields.io/github/v/release/AziziArya/ExpoChallenge_AryaAzizi)
![Tests](https://img.shields.io/badge/Tests-65%2F65-success)
![CI](https://github.com/AziziArya/ExpoChallenge_AryaAzizi/actions/workflows/tests.yml/badge.svg)
![Code Quality](https://github.com/AziziArya/ExpoChallenge_AryaAzizi/actions/workflows/code_quality.yml/badge.svg)

An AI-powered mental health conversation safety analysis system designed to detect emotional distress, crisis signals, conversation deterioration, and generate explainable safety decisions -- across typed text, uploaded conversation exports, voice recordings, and a live AI chatbot.

This research prototype focuses on privacy-aware AI assistance for mental health safety monitoring. It supports human review and **does not replace professional mental health care**.

---

# What's Inside

| Capability | Description |
|---|---|
| **Safety Analysis Pipeline** | Emotion, distress, and crisis detection combined into an explainable, multi-level risk decision |
| **Privacy Guard** | Detects and anonymizes personal information (names, emails, phone numbers, locations, organizations) using NER (spaCy) + regex, *before* any text reaches the analysis models |
| **Conversation File Import** | Upload a Telegram chat export (JSON/TXT) or a CSV and get the same full safety analysis, message by message |
| **Speech-to-Text** | Upload an audio file or record from your microphone -- the transcript runs through the exact same safety pipeline as typed text |
| **AI Chatbot with Background Safety Monitoring** | A normal, warm conversational chatbot that -- transparently in the background -- runs every message through the safety pipeline, tracks risk over the conversation, and persists the session so it can be resumed |

---

# Project Status

- ✅ Backend Architecture
- ✅ AI Pipeline (Emotion / Distress / Crisis / Context Fusion / Decision / XAI)
- ✅ Privacy Guard (NER + regex)
- ✅ File / Telegram Export Analysis
- ✅ Speech-to-Text (file upload + microphone recording)
- ✅ AI Chatbot with real-time safety monitoring
- ✅ Automated Testing (65 tests)
- ✅ Frontend Dashboard
- ✅ Interactive Demo

---

# Documentation

- `docs/architecture.md` -- system architecture and data flow
- `docs/api_documentation.md` -- full endpoint reference
- `docs/privacy_and_safety.md` -- Privacy Guard design and safety principles
- `docs/models_and_ai.md` -- which models power each analysis stage
- `docs/pipeline.md` -- how a message moves through the pipeline
- `docs/release_notes.md` -- version history
- `docs/design/` -- UX specifications and frontend architecture

---

# Installation

```bash
git clone https://github.com/AziziArya/ExpoChallenge_AryaAzizi.git
cd ExpoChallenge_AryaAzizi

pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

**System requirement:** [ffmpeg](https://ffmpeg.org/download.html) must be installed and on your PATH -- it's used to convert uploaded/recorded audio before transcription.
- Windows: `winget install ffmpeg` (or download from the site above and add it to PATH)
- macOS: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg`

## Environment variables (`.env`)

A `.env` file is included at the project root with the values needed to run the chatbot against a real model.

> **Note on the included key:** for this competition submission, the `.env` file (including a real, budget-capped OpenAI API key) is committed intentionally so judges can run the AI chatbot without needing to obtain their own key -- this was a deliberate decision, not an oversight. If you fork this repository for anything beyond evaluating this submission, **replace the key with your own and remove it from version control** (see `.env.example` for the template). `.env.example` documents every variable if you need to set up your own key elsewhere.

Every feature except the chatbot works fully with no key at all -- Privacy Guard, file/Telegram analysis, and speech-to-text have no external API dependency.

If the chatbot's key is ever missing, invalid, rate-limited, or the provider is down, the chatbot responds with a clear "connection failed" message instead of crashing -- the rest of the app is unaffected either way.

## Run the backend

```bash
uvicorn backend.app:app --reload
```

Backend API: `http://127.0.0.1:8000`
Interactive API docs: `http://127.0.0.1:8000/docs`

The database (`mental_health.db`) is created automatically on first run. If you ever change the database models and hit a `no such column` error, delete `mental_health.db` and restart the server -- SQLite table schemas aren't auto-migrated.

## Run the frontend

```bash
cd mhsa-frontend-source/mhsa-frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

# Trying the Chatbot

1. Start both the backend and frontend as above (with `.env` present -- it already is, in this repo).
2. Open `http://localhost:5173/chat` (or click **Chat** in the sidebar).
3. Type a message -- the assistant replies naturally, and a live panel shows the current risk level, trend, and Privacy Guard status, updating after every message.
4. Try a message expressing distress (e.g. *"I've been feeling really hopeless lately"*) and watch the risk indicator respond -- the assistant's tone also adapts (more supportive, encourages reaching out to someone) without ever announcing that it detected anything.
5. Leaving and returning to a chat resumes exactly where you left off -- every message is saved immediately, not just at the end.

To confirm the chatbot is using the real API (not the "connection failed" fallback), send a message and check that the reply is a full, natural sentence rather than the Persian fallback text `ارتباط برقرار نشد. لطفاً دوباره تلاش کنید.`.

---

# Trying File / Telegram Upload Analysis

1. Go to **New Analysis** → **Upload**.
2. Upload a Telegram chat export (`.json` from *Export chat history*, or `.txt`), or a `.csv` with a `message`/`text` column.
3. The system parses it into individual messages and runs the full pipeline on the whole conversation, exactly like pasted text.

# Trying Speech-to-Text

1. Go to **New Analysis** → **Audio**.
2. Either upload an audio file (`.wav`, `.mp3`, `.m4a`, `.ogg`, `.webm`, `.flac`) or click **Record from microphone**.
3. The recording is transcribed, then analyzed through the same safety pipeline as typed text.

---

# Running Tests

```bash
pytest -v
```

Current status: **65 / 65 tests passed** (1 additional test auto-skips if the spaCy NER model isn't installed in a given environment -- Privacy Guard falls back to regex-only detection in that case rather than failing).

All tests run without needing `OPENAI_API_KEY` set -- the chatbot's tests use a mocked LLM client.

---

## API Overview

| Endpoint | Purpose |
|---|---|
| `POST /analyze` | Analyze a single message |
| `POST /analyze-conversation` | Analyze a full conversation (list of messages) |
| `POST /analyze/upload` | Upload a Telegram/CSV/TXT export for analysis |
| `POST /analyze/audio` | Upload an audio file for transcription + analysis |
| `POST /chat/start` | Start a new chatbot session |
| `POST /chat/{session_id}/message` | Send a chat message (returns the reply + live safety analysis) |
| `GET /chat/{session_id}` | Resume a chat session |
| `GET /chat/sessions` | List all chat sessions |
| `GET /conversations` | List all analyzed conversations |
| `GET /conversations/{id}` | Get a specific conversation's full analysis |

Full request/response schemas: `docs/api_documentation.md` or `http://127.0.0.1:8000/docs`.

Example -- analyze a conversation:

```http
POST /analyze-conversation
```

```json
{
  "messages": [
    "I feel exhausted.",
    "I don't enjoy anything anymore.",
    "Sometimes I think disappearing would be easier."
  ]
}
```

Returns timeline analysis, overall risk, privacy summary (detected/anonymized PII), explainability report, and recommended actions.

---

## Project Structure

```
backend/            FastAPI application, database models, chat + conversation services
src/
  pipeline/          Core single-message analysis pipeline
  conversation_analyzer/  Multi-message conversation analysis + risk trend
  privacy_guard/      NER (spaCy) + regex PII detection and anonymization
  conversation_import/ Telegram/CSV/TXT export parsing
  speech_to_text/     Audio transcription (OpenAI Whisper API / free Google / local Whisper)
  chatbot/            LLM client (OpenAI Responses API) + rate limiting
  emotion_analyzer/, distress_detector/, crisis_detector/, ...  individual analysis modules
tests/              65 automated tests
docs/               Architecture, API, and design documentation
mhsa-frontend-source/  React dashboard (includes the Chat page)
```

---

# Technology Stack

**Backend:** Python 3.10, FastAPI, SQLAlchemy, PyTest
**AI / NLP:** Transformers (emotion model), spaCy + Presidio (Privacy Guard NER), scikit-learn
**Speech-to-Text:** OpenAI Whisper API, SpeechRecognition (free), faster-whisper (local fallback)
**Chatbot:** OpenAI Responses API (provider-agnostic -- works with any OpenAI-compatible endpoint, e.g. Gemini)
**Frontend:** React, TypeScript, Vite, Tailwind CSS

---

# System Architecture

```
Conversation Input (typed / uploaded file / audio / chat)
        |
Privacy Guard  (NER + regex anonymization)
        |
Emotion Analyzer -- Distress Detector -- Crisis Detector
        |
Conversation Pattern Analysis -- Context Memory -- Context Fusion
        |
Risk Decision Engine
        |
Explainable AI (XAI) Layer
        |
Safety Response Generator
        |
Dashboard / Chat UI
```

The final risk assessment combines outputs from multiple analysis modules rather than relying on a single model. See `docs/architecture.md` for full detail.

---

# Research Focus

This project investigates AI-assisted mental health conversation safety by combining multiple NLP analysis stages into a single explainable pipeline, while extending the same safety layer to every way a person's words can enter the system -- typed, uploaded, spoken, or a live conversation with an assistant.

---

# Future Clinical Vision

Beyond conversation safety analysis, the architecture of this project has been designed with future clinical integration in mind.

A possible future deployment scenario allows patients to interact with the AI assistant between therapy sessions while the system continuously analyzes emotional trends, distress progression, crisis indicators, and long-term conversation patterns.

Instead of replacing psychologists, the platform is intended to generate explainable conversation summaries and safety reports that help mental health professionals better understand a patient's condition before each session.

The final diagnosis, treatment decisions, and clinical responsibility always remain under human supervision.

---

# Limitations

This system:

- Does **not** provide medical diagnosis.
- Does **not** replace psychologists, psychiatrists, or licensed mental health professionals.
- Is designed solely as an AI-assisted conversation safety analysis and decision-support tool.
- Requires human review and professional judgment for medium and high-risk conversations.
- The chatbot's tone and framing follow the safety analyzer's risk assessment -- it does not independently diagnose or classify risk on its own.

---

# Repository

GitHub Repository: https://github.com/AziziArya/ExpoChallenge_AryaAzizi
Latest Release: https://github.com/AziziArya/ExpoChallenge_AryaAzizi/releases

---

# Author

Arya Azizi
GitHub: https://github.com/AziziArya
Portfolio: https://aryahub.ir

---

# Challenge Submission

This repository contains my submission for the Innoverse Programming Challenge.

The project provides an end-to-end AI-assisted Mental Health Safety Analysis platform including:

- Backend risk analysis engine with explainable, multi-signal decisions
- Privacy Guard (NER-based PII anonymization)
- Conversation file / Telegram export analysis
- Speech-to-text analysis (upload or live microphone recording)
- AI chatbot with continuous, transparent background safety monitoring
- REST API
- Interactive React dashboard with a live chat interface
- Human review workflow

The system was designed as a decision-support prototype and does not replace professional mental health services.

# License

MIT License

Copyright © 2026 Arya Azizi
