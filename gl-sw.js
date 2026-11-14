// Гранд Лайн: service worker. Сеть в приоритете (чтобы всегда была свежая версия), кэш — на случай офлайна.
const CACHE = 'gl-v3';
const CORE = ['./gl-manifest.json', './gl-icon-192.png', './gl-icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;                 // шрифты, Firebase и т.п. — мимо кэша
  if (!/grandline-game\.html$|gl-|\/assets\//.test(u.pathname) && !(r.mode === 'navigate' && /grandline/.test(u.pathname))) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('./grandline-game.html')))
  );
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./grandline-game.html');
  }));
});
