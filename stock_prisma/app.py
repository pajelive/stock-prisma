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

    # 🔥 FIX CRÍTICO (SQLAlchemy não aceita postgres://)
    database_url = database_url.replace("postgres://", "postgresql://")

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # =========================
    # INIT EXTENSIONS
    # =========================
    db.init_app(app)

    # =========================
    # ROTA DE TESTE
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