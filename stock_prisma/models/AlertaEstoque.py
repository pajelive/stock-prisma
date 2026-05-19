class AlertaEstoque:
    def __init__(
        self,
        tipo,
        mensagem,
        qtd_atual,
        qtd_minima,
        gerado_em,
        resolvido,
        resolvido_em,
        compartimento
    ):
        self.tipo = tipo
        self.mensagem = mensagem
        self.qtd_atual = qtd_atual
        self.qtd_minima = qtd_minima
        self.gerado_em = gerado_em
        self.resolvido = resolvido
        self.resolvido_em = resolvido_em

        # RELACIONAMENTO
        self.compartimento = compartimento