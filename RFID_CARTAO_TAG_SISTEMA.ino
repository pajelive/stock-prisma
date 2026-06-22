#include <SPI.h>
#include <MFRC522.h>
#include "HX711.h"

// ============================
// CONFIGURAÇÕES: RFID
// ============================
#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

char ultimoUID[32] = "";
unsigned long ultimoTempo = 0;
const unsigned long intervaloLeitura = 3000; // Debounce do RFID (3 segundos)

// ============================
// CONFIGURAÇÕES: BALANÇA
// ============================
#define DT A1
#define SCK A0

HX711 escala;

const char* ID_COMPARTIMENTO = "COMPARTIMENTO_1";
const float FATOR_CALIBRACAO = -272046.87;
const float TOLERANCIA = 0.01; // Tolerância de ruído do peso

#define AMOSTRAS 3      // Reduzido de 10 para 3 para ganho brutal de velocidade
#define ESTABILIDADE 4  // Vezes consecutivas que o peso precisa se repetir

float ultimoPesoEstavel = 0;
float ultimoPesoEnviado = 0;
int contadorEstavel = 0;

// Timer para a balança não sufocar o loop
unsigned long tempoUltimaLeituraBalanca = 0;
const unsigned long intervaloBalanca = 200; // Lê a balança a cada 200ms

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
// LOOP PRINCIPAL
// ============================
void loop()
{
    lerRFID();
    lerBalanca();
}

// ============================
// IMPLEMENTAÇÃO: RFID
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

    // Debounce do RFID
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
// IMPLEMENTAÇÃO: BALANÇA
// ============================
void inicializarBalanca()
{
    escala.begin(DT, SCK);
    escala.set_scale(FATOR_CALIBRACAO);
    escala.tare(20);

    delay(500);

    // Garante uma leitura inicial estável
    if (escala.is_ready()) {
        ultimoPesoEstavel = escala.get_units(5);
    } else {
        ultimoPesoEstavel = 0.0;
    }
    ultimoPesoEnviado = ultimoPesoEstavel;

    Serial.println("Balança iniciada.");
}

// Filtro otimizado e não-bloqueante
float lerPesoFiltrado()
{
    if (escala.is_ready())
    {
        // A própria biblioteca calcula a média interna de 3 amostras muito mais rápido
        return escala.get_units(AMOSTRAS);
    }
    // Se o chip HX711 não estiver pronto, retorna o último peso para não congelar o código
    return ultimoPesoEstavel; 
}

void lerBalanca()
{
    // Restringe a leitura da balança ao intervalo definido (200ms)
    // Isso evita travar o RFID enquanto a balança processa
    if (millis() - tempoUltimaLeituraBalanca < intervaloBalanca)
    {
        return;
    }
    tempoUltimaLeituraBalanca = millis();

    float pesoAtual = lerPesoFiltrado();

    // Verifica se a leitura está dentro da tolerância de ruído
    if (abs(pesoAtual - ultimoPesoEstavel) < TOLERANCIA)
    {
        contadorEstavel++;

        // Precisa atingir a contagem de estabilidade necessária
        if (contadorEstavel < ESTABILIDADE)
            return;

        // Só envia se o novo peso estavel for diferente do que já foi enviado antes
        if (abs(pesoAtual - ultimoPesoEnviado) < TOLERANCIA)
            return;

        ultimoPesoEnviado = pesoAtual;
        enviarPeso(pesoAtual);
    }
    else
    {
        // Peso oscilou (instável) -> Reseta a contagem e assume o novo valor base
        contadorEstavel = 0;
        ultimoPesoEstavel = pesoAtual;
    }
}

// ============================
// ENVIO DE DADOS
// ============================
void enviarPeso(float peso)
{
    Serial.print("ID:");
    Serial.print(ID_COMPARTIMENTO);

    Serial.print(";PESO:");
    Serial.println(peso, 3);
}#include <SPI.h>
#include <MFRC522.h>
#include "HX711.h"

// ============================
// CONFIGURAÇÕES: RFID
// ============================
#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

char ultimoUID[32] = "";
unsigned long ultimoTempo = 0;
const unsigned long intervaloLeitura = 3000; // Debounce do RFID (3 segundos)

// ============================
// CONFIGURAÇÕES: BALANÇA
// ============================
#define DT A1
#define SCK A0

HX711 escala;

const char* ID_COMPARTIMENTO = "COMPARTIMENTO_1";
const float FATOR_CALIBRACAO = -272046.87;
const float TOLERANCIA = 0.01; // Tolerância de ruído do peso

#define AMOSTRAS 3      // Reduzido de 10 para 3 para ganho brutal de velocidade
#define ESTABILIDADE 4  // Vezes consecutivas que o peso precisa se repetir

float ultimoPesoEstavel = 0;
float ultimoPesoEnviado = 0;
int contadorEstavel = 0;

// Timer para a balança não sufocar o loop
unsigned long tempoUltimaLeituraBalanca = 0;
const unsigned long intervaloBalanca = 200; // Lê a balança a cada 200ms

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
// LOOP PRINCIPAL
// ============================
void loop()
{
    lerRFID();
    lerBalanca();
}

// ============================
// IMPLEMENTAÇÃO: RFID
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

    // Debounce do RFID
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
// IMPLEMENTAÇÃO: BALANÇA
// ============================
void inicializarBalanca()
{
    escala.begin(DT, SCK);
    escala.set_scale(FATOR_CALIBRACAO);
    escala.tare(20);

    delay(500);

    // Garante uma leitura inicial estável
    if (escala.is_ready()) {
        ultimoPesoEstavel = escala.get_units(5);
    } else {
        ultimoPesoEstavel = 0.0;
    }
    ultimoPesoEnviado = ultimoPesoEstavel;

    Serial.println("Balança iniciada.");
}

// Filtro otimizado e não-bloqueante
float lerPesoFiltrado()
{
    if (escala.is_ready())
    {
        // A própria biblioteca calcula a média interna de 3 amostras muito mais rápido
        return escala.get_units(AMOSTRAS);
    }
    // Se o chip HX711 não estiver pronto, retorna o último peso para não congelar o código
    return ultimoPesoEstavel; 
}

void lerBalanca()
{
    // Restringe a leitura da balança ao intervalo definido (200ms)
    // Isso evita travar o RFID enquanto a balança processa
    if (millis() - tempoUltimaLeituraBalanca < intervaloBalanca)
    {
        return;
    }
    tempoUltimaLeituraBalanca = millis();

    float pesoAtual = lerPesoFiltrado();

    // Verifica se a leitura está dentro da tolerância de ruído
    if (abs(pesoAtual - ultimoPesoEstavel) < TOLERANCIA)
    {
        contadorEstavel++;

        // Precisa atingir a contagem de estabilidade necessária
        if (contadorEstavel < ESTABILIDADE)
            return;

        // Só envia se o novo peso estavel for diferente do que já foi enviado antes
        if (abs(pesoAtual - ultimoPesoEnviado) < TOLERANCIA)
            return;

        ultimoPesoEnviado = pesoAtual;
        enviarPeso(pesoAtual);
    }
    else
    {
        // Peso oscilou (instável) -> Reseta a contagem e assume o novo valor base
        contadorEstavel = 0;
        ultimoPesoEstavel = pesoAtual;
    }
}

// ============================
// ENVIO DE DADOS
// ============================
void enviarPeso(float peso)
{
    Serial.print("ID:");
    Serial.print(ID_COMPARTIMENTO);

    Serial.print(";PESO:");
    Serial.println(peso, 3);
}