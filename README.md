# Stock Prisma

> Plataforma Inteligente de Gestão de Estoque Industrial com Rastreabilidade em Tempo Real, RFID, IoT e Analytics.

![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![React](https://img.shields.io/badge/React-19-blue)
![Flask](https://img.shields.io/badge/API-Flask-green)
![Python](https://img.shields.io/badge/Python-3.12-yellow)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Docker](https://img.shields.io/badge/Container-Docker-blue)
![License](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)

---

# Sobre o Projeto

O **Stock Prisma** é uma plataforma de gestão inteligente de ferramentas e insumos industriais desenvolvida para resolver problemas de rastreabilidade, controle de estoque e monitoramento de consumo em ambientes produtivos de alta complexidade.

O projeto surgiu a partir da análise de um cenário real encontrado em indústrias de manufatura, onde o controle de ferramentas e consumíveis é frequentemente realizado por meio de planilhas, formulários físicos ou processos manuais suscetíveis a falhas humanas.

O objetivo da solução é transformar o estoque industrial em uma fonte estratégica de dados, permitindo decisões orientadas por informação, redução de perdas operacionais e aumento da produtividade.

---

# Problema Resolvido

Muitas indústrias enfrentam desafios como:

* Falta de rastreabilidade das ferramentas após sua retirada.
* Controle manual sujeito a erros.
* Perdas de materiais sem identificação do responsável.
* Estoques superdimensionados ou insuficientes.
* Ausência de indicadores de consumo.
* Dificuldade de auditoria.
* Baixa visibilidade operacional.

O Stock Prisma foi projetado para eliminar essas limitações através de automação e coleta de dados em tempo real.

---

# Solução Proposta

O sistema é composto por duas soluções principais:

## 🔹 Controle de Ferramentas via RFID

Cada ferramenta recebe uma tag RFID exclusiva.

Cada colaborador possui um crachá RFID associado ao seu cadastro.

Um portal RFID instalado na entrada e saída do almoxarifado registra automaticamente:

* Quem retirou a ferramenta
* Qual ferramenta foi retirada
* Data e horário
* Tempo de utilização
* Devolução

Todo o processo ocorre sem qualquer intervenção manual.

---

## 🔹 Prateleira Inteligente por Peso

Para consumíveis industriais, o projeto utiliza:

* Células de carga
* Controladores eletrônicos
* Leitura RFID do operador

O sistema calcula automaticamente:

* Quantidade retirada
* Quantidade devolvida
* Estoque atual
* Consumo por colaborador
* Consumo por setor

Através da diferença de peso registrada nas células de carga.

---

# Arquitetura da Solução

```text
┌─────────────────┐
│ Arduino         │
│ RFID / HX711    │
└────────┬────────┘
         │ Serial USB
         ▼
┌─────────────────┐
│ Agent StockPrism│
│ Python          │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│ Flask API       │
└────────┬────────┘
         ▼
┌─────────────────┐
│ PostgreSQL      │
└─────────────────┘
```

---

# Tecnologias Utilizadas

## Backend

### Python

Linguagem principal da camada de negócios.

Utilizada para:

* Processamento das movimentações
* Regras de estoque
* Integração com RFID
* Integração com sensores
* APIs REST

---

### Flask

Framework web utilizado para construção da API.

Principais recursos:

* Endpoints RESTful
* Serialização de dados
* Middleware
* Integração com banco de dados
* Arquitetura modular

---

### SQLAlchemy

ORM utilizado para:

* Mapeamento objeto-relacional
* Criação de modelos
* Relacionamentos
* Migrações

---

### PostgreSQL

Banco de dados relacional responsável pelo armazenamento de:

* Usuários
* Categorias
* Produtos
* Ferramentas
* Estoque
* Movimentações
* Histórico
* Logs

---

### Flask-CORS

Controle de comunicação segura entre:

* Frontend Next.js
* API Flask

---

### Gunicorn

Servidor WSGI utilizado em produção.

Benefícios:

* Alta performance
* Escalabilidade
* Balanceamento de processos

---

# Frontend

## Next.js

Framework React utilizado para construção da interface.

Benefícios:

* Renderização híbrida
* Componentização
* Excelente SEO
* Alta performance
* Estrutura escalável

---

## React

Utilizado para:

* Componentes reutilizáveis
* Estados dinâmicos
* Atualizações em tempo real
* Comunicação com API

---

## Tailwind CSS

Framework CSS utilizado para:

* Interface moderna
* Responsividade
* Padronização visual
* Desenvolvimento rápido

---

## Axios

Biblioteca responsável pelo consumo da API.

Utilizada para:

* Consultas
* Inclusões
* Atualizações
* Exclusões

---

# Funcionalidades

## Dashboard Inteligente

Painel central contendo:

* Total de itens em estoque
* Itens com estoque crítico
* Últimas movimentações
* Consumo por período
* Indicadores operacionais

---

## Gestão de Estoque

* Cadastro de materiais
* Cadastro de ferramentas
* Categorias
* Controle de saldo
* Controle de localização

---

## Controle de Movimentações

Registro de:

* Entradas
* Saídas
* Devoluções
* Ajustes

Com rastreabilidade completa.

---

## Histórico Completo

Permite visualizar:

* Quem movimentou
* O que movimentou
* Quando movimentou
* Quantidade
* Observações

---

## Controle de Responsabilidade

Cada movimentação fica vinculada ao colaborador responsável.

---

## Alertas Inteligentes

O sistema poderá gerar alertas para:

* Estoque mínimo
* Ferramentas não devolvidas
* Consumo anormal
* Possíveis perdas

---

# Segurança

O projeto segue boas práticas de desenvolvimento:

* Validação de entrada
* Controle de permissões
* Sanitização de dados
* API desacoplada
* Separação de responsabilidades

---

# Diferenciais Técnicos

O Stock Prisma não é apenas um CRUD de estoque.

O projeto demonstra conhecimentos em:

### Desenvolvimento Full Stack

* Next.js
* React
* Flask
* PostgreSQL

### Arquitetura de Sistemas

* API REST
* Separação Frontend/Backend
* Modelagem de Dados

### Internet das Coisas (IoT)

* RFID
* Sensores de peso
* Automação Industrial

### Engenharia de Software

* Escalabilidade
* Modularização
* Versionamento Git

### Banco de Dados

* Relacionamentos
* Consultas complexas
* Integridade de dados

### DevOps

* Linux
* Deploy em VPS
* Docker
* GitHub

---

# Roadmap

## Fase 1

* [x] Estrutura inicial da API
* [x] Estrutura do Frontend
* [x] Cadastro de produtos
* [x] Cadastro de categorias

## Fase 2

* [x] Movimentações de estoque
* [x] Dashboard operacional
* [x] Integração Frontend + API

## Fase 3

* [x] Integração RFID
* [ ] Integração com células de carga
* [ ] Alertas automáticos

## Fase 4

* [ ] Analytics avançado
* [ ] Previsão de consumo
* [ ] Inteligência artificial para reposição

---

# Competências Demonstradas

Este projeto evidencia experiência prática em:

* Desenvolvimento Full Stack
* APIs REST
* Python
* Flask
* React
* Next.js
* PostgreSQL
* SQL
* Git
* GitHub
* Linux
* Docker
* Arquitetura de Software
* IoT Industrial
* Automação de Processos
* Controle de Estoque
* Engenharia de Dados

---

# Autor

## Rômulo Soares Ribeiro

Desenvolvedor Full Stack com experiência em automação de processos, sistemas corporativos, integração entre aplicações e desenvolvimento de soluções para ambientes industriais.

Além da área de desenvolvimento, atua com tecnologia aplicada à produtividade, automação e transformação digital de processos empresariais.

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos, pesquisa aplicada e demonstração de competências técnicas em desenvolvimento de software e automação industrial.
