from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text

from .database import Base


class Conversation(Base):

    __tablename__ = "conversations"

    id = Column(String, primary_key=True, index=True)

    message_count = Column(Integer, default=0)

    risk_level = Column(String)

    risk_score = Column(Float, default=0)

    confidence = Column(Float, default=0)

    requires_review = Column(Boolean, default=False)

    review_status = Column(String, default="pending")

    recommendation = Column(Text)

    trend = Column(String, default="unknown")

    raw_data = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)


class ConversationMessage(Base):

    __tablename__ = "conversation_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)

    conversation_id = Column(String, index=True)

    message_number = Column(Integer)

    text = Column(Text)

    risk_level = Column(String)

    risk_score = Column(Float)
