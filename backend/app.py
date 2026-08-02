import sys
import os
import json


# Add project root to python path
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

sys.path.append(BASE_DIR)



from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel



from backend.database.database import (
    Base,
    engine
)


from backend.services.conversation_service import (
    save_conversation,
    get_all_conversations,
    get_conversation
)



from src.pipeline.analyzer import MentalHealthAnalyzer
from src.emotion_evolution.evolution import EmotionEvolutionAnalyzer
from src.conversation_pattern.pattern import ConversationPatternAnalyzer
from src.context_memory.memory import ConversationMemory
from src.context_fusion.fusion import ContextFusionEngine
from src.conversation_analyzer.conversation import ConversationAnalyzer
from src.decision_engine.decision import DecisionEngine
from src.explainability.xai import XAIEngine
from src.response_generator.generator import ResponseGenerator



# ===============================
# DATABASE INIT
# ===============================

Base.metadata.create_all(
    bind=engine
)



# ===============================
# APP
# ===============================

app = FastAPI(
    title="Mental Health Safety Analyzer",
    description="AI system for mental health conversation safety analysis",
    version="1.0"
)



# ===============================
# CORS
# ===============================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)





# ===============================
# AI MODULES
# ===============================


analyzer = MentalHealthAnalyzer()


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

    response_generator=response_generator

)





# ===============================
# REQUEST MODELS
# ===============================


class TextRequest(BaseModel):

    text: str




class ConversationRequest(BaseModel):

    messages: list[str]





# ===============================
# HOME
# ===============================


@app.get("/")
def home():

    return {

        "message":
        "Mental Health Safety Analyzer API is running"

    }





# ===============================
# SINGLE TEXT ANALYSIS
# ===============================


@app.post("/analyze")
def analyze_text(
    request: TextRequest
):

    result = analyzer.analyze(
        request.text
    )


    return result["report"]






# ===============================
# CONVERSATION ANALYSIS
# ===============================


@app.post("/analyze-conversation")
def analyze_conversation(
    request: ConversationRequest
):


    result = conversation_analyzer.analyze_conversation(

        request.messages

    )


    save_conversation(
        result
    )


    return result





# ===============================
# GET ALL CONVERSATIONS
# ===============================


@app.get("/conversations")
def conversations():


    items = get_all_conversations()



    return [

        {

            "id":
            item.id,


            "message_count":
            item.message_count,


            "risk_level":
            item.risk_level,


            "risk_score":
            item.risk_score,


            "confidence":
            item.confidence,


            "created_at":
            item.created_at

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
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )


    # اگر خروجی dict بود
    if isinstance(item, dict):

        return item


    # اگر خروجی SQLAlchemy Model بود
    return {

        "id": item.id,

        "message_count":
            item.message_count,

        "risk_level":
            item.risk_level,

        "risk_score":
            item.risk_score,

        "confidence":
            item.confidence,

        "requires_review":
            item.requires_review,

        "review_status":
            item.review_status,

        "recommendation":
            item.recommendation,

        "trend":
            item.trend,

        "created_at":
            item.created_at

    }