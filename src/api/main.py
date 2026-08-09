from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile

from src.context_fusion.fusion import ContextFusionEngine
from src.context_memory.memory import ContextMemory
from src.conversation_analyzer.conversation import ConversationAnalyzer
from src.conversation_import.parser import ConversationParseError, parse_conversation_file
from src.conversation_pattern.pattern import ConversationPatternAnalyzer
from src.decision_engine.decision import DecisionEngine
from src.emotion_evolution.evolution import EmotionEvolutionAnalyzer
from src.explainability.xai import XAIEngine
from src.logging.audit import AuditLogger
from src.logging.logger import logger
from src.pipeline.analyzer import MentalHealthAnalyzer
from src.response_generator.generator import SafetyResponseGenerator
from src.speech_to_text.transcriber import TranscriptionError, transcribe_audio

load_dotenv()

app = FastAPI(title="Mental Health Safety Analyzer", version="1.0")


# =====================================
# Engines
# =====================================


mental_analyzer = MentalHealthAnalyzer()

memory = ContextMemory()

emotion_evolution = EmotionEvolutionAnalyzer()

pattern_analyzer = ConversationPatternAnalyzer()

context_fusion = ContextFusionEngine()

decision_engine = DecisionEngine()

xai_engine = XAIEngine()

response_generator = SafetyResponseGenerator()

audit = AuditLogger()


conversation_analyzer = ConversationAnalyzer(
    analyzer=mental_analyzer,
    emotion_evolution=emotion_evolution,
    pattern_analyzer=pattern_analyzer,
    memory=memory,
    context_fusion=context_fusion,
    decision_engine=decision_engine,
    xai_engine=xai_engine,
    response_generator=response_generator,
)


# =====================================
# HOME
# =====================================


@app.get("/")
def home():

    return {"message": "Mental Health Safety Analyzer API is running"}


# =====================================
# HEALTH
# =====================================


@app.get("/health")
def health():

    return {"status": "healthy"}


# =====================================
# SINGLE MESSAGE
# =====================================


@app.post("/analyze")
def analyze_message(payload: dict):

    # Support multiple clients/tests

    message = payload.get("message") or payload.get("text") or ""

    logger.info(f"Analyzing message: {message}")

    if not message:

        return {"error": "message or text field required"}

    result = mental_analyzer.analyze(message)

    return result


# =====================================
# CONVERSATION
# =====================================


def run_conversation(payload: dict):

    messages = payload.get("messages", [])

    if not messages:

        return {"error": "messages required"}

    logger.info(f"Conversation analysis started: {len(messages)} messages")

    result = conversation_analyzer.analyze_conversation(messages)

    audit.log_event(
        "CONVERSATION_ANALYSIS",
        {
            "conversation_id": result.get("conversation_id"),
            "risk": result.get("decision", {}).get("final_risk_level"),
        },
    )

    return result


# مسیر اصلی جدید تست‌ها


@app.post("/analyze-conversation")
def analyze_conversation(payload: dict):

    return run_conversation(payload)


# مسیر قبلی برای backward compatibility


@app.post("/conversation")
def conversation_pipeline(payload: dict):

    return run_conversation(payload)


# =====================================
# FILE UPLOAD (Telegram export / CSV / TXT)
# =====================================


MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB


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

    audit.log_event(
        "FILE_UPLOAD_ANALYSIS",
        {
            "filename": file.filename,
            "message_count": len(messages),
            "risk": result.get("decision", {}).get("final_risk_level"),
        },
    )

    return result


# =====================================
# SPEECH-TO-TEXT (audio upload)
# =====================================


MAX_AUDIO_SIZE = 15 * 1024 * 1024  # 15 MB


@app.post("/analyze/audio")
async def analyze_audio(file: UploadFile = File(...)):
    """
    Audio -> transcript -> the same single-message pipeline used by
    /analyze. The transcript and which engine produced it are included
    in the response so the caller can see exactly what was recognized.
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

    # Routed through the conversation pipeline (as a single-message
    # conversation), consistent with /analyze/upload, so the response
    # shape is uniform across every analysis entry point.
    result = conversation_analyzer.analyze_conversation([transcription["text"]])

    result["transcription"] = {
        "transcript": transcription["text"],
        "engine": transcription["engine"],
        "source_filename": file.filename,
    }

    audit.log_event(
        "AUDIO_ANALYSIS",
        {
            "filename": file.filename,
            "engine": transcription["engine"],
        },
    )

    return result


# =====================================
# DATABASE
# =====================================


@app.get("/database/status")
def database_status():

    return {"database": "connected"}
