from stock_prisma.app import create_app
from stock_prisma.ext.database import db
from stock_prisma.models import Usuario, Compartimento, Movimentacao, TipoMovimentacao

app = create_app()

with app.app_context():

    # pega dados existentes (ou crie depois)
    usuario = Usuario.query.first()
    compartimento = Compartimento.query.first()
    tipo = TipoMovimentacao.query.first()

    mov = Movimentacao(
        usuario_id=usuario.id,
        compartimento_id=compartimento.id,
        tipo_movimentacao_id=tipo.id,
        quantidade=10,
        origem_leitura="MANUAL",
        observacao="teste inicial"
    )

    db.session.add(mov)
    db.session.commit()

    print("Movimentação criada com sucesso!")