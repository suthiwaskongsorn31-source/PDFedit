/* PDF Studio Pro — offline cache */
const V = 'pdfstudio-v2';
const CORE = ['./', 'index.html', 'js/core.js', 'js/app.js', 'js/editor.js', 'lib/hb/index.mjs', 'lib/hb/harfbuzz.js', 'lib/hb/harfbuzz.wasm',
  'fonts/THSarabunNew-Regular.ttf', 'fonts/THSarabunNew-Bold.ttf', 'fonts/Kanit-Bold.ttf', 'fonts/Kanit-Regular.ttf', 'manifest.webmanifest', 'icons/icon-180.png',
  'https://cdn.jsdelivr.net/npm/@cantoo/pdf-lib@2.11.1/dist/pdf-lib.min.js', 'https://cdn.jsdelivr.net/npm/@cantoo/fontkit@2.0.12/dist/fontkit.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname) || /\.(js|mjs)$/.test(url.pathname) && url.origin === location.origin && !/\/lib\//.test(url.pathname);
  if (isPage) { // network first for app code so updates arrive quickly
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(V).then(ca => ca.put(req, c)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(V).then(ca => ca.put(req, c)); } return r; })));
});
