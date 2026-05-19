class OrdemProducao:
    def __init__(
        self,
        codigo,
        descricao,
        status,
        data_inicio,
        data_fim
    ):
        self.codigo = codigo
        self.descricao = descricao
        self.status = status
        self.data_inicio = data_inicio
        self.data_fim = data_fim

        # RELACIONAMENTO
        self.etapas = []