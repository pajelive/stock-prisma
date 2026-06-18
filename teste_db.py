from sqlalchemy import create_engine, text
from werkzeug.security import generate_password_hash

# 🔥 SUA CONEXÃO DO BANCO AQUI
DATABASE_URL = "COLE_AQUI_SUA_URL"

engine = create_engine(DATABASE_URL)

nova_senha = generate_password_hash("123456789")

with engine.begin() as conn:
    conn.execute(
        text("UPDATE usuario SET senha_hash = :senha"),
        {"senha": nova_senha}
    )

print("✔ Senhas resetadas com sucesso")