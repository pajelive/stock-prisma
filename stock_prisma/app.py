from stock_prisma.ext import configuration
from flask import Flask, render_template

def create_app():
    app = Flask(__name__)
    configuration.init_app(app)
    configuration.load_extensios(app)
    return app


