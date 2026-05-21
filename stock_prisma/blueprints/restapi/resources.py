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


# =========================
# COMPARTIMENTO
# =========================
class CompartimentoResource(Resource):

    def get(self):
        try:
            with db.session() as session:
                compartimentos = session.query(Compartimento).all()

                return {
                    "success": True,
                    "data": [
                        {
                            "id": c.id,
                            "nome": c.nome,
                            "localizacao": c.localizacao,
                            "peso_atual": c.peso_atual,
                            "status": c.status,
                            "insumo_id": c.insumo_id
                        }
                        for c in compartimentos
                    ]
                }, 200

        except Exception as e:
            print("[DB ERROR]", str(e))
            return {
                "success": False,
                "error": "db failure"
            }, 500


# =========================
# MOVIMENTAÇÃO
# =========================
class MovimentacaoResource(Resource):

    def post(self):

        dados = request.get_json()

        if not dados:
            return {
                "success": False,
                "error": "payload inválido"
            }, 400

        try:
            with db.session() as session:
                mov = MovimentacaoService.registrar_movimentacao(dados, session)

                return {
                    "success": True,
                    "data": {
                        "id": mov.id
                    },
                    "message": "Movimentação registrada"
                }, 201

        except ValueError as e:
            return {
                "success": False,
                "error": str(e)
            }, 400

        except Exception as e:
            print("[ERROR]", str(e))
            return {
                "success": False,
                "error": "erro interno"
            }, 500


# =========================
# RFID TYPE DETECTION
# =========================
class TipoRFIDResource(Resource):

    def get(self, uid):

        try:
            with db.session() as session:

                usuario = session.query(Usuario).filter_by(uid_rfid=uid).first()
                if usuario:
                    return {
                        "success": True,
                        "data": {
                            "tipo": "usuario",
                            "id": usuario.id,
                            "nome": usuario.nome
                        }
                    }, 200

                ferramenta = session.query(Ferramenta).filter_by(uid_rfid=uid).first()
                if ferramenta:
                    return {
                        "success": True,
                        "data": {
                            "tipo": "ferramenta",
                            "id": ferramenta.id,
                            "nome": ferramenta.nome
                        }
                    }, 200

                insumo = session.query(Insumo).filter_by(uid_rfid=uid).first()
                if insumo:
                    return {
                        "success": True,
                        "data": {
                            "tipo": "insumo",
                            "id": insumo.id,
                            "nome": insumo.nome
                        }
                    }, 200

                return {
                    "success": False,
                    "error": "RFID não encontrado"
                }, 404

        except Exception as e:
            print("[ERROR RFID]", str(e))
            return {
                "success": False,
                "error": "erro interno"
            }, 500