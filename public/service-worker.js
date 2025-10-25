const CACHE_NAME = 'lovelink-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other static assets like icons, main js/css bundles if they have stable names
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // For API calls, use a network-first strategy
  // This allows offline viewing of previously fetched profiles
  if (url.pathname.includes('/api/')) { 
    event.respondWith(
      fetch(request)
        .then(response => {
          // If the request is successful, clone and cache it
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // If the network fails, try to get it from the cache
          return caches.match(request);
        })
    );
  } else {
    // For all other requests (static assets), use a cache-first strategy
    event.respondWith(
      caches.match(request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          // Not in cache - fetch from network
          return fetch(request);
        })
    );
  }
});
