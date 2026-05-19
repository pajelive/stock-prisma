-- Script criado para Postgree SQL

CREATE TABLE perfil (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(300),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    perfil_id BIGINT REFERENCES perfil(id),
    nome VARCHAR(150) NOT NULL,
    matricula INT NOT NULL,
    uid_rfid VARCHAR(30) UNIQUE NOT NULL,
    setor VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ordem_producao (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(150) UNIQUE NOT NULL,
    descricao VARCHAR(300),
    status VARCHAR(30),
    data_inicio DATE,
    data_fim DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE etapa_processo (
    id BIGSERIAL PRIMARY KEY,
    op_id BIGINT REFERENCES ordem_producao(id),
    nome VARCHAR(30),
    descricao VARCHAR(150),
    ordem INT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tipo_movimentacao (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(300),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE insumo (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    unidade VARCHAR(50),
    uid_rfid VARCHAR(30) UNIQUE,
    peso_unitario NUMERIC(10,2),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compartimento (
    id BIGSERIAL PRIMARY KEY,
    insumo_id BIGINT REFERENCES insumo(id),
    nome VARCHAR(50),
    localizacao VARCHAR(50),
    peso_atual NUMERIC(10,2),
    peso_tara NUMERIC(10,2),
    sensor_ativo BOOLEAN DEFAULT TRUE,
    status VARCHAR(100),
    ultima_calibracao DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE movimentacao (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuario(id),
    insumo_id BIGINT REFERENCES insumo(id),
    op_id BIGINT REFERENCES ordem_producao(id),
    etapa_id BIGINT REFERENCES etapa_processo(id),
    tipo_movimentacao_id BIGINT REFERENCES tipo_movimentacao(id),
    quantidade INT,
    data_hora TIMESTAMP DEFAULT NOW(),
    origem_leitura VARCHAR(100),
    observacao VARCHAR(300),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alerta_estoque (
    id BIGSERIAL PRIMARY KEY,
    compartimento_id BIGINT REFERENCES compartimento(id),
    tipo VARCHAR(30),
    mensagem VARCHAR(300),
    qtd_atual INT,
    qtd_minima INT,
    gerado_em TIMESTAMP DEFAULT NOW(),
    resolvido BOOLEAN DEFAULT FALSE,
    resolvido_em TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);