import json
import uuid

from backend.database.database import SessionLocal
from backend.database.models import ChatMessage, ChatSession


def create_session():
    db = SessionLocal()

    try:
        session_id = str(uuid.uuid4())

        item = ChatSession(
            id=session_id,
            message_count=0,
            risk_level="Safe",
            risk_score=0,
            raw_data=json.dumps({"messages": [], "last_analysis": {}, "analyses": []}, ensure_ascii=False),
        )

        db.add(item)
        db.commit()

        return session_id

    except Exception as e:
        db.rollback()
        print("CHAT SESSION CREATE ERROR:", e)
        return None

    finally:
        db.close()


def append_turn(
    session_id: str,
    user_text: str,
    user_analysis: dict,
    assistant_reply: str,
    analyses: list,
    usage: dict = None,
):
    """
    Persists one full turn (user message + its safety analysis snapshot,
    and the assistant's reply) and updates the session's running state.
    Called after every message, not just at the end of the conversation
    -- so if the user abandons the chat mid-way, everything up to that
    point is already saved and can be resumed.

    `analyses` is the raw per-message analyze() result list (not just
    the display-friendly timeline) -- it's stored so the *next* turn
    can pass it back in as `prior_analyses` and only analyze the newest
    message, instead of re-running the whole conversation's pipeline
    from scratch every time.

    `usage` is the token usage dict from this turn's LLM call (or None
    in mock mode) -- accumulated into the session's running total so
    cost can be monitored per conversation.
    """

    db = SessionLocal()

    try:
        item = db.query(ChatSession).filter(ChatSession.id == session_id).first()

        if not item:
            return None

        state = json.loads(item.raw_data) if item.raw_data else {"messages": [], "last_analysis": {}, "analyses": []}

        messages = state.get("messages", [])

        risk = user_analysis.get("overall_risk", {})

        next_number = len(messages) + 1

        messages.append(
            {
                "role": "user",
                "text": user_text,
                "message_number": next_number,
                "risk_level": risk.get("level", "Unknown"),
                "risk_score": risk.get("score", 0),
            }
        )

        db.add(
            ChatMessage(
                session_id=session_id,
                message_number=next_number,
                role="user",
                text=user_text,
                risk_level=risk.get("level", "Unknown"),
                risk_score=risk.get("score", 0),
            )
        )

        next_number += 1

        messages.append(
            {
                "role": "assistant",
                "text": assistant_reply,
                "message_number": next_number,
            }
        )

        db.add(
            ChatMessage(
                session_id=session_id,
                message_number=next_number,
                role="assistant",
                text=assistant_reply,
            )
        )

        state["messages"] = messages
        state["last_analysis"] = user_analysis
        state["analyses"] = analyses

        decision = user_analysis.get("decision", {})

        item.raw_data = json.dumps(state, ensure_ascii=False)
        item.message_count = len(messages)
        item.risk_level = risk.get("level", item.risk_level)
        item.risk_score = risk.get("score", item.risk_score)
        item.requires_review = decision.get("requires_human_review", False)
        item.total_tokens_used = (item.total_tokens_used or 0) + (
            (usage or {}).get("total_tokens", 0)
        )

        db.commit()

        state["total_tokens_used"] = item.total_tokens_used

        return state

    except Exception as e:
        db.rollback()
        print("CHAT SESSION APPEND ERROR:", e)
        return None

    finally:
        db.close()


def list_sessions():
    db = SessionLocal()

    try:
        items = db.query(ChatSession).order_by(ChatSession.updated_at.desc()).all()

        return [
            {
                "id": item.id,
                "message_count": item.message_count,
                "risk_level": item.risk_level,
                "risk_score": item.risk_score,
                "review_status": item.review_status,
                "total_tokens_used": item.total_tokens_used or 0,
                "created_at": item.created_at.isoformat() if item.created_at else None,
                "updated_at": item.updated_at.isoformat() if item.updated_at else None,
            }
            for item in items
        ]

    finally:
        db.close()


def get_session(session_id: str):
    db = SessionLocal()

    try:
        item = db.query(ChatSession).filter(ChatSession.id == session_id).first()

        if not item:
            return None

        state = json.loads(item.raw_data) if item.raw_data else {"messages": [], "last_analysis": {}, "analyses": []}

        return {
            "session_id": item.id,
            "message_count": item.message_count,
            "risk_level": item.risk_level,
            "risk_score": item.risk_score,
            "requires_review": item.requires_review,
            "review_status": item.review_status,
            "total_tokens_used": item.total_tokens_used or 0,
            "created_at": item.created_at.isoformat() if item.created_at else None,
            "updated_at": item.updated_at.isoformat() if item.updated_at else None,
            "messages": state.get("messages", []),
            "last_analysis": state.get("last_analysis", {}),
            "analyses": state.get("analyses", []),
        }

    finally:
        db.close()
