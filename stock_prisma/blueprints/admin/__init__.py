from flask import Blueprint
from flask_restful import Api
from .resources import (
    AuthResource,
    FerramentaResource,
    FerramentaDetalheResource,
    UsuarioResource,
    UsuarioDetalheResource,
    EtapaResource,
    EtapaDetalheResource,
    OrdemProducaoResource,
    OrdemProducaoDetalheResource,
    MeResource,
    LogoutResource,
    InsumoResource,
    CompartimentoAdminResource
)

bp = Blueprint("admin", __name__, url_prefix="/api/v1/admin")

api = Api(bp)

api.add_resource(AuthResource, "/auth/login")

api.add_resource(FerramentaResource, "/ferramentas")
api.add_resource(FerramentaDetalheResource, "/ferramentas/<int:id>")

api.add_resource(InsumoResource, "/insumos")
api.add_resource(CompartimentoAdminResource, "/compartimentos/<int:id>")


api.add_resource(UsuarioResource, "/usuarios")
api.add_resource(UsuarioDetalheResource, "/usuarios/<int:id>")

api.add_resource(EtapaResource, "/etapas")
api.add_resource(EtapaDetalheResource, "/etapas/<int:id>")

api.add_resource(OrdemProducaoResource, "/ordens-producao")
api.add_resource(OrdemProducaoDetalheResource, "/ordens-producao/<int:id>")

api.add_resource(MeResource,"/auth/me")
api.add_resource(LogoutResource, "/auth/logout")

def init_app(app):
    app.register_blueprint(bp)