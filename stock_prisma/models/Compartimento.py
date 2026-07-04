from stock_prisma.ext.database import db
class Compartimento(db.Model):
    __tablename__ = 'compartimento'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    localizacao = db.Column(db.String(255), nullable=False)
    peso_atual = db.Column(db.Float, nullable=False)
    peso_tara = db.Column(db.Float, nullable=False)
    sensor_ativo = db.Column(db.Boolean, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    ultima_calibracao = db.Column(db.DateTime, nullable=True)
    quantidade = db.Column(db.Integer, default=0)

    insumo_id = db.Column(db.BigInteger, db.ForeignKey("insumo.id"))

    insumo = db.relationship("Insumo", back_populates="compartimentos")

    movimentacoes = db.relationship("Movimentacao", back_populates="compartimento")