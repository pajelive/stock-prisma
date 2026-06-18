from flask_restful import Resource
from flask import request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash

from stock_prisma.models import (
    Usuario,
    Ferramenta,
    Perfil,
    EtapaProcesso,
    OrdemProducao
)
from stock_prisma.ext.database import db


# =========================
# AUTH
# =========================
class AuthResource(Resource):

    def post(self):

        dados = request.json

        matricula = dados.get("matricula")
        senha = dados.get("senha")

        if not matricula or not senha:
            return {"erro": "matricula e senha obrigatórios"}, 400

        usuario = Usuario.query.filter_by(
            matricula=matricula,
            ativo=True
        ).first()

        if not usuario:
            return {"erro": "credenciais inválidas"}, 401

        if usuario.perfil.nome != "Administrador":
            return {"erro": "acesso negado"}, 403

        if not usuario.senha_hash:
            return {"erro": "usuário sem senha configurada"}, 401

        senha_valida = check_password_hash(usuario.senha_hash, senha)

        if not senha_valida:
            return {"erro": "credenciais inválidas"}, 401

        token = create_access_token(
            identity=str(usuario.id),
            additional_claims={
                "nome": usuario.nome,
                "perfil": usuario.perfil.nome
            }
        )

        response = make_response(jsonify({
            "nome": usuario.nome,
            "matricula": usuario.matricula,
            "perfil": usuario.perfil.nome
        }), 200)

        set_access_cookies(response, token)

        return response

class MeResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        usuario = Usuario.query.get(user_id)

        if not usuario:
            return {"erro": "usuário não encontrado"}, 404

        return {
            "id": usuario.id,
            "matricula": usuario.matricula,
            "nome": usuario.nome
        }, 200

# =========================
# FERRAMENTAS
# =========================
class FerramentaResource(Resource):

    def get(self):
        ferramentas = Ferramenta.query.filter_by(ativo=True).all()

        return [{
            "id": f.id,
            "nome": f.nome,
            "categoria": f.categoria,
            "descricao": f.descricao,
            "uid_rfid": f.uid_rfid,
            "status": f.status,
            "ativo": f.ativo,
            "created_at": str(f.created_at)
        } for f in ferramentas], 200

    @jwt_required()
    def post(self):
        dados = request.json

        if not dados.get("nome"):
            return {"erro": "nome obrigatório"}, 400

        if not dados.get("uid_rfid"):
            return {"erro": "uid_rfid obrigatório"}, 400

        existente = Ferramenta.query.filter_by(
            uid_rfid=dados["uid_rfid"]
        ).first()

        if existente:
            return {"erro": "uid_rfid já cadastrado"}, 409

        ferramenta = Ferramenta(
            nome=dados["nome"],
            categoria=dados.get("categoria"),
            descricao=dados.get("descricao"),
            uid_rfid=dados["uid_rfid"],
            status=dados.get("status", "DISPONIVEL"),
            ativo=True
        )

        db.session.add(ferramenta)
        db.session.commit()

        return {"msg": "Ferramenta cadastrada", "id": ferramenta.id}, 201


class FerramentaDetalheResource(Resource):

    def get(self, id):
        ferramenta = Ferramenta.query.get(id)

        if not ferramenta:
            return {"erro": "Ferramenta não encontrada"}, 404

        return {
            "id": ferramenta.id,
            "nome": ferramenta.nome,
            "categoria": ferramenta.categoria,
            "descricao": ferramenta.descricao,
            "uid_rfid": ferramenta.uid_rfid,
            "status": ferramenta.status,
            "ativo": ferramenta.ativo,
            "created_at": str(ferramenta.created_at)
        }, 200

    @jwt_required()
    def put(self, id):
        ferramenta = Ferramenta.query.get(id)

        if not ferramenta:
            return {"erro": "Ferramenta não encontrada"}, 404

        dados = request.json

        if dados.get("nome"):
            ferramenta.nome = dados["nome"]
        if dados.get("categoria"):
            ferramenta.categoria = dados["categoria"]
        if dados.get("descricao"):
            ferramenta.descricao = dados["descricao"]
        if dados.get("status"):
            ferramenta.status = dados["status"]
        if dados.get("uid_rfid"):
            ferramenta.uid_rfid = dados["uid_rfid"]

        db.session.commit()

        return {"msg": "Ferramenta atualizada"}, 200

    @jwt_required()
    def delete(self, id):
        ferramenta = Ferramenta.query.get(id)

        if not ferramenta:
            return {"erro": "Ferramenta não encontrada"}, 404

        ferramenta.ativo = False
        db.session.commit()

        return {"msg": "Ferramenta desativada"}, 200


# =========================
# USUÁRIOS
# =========================
class UsuarioResource(Resource):

    def get(self):
        usuarios = Usuario.query.filter_by(ativo=True).all()

        return [{
            "id": u.id,
            "nome": u.nome,
            "matricula": u.matricula,
            "setor": u.setor,
            "uid_rfid": u.uid_rfid,
            "ativo": u.ativo,
            "perfil_id": u.perfil_id,
            "etapa_id": u.etapa_id
        } for u in usuarios], 200

    @jwt_required()
    def post(self):
        dados = request.json

        if not dados.get("nome"):
            return {"erro": "nome obrigatório"}, 400
        if not dados.get("matricula"):
            return {"erro": "matricula obrigatória"}, 400
        if not dados.get("perfil_id"):
            return {"erro": "perfil obrigatório"}, 400

        existente = Usuario.query.filter_by(
            matricula=dados["matricula"]
        ).first()

        if existente:
            return {"erro": "matricula já cadastrada"}, 409

        senha_hash = None
        if dados.get("senha"):
            senha_hash = generate_password_hash(dados["senha"])

        usuario = Usuario(
            nome=dados["nome"],
            matricula=dados["matricula"],
            setor=dados.get("setor"),
            uid_rfid=dados.get("uid_rfid"),
            perfil_id=dados["perfil_id"],
            etapa_id=dados.get("etapa_id"),
            ativo=True,
            senha_hash=senha_hash
        )

        db.session.add(usuario)
        db.session.commit()

        return {"msg": "Usuário cadastrado", "id": usuario.id}, 201


class UsuarioDetalheResource(Resource):

    def get(self, id):
        usuario = Usuario.query.get(id)

        if not usuario:
            return {"erro": "Usuário não encontrado"}, 404

        return {
            "id": usuario.id,
            "nome": usuario.nome,
            "matricula": usuario.matricula,
            "setor": usuario.setor,
            "uid_rfid": usuario.uid_rfid,
            "ativo": usuario.ativo,
            "perfil_id": usuario.perfil_id,
            "etapa_id": usuario.etapa_id
        }, 200

    @jwt_required()
    def put(self, id):
        usuario = Usuario.query.get(id)

        if not usuario:
            return {"erro": "Usuário não encontrado"}, 404

        dados = request.json

        if dados.get("nome"):
            usuario.nome = dados["nome"]
        if dados.get("setor"):
            usuario.setor = dados["setor"]
        if dados.get("uid_rfid"):
            usuario.uid_rfid = dados["uid_rfid"]
        if dados.get("perfil_id"):
            usuario.perfil_id = dados["perfil_id"]
        if dados.get("etapa_id"):
            usuario.etapa_id = dados["etapa_id"]
        if dados.get("senha"):
            usuario.senha_hash = bcrypt.hashpw(
                dados["senha"].encode(),
                bcrypt.gensalt()
            ).decode()

        db.session.commit()

        return {"msg": "Usuário atualizado"}, 200

    @jwt_required()
    def delete(self, id):
        usuario = Usuario.query.get(id)

        if not usuario:
            return {"erro": "Usuário não encontrado"}, 404

        usuario.ativo = False
        db.session.commit()

        return {"msg": "Usuário desativado"}, 200


# =========================
# ETAPAS
# =========================
class EtapaResource(Resource):

    def get(self):
        etapas = EtapaProcesso.query.filter_by(ativo=True).order_by(
            EtapaProcesso.ordem
        ).all()

        return [{
            "id": e.id,
            "nome": e.nome,
            "descricao": e.descricao,
            "ordem": e.ordem,
            "ativo": e.ativo
        } for e in etapas], 200

    @jwt_required()
    def post(self):
        dados = request.json

        if not dados.get("nome"):
            return {"erro": "nome obrigatório"}, 400
        if not dados.get("ordem"):
            return {"erro": "ordem obrigatória"}, 400

        etapa = EtapaProcesso(
            nome=dados["nome"],
            descricao=dados.get("descricao"),
            ordem=dados["ordem"],
            ativo=True
        )

        db.session.add(etapa)
        db.session.commit()

        return {"msg": "Etapa cadastrada", "id": etapa.id}, 201


class EtapaDetalheResource(Resource):

    def get(self, id):
        etapa = EtapaProcesso.query.get(id)

        if not etapa:
            return {"erro": "Etapa não encontrada"}, 404

        return {
            "id": etapa.id,
            "nome": etapa.nome,
            "descricao": etapa.descricao,
            "ordem": etapa.ordem,
            "ativo": etapa.ativo
        }, 200

    @jwt_required()
    def put(self, id):
        etapa = EtapaProcesso.query.get(id)

        if not etapa:
            return {"erro": "Etapa não encontrada"}, 404

        dados = request.json

        if dados.get("nome"):
            etapa.nome = dados["nome"]
        if dados.get("descricao"):
            etapa.descricao = dados["descricao"]
        if dados.get("ordem"):
            etapa.ordem = dados["ordem"]

        db.session.commit()

        return {"msg": "Etapa atualizada"}, 200

    @jwt_required()
    def delete(self, id):
        etapa = EtapaProcesso.query.get(id)

        if not etapa:
            return {"erro": "Etapa não encontrada"}, 404

        etapa.ativo = False
        db.session.commit()

        return {"msg": "Etapa desativada"}, 200


# =========================
# ORDENS DE PRODUÇÃO
# =========================
class OrdemProducaoResource(Resource):

    def get(self):
        ordens = OrdemProducao.query.all()

        return [{
            "id": o.id,
            "codigo": o.codigo,
            "descricao": o.descricao,
            "status": o.status,
            "data_inicio": str(o.data_inicio),
            "data_fim": str(o.data_fim) if o.data_fim else None
        } for o in ordens], 200

    @jwt_required()
    def post(self):
        dados = request.json

        if not dados.get("codigo"):
            return {"erro": "codigo obrigatório"}, 400
        if not dados.get("descricao"):
            return {"erro": "descricao obrigatória"}, 400
        if not dados.get("data_inicio"):
            return {"erro": "data_inicio obrigatória"}, 400

        existente = OrdemProducao.query.filter_by(
            codigo=dados["codigo"]
        ).first()

        if existente:
            return {"erro": "codigo já cadastrado"}, 409

        from datetime import datetime
        op = OrdemProducao(
            codigo=dados["codigo"],
            descricao=dados["descricao"],
            status=dados.get("status", "ABERTA"),
            data_inicio=datetime.fromisoformat(dados["data_inicio"]),
            data_fim=datetime.fromisoformat(dados["data_fim"]) if dados.get("data_fim") else None
        )

        db.session.add(op)
        db.session.commit()

        return {"msg": "Ordem de produção cadastrada", "id": op.id}, 201


class OrdemProducaoDetalheResource(Resource):

    def get(self, id):
        op = OrdemProducao.query.get(id)

        if not op:
            return {"erro": "Ordem não encontrada"}, 404

        return {
            "id": op.id,
            "codigo": op.codigo,
            "descricao": op.descricao,
            "status": op.status,
            "data_inicio": str(op.data_inicio),
            "data_fim": str(op.data_fim) if op.data_fim else None
        }, 200

    @jwt_required()
    def put(self, id):
        op = OrdemProducao.query.get(id)

        if not op:
            return {"erro": "Ordem não encontrada"}, 404

        dados = request.json

        from datetime import datetime

        if dados.get("descricao"):
            op.descricao = dados["descricao"]
        if dados.get("status"):
            op.status = dados["status"]
        if dados.get("data_fim"):
            op.data_fim = datetime.fromisoformat(dados["data_fim"])

        db.session.commit()

        return {"msg": "Ordem atualizada"}, 200

    @jwt_required()
    def delete(self, id):
        op = OrdemProducao.query.get(id)

        if not op:
            return {"erro": "Ordem não encontrada"}, 404

        db.session.delete(op)
        db.session.commit()

        return {"msg": "Ordem removida"}, 200