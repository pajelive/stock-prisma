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
        # USUÁRIO
        # =========================
        usuario = session.query(
            Usuario
        ).filter_by(
            uid_rfid=data.get("usuario_uid")
        ).first()

        if not usuario:
            raise ValueError(
                "Usuário não encontrado"
            )

        # =========================
        # ETAPA (via usuário)
        # =========================
        etapa = usuario.etapa

        # =========================
        # COMPARTIMENTO
        # =========================
        compartimento = None

        if data.get("compartimento_uid"):

            compartimento = session.query(
                Compartimento
            ).filter_by(
                uid_rfid=data["compartimento_uid"]
            ).first()

        # =========================
        # FERRAMENTA
        # =========================
        ferramenta = None

        if data.get("ferramenta_uid"):

            ferramenta = session.query(
                Ferramenta
            ).filter_by(
                uid_rfid=data["ferramenta_uid"]
            ).first()

        # =========================
        # TIPO MOVIMENTAÇÃO
        # =========================
        tipo_nome = (
            MovimentacaoService
            ._inferir_tipo_movimentacao(
                ferramenta=ferramenta,
                compartimento=compartimento,
                data=data,
                session=session
            )
        )

        tipo = session.query(
            TipoMovimentacao
        ).filter_by(
            nome=tipo_nome
        ).first()

        if not tipo:
            raise ValueError(
                f"Tipo inválido: {tipo_nome}"
            )

        # =========================
        # ORDEM PRODUÇÃO
        # =========================
        op = None

        if data.get("op_codigo"):

            op = session.query(
                OrdemProducao
            ).filter_by(
                codigo=data["op_codigo"]
            ).first()

        # =========================
        # ATUALIZA PESO
        # =========================
        if (
            compartimento and
            data.get("peso_atual") is not None
        ):

            compartimento.peso_atual = (
                data["peso_atual"]
            )

        # =========================
        # DATA/HORA
        # =========================
        BRASILIA = timezone(
            timedelta(hours=-3)
        )

        # =========================
        # CRIA MOVIMENTAÇÃO
        # =========================
        mov = Movimentacao(

            usuario_id=usuario.id,

            compartimento_id=(
                compartimento.id
                if compartimento else None
            ),

            ferramenta_id=(
                ferramenta.id
                if ferramenta else None
            ),

            tipo_movimentacao_id=tipo.id,

            etapa_id=(
                etapa.id
                if etapa else None
            ),

            op_id=(
                op.id
                if op else None
            ),

            quantidade=data.get(
                "quantidade",
                1
            ),

            origem_leitura=data.get(
                "origem",
                "DESCONHECIDA"
            ),

            observacao=data.get(
                "observacao"
            ),

            data_hora=datetime.now(
                BRASILIA
            ).replace(tzinfo=None)
        )

        session.add(mov)

        return mov

    # =====================================================
    # INFERIR TIPO MOVIMENTAÇÃO
    # =====================================================

    @staticmethod
    def _inferir_tipo_movimentacao(
        ferramenta,
        compartimento,
        data,
        session
    ):

        # =========================================
        # FERRAMENTA RFID
        # =========================================
        if ferramenta:

            ultima_mov = session.query(
                Movimentacao
            ).filter_by(
                ferramenta_id=ferramenta.id
            ).order_by(
                Movimentacao.data_hora.desc()
            ).first()

            # PRIMEIRA MOVIMENTAÇÃO
            if not ultima_mov:
                return "Retirada"

            ultimo_tipo = (
                ultima_mov
                .tipo_movimentacao
                .nome
            )

            # MÁQUINA DE ESTADOS
            if ultimo_tipo == "Retirada":
                return "Devolucao"

            return "Retirada"

        # =========================================
        # INSUMO / COMPARTIMENTO
        # =========================================
        if compartimento:

            peso_atual = data.get(
                "peso_atual"
            )

            peso_anterior = (
                compartimento.peso_atual or 0
            )

            # SEM PESO
            if peso_atual is None:
                return "Inventario"

            # PESO DIMINUIU
            if peso_atual < peso_anterior:
                return "Consumo"

            # PESO AUMENTOU
            elif peso_atual > peso_anterior:
                return "Entrada"

            # PESO IGUAL
            return "Inventario"

        # =========================================
        # FALLBACK
        # =========================================
        raise ValueError(
            "Não foi possível inferir o tipo de movimentação"
        )
