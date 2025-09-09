/* App logic */
(function () {
  var cfg = (window.__CONFIG__ || {});
  var API_BASE = cfg.API_BASE;

  // Display API base in the UI if element exists
  const apiBaseElement = document.getElementById('apiBase');
  if (apiBaseElement) {
    apiBaseElement.textContent = API_BASE || 'Not configured';
  }

  // Status indicator elements (for enhanced dashboard)
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('status');
  
  function updateStatus(connected) {
    if (statusDot && statusText) {
      // Enhanced dashboard with status dot
      if (connected) {
        statusDot.className = 'w-3 h-3 rounded-full bg-green-400 animate-pulse';
        statusText.textContent = 'Connected';
        statusText.className = 'text-sm font-medium text-green-700';
      } else {
        statusDot.className = 'w-3 h-3 rounded-full bg-red-400';
        statusText.textContent = 'Disconnected';
        statusText.className = 'text-sm font-medium text-red-700';
      }
    } else {
      // Fallback for original dashboard
      if (statusText) {
        statusText.textContent = connected ? 'Connected' : 'Disconnected';
      }
    }
  }

  async function fetchLatest() {
    try {
      // Fix URL concatenation to avoid double slashes
      const cleanApiBase = API_BASE ? API_BASE.replace(/\/$/, '') : '';
      const url = cleanApiBase + '/api/readings/latest';
      
      console.log('Fetching from:', url);
      
      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Received data:', data);
      
      // Update temperature
      const tempElement = document.getElementById('temp');
      if (tempElement) {
        tempElement.textContent = (data.temperature !== undefined && data.temperature !== null) 
          ? data.temperature.toString() 
          : '—';
      }
      
      // Update humidity
      const humElement = document.getElementById('hum');
      if (humElement) {
        humElement.textContent = (data.humidity !== undefined && data.humidity !== null) 
          ? data.humidity.toString() 
          : '—';
      }
      
      // Update timestamp
      const tsElement = document.getElementById('ts');
      if (tsElement) {
        tsElement.textContent = data.ts 
          ? new Date(data.ts).toLocaleString() 
          : new Date().toLocaleString();
      }
      
      // Update status to connected
      updateStatus(true);
      
    } catch (e) {
      console.error('Failed to fetch data:', e);
      updateStatus(false);
      
      // Optional: Show error details in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Error details:', {
          message: e.message,
          API_BASE: API_BASE,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  // Initialize status as disconnected
  updateStatus(false);
  
  // Start fetching data immediately and then every 5 seconds
  fetchLatest();
  const intervalId = setInterval(fetchLatest, 5000);
  
  // Optional: Clean up interval if page is unloaded
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
  });

  // Optional: Add visibility change handler to pause/resume when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      fetchLatest(); // Fetch immediately when tab becomes visible
    }
  });
})();