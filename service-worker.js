self.addEventListener("install", (event) => {
  console.log("Service Worker установлен");
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  console.log("Service Worker активирован");
  return self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
});
