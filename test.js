// =========================================================
// TEST PAGE & SANDBOX LOGIC
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme sync
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('kronos-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);

  const specTheme = document.getElementById('specTheme');
  if (specTheme) specTheme.textContent = storedTheme.charAt(0).toUpperCase() + storedTheme.slice(1);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kronos-theme', newTheme);
    if (specTheme) specTheme.textContent = newTheme.charAt(0).toUpperCase() + newTheme.slice(1);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });

  // 2. User Info sync
  const loggedInUser = sessionStorage.getItem('kronos_user') || 'alex.developer@acme.dev';
  const userEmailText = document.getElementById('userEmailText');
  const userAvatar = document.getElementById('userAvatar');
  const specUser = document.getElementById('specUser');

  if (userEmailText && userAvatar) {
    userEmailText.textContent = loggedInUser;
    userAvatar.textContent = loggedInUser.slice(0, 2).toUpperCase();
  }
  if (specUser) specUser.textContent = loggedInUser;

  // Viewport Res
  const specRes = document.getElementById('specRes');
  if (specRes) specRes.textContent = `${window.innerWidth} x ${window.innerHeight}`;

  // 3. API Endpoint Simulator
  const apiMethod = document.getElementById('apiMethod');
  const apiEndpoint = document.getElementById('apiEndpoint');
  const sendRequestBtn = document.getElementById('sendRequestBtn');
  const apiSpinner = document.getElementById('apiSpinner');
  const responseStatusBadge = document.getElementById('responseStatusBadge');
  const responseLatencyBadge = document.getElementById('responseLatencyBadge');
  const jsonViewer = document.getElementById('jsonViewer');

  const mockResponses = {
    '/health': {
      status: 200,
      badge: '200 OK',
      data: {
        cluster: "us-east-1",
        status: "healthy",
        uptime_seconds: 432891,
        active_nodes: 12,
        memory_usage_pct: 34.8
      }
    },
    '/metrics': {
      status: 200,
      badge: '200 OK',
      data: {
        requests_per_sec: 1420.5,
        avg_latency_ms: 18.2,
        error_rate_pct: 0.002,
        cache_hit_ratio: 0.94
      }
    },
    '/user': {
      status: 200,
      badge: '200 OK',
      data: {
        user_id: "usr_9981a8c",
        email: loggedInUser,
        role: "Workspace Administrator",
        tier: "Enterprise Pro"
      }
    },
    '/error-test': {
      status: 500,
      badge: '500 Internal Error',
      data: {
        error: "SimulatedServerError",
        message: "Diagnostics sandbox error triggered as requested for testing.",
        trace_id: "trc_f8173491bc"
      }
    }
  };

  sendRequestBtn.addEventListener('click', () => {
    sendRequestBtn.classList.add('loading');
    sendRequestBtn.disabled = true;

    const chosenEndpoint = apiEndpoint.value;
    const responseConfig = mockResponses[chosenEndpoint] || mockResponses['/health'];

    setTimeout(() => {
      sendRequestBtn.classList.remove('loading');
      sendRequestBtn.disabled = false;

      const randomLatency = Math.floor(10 + Math.random() * 25);
      responseLatencyBadge.textContent = `${randomLatency}ms`;
      responseStatusBadge.textContent = responseConfig.badge;
      
      if (responseConfig.status === 200) {
        responseStatusBadge.classList.remove('error');
      } else {
        responseStatusBadge.classList.add('error');
      }

      jsonViewer.textContent = JSON.stringify(responseConfig.data, null, 2);
      showToast(`Simulated request to ${chosenEndpoint} completed (${randomLatency}ms)`, responseConfig.status === 200 ? 'success' : 'error');
    }, 450);
  });

  // 4. Edge Ping Diagnostics
  const runPingTestBtn = document.getElementById('runPingTestBtn');
  const pingUs = document.getElementById('pingUs');
  const pingEu = document.getElementById('pingEu');
  const pingAp = document.getElementById('pingAp');

  runPingTestBtn.addEventListener('click', () => {
    runPingTestBtn.disabled = true;
    runPingTestBtn.textContent = 'Pinging Edge Nodes...';

    setTimeout(() => {
      pingUs.textContent = `${Math.floor(9 + Math.random() * 6)} ms`;
      pingEu.textContent = `${Math.floor(22 + Math.random() * 10)} ms`;
      pingAp.textContent = `${Math.floor(30 + Math.random() * 12)} ms`;
      runPingTestBtn.disabled = false;
      runPingTestBtn.textContent = '⚡ Run Edge Ping Test';
      showToast('All global edge nodes responded within SLA targets', 'success');
    }, 600);
  });

  // 5. Toast Sample Triggers
  document.getElementById('toastTestSuccess').addEventListener('click', () => {
    showToast('Success: Action committed to cluster without errors!', 'success');
  });

  document.getElementById('toastTestInfo').addEventListener('click', () => {
    showToast('Info: Background syncing job is currently running.', 'info');
  });

  document.getElementById('toastTestError').addEventListener('click', () => {
    showToast('Error: Simulated failure! Verify payload format.', 'error');
  });

  // Toast engine
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }
});
