// Cache de l'appli pour un usage hors-ligne (salle de sport sans réseau).
// Changer VERSION force le renouvellement du cache de l'application au prochain déploiement.
const VERSION = 'atlas-muscu-v10';
const RUNTIME = 'atlas-muscu-runtime';

const SHELL = [
  './',
  'index.html',
  'app.js',
  'styles.css',
  'manifest.json',
  'data/exercises.js',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== VERSION && k !== RUNTIME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const cacheName = url.origin === location.origin ? VERSION : RUNTIME;

  // Cache d'abord, puis on rafraîchit en tâche de fond dès qu'il y a du réseau
  // (fichiers de l'appli comme animations des exercices).
  e.respondWith(
    caches.open(cacheName).then(cache =>
      cache.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
