from datetime import datetime
from stock_prisma.models import (
    Usuario,
    Compartimento,
    TipoMovimentacao,
    Movimentacao,
    Ferramenta
)


class MovimentacaoService:

    @staticmethod
    def registrar_movimentacao(data, session):

        # =========================
        # USUÁRIO (OBRIGATÓRIO)
        # =========================
        usuario = session.query(Usuario).filter_by(
            uid_rfid=data.get("usuario_uid")
        ).first()

        if not usuario:
            raise ValueError("Usuário não encontrado")

        # =========================
        # COMPARTIMENTO (OPCIONAL)
        # =========================
        compartimento = None
        if data.get("compartimento_uid"):
            compartimento = session.query(Compartimento).filter_by(
                uid_rfid=data["compartimento_uid"]
            ).first()

        # =========================
        # FERRAMENTA (OPCIONAL)
        # =========================
        ferramenta = None
        if data.get("ferramenta_uid"):
            ferramenta = session.query(Ferramenta).filter_by(
                uid_rfid=data["ferramenta_uid"]
            ).first()

        # =========================
        # TIPO MOVIMENTAÇÃO (OPCIONAL)
        # =========================
        tipo = None
        if data.get("tipo_movimentacao"):
            tipo = session.query(TipoMovimentacao).filter_by(
                nome=data["tipo_movimentacao"]
            ).first()

        # =========================
        # ATUALIZA COMPARTIMENTO
        # =========================
        if compartimento and data.get("peso_atual") is not None:
            compartimento.peso_atual = data["peso_atual"]

        # =========================
        # CRIA MOVIMENTAÇÃO
        # =========================
        mov = Movimentacao(
            usuario_id=usuario.id,
            compartimento_id=compartimento.id if compartimento else None,
            ferramenta_id=ferramenta.id if ferramenta else None,
            tipo_movimentacao_id=tipo.id if tipo else None,
            quantidade=data.get("quantidade", 1),
            origem_leitura=data.get("origem", "RFID"),
            observacao=data.get("observacao"),
            data_hora=datetime.utcnow()
        )

        session.add(mov)

        # ⚠️ IMPORTANTE: NÃO DAR COMMIT AQUI

        return mov