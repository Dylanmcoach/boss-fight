// ============================================================
//  Service Worker — Boss Fight PWA v2
//  IMPORTANT : Incrémenter CACHE_VERSION chaque mois
// ============================================================

var CACHE_VERSION = "boss-fight-v2";

// sw.js est intentionnellement absent de cette liste
// pour qu'il puisse toujours se mettre à jour librement
var STATIC_FILES = [
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon.png"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(STATIC_FILES);
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
        keys.filter(function(k) { return k !== CACHE_VERSION; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  var url = e.request.url;

  // Fichiers du boss → toujours réseau, jamais cache
  if (url.indexOf("boss-actuel.js") > -1 ||
      url.indexOf("boss-archives.js") > -1 ||
      url.indexOf("boss.gif") > -1 ||
      url.indexOf("sw.js") > -1) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // Autres fichiers → cache d'abord
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() {
        return caches.match("./index.html");
      });
    })
  );
});
