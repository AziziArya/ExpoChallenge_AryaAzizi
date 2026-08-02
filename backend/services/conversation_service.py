import json

from backend.database.database import SessionLocal
from backend.database.models import Conversation


def save_conversation(data: dict):

    db = SessionLocal()

    try:

        risk = data.get("overall_risk", {})

        decision = data.get("decision", {})

        safety = data.get("safety_response", {})

        item = Conversation(
            id=data.get("conversation_id"),
            message_count=data.get("message_count", 0),
            risk_level=risk.get("level", "Unknown"),
            risk_score=risk.get("score", 0),
            confidence=decision.get("final_risk_score", 0),
            requires_review=decision.get("requires_human_review", False),
            review_status="pending",
            recommendation=safety.get("message", ""),
            trend=data.get("risk_trend", "unknown"),
            raw_data=json.dumps(data, ensure_ascii=False),
        )

        db.add(item)

        db.commit()

        db.refresh(item)

        return item

    except Exception as e:

        db.rollback()

        print("SAVE ERROR:", e)

        return None

    finally:

        db.close()


def get_all_conversations():

    db = SessionLocal()

    try:

        return db.query(Conversation).order_by(Conversation.created_at.desc()).all()

    finally:

        db.close()


def get_conversation(conversation_id: str):

    db = SessionLocal()

    try:

        item = db.query(Conversation).filter(Conversation.id == conversation_id).first()

        if not item:
            return None

        result = {
            "id": item.id,
            "message_count": item.message_count,
            "risk_level": item.risk_level,
            "risk_score": item.risk_score,
            "confidence": item.confidence,
            "requires_review": item.requires_review,
            "review_status": item.review_status,
            "recommendation": item.recommendation,
            "trend": item.trend,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }

        # برگرداندن خروجی کامل AI
        if item.raw_data:

            try:

                raw = json.loads(item.raw_data)

                result["analysis"] = raw

            except Exception as e:

                print("RAW DATA ERROR:", e)

                result["analysis"] = {}

        return result

    finally:

        db.close()
