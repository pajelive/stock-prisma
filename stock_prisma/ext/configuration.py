from importlib import import_module
from dynaconf import FlaskDynaconf
from flask import Flask

def load_extensions(app):
    for extension in app.config.get('EXTENSIONS'):
        mod = import_module(extension)
        mod.init_app(app)

#a extensão dynaconf permite ter um arquivo de configuração separado
def init_app(app):
    FlaskDynaconf(app)