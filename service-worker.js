self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// ✅ REQUIRED for installability in many cases
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
