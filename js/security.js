/**
 * Security, Anti-Inspection & Admin Portal Trigger
 * BGS College of Engineering and Technology (BGSCET)
 */

(function initSecurityModule() {
  // 1. Rock-Solid Admin Shortcut: Ctrl + Shift + A (also supports Ctrl + Alt + A, Cmd + Shift + A)
  function handleAdminKeyShortcut(e) {
    const isA = (e.key && e.key.toLowerCase() === 'a') || e.code === 'KeyA' || e.keyCode === 65;
    const hasModifier = (e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey);

    if (hasModifier && isA) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityHUD('Access Granted // Redirecting to Admin Terminal...');
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 180);
      return false;
    }

    // Lock F12 DevTools
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      showSecurityHUD('Inspection locked: Developer Tools shortcut disabled.');
      return false;
    }

    // Lock Ctrl + Shift + I, J, C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
      e.preventDefault();
      showSecurityHUD('Inspection locked: Developer shortcuts are restricted.');
      return false;
    }

    // Lock Ctrl + U (View Page Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      showSecurityHUD('Inspection locked: Source view shortcut restricted.');
      return false;
    }

    // Lock Ctrl + S (Save Page)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      return false;
    }
  }

  window.addEventListener('keydown', handleAdminKeyShortcut, true);
  document.addEventListener('keydown', handleAdminKeyShortcut, true);

  // 2. Lock Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showSecurityHUD('Inspection locked: Right-click context menu is disabled.');
    return false;
  });

  // 3. Security HUD Notification
  function showSecurityHUD(message) {
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
    clearTimeout(window.__secHudTimeout);
    window.__secHudTimeout = setTimeout(() => {
      hud.classList.remove('active');
    }, 2800);
  }
})();
