// Vegetable Mart - Customer Shopping PWA Registration & Install Flow
(function() {
  'use strict';

  // Safety check: NEVER run on delivery portal or admin panel
  const path = window.location.pathname.toLowerCase();
  if (path.includes('delivery') || path.includes('admin')) {
    return;
  }

  // 1. Check if already running as installed standalone app
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true ||
                       document.referrer.includes('android-app://');

  if (isStandalone) {
    // App is already installed and opened as app!
    return;
  }

  // 2. Register Service Worker
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

  // 3. Capture native install prompt
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('beforeinstallprompt captured!');
    // If banner already visible, ensure button triggers prompt
    updateInstallButtonState();
  });

  function updateInstallButtonState() {
    const btn = document.getElementById('vm-store-install-btn');
    if (btn && deferredInstallPrompt) {
      btn.textContent = '📲 1-Tap Install';
    }
  }

  // 4. Show Install Banner automatically on page load
  window.addEventListener('DOMContentLoaded', initInstallUI);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initInstallUI, 600);
  }

  function initInstallUI() {
    if (document.getElementById('vm-store-pwa-banner')) return;

    // Check if dismissed in this session
    const sessionDismissed = sessionStorage.getItem('vm_store_install_dismissed');
    if (!sessionDismissed) {
      setTimeout(showStoreInstallBanner, 900);
    }

    // Always create a persistent quick install floating pill on mobile
    createFloatingInstallPill();
  }

  function showStoreInstallBanner() {
    if (document.getElementById('vm-store-pwa-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'vm-store-pwa-banner';
    banner.innerHTML = `
      <div class="vm-store-pwa-content">
        <img src="logo-192.png" alt="Vegetable Mart" class="vm-store-pwa-icon" onerror="this.src='logo.png'">
        <div class="vm-store-pwa-text">
          <strong>Vegetable Mart App</strong>
          <span>Install for faster orders & daily fresh veggies!</span>
        </div>
      </div>
      <div class="vm-store-pwa-actions">
        <button type="button" id="vm-store-install-btn" class="vm-store-pwa-btn">📲 Install App</button>
        <button type="button" id="vm-store-close-btn" class="vm-store-pwa-close" title="Dismiss">✕</button>
      </div>
    `;

    injectStyles();
    document.body.appendChild(banner);

    const installBtn = document.getElementById('vm-store-install-btn');
    if (installBtn) {
      installBtn.onclick = handleInstallClick;
    }

    const closeBtn = document.getElementById('vm-store-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        banner.remove();
        sessionStorage.setItem('vm_store_install_dismissed', 'true');
      };
    }
  }

  function createFloatingInstallPill() {
    if (document.getElementById('vm-floating-install-pill')) return;

    const pill = document.createElement('button');
    pill.id = 'vm-floating-install-pill';
    pill.type = 'button';
    pill.innerHTML = `<span>📲</span> Install App`;
    pill.title = 'Install Vegetable Mart on phone';
    pill.onclick = handleInstallClick;

    injectStyles();
    document.body.appendChild(pill);
  }

  // Handle Install Action
  async function handleInstallClick() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        cleanupInstallUI();
      }
      deferredInstallPrompt = null;
    } else {
      // Fallback modal with guide for iOS & Chrome
      showInstallGuideModal();
    }
  }

  function showInstallGuideModal() {
    if (document.getElementById('vm-install-guide-modal')) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const modal = document.createElement('div');
    modal.id = 'vm-install-guide-modal';
    modal.innerHTML = `
      <div class="vm-guide-backdrop" onclick="document.getElementById('vm-install-guide-modal').remove()"></div>
      <div class="vm-guide-card">
        <div class="vm-guide-header">
          <img src="logo-192.png" alt="Vegetable Mart" class="vm-guide-logo" onerror="this.src='logo.png'">
          <div>
            <h3>Install Vegetable Mart</h3>
            <p>Home Screen par app jaisa chalayein</p>
          </div>
          <button type="button" class="vm-guide-close" onclick="document.getElementById('vm-install-guide-modal').remove()">✕</button>
        </div>

        <div class="vm-guide-body">
          ${isIOS ? `
            <div class="vm-step">
              <span class="step-num">1</span>
              <div>Safari me niche <strong>Share button</strong> ( ⬆️ / ⎋ ) par tap karein.</div>
            </div>
            <div class="vm-step">
              <span class="step-num">2</span>
              <div>Niche scroll karke <strong>'Add to Home Screen' (➕)</strong> chunein.</div>
            </div>
            <div class="vm-step">
              <span class="step-num">3</span>
              <div>Upar <strong>'Add'</strong> dabayein. App aapke iPhone par aa jayegi!</div>
            </div>
          ` : `
            <div class="vm-step">
              <span class="step-num">1</span>
              <div>Chrome me upar right side <strong>3 Dots (⋮)</strong> par click karein.</div>
            </div>
            <div class="vm-step">
              <span class="step-num">2</span>
              <div>Menu me se <strong>'Install app'</strong> ya <strong>'Add to Home screen'</strong> chunein.</div>
            </div>
            <div class="vm-step">
              <span class="step-num">3</span>
              <div><strong>'Install'</strong> par tap karein — 1-tap app ready ho jayegi!</div>
            </div>
          `}
        </div>

        <button type="button" class="vm-guide-ok-btn" onclick="document.getElementById('vm-install-guide-modal').remove()">Theek Hai, Samajh Gaya</button>
      </div>
    `;

    document.body.appendChild(modal);
  }

  function cleanupInstallUI() {
    const banner = document.getElementById('vm-store-pwa-banner');
    if (banner) banner.remove();
    const pill = document.getElementById('vm-floating-install-pill');
    if (pill) pill.remove();
  }

  // Listen for successful install
  window.addEventListener('appinstalled', () => {
    cleanupInstallUI();
    console.log('Vegetable Mart Store App installed!');
  });

  // Styles
  function injectStyles() {
    if (document.getElementById('vm-pwa-unified-styles')) return;

    const style = document.createElement('style');
    style.id = 'vm-pwa-unified-styles';
    style.textContent = `
      #vm-store-pwa-banner {
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 24px);
        max-width: 440px;
        background: rgba(14, 30, 20, 0.97);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(74, 222, 128, 0.5);
        border-radius: 16px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.6);
        z-index: 999999;
        font-family: 'DM Sans', -apple-system, sans-serif;
        animation: vmStoreBannerSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes vmStoreBannerSlide {
        from { transform: translateX(-50%) translateY(80px); opacity: 0; }
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
        padding: 8px 14px;
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
        font-size: 16px;
        padding: 4px 6px;
        cursor: pointer;
      }

      /* Floating Pill */
      #vm-floating-install-pill {
        position: fixed;
        bottom: 82px;
        right: 16px;
        background: #16a34a;
        color: #ffffff;
        border: 1px solid rgba(134, 239, 172, 0.4);
        padding: 7px 14px;
        border-radius: 24px;
        font-size: 12px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        z-index: 99998;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      #vm-floating-install-pill:active { transform: scale(0.93); }

      /* Guide Modal */
      #vm-install-guide-modal {
        position: fixed;
        inset: 0;
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        font-family: 'DM Sans', -apple-system, sans-serif;
      }
      .vm-guide-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(6px);
      }
      .vm-guide-card {
        position: relative;
        background: #112317;
        border: 1px solid rgba(74, 222, 128, 0.4);
        border-radius: 20px;
        max-width: 380px;
        width: 100%;
        padding: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.7);
        color: #f0fdf4;
      }
      .vm-guide-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
      .vm-guide-logo { width: 44px; height: 44px; border-radius: 12px; object-fit: contain; }
      .vm-guide-header h3 { margin: 0; font-size: 16px; color: #f0fdf4; }
      .vm-guide-header p { margin: 2px 0 0; font-size: 12px; color: #86efac; }
      .vm-guide-close { margin-left: auto; background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; }
      .vm-guide-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
      .vm-step { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; line-height: 1.4; color: #dcfce7; }
      .step-num {
        background: #16a34a;
        color: #fff;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        flex-shrink: 0;
      }
      .vm-guide-ok-btn {
        width: 100%;
        background: #16a34a;
        color: #fff;
        border: none;
        padding: 11px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }
})();
