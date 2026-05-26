from flask import Blueprint
from flask_restful import Api
from .resources import AuthResource

bp = Blueprint("admin", __name__, url_prefix="/admin")  # ← nome diferente de "restapi"

api = Api(bp)

api.add_resource(AuthResource, "/auth/login")  # → /admin/auth/login

def init_app(app):
    app.register_blueprint(bp)