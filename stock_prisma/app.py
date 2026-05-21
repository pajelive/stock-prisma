from flask import Flask

def create_app():
    app = Flask(__name__)

    print("APP INICIOU OK")

    @app.get("/")
    def home():
        return {"status": "ok"}

    return app
