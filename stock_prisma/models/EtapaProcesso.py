class EtapaProcesso:
    def __init__(
        self,
        nome,
        descricao,
        ordem,
        ativo,
        ordem_producao
    ):
        self.nome = nome
        self.descricao = descricao
        self.ordem = ordem
        self.ativo = ativo

        # RELACIONAMENTO
        self.ordem_producao = ordem_producao