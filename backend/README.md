# ESP32 Web Backend

Express + MongoDB API for receiving ESP32 sensor readings.

## Endpoints
- `POST /api/readings` body: `{ deviceId, temperature, humidity, ts? }`
- `GET  /api/readings?limit=50`
- `GET  /api/readings/latest`

## Local Dev
```bash
cd backend
npm install
cp .env.example .env   # fill MONGODB_URI
npm run dev
```

## Deploy (Render)
- New Web Service → Connect repo → Root: `/backend`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Add Environment Variables: `MONGODB_URI`
