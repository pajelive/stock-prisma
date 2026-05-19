class Insumo:
    def __init__(
        self,
        nome,
        categoria,
        unidade,
        uid_rfid,
        peso_unitario,
        qtd_minima,
        ativo
    ):
        self.nome = nome
        self.categoria = categoria
        self.unidade = unidade
        self.uid_rfid = uid_rfid
        self.peso_unitario = peso_unitario
        self.qtd_minima = qtd_minima
        self.ativo = ativo

        # RELACIONAMENTO
        self.compartimentos = []

