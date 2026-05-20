class Usuario(db.Model):
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    matricula = db.Column(db.String(255), nullable=False, unique=True)
    uid_rfid = db.Column(db.String(255), nullable=False, unique=True)
    setor = db.Column(db.String(255), nullable=False)
    ativo = db.Column(db.Boolean, nullable=False)

    perfil_id = db.Column(db.BigInteger, db.ForeignKey("perfil.id"))

    perfil = db.relationship("Perfil", back_populates="usuarios")

    movimentacoes = db.relationship("Movimentacao", back_populates="usuario")
