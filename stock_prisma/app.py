from stock_prisma.ext import configuration
from flask import Flask, render_template
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    configuration.init_app(app)
    configuration.load_extensions(app)
    CORS(app)

    return app


