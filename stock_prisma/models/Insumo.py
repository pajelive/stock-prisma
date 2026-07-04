from stock_prisma.ext.database import db
class Insumo(db.Model):
    __tablename__ = 'insumo'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    categoria = db.Column(db.String(255), nullable=False)
    unidade = db.Column(db.String(50), nullable=False)
    uid_rfid = db.Column(db.String(255), unique=True, nullable=False)
    peso_unitario = db.Column(db.Float, nullable=False)
    ativo = db.Column(db.Boolean, default=True)
    quantidade = db.Column(db.Integer, default=0)

    compartimentos = db.relationship("Compartimento", back_populates="insumo")