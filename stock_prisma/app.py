from flask import Flask
from flask_cors import CORS

from stock_prisma.ext.database import init_app as db_init
from stock_prisma.blueprints.restapi import init_app as restapi_init
from stock_prisma.blueprints.views import init_app as views_init


def create_app():
    app = Flask(__name__)
    CORS(app)

    try:
        db_init(app)
        restapi_init(app)
        views_init(app)
        print("[BOOT] app iniciado com sucesso")
        print(app.url_map)

    except Exception as e:
        print("[FATAL ERROR]", str(e))
        raise

    return app