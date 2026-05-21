# Resumo dos Problemas – Flask + SQLAlchemy + Supabase + Vercel

## Projeto: Backend Flask com Supabase (Postgres) na Vercel

---

# 1. Erro de Dialeto do SQLAlchemy

## ❌ Problema

```
sqlalchemy.exc.NoSuchModuleError: Can't load plugin: sqlalchemy.dialects:postgres
```

## 💥 Causa

URL do banco estava no formato antigo:

```text
postgres://user:pass@host:5432/db
```

SQLAlchemy 2.x não aceita mais esse formato.

---

## ✅ Solução

### Antes (quebrava):

```python
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("POSTGRES_PRISMA_URL")
```

### Depois (corrigido):

```python
database_url = os.getenv("POSTGRES_PRISMA_URL")
database_url = database_url.replace("postgres://", "postgresql://")
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
```

---

# 2. Erro com pgbouncer na URL

## ❌ Problema

```
invalid connection option "pgbouncer"
```

## 💥 Causa

A Vercel/Supabase adicionava automaticamente:

```text
?pgbouncer=true
```

O driver psycopg2 não aceita esse parâmetro.

---

## ✅ Solução

### Correção aplicada:

```python
if "?pgbouncer=true" in database_url:
    database_url = database_url.replace("?pgbouncer=true", "")

if "?" in database_url:
    database_url = database_url.split("?")[0]
```

---

# 3. Mistura de SQLAlchemy puro com Flask-SQLAlchemy

## ❌ Problema

Arquitetura híbrida:

* create_engine
* sessionmaker
* Flask-SQLAlchemy ao mesmo tempo

Isso causava conflito no serverless.

---

## 💥 Código antigo (problemático):

```python
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()
```

---

## ✅ Solução final

Migração completa para Flask-SQLAlchemy:

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
```

```python
db.init_app(app)
```

---

# 4. Crashes na Vercel (FUNCTION_INVOCATION_FAILED)

## ❌ Problema

```
500: FUNCTION_INVOCATION_FAILED
```

## 💥 Causa

* engine criado no import
* conexão aberta fora do contexto Flask

---

## ❌ Código errado:

```python
engine = create_engine(DATABASE_URL)
```

---

## ✅ Solução:

Mover toda inicialização para Flask:

```python
def create_app():
    app = Flask(__name__)
    db.init_app(app)
    return app
```

---

# 5. Importações circulares

## ❌ Problema

Erro durante bootstrap:

* services importando models
* models importando db indiretamente

---

## 💥 Sintoma

Crash aleatório na Vercel ao subir função

---

## ✅ Solução

Mover imports para dentro de funções:

```python
class MovimentacaoService:
    def registrar_movimentacao(data):
        from stock_prisma.models import Usuario
```

---

# 6. Configuração da Vercel

## ❌ Problema

Variáveis inconsistentes:

* POSTGRES_URL
* POSTGRES_PRISMA_URL
* SQLALCHEMY_DATABASE_URI manual

---

## ✅ Correto:

```text
POSTGRES_PRISMA_URL (Vercel Supabase Integration)
```

---

# 7. Arquitetura final correta

## ✅ app.py final

```python
database_url = os.getenv("POSTGRES_PRISMA_URL")
database_url = database_url.replace("postgres://", "postgresql://")

if "?pgbouncer=true" in database_url:
    database_url = database_url.replace("?pgbouncer=true", "")
```

```python
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
db.init_app(app)
```

---

# 🎯 Resultado final após correções

✔ API funcionando na Vercel
✔ Supabase conectado corretamente
✔ Flask-SQLAlchemy estável
✔ Sem crashes de deploy
✔ Endpoints respondendo JSON

---

# 🧠 Conclusão

Os problemas vieram de 3 fontes principais:

1. URL de conexão incompatível (postgres vs postgresql)
2. Parâmetro pgbouncer inválido na DSN
3. Mistura de SQLAlchemy puro com Flask-SQLAlchemy

---

# 🚀 Estado final do projeto

✔ Backend estável em serverless
✔ Banco conectado corretamente
✔ Arquitetura Flask padronizad
