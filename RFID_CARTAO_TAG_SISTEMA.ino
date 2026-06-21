#include <SPI.h>
#include <MFRC522.h>
#include "HX711.h"

// ============================
// RFID
// ============================

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

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

const float FATOR_CALIBRACAO = -272046.87;

// tolerância de variação (ajuste fino)
const float TOLERANCIA = 0.01;

#define AMOSTRAS 10
#define ESTABILIDADE 4

float ultimoPesoEstavel = 0;
float ultimoPesoEnviado = 0;
int contadorEstavel = 0;

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

    // debounce RFID
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

    ultimoPesoEstavel = escala.get_units(10);
    ultimoPesoEnviado = ultimoPesoEstavel;

    Serial.println("Balança iniciada.");
}

// média simples (filtro)
float lerPesoFiltrado()
{
    float soma = 0;

    for (int i = 0; i < AMOSTRAS; i++)
    {
        soma += escala.get_units(1);
    }

    return soma / AMOSTRAS;
}

void lerBalanca()
{
    float pesoAtual = lerPesoFiltrado();

    // ainda dentro do ruído
    if (abs(pesoAtual - ultimoPesoEstavel) < TOLERANCIA)
    {
        contadorEstavel++;

        if (contadorEstavel < ESTABILIDADE)
            return;

        // só envia se mudou de fato
        if (abs(pesoAtual - ultimoPesoEnviado) < TOLERANCIA)
            return;

        ultimoPesoEnviado = pesoAtual;

        enviarPeso(pesoAtual);
    }
    else
    {
        // instável → reseta estabilização
        contadorEstavel = 0;
        ultimoPesoEstavel = pesoAtual;
    }
}

// ============================
// ENVIO
// ============================

void enviarPeso(float peso)
{
    Serial.print("ID:");
    Serial.print(ID_COMPARTIMENTO);

    Serial.print(";PESO:");
    Serial.println(peso, 3);
}