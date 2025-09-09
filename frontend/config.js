/* Config */
(function () {
  // URL ของ backend ที่ deploy บน Render
  var cfg = { API_BASE: 'https://esp32-webapp-backend.onrender.com' };

  // เก็บไว้ที่ window.__CONFIG__ เพื่อให้ script.js ใช้งาน
  window.__CONFIG__ = cfg;

  // โชว์ URL backend บนหน้า
  var el = document.getElementById('apiBase');
  if (el) el.textContent = cfg.API_BASE;
})();
