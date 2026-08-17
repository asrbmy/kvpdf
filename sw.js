const CACHE_NAME = 'kvpdf-cache-v1';
const APP_SHELL = [
  './',
  './index.html',
  './site.webmanifest',
  './assets/icon-16.png',
  './assets/icon-32.png',
  './assets/icon-180.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/favicon.ico',
];
const CDN_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js',
];
// Domains used by the optional, heavier advanced features (semantic search's
// transformers.js + model weights, realtime collab's Yjs/y-webrtc). These are
// cached opportunistically on first use (not pre-fetched at install) so most
// visitors — who never touch these features — don't pay for that download.
const LAZY_LIB_DOMAINS = ['https://cdn.jsdelivr.net/', 'https://huggingface.co/'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try { await cache.addAll(APP_SHELL); } catch (e) { /* best effort */ }
    await Promise.all(CDN_URLS.map(async (url) => {
      try {
        const res = await fetch(url, { mode: 'no-cors' });
        await cache.put(url, res);
      } catch (e) { /* offline during install, or CDN blocked — skip */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isCdn = CDN_URLS.some(u => req.url.startsWith(u));
  const isLazyLib = LAZY_LIB_DOMAINS.some(d => req.url.startsWith(d));
  const isAppShell = APP_SHELL.some(p => req.url.endsWith(p.replace('./', '')) || req.url.endsWith('/'));

  if (isCdn || isLazyLib) {
    // CDN libs are version-pinned (or content-hashed, for model weights), so
    // cache-first is safe. Lazy-lib domains are only ever requested once a
    // user opts into semantic search or realtime collab, so this is the
    // first time they're cached — not pre-fetched at install.
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req, { mode: 'no-cors' });
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());
        return res;
      } catch (e) {
        return cached || Response.error();
      }
    })());
    return;
  }

  if (req.mode === 'navigate' || isAppShell) {
    // App shell: try network first so updates are picked up, fall back to cache offline.
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());
        return res;
      } catch (e) {
        const cached = await caches.match(req) || await caches.match('./index.html');
        return cached || Response.error();
      }
    })());
  }
});
