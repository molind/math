const CACHE_NAME = 'multiplication-table-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  // Добавьте другие ресурсы, которые необходимо кэшировать
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

// Обработка запросов и выдача кэшированных ресурсов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Кэш найден - возвращаем его
        if (response) {
          return response;
        }
        // Кэш не найден - выполняем запрос и кэшируем ответ
        return fetch(event.request).then(response => {
          // Проверяем, получили ли мы корректный ответ
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // Клонируем ответ, так как он является потоком
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
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
