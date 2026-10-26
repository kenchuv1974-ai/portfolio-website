/**
 * Security & Anti-Inspection Module
 * BGS College of Engineering and Technology (BGSCET)
 * Features:
 * - Locks Right-Click Context Menu
 * - Disables DevTools Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
 * - Secret Keyboard Shortcut (Ctrl+Shift+A) to launch Admin Portal
 */

(function initSecurity() {
  // 1. Lock Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    displaySecurityHUD('Inspection locked: Right-click context menu is disabled.');
  });

  // 2. Lock Keyboard Inspection Shortcuts
  document.addEventListener('keydown', (e) => {
    // Secret Admin Shortcut: Ctrl + Shift + A
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin.html';
      return;
    }

    // F12 DevTools
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      displaySecurityHUD('Inspection locked: Developer Tools shortcut disabled.');
      return false;
    }

    // Ctrl + Shift + I (Inspect)
    // Ctrl + Shift + J (Console)
    // Ctrl + Shift + C (Element Inspector)
    if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
      e.preventDefault();
      displaySecurityHUD('Inspection locked: Developer shortcuts are restricted.');
      return false;
    }

    // Ctrl + U (View Page Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      displaySecurityHUD('Inspection locked: Source view shortcut restricted.');
      return false;
    }

    // Ctrl + S (Save Page)
    if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      displaySecurityHUD('Action restricted.');
      return false;
    }
  });

  // 3. Floating HUD Security Indicator Toast
  function displaySecurityHUD(message) {
    let hud = document.getElementById('securityHUDToast');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'securityHUDToast';
      hud.className = 'security-hud-toast';
      document.body.appendChild(hud);
    }

    hud.innerHTML = `
      <div class="hud-inner">
        <span class="hud-icon">🔒</span>
        <span class="hud-text">${message}</span>
        <span class="hud-tag">[SYS.SEC // ACTIVE]</span>
      </div>
    `;

    hud.classList.add('active');
    clearTimeout(window.__securityHudTimeout);
    window.__securityHudTimeout = setTimeout(() => {
      hud.classList.remove('active');
    }, 2800);
  }
})();
