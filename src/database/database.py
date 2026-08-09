from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# =====================================
# Database Configuration
# =====================================

DATABASE_URL = "sqlite:///./test_mental_health.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


# =====================================
# Session Factory
# =====================================

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# =====================================
# Base Model
# =====================================

Base = declarative_base()


# =====================================
# Database Dependency
# =====================================


def get_db():
    """
    FastAPI database dependency
    """

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# =====================================
# Initialize Database
# =====================================


def init_database():
    """
    Create all database tables
    """

    Base.metadata.create_all(bind=engine)
