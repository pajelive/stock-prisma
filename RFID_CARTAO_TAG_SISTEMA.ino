#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

enum Modo {
  LEITURA,
  CADASTRO_CARTAO,
  CADASTRO_TAG
};

Modo modoAtual = LEITURA;

String nomeCadastro = "";

// Controle anti-repetição
String ultimoUID = "";
unsigned long ultimoTempo = 0;

const unsigned long intervaloLeitura = 2000;

void setup() {

  Serial.begin(9600);

  SPI.begin();

  rfid.PCD_Init();

  Serial.println("Sistema RFID iniciado");
}

void loop() {

  verificarSerial();

  if (!rfid.PICC_IsNewCardPresent())
    return;

  if (!rfid.PICC_ReadCardSerial())
    return;

  switch (modoAtual) {

    case LEITURA:
      lerUID();
      break;

    case CADASTRO_CARTAO:
      cadastrarUID("CARTAO");
      break;

    case CADASTRO_TAG:
      cadastrarUID("TAG");
      break;
  }

  // Finaliza comunicação com a tag/cartão
  rfid.PICC_HaltA();

  rfid.PCD_StopCrypto1();

  // Reinicia RC522 para evitar travamentos
  rfid.PCD_Init();

  delay(300);
}

void verificarSerial() {

  if (Serial.available()) {

    String comando = Serial.readStringUntil('\n');

    comando.trim();

    if (comando == "READ") {

      modoAtual = LEITURA;

      Serial.println("Modo leitura");

    } else if (comando.startsWith("WRITE_CARD:")) {

      nomeCadastro = comando.substring(11);

      modoAtual = CADASTRO_CARTAO;

      Serial.println("Aproxime o cartao");

    } else if (comando.startsWith("WRITE_TAG:")) {

      nomeCadastro = comando.substring(10);

      modoAtual = CADASTRO_TAG;

      Serial.println("Aproxime a tag");
    }
  }
}

void lerUID() {

  String uidAtual = "";

  for (byte i = 0; i < rfid.uid.size; i++) {

    if (rfid.uid.uidByte[i] < 0x10)
      uidAtual += "0";

    uidAtual += String(rfid.uid.uidByte[i], HEX);
  }

  uidAtual.toUpperCase();

  // Evita repetir mesma leitura várias vezes
  if (uidAtual == ultimoUID &&
      millis() - ultimoTempo < intervaloLeitura) {

    return;
  }

  ultimoUID = uidAtual;
  ultimoTempo = millis();

  Serial.print("UID:");
  Serial.println(uidAtual);
}

void cadastrarUID(String tipo) {

  String uidAtual = "";

  for (byte i = 0; i < rfid.uid.size; i++) {

    if (rfid.uid.uidByte[i] < 0x10)
      uidAtual += "0";

    uidAtual += String(rfid.uid.uidByte[i], HEX);
  }

  uidAtual.toUpperCase();

  ultimoUID = uidAtual;
  ultimoTempo = millis();

  Serial.println(tipo);

  Serial.print("NOME:");
  Serial.println(nomeCadastro);

  Serial.print("UID:");
  Serial.println(uidAtual);

  modoAtual = LEITURA;

  Serial.println("Modo leitura");
}