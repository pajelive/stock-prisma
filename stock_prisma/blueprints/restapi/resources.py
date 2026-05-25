from flask_restful import Resource
from flask import request
from flask_jwt_extended import create_access_token
import bcrypt

from stock_prisma.services.MovimentacaoService import MovimentacaoService
from stock_prisma.models import Usuario, Ferramenta, Compartimento
from stock_prisma.ext.database import db

class AuthResource(Resource):

    def post(self):

        dados = request.json

        matricula = dados.get("matricula")
        senha = dados.get("senha")

        if not matricula or not senha:
            return {
                "erro": "matricula e senha obrigatórios"
            }, 400

        # =========================
        # BUSCA USUÁRIO
        # =========================
        usuario = Usuario.query.filter_by(
            matricula=matricula,
            ativo=True
        ).first()

        if not usuario:
            return {"erro": "credenciais inválidas"}, 401

        # =========================
        # VERIFICA PERFIL ADMIN
        # =========================
        if usuario.perfil.nome != "Administrador":
            return {"erro": "acesso negado"}, 403

        # =========================
        # VERIFICA SENHA
        # =========================
        if not usuario.senha_hash:
            return {"erro": "usuário sem senha configurada"}, 401

        senha_valida = bcrypt.checkpw(
            senha.encode(),
            usuario.senha_hash.encode()
        )

        if not senha_valida:
            return {"erro": "credenciais inválidas"}, 401

        # =========================
        # GERA TOKEN
        # =========================
        token = create_access_token(
            identity=str(usuario.id),
            additional_claims={
                "nome": usuario.nome,
                "perfil": usuario.perfil.nome
            }
        )

        return {
            "token": token,
            "nome": usuario.nome,
            "perfil": usuario.perfil.nome
        }, 200

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

                compartimento = session.query(Compartimento).filter_by(uid_rfid=uid).first()
                if compartimento:
                    return {
                        "success": True,
                        "data": {
                            "tipo": "compartimento",
                            "id": compartimento.id,
                            "nome": compartimento.nome
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