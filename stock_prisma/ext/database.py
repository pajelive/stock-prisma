import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool

Base = declarative_base()

raw_url = os.getenv("POSTGRES_PRISMA_URL")

if not raw_url:
    raise Exception("POSTGRES_PRISMA_URL não definida")

# 🔥 FIX CRÍTICO PARA SQLAlchemy 2.x
DATABASE_URL = raw_url.replace("postgres://", "postgresql://")

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine)

def get_session():
    return SessionLocal()