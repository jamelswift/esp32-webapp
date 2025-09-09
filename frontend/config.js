/* Config (อย่าใช้ const API_BASE ซ้ำใน global) */
(function () {
  // ใส่ URL backend ของคุณ
  var cfg = { API_BASE: 'https://esp32-webapp-backend.onrender.com/' };

  // เก็บไว้ที่ window.__CONFIG__ เพื่อให้ไฟล์อื่นอ่าน
  window.__CONFIG__ = cfg;

  // โชว์ URL บนหน้า
  var el = document.getElementById('apiBase');
  if (el) el.textContent = cfg.API_BASE;
})();