const CACHE_NAME = 'satalign-pro-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('فتح الكاش');
        return cache.addAll(urlsToCache);
      })
  );
});

// استرجاع الملفات من الكاش عند عدم وجود إنترنت
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // إرجاع الملف من الكاش إذا كان موجود
        if (response) {
          return response;
        }
        
        // إذا لم يكن في الكاش، حاول تحميله من الإنترنت
        return fetch(event.request).then(
          function(response) {
            // تحقق من صحة الاستجابة
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // نسخ الاستجابة لحفظها في الكاش
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// تحديث الـ Service Worker وحذف الكاش القديم
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف الكاش القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// التعامل مع رسائل من التطبيق الرئيسي
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// إشعارات للتحديثات
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('مزامنة في الخلفية');
  }
});

// دعم Push Notifications (اختياري)
self.addEventListener('push', function(event) {
  const options = {
    body: 'تم تحديث بيانات الأقمار الصناعية',
    icon: 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3e%3ccircle cx="50" cy="50" r="40" fill="%23007aff"/%3e%3ctext x="50" y="60" font-size="40" text-anchor="middle" fill="white"%3e📡%3c/text%3e%3c/svg%3e',
    badge: 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3e%3ccircle cx="50" cy="50" r="40" fill="%23007aff"/%3e%3ctext x="50" y="60" font-size="40" text-anchor="middle" fill="white"%3e📡%3c/text%3e%3c/svg%3e',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'فتح التطبيق',
        icon: 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3e%3ctext x="50" y="60" font-size="40" text-anchor="middle"%3e👁️%3c/text%3e%3c/svg%3e'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3e%3ctext x="50" y="60" font-size="40" text-anchor="middle"%3e❌%3c/text%3e%3c/svg%3e'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SatAlign Pro', options)
  );
});

// التعامل مع النقر على الإشعارات
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    event.notification.close();
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});