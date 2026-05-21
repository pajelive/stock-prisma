from flask import Flask, jsonify
from flask_cors import CORS

from stock_prisma.blueprints.restapi import init_app as restapi_init
from stock_prisma.ext.database import init_app as db_init   # 👈 ADD ISSO


def create_app():
    app = Flask(__name__)
    CORS(app)

    # rota de saúde
    @app.get("/")
    def home():
        return jsonify({"status": "ok"})

    # 🔥 ISSO AQUI FALTAVA
    db_init(app)

    # registra API
    restapi_init(app)

    print("[BOOT] API carregada:", app.url_map)

    return app