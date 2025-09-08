# ESP32 → Web App (KMITL-FIGHT) — Full Example

1) ESP32 reads temperature & humidity (DHT11)  
2) ESP32 sends JSON to Backend API (Node + MongoDB Atlas)  
3) Frontend shows latest values on the web

## Structure
- `backend/` — Express API, MongoDB via Mongoose
- `frontend/` — Static site showing latest reading (`config.js` → `API_BASE`)
- `esp32_firmware/` — Arduino sketch posting to `/api/readings`

## Quick Start (Deploy like in your PDF)
- Deploy **backend** to Render as a Web Service (root: `/backend`), set `MONGODB_URI`
- Deploy **frontend** to Render as a Static Site (root: `/frontend`), set `API_BASE` in `config.js`
- Flash **ESP32** with `esp32_firmware/esp32_dht_post.ino` (set Wi-Fi + API_URL)

## Notes
- The sample `config.js` points to `https://esp32web-7t94.onrender.com` by default.
- Adjust to your own deployed backend URL for production.

Generated: 2025-09-08T15:17:15.014246
