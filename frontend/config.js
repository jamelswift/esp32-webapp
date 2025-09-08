// IMPORTANT: Set this to your backend public URL on Render (or localhost during dev)
// Example: 'https://esp32web-7t94.onrender.com'
const API_BASE = 'https://esp32web-7t94.onrender.com';
// Export for script.js
window.__CONFIG__ = { API_BASE };
document.getElementById('apiBase').textContent = API_BASE;
