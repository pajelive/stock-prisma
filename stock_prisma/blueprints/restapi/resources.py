from flask_restful import Resource
from flask import request
from stock_prisma.services.MovimentacaoService import MovimentacaoService


from stock_prisma.models import (
    Compartimento,
    Usuario,
    Ferramenta,
    Insumo
)

from stock_prisma.ext.database import db

print("[DEBUG] carregou resources.py")

class CompartimentoResource(Resource):

    def get(self):
        try:
            with db.session() as session:
                compartimentos = session.query(Compartimento).all()

                return [
                    {
                        "id": c.id,
                        "nome": c.nome,
                        "localizacao": c.localizacao,
                        "peso_atual": c.peso_atual,
                        "status": c.status,
                        "insumo_id": c.insumo_id
                    }
                    for c in compartimentos
                ], 200

        except Exception as e:
            print("[DB ERROR]", str(e))
            return {"erro": "db failure"}, 500
    
class MovimentacaoResource(Resource):

    def post(self):

        dados = request.json

        try:
            mov = MovimentacaoService.registrar_movimentacao(dados)

            return {
                "msg": "Movimentação registrada",
                "id": mov.id
            }, 201

        except ValueError as e:
            return {"erro": str(e)}, 400

        except Exception as e:
            return {"erro": "erro interno"}, 500

class TipoRFIDResource(Resource):

    def get(self, uid):

        usuario = Usuario.query.filter_by(uid_rfid=uid).first()

        if usuario:
            return {
                "tipo": "usuario",
                "id": usuario.id,
                "nome": usuario.nome
            }, 200

        ferramenta = Ferramenta.query.filter_by(uid_rfid=uid).first()

        if ferramenta:
            return {
                "tipo": "ferramenta",
                "id": ferramenta.id,
                "nome": ferramenta.nome
            }, 200

        insumo = Insumo.query.filter_by(uid_rfid=uid).first()

        if insumo:
            return {
                "tipo": "insumo",
                "id": insumo.id,
                "nome": insumo.nome
            }, 200

        return {
            "erro": "RFID não encontrado"
        }, 404