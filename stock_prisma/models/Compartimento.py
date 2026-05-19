class Compartimento:
    def __init__(
        self,
        nome,
        localizacao,
        peso_atual,
        peso_tara,
        sensor_ativo,
        status,
        led_status,
        ultima_calibracao,
        insumo
    ):
        self.nome = nome
        self.localizacao = localizacao
        self.peso_atual = peso_atual
        self.peso_tara = peso_tara
        self.sensor_ativo = sensor_ativo
        self.status = status
        self.led_status = led_status
        self.ultima_calibracao = ultima_calibracao

        # RELACIONAMENTO
        self.insumo = insumo