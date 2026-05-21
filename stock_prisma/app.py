from flask import Flask, jsonify
from flask_cors import CORS

# Blueprints da API
from stock_prisma.blueprints.restapi import init_app as restapi_init


def create_app():
    app = Flask(__name__)
    CORS(app)

    # rota de saúde (obrigatória na Vercel)
    @app.get("/")
    def home():
        return jsonify({"status": "ok"})

    # registra API
    restapi_init(app)

    print("[BOOT] API carregada:", app.url_map)

    return app