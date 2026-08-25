// ============================================================
//  Service Worker — Boss Fight PWA
//  IMPORTANT : Incrémenter CACHE_VERSION chaque mois
//  lors du changement de boss pour forcer la mise à jour
// ============================================================

// ⬇️ CHANGER CE NUMÉRO CHAQUE MOIS (ex: v2, v3, v4...)
var CACHE_VERSION = "boss-fight-v1";

var STATIC_FILES = [
  "./index.html",
  "./style.css",
  "./app.js",
  "./sw.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon.png"
];

// boss-actuel.js, boss-archives.js et boss.gif sont toujours
// récupérés depuis le réseau (pas mis en cache)
// pour garantir que les utilisateurs voient toujours le boss du mois

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(STATIC_FILES);
    }).catch(function(err) {
      console.log("Cache install error:", err);
    })
  );
  // Force l'activation immédiate sans attendre la fermeture de l'app
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
  // Prend le contrôle de tous les onglets ouverts immédiatement
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  var url = e.request.url;

  // Fichiers du boss (toujours réseau — jamais mis en cache)
  if (url.indexOf("boss-actuel.js") > -1 ||
      url.indexOf("boss-archives.js") > -1 ||
      url.indexOf("boss.gif") > -1) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // Tous les autres fichiers : cache d'abord, réseau en fallback
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() {
        return caches.match("./index.html");
      });
    })
  );
});
