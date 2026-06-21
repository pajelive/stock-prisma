from datetime import datetime, timezone, timedelta

from stock_prisma.models import (
    Usuario,
    Compartimento,
    TipoMovimentacao,
    Movimentacao,
    Ferramenta,
    OrdemProducao
)


class MovimentacaoService:

    @staticmethod
    def registrar_movimentacao(data, session):

        # =========================
        # USUÁRIO (obrigatório)
        # =========================
        usuario = session.query(Usuario).filter_by(
            uid_rfid=data.get("usuario_uid")
        ).first()

        if not usuario:
            raise ValueError("Usuário não encontrado")

        etapa = usuario.etapa

        # =========================
        # COMPARTIMENTO
        # =========================
        compartimento = None

        if data.get("compartimento_uid"):
            compartimento = session.query(Compartimento).filter_by(
                uid_rfid=data["compartimento_uid"]
            ).first()

        # =========================
        # FERRAMENTA
        # =========================
        ferramenta = None

        if data.get("ferramenta_uid"):
            ferramenta = session.query(Ferramenta).filter_by(
                uid_rfid=data["ferramenta_uid"]
            ).first()

        # =========================
        # TIPO MOVIMENTAÇÃO
        # =========================
        tipo_nome = MovimentacaoService._inferir_tipo_movimentacao(
            ferramenta=ferramenta,
            compartimento=compartimento,
            data=data,
            session=session
        )

        tipo = session.query(TipoMovimentacao).filter_by(
            nome=tipo_nome
        ).first()

        if not tipo:
            raise ValueError(f"Tipo inválido: {tipo_nome}")

        # =========================
        # OP (opcional)
        # =========================
        op = None

        if data.get("op_codigo"):
            op = session.query(OrdemProducao).filter_by(
                codigo=data["op_codigo"]
            ).first()

        # =========================
        # ATUALIZA PESO DO COMPARTIMENTO
        # =========================
        if compartimento and data.get("peso_atual") is not None:
            compartimento.peso_atual = data["peso_atual"]

        # =========================
        # DATA
        # =========================
        BRASILIA = timezone(timedelta(hours=-3))

        # =========================
        # CRIA MOVIMENTAÇÃO
        # =========================
        mov = Movimentacao(

            usuario_id=usuario.id,

            compartimento_id=compartimento.id if compartimento else None,
            ferramenta_id=ferramenta.id if ferramenta else None,

            tipo_movimentacao_id=tipo.id,
            etapa_id=etapa.id if etapa else None,
            op_id=op.id if op else None,

            quantidade=data.get("quantidade", 1),
            origem_leitura=data.get("origem", "DESCONHECIDA"),
            observacao=data.get("observacao"),

            data_hora=datetime.now(BRASILIA).replace(tzinfo=None)
        )

        session.add(mov)
        return mov

    # =========================
    # INFERÊNCIA DE TIPO
    # =========================

    @staticmethod
    def _inferir_tipo_movimentacao(ferramenta, compartimento, data, session):

        # =========================
        # FERRAMENTA
        # =========================
        if ferramenta:

            ultima = session.query(Movimentacao).filter_by(
                ferramenta_id=ferramenta.id
            ).order_by(Movimentacao.data_hora.desc()).first()

            if not ultima:
                return "Retirada"

            ultimo_tipo = ultima.tipo_movimentacao.nome

            return "Devolucao" if ultimo_tipo == "Retirada" else "Retirada"

        # =========================
        # COMPARTIMENTO
        # =========================
        if compartimento:

            peso_atual = data.get("peso_atual")
            peso_anterior = compartimento.peso_atual or 0

            if peso_atual is None:
                return "Inventario"

            if peso_atual < peso_anterior:
                return "Consumo"

            if peso_atual > peso_anterior:
                return "Entrada"

            return "Inventario"

        raise ValueError("Não foi possível inferir o tipo de movimentação")