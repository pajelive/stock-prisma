from flask_restful import Resource
from flask import request

from stock_prisma.models import (
    Compartimento,
    Movimentacao
)

from stock_prisma.ext.database import db

class CompartimentoResource(Resource):

    def get(self):

        compartimentos = Compartimento.query.all()

        dados = []

        for c in compartimentos:

            dados.append({
                "id": c.id,
                "nome": c.nome,
                "localizacao": c.localizacao,
                "peso_atual": c.peso_atual,
                "status": c.status,
                "insumo_id": c.insumo_id
            })

        return dados, 200
    
class MovimentacaoResource(Resource):

    def post(self):

        dados = request.json

        usuario_uid = dados.get("usuario_uid")
        compartimento_id = dados.get("compartimento_id")
        peso_atual = dados.get("peso_atual")
        tipo_nome = dados.get("tipo_movimentacao")
        origem = dados.get("origem")

        usuario = Usuario.query.filter_by(uid_rfid=usuario_uid).first()

        if not usuario:
            return {"erro": "Usuário não encontrado"}, 404

        compartimento = Compartimento.query.get(compartimento_id)

        if not compartimento:
            return {"erro": "Compartimento não encontrado"}, 404

        tipo = TipoMovimentacao.query.filter_by(nome=tipo_nome).first()

        if not tipo:
            return {"erro": "Tipo movimentação inválido"}, 404

        # atualiza peso do compartimento
        compartimento.peso_atual = peso_atual

        movimentacao = Movimentacao(
            usuario_id=usuario.id,
            compartimento_id=compartimento.id,
            tipo_movimentacao_id=tipo.id,
            quantidade=1,
            origem_leitura=origem,
            observacao="Movimentação automática"
        )

        db.session.add(movimentacao)
        db.session.commit()

        return {"msg": "Movimentação registrada com sucesso"}, 201    