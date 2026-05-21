import os
from importlib import import_module
from dynaconf import FlaskDynaconf


def load_extensions(app):
    for extension in app.config.get("EXTENSIONS", []):
        mod = import_module(extension)
        mod.init_app(app)


def init_app(app):
    FlaskDynaconf(app)

    print("[DEBUG] EXTENSIONS:", app.config.get("EXTENSIONS"))

    load_extensions(app)

    print("[DEBUG] app urls:", app.url_map)