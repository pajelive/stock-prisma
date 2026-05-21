from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import NullPool

db = SQLAlchemy()

def init_app(app):
    uri = app.config.get("SQLALCHEMY_DATABASE_URI")

    if not uri:
        raise RuntimeError("DATABASE URI not configured")

    # configuração correta do SQLAlchemy no Flask-SQLAlchemy
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "poolclass": NullPool,
        "pool_pre_ping": True
    }

    db.init_app(app)