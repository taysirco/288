// Police 288 Service Worker - Performance Optimization
// Version: 2.1.0

const CACHE_NAME = 'police288-v2.1.0';
const CACHE_STATIC_NAME = 'police288-static-v2.1.0';
const CACHE_DYNAMIC_NAME = 'police288-dynamic-v2.1.0';

// Critical resources to cache immediately
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css?v=2.1.0&t=1734705600',
    '/mobile-reviews.css?v=2.1.0&t=1734705600',
    '/script.js?v=2.1.0&t=1734705600',
    '/public/images/288-flashlight-main-image.jpg',
    '/confirmation.html',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
    'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvalYAIYM4_z6rC7TODm6H7xaFU6jd_E0w0tKLUdwqjZjL.woff2'
];

// Dynamic resources patterns
const DYNAMIC_CACHE_PATTERNS = [
    /.*\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /.*\.(?:css|js)$/,
    /.*\.(?:mp4|webm|ogg)$/
];

// Install Event - Cache static resources
self.addEventListener('install', event => {
    console.log('🚀 Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_STATIC_NAME).then(cache => {
                console.log('📦 Caching static resources...');
                return cache.addAll(STATIC_CACHE_URLS.map(url => {
                    return new Request(url, { cache: 'reload' });
                }));
            }),
            caches.open(CACHE_DYNAMIC_NAME)
        ]).then(() => {
            console.log('✅ Service Worker installed successfully');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ Service Worker installation failed:', error);
        })
    );
});

// Activate Event - Clean old caches
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_STATIC_NAME && 
                        cacheName !== CACHE_DYNAMIC_NAME &&
                        cacheName.startsWith('police288-')) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch Event - Intercept requests
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip chrome-extension and other protocols
    if (!url.protocol.startsWith('http')) return;
    
    // Handle different types of requests
    if (isStaticAsset(request.url)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isImageRequest(request.url)) {
        event.respondWith(handleImageRequest(request));
    } else if (isAPIRequest(request.url)) {
        event.respondWith(handleAPIRequest(request));
    } else {
        event.respondWith(handleHTMLRequest(request));
    }
});

// Check if request is for static asset
function isStaticAsset(url) {
    return STATIC_CACHE_URLS.some(staticUrl => 
        url.includes(staticUrl.replace('/', ''))
    ) || /\.(css|js|woff2|woff|ttf)$/i.test(url);
}

// Check if request is for image
function isImageRequest(url) {
    return /\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/i.test(url);
}

// Check if request is for API
function isAPIRequest(url) {
    return url.includes('make.com') || 
           url.includes('analytics.tiktok.com') ||
           url.includes('googleapis.com');
}

// Handle static assets - Cache First Strategy
async function handleStaticAsset(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_STATIC_NAME);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Static asset fetch failed:', error);
        return caches.match(request);
    }
}

// Handle images - Cache First with fallback
async function handleImageRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_DYNAMIC_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Image fetch failed:', error);
        // Return cached version or placeholder
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return minimal placeholder image
        return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                <rect width="200" height="150" fill="#f1f5f9"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b">📷</text>
            </svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// Handle API requests - Network First
async function handleAPIRequest(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Handle HTML requests - Network First with cache fallback
async function handleHTMLRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_DYNAMIC_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('HTML fetch failed:', error);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page if available
        return caches.match('/index.html');
    }
}

// Message handler for cache management
self.addEventListener('message', event => {
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'CLEAR_CACHE':
                clearAllCaches().then(() => {
                    event.ports[0].postMessage({ success: true });
                });
                break;
            case 'UPDATE_CACHE':
                updateCache().then(() => {
                    event.ports[0].postMessage({ success: true });
                });
                break;
        }
    }
});

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ All caches cleared');
}

// Update cache with fresh content
async function updateCache() {
    const cache = await caches.open(CACHE_STATIC_NAME);
    await cache.addAll(STATIC_CACHE_URLS.map(url => {
        return new Request(url, { cache: 'reload' });
    }));
    console.log('🔄 Cache updated with fresh content');
}

// Performance monitoring
self.addEventListener('fetch', event => {
    if (event.request.url.includes('analytics')) return;
    
    const start = performance.now();
    
    event.waitUntil(
        (async () => {
            try {
                await event.request;
                const duration = performance.now() - start;
                
                // Log slow requests
                if (duration > 1000) {
                    console.warn(`⚠️ Slow request: ${event.request.url} took ${duration.toFixed(2)}ms`);
                }
            } catch (error) {
                console.error(`❌ Request failed: ${event.request.url}`, error);
            }
        })()
    );
});

console.log('🚀 Police 288 Service Worker loaded successfully'); 