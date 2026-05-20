class Movimentacao(db.Model):
    __tablename__ = 'movimentacao'

    id = db.Column(db.Integer, primary_key=True)
    quantidade = db.Column(db.Float, nullable=False)
    data_hora = db.Column(db.DateTime, nullable=False)
    origem_leitura = db.Column(db.String(255), nullable=False)
    observacao = db.Column(db.String(255), nullable=True)

