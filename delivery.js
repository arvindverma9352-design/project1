// Delivery Partner Dashboard Logic
const API_BASE = 'https://project1-czw2.onrender.com';
const RIDER_PIN = '1234';
const AUTH_STORAGE_KEY = 'vegetable-mart-rider-auth';
const CACHE_STORAGE_KEY = 'vegetable-mart-rider-cache';

let enteredPin = '';
let allOrders = [];
let currentFilter = 'all';
let searchQuery = '';
let pollingTimer = null;

// ================= PIN AUTHENTICATION =================
function checkAuth() {
    const isRemembered = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    const isSessionActive = sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';

    if (isRemembered || isSessionActive) {
        unlockApp();
    } else {
        document.getElementById('pin-lock-overlay').style.display = 'flex';
        document.getElementById('delivery-app').style.display = 'none';
        resetPinDots();
    }
}

function enterPinDigit(digit) {
    if (enteredPin.length >= 4) return;
    enteredPin += digit;
    updatePinDots();

    if (enteredPin.length === 4) {
        setTimeout(validatePin, 150);
    }
}

function backspacePin() {
    if (enteredPin.length > 0) {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDots();
        document.getElementById('pin-error').textContent = '';
    }
}

function clearPin() {
    enteredPin = '';
    updatePinDots();
    document.getElementById('pin-error').textContent = '';
}

function updatePinDots() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
            dot.classList.toggle('filled', i <= enteredPin.length);
        }
    }
}

function resetPinDots() {
    enteredPin = '';
    updatePinDots();
    const err = document.getElementById('pin-error');
    if (err) err.textContent = '';
}

function validatePin() {
    const rememberMe = document.getElementById('pin-remember')?.checked;
    const errorEl = document.getElementById('pin-error');

    if (enteredPin === RIDER_PIN) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        if (rememberMe) {
            localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        }
        unlockApp();
    } else {
        if (errorEl) {
            errorEl.textContent = '❌ Galat PIN! Kripya sahi 4-digit PIN daalein.';
        }
        resetPinDots();
    }
}

function unlockApp() {
    document.getElementById('pin-lock-overlay').style.display = 'none';
    document.getElementById('delivery-app').style.display = 'block';
    fetchOrders();
    startPolling();
}

function lockPortal() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    stopPolling();
    document.getElementById('delivery-app').style.display = 'none';
    document.getElementById('pin-lock-overlay').style.display = 'flex';
    resetPinDots();
}

// ================= ORDER FETCHING & SYNC =================
async function fetchOrders(isManual = false) {
    const refreshBtn = document.getElementById('refresh-btn');
    if (isManual && refreshBtn) {
        refreshBtn.classList.add('is-refreshing');
    }

    try {
        const res = await fetch(`${API_BASE}/api/orders`);
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
        // Load cached orders if offline on road
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

// PWA Install on Mobile
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const installBtn = document.getElementById('install-app-btn');
    if (installBtn) {
        installBtn.style.display = 'flex';
        installBtn.onclick = async () => {
            if (deferredInstallPrompt) {
                deferredInstallPrompt.prompt();
                const { outcome } = await deferredInstallPrompt.userChoice;
                if (outcome === 'accepted') {
                    installBtn.style.display = 'none';
                    showToast('🎉 App Home Screen par install ho rahi hai!');
                }
                deferredInstallPrompt = null;
            }
        };
    }
});

// On page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

