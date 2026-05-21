from flask import Flask
from flask_cors import CORS

from stock_prisma.ext.database import init_app as db_init
from stock_prisma.blueprints.restapi import init_app as restapi_init
from stock_prisma.blueprints.views import init_app as views_init


def create_app():
    app = Flask(__name__)

    CORS(app)

    # DB
    db_init(app)

    # ROTAS (SEM Dynaconf)
    restapi_init(app)
    views_init(app)

    print("[BOOT] Rotas registradas:", app.url_map)

    return app