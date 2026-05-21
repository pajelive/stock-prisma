import os
from flask import Flask, jsonify
from flask_cors import CORS

from stock_prisma.ext.database import db
from stock_prisma.blueprints.restapi import init_app as restapi_init


def create_app():
    app = Flask(__name__)
    CORS(app)

    # =========================
    # CONFIG DO BANCO (VERCEL + SUPABASE)
    # =========================
    database_url = os.getenv("POSTGRES_PRISMA_URL")

    if not database_url:
        raise RuntimeError("POSTGRES_PRISMA_URL não encontrada na Vercel")

    # 🔥 FIX 1: corrigir schema antigo (postgres:// → postgresql://)
    database_url = database_url.replace("postgres://", "postgresql://")

    # 🔥 FIX 2: remover pgbouncer (quebra psycopg2 + SQLAlchemy)
    if "?pgbouncer=true" in database_url:
        database_url = database_url.replace("?pgbouncer=true", "")

    # (extra seguro) remove qualquer query string restante
    if "?" in database_url:
        database_url = database_url.split("?")[0]

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # =========================
    # INIT EXTENSIONS
    # =========================
    db.init_app(app)

    # =========================
    # HEALTHCHECK
    # =========================
    @app.get("/")
    def home():
        return jsonify({
            "status": "ok",
            "db_configured": True
        })

    # =========================
    # BLUEPRINTS
    # =========================
    restapi_init(app)

    print("[BOOT] API carregada com sucesso")

    return app

# vercel e banco de dados funcionado api e os carai