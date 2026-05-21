import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool

Base = declarative_base()

DATABASE_URL = os.getenv("POSTGRES_PRISMA_URL")

if not DATABASE_URL:
    raise Exception("POSTGRES_PRISMA_URL não está definida na Vercel")

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine)

def get_session():
    return SessionLocal()