// TrueScale PDF — offline cache. Bump VERSION on any app change.
const VERSION = 'truescale-v5';
const SHELL = [
  './',
  './index.html',
  './vendor/pdf.min.js',
  './vendor/pdf.worker.min.js',
  './manifest.webmanifest',
  './icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // The app page itself is network-first so updates land immediately when
  // online; everything else (big vendored PDF.js) is cache-first.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(async res => {
          // Only a good response for the app page itself may refresh the
          // cached shell — a 404 or captive-portal page must never clobber it.
          const path = new URL(e.request.url).pathname;
          const isShell = path.endsWith('/') || path.endsWith('/index.html');
          if (res.ok && isShell) await caches.open(VERSION).then(c => c.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request))
  );
});
