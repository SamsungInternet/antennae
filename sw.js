// Files to cache
let cacheName = 'antennae-v1';
let appShellFiles = [
  'index.html',
  'app.js',
  'styles/antennae.css',
  'styles/antennae-dark.css',
  'styles/antennae-light.css',
  'images/icon-64.png',
  'images/icon-256.png',
  'images/icon-512.png'
];

let contentToCache = appShellFiles;


self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(contentToCache);
        })
    );
});
