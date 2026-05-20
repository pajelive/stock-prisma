from stock_prisma.app import create_app
from stock_prisma.ext.database import db

app = create_app()

with app.app_context():
    try:
        db.engine.connect()
        print("[DB] Conexão OK")
    except Exception as e:
        print("[DB] Erro:", e)