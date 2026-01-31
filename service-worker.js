self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// (Optional) Basic offline fallback
self.addEventListener("fetch", (event) => {
  // simple pass-through (no caching)
});
<script>
let deferredPrompt = null;
const installBtn = document.getElementById("installBtn");

// Listen for install prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();          // auto popup ko rok do
  deferredPrompt = e;          // event save kar lo
  installBtn.style.display = "inline-block"; // button show
});

// Install button click
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt(); // popup show
  const result = await deferredPrompt.userChoice;
  deferredPrompt = null;

  // Hide button after choice
  installBtn.style.display = "none";
});

// Detect when installed
window.addEventListener("appinstalled", () => {
  console.log("✅ App installed");
  installBtn.style.display = "none";
});
</script>
