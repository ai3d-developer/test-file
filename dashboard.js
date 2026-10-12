// =========================================================
// COMMAND CENTER INTERACTION LOGIC (5 BUTTONS HUB)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Sync
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('kronos-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kronos-theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });

  // 2. User Info Sync
  const loggedInUser = sessionStorage.getItem('kronos_user') || 'alex.developer@acme.dev';
  const userEmailText = document.getElementById('userEmailText');
  const userAvatar = document.getElementById('userAvatar');
  if (userEmailText && userAvatar) {
    userEmailText.textContent = loggedInUser;
    const namePart = loggedInUser.split('@')[0];
    const initials = namePart.slice(0, 2).toUpperCase();
    userAvatar.textContent = initials;
  }

  // Live UTC Clock
  const hubClock = document.getElementById('hubClock');
  const updateClock = () => {
    const now = new Date();
    hubClock.textContent = now.toTimeString().split(' ')[0] + ' UTC';
  };
  updateClock();
  setInterval(updateClock, 1000);

  // 3. 5-Button Tab Switching
  const actionButtons = [
    { btn: document.getElementById('btnAction1'), view: document.getElementById('view-deploy'), name: 'Deploy Project' },
    { btn: document.getElementById('btnAction2'), view: document.getElementById('view-analytics'), name: 'Analytics & Telemetry' },
    { btn: document.getElementById('btnAction3'), view: document.getElementById('view-apikeys'), name: 'API Keys & Secrets' },
    { btn: document.getElementById('btnAction4'), view: document.getElementById('view-settings'), name: 'Environment Settings' },
    { btn: document.getElementById('btnAction5'), view: document.getElementById('view-signout'), name: 'Sign Out' },
  ];

  function setActiveAction(index) {
    actionButtons.forEach((item, i) => {
      if (i === index) {
        item.btn.classList.add('active');
        item.view.classList.add('active');
      } else {
        item.btn.classList.remove('active');
        item.view.classList.remove('active');
      }
    });
  }

  actionButtons.forEach((item, index) => {
    item.btn.addEventListener('click', () => {
      setActiveAction(index);
      showToast(`Selected: ${item.name}`, 'info');
    });
  });

  // Keyboard shortcut listener (1 to 5)
  document.addEventListener('keydown', (e) => {
    // Ignore if typing inside input
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const key = parseInt(e.key, 10);
    if (key >= 1 && key <= 5) {
      setActiveAction(key - 1);
      showToast(`Shortcut [${key}] triggered: ${actionButtons[key - 1].name}`, 'info');
    }
  });

  // 4. Button 1: Deploy Pipeline Simulator
  const triggerDeployBtn = document.getElementById('triggerDeployBtn');
  const consoleOutput = document.getElementById('consoleOutput');
  let isDeploying = false;

  triggerDeployBtn.addEventListener('click', () => {
    if (isDeploying) return;
    isDeploying = true;
    triggerDeployBtn.disabled = true;
    triggerDeployBtn.innerHTML = '<span>Deploying...</span>';
    consoleOutput.textContent = '[build] Initializing fresh deploy runner...\n';

    const logs = [
      '[git] Pulling commit origin/main @ e4f89d ...',
      '[deps] Resolving 124 packages in 0.4s ...',
      '[compile] Compiling TypeScript bundles (ES2024 target)...',
      '[opt] Brotli compression ratio 4.2x applied.',
      '[cdn] Invalidation propagated across 34 edge points.',
      '[success] Deployment complete! Health status: 200 OK (latency: 14ms)'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        consoleOutput.textContent += logs[step] + '\n';
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        step++;
      } else {
        clearInterval(interval);
        isDeploying = false;
        triggerDeployBtn.disabled = false;
        triggerDeployBtn.innerHTML = '<span class="btn-icon">⚡</span><span>Trigger New Build</span>';
        showToast('New version successfully deployed to production!', 'success');
      }
    }, 450);
  });

  // 5. Button 2: Analytics Refresh
  const refreshStatsBtn = document.getElementById('refreshStatsBtn');
  const valRequests = document.getElementById('valRequests');
  const valLatency = document.getElementById('valLatency');

  refreshStatsBtn.addEventListener('click', () => {
    const randomReq = (1400000 + Math.floor(Math.random() * 150000)).toLocaleString();
    const randomLat = (14 + (Math.random() * 8)).toFixed(1);
    valRequests.textContent = randomReq;
    valLatency.textContent = `${randomLat} ms`;
    showToast('Analytics cache refreshed with latest live telemetry', 'success');
  });

  // 6. Button 3: API Keys Copy & Generate
  const copyKeyBtn = document.getElementById('copyKeyBtn');
  const secretKeyDisplay = document.getElementById('secretKeyDisplay');
  const generateKeyBtn = document.getElementById('generateKeyBtn');

  copyKeyBtn.addEventListener('click', () => {
    const dummyFullKey = 'kr_live_948f219b672e811acbe55d04';
    navigator.clipboard.writeText(dummyFullKey).catch(() => {});
    copyKeyBtn.textContent = 'Copied!';
    showToast('API Key copied to clipboard securely', 'success');
    setTimeout(() => {
      copyKeyBtn.textContent = 'Copy Key';
    }, 2000);
  });

  generateKeyBtn.addEventListener('click', () => {
    const randHex = Math.random().toString(36).substring(2, 10);
    secretKeyDisplay.textContent = `kr_live_${randHex}••••••••••••••••`;
    showToast('New secret key provisioned successfully!', 'success');
  });

  // 7. Button 4: Settings Toggles
  const toggleRollback = document.getElementById('toggleRollback');
  const toggleHttps = document.getElementById('toggleHttps');

  [toggleRollback, toggleHttps].forEach(toggle => {
    toggle.addEventListener('change', () => {
      showToast('Environment setting saved and synced across nodes', 'success');
    });
  });

  // 8. Button 5: Sign Out Actions
  const btnCancelSignOut = document.getElementById('btnCancelSignOut');
  const btnConfirmSignOut = document.getElementById('btnConfirmSignOut');

  btnCancelSignOut.addEventListener('click', () => {
    setActiveAction(0); // return to Deploy
  });

  btnConfirmSignOut.addEventListener('click', () => {
    sessionStorage.removeItem('kronos_user');
    showToast('Signing out... Goodbye!', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 700);
  });

  // 9. Toast Notification Engine
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg = type === 'success' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

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
