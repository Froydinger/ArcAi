const CACHE_NAME = 'arcana-cache-v2'; // Incremented cache name
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Removed local icon paths
  // Consider adding the external URL if needed, but be aware of potential caching issues
  // 'https://froydingermediagroup.wordpress.com/wp-content/uploads/2025/03/arcai2.png'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache');
        const promises = urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.error(`[Service Worker] Failed to cache ${url}:`, err);
          });
        });
        return Promise.all(promises);
      })
      .catch(err => {
        console.error('[Service Worker] Failed to open cache:', err);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip Vite HMR requests and source maps
  if (event.request.url.includes('/@vite/client') || event.request.url.endsWith('.map')) {
    return;
  }

  // Handle GET requests (cache-first strategy)
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Cache hit - return response
          if (response) {
            return response;
          }

          // Cache miss - fetch from network
          return fetch(event.request).then(
            (response) => {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.type === 'error') {
                 // Don't cache invalid responses or errors
                 // console.log('[Service Worker] Fetch failed or invalid response, not caching:', event.request.url, response?.status);
                 return response;
              }

              // Check for opaque responses (cross-origin resources without CORS)
              // We generally don't cache these as we can't verify their status or content
              if (response.type === 'opaque') {
                // console.log('[Service Worker] Opaque response, not caching:', event.request.url);
                return response;
              }

              // Clone the response because it's a stream and can only be consumed once
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache).catch(err => {
                     console.error(`[Service Worker] Failed to cache resource ${event.request.url}:`, err);
                  });
                });

              return response;
            }
          ).catch(err => {
            console.error('[Service Worker] Fetch error:', err);
            // Optional: Return an offline fallback page if the fetch fails
            // return caches.match('/offline.html');
          });
        })
    );
  }
  // Let non-GET requests pass through
});
