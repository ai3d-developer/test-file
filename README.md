# Kronos Console & Auth Portal

A handcrafted, modern Developer Login Portal and 5-Button Command Center Dashboard built with pure HTML, CSS, and Vanilla JavaScript.

## 🚀 Features

- **Crafted Auth Portal (`index.html`)**:
  - Dual auth mode: Password & Magic Link / Passkey tabs
  - Caps lock live detection
  - Dynamic password reveal toggle
  - OAuth quick links (Google, GitHub)
  - Interactive toast notifications and input validation
  - Dark / Light mode toggle

- **Command Center Dashboard (`dashboard.html`)**:
  - **5 Primary Control Actions**:
    1. `Deploy Project` (<kbd>1</kbd>): Simulated rolling deploy pipeline with live streaming console logs.
    2. `Analytics & Telemetry` (<kbd>2</kbd>): Live RPS, latency, and uptime health metrics.
    3. `API Keys & Tokens` (<kbd>3</kbd>): Secret key provisioner with one-click copy to clipboard.
    4. `Environment Settings` (<kbd>4</kbd>): Automated rollback & strict TLS toggles.
    5. `Sign Out` (<kbd>5</kbd>): Safe session termination and redirect back to sign-in.
  - Keyboard shortcuts (<kbd>1</kbd> - <kbd>5</kbd>) for instant actions.
  - Responsive layout optimized for mobile and desktop.

## 🛠️ Tech Stack

- Semantic HTML5
- Modern Vanilla CSS (Design tokens, glassmorphism, spring transitions)
- Vanilla JavaScript (ES6+)
- Typography: Plus Jakarta Sans & JetBrains Mono

## 💻 How to Run Locally

Open `index.html` directly in any modern web browser or run using any local static server:

```bash
# Example with Python:
python -m http.server 3000
```
