// Delivery Partner Dashboard Logic
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://project1-czw2.onrender.com';

const RIDER_SESSION_KEY = 'vegetable-mart-rider-session';
const CACHE_STORAGE_KEY = 'vegetable-mart-rider-cache';

let currentRider = null;
let allOrders = [];
let currentFilter = 'all';
let searchQuery = '';
let pollingTimer = null;

// ================= RIDER AUTHENTICATION =================
function checkAuth() {
    let session = null;
    try {
        session = JSON.parse(localStorage.getItem(RIDER_SESSION_KEY) || sessionStorage.getItem(RIDER_SESSION_KEY));
    } catch (e) {
        session = null;
    }

    if (session && (session.id || session._id || session.phone)) {
        currentRider = session;
        unlockApp();
    } else {
        document.getElementById('pin-lock-overlay').style.display = 'flex';
        document.getElementById('delivery-app').style.display = 'none';
        const err = document.getElementById('pin-error');
        if (err) err.textContent = '';
    }
}

async function handleRiderLogin(event) {
    if (event) event.preventDefault();
    const phoneInput = document.getElementById('rider-login-phone');
    const pinInput = document.getElementById('rider-login-pin');
    const errorEl = document.getElementById('pin-error');
    const rememberMe = document.getElementById('pin-remember')?.checked;
    const submitBtn = document.getElementById('login-submit-btn');

    const phone = phoneInput ? phoneInput.value.trim() : '';
    const pin = pinInput ? pinInput.value.trim() : '';

    if (!phone || !pin) {
        if (errorEl) errorEl.textContent = '❌ Mobile number aur 4-digit PIN daalna zaroori hai.';
        return;
    }

    if (errorEl) errorEl.textContent = 'Logging in...';
    if (submitBtn) submitBtn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/api/riders/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, pin })
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || 'Login failed. Sahi mobile aur PIN daalein.');
        }

        currentRider = data.rider;
        const sessionStr = JSON.stringify(currentRider);
        sessionStorage.setItem(RIDER_SESSION_KEY, sessionStr);
        if (rememberMe) {
            localStorage.setItem(RIDER_SESSION_KEY, sessionStr);
        }

        if (errorEl) errorEl.textContent = '';
        unlockApp();
    } catch (err) {
        if (errorEl) errorEl.textContent = `❌ ${err.message}`;
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function quickTestLogin() {
    const phoneInput = document.getElementById('rider-login-phone');
    const pinInput = document.getElementById('rider-login-pin');
    if (phoneInput && !phoneInput.value) phoneInput.value = '9876543210';
    if (pinInput) pinInput.value = '1234';
    await handleRiderLogin();
}

function unlockApp() {
    document.getElementById('pin-lock-overlay').style.display = 'none';
    document.getElementById('delivery-app').style.display = 'block';

    const nameEl = document.getElementById('captain-display-name');
    const phoneEl = document.getElementById('captain-display-phone');
    if (nameEl && currentRider) nameEl.textContent = currentRider.name || 'Delivery Captain';
    if (phoneEl && currentRider) phoneEl.textContent = `📱 ${currentRider.phone || ''}`;

    updateDutyUI(currentRider ? currentRider.dutyStatus : 'ON');

    fetchOrders();
    startPolling();
}

function logoutCaptain() {
    if (!confirm('Kya aap Captain account se logout karna chahte hain?')) return;
    localStorage.removeItem(RIDER_SESSION_KEY);
    sessionStorage.removeItem(RIDER_SESSION_KEY);
    currentRider = null;
    stopPolling();
    document.getElementById('delivery-app').style.display = 'none';
    document.getElementById('pin-lock-overlay').style.display = 'flex';
    const errEl = document.getElementById('pin-error');
    if (errEl) errEl.textContent = '';
}

// ================= DUTY ON / OFF TOGGLE =================
async function toggleCaptainDuty(desiredStatus) {
    if (!currentRider) return;

    const nextStatus = desiredStatus || (currentRider.dutyStatus === 'ON' ? 'OFF' : 'ON');
    const riderId = currentRider.id || currentRider._id;

    currentRider.dutyStatus = nextStatus;
    updateDutyUI(nextStatus);

    const sessionStr = JSON.stringify(currentRider);
    sessionStorage.setItem(RIDER_SESSION_KEY, sessionStr);
    if (localStorage.getItem(RIDER_SESSION_KEY)) {
        localStorage.setItem(RIDER_SESSION_KEY, sessionStr);
    }

    try {
        const res = await fetch(`${API_BASE}/api/riders/${riderId}/duty`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dutyStatus: nextStatus })
        });
        const data = await res.json();
        if (data.success && data.dutyStatus) {
            currentRider.dutyStatus = data.dutyStatus;
            updateDutyUI(data.dutyStatus);
        }
        showToast(nextStatus === 'ON' ? '🟢 Duty ON! Ready for deliveries.' : '🔴 Duty OFF. Offline mode.');
    } catch (err) {
        console.warn('Duty status sync warning:', err.message);
    }

    fetchOrders();
}

function updateDutyUI(dutyStatus) {
    const dutyBtn = document.getElementById('duty-toggle-btn');
    const dutyText = document.getElementById('duty-text');
    const dutyOffBanner = document.getElementById('duty-off-banner');

    const isDutyOn = dutyStatus === 'ON';

    if (dutyBtn) {
        dutyBtn.className = `duty-toggle-btn ${isDutyOn ? 'on' : 'off'}`;
    }
    if (dutyText) {
        dutyText.textContent = isDutyOn ? 'DUTY ON' : 'DUTY OFF';
    }
    if (dutyOffBanner) {
        dutyOffBanner.style.display = isDutyOn ? 'none' : 'flex';
    }
}

// ================= ORDER FETCHING & SYNC =================
async function fetchOrders(isManual = false) {
    const refreshBtn = document.getElementById('refresh-btn');
    if (isManual && refreshBtn) {
        refreshBtn.classList.add('is-refreshing');
    }

    try {
        const riderId = currentRider ? (currentRider.id || currentRider._id) : '';
        const riderPhone = currentRider ? currentRider.phone : '';
        const query = riderId || riderPhone
            ? `?riderId=${encodeURIComponent(riderId)}&riderPhone=${encodeURIComponent(riderPhone)}`
            : '';

        const res = await fetch(`${API_BASE}/api/orders${query}`);
        if (!res.ok) {
            throw new Error(`Server returned status ${res.status}`);
        }
        const data = await res.json();
        
        let fetchedOrders = [];
        if (Array.isArray(data)) {
            fetchedOrders = data;
        } else if (data && Array.isArray(data.orders)) {
            fetchedOrders = data.orders;
        } else if (data && data.order) {
            fetchedOrders = [data.order];
        }

        // Filter strictly for this captain if assigned
        if (currentRider && (riderId || riderPhone)) {
            fetchedOrders = fetchedOrders.filter((order) => {
                if (order.deliveryBoyId && (order.deliveryBoyId === riderId || order.deliveryBoyId === currentRider._id)) return true;
                if (order.deliveryBoyPhone && order.deliveryBoyPhone === riderPhone) return true;
                return false;
            });
        }

        // Sort: newest first
        fetchedOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        allOrders = fetchedOrders;
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(allOrders));

        updateMetrics();
        renderOrders();

        if (isManual) {
            showToast('✅ Orders refreshed!');
        }
    } catch (err) {
        console.warn('Network error, loading offline cache:', err);
        const cached = localStorage.getItem(CACHE_STORAGE_KEY);
        if (cached) {
            try {
                allOrders = JSON.parse(cached);
                updateMetrics();
                renderOrders();
                if (isManual) showToast('Loaded cached orders (Offline)');
            } catch (e) {}
        } else {
            renderEmpty('Network Error', 'Server se connect nahi ho paya. Internet connection check karein.');
        }
    } finally {
        if (refreshBtn) {
            setTimeout(() => refreshBtn.classList.remove('is-refreshing'), 600);
        }
    }
}

// Auto-refresh every 30 seconds
function startPolling() {
    stopPolling();
    pollingTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
            fetchOrders(false);
        }
    }, 30000);
}

function stopPolling() {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
}

// ================= METRICS & STATS =================
function updateMetrics() {
    let packed = 0;
    let out = 0;
    let delivered = 0;
    let cashToCollect = 0;

    allOrders.forEach((o) => {
        const status = (o.status || 'Packed').trim();
        if (status === 'Packed' || status === 'Pending') {
            packed++;
            cashToCollect += Number(o.total) || 0;
        } else if (status === 'Out for Delivery' || status === 'Dispatched') {
            out++;
            cashToCollect += Number(o.total) || 0;
        } else if (status === 'Delivered') {
            delivered++;
        }
    });

    document.getElementById('metric-packed').textContent = packed;
    document.getElementById('metric-out').textContent = out;
    document.getElementById('metric-delivered').textContent = delivered;
    document.getElementById('metric-cash').textContent = `₹${cashToCollect.toLocaleString('en-IN')}`;

    document.getElementById('count-all').textContent = allOrders.length;
    document.getElementById('count-packed').textContent = packed;
    document.getElementById('count-out').textContent = out;
    document.getElementById('count-delivered').textContent = delivered;
}

// ================= SEARCH & FILTER =================
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderOrders();
}

function handleSearch() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    searchQuery = (input?.value || '').trim().toLowerCase();

    if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'block' : 'none';
    }
    renderOrders();
}

function clearSearch() {
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    searchQuery = '';
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) clearBtn.style.display = 'none';
    renderOrders();
}

// ================= RENDER ORDERS =================
function renderOrders() {
    const feed = document.getElementById('orders-feed');
    if (!feed) return;

    // Filter by status tab
    let filtered = allOrders.filter((order) => {
        const s = (order.status || 'Packed').trim();
        if (currentFilter === 'all') return true;
        if (currentFilter === 'Packed') return s === 'Packed' || s === 'Pending';
        if (currentFilter === 'Out for Delivery') return s === 'Out for Delivery' || s === 'Dispatched';
        if (currentFilter === 'Delivered') return s === 'Delivered';
        return true;
    });

    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter((order) => {
            const name = (order.customer || '').toLowerCase();
            const mobile = (order.mobile || '').toLowerCase();
            const address = (order.address || '').toLowerCase();
            const id = (order._id || order.id || '').toLowerCase();
            return name.includes(searchQuery) || mobile.includes(searchQuery) || address.includes(searchQuery) || id.includes(searchQuery);
        });
    }

    if (allOrders.length === 0) {
        feed.innerHTML = `
            <div class="no-assigned-orders">
                <div class="no-orders-icon">🛵</div>
                <h3>Abhi Koi Order Assign Nahi Hua Hai</h3>
                <p>Admin panel se jaise hi aapko naya order assign hoga, wo yahan alert ke sath dikhayi dega.</p>
            </div>
        `;
        return;
    }

    if (filtered.length === 0) {
        feed.innerHTML = `
            <div class="empty-orders">
                <span class="empty-icon">🚴</span>
                <h3>Koi Order Nahi Mila</h3>
                <p>${searchQuery ? 'Aapki search ke anusaar koi order nahi hai.' : 'Is category mein koi active deliveries nahi hain.'}</p>
            </div>
        `;
        return;
    }

    feed.innerHTML = filtered.map((order) => createOrderCardHtml(order)).join('');
}

function createOrderCardHtml(order) {
    const orderId = order._id || order.id || 'N/A';
    const shortId = orderId.length > 8 ? orderId.slice(-6).toUpperCase() : orderId;
    const status = (order.status || 'Packed').trim();
    const customer = order.customer || 'Customer';
    const rawMobile = String(order.mobile || '').trim();
    const cleanMobile = rawMobile.replace(/\D/g, '').slice(-10);
    const total = Number(order.total) || 0;
    const createdAt = order.createdAt ? formatOrderTime(order.createdAt) : 'Recently';

    // Parse address & map url
    let fullAddress = order.address || 'Address not provided';
    let mapUrl = order.location || '';
    if (!mapUrl && fullAddress.includes('https://www.google.com/maps')) {
        const match = fullAddress.match(/(https:\/\/www\.google\.com\/maps\S*)/);
        if (match) {
            mapUrl = match[1];
            fullAddress = fullAddress.replace(/\|\s*📍\s*Map:\s*https:\/\/www\.google\.com\/maps\S*/, '').trim();
        }
    }
    // Fallback search map if no exact GPS link
    if (!mapUrl && fullAddress && fullAddress !== 'Address not provided') {
        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    }

    // Status classes
    let statusClass = 'packed';
    let statusLabel = '📦 Packed';
    let cardBorderClass = 'status-packed';
    if (status === 'Out for Delivery' || status === 'Dispatched') {
        statusClass = 'out';
        statusLabel = '🚴 On The Way';
        cardBorderClass = 'status-out';
    } else if (status === 'Delivered') {
        statusClass = 'delivered';
        statusLabel = '✅ Delivered';
        cardBorderClass = 'status-delivered';
    }

    // WhatsApp prefilled message
    const waText = encodeURIComponent(
        `Namaste ${customer}! Main Vegetable Mart se aapka fresh vegetable order (${shortId}) deliver karne aa raha hoon. Total cash: Rs.${total}.`
    );

    // Items preview
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsCountText = `${items.length} Item${items.length === 1 ? '' : 's'}`;

    let itemsRowsHtml = items.map(item => `
        <div class="item-row">
            <span class="item-name">${escapeHtml(item.name || 'Vegetable')} (${item.weight || '1kg'})</span>
            <span class="item-meta">Qty: ${item.quantity || 1} • ₹${item.price || 0}</span>
        </div>
    `).join('');

    // Bottom Action Button based on status
    let actionBtnHtml = '';
    if (status === 'Packed' || status === 'Pending') {
        actionBtnHtml = `
            <button type="button" class="status-progress-btn btn-pick" onclick="updateStatus('${orderId}', 'Out for Delivery')">
                <span>🚴</span> Start Delivery (Out for Delivery)
            </button>
        `;
    } else if (status === 'Out for Delivery' || status === 'Dispatched') {
        actionBtnHtml = `
            <button type="button" class="status-progress-btn btn-deliver" onclick="updateStatus('${orderId}', 'Delivered')">
                <span>✅</span> Mark as Delivered
            </button>
        `;
    } else if (status === 'Delivered') {
        actionBtnHtml = `
            <div class="delivered-completed-banner">
                ✓ Order Successfully Delivered
            </div>
        `;
    }

    return `
        <article class="order-card ${cardBorderClass}" id="card-${orderId}">
            <div class="order-top">
                <div class="order-id-group">
                    <span class="order-id">#${shortId}</span>
                    <span class="order-time">• ${createdAt}</span>
                </div>
                <span class="status-pill ${statusClass}">${statusLabel}</span>
            </div>

            <div class="customer-section">
                <div class="customer-name">
                    <span>👤</span> ${escapeHtml(customer)}
                </div>
                <div class="customer-address">
                    <span class="address-icon">📍</span>
                    <span>${escapeHtml(fullAddress)}</span>
                </div>
            </div>

            <!-- Items accordion preview -->
            ${items.length > 0 ? `
                <button type="button" class="items-preview-toggle" onclick="toggleItems('${orderId}')">
                    <span>🛒 View ${itemsCountText}</span>
                    <span id="chevron-${orderId}">▼</span>
                </button>
                <div id="items-${orderId}" class="items-list-container">
                    ${itemsRowsHtml}
                </div>
            ` : ''}

            <!-- Cash on Delivery Banner -->
            <div class="cod-banner ${status === 'Delivered' ? 'is-delivered' : ''}">
                <div class="cod-label">
                    <span>💵</span> ${status === 'Delivered' ? 'Amount Collected' : 'Cash to Collect (COD)'}
                </div>
                <div class="cod-amount">₹${total.toLocaleString('en-IN')}</div>
            </div>

            <!-- 3 Quick Action Buttons -->
            <div class="action-buttons-grid">
                ${mapUrl ? `
                    <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="rider-action-btn nav-btn">
                        <span>🗺️</span> Navigate
                    </a>
                ` : `
                    <button type="button" class="rider-action-btn nav-btn" disabled style="opacity: 0.5;">
                        <span>🗺️</span> No Location
                    </button>
                `}

                ${cleanMobile ? `
                    <a href="tel:${cleanMobile}" class="rider-action-btn call-btn">
                        <span>📞</span> Call
                    </a>
                    <a href="https://wa.me/91${cleanMobile}?text=${waText}" target="_blank" rel="noopener noreferrer" class="rider-action-btn wa-btn">
                        <span>💬</span> Chat
                    </a>
                ` : `
                    <button type="button" class="rider-action-btn call-btn" disabled style="opacity: 0.5;">📞 Call</button>
                    <button type="button" class="rider-action-btn wa-btn" disabled style="opacity: 0.5;">💬 Chat</button>
                `}
            </div>

            <!-- Primary Progress Button -->
            ${actionBtnHtml}
        </article>
    `;
}

// Toggle items accordion
function toggleItems(orderId) {
    const list = document.getElementById(`items-${orderId}`);
    const chevron = document.getElementById(`chevron-${orderId}`);
    if (list) {
        list.classList.toggle('open');
        if (chevron) {
            chevron.textContent = list.classList.contains('open') ? '▲' : '▼';
        }
    }
}

// ================= UPDATE ORDER STATUS =================
async function updateStatus(orderId, nextStatus) {
    const card = document.getElementById(`card-${orderId}`);
    if (card) {
        card.style.opacity = '0.6';
        card.style.pointerEvents = 'none';
    }

    try {
        const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: nextStatus })
        });

        if (!response.ok) {
            throw new Error(`Failed to update status (${response.status})`);
        }

        // Update local object immediately for smooth UX
        const found = allOrders.find(o => (o._id || o.id) === orderId);
        if (found) {
            found.status = nextStatus;
        }

        updateMetrics();
        renderOrders();

        if (nextStatus === 'Delivered') {
            showToast('🎉 Order Marked as Delivered!');
        } else {
            showToast(`🚴 Status updated to ${nextStatus}!`);
        }
    } catch (err) {
        console.error('Error updating status:', err);
        showToast('❌ Update fail hua. Kripya dobara try karein.');
        if (card) {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        }
    }
}

// ================= UTILITIES =================
function formatOrderTime(isoString) {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'Recently';

        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHours = Math.floor(diffMin / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return 'Recently';
    }
}

function showToast(message) {
    const toast = document.getElementById('delivery-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ================= DELIVERY PWA INSTALL & OFFLINE SUPPORT =================
let deferredInstallPrompt = null;

// Register Service Worker for offline and caching support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('VM Delivery SW registered:', reg.scope))
            .catch(err => console.warn('VM Delivery SW error:', err));
    });
}

// 1. Capture beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('VM Captain beforeinstallprompt captured!');
    const headerBtn = document.getElementById('install-app-btn');
    if (headerBtn) headerBtn.style.display = 'inline-flex';
});

// 2. Initialize install UI on load
function initCaptainInstallUI() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true;
    if (isStandalone) return;

    // Show header icon
    const headerBtn = document.getElementById('install-app-btn');
    if (headerBtn) {
        headerBtn.style.display = 'inline-flex';
        headerBtn.onclick = triggerDeliveryInstall;
    }

    // Show bottom banner
    const dismissedUntil = localStorage.getItem('vm_delivery_dismissed_until');
    if (!dismissedUntil || Date.now() >= Number(dismissedUntil)) {
        setTimeout(showDeliveryInstallBanner, 800);
    }
}

async function triggerDeliveryInstall() {
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
            cleanupCaptainInstallUI();
            showToast('🎉 VM Delivery Captain App Installed!');
        }
        deferredInstallPrompt = null;
    } else {
        showCaptainInstallGuide();
    }
}

function showDeliveryInstallBanner() {
    if (document.getElementById('vm-delivery-install-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'vm-delivery-install-banner';
    banner.innerHTML = `
        <div class="vm-del-content">
            <img src="delivery-icon-192.png" alt="VM Captain" class="vm-del-icon">
            <div class="vm-del-text">
                <strong>VM Delivery Captain App</strong>
                <span>Install for quick orders & live GPS routing</span>
            </div>
        </div>
        <div class="vm-del-actions">
            <button type="button" id="vm-del-install-btn" class="vm-del-btn">📲 Install</button>
            <button type="button" id="vm-del-close-btn" class="vm-del-close" title="Dismiss">✕</button>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        #vm-delivery-install-banner {
            position: fixed;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 24px);
            max-width: 440px;
            background: rgba(11, 28, 18, 0.97);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(34, 197, 94, 0.5);
            border-radius: 16px;
            padding: 10px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.65);
            z-index: 999999;
            font-family: 'DM Sans', -apple-system, sans-serif;
            animation: vmDelSlideUp 0.35s ease;
        }
        @keyframes vmDelSlideUp {
            from { transform: translateX(-50%) translateY(90px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        .vm-del-content { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .vm-del-icon { width: 40px; height: 40px; border-radius: 10px; object-fit: contain; flex-shrink: 0; }
        .vm-del-text { display: flex; flex-direction: column; min-width: 0; }
        .vm-del-text strong { color: #f0fdf4; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .vm-del-text span { color: #86efac; font-size: 11px; margin-top: 1px; }
        .vm-del-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .vm-del-btn {
            background: linear-gradient(135deg, #16a34a, #15803d);
            color: #ffffff;
            border: none;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(22, 163, 74, 0.4);
        }
        .vm-del-btn:active { transform: scale(0.95); }
        .vm-del-close {
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 15px;
            padding: 4px 6px;
            cursor: pointer;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    const installBtn = document.getElementById('vm-del-install-btn');
    if (installBtn) {
        installBtn.onclick = triggerDeliveryInstall;
    }

    const closeBtn = document.getElementById('vm-del-close-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            banner.remove();
            localStorage.setItem('vm_delivery_dismissed_until', String(Date.now() + 2 * 24 * 60 * 60 * 1000));
        };
    }
}

function showCaptainInstallGuide() {
    if (document.getElementById('vm-captain-guide-modal')) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const modal = document.createElement('div');
    modal.id = 'vm-captain-guide-modal';
    modal.innerHTML = `
      <div class="vm-guide-backdrop" onclick="document.getElementById('vm-captain-guide-modal').remove()" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999998;"></div>
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#0e2417;border:1px solid rgba(74,222,128,0.4);border-radius:20px;max-width:360px;width:calc(100% - 36px);padding:20px;z-index:9999999;color:#f0fdf4;box-shadow:0 20px 40px rgba(0,0,0,0.7);font-family:sans-serif;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <img src="delivery-icon-192.png" style="width:44px;height:44px;border-radius:10px;">
          <div>
            <h3 style="margin:0;font-size:16px;">VM Delivery Captain</h3>
            <p style="margin:2px 0 0;font-size:12px;color:#86efac;">Rider Partner App</p>
          </div>
          <button type="button" onclick="document.getElementById('vm-captain-guide-modal').remove()" style="margin-left:auto;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px;font-size:13px;line-height:1.4;">
          ${isIOS ? `
            <div>1. Safari me niche <strong>Share ( ⬆️ )</strong> dabayein.</div>
            <div>2. <strong>'Add to Home Screen' (➕)</strong> chunein.</div>
            <div>3. Upar <strong>'Add'</strong> dabayein.</div>
          ` : `
            <div>1. Chrome me upar <strong>3 Dots (⋮)</strong> par tap karein.</div>
            <div>2. <strong>'Install app'</strong> ya <strong>'Add to Home screen'</strong> chunein.</div>
            <div>3. <strong>'Install'</strong> par tap karein.</div>
          `}
        </div>

        <button type="button" onclick="document.getElementById('vm-captain-guide-modal').remove()" style="width:100%;background:#16a34a;color:#fff;border:none;padding:10px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;">Theek Hai</button>
      </div>
    `;

    document.body.appendChild(modal);
}

function cleanupCaptainInstallUI() {
    const banner = document.getElementById('vm-delivery-install-banner');
    if (banner) banner.remove();
    const headerBtn = document.getElementById('install-app-btn');
    if (headerBtn) headerBtn.style.display = 'none';
}

window.addEventListener('appinstalled', () => {
    cleanupCaptainInstallUI();
    showToast('🎉 VM Delivery Captain App Installed Successfully!');
});

// On page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initCaptainInstallUI();
});

