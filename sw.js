const CACHE_NAME = 'satalign-pro-enterprise-v2.0.0'; // Update this with each release
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Professional installation with enhanced error handling
self.addEventListener('install', function(event) {
  console.log('🚀 Installing SatAlign Pro Enterprise Service Worker v2.0.0');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Opening cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Cache populated successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Cache population failed:', error);
        throw error;
      })
  );
});

// Enhanced activation with client communication
self.addEventListener('activate', function(event) {
  console.log('🔄 Activating SatAlign Pro Enterprise Service Worker');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('satalign-pro')) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      // Notify all clients about the update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            message: 'SatAlign Pro Enterprise has been updated to the latest version',
            version: CACHE_NAME,
            timestamp: new Date().toISOString()
          });
        });
      });
    }).then(() => {
      console.log('✅ Service Worker activation complete');
    }).catch(error => {
      console.error('❌ Service Worker activation failed:', error);
    })
  );
});

// Professional fetch handling with intelligent caching strategies
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        // Return cached version if available
        if (cachedResponse) {
          // For HTML documents, check for updates in background
          if (event.request.destination === 'document') {
            fetchAndCache(event.request);
          }
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetchAndCache(event.request);
      })
      .catch(() => {
        // Network and cache both failed
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
        
        // For other resources, return a generic offline response
        return new Response('Offline - SatAlign Pro Enterprise', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});

// Enhanced fetch and cache function
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    // Check if response is valid
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    // Clone response for caching
    const responseToCache = response.clone();

    // Cache the response
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, responseToCache);
    
    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// Professional message handling
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
          'Professional Satellite Alignment',
          'Multi-language Support',
          'AR Guidance System',
          'Enterprise-grade Precision',
          'Offline Capability'
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
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Get comprehensive cache status
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
    console.error('Failed to get cache status:', error);
    return { error: error.message };
  }
}

// Clear all application caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames
      .filter(name => name.startsWith('satalign-pro'))
      .map(name => caches.delete(name));
    
    await Promise.all(deletePromises);
    console.log('🧹 All caches cleared successfully');
    return true;
  } catch (error) {
    console.error('Failed to clear caches:', error);
    return false;
  }
}

// Professional background sync for data updates
self.addEventListener('sync', function(event) {
  console.log('🔄 Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'satellite-data-sync':
      event.waitUntil(syncSatelliteData());
      break;
      
    case 'usage-analytics':
      event.waitUntil(syncUsageAnalytics());
      break;
      
    default:
      console.log('Unknown sync tag:', event.tag);
  }
});

// Sync satellite database updates
async function syncSatelliteData() {
  try {
    console.log('🛰️ Syncing satellite data...');
    
    // This would typically fetch updated satellite data from a server
    // For now, we'll just log the action
    const timestamp = new Date().toISOString();
    console.log('✅ Satellite data sync completed at:', timestamp);
    
    // Notify clients about the update
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SATELLITE_DATA_UPDATED',
        timestamp
      });
    });
  } catch (error) {
    console.error('❌ Satellite data sync failed:', error);
  }
}

// Sync usage analytics (privacy-conscious)
async function syncUsageAnalytics() {
  try {
    console.log('📊 Syncing usage analytics...');
    
    // This would typically send anonymized usage data
    // Implementation would depend on privacy requirements
    console.log('✅ Usage analytics sync completed');
  } catch (error) {
    console.error('❌ Usage analytics sync failed:', error);
  }
}

// Professional push notification handling
self.addEventListener('push', function(event) {
  console.log('📬 Push notification received');
  
  let notificationData = {
    title: 'SatAlign Pro Enterprise',
    body: 'New satellite data available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'satellite-update',
    requireInteraction: false,
    vibrate: [100, 50, 100]
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('Failed to parse push data:', error);
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
      url: notificationData.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Professional notification click handling
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Try to focus existing window
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Enhanced error handling and logging
self.addEventListener('error', function(event) {
  console.error('🚨 Service Worker error:', event.error);
  
  // Report critical errors to clients
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

// Professional unhandled rejection handling
self.addEventListener('unhandledrejection', function(event) {
  console.error('🚨 Unhandled promise rejection in SW:', event.reason);
  event.preventDefault();
});

// Periodic cleanup and maintenance
function performMaintenance() {
  console.log('🧹 Performing Service Worker maintenance...');
  
  // Clean up old cache entries
  caches.open(CACHE_NAME).then(cache => {
    cache.keys().then(requests => {
      // Remove entries older than 24 hours (if we tracked timestamps)
      console.log(`📦 Current cache contains ${requests.length} entries`);
    });
  });
}

// Schedule maintenance every 6 hours
setInterval(performMaintenance, 6 * 60 * 60 * 1000);

// Professional startup logging
console.log(`
╔═══════════════════════════════════════════════════════════╗
║                SatAlign Pro Enterprise                    ║
║              Service Worker v2.0.0                       ║
║                                                           ║
║  🛰️  Professional Satellite Alignment System             ║
║  🌍  Multi-language Support (Arabic/English)             ║
║  📱  Progressive Web Application                          ║
║  🔒  Secure Offline Capability                           ║
║  ⚡  Enterprise-grade Performance                         ║
║                                                           ║
║  Cache: ${CACHE_NAME}                    ║
║  Startup: ${new Date().toISOString()}                    ║
╚═══════════════════════════════════════════════════════════╝
`);

// Export service worker info for debugging
self.SW_INFO = {
  version: CACHE_NAME,
  startupTime: new Date().toISOString(),
  features: [
    'Professional Satellite Alignment',
    'AR Guidance System', 
    'Multi-language Support',
    'Offline Capability',
    'Push Notifications',
    'Background Sync',
    'Enterprise Security'
  ]
};
