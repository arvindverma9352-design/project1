// Vegetable Mart - Customer Shopping PWA Registration & Install Flow
(function() {
  // Safety check: NEVER run on delivery portal or admin panel
  const path = window.location.pathname.toLowerCase();
  if (path.includes('delivery') || path.includes('admin')) {
    return;
  }

  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          console.log('Vegetable Mart SW registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('Vegetable Mart SW error:', err);
        });
    });
  }

  // 2. Install Prompt Banner for Customer App
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;

    // Check if user dismissed recently (2 days)
    const dismissedUntil = localStorage.getItem('vm_store_pwa_dismissed_until');
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return;
    }

    showStoreInstallBanner();
  });

  function showStoreInstallBanner() {
    if (document.getElementById('vm-store-pwa-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'vm-store-pwa-banner';
    banner.innerHTML = `
      <div class="vm-store-pwa-content">
        <img src="logo.png" alt="Vegetable Mart" class="vm-store-pwa-icon">
        <div class="vm-store-pwa-text">
          <strong>Vegetable Mart App</strong>
          <span>Install for 1-tap fresh veggie shopping!</span>
        </div>
      </div>
      <div class="vm-store-pwa-actions">
        <button type="button" id="vm-store-install-btn" class="vm-store-pwa-btn">📲 Install</button>
        <button type="button" id="vm-store-close-btn" class="vm-store-pwa-close" title="Dismiss">✕</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #vm-store-pwa-banner {
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 440px;
        background: rgba(15, 30, 20, 0.96);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(74, 222, 128, 0.45);
        border-radius: 16px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
        z-index: 99999;
        font-family: 'DM Sans', -apple-system, sans-serif;
        animation: vmStoreSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes vmStoreSlideUp {
        from { transform: translateX(-50%) translateY(90px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      .vm-store-pwa-content { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .vm-store-pwa-icon { width: 40px; height: 40px; border-radius: 10px; object-fit: contain; flex-shrink: 0; background: #0f2b1c; padding: 2px; }
      .vm-store-pwa-text { display: flex; flex-direction: column; min-width: 0; }
      .vm-store-pwa-text strong { color: #f0fdf4; font-size: 13.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .vm-store-pwa-text span { color: #86efac; font-size: 11px; margin-top: 1px; }
      .vm-store-pwa-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
      .vm-store-pwa-btn {
        background: linear-gradient(135deg, #16a34a, #15803d);
        color: #ffffff;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        box-shadow: 0 3px 10px rgba(22, 163, 74, 0.4);
      }
      .vm-store-pwa-btn:active { transform: scale(0.95); }
      .vm-store-pwa-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 15px;
        padding: 4px 6px;
        cursor: pointer;
      }
      .vm-store-pwa-close:hover { color: #ffffff; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    const installBtn = document.getElementById('vm-store-install-btn');
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

    const closeBtn = document.getElementById('vm-store-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        banner.remove();
        localStorage.setItem('vm_store_pwa_dismissed_until', String(Date.now() + 2 * 24 * 60 * 60 * 1000));
      };
    }
  }

  // Also support manual install trigger elements (.store-install-trigger)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.store-install-trigger, .pwa-install-trigger') && deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
    }
  });

  // Listen for successful install
  window.addEventListener('appinstalled', () => {
    const banner = document.getElementById('vm-store-pwa-banner');
    if (banner) banner.remove();
    console.log('Vegetable Mart Store App installed!');
  });
})();
