# ESP32 DHT11 Live Dashboard (Frontend)

Minimal static site that polls the backend for the latest reading and displays Temperature & Humidity.

## Configure
Edit `config.js` and set:
```js
const API_BASE = 'https://<your-render-backend>.onrender.com';
```

## Local Preview
Serve statically with any server (e.g. VS Code Live Server, `python -m http.server`).

## Deploy (Render Static Site)
- New Static Site → Root: `/frontend`
- Build Command: *(leave empty)*
- Publish Directory: `/frontend`
