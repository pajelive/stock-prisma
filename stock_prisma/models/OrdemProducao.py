from stock_prisma.ext.database import db
class OrdemProducao(db.Model):
    __tablename__ = 'ordem_producao'

    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(255), nullable=False, unique=True)
    descricao = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    data_inicio = db.Column(db.DateTime, nullable=False)
    data_fim = db.Column(db.DateTime, nullable=True)

    movimentacoes = db.relationship("Movimentacao", back_populates="ordem_producao")