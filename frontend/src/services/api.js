export function getApiBase() {
  if (typeof window === 'undefined') return 'https://project1-czw2.onrender.com';
  
  if (window.location.hostname.endsWith('onrender.com')) {
    return window.location.origin;
  }
  if (window.location.port === '5000') {
    return window.location.origin;
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // In Vite dev mode (port 5173), request proxy or direct port 5000
    return 'http://' + window.location.hostname + ':5000';
  }
  return 'https://project1-czw2.onrender.com';
}

export const API_BASE = getApiBase();

export async function fetchWithFallback(endpoint, options = {}) {
  const base = getApiBase();
  let response = null;
  let lastError = null;

  try {
    response = await fetch(`${base}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
  } catch (err) {
    lastError = err;
  }

  // If failed and primary wasn't Render cloud, fallback to Render cloud
  if ((!response || !response.ok) && base !== 'https://project1-czw2.onrender.com') {
    try {
      const cloudRes = await fetch(`https://project1-czw2.onrender.com${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      if (cloudRes.ok || !response) {
        response = cloudRes;
      }
    } catch (cloudErr) {
      lastError = cloudErr;
    }
  }

  if (!response) {
    throw lastError || new Error('Network request failed');
  }

  return response;
}

export const api = {
  // Products
  async getProducts() {
    const res = await fetchWithFallback(`/api/products?_t=${Date.now()}`, { cache: 'no-store' });
    return res.json();
  },
  async updateProduct(keyOrId, productData) {
    const res = await fetchWithFallback(`/api/products/${keyOrId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
    return res.json();
  },
  async createProduct(productData) {
    const res = await fetchWithFallback('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    return res.json();
  },
  async deleteProduct(keyOrId) {
    const res = await fetchWithFallback(`/api/products/${keyOrId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Store Status
  async getStoreStatus() {
    const res = await fetchWithFallback('/api/settings/store-status');
    return res.json();
  },
  async setStoreStatus(isOpen) {
    const res = await fetchWithFallback('/api/settings/store-status', {
      method: 'POST',
      body: JSON.stringify({ isOpen })
    });
    return res.json();
  },

  // Orders
  async getOrders(query = '') {
    const res = await fetchWithFallback(`/api/orders${query}`);
    return res.json();
  },
  async createOrder(orderData) {
    const res = await fetchWithFallback('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    return res.json();
  },
  async updateOrderStatus(orderId, updateData) {
    const res = await fetchWithFallback(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return res.json();
  },

  // Auth
  async login(credentials) {
    const res = await fetchWithFallback('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return res.json();
  },
  async register(userData) {
    const res = await fetchWithFallback('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return res.json();
  },
  async getWishlist(userId) {
    const res = await fetchWithFallback(`/api/auth/wishlist/${userId}`);
    return res.json();
  },
  async updateWishlist(userId, wishlistItems) {
    const res = await fetchWithFallback(`/api/auth/wishlist/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ wishlist: wishlistItems })
    });
    return res.json();
  },

  // Riders
  async riderLogin(credentials) {
    const res = await fetchWithFallback('/api/riders/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return res.json();
  },
  async toggleRiderDuty(riderId, onDuty) {
    const res = await fetchWithFallback(`/api/riders/${riderId}/duty`, {
      method: 'PUT',
      body: JSON.stringify({ onDuty })
    });
    return res.json();
  },
  async getRiders() {
    const res = await fetchWithFallback('/api/riders');
    return res.json();
  },
  async createRider(riderData) {
    const res = await fetchWithFallback('/api/riders', {
      method: 'POST',
      body: JSON.stringify(riderData)
    });
    return res.json();
  }
};
