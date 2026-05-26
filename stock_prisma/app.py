import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from stock_prisma.ext.database import db
from stock_prisma.blueprints.restapi import init_app as restapi_init
from stock_prisma.blueprints.admin import init_app as admin_init


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
    # CONFIG JWT
    # =========================
    jwt_secret = os.getenv("JWT_SECRET_KEY")

    if not jwt_secret:
        raise RuntimeError("JWT_SECRET_KEY não encontrada")

    app.config["JWT_SECRET_KEY"] = jwt_secret
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 28800
    # =========================
    # INIT EXTENSIONS
    # =========================
    db.init_app(app)
    JWTManager(app)
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
    admin_init(app)
    print("[BOOT] API carregada com sucesso")

    return app

# vercel e banco de dados funcionado api e os carai