const CACHE_NAME = 'multiplication-table-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
];

// Установка сервис-воркера и кэширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Обработка запросов - стратегия "Сначала сеть, затем кэш"
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Проверяем, получили ли мы корректный ответ
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // Клонируем ответ
        const responseToCache = response.clone();
        // Кэшируем ответ
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, пытаемся получить ресурс из кэша
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            } else {
              // Если ресурса нет в кэше, можно вернуть страницу по умолчанию
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Обновление сервис-воркера
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }));
    })
  );
});
