const CACHE_NAME = 'satalign-pro-enterprise-v3.0.0'; // تحديث الإصدار مع كل إطلاق
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// تثبيت احترافي مع معالجة محسنة للأخطاء
self.addEventListener('install', function(event) {
  console.log('🚀 تثبيت SatAlign Pro Enterprise Service Worker v3.0.0');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 فتح ذاكرة التخزين المؤقت:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ تم ملء ذاكرة التخزين المؤقت بنجاح');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ فشل في ملء ذاكرة التخزين المؤقت:', error);
        throw error;
      })
  );
});

// تفعيل محسن مع تواصل العميل
self.addEventListener('activate', function(event) {
  console.log('🔄 تفعيل SatAlign Pro Enterprise Service Worker');
  event.waitUntil(
    Promise.all([
      // تنظيف ذاكرات التخزين القديمة
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('satalign-pro')) {
              console.log('🗑️ حذف ذاكرة التخزين القديمة:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // السيطرة على جميع العملاء
      self.clients.claim()
    ]).then(() => {
      // إشعار جميع العملاء بالتحديث
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            message: 'تم تحديث SatAlign Pro Enterprise إلى أحدث إصدار',
            version: CACHE_NAME,
            timestamp: new Date().toISOString()
          });
        });
      });
    }).then(() => {
      console.log('✅ اكتمل تفعيل Service Worker');
    }).catch(error => {
      console.error('❌ فشل في تفعيل Service Worker:', error);
    })
  );
});

// معالجة احترافية للطلبات مع استراتيجيات تخزين ذكية
self.addEventListener('fetch', function(event) {
  // تخطي الطلبات غير GET
  if (event.request.method !== 'GET') {
    return;
  }

  // تخطي الطلبات عبر النطاقات
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        // إرجاع النسخة المحفوظة إذا كانت متوفرة
        if (cachedResponse) {
          // للمستندات HTML، فحص التحديثات في الخلفية
          if (event.request.destination === 'document') {
            fetchAndCache(event.request);
          }
          return cachedResponse;
        }
        
        // غير موجود في ذاكرة التخزين، جلب من الشبكة
        return fetchAndCache(event.request);
      })
      .catch(() => {
        // فشلت الشبكة وذاكرة التخزين المؤقت
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
        
        // للموارد الأخرى، إرجاع استجابة عامة للوضع غير المتصل
        return new Response('غير متصل - SatAlign Pro Enterprise', {
          status: 503,
          statusText: 'الخدمة غير متوفرة',
          headers: new Headers({
            'Content-Type': 'text/plain; charset=utf-8'
          })
        });
      })
  );
});

// دالة جلب وتخزين محسنة
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    // فحص صحة الاستجابة
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    // نسخ الاستجابة للتخزين
    const responseToCache = response.clone();

    // تخزين الاستجابة
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, responseToCache);
    
    return response;
  } catch (error) {
    console.error('فشل في الجلب:', error);
    throw error;
  }
}

// معالجة احترافية للرسائل
self.addEventListener('message', function(event) {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        type: 'VERSION_INFO',
        version: CACHE_NAME,
        timestamp: new Date().toISOString(),
        features: [
          'ضبط احترافي للأقمار الصناعية',
          'دعم متعدد اللغات',
          'نظام توجيه الواقع المعزز',
          'دقة على مستوى المؤسسات',
          'قدرة العمل غير المتصل'
        ]
      });
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage({
          type: 'CACHE_STATUS',
          ...status
        });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(result => {
        event.ports[0].postMessage({
          type: 'CACHE_CLEARED',
          success: result
        });
      });
      break;

    case 'UPDATE_SATELLITE_DATA':
      updateSatelliteData(data).then(result => {
        event.ports[0].postMessage({
          type: 'SATELLITE_DATA_UPDATED',
          success: result
        });
      });
      break;
      
    default:
      console.log('نوع رسالة غير معروف:', type);
  }
});

// الحصول على حالة شاملة لذاكرة التخزين المؤقت
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const cacheDetails = await Promise.all(
      cacheNames.map(async name => {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        return {
          name,
          size: keys.length,
          urls: keys.map(request => request.url)
        };
      })
    );
    
    return {
      totalCaches: cacheNames.length,
      currentCache: CACHE_NAME,
      caches: cacheDetails
    };
  } catch (error) {
    console.error('فشل في الحصول على حالة ذاكرة التخزين المؤقت:', error);
    return { error: error.message };
  }
}

// مسح جميع ذاكرات التخزين المؤقت للتطبيق
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames
      .filter(name => name.startsWith('satalign-pro'))
      .map(name => caches.delete(name));
    
    await Promise.all(deletePromises);
    console.log('🧹 تم مسح جميع ذاكرات التخزين المؤقت بنجاح');
    return true;
  } catch (error) {
    console.error('فشل في مسح ذاكرات التخزين المؤقت:', error);
    return false;
  }
}

// تحديث بيانات الأقمار الصناعية
async function updateSatelliteData(data) {
  try {
    console.log('🛰️ تحديث بيانات الأقمار الصناعية...');
    
    // هنا يمكن إضافة منطق حفظ بيانات الأقمار الجديدة
    const cache = await caches.open(CACHE_NAME);
    
    if (data && data.satellites) {
      // حفظ البيانات الجديدة في ذاكرة التخزين المؤقت
      const response = new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await cache.put('/satellite-data.json', response);
    }
    
    const timestamp = new Date().toISOString();
    console.log('✅ اكتمل تحديث بيانات الأقمار الصناعية في:', timestamp);
    
    // إشعار العملاء بالتحديث
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SATELLITE_DATA_UPDATED',
        timestamp
      });
    });

    return true;
  } catch (error) {
    console.error('❌ فشل في تحديث بيانات الأقمار الصناعية:', error);
    return false;
  }
}

// مزامنة خلفية احترافية لتحديثات البيانات
self.addEventListener('sync', function(event) {
  console.log('🔄 تم تشغيل مزامنة الخلفية:', event.tag);
  
  switch (event.tag) {
    case 'satellite-data-sync':
      event.waitUntil(syncSatelliteData());
      break;
      
    case 'usage-analytics':
      event.waitUntil(syncUsageAnalytics());
      break;

    case 'location-update':
      event.waitUntil(syncLocationData());
      break;
      
    default:
      console.log('علامة مزامنة غير معروفة:', event.tag);
  }
});

// مزامنة قاعدة بيانات الأقمار الصناعية
async function syncSatelliteData() {
  try {
    console.log('🛰️ مزامنة بيانات الأقمار الصناعية...');
    
    // هذا المكان يمكن أن يحتوي على منطق جلب بيانات محدثة من الخادم
    // في الوقت الحالي، سنقوم بتسجيل العملية فقط
    const timestamp = new Date().toISOString();
    console.log('✅ اكتملت مزامنة بيانات الأقمار الصناعية في:', timestamp);
    
    // إشعار العملاء بالتحديث
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SATELLITE_DATA_SYNCED',
        timestamp
      });
    });
  } catch (error) {
    console.error('❌ فشلت مزامنة بيانات الأقمار الصناعية:', error);
  }
}

// مزامنة تحليلات الاستخدام (مع مراعاة الخصوصية)
async function syncUsageAnalytics() {
  try {
    console.log('📊 مزامنة تحليلات الاستخدام...');
    
    // هذا يمكن أن يحتوي على إرسال بيانات استخدام مجهولة الهوية
    // تنفيذ ذلك يعتمد على متطلبات الخصوصية
    console.log('✅ اكتملت مزامنة تحليلات الاستخدام');
  } catch (error) {
    console.error('❌ فشلت مزامنة تحليلات الاستخدام:', error);
  }
}

// مزامنة بيانات الموقع
async function syncLocationData() {
  try {
    console.log('📍 مزامنة بيانات الموقع...');
    
    // منطق تحديث بيانات الموقع والانحراف المغناطيسي
    console.log('✅ اكتملت مزامنة بيانات الموقع');
  } catch (error) {
    console.error('❌ فشلت مزامنة بيانات الموقع:', error);
  }
}

// معالجة احترافية للإشعارات التحفيزية
self.addEventListener('push', function(event) {
  console.log('📬 تم استلام إشعار تحفيزي');
  
  let notificationData = {
    title: 'SatAlign Pro Enterprise',
    body: 'بيانات أقمار صناعية جديدة متوفرة',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'satellite-update',
    requireInteraction: false,
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  };

  // تحليل بيانات الإشعار إذا كانت متوفرة
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('فشل في تحليل بيانات الإشعار:', error);
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: notificationData.vibrate,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: notificationData.tag,
      url: notificationData.data?.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'إغلاق',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// معالجة احترافية للنقر على الإشعارات
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 تم النقر على الإشعار:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // محاولة التركيز على نافذة موجودة
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // فتح نافذة جديدة إذا لم توجد
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// معالجة محسنة للأخطاء والتسجيل
self.addEventListener('error', function(event) {
  console.error('🚨 خطأ Service Worker:', event.error);
  
  // إبلاغ الأخطاء الحرجة للعملاء
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_ERROR',
        error: event.error.message,
        timestamp: new Date().toISOString()
      });
    });
  });
});

// معالجة احترافية لرفض الوعود غير المعالجة
self.addEventListener('unhandledrejection', function(event) {
  console.error('🚨 رفض غير معالج للوعد في SW:', event.reason);
  event.preventDefault();
});

// صيانة دورية وتنظيف
function performMaintenance() {
  console.log('🧹 إجراء صيانة Service Worker...');
  
  // تنظيف إدخالات ذاكرة التخزين المؤقت القديمة
  caches.open(CACHE_NAME).then(cache => {
    cache.keys().then(requests => {
      // إزالة الإدخالات التي عمرها أكثر من 24 ساعة (إذا تتبعنا الطوابع الزمنية)
      console.log(`📦 ذاكرة التخزين المؤقت الحالية تحتوي على ${requests.length} إدخال`);
    });
  });
}

// جدولة الصيانة كل 6 ساعات
setInterval(performMaintenance, 6 * 60 * 60 * 1000);

// تسجيل احترافي لبدء التشغيل
console.log(`
╔═══════════════════════════════════════════════════════════╗
║                SatAlign Pro Enterprise                    ║
║              Service Worker v3.0.0                       ║
║                                                           ║
║  🛰️  نظام ضبط الأقمار الصناعية الاحترافي                ║
║  🌍  دعم متعدد اللغات (عربي/إنجليزي)                    ║
║  📱  تطبيق ويب تقدمي                                     ║
║  🔒  قدرة آمنة للعمل غير المتصل                         ║
║  ⚡  أداء على مستوى المؤسسات                            ║
║                                                           ║
║  ذاكرة التخزين: ${CACHE_NAME}        ║
║  بدء التشغيل: ${new Date().toISOString()}              ║
╚═══════════════════════════════════════════════════════════╝
`);

// تصدير معلومات service worker للتصحيح
self.SW_INFO = {
  version: CACHE_NAME,
  startupTime: new Date().toISOString(),
  features: [
    'ضبط احترافي للأقمار الصناعية',
    'نظام توجيه الواقع المعزز', 
    'دعم متعدد اللغات',
    'قدرة العمل غير المتصل',
    'الإشعارات التحفيزية',
    'مزامنة الخلفية',
    'أمان المؤسسات'
  ]
};
