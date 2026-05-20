from flask_restful import Resource
from flask import request

from stock_prisma.models import (
    Compartimento,
    Movimentacao
)

from stock_prisma.ext.database import db