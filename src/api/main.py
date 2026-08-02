from fastapi import FastAPI

from src.context_memory.memory import ContextMemory
from src.conversation_analyzer.conversation import ConversationAnalyzer
from src.conversation_pattern.pattern import ConversationPatternAnalyzer
from src.decision_engine.decision import DecisionEngine
from src.emotion_evolution.evolution import EmotionEvolutionAnalyzer
from src.explainability.xai import XAIEngine
from src.context_fusion.fusion import ContextFusionEngine
from src.logging.audit import AuditLogger
from src.logging.logger import logger
from src.pipeline.analyzer import MentalHealthAnalyzer
from src.response_generator.generator import SafetyResponseGenerator

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
# DATABASE
# =====================================


@app.get("/database/status")
def database_status():

    return {"database": "connected"}
