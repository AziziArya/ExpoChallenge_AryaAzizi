import os
import sys

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.database.database import Base, engine
from backend.services.chat_service import append_turn, create_session, get_session, list_sessions
from backend.services.conversation_service import (
    get_all_conversations,
    get_conversation,
    save_conversation,
)
from src.chatbot import llm_client, rate_limiter
from src.context_fusion.fusion import ContextFusionEngine
from src.context_memory.memory import ConversationMemory
from src.conversation_analyzer.conversation import ConversationAnalyzer
from src.conversation_import.parser import ConversationParseError, parse_conversation_file
from src.conversation_pattern.pattern import ConversationPatternAnalyzer
from src.decision_engine.decision import DecisionEngine
from src.emotion_evolution.evolution import EmotionEvolutionAnalyzer
from src.explainability.xai import XAIEngine
from src.logging.audit import AuditLogger
from src.pipeline.analyzer import MentalHealthAnalyzer
from src.response_generator.generator import ResponseGenerator
from src.speech_to_text.transcriber import TranscriptionError, transcribe_audio

# Loads variables from a local .env file (see .env.example) into the
# process environment, if one exists -- so OPENAI_API_KEY etc. can be
# configured without exporting shell variables manually. Safe to call
# even with no .env present; everything just falls back to mock mode.
load_dotenv()

# Add project root to python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

sys.path.append(BASE_DIR)


# ===============================
# DATABASE INIT
# # ===============================

Base.metadata.create_all(bind=engine)


# ===============================
# APP
# ===============================

app = FastAPI(
    title="Mental Health Safety Analyzer",
    description="AI system for mental health conversation safety analysis",
    version="1.0",
)


# ===============================
# CORS
# ===============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===============================
# AI MODULES
# ===============================


analyzer = MentalHealthAnalyzer()
audit = AuditLogger()


emotion_evolution = EmotionEvolutionAnalyzer()


pattern_analyzer = ConversationPatternAnalyzer()


memory = ConversationMemory()


context_fusion = ContextFusionEngine()


decision_engine = DecisionEngine()


xai_engine = XAIEngine()


response_generator = ResponseGenerator()


conversation_analyzer = ConversationAnalyzer(
    analyzer,
    emotion_evolution=emotion_evolution,
    pattern_analyzer=pattern_analyzer,
    memory=memory,
    context_fusion=context_fusion,
    decision_engine=decision_engine,
    xai_engine=xai_engine,
    response_generator=response_generator,
)


# ===============================
# REQUEST MODELS
# ===============================


class TextRequest(BaseModel):

    text: str


class ConversationRequest(BaseModel):

    messages: list[str]


class ChatMessageRequest(BaseModel):

    text: str


# ===============================
# HOME
# ===============================


@app.get("/")
def home():

    return {"message": "Mental Health Safety Analyzer API is running"}


# ===============================
# SINGLE TEXT ANALYSIS
# ===============================


@app.post("/analyze")
def analyze_text(request: TextRequest):

    result = analyzer.analyze(request.text)

    report = result["report"]

    # Privacy Guard results (original/anonymized text + detected PII
    # entities) are surfaced alongside the safety report so the
    # frontend can render the Privacy panel.
    report["privacy"] = result.get("privacy", {})

    return report


# ===============================
# CONVERSATION ANALYSIS
# ===============================


@app.post("/analyze-conversation")
def analyze_conversation(request: ConversationRequest):

    result = conversation_analyzer.analyze_conversation(request.messages)

    save_conversation(result)

    return result


# ===============================
# FILE UPLOAD (Telegram export / CSV / TXT)
# ===============================


MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB, matches frontend limit


@app.post("/analyze/upload")
async def analyze_uploaded_file(file: UploadFile = File(...)):

    raw = await file.read()

    if len(raw) > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File too large. Maximum upload size is 10 MB.",
        )

    try:
        messages = parse_conversation_file(file.filename or "", raw)

    except ConversationParseError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    result = conversation_analyzer.analyze_conversation(messages)

    result["source_file"] = {
        "filename": file.filename,
        "parsed_message_count": len(messages),
    }

    save_conversation(result)

    return result


# ===============================
# SPEECH-TO-TEXT (audio upload)
# ===============================


MAX_AUDIO_SIZE = 15 * 1024 * 1024  # 15 MB


@app.post("/analyze/audio")
async def analyze_audio(file: UploadFile = File(...)):
    """
    Audio -> transcript -> the same single-message MHSA pipeline used
    by /analyze (privacy, emotion, distress, crisis, explainability).
    The transcript and which engine produced it are included in the
    response so the UI can show what was actually recognized.
    """

    raw = await file.read()

    if len(raw) > MAX_AUDIO_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Audio file too large. Maximum upload size is 15 MB.",
        )

    try:
        transcription = transcribe_audio(raw, file.filename or "")

    except TranscriptionError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    # Routed through the SAME conversation pipeline (and persisted the
    # same way) as /analyze-conversation and /analyze/upload, instead
    # of the single-message /analyze pipeline. This is required for
    # the returned id to actually exist when the frontend immediately
    # navigates to /dashboard/{id} and fetches GET /conversations/{id}
    # -- a single-message result was never saved to the database, so
    # that lookup would 404 ("conversation not found").
    result = conversation_analyzer.analyze_conversation([transcription["text"]])

    result["transcription"] = {
        "transcript": transcription["text"],
        "engine": transcription["engine"],
        "source_filename": file.filename,
    }

    save_conversation(result)

    return result


# ===============================
# CHATBOT (with background safety monitoring)
# ===============================


@app.post("/chat/start")
def chat_start():
    """
    Starts a new chat session. Returns a session_id that every
    subsequent message in this conversation is sent against.
    """

    session_id = create_session()

    if not session_id:
        raise HTTPException(status_code=500, detail="Could not start a new chat session.")

    return {
        "session_id": session_id,
        "chatbot_mode": "live" if llm_client.is_live() else "error",
    }


@app.get("/chat/sessions")
def chat_sessions():
    """Lists all chat sessions (for the History page)."""

    return list_sessions()


MAX_MESSAGES_PER_SESSION = 60  # generous for a demo conversation, cheap safety net against runaway usage


@app.post("/chat/{session_id}/message")
def chat_message(session_id: str, request: ChatMessageRequest):
    """
    One chat turn does two things with the same user message:

    1. Sends a *windowed* conversation history to the LLM for a normal,
       in-character reply. The text sent to the LLM is the anonymized
       version (PII already stripped by Privacy Guard) -- personal
       information the user typed never leaves to the external API.
    2. Runs the *entire* user-message history (old + new) back through
       the same MHSA conversation pipeline used everywhere else in the
       app, so risk level/trend/timeline stay accurate turn by turn --
       not just for this one message in isolation. Only the newest
       message actually re-runs the model pipeline; earlier messages
       reuse their already-computed results (see
       ConversationAnalyzer.analyze_conversation_with_state).

    Both the user's message and the assistant's reply are persisted
    immediately, so a session can always be resumed exactly where the
    user left it, even if they never send another message.
    """

    session = get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    try:
        rate_limiter.check(session_id)
    except rate_limiter.RateLimitExceeded as exc:
        raise HTTPException(
            status_code=429,
            detail=f"You're sending messages too quickly. Please wait {exc.retry_after_seconds:.0f}s and try again.",
        ) from exc

    if session["message_count"] >= MAX_MESSAGES_PER_SESSION:
        raise HTTPException(
            status_code=429,
            detail=(
                f"This chat session has reached its {MAX_MESSAGES_PER_SESSION}-message "
                "limit. Please start a new chat to continue."
            ),
        )

    prior_user_texts = [m["text"] for m in session["messages"] if m["role"] == "user"]

    all_user_texts = prior_user_texts + [request.text]

    user_analysis, analyses = conversation_analyzer.analyze_conversation_with_state(
        all_user_texts, session.get("analyses")
    )

    current_risk_level = user_analysis.get("overall_risk", {}).get("level")

    # Anonymized text per user turn, in the same order as prior_user_texts
    # + the new message -- `analyses` is guaranteed to be in that order.
    anonymized_user_texts = [
        a.get("privacy", {}).get("anonymized_text", text)
        for a, text in zip(analyses, all_user_texts)
    ]

    prior_assistant_texts = [m["text"] for m in session["messages"] if m["role"] == "assistant"]

    llm_history = []
    for i, user_text in enumerate(anonymized_user_texts[:-1]):
        llm_history.append({"role": "user", "content": user_text})
        if i < len(prior_assistant_texts):
            llm_history.append({"role": "assistant", "content": prior_assistant_texts[i]})
    llm_history.append({"role": "user", "content": anonymized_user_texts[-1]})

    reply_result = llm_client.generate_reply(llm_history, risk_level=current_risk_level)

    usage = reply_result.get("usage", {})
    if usage.get("total_tokens"):
        audit.log_event(
            "CHAT_TOKEN_USAGE",
            {
                "session_id": session_id,
                "mode": reply_result["mode"],
                **usage,
            },
        )

    # Privacy-by-design: persist the anonymized text, not the raw
    # message. anonymized_user_texts[-1] is this turn's user message
    # already run through the Privacy Guard (same text sent to the
    # LLM above) -- storing anything else would put raw PII at rest
    # in the database even though it was kept out of the LLM call.
    updated_state = append_turn(
        session_id,
        user_text=anonymized_user_texts[-1],
        user_analysis=user_analysis,
        assistant_reply=reply_result["reply"],
        analyses=analyses,
        usage=usage,
    )

    if updated_state is None:
        raise HTTPException(status_code=500, detail="Could not save this chat turn.")

    risk = user_analysis.get("overall_risk", {})
    decision = user_analysis.get("decision", {})

    return {
        "session_id": session_id,
        "reply": reply_result["reply"],
        "chatbot_mode": reply_result["mode"],
        "message_count": len(updated_state["messages"]),
        "risk_level": risk.get("level", "Unknown"),
        "risk_score": risk.get("score", 0),
        "risk_trend": user_analysis.get("risk_trend", "Stable"),
        "requires_review": decision.get("requires_human_review", False),
        "privacy_summary": user_analysis.get("privacy_summary", {}),
        "tokens_used_this_turn": usage.get("total_tokens", 0),
        "tokens_used_session_total": updated_state.get("total_tokens_used", 0)
        if isinstance(updated_state, dict)
        else None,
        "explanation": user_analysis.get("explainability", {}),
        "recommendation": user_analysis.get("safety_response", {}),
    }


@app.get("/chat/{session_id}")
def chat_get(session_id: str):
    """
    Resumes a chat session: full message history plus the safety
    analysis snapshot as of the last message sent.
    """

    session = get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    return session


@app.get("/conversations")
def conversations():

    items = get_all_conversations()

    return [
        {
            "id": item.id,
            "message_count": item.message_count,
            "risk_level": item.risk_level,
            "risk_score": item.risk_score,
            "confidence": item.confidence,
            "created_at": item.created_at,
        }
        for item in items
    ]


# ===============================
# GET CONVERSATION DETAIL
# ===============================


@app.get("/conversations/{conversation_id}")
def conversation_detail(conversation_id: str):

    item = get_conversation(conversation_id)

    if item is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # اگر خروجی dict بود
    if isinstance(item, dict):

        return item

    # اگر خروجی SQLAlchemy Model بود
    return {
        "id": item.id,
        "message_count": item.message_count,
        "risk_level": item.risk_level,
        "risk_score": item.risk_score,
        "confidence": item.confidence,
        "requires_review": item.requires_review,
        "review_status": item.review_status,
        "recommendation": item.recommendation,
        "trend": item.trend,
        "created_at": item.created_at,
    }
