from flask import Blueprint
from flask_restful import Api
from .resources import (CompartimentoResource,MovimentacaoResource, TipoRFIDResource)

bp = Blueprint("restapi", __name__,url_prefix="/api/v1/public")

api = Api(bp)

api.add_resource(CompartimentoResource,"/compartimentos")

api.add_resource(MovimentacaoResource,"/movimentacoes")

api.add_resource(TipoRFIDResource,"/rfid/<string:uid>")

# conecta blueprint no flask
def init_app(app):
    app.register_blueprint(bp)