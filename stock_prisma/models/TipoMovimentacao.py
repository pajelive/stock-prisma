class TipoMovimentacao(db.Model):
    __tablename__ = 'tipo_movimentacao'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.String(200), nullable=True)
