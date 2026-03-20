// ============================================================
//  Service Worker — Boss Fight PWA
//  Cache les fichiers pour un fonctionnement hors ligne
// ============================================================

const CACHE = "boss-fight-v1";
const FILES = [
  "/index.html",
  "/style.css",
  "/app.js",
  "/boss-actuel.js",
  "/boss-archives.js",
  "/boss.gif",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json"
];

// Installation : mise en cache de tous les fichiers
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch : cache d'abord, réseau ensuite
self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request);
    })
  );
});
