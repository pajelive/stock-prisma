from stock_prisma.app import create_app
from stock_prisma.ext.database import db
from stock_prisma.models import OrdemProducao, EtapaProcesso

app = create_app()

with app.app_context():

    op = OrdemProducao(
        codigo="OP-105",
        descricao="Produção de peças",
        status="EM_ANDAMENTO"
    )

    db.session.add(op)
    db.session.commit()

    print("[OK] Ordem de produção criada")


    etapa = EtapaProcesso(
        nome="Separação",
        descricao="Separação de materiais",
        ordem=1,
        ativo=True,
        op_id=op.id
    )

    db.session.add(etapa)
    db.session.commit()

    print("[OK] Etapa criada")

    print("\n🔥 Teste finalizado com sucesso!")