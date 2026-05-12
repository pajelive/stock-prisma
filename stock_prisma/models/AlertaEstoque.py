class AlertaEstoque:
    def __init__(self, tipo,mensagem,qtd_atminima,gerado_em,resolvido,resolvido_em):
        self.tipo = tipo
        self.mensagem = mensagem
        self.qtd_atminima = qtd_atminima
        self.gerado_em = gerado_em
        self.resolvido = resolvido
        self.resolvido_em = resolvido_em
