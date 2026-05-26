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
