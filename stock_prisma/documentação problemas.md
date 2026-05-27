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
✔ Arquitetura Flask padronizada

# Problema: 404 na Vercel — Monorepo Python + Next.js

## Contexto

O repositório `stock-prisma` possui estrutura de monorepo com dois projetos:

- **Backend** Flask/Python na raiz do repo (`wsgi.py`, `stock_prisma/`)
- **Frontend** Next.js em `stock_prisma_interface/`

---

## Sintomas

- Build local (`npm run build`) concluía com sucesso
- Deploy na Vercel também concluía com status **Ready**
- Todas as URLs retornavam `404: NOT_FOUND` (erro da Vercel, não da aplicação)
- Erro com ID no formato `gru1::xxxx-xxxxxxxxxx-xxxxxxxxxxxx`

---

## Causa Raiz

Dois fatores combinados causaram o problema:

### 1. `vercel.json` Python na raiz do repo

Havia um `vercel.json` na raiz apontando para o backend Python:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "wsgi.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "wsgi.py"
    }
  ]
}
```

Esse arquivo fazia a Vercel tratar o projeto inteiro como Python, redirecionando todas as requisições para o `wsgi.py` — que não estava sendo servido corretamente — resultando em 404 para todas as rotas.

### 2. Ausência de configuração de Root Directory

Sem indicar à Vercel onde estava o projeto Next.js, ela tentava buildar a partir da raiz do repo, onde só existe código Python.

---

## Solução

### Passo 1 — Configurar Root Directory na Vercel

No painel da Vercel:

```
Projeto → Settings → General → Root Directory → stock_prisma_interface
```

Isso instrui a Vercel a tratar `stock_prisma_interface/` como raiz do projeto.

### Passo 2 — Substituir o `vercel.json` da raiz

Remover o `vercel.json` Python e criar um novo na raiz do repo informando o framework correto:

```json
{
  "framework": "nextjs"
}
```

```bash
# Na raiz do repo
cat > vercel.json << 'EOF'
{
  "framework": "nextjs"
}
EOF

git add vercel.json
git commit -m "fix: vercel.json apontando pro next.js"
git push
```

---

## Resultado

Após as duas alterações, o deploy passou a servir o frontend Next.js corretamente em todos os domínios:

- `https://stock-prisma.vercel.app` ✅
- `https://stockprisma.com.br` ✅
- `https://www.stockprisma.com.br` ✅

---

## Lição Aprendida

Em monorepos com múltiplos projetos (ex: API Python + Frontend Next.js), a Vercel precisa de duas informações explícitas:

1. **Root Directory** — onde está o projeto a ser buildado
2. **`vercel.json`** com `"framework"` correto — para não confundir com outros arquivos de configuração na raiz

> Se houver um `vercel.json` antigo de outro projeto na raiz do repo, ele **sempre** vai sobrescrever as configurações da Vercel, independente do Root Directory configurado no painel.