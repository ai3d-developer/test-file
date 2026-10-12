// =========================================================
// INTERACTION & CRAFT LOGIC
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Defaults to Dark, remembers choice)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('kronos-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'dark'); // dark looks exceptionally crafted

  document.documentElement.setAttribute('data-theme', initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kronos-theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });

  // 2. Tab Switcher (Password vs Magic Link)
  const tabPassword = document.getElementById('tabPassword');
  const tabMagicLink = document.getElementById('tabMagicLink');
  const passwordForm = document.getElementById('passwordForm');
  const magicLinkForm = document.getElementById('magicLinkForm');

  tabPassword.addEventListener('click', () => {
    tabPassword.classList.add('active');
    tabPassword.setAttribute('aria-selected', 'true');
    tabMagicLink.classList.remove('active');
    tabMagicLink.setAttribute('aria-selected', 'false');

    passwordForm.classList.remove('hidden');
    magicLinkForm.classList.add('hidden');
    document.getElementById('emailInput').focus();
  });

  tabMagicLink.addEventListener('click', () => {
    tabMagicLink.classList.add('active');
    tabMagicLink.setAttribute('aria-selected', 'true');
    tabPassword.classList.remove('active');
    tabPassword.setAttribute('aria-selected', 'false');

    magicLinkForm.classList.remove('hidden');
    passwordForm.classList.add('hidden');
    document.getElementById('magicEmailInput').focus();
  });

  // 3. Password Visibility Toggle
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');

  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    togglePasswordBtn.classList.toggle('revealed', isPassword);
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    passwordInput.focus();
  });

  // 4. Caps Lock Warning
  const capsWarning = document.getElementById('capsWarning');
  ['keydown', 'keyup'].forEach(eventType => {
    passwordInput.addEventListener(eventType, (e) => {
      const isCaps = e.getModifierState && e.getModifierState('CapsLock');
      if (isCaps) {
        capsWarning.classList.add('visible');
      } else {
        capsWarning.classList.remove('visible');
      }
    });
  });

  // 5. Form Validation & Submission
  const authCard = document.getElementById('authCard');
  const emailGroup = document.getElementById('emailGroup');
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const passwordGroup = document.getElementById('passwordGroup');
  const passwordError = document.getElementById('passwordError');
  const submitBtn = document.getElementById('submitBtn');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Real-time clearance of errors when typing
  emailInput.addEventListener('input', () => {
    if (emailGroup.classList.contains('has-error')) {
      emailGroup.classList.remove('has-error');
      emailError.textContent = '';
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordGroup.classList.contains('has-error')) {
      passwordGroup.classList.remove('has-error');
      passwordError.textContent = '';
    }
  });

  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Validate email
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      emailGroup.classList.add('has-error');
      emailError.textContent = 'Please enter your email address.';
      hasError = true;
    } else if (!isValidEmail(emailVal)) {
      emailGroup.classList.add('has-error');
      emailError.textContent = 'Please enter a valid email address.';
      hasError = true;
    }

    // Validate password
    const passwordVal = passwordInput.value;
    if (!passwordVal) {
      passwordGroup.classList.add('has-error');
      passwordError.textContent = 'Please enter your password.';
      hasError = true;
    } else if (passwordVal.length < 6) {
      passwordGroup.classList.add('has-error');
      passwordError.textContent = 'Password must be at least 6 characters.';
      hasError = true;
    }

    if (hasError) {
      authCard.classList.remove('shake');
      void authCard.offsetWidth; // trigger reflow
      authCard.classList.add('shake');
      return;
    }

    // Simulate submission
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      sessionStorage.setItem('kronos_user', emailVal);
      showToast(`Welcome back, ${emailVal.split('@')[0]}! Redirecting...`, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    }, 1000);
  });

  // 6. Magic Link Form Submission
  const magicLinkFormEl = document.getElementById('magicLinkForm');
  const magicEmailInput = document.getElementById('magicEmailInput');
  const magicEmailError = document.getElementById('magicEmailError');
  const magicSubmitBtn = document.getElementById('magicSubmitBtn');

  magicEmailInput.addEventListener('input', () => {
    magicEmailError.textContent = '';
    magicEmailInput.parentElement.parentElement.classList.remove('has-error');
  });

  magicLinkFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = magicEmailInput.value.trim();
    if (!emailVal || !isValidEmail(emailVal)) {
      magicEmailInput.parentElement.parentElement.classList.add('has-error');
      magicEmailError.textContent = 'Please enter a valid email address for the magic link.';
      authCard.classList.remove('shake');
      void authCard.offsetWidth;
      authCard.classList.add('shake');
      return;
    }

    magicSubmitBtn.classList.add('loading');
    magicSubmitBtn.disabled = true;

    setTimeout(() => {
      magicSubmitBtn.classList.remove('loading');
      magicSubmitBtn.disabled = false;
      showToast(`Magic link dispatched to ${emailVal}!`, 'success');
      magicEmailInput.value = '';
    }, 1100);
  });

  // 7. OAuth Buttons Mock Response
  document.getElementById('btnGoogle').addEventListener('click', () => {
    sessionStorage.setItem('kronos_user', 'alex.developer@gmail.com');
    showToast('Authenticated via Google. Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  });

  document.getElementById('btnGithub').addEventListener('click', () => {
    sessionStorage.setItem('kronos_user', 'octocat@github.dev');
    showToast('Authenticated via GitHub. Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  });

  document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    const currentEmail = emailInput.value.trim();
    if (currentEmail && isValidEmail(currentEmail)) {
      showToast(`Password reset link sent to ${currentEmail}`, 'info');
    } else {
      showToast('Enter your email above first to receive reset instructions.', 'info');
      emailInput.focus();
    }
  });

  document.getElementById('createAccountLink').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Account registration workspace opened!', 'info');
  });

  // 8. Toast Helper
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
    }, 3200);
  }
});
