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
        usuario = None

        if data.get("usuario_uid"):
            usuario = session.query(Usuario).filter_by(
                uid_rfid=data["usuario_uid"]
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
        # ORDEM PRODUÇÃO (opcional)
        # =========================
        op = None

        if data.get("op_codigo"):
            op = session.query(OrdemProducao).filter_by(
                codigo=data["op_codigo"]
            ).first()

        # =========================
        # COMPARTIMENTO RESOLUÇÃO + PESO
        # =========================
        tipo_nome = None

        if compartimento:

            tipo_nome = MovimentacaoService._inferir_tipo_movimentacao(
                compartimento=compartimento,
                data=data
            )

            peso_atual = data.get("peso_atual")

            # atualiza estado oficial do estoque
            if peso_atual is not None:
                compartimento.peso_atual = peso_atual

        # =========================
        # FERRAMENTA (RFID lógica)
        # =========================
        elif ferramenta:

            ultima = session.query(Movimentacao).filter_by(
                ferramenta_id=ferramenta.id
            ).order_by(
                Movimentacao.data_hora.desc()
            ).first()

            if not ultima:
                tipo_nome = "Retirada"
            else:
                ultimo_tipo = ultima.tipo_movimentacao.nome

                tipo_nome = (
                    "Devolucao"
                    if ultimo_tipo == "Retirada"
                    else "Retirada"
                )

        else:
            raise ValueError("Movimentação inválida")

        # =========================
        # TIPO MOVIMENTAÇÃO
        # =========================
        tipo = session.query(TipoMovimentacao).filter_by(
            nome=tipo_nome
        ).first()

        if not tipo:
            raise ValueError(f"Tipo inválido: {tipo_nome}")

        # =========================
        # DATA/HORA (BR)
        # =========================
        BRASILIA = timezone(timedelta(hours=-3))

        # =========================
        # CRIA MOVIMENTAÇÃO
        # =========================
        mov = Movimentacao(
            usuario_id=usuario.id if usuario else None,
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

    # =====================================================
    # INFERÊNCIA DE MOVIMENTO (BALANÇA)
    # =====================================================
    @staticmethod
    def _inferir_tipo_movimentacao(compartimento, data):

        peso_atual = data.get("peso_atual")

        if peso_atual is None:
            return "Inventario"

        peso_anterior = compartimento.peso_atual or 0

        delta = peso_atual - peso_anterior

        # tolerância de ruído
        if abs(delta) < 0.01:
            return "Inventario"

        if delta < 0:
            return "Consumo"

        return "Entrada"