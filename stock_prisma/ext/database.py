import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool

Base = declarative_base()

DATABASE_URL = os.environ.get("POSTGRES_PRISMA_URL")

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,   # importante pra serverless
    pool_pre_ping=True
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_session():
    return SessionLocal()