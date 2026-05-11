from flask import jsonify, abort
from flask_restful import Resource
#from stock_prisma.ext.database import Clientes

# class ClientResource(Resource):
#     def get(self):
#         clientes = ClientResource or abort(204)
#         return jsonify({
#             'clientes': cliente.to_dict()
#             for cliente in clientes
#         })