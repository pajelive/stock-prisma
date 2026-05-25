from stock_prisma.ext.database import db
class Usuario(db.Model):
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    matricula = db.Column(db.String(255), nullable=False, unique=True)
    uid_rfid = db.Column(db.String(255), nullable=True, unique=True)
    setor = db.Column(db.String(255), nullable=False)
    ativo = db.Column(db.Boolean, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=True)

    perfil_id = db.Column(db.BigInteger, db.ForeignKey("perfil.id"))

    etapa_id = db.Column(db.Integer, db.ForeignKey("etapa_processo.id"))

    perfil = db.relationship("Perfil", back_populates="usuarios")

    movimentacoes = db.relationship("Movimentacao", back_populates="usuario")

    etapa = db.relationship("EtapaProcesso")

