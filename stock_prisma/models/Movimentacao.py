from stock_prisma.ext.database import db
class Movimentacao(db.Model):
    __tablename__ = 'movimentacao'

    id = db.Column(db.Integer, primary_key=True)
    quantidade = db.Column(db.Float, nullable=False)
    data_hora = db.Column(db.DateTime, nullable=False)
    origem_leitura = db.Column(db.String(255), nullable=False)
    observacao = db.Column(db.String(255), nullable=True)

    usuario_id = db.Column(db.BigInteger, db.ForeignKey("usuario.id"))
    compartimento_id = db.Column(db.BigInteger, db.ForeignKey("compartimento.id"))
    op_id = db.Column(db.BigInteger, db.ForeignKey("ordem_producao.id"))
    etapa_id = db.Column(db.BigInteger, db.ForeignKey("etapa_processo.id"))
    tipo_movimentacao_id = db.Column(db.BigInteger, db.ForeignKey("tipo_movimentacao.id"))
    ferramenta_id = db.Column(db.BigInteger, db.ForeignKey("ferramenta.id"))

    usuario = db.relationship("Usuario", back_populates="movimentacoes")
    compartimento = db.relationship("Compartimento", back_populates="movimentacoes")
    ordem_producao = db.relationship("OrdemProducao", back_populates="movimentacoes")
    etapa = db.relationship("EtapaProcesso", back_populates="movimentacoes")
    tipo_movimentacao = db.relationship("TipoMovimentacao")

    ferramenta = db.relationship("Ferramenta", back_populates="movimentacoes")