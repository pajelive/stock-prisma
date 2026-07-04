from datetime import datetime, timezone, timedelta
import math

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
        # USUÁRIO (SEMPRE OBRIGATÓRIO)
        # =========================
        usuario = session.query(Usuario).filter_by(
            uid_rfid=data.get("usuario_uid")
        ).first()

        if not usuario:
            raise ValueError("Usuário não encontrado")

        etapa = usuario.etapa

        # =========================
        # COMPARTIMENTO (POR NOME)
        # =========================
        compartimento = None

        if data.get("compartimento_uid"):

            compartimento = session.query(Compartimento).filter_by(
                nome=data["compartimento_uid"]
            ).first()

            if not compartimento:
                raise ValueError("Compartimento não encontrado")

        # =========================
        # FERRAMENTA (RFID)
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
        # INFERIR TIPO
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
        # ATUALIZA PESO E QUANTIDADE (BALANÇA)
        # =========================
        # Valor padrão caso a leitura não venha de uma balança (ex: ferramentas por RFID)
        quantidade_movimentada = data.get("quantidade", 1)

        if compartimento and data.get("peso_atual") is not None:
            # Captura a quantidade atual que estava salva antes da pesagem
            quantidade_anterior = compartimento.quantidade or 0
            
            # 1. Atualiza o peso bruto vindo do microcontrolador
            compartimento.peso_atual = float(data["peso_atual"])
            
            # 2. Resgata o relacionamento com o insumo
            insumo = compartimento.insumo
            
            if insumo and insumo.peso_unitario and insumo.peso_unitario > 0:
                # 3. Desconta a tara da estrutura
                peso_liquido = compartimento.peso_atual - (compartimento.peso_tara or 0.0)
                
                # Proteção contra ruídos que joguem o peso abaixo da tara com a balança vazia
                if peso_liquido < 0:
                    peso_liquido = 0.0
                
                # 4. Divide pelo peso unitário e arredonda para um inteiro seguro
                calculo_qtd = peso_liquido / insumo.peso_unitario
                nova_quantidade = int(round(calculo_qtd))
                
                # 5. Calcula o delta absoluto de itens movimentados (Entrada ou Consumo)
                quantidade_movimentada = abs(nova_quantidade - quantidade_anterior)
                
                # Atualiza o estoque final do compartimento
                compartimento.quantidade = nova_quantidade
            else:
                # Se o compartimento não tiver insumo vinculado, zera e calcula a perda
                quantidade_movimentada = quantidade_anterior
                compartimento.quantidade = 0

            # 🚀 GARANTE A ATUALIZAÇÃO NO BANCO:
            # Força a sessão do SQLAlchemy a rastrear o objeto modificado para o UPDATE ocorrer junto com o commit global.
            session.add(compartimento)

        # =========================
        # DATA/HORA
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
            quantidade=quantidade_movimentada,  # Delta ou valor fixo
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

            ultima_mov = session.query(Movimentacao).filter_by(
                ferramenta_id=ferramenta.id
            ).order_by(Movimentacao.data_hora.desc()).first()

            if not ultima_mov:
                return "Retirada"

            ultimo_tipo = ultima_mov.tipo_movimentacao.nome

            if ultimo_tipo == "Retirada":
                return "Devolucao"

            return "Retirada"

        # =========================
        # COMPARTIMENTO (BALANÇA)
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