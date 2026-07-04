from flask_restful import Resource
from flask import request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies, get_jwt_identity, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash

from stock_prisma.models import (
    Usuario,
    Ferramenta,
    Perfil,
    EtapaProcesso,
    OrdemProducao,
    Compartimento,
    Insumo
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
        #foi necessário forçar o cookie como resposta porque o Flask-RESTful espera sempre retornar json
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
            "nome": usuario.nome,
            "perfil": usuario.perfil.nome
        }, 200

class LogoutResource(Resource):
    @jwt_required()
    def post(self):
        response = make_response(jsonify({"msg": "logout realizado"}), 200)
        unset_jwt_cookies(response)
        return response
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


from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from stock_prisma.models import db, Compartimento, Insumo

class CompartimentoAdminResource(Resource):

    @jwt_required()
    def get(self, id=None):
        """
        Rota GET responsável por listar os compartimentos no painel.
        Mapeia a coluna 'quantidade' diretamente para o JSON.
        """
        if id:
            compartimento = Compartimento.query.get(id)
            if not compartimento:
                return {"erro": "Compartimento não encontrado"}, 404
                
            insumo_nome = compartimento.insumo.nome if compartimento.insumo else None
            return {
                "id": compartimento.id,
                "nome": compartimento.nome,
                "localizacao": compartimento.localizacao,
                "status": compartimento.status,
                "peso_tara": compartimento.peso_tara,
                "peso_atual": compartimento.peso_atual,
                "quantidade": compartimento.quantidade,  # 🚀 Padronizado
                "sensor_ativo": compartimento.sensor_ativo,
                "insumo_id": compartimento.insumo_id,
                "insumo_nome": insumo_nome
            }, 200

        # Caso busque todos os compartimentos (Listagem Geral)
        compartimentos = Compartimento.query.all()
        resultado = []
        for c in compartimentos:
            insumo_nome = c.insumo.nome if c.insumo else None
            resultado.append({
                "id": c.id,
                "nome": c.nome,
                "localizacao": c.localizacao,
                "status": c.status,
                "peso_tara": c.peso_tara,
                "peso_atual": c.peso_atual,
                "quantidade": c.quantidade,  # 🚀 Padronizado
                "sensor_ativo": c.sensor_ativo,
                "insumo_id": c.insumo_id,
                "insumo_nome": insumo_nome
            })
        return resultado, 200

    @jwt_required()
    def put(self, id):
        compartimento = Compartimento.query.get(id)

        if not compartimento:
            return {"erro": "compartimento não encontrado"}, 404

        dados = request.json

        if dados.get("nome"):
            compartimento.nome = dados["nome"]
        if dados.get("localizacao") is not None:
            compartimento.localizacao = dados["localizacao"]
        if dados.get("status"):
            compartimento.status = dados["status"]
        if dados.get("peso_tara") is not None:
            compartimento.peso_tara = dados["peso_tara"]
        if "sensor_ativo" in dados:
            compartimento.sensor_ativo = dados["sensor_ativo"]

        # SALVA O INSUMO NO COMPARTIMENTO (Edição)
        if "insumo_id" in dados:
            compartimento.insumo_id = dados["insumo_id"]

        db.session.commit()
        return {
            "msg": "Compartimento updated",
            "quantidade": compartimento.quantidade,  # 🚀 Padronizado
            "peso_atual": compartimento.peso_atual
        }, 200

    @jwt_required()
    def delete(self, id):
        compartimento = Compartimento.query.get(id)

        if not compartimento:
            return {"erro": "Compartimento não encontrado"}, 404

        db.session.delete(compartimento)
        db.session.commit()
        return {"msg": "Compartimento removido"}, 200

    @jwt_required()
    def post(self):
        dados = request.json

        if not dados.get("nome"):
            return {"erro": "nome obrigatório"}, 400

        # Criando a nova instância com o atributo correto
        novo_compartimento = Compartimento(
            nome=dados["nome"],
            localizacao=dados.get("localizacao"),
            status=dados.get("status", "ATIVO"),
            peso_tara=dados.get("peso_tara", 0.0),
            peso_atual=0.0,
            quantidade=0,  # 🚀 Padronizado para quantidade iniciar em 0 inteiro
            sensor_ativo=dados.get("sensor_ativo", True),
            insumo_id=dados.get("insumo_id")
        )

        db.session.add(novo_compartimento)
        db.session.commit()

        insumo_nome = None
        if novo_compartimento.insumo_id:
            insumo = Insumo.query.get(novo_compartimento.insumo_id)
            if insumo:
                insumo_nome = insumo.nome

        return {
            "id": novo_compartimento.id,
            "nome": novo_compartimento.nome,
            "localizacao": novo_compartimento.localizacao,
            "status": novo_compartimento.status,
            "peso_tara": novo_compartimento.peso_tara,
            "sensor_ativo": novo_compartimento.sensor_ativo,
            "peso_atual": novo_compartimento.peso_atual,
            "quantidade": novo_compartimento.quantidade,  # 🚀 Padronizado
            "insumo_id": novo_compartimento.insumo_id,
            "insumo_nome": insumo_nome
        }, 201
# =========================
# INSUMOS
# =========================
class InsumoResource(Resource):
    @jwt_required()
    def get(self):
        insumos = Insumo.query.filter_by(ativo=True).all()
        return [{
            "id": i.id,
            "nome": i.nome,
            "categoria": i.categoria,
            "unidade": i.unidade,
            "uid_rfid": i.uid_rfid,
            "peso_unitario": i.peso_unitario
        } for i in insumos], 200

    @jwt_required()
    def post(self):
        """MÉTODO CORRIGIDO: Salva um novo Insumo validando os campos obrigatórios"""
        dados = request.json

        # Validações dos campos obrigatórios do banco de dados
        if not dados.get("nome"):
            return {"erro": "nome do insumo é obrigatório"}, 400
        if not dados.get("categoria"):
            return {"erro": "categoria é obrigatória"}, 400
        if not dados.get("unidade"):
            return {"erro": "unidade de medida é obrigatória (ex: kg, L, un)"}, 400
        if not dados.get("uid_rfid"):
            return {"erro": "uid_rfid é obrigatório"}, 400
        if dados.get("peso_unitario") is None:
            return {"erro": "peso_unitario é obrigatório"}, 400

        # Opcional: Validar se o uid_rfid já existe (já que ele é UNIQUE no banco)
        if Insumo.query.filter_by(uid_rfid=dados["uid_rfid"]).first():
            return {"erro": "Este uid_rfid já está cadastrado em outro insumo"}, 400

        novo_insumo = Insumo(
            nome=dados["nome"],
            categoria=dados["categoria"],
            unidade=dados["unidade"],
            uid_rfid=dados["uid_rfid"],
            peso_unitario=float(dados["peso_unitario"]),
            ativo=True
        )

        db.session.add(novo_insumo)
        db.session.commit()

        return {
            "id": novo_insumo.id,
            "nome": novo_insumo.nome,
            "categoria": novo_insumo.categoria,
            "unidade": novo_insumo.unidade,
            "uid_rfid": novo_insumo.uid_rfid,
            "peso_unitario": novo_insumo.peso_unitario
        }, 201


class InsumoDetalheResource(Resource):

    @jwt_required()
    def get(self, id):
        insumo = Insumo.query.filter_by(id=id, ativo=True).first()

        if not insumo:
            return {"erro": "Insumo não encontrado"}, 404

        return {
            "id": insumo.id,
            "nome": insumo.nome,
            "categoria": insumo.categoria,
            "unidade": insumo.unidade,
            "uid_rfid": insumo.uid_rfid,
            "peso_unitario": insumo.peso_unitario,
            "ativo": insumo.ativo
        }, 200

    @jwt_required()
    def put(self, id):
        insumo = Insumo.query.filter_by(id=id, ativo=True).first()

        if not insumo:
            return {"erro": "Insumo não encontrado"}, 404

        dados = request.json

        if dados.get("nome"):
            insumo.nome = dados["nome"]
        if dados.get("categoria"):
            insumo.categoria = dados["categoria"]
        if dados.get("unidade"):
            insumo.unidade = dados["unidade"]
        if dados.get("uid_rfid"):
            # Opcional: validar unicidade se o RFID for alterado
            existente = Insumo.query.filter_by(uid_rfid=dados["uid_rfid"]).first()
            if existente and existente.id != id:
                return {"erro": "Este uid_rfid já está em uso por outro insumo"}, 400
            insumo.uid_rfid = dados["uid_rfid"]
        if dados.get("peso_unitario") is not None:
            insumo.peso_unitario = float(dados["peso_unitario"])

        db.session.commit()

        return {"msg": "Insumo atualizado"}, 200

    @jwt_required()
    def delete(self, id):
        insumo = Insumo.query.get(id)

        if not insumo:
            return {"erro": "Insumo não encontrado"}, 404

        # Perfeito: Mantida a exclusão lógica recomendada por boas práticas
        insumo.ativo = False
        db.session.commit()

        return {"msg": "Insumo desativado"}, 200