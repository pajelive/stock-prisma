
# Stock Prisma API Documentation

## Base URL

```txt
http://127.0.0.1:5000/
```

---

# Visão Geral

A API do Stock Prisma é responsável por:

- Controle de compartimentos
- Registro de movimentações
- Integração com leitores RFID
- Controle de ferramentas e insumos
- Auditoria de operações

A principal funcionalidade da API atualmente é o registro de movimentações através do endpoint `/movimentacoes`.

---

# Fluxo da API

```text
Cliente/ESP32/Sistema
        ↓
POST /movimentacoes
        ↓
Validação do usuário RFID
        ↓
Busca das entidades relacionadas
        ↓
Atualização de peso do compartimento
        ↓
Registro da movimentação
        ↓
Persistência no banco
```

---

# Endpoint: Compartimentos

## Listar Compartimentos

Retorna todos os compartimentos cadastrados.

---

## Request

```http
GET /compartimentos
```

### Exemplo

```http
GET http://127.0.0.1:5000/compartimentos
```

---

## Response

### Status

```http
200 OK
```

### Body

```json
[
  {
    "id": 1,
    "nome": "Compartimento A1",
    "localizacao": "Setor Norte",
    "peso_atual": 12.5,
    "status": "ativo",
    "insumo_id": 3
  },
  {
    "id": 2,
    "nome": "Compartimento B2",
    "localizacao": "Almoxarifado",
    "peso_atual": 4.7,
    "status": "vazio",
    "insumo_id": 1
  }
]
```

---

# Endpoint: Movimentações

## Registrar Movimentação

Endpoint responsável por registrar movimentações de estoque, ferramentas e alterações em compartimentos.

---

# Request

## Endpoint

```http
POST /movimentacoes
```

---

## Headers

```http
Content-Type: application/json
```

---

# Estrutura Completa do Body

## JSON esperado

```json
{
  "usuario_uid": "04AABBCCDD",
  "compartimento_id": 1,
  "ferramenta_id": 2,
  "tipo_movimentacao": "RETIRADA",
  "quantidade": 1,
  "origem": "ESP32",
  "observacao": "Ferramenta retirada para manutenção",
  "peso_atual": 7.3
}
```

---

# Regras de Negócio

## 1. Usuário RFID obrigatório

A API SEMPRE valida o usuário através do campo:

```json
{
  "usuario_uid": "04AABBCCDD"
}
```

Internamente a busca é realizada usando:

```python
Usuario.query.filter_by(uid_rfid=data["usuario_uid"])
```

---

## 2. Usuário inexistente

Caso o UID RFID não exista no banco:

- A movimentação NÃO será registrada
- A API retornará erro

### Response

```http
400 Bad Request
```

```json
{
  "erro": "Usuário não encontrado"
}
```

---

## 3. Compartimento opcional

O campo:

```json
{
  "compartimento_id": 1
}
```

é opcional.

Se informado:

- A API busca o compartimento
- O peso poderá ser atualizado

---

## 4. Atualização automática de peso

Se o campo `peso_atual` for enviado:

```json
{
  "peso_atual": 7.3
}
```

o sistema atualizará automaticamente:

```python
compartimento.peso_atual = data.get(
    "peso_atual",
    compartimento.peso_atual
)
```

---

## 5. Ferramenta opcional

O campo:

```json
{
  "ferramenta_id": 2
}
```

é opcional.

Quando informado:

- A ferramenta será associada à movimentação

---

## 6. Tipo de movimentação

A API busca o tipo utilizando o campo:

```json
{
  "tipo_movimentacao": "RETIRADA"
}
```

Internamente:

```python
TipoMovimentacao.query.filter_by(
    nome=data["tipo_movimentacao"]
)
```

---

# Valores padrão

Caso alguns campos não sejam enviados:

| Campo | Valor utilizado |
|---|---|
| quantidade | `1` |
| origem | `"API"` |

---

# Exemplos de Uso

## 1. Retirada de ferramenta

```json
{
  "usuario_uid": "04AABBCCDD",
  "ferramenta_id": 3,
  "tipo_movimentacao": "RETIRADA",
  "origem": "ESP32"
}
```

---

## 2. Entrada de estoque

```json
{
  "usuario_uid": "04AABBCCDD",
  "compartimento_id": 1,
  "tipo_movimentacao": "ENTRADA",
  "quantidade": 5,
  "peso_atual": 20.4
}
```

---

## 3. Atualização de peso

```json
{
  "usuario_uid": "04AABBCCDD",
  "compartimento_id": 1,
  "peso_atual": 15.7
}
```

---

# Respostas da API

## Sucesso

### Status

```http
201 Created
```

### Body

```json
{
  "msg": "Movimentação registrada",
  "id": 15
}
```

---

## Erro de validação

### Status

```http
400 Bad Request
```

### Body

```json
{
  "erro": "Usuário não encontrado"
}
```

---

## Erro interno

### Status

```http
500 Internal Server Error
```

### Body

```json
{
  "erro": "erro interno"
}
```

---

# Estrutura Interna da Movimentação

Ao registrar uma movimentação, o sistema cria:

```python
Movimentacao(
    usuario_id=usuario.id,
    compartimento_id=compartimento.id,
    ferramenta_id=ferramenta.id,
    tipo_movimentacao_id=tipo.id,
    quantidade=data.get("quantidade", 1),
    origem_leitura=data.get("origem", "API"),
    observacao=data.get("observacao"),
    data_hora=datetime.utcnow()
)
```

---

# Fluxo Interno da Service

## Processo executado

```text
1. Recebe JSON
2. Valida usuário RFID
3. Busca compartimento
4. Busca ferramenta
5. Busca tipo de movimentação
6. Atualiza peso do compartimento
7. Cria movimentação
8. Executa commit no banco
```

---

# Exemplo utilizando Python

```python
import requests

url = "http://127.0.0.1:5000/movimentacoes"

payload = {
    "usuario_uid": "04AABBCCDD",
    "compartimento_id": 1,
    "tipo_movimentacao": "RETIRADA",
    "quantidade": 1,
    "origem": "ESP32"
}

response = requests.post(url, json=payload)

print(response.status_code)
print(response.json())
```

---

# Exemplo utilizando JavaScript

```javascript
fetch("http://127.0.0.1:5000/movimentacoes", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        usuario_uid: "04AABBCCDD",
        compartimento_id: 1,
        tipo_movimentacao: "RETIRADA",
        quantidade: 1
    })
})
.then(response => response.json())
.then(data => console.log(data))
```

---

# Estruturas Dependentes

A movimentação depende das seguintes entidades:

- Usuario
- Compartimento
- Ferramenta
- TipoMovimentacao
- Movimentacao

---

# Tecnologias

- Flask
- Flask-RESTful
- SQLAlchemy
- PostgreSQL
- Supabase
