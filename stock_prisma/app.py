import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from stock_prisma.ext.database import db
from stock_prisma.blueprints.restapi import init_app as restapi_init
from stock_prisma.blueprints.admin import init_app as admin_init


def create_app():
    app = Flask(__name__)
    CORS(
        app,
        supports_credentials=True,
        origins=[
            "https://stockprisma.com.br",
            "http://localhost:3000"
        ]
    )

    # =========================
    # CONFIG DO BANCO
    # =========================
    database_url = os.getenv("POSTGRES_PRISMA_URL")

    if not database_url:
        raise RuntimeError("POSTGRES_PRISMA_URL não encontrada na Vercel")

    database_url = database_url.replace("postgres://", "postgresql://")

    if "?pgbouncer=true" in database_url:
        database_url = database_url.replace("?pgbouncer=true", "")

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
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]

    app.config["JWT_COOKIE_SECURE"] = True

    app.config["JWT_COOKIE_SAMESITE"] = "None"

    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["PROPAGATE_EXCEPTIONS"] = True  # ← propaga erros JWT

    # =========================
    # INIT EXTENSIONS
    # =========================
    db.init_app(app)

    jwt = JWTManager(app)

    # =========================
    # JWT ERROR HANDLERS
    # =========================
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({"erro": "token ausente"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"erro": "token inválido"}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"erro": "token expirado"}), 401

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