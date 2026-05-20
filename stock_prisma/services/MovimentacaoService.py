from datetime import datetime
from stock_prisma.ext.database import db

from stock_prisma.models import (Usuario,Compartimento,TipoMovimentacao,Movimentacao,Ferramenta)

class MovimentacaoService:

    @staticmethod
    def registrar_movimentacao(data):

        usuario = Usuario.query.filter_by(
            uid_rfid=data["usuario_uid"]
        ).first()

        if not usuario:
            raise Exception("Usuário não encontrado")

        compartimento = None
        if data.get("compartimento_id"):
            compartimento = Compartimento.query.get(data["compartimento_id"])

        ferramenta = None
        if data.get("ferramenta_id"):
            ferramenta = Ferramenta.query.get(data["ferramenta_id"])

        tipo = None
        if data.get("tipo_movimentacao"):
            tipo = TipoMovimentacao.query.filter_by(
                nome=data["tipo_movimentacao"]
            ).first()

        if compartimento:
            compartimento.peso_atual = data.get(
                "peso_atual",
                compartimento.peso_atual
            )

        mov = Movimentacao(
            usuario_id=usuario.id,
            compartimento_id=compartimento.id if compartimento else None,
            ferramenta_id=ferramenta.id if ferramenta else None,
            tipo_movimentacao_id=tipo.id if tipo else None,
            quantidade=data.get("quantidade", 1),
            origem_leitura=data.get("origem", "API"),
            observacao=data.get("observacao"),
            data_hora=datetime.utcnow()
        )

        db.session.add(mov)
        db.session.commit()

        return mov