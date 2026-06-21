#include <SPI.h>
#include <MFRC522.h>
#include "HX711.h"

// ============================
// RFID
// ============================

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

// debounce RFID
char ultimoUID[32] = "";
unsigned long ultimoTempo = 0;
const unsigned long intervaloLeitura = 3000;

// ============================
// BALANÇA
// ============================

#define DT A1
#define SCK A0

HX711 escala;

const char* ID_COMPARTIMENTO = "COMPARTIMENTO_1";

// ajuste conforme sua calibração
const float FATOR_CALIBRACAO = -272046.87;

// diferença mínima para considerar alteração (kg)
const float TOLERANCIA = 0.005;

float ultimoPesoEnviado = 0;

// ============================
// SETUP
// ============================

void setup()
{
    Serial.begin(9600);

    inicializarRFID();

    inicializarBalanca();

    Serial.println("Sistema iniciado.");
}

// ============================
// LOOP
// ============================

void loop()
{
    lerRFID();

    lerBalanca();
}

// ============================
// RFID
// ============================

void inicializarRFID()
{
    SPI.begin();

    rfid.PCD_Init();

    delay(4);

    Serial.println("RFID iniciado.");
}

void lerRFID()
{
    if (!rfid.PICC_IsNewCardPresent())
        return;

    if (!rfid.PICC_ReadCardSerial())
        return;

    char uidAtual[32] = "";

    for (byte i = 0; i < rfid.uid.size; i++)
    {
        char buffer[4];

        sprintf(buffer, "%02X", rfid.uid.uidByte[i]);

        strcat(uidAtual, buffer);
    }

    if (strcmp(uidAtual, ultimoUID) == 0 &&
        millis() - ultimoTempo < intervaloLeitura)
    {
        rfid.PICC_HaltA();
        rfid.PCD_StopCrypto1();
        return;
    }

    strcpy(ultimoUID, uidAtual);

    ultimoTempo = millis();

    Serial.print("UID:");
    Serial.println(uidAtual);

    rfid.PICC_HaltA();

    rfid.PCD_StopCrypto1();
}

// ============================
// BALANÇA
// ============================

void inicializarBalanca()
{
    escala.begin(DT, SCK);

    escala.set_scale(FATOR_CALIBRACAO);

    escala.tare(20);

    delay(500);

    ultimoPesoEnviado = escala.get_units(20);

    Serial.println("Balança iniciada.");
}

void lerBalanca()
{
    float pesoAtual = escala.get_units(20);

    if (abs(pesoAtual - ultimoPesoEnviado) >= TOLERANCIA)
    {
        ultimoPesoEnviado = pesoAtual;

        enviarPeso(pesoAtual);
    }
}

void enviarPeso(float peso)
{
    Serial.print("ID:");
    Serial.print(ID_COMPARTIMENTO);

    Serial.print(";PESO:");

    Serial.println(peso, 3);
}