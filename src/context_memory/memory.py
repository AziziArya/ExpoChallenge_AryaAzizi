"""
NOTE: this module (and the src/database Conversation/Message/Decision
models it writes to) is an earlier persistence prototype. It is
*not* the persistence layer the running app actually uses --
backend/app.py instantiates ConversationMemory() with no database
session, so in production this only holds state in memory for the
lifetime of one process and never touches src/database's tables.

The real, wired-up persistence layer is backend/database/ (Conversation,
ChatSession, ChatMessage), used via backend/services/*.py -- see
"Persistent Conversation & Safety History" in docs/architecture.md.

Kept here rather than deleted since removing it isn't necessary for
correctness and this docstring is enough to stop it being mistaken for
the live persistence path.
"""

import uuid
from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from src.database.models import Conversation, Message


class ContextMemory:
    """
    Context Memory Engine.

    Responsibilities:

    - Store conversation history
    - Track risk evolution
    - Provide recent context
    - Maintain conversation state

    This module does not diagnose.
    """

    def __init__(
        self, db: Optional[Session] = None, conversation_id: Optional[str] = None
    ):

        self.db = db

        self.conversation_id = conversation_id or str(uuid.uuid4())

        self.entries: List[Dict] = []

        self._initialize_database()

    # ==========================================
    # Database Initialization
    # ==========================================

    def _initialize_database(self):

        if not self.db:

            return

        try:

            exists = (
                self.db.query(Conversation)
                .filter(Conversation.id == self.conversation_id)
                .first()
            )

            if not exists:

                conversation = Conversation(id=self.conversation_id)

                self.db.add(conversation)

                self.db.commit()

        except Exception:

            self.db.rollback()

            raise

    # ==========================================
    # Add Message
    # ==========================================

    def add_entry(self, message: str, analysis: Optional[Dict] = None):

        analysis = analysis or {}

        risk = self._extract_risk(analysis)

        timestamp = datetime.utcnow().isoformat()

        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": timestamp,
            "message": message,
            "analysis": analysis,
        }

        self.entries.append(entry)

        if self.db:

            self._save_database(message, analysis, risk)

        return entry

    # ==========================================
    # Database Save
    # ==========================================

    def _save_database(self, message, analysis, risk):

        try:

            factors = analysis.get("detected_factors", {})

            db_message = Message(
                conversation_id=self.conversation_id,
                message=message,
                risk_level=risk.get("level"),
                risk_score=risk.get("score", 0),
                emotion_score=factors.get("emotion_score", 0),
                distress_score=factors.get("distress_score", 0),
                crisis_score=factors.get("crisis_score", 0),
            )

            self.db.add(db_message)

            self.db.commit()

        except Exception:

            self.db.rollback()

            raise

    # ==========================================
    # Compatibility
    # ==========================================

    def add(self, message, analysis=None):

        return self.add_entry(message, analysis)

    # ==========================================
    # Risk Extract
    # ==========================================

    def _extract_risk(self, analysis):

        if not analysis:

            return {}

        if "risk_assessment" in analysis:

            return analysis["risk_assessment"]

        if "decision" in analysis:

            decision = analysis["decision"]

            return {
                "level": decision.get("final_risk_level", "Unknown"),
                "score": decision.get("final_risk_score", 0),
            }

        return {}

    # ==========================================
    # Get History
    # ==========================================

    def get_history(self):

        if self.db:

            try:

                messages = (
                    self.db.query(Message)
                    .filter(Message.conversation_id == self.conversation_id)
                    .order_by(Message.created_at)
                    .all()
                )

                return [
                    {
                        "id": m.id,
                        "timestamp": (
                            m.created_at.isoformat() if m.created_at else None
                        ),
                        "message": m.message,
                        "risk_level": m.risk_level,
                        "risk_score": m.risk_score,
                    }
                    for m in messages
                ]

            except Exception:

                return []

        history = []

        for item in self.entries:

            risk = self._extract_risk(item.get("analysis", {}))

            history.append(
                {
                    "id": item["id"],
                    "timestamp": item["timestamp"],
                    "message": item["message"],
                    "risk_level": risk.get("level", "Unknown"),
                    "risk_score": risk.get("score", 0),
                }
            )

        return history

    # ==========================================
    # Recent Context
    # ==========================================

    def get_recent_context(self, limit=5):

        return self.get_history()[-limit:]

    # ==========================================
    # Context Summary
    # ==========================================

    def get_context_summary(self):

        history = self.get_history()

        if not history:

            return {
                "conversation_length": 0,
                "previous_risk": "Unknown",
                "current_risk_score": 0,
                "risk_change": 0,
                "trend": "No history",
            }

        scores = [item.get("risk_score", 0) for item in history]

        current = scores[-1]

        previous = scores[-2] if len(scores) > 1 else 0

        change = round(current - previous, 4)

        if change > 0.05:

            trend = "Risk Increasing"

        elif change < -0.05:

            trend = "Risk Decreasing"

        else:

            trend = "Stable"

        return {
            "conversation_length": len(history),
            "previous_risk": (
                history[-2].get("risk_level", "Unknown")
                if len(history) > 1
                else "Unknown"
            ),
            "current_risk_score": current,
            "risk_change": change,
            "trend": trend,
        }

    # ==========================================
    # Clear
    # ==========================================

    def clear(self):

        self.entries.clear()

        if self.db:

            try:

                self.db.query(Message).filter(
                    Message.conversation_id == self.conversation_id
                ).delete()

                self.db.commit()

            except Exception:

                self.db.rollback()

                raise


ConversationMemory = ContextMemory
