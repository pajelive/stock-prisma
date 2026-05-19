class Movimentacao:
    def __init__(
        self,
        usuario,
        insumo,
        compartimento,
        ordem_producao,
        etapa_processo,
        tipo_movimentacao,
        quantidade,
        data_hora,
        origem_leitura,
        observacao
    ):

        # RELACIONAMENTOS
        self.usuario = usuario
        self.insumo = insumo
        self.compartimento = compartimento
        self.ordem_producao = ordem_producao
        self.etapa_processo = etapa_processo
        self.tipo_movimentacao = tipo_movimentacao

        # DADOS
        self.quantidade = quantidade
        self.data_hora = data_hora
        self.origem_leitura = origem_leitura
        self.observacao = observacao