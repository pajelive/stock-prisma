#include <SPI.h>
#include <MFRC522.h>
#include "HX711.h"

// ============================
// CONFIGURAÇÕES: PINOS DE STATUS
// ============================
const int LED_VERMELHO = 2;
const int LED_VERDE = 7;
const int LED_AZUL = 4;
const int BUZZER = 5;

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
const float TOLERANCIA = 0.01;

#define AMOSTRAS 3
#define ESTABILIDADE 4

// Timeout máximo (ms) que aceitamos esperar pelo HX711 no boot.
// Se estourar, seguimos sem balança em vez de travar o setup().
const unsigned long TIMEOUT_BALANCA = 1000;

bool balancaDisponivel = false; // true somente se o HX711 respondeu no boot

float ultimoPesoEstavel = 0;
float ultimoPesoEnviado = 0;
int contadorEstavel = 0;

unsigned long tempoUltimaLeituraBalanca = 0;
const unsigned long intervaloBalanca = 200;

// Reconexão a quente: tenta reativar a balança periodicamente
// caso ela seja conectada depois do boot.
unsigned long tempoUltimaTentativaReconexao = 0;
const unsigned long intervaloReconexao = 5000;

// ============================
// SETUP
// ============================
void setup()
{
    Serial.begin(9600);

    // Inicializa Pinos de Status
    pinMode(LED_VERMELHO, OUTPUT);
    pinMode(LED_VERDE, OUTPUT);
    pinMode(LED_AZUL, OUTPUT);
    pinMode(BUZZER, OUTPUT);

    mostrarEspera();

    inicializarRFID();
    inicializarBalanca();

    Serial.println("Sistema iniciado.");
}

// ============================
// LOOP PRINCIPAL (Puro, sem travar sensores)
// ============================
void loop()
{
    // Escuta comandos do Python em background
    verificarComandosAgente();

    lerRFID();

    if (balancaDisponivel) {
        lerBalanca();
    } else {
        tentarReconectarBalanca();
    }
}

// ============================
// PROCESSAMENTO DO AGENTE PYTHON
// ============================
void verificarComandosAgente()
{
    if (Serial.available() > 0)
    {
        char comando = Serial.read();

        // Limpa qualquer sujeira ou caractere extra ('\n', '\r') do buffer imediatamente
        while (Serial.available() > 0) {
            Serial.read();
        }

        if (comando == 'S')
        {
            digitalWrite(LED_AZUL, LOW);
            digitalWrite(LED_VERDE, HIGH);
            tone(BUZZER, 2500);
            delay(150);
            noTone(BUZZER);

            delay(1000); // 1 segundo de feedback verde
            mostrarEspera();
        }
        else if (comando == 'E')
        {
            digitalWrite(LED_AZUL, LOW);
            digitalWrite(LED_VERMELHO, HIGH);
            tone(BUZZER, 800);
            delay(400);
            noTone(BUZZER);

            delay(1200); // 1.2 segundos de feedback vermelho
            mostrarEspera();
        }
    }
}

void mostrarEspera() {
    digitalWrite(LED_VERMELHO, LOW);
    digitalWrite(LED_VERDE, LOW);
    digitalWrite(LED_AZUL, HIGH);
    noTone(BUZZER);
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

// Espera o HX711 ficar pronto, mas com timeout — nunca trava o setup().
bool aguardarBalancaPronta(unsigned long timeoutMs)
{
    unsigned long inicio = millis();
    while (!escala.is_ready())
    {
        if (millis() - inicio >= timeoutMs)
            return false;
        delay(10);
    }
    return true;
}

void inicializarBalanca()
{
    escala.begin(DT, SCK);
    escala.set_scale(FATOR_CALIBRACAO);

    if (aguardarBalancaPronta(TIMEOUT_BALANCA))
    {
        escala.tare(20);
        ultimoPesoEstavel = escala.get_units(5);
        balancaDisponivel = true;
        Serial.println("Balança iniciada.");
    }
    else
    {
        ultimoPesoEstavel = 0.0;
        balancaDisponivel = false;
        Serial.println("Balança não detectada — seguindo sem ela.");
    }

    ultimoPesoEnviado = ultimoPesoEstavel;
}

// Tenta reativar a balança em background, sem bloquear o loop.
// Só reage se o HX711 já estiver pronto NA HORA (sem espera ativa).
void tentarReconectarBalanca()
{
    if (millis() - tempoUltimaTentativaReconexao < intervaloReconexao)
        return;

    tempoUltimaTentativaReconexao = millis();

    if (escala.is_ready())
    {
        escala.tare(20);
        ultimoPesoEstavel = escala.get_units(5);
        ultimoPesoEnviado = ultimoPesoEstavel;
        contadorEstavel = 0;
        balancaDisponivel = true;
        Serial.println("Balança reconectada e recalibrada.");
    }
}

float lerPesoFiltrado()
{
    if (escala.is_ready())
    {
        return escala.get_units(AMOSTRAS);
    }
    return ultimoPesoEstavel;
}

void lerBalanca()
{
    // Se o HX711 parar de responder durante o uso (cabo solto etc.),
    // volta para o modo "sem balança" em vez de continuar tentando.
    if (!escala.is_ready())
    {
        balancaDisponivel = false;
        Serial.println("Balança parou de responder — desativando temporariamente.");
        return;
    }

    if (millis() - tempoUltimaLeituraBalanca < intervaloBalanca)
    {
        return;
    }
    tempoUltimaLeituraBalanca = millis();

    float pesoAtual = lerPesoFiltrado();

    if (abs(pesoAtual - ultimoPesoEstavel) < TOLERANCIA)
    {
        contadorEstavel++;

        if (contadorEstavel < ESTABILIDADE)
            return;

        if (abs(pesoAtual - ultimoPesoEnviado) < TOLERANCIA)
            return;

        ultimoPesoEnviado = pesoAtual;
        enviarPeso(pesoAtual);
    }
    else
    {
        contadorEstavel = 0;
        ultimoPesoEstavel = pesoAtual;
    }
}

void enviarPeso(float peso)
{
    Serial.print("ID:");
    Serial.print(ID_COMPARTIMENTO);
    Serial.print(";PESO:");
    Serial.println(peso, 3);
}
