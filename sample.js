// =========================================================
// SAMPLE PAGE INTERACTION LOGIC
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme sync
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

  // 2. User Info sync
  const loggedInUser = sessionStorage.getItem('kronos_user') || 'alex.developer@acme.dev';
  const userEmailText = document.getElementById('userEmailText');
  const userAvatar = document.getElementById('userAvatar');

  if (userEmailText && userAvatar) {
    userEmailText.textContent = loggedInUser;
    userAvatar.textContent = loggedInUser.slice(0, 2).toUpperCase();
  }

  // 3. Counter Widget
  let counter = 2480;
  const counterVal = document.getElementById('counterVal');
  const btnIncrement = document.getElementById('btnIncrement');
  const btnDecrement = document.getElementById('btnDecrement');

  btnIncrement.addEventListener('click', () => {
    counter += 100;
    counterVal.textContent = counter.toLocaleString();
    showToast(`Metric counter incremented to ${counter.toLocaleString()}`, 'success');
  });

  btnDecrement.addEventListener('click', () => {
    if (counter > 100) counter -= 100;
    counterVal.textContent = counter.toLocaleString();
    showToast(`Metric counter decremented to ${counter.toLocaleString()}`, 'info');
  });

  // 4. Color Swatches (Click to copy)
  document.querySelectorAll('.swatch-item').forEach(item => {
    item.addEventListener('click', () => {
      const color = item.getAttribute('data-color');
      navigator.clipboard.writeText(color).catch(() => {});
      showToast(`Copied token color: ${color}`, 'success');
    });
  });

  // 5. Button Matrix Sample Clicks
  const buttons = [
    { id: 'btnSampleSolid', name: 'Primary Solid' },
    { id: 'btnSampleOutline', name: 'Ghost Outline' },
    { id: 'btnSampleGlass', name: 'Glass Backdrop' },
    { id: 'btnSampleDanger', name: 'Destructive Action' }
  ];

  buttons.forEach(({ id, name }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        showToast(`Triggered: ${name} component variant`, id === 'btnSampleDanger' ? 'error' : 'info');
      });
    }
  });

  // 6. Table Search Filter
  const filterInput = document.getElementById('filterInput');
  const servicesTable = document.getElementById('servicesTable');
  if (filterInput && servicesTable) {
    filterInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = servicesTable.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // Toast Engine
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
