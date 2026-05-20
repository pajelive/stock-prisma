class EtapaProcesso(db.Model):
    __tablename__ = 'etapa_processo'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.String(255), nullable=True)
    ordem = db.Column(db.Integer, nullable=False)
    ativo = db.Column(db.Boolean, default=True)

    movimentacoes = db.relationship("Movimentacao", back_populates="etapa")