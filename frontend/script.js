const { API_BASE } = window.__CONFIG__;

async function fetchLatest() {
  try {
    const res = await fetch(`${API_BASE}/api/readings/latest`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    document.getElementById('temp').textContent = (data.temperature ?? '—');
    document.getElementById('hum').textContent = (data.humidity ?? '—');
    document.getElementById('ts').textContent = data.ts ? new Date(data.ts).toLocaleString() : '—';
    document.getElementById('status').textContent = 'Connected';
  } catch (e) {
    document.getElementById('status').textContent = 'Disconnected';
    // keep old values; just update status
  }
}

// Initial + poll every 5s
fetchLatest();
setInterval(fetchLatest, 5000);
