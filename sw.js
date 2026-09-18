// Vegetable Mart & VM Delivery Progressive Web App Service Worker
// Network-First Strategy ensures all live code updates and admin changes reflect instantly.

const CACHE_NAME = 'vegetable-mart-v2';
const PRECACHE_ASSETS = [
  './',
  'index.html',
  'Af-lo-sin-.html',
  'cart.html',
  'wishlist.html',
  'profile.html',
  'delivery.html',
  'logo.png',
  'delivery-icon.png',
  'delivery-icon-192.png',
  'manifest.json',
  'delivery-manifest.json',
  'Af-lo-sin-.css',
  'delivery.css',
  'pwa-install.js'
];

// Install: precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial fallback:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: NETWORK-FIRST STRATEGY
// Always get the freshest content from the server first so user edits are live!
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Don't intercept non-GET requests or browser extensions
  if (req.method !== 'GET' || !req.url.startsWith('http')) {
    return;
  }

  // Bypass API requests to Render backend directly (let fetch handle API data)
  if (req.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkRes;
      })
      .catch(() => {
        // Offline fallback from cache
        return caches.match(req).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          if (req.mode === 'navigate') {
            if (req.url.includes('delivery')) {
              return caches.match('delivery.html');
            }
            return caches.match('index.html') || caches.match('Af-lo-sin-.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});
