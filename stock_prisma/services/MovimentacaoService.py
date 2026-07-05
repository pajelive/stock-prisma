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
        quantidade_movimentada = data.get("quantidade", 1)

        if compartimento and data.get("peso_atual") is not None:
            # Captura o histórico atual que estava salvo antes da nova pesagem
            quantidade_anterior_total = compartimento.quantidade or 0
            peso_anterior = compartimento.peso_atual or 0.0
            
            # 1. Atualiza o peso bruto vindo do microcontrolador para o compartimento
            peso_novo = float(data["peso_atual"])
            compartimento.peso_atual = peso_novo
            
            # 2. Resgata o relacionamento com o insumo
            insumo = compartimento.insumo
            
            if insumo and insumo.peso_unitario and insumo.peso_unitario > 0:
                
                # Descoberta do Delta de peso baseado na variação física atual
                delta_peso = abs(peso_novo - peso_anterior)
                
                # Se saiu do zero absoluto para um peso positivo, desconta a tara estrutural
                if peso_anterior <= 0.005 and peso_novo > 0.005:
                    peso_liquido_delta = peso_novo - (compartimento.peso_tara or 0.0)
                    if peso_liquido_delta < 0: peso_liquido_delta = 0.0
                else:
                    peso_liquido_delta = delta_peso
                
                # Converte o delta medido para a quantidade da movimentação atual
                calculo_qtd_movimento = peso_liquido_delta / insumo.peso_unitario
                quantidade_movimentada = int(round(calculo_qtd_movimento))
                
                # LÓGICA DE ATUALIZAÇÃO DO COMPARTIMENTO (Sincronia Direta pelo Peso Total)
                if peso_novo <= 0.005:
                    # Se o peso zerou, o estoque atual do compartimento obrigatoriamente é zero
                    compartimento.quantidade = 0
                else:
                    # Calcula a quantidade total líquida que restou sobre a balança
                    peso_liquido_total = peso_novo - (compartimento.peso_tara or 0.0)
                    if peso_liquido_total < 0: peso_liquido_total = 0.0
                    
                    quantidade_real_total = int(round(peso_liquido_total / insumo.peso_unitario))
                    compartimento.quantidade = max(0, quantidade_real_total)
            else:
                # Sem insumo vinculado
                quantidade_movimentada = 0
                compartimento.quantidade = 0

            # Força a sessão do SQLAlchemy a rastrear o objeto modificado para UPDATE
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
            quantidade=quantidade_movimentada,
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

        if compartimento:
            peso_atual = data.get("peso_atual")
            peso_anterior = compartimento.peso_atual or 0.0

            if peso_atual is None:
                return "Inventario"

            peso_atual = float(peso_atual)

            # Se a balança já estava zerada e continua zerada
            if peso_anterior <= 0.005 and peso_atual <= 0.005:
                return "Inventario"

            # Se a balança estava zerada (vazia) e detetou peso -> Entrada
            if peso_anterior <= 0.005 and peso_atual > 0.005:
                return "Entrada"

            # Se o peso diminuiu (mesmo indo para 0.0) -> Consumo
            if peso_atual < peso_anterior:
                return "Consumo"

            # Se o peso aumentou a partir de um estado que já tinha peso -> Entrada
            if peso_atual > peso_anterior:
                return "Entrada"

            return "Inventario"

        raise ValueError("Não foi possível inferir o tipo de movimentação")