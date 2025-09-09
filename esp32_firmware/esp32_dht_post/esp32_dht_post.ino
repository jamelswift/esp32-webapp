// ESP32 DHT11 -> POST JSON to backend
// Board: ESP32 Dev Module
// Libraries (install via Library Manager):
//  - DHT sensor library by Adafruit
//  - Adafruit Unified Sensor
//  - (built-in) WiFi, HTTPClient

#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

// ======== EDIT WiFi & API ========
const char* WIFI_SSID = "Getzy";
const char* WIFI_PASS = "Wipatsasicha7";

// Backend API endpoint (POST)
const char* API_URL   = "https://esp32-webapp-backend.onrender.com/api/readings"; 
// =================================

#define DHTPIN 4      // Pin connected to DHT11 data
#define DHTTYPE DHT11 // or DHT22 if your board uses DHT22
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastPost = 0;
const unsigned long POST_INTERVAL_MS = 5000; // 5 seconds

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting WiFi");
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (++tries > 60) break; // ~30s timeout
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi connected, IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi connect failed");
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  dht.begin();
  connectWiFi();
}

void loop() {
  // Reconnect WiFi if needed
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  unsigned long now = millis();
  if (now - lastPost >= POST_INTERVAL_MS) {
    lastPost = now;

    float h = dht.readHumidity();
    float t = dht.readTemperature(); // Celsius
    if (isnan(h) || isnan(t)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(API_URL);
      http.addHeader("Content-Type", "application/json");

      // Build JSON correctly (escape quotes)
      String payload = String("{\"deviceId\":\"esp32\",\"temperature\":") + String(t, 1)
                     + String(",\"humidity\":") + String(h, 1)
                     + String(",\"ts\":") + String((unsigned long)(millis() / 1000))
                     + String("}");

      int httpCode = http.POST(payload);
      Serial.printf("POST %s -> %d\n", API_URL, httpCode);
      if (httpCode > 0) {
        String resp = http.getString();
        Serial.println(resp);
      } else {
        Serial.printf("POST failed: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();

      Serial.print("Payload: ");
      Serial.println(payload);
    } else {
      Serial.println("WiFi not connected; skipping POST");
    }
  }
}
