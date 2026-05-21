#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

// debounce
char ultimoUID[32] = "";
unsigned long ultimoTempo = 0;

const unsigned long intervaloLeitura = 3000;

void setup() {

  Serial.begin(9600);

  SPI.begin();

  rfid.PCD_Init();

  delay(4);

  Serial.println("Sistema RFID iniciado");
}

void loop() {

  // cartão presente?
  if (!rfid.PICC_IsNewCardPresent()) {
    delay(10);
    return;
  }

  // conseguiu ler?
  if (!rfid.PICC_ReadCardSerial()) {
    delay(10);
    return;
  }

  char uidAtual[32] = "";

  for (byte i = 0; i < rfid.uid.size; i++) {

    char buffer[4];

    sprintf(buffer, "%02X", rfid.uid.uidByte[i]);

    strcat(uidAtual, buffer);
  }

  // debounce
  if (
    strcmp(uidAtual, ultimoUID) == 0 &&
    millis() - ultimoTempo < intervaloLeitura
  ) {

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();

    delay(50);

    return;
  }

  strcpy(ultimoUID, uidAtual);

  ultimoTempo = millis();

  Serial.print("UID:");
  Serial.println(uidAtual);

  rfid.PICC_HaltA();

  rfid.PCD_StopCrypto1();

  delay(50);
}