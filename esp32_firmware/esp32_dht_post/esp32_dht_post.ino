/******************************************************
 * ESP32 → DHT11/22 → POST JSON ไปยัง Render Backend
 * - อ่านทุก POST_INTERVAL_MS มิลลิวินาที
 * - ใช้ HTTPS (WiFiClientSecure + setInsecure สำหรับทดสอบ)
 * - ถ้าใช้ DHT22 ให้เปลี่ยน DHTTYPE = DHT22
 ******************************************************/

#include <Adafruit_Sensor.h>   // จาก Adafruit Unified Sensor
#include <DHT.h>               // จาก DHT sensor library (Adafruit)
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// ---------- ตั้งค่า Wi-Fi & Backend ----------
const char* WIFI_SSID = "Getzy";
const char* WIFI_PASS = "Wipatsasicha7";
const char* API_URL   = "https://esp32-webapp-backend.onrender.com/api/readings";

// ---------- ตั้งค่า DHT ----------
#define DHTPIN   4          // ขา DATA ของ DHT
#define DHTTYPE  DHT11      // ถ้าใช้ DHT22 ให้เปลี่ยนเป็น DHT22
DHT dht(DHTPIN, DHTTYPE);

// ---------- ตั้งค่าอื่น ๆ ----------
const uint32_t POST_INTERVAL_MS = 5000;  // ส่งทุก 5 วินาที
const char* DEVICE_ID = "esp32";         // ชื่ออุปกรณ์
#ifndef LED_BUILTIN
#define LED_BUILTIN 2                    // กันเหนียวถ้า core ไม่ประกาศ
#endif
const int LED_OK = LED_BUILTIN;

// ---------- ฟังก์ชันเชื่อม Wi-Fi ----------
void connectWiFi() {
  Serial.print("Connecting WiFi: "); Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  uint32_t t0 = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(300); Serial.print(".");
    if (millis() - t0 > 20000) {
      Serial.println("\nWiFi connect timeout, restarting...");
      ESP.restart();
    }
  }
  Serial.print("\nWiFi connected, IP: "); Serial.println(WiFi.localIP());
}

// ---------- ฟังก์ชันส่งค่าไป Backend ----------
bool postReading(float t, float h) {
  WiFiClientSecure client;
  client.setInsecure();                  // โหมดทดสอบ (TLS ไม่ตรวจใบรับรอง)
  HTTPClient http;

  if (!http.begin(client, API_URL)) {
    Serial.println("HTTP begin failed");
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  // http.addHeader("x-key", "YOUR_INGEST_KEY"); // ถ้าตั้ง key ไว้ที่ backend

  // สร้าง JSON payload
  String payload = "{";
  payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
  payload += "\"temperature\":" + String(t, 1) + ",";
  payload += "\"humidity\":" + String(h, 1);
  payload += "}";

  int code = http.POST(payload);
  Serial.print("POST "); Serial.print(API_URL); Serial.print(" -> ");
  Serial.println(code);

  if (code > 0) {
    Serial.print("Response: "); Serial.println(http.getString());
  } else {
    Serial.print("Error: "); Serial.println(http.errorToString(code));
  }
  http.end();

  if (code == HTTP_CODE_OK || code == HTTP_CODE_CREATED) {
    digitalWrite(LED_OK, HIGH); delay(60); digitalWrite(LED_OK, LOW);
    return true;
  }
  return false;
}

// ---------- setup / loop ----------
void setup() {
  pinMode(LED_OK, OUTPUT);
  digitalWrite(LED_OK, LOW);

  Serial.begin(115200);
  delay(1000);
  Serial.println("\nESP32 DHT → HTTPS POST demo");

  dht.begin();       // ★ ใช้ของ Adafruit ต้องเรียก begin()
  connectWiFi();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("DHT read failed (NaN). Retrying...");
    delay(2000);
    return;
  }

  Serial.print("Temp="); Serial.print(t, 1); Serial.print("C  ");
  Serial.print("Hum=");  Serial.print(h, 1); Serial.println("%");

  if (!postReading(t, h)) {
    Serial.println("POST failed. Will retry next cycle.");
  }

  delay(POST_INTERVAL_MS);
}