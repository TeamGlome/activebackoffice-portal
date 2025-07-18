// Active Back Office Service Worker
// Provides offline functionality and caching for better performance

const CACHE_NAME = 'active-back-office-v1'
const STATIC_CACHE = 'abo-static-v1'
const DYNAMIC_CACHE = 'abo-dynamic-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/login',
  '/manifest.json',
  '/offline.html',
  // Add other critical routes
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/integrations/,
  /\/api\/properties/,
  /\/api\/compliance/,
  /\/api\/dashboard/,
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Static files cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request))
})

// Handle API requests with cache-first strategy for some endpoints
async function handleApiRequest(request) {
  const url = new URL(request.url)

  // Check if this API should be cached
  const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))

  if (!shouldCache) {
    // Network-only for non-cacheable APIs
    try {
      return await fetch(request)
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Network unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  try {
    // Try network first for API requests
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      // Add offline indicator to cached API responses
      const data = await cachedResponse.json()
      const offlineData = {
        ...data,
        _offline: true,
        _cachedAt: new Date().toISOString()
      }

      return new Response(JSON.stringify(offlineData), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      error: 'Data unavailable offline',
      _offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    // Fallback to cached page or offline page
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page as last resort
    return caches.match('/offline.html')
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  // Cache-first strategy for static assets
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache static assets
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // For images, return a placeholder
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#374151"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9CA3AF" font-family="sans-serif" font-size="14">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }

    throw error
  }
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag)

  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineActions())
  }
})

// Sync offline actions when connection is restored
async function syncOfflineActions() {
  console.log('Service Worker: Syncing offline actions...')

  try {
    // Get offline actions from IndexedDB or localStorage
    const offlineActions = await getOfflineActions()

    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        })

        // Remove successful action
        await removeOfflineAction(action.id)

        // Notify user of successful sync
        self.registration.showNotification('Data Synced', {
          body: 'Your offline changes have been synced successfully.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'sync-success'
        })
      } catch (error) {
        console.error('Failed to sync action:', action, error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')

  const options = {
    body: 'You have new updates in Active Back Office',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Dashboard',
        icon: '/icons/action-dashboard.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.data = { ...options.data, ...data }
  }

  event.waitUntil(
    self.registration.showNotification('Active Back Office', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action)

  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // If app is already open, focus it
          for (const client of clientList) {
            if (client.url.includes('/dashboard') && 'focus' in client) {
              return client.focus()
            }
          }

          // Otherwise open new window
          if (clients.openWindow) {
            return clients.openWindow('/dashboard')
          }
        })
    )
  }
})

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.payload)
        })
    )
  }
})

// Utility functions for offline action storage
async function getOfflineActions() {
  // Implement IndexedDB or localStorage logic
  return []
}

async function removeOfflineAction(id) {
  // Implement removal logic
  console.log('Removing offline action:', id)
}

// Error handler
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error)
})

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason)
})
