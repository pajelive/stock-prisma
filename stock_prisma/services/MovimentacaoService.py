from datetime import datetime, timezone, timedelta
from stock_prisma.models import (
    Usuario,
    Compartimento,
    TipoMovimentacao,
    Movimentacao,
    Ferramenta,
    EtapaProcesso,
    OrdemProducao
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
        # TIPO MOVIMENTAÇÃO (inferido pela origem)
        # =========================
        origem = data.get("origem", "RFID_1")

        tipo_nome = None
        if origem == "RFID_1":
            tipo_nome = "Retirada"
        elif origem == "COMPARTIMENTO_1":
            tipo_nome = "Consumo"

        tipo = None
        if tipo_nome:
            tipo = session.query(TipoMovimentacao).filter_by(
                nome=tipo_nome
            ).first()

        # =========================
        # ETAPA PROCESSO (OPCIONAL)
        # =========================
        etapa = None
        if data.get("etapa_id"):
            etapa = session.query(EtapaProcesso).filter_by(
                id=data["etapa_id"]
            ).first()

        # =========================
        # ORDEM DE PRODUÇÃO (OPCIONAL)
        # =========================
        op = None
        if data.get("op_codigo"):
            op = session.query(OrdemProducao).filter_by(
                codigo=data["op_codigo"]
            ).first()

        # =========================
        # ATUALIZA COMPARTIMENTO
        # =========================
        if compartimento and data.get("peso_atual") is not None:
            compartimento.peso_atual = data["peso_atual"]

        # =========================
        # CRIA MOVIMENTAÇÃO
        # =========================
        BRASILIA = timezone(timedelta(hours=-3))
        mov = Movimentacao(
            usuario_id=usuario.id,
            compartimento_id=compartimento.id if compartimento else None,
            ferramenta_id=ferramenta.id if ferramenta else None,
            tipo_movimentacao_id=tipo.id if tipo else None,
            etapa_id=etapa.id if etapa else None,
            op_id=op.id if op else None,
            quantidade=data.get("quantidade", 1),
            origem_leitura=origem,
            observacao=data.get("observacao"),
            data_hora=datetime.now(BRASILIA).replace(tzinfo=None)
        )

        session.add(mov)

        # ⚠️ NÃO DAR COMMIT AQUI

        return mov