# ESP32 Firmware (Arduino)

## Hardware
- Board: ESP32 Dev Module (KMITL-FIGHT board with DHT11 on GPIO 4 as example)
- Sensor: DHT11 (change to DHT22 if needed)

## Libraries
- DHT sensor library (by Adafruit)
- Adafruit Unified Sensor
- Built-in WiFi, HTTPClient

## Configure
Edit in sketch:
```cpp
const char* WIFI_SSID = "...";
const char* WIFI_PASS = "...";
const char* API_URL   = "https://<your-backend>/api/readings";
```

## Flash
- Open `esp32_dht_post.ino` in Arduino IDE
- Select board: **ESP32 Dev Module**
- Install required libraries (Library Manager)
- Select correct COM port
- Upload

## Test
Open Serial Monitor at 115200 baud and check POST responses.
