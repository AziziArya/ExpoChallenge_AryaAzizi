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


class ChatSession(Base):

    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, index=True)

    message_count = Column(Integer, default=0)

    risk_level = Column(String, default="Safe")

    risk_score = Column(Float, default=0)

    requires_review = Column(Boolean, default=False)

    review_status = Column(String, default="pending")

    # Cumulative OpenAI token usage across the whole session -- lets
    # cost be monitored per conversation instead of only in the
    # provider's own dashboard, which has no per-session breakdown.
    total_tokens_used = Column(Integer, default=0)

    # Full running state (message history + safety timeline) as JSON,
    # same pattern as Conversation.raw_data -- lets a session resume
    # exactly where it was left off without reconstructing state from
    # scattered rows.
    raw_data = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ChatMessage(Base):

    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)

    session_id = Column(String, index=True)

    message_number = Column(Integer)

    role = Column(String)  # "user" | "assistant"

    text = Column(Text)

    risk_level = Column(String, nullable=True)

    risk_score = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
