from stock_prisma.app import create_app
from stock_prisma.ext.database import db

from stock_prisma.models import Ferramenta, Usuario, Compartimento, TipoMovimentacao, Movimentacao

from datetime import datetime

app = create_app()

with app.app_context():

    # -------------------------
    # 1. cria ferramenta
    # -------------------------
    ferramenta = Ferramenta(
        nome="Parafusadeira Bosch",
        categoria="Elétrica",
        descricao="Ferramenta elétrica de montagem",
        uid_rfid="RFID_FERR_001",
        status="DISPONIVEL",
        ativo=True
    )

    db.session.add(ferramenta)
    db.session.commit()

    print("[OK] Ferramenta criada")

    # -------------------------
    # 2. busca dependências
    # -------------------------
    usuario = Usuario.query.first()
    compartimento = Compartimento.query.first()
    tipo = TipoMovimentacao.query.first()

    if not usuario or not compartimento or not tipo:
        print("❌ Dados base não encontrados")
        exit()

    # -------------------------
    # 3. cria movimentação com ferramenta
    # -------------------------
    mov = Movimentacao(
        usuario_id=usuario.id,
        compartimento_id=compartimento.id,
        ferramenta_id=ferramenta.id,
        tipo_movimentacao_id=tipo.id,

        quantidade=1,
        data_hora=datetime.now(),
        origem_leitura="RFID",
        observacao="Teste ferramenta"
    )

    db.session.add(mov)
    db.session.commit()

    print("[OK] Movimentação com ferramenta criada")

    print("\n🔥 Teste finalizado com sucesso!")