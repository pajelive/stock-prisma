class AlertaEstoque(db.Model):
    __tablename__ = 'alerta_estoque'

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=False)
    mensagem = db.Column(db.String(255), nullable=False)
    qtd_atual = db.Column(db.Integer, nullable=False)
    qtd_minima = db.Column(db.Integer, nullable=False)
    gerado_em = db.Column(db.DateTime, nullable=False)
    resolvido = db.Column(db.Boolean, default=False)
    resolvido_em = db.Column(db.DateTime, nullable=True)
