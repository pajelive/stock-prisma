import os
from flask import Flask, jsonify
from flask_cors import CORS

from stock_prisma.blueprints.restapi import init_app as restapi_init
from stock_prisma.ext.database import init_app as db_init


def create_app():
    app = Flask(__name__)
    CORS(app)

    # =========================
    # CONFIGURAÇÃO DO BANCO
    # =========================
    db_uri = os.getenv("SQLALCHEMY_DATABASE_URI")

    if not db_uri:
        # erro CLARO (em vez de crash misterioso do SQLAlchemy)
        raise RuntimeError(
            "Missing environment variable: SQLALCHEMY_DATABASE_URI"
        )

    app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # =========================
    # ROTA DE SAÚDE
    # =========================
    @app.get("/")
    def home():
        return jsonify({
            "status": "ok",
            "db_configured": bool(db_uri)
        })

    # =========================
    # INIT EXTENSIONS
    # =========================
    db_init(app)
    restapi_init(app)

    print("[BOOT] API carregada:", app.url_map)

    return app