const CACHE_NAME = 'euskal-ikastetxea-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/main.js',
  '/service-worker.js',
  '/src/core/SystemCoordinator.js',
  '/src/core/CanvasRenderer.js',
  '/src/core/GameLoop.js',
  '/src/core/AssetPreloader.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return resp;
      });
    })
  );
});
