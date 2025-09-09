/* App logic */
(function () {
  var cfg = (window.__CONFIG__ || {});
  var API_BASE = cfg.API_BASE;

  async function fetchLatest() {
    try {
      const res = await fetch(API_BASE + '/api/readings/latest', {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const data = await res.json();
      document.getElementById('temp').textContent = (data.temperature ?? '—');
      document.getElementById('hum').textContent  = (data.humidity ?? '—');
      document.getElementById('ts').textContent   = data.ts ? new Date(data.ts).toLocaleString() : '—';
      document.getElementById('status').textContent = 'Connected';
    } catch (e) {
      document.getElementById('status').textContent = 'Disconnected';
    }
  }

  // ดึงทันที และอัปเดตทุก 5 วินาที
  fetchLatest();
  setInterval(fetchLatest, 5000);
})();
