// ============================================================
//  Service Worker — Boss Fight PWA
//  Chemins relatifs pour fonctionner sur GitHub Pages
// ============================================================

var CACHE = "boss-fight-v1";
var FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./boss-actuel.js",
  "./boss-archives.js",
  "./boss.gif",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.json"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    }).catch(function(err) {
      console.log("Cache install error:", err);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() {
        return caches.match("./index.html");
      });
    })
  );
});
