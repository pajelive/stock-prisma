from flask import Flask, render_template
#import database

def init_app(app):
    @app.route('/')
    def index():
        products = ['teste1','teste2','teste3']
        return render_template("index.html", products=products)
