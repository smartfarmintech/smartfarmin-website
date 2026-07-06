const CACHE_NAME = "smartfarmin-v1"
const STATIC_ASSETS = [
  "/",
  "/farmer",
  "/operator",
  "/admin",
  "/offline.html",
]

const API_CACHE = "smartfarmin-api-v1"
const API_ENDPOINTS = [
  "/api/bookings",
  "/api/drone-missions",
  "/api/notifications",
  "/api/orders",
]

const MAX_CACHE_SIZE = 50

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - network first with fallback to cache
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // API requests - network first with cache fallback
  if (API_ENDPOINTS.some((endpoint) => url.pathname.includes(endpoint))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return caches.match(event.request)
          }
          // Cache successful responses
          const responseClone = response.clone()
          caches.open(API_CACHE).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || new Response("Offline - No cached data available", { status: 503 })
          })
        })
    )
    return
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached
      }
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response
          }
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          return new Response("Offline", { status: 503 })
        })
    })
  )
})

// Background sync for offline bookings and orders
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-bookings") {
    event.waitUntil(syncBookings())
  } else if (event.tag === "sync-orders") {
    event.waitUntil(syncOrders())
  }
})

async function syncBookings() {
  try {
    const cache = await caches.open(API_CACHE)
    const requests = await cache.keys()
    const bookingRequests = requests.filter((req) => req.url.includes("/api/bookings"))

    for (const request of bookingRequests) {
      const response = await fetch(request)
      if (response.ok) {
        await cache.put(request, response)
      }
    }
  } catch (error) {
    console.error("Sync bookings failed:", error)
  }
}

async function syncOrders() {
  try {
    const cache = await caches.open(API_CACHE)
    const requests = await cache.keys()
    const orderRequests = requests.filter((req) => req.url.includes("/api/orders"))

    for (const request of orderRequests) {
      const response = await fetch(request)
      if (response.ok) {
        await cache.put(request, response)
      }
    }
  } catch (error) {
    console.error("Sync orders failed:", error)
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json?.() ?? {}
  const options = {
    body: data.body || "New notification from SmartFarmin",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    tag: data.tag || "notification",
    requireInteraction: data.priority === "urgent",
    data: {
      url: data.actionUrl || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title || "SmartFarmin", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const url = event.notification.data?.url || "/"
      for (let client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
