from flask_restful import Resource
from flask import request
from sqlalchemy.orm import joinedload

from stock_prisma.services.MovimentacaoService import MovimentacaoService
from stock_prisma.models import Usuario, Ferramenta, Compartimento, Movimentacao
from stock_prisma.ext.database import db


class CompartimentoResource(Resource):

    def get(self):

        compartimentos = Compartimento.query.options(
            joinedload(Compartimento.insumo)
        ).all()

        dados = []

        for c in compartimentos:
            dados.append({
                "id": c.id,
                "nome": c.nome,
                "localizacao": c.localizacao,
                "status": c.status,
                "insumo_nome": c.insumo.nome if c.insumo else None
            })

        return dados, 200
    
    def identificar_compartimento(nome):
        compartimento = Compartimento.query.options(
            joinedload(Compartimento.insumo)
        ).filter_by(nome=nome).first()

        if not compartimento:
            return None

        return {
            "id": compartimento.id,
            "nome": compartimento.nome,
            "localizacao": compartimento.localizacao,
            "status": compartimento.status,
            "insumo_id": compartimento.insumo_id,
            "insumo_nome": compartimento.insumo.nome if compartimento.insumo else None
        }

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

    def get(self):
        page = request.args.get("page", 1, type=int)
        limit = request.args.get("limit", 12, type=int)

        if limit > 100:
            limit = 100

        if limit < 1:
            limit = 12

        if page < 1:
            page = 1

        query = Movimentacao.query.options(
            joinedload(Movimentacao.tipo_movimentacao),
            joinedload(Movimentacao.usuario),
            joinedload(Movimentacao.ferramenta),
            joinedload(Movimentacao.compartimento),
            joinedload(Movimentacao.etapa),
            joinedload(Movimentacao.ordem_producao),
        )

        total = query.count()

        paginacao = query.order_by(
            Movimentacao.data_hora.desc()
        ).paginate(
            page=page,
            per_page=limit,
            error_out=False
        )

        dados = []
        for m in paginacao.items:
            dados.append({
                "id": m.id,
                "data_hora": str(m.data_hora),
                "quantidade": m.quantidade,
                "origem_leitura": m.origem_leitura,
                "observacao": m.observacao,
                "tipo": m.tipo_movimentacao.nome if m.tipo_movimentacao else None,
                "usuario": m.usuario.nome if m.usuario else None,
                "ferramenta": m.ferramenta.nome if m.ferramenta else None,
                "compartimento": m.compartimento.nome if m.compartimento else None,
                "etapa": m.etapa.nome if m.etapa else None,
                "op": m.ordem_producao.codigo if m.ordem_producao else None,
            })

        return {
            "items": dados,
            "page": paginacao.page,
            "limit": paginacao.per_page,
            "total": total,
            "pages": paginacao.pages,
            "has_next": paginacao.has_next,
            "has_prev": paginacao.has_prev
        }, 200

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