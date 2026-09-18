// Vegetable Mart PWA Registration & Install Banner
(function() {
  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          console.log('PWA Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA registration error:', err);
        });
    });
  }

  // 2. Install Prompt Banner
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;

    // Check if dismissed recently (3 days)
    const dismissedUntil = localStorage.getItem('vm_pwa_dismissed_until');
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return;
    }

    showInstallBanner();
  });

  function showInstallBanner() {
    if (document.getElementById('vm-pwa-install-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'vm-pwa-install-banner';
    banner.innerHTML = `
      <div class="vm-pwa-content">
        <img src="logo.png" alt="Vegetable Mart" class="vm-pwa-icon">
        <div class="vm-pwa-text">
          <strong>Vegetable Mart App</strong>
          <span>Install for 1-tap fast shopping!</span>
        </div>
      </div>
      <div class="vm-pwa-actions">
        <button type="button" id="vm-pwa-install-btn" class="vm-pwa-btn">📲 Install</button>
        <button type="button" id="vm-pwa-close-btn" class="vm-pwa-close" title="Dismiss">✕</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #vm-pwa-install-banner {
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 440px;
        background: rgba(18, 38, 26, 0.95);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(74, 222, 128, 0.4);
        border-radius: 16px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 99999;
        font-family: 'DM Sans', -apple-system, sans-serif;
        animation: vmPwaSlideUp 0.35s ease;
      }
      @keyframes vmPwaSlideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      .vm-pwa-content { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .vm-pwa-icon { width: 38px; height: 38px; border-radius: 9px; object-fit: contain; flex-shrink: 0; }
      .vm-pwa-text { display: flex; flex-direction: column; min-width: 0; }
      .vm-pwa-text strong { color: #f0fdf4; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .vm-pwa-text span { color: #86efac; font-size: 11px; }
      .vm-pwa-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
      .vm-pwa-btn {
        background: #16a34a;
        color: white;
        border: none;
        padding: 7px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      .vm-pwa-btn:active { transform: scale(0.95); }
      .vm-pwa-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 14px;
        padding: 4px 6px;
        cursor: pointer;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    const installBtn = document.getElementById('vm-pwa-install-btn');
    if (installBtn) {
      installBtn.onclick = async () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          const { outcome } = await deferredInstallPrompt.userChoice;
          if (outcome === 'accepted') {
            banner.remove();
          }
          deferredInstallPrompt = null;
        }
      };
    }

    const closeBtn = document.getElementById('vm-pwa-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        banner.remove();
        localStorage.setItem('vm_pwa_dismissed_until', String(Date.now() + 3 * 24 * 60 * 60 * 1000));
      };
    }
  }

  // Also support manual install button if page has element with class .pwa-install-trigger
  document.addEventListener('click', (e) => {
    if (e.target.closest('.pwa-install-trigger') && deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
    }
  });
})();
