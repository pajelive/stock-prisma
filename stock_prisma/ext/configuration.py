import os
from importlib import import_module
from dynaconf import FlaskDynaconf


def load_extensions(app):
    for extension in app.config.get('EXTENSIONS'):
        mod = import_module(extension)
        mod.init_app(app)


def init_app(app):
    FlaskDynaconf(app)

    # 🔥 OVERRIDE PRODUÇÃO (VERCEL + SUPABASE)
    db_url = os.getenv("DATABASE_URL")

    if db_url:
        app.config["SQLALCHEMY_DATABASE_URI"] = db_url
        print("[CONFIG] DATABASE_URL carregada do ambiente")