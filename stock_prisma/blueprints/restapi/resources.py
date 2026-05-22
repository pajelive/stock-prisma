from flask_restful import Resource
from flask import request
from stock_prisma.services.MovimentacaoService import MovimentacaoService
from stock_prisma.models import Usuario, Ferramenta, Compartimento
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

class TipoRFIDResource(Resource):

    def get(self, uid):

        # testa usuário
        usuario = Usuario.query.filter_by(uid_rfid=uid).first()
        if usuario:
            return {
                "success": True,
                "data": {
                    "tipo": "usuario",
                    "id": usuario.id,
                    "nome": usuario.nome
                }
            }, 200

        # testa ferramenta
        ferramenta = Ferramenta.query.filter_by(uid_rfid=uid).first()
        if ferramenta:
            return {
                "success": True,
                "data": {
                    "tipo": "ferramenta",
                    "id": ferramenta.id,
                    "nome": ferramenta.nome
                }
            }, 200

        # testa compartimento
        compartimento = Compartimento.query.filter_by(uid_rfid=uid).first()
        if compartimento:
            return {
                "success": True,
                "data": {
                    "tipo": "compartimento",
                    "id": compartimento.id,
                    "nome": compartimento.nome
                }
            }, 200

        # uid não encontrado
        return {
            "success": False,
            "erro": "UID não encontrado"
        }, 404