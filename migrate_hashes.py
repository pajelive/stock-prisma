from werkzeug.security import generate_password_hash
from sqlalchemy import create_engine, text

# 🔥 pega URL do seu banco (Supabase)
DATABASE_URL = "postgresql://postgres.rkhgiwvevpobkzxtbfpk:meJdag-samqom-nynxi3@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"}
)

with engine.connect() as conn:
    result = conn.execute(text("SELECT id FROM usuario"))
    users = result.fetchall()

    for user in users:
        hashed = generate_password_hash("123456789")

        conn.execute(
            text("""
                UPDATE usuario
                SET senha_hash = :hash
                WHERE id = :id
            """),
            {"hash": hashed, "id": user.id}
        )

    conn.commit()

print("OK: senhas migradas")