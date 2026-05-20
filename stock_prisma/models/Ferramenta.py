from stock_prisma.ext.database import db


class Ferramenta(db.Model):
    __tablename__ = "ferramenta"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    categoria = db.Column(db.String(50), nullable=True)
    descricao = db.Column(db.String(300), nullable=True)
    uid_rfid = db.Column(db.String(30), unique=True, nullable=False)
    status = db.Column(db.String(30), default="DISPONIVEL", nullable=False)
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    movimentacoes = db.relationship("Movimentacao",back_populates="ferramenta")