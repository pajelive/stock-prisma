from flask_restful import Resource
from flask import request
from stock_prisma.services.MovimentacaoService import MovimentacaoService
from stock_prisma.models import Compartimento
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

        try:
            mov = MovimentacaoService.registrar_movimentacao(dados, db.session)
            db.session.commit()

            return {
                "msg": "Movimentação registrada",
                "id": mov.id
            }, 201

        except ValueError as e:
            db.session.rollback()
            return {"erro": str(e)}, 400

        except Exception as e:
            db.session.rollback()
            return {"erro": "erro interno", "detalhe": str(e)}, 500