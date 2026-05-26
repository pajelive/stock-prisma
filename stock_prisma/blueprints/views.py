from flask import Flask, render_template
from stock_prisma.models import Movimentacao, Usuario, Ferramenta
from stock_prisma.ext.database import db

def init_app(app):

    @app.route('/')
    def index():
        return render_template("index.html")

    @app.route('/historico')
    def historico():
        movimentacoes = db.session.query(
            Movimentacao
        ).order_by(
            Movimentacao.data_hora.desc()
        ).limit(100).all()

        return render_template(
            "historico.html",
            movimentacoes=movimentacoes
        )

    @app.route('/ferramentas')
    def ferramentas():
        ferramentas = Ferramenta.query.filter_by(ativo=True).all()
        return render_template(
            "ferramentas.html",
            ferramentas=ferramentas
        )