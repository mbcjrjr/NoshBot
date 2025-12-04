const CACHE_NAME = 'noshbot-offline-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './noshbot-logo.png',
  './noshbot-griffin.png',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore-compat.js'
];

// 1. Install Event: Cache the "App Shell" (UI)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('NoshBot: Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fetch Event: Serve from Cache if Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached file if found, otherwise try internet
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Optional: Return a fallback page if completely offline and file not found
    })
  );
});

// 3. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});