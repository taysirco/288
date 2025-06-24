// Police 288 Performance Optimized JavaScript - v2.1.0
// Performance Monitoring and Service Worker Integration

// Critical Performance Metrics
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor Core Web Vitals
        this.observePerformance();
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
        this.registerServiceWorker();
    }

    observePerformance() {
        if ('PerformanceObserver' in window) {
            // Monitor long tasks
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
                    }
                }
            }).observe({ entryTypes: ['longtask'] });

            // Monitor resource loading
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 1000) {
                        console.warn(`⚠️ Slow resource: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                    }
                }
            }).observe({ entryTypes: ['resource'] });
        }
    }

    monitorLCP() {
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                
                if (lastEntry.startTime > 2500) {
                    console.warn(`⚠️ Poor LCP: ${lastEntry.startTime.toFixed(2)}ms`);
                } else {
                    console.log(`✅ Good LCP: ${lastEntry.startTime.toFixed(2)}ms`);
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    monitorFID() {
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    
                    if (entry.processingStart - entry.startTime > 100) {
                        console.warn(`⚠️ Poor FID: ${(entry.processingStart - entry.startTime).toFixed(2)}ms`);
                    } else {
                        console.log(`✅ Good FID: ${(entry.processingStart - entry.startTime).toFixed(2)}ms`);
                    }
                }
            }).observe({ entryTypes: ['first-input'] });
        }
    }

    monitorCLS() {
        let clsValue = 0;
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        this.metrics.cls = clsValue;
                        
                        if (clsValue > 0.1) {
                            console.warn(`⚠️ Poor CLS: ${clsValue.toFixed(4)}`);
                        }
                    }
                }
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registered successfully:', registration.scope);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 New Service Worker available');
                            // Optionally show update notification
                        }
                    });
                });
                
                // Listen for messages from SW
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'CACHE_UPDATED') {
                        console.log('📦 Cache updated successfully');
                    }
                });
                
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize Performance Monitor
const performanceMonitor = new PerformanceMonitor();

// Critical Resource Loading Optimization
class ResourceOptimizer {
    constructor() {
        this.loadedResources = new Set();
        this.criticalResources = [
            'styles.css',
            'mobile-reviews.css',
            '288-flashlight-main-image.jpg'
        ];
        this.init();
    }

    init() {
        this.preloadCriticalImages();
        this.optimizeVideoLoading();
        this.lazyLoadNonCritical();
    }

    preloadCriticalImages() {
        const criticalImages = [
            'public/images/288-flashlight-main-image.jpg',
            'public/images/Electro Shocker Self-defense Electric Shock LED 288 Flashlight Police.jpg'
        ];

        criticalImages.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                this.loadedResources.add(src);
                console.log(`✅ Critical image ${index + 1} preloaded`);
            };
            img.onerror = () => {
                console.warn(`⚠️ Failed to preload: ${src}`);
            };
            img.src = src;
        });
    }

    optimizeVideoLoading() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Set preload to metadata for better performance
            video.preload = 'metadata';
            
            // Add intersection observer for video
            if ('IntersectionObserver' in window) {
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            video.preload = 'auto';
                            videoObserver.unobserve(video);
                        }
                    });
                }, { threshold: 0.1 });
                
                videoObserver.observe(video);
            }
        });
    }

    lazyLoadNonCritical() {
        // Lazy load review images
        const reviewImages = document.querySelectorAll('.review-image img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            reviewImages.forEach(img => {
                if (img.loading === 'lazy') {
                    imageObserver.observe(img);
                }
            });
        }
    }
}

// Initialize Resource Optimizer
const resourceOptimizer = new ResourceOptimizer();

// تحسين الأداء - إصدار محسن
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Image Optimization Functions
class ImageOptimizer {
    constructor() {
        this.webpSupported = null;
        this.lazyImages = [];
        this.imageObserver = null;
        this.init();
    }

    init() {
        this.checkWebPSupport();
        this.initIntersectionObserver();
        this.setupLazyLoading();
        this.preloadCriticalImages();
    }

    // Check WebP support
    checkWebPSupport() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            this.webpSupported = (webP.height === 2);
            document.documentElement.classList.add(this.webpSupported ? 'webp' : 'no-webp');
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    // Initialize Intersection Observer for lazy loading
    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
    }

    // Setup lazy loading for all images
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if (this.imageObserver) {
            lazyImages.forEach(img => {
                this.imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => this.loadImage(img));
        }
    }

    // Load individual image with optimization
    loadImage(img) {
        const originalSrc = img.src || img.dataset.src;
        
        // Create optimized image
        const optimizedImg = new Image();
        
        optimizedImg.onload = () => {
            img.src = optimizedImg.src;
            img.classList.add('loaded');
            
            // Remove loading placeholder
            const container = img.closest('.image-container');
            if (container) {
                container.style.background = 'none';
            }
        };

        optimizedImg.onerror = () => {
            img.classList.add('loaded'); // Still show even if optimized version fails
            console.warn('Failed to load optimized image:', originalSrc);
        };

        // Use original src for now (in production, you'd serve optimized versions)
        optimizedImg.src = originalSrc;
    }

    // Preload critical images
    preloadCriticalImages() {
        const criticalImages = [
            'public/images/288-flashlight-main-image.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Compress and resize images (client-side simulation)
    optimizeImageSrc(originalSrc, width = null, quality = 0.8) {
        // In a real implementation, this would call an image optimization service
        // For now, we'll return the original src
        return originalSrc;
    }
}

// تحويل الأرقام العربية إلى إنجليزية
function convertArabicToEnglishNumbers(input) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = input;
    for (let i = 0; i < arabicNumbers.length; i++) {
        result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
    }
    return result;
}

// تطبيق تحويل الأرقام على الحقول
function setupNumberConversion() {
    const phoneField = document.getElementById('phone');
    const whatsappField = document.getElementById('whatsapp');
    
    // دالة معالجة التحويل
    function handleNumberConversion(event) {
        const field = event.target;
        const cursorPosition = field.selectionStart;
        const convertedValue = convertArabicToEnglishNumbers(field.value);
        
        if (field.value !== convertedValue) {
            field.value = convertedValue;
            // الحفاظ على موقع المؤشر
            field.setSelectionRange(cursorPosition, cursorPosition);
        }
    }
    
    // إضافة مستمعي الأحداث
    if (phoneField) {
        phoneField.addEventListener('input', handleNumberConversion);
        phoneField.addEventListener('paste', (e) => {
            // معالجة اللصق مع تأخير صغير للسماح بإدراج النص أولاً
            setTimeout(() => handleNumberConversion(e), 10);
        });
    }
    
    if (whatsappField) {
        whatsappField.addEventListener('input', handleNumberConversion);
        whatsappField.addEventListener('paste', (e) => {
            setTimeout(() => handleNumberConversion(e), 10);
        });
    }
}

// Initialize image optimizer
const imageOptimizer = new ImageOptimizer();

// إعدادات السلايدر مع دعم اللمس
let currentMainSlide = 0;
let mainSlides = [];
let totalMainSlides = 0;
let mainAutoPlayInterval;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isDragging = false;
let isScrolling = false;

// Touch and swipe handling for mobile
function initializeTouchSupport() {
    const slider = document.querySelector('.main-slider');
    const wrapper = document.getElementById('mainSliderWrapper');
    
    if (!slider || !wrapper) return;
    
    // Touch events
    slider.addEventListener('touchstart', handleTouchStart, { passive: false });
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    slider.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse events for desktop testing
    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mousemove', handleMouseMove);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mouseleave', handleMouseUp);
}

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = true;
    isScrolling = false;
    pauseMainAutoPlay();
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    // Determine if user is scrolling vertically or swiping horizontally
    if (Math.abs(deltaY) > Math.abs(deltaX) && !isScrolling) {
        // Vertical scroll - don't interfere
        isDragging = false;
        return;
    }
    
    if (Math.abs(deltaX) > 10) {
        e.preventDefault(); // Prevent vertical scrolling when swiping horizontally
        isScrolling = false;
    }
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check if it's a horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // Swipe right - previous slide
            changeMainSlide(-1);
        } else {
            // Swipe left - next slide
            changeMainSlide(1);
        }
    }
    
    isDragging = false;
    resetMainAutoPlay();
}

// Mouse events for desktop
function handleMouseDown(e) {
    touchStartX = e.clientX;
    touchStartY = e.clientY;
    isDragging = true;
    pauseMainAutoPlay();
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!isDragging) return;
    
    const deltaX = e.clientX - touchStartX;
    const deltaY = e.clientY - touchStartY;
    
    if (Math.abs(deltaX) > 10) {
        e.preventDefault();
    }
}

function handleMouseUp(e) {
    if (!isDragging) return;
    
    touchEndX = e.clientX;
    touchEndY = e.clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            changeMainSlide(-1);
        } else {
            changeMainSlide(1);
        }
    }
    
    isDragging = false;
    resetMainAutoPlay();
}

// Enhanced thumbnail click handling
function initializeThumbnailNavigation() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Go to corresponding slide
            goToSlide(index);
            
            // Track interaction
            if (typeof ttq !== 'undefined') {
                ttq.track('ClickButton', {
                    content_type: 'gallery_navigation',
                    content_name: `Thumbnail ${index + 1}`,
                });
            }
        });
    });
}

// Mobile-optimized autoplay
function startMainAutoPlay() {
    // Shorter autoplay on mobile for better UX
    const isMobile = window.innerWidth <= 768;
    const interval = isMobile ? 4000 : 5000; // 4s on mobile, 5s on desktop
    
    mainAutoPlayInterval = setInterval(() => {
        currentMainSlide = (currentMainSlide + 1) % totalMainSlides;
        showMainSlide(currentMainSlide);
        updateThumbnailActive(currentMainSlide);
    }, interval);
}

function updateThumbnailActive(activeIndex) {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.classList.toggle('active', index === activeIndex);
    });
}

// Social Proof Notifications System - نظام إشعارات الثقة الاجتماعية
class SocialProofNotifications {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.isActive = true;
        this.notificationQueue = [];
        this.maxNotifications = 1;
        this.lastNotificationTime = 0;
        this.minInterval = 8000; // 8 ثواني كحد أدنى (تم تسريعه من 15 ثانية)
        this.maxInterval = 25000; // 25 ثانية كحد أقصى (تم تسريعه من 45 ثانية)
        
        this.egyptianNames = [
            'أحمد محمد', 'محمد أحمد', 'علي حسن', 'حسن علي', 'عمر سعيد',
            'سعيد عمر', 'محمود إبراهيم', 'إبراهيم محمود', 'خالد فتحي', 'فتحي خالد',
            'طارق أسامة', 'أسامة طارق', 'عبدالله عادل', 'عادل عبدالله', 'ياسر نبيل',
            'نبيل ياسر', 'أيمن رامي', 'رامي أيمن', 'مصطفى كريم', 'كريم مصطفى',
            'فاطمة أحمد', 'مريم محمد', 'نورا حسن', 'هند علي', 'دينا سعيد',
            'سارة عمر', 'أميرة محمود', 'ياسمين إبراهيم', 'ندى خالد', 'رنا فتحي',
            'منى طارق', 'هدى أسامة', 'لميس عبدالله', 'شيماء عادل', 'إيمان ياسر',
            'نجلاء نبيل', 'سلمى أيمن', 'ريم رامي', 'نهى مصطفى', 'أسماء كريم'
        ];
        
        this.egyptianGovernorates = [
            'القاهرة', 'الجيزة', 'الأقصر', 'أسوان', 'الإسكندرية', 'بورسعيد',
            'السويس', 'دمنهور', 'طنطا', 'المنصورة', 'الزقازيق', 'شبين الكوم',
            'بنها', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج',
            'قنا', 'الغردقة', 'شرم الشيخ', 'العريش', 'مرسى مطروح', 'دمياط',
            'كفر الشيخ', 'قويسنا', 'إدفو', 'كوم أمبو', 'الواحات البحرية',
            'سيوة', 'رشيد', 'إدكو', 'المحلة الكبرى', 'السنبلاوين', 'ميت غمر'
        ];
        
        this.notificationTemplates = [
            'طلب منتج الصاعق والكشاف والليزر 3 في 1 الآن!',
            'اشترى للتو منتج الصاعق والكشاف والليزر 3 في 1',
            'طلب قطعتين من منتج الصاعق والكشاف والليزر 3 في 1',
            'أضاف منتج الصاعق والكشاف والليزر 3 في 1 إلى السلة',
            'أكمل طلب شراء منتج الصاعق والكشاف والليزر 3 في 1',
            'اختار العرض الخاص لمنتج الصاعق والكشاف والليزر 3 في 1',
            'أكد طلبه من منتج الصاعق والكشاف والليزر 3 في 1 🔥',
            'استفاد من العرض المحدود!',
            'طلب توصيل سريع لمنتج الصاعق والكشاف والليزر 3 في 1',
            'اشترى بالعرض الخاص - قطعتين!'
        ];
        
        this.timeTexts = [
            'منذ دقيقة', 'منذ دقيقتين', 'منذ 3 دقائق', 'منذ 4 دقائق',
            'منذ 5 دقائق', 'منذ 8 دقائق', 'منذ 10 دقائق', 'منذ قليل',
            'الآن', 'منذ لحظات'
        ];
        
        // أيقونات متنوعة للإشعارات
        this.notificationIcons = ['🎉', '🔥', '⚡', '🚀', '💫', '✨'];
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.warn('❌ لم يتم العثور على حاوية الإشعارات');
            return;
        }
        
        console.log('🚀 تم تشغيل نظام إشعارات الثقة الاجتماعية');
        console.log(`⚙️ الإعدادات: إشعار كل ${this.minInterval/1000}-${this.maxInterval/1000} ثانية`);
        
        // إشعار فوري بعد 3 ثواني لجذب الانتباه
        setTimeout(() => {
            console.log('⚡ عرض الإشعار الأول...');
            this.showNotification();
        }, 3000);
        
        // بدء الإشعارات العادية بعد 8 ثواني من تحميل الصفحة
        setTimeout(() => {
            console.log('🔄 بدء الجدول الزمني للإشعارات العادية...');
            this.scheduleNextNotification();
        }, 8000);
        
        // إيقاف الإشعارات عند التركيز على نموذج الطلب
        this.detectFormFocus();
    }
    
    generateRandomNotification() {
        const name = this.getRandomItem(this.egyptianNames);
        const governorate = this.getRandomItem(this.egyptianGovernorates);
        let message = this.getRandomItem(this.notificationTemplates);
        const time = this.getRandomItem(this.timeTexts);
        const icon = this.getRandomItem(this.notificationIcons);
        
        // رسائل ديناميكية حسب الوقت
        const hour = new Date().getHours();
        if (hour >= 18 && hour <= 23) {
            // رسائل المساء - أكثر إلحاحاً
            const eveningMessages = [
                'طلب عاجل لكشاف Police 288!',
                'أسرع قبل انتهاء العرض!',
                'آخر قطعة من العرض الخاص!',
                'طلب سريع قبل نفاد الكمية!'
            ];
            if (Math.random() < 0.4) { // 40% احتمال لرسالة مسائية
                message = this.getRandomItem(eveningMessages);
            }
        }
        
        return {
            name,
            governorate,
            message,
            time,
            icon
        };
    }
    
    createNotificationElement(data) {
        const notification = document.createElement('div');
        notification.className = 'social-notification';
        
        notification.innerHTML = `
            <div class="notification-icon">${data.icon}</div>
            <div class="notification-content">
                <div class="notification-title">${data.name} - ${data.governorate}</div>
                <div class="notification-message">${data.message}</div>
                <div class="notification-time">${data.time}</div>
            </div>
        `;
        
        return notification;
    }
    
    showNotification() {
        if (!this.isActive || this.notificationQueue.length >= this.maxNotifications) {
            return;
        }
        
        const data = this.generateRandomNotification();
        const notification = this.createNotificationElement(data);
        
        // تسجيل الإشعار في الكونسول للمتابعة
        console.log(`📢 إشعار جديد: ${data.name} - ${data.governorate}: ${data.message}`);
        
        this.container.appendChild(notification);
        this.notificationQueue.push(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // إخفاء الإشعار بعد 5 ثواني (تم تقليله من 6 ثواني)
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }
    
    hideNotification(notification) {
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            const index = this.notificationQueue.indexOf(notification);
            if (index > -1) {
                this.notificationQueue.splice(index, 1);
            }
        }, 400);
    }
    
    scheduleNextNotification() {
        if (!this.isActive) return;
        
        const now = Date.now();
        if (now - this.lastNotificationTime < this.minInterval) {
            setTimeout(() => this.scheduleNextNotification(), this.minInterval);
            return;
        }
        
        // فترة الذروة - المزيد من الإشعارات
        const isRushHour = this.isRushHour();
        let interval;
        
        if (isRushHour) {
            // فترة ذروة: إشعارات أكثر تكراراً (5-15 ثانية)
            interval = Math.random() * 10000 + 5000;
        } else {
            // فترة عادية: الجدول الزمني العادي (8-25 ثانية)
            interval = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;
        }
        
        setTimeout(() => {
            this.showNotification();
            this.lastNotificationTime = Date.now();
            this.scheduleNextNotification();
        }, interval);
    }
    
    // تحديد فترات الذروة (أوقات الشراء المتوقعة)
    isRushHour() {
        const now = new Date();
        const hour = now.getHours();
        
        // فترات الذروة: المساء (6-11 مساءً) والليل (8-12 مساءً)
        return (hour >= 18 && hour <= 23) || (hour >= 20 && hour <= 24);
    }
    
    detectFormFocus() {
        const formInputs = document.querySelectorAll('#orderForm input, #orderForm textarea, #orderForm select');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.pauseNotifications();
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    this.resumeNotifications();
                }, 2000);
            });
        });
    }
    
    pauseNotifications() {
        this.isActive = false;
        console.log('⏸️ تم إيقاف الإشعارات مؤقتاً (المستخدم يكتب في النموذج)');
        
        // إخفاء الإشعارات الحالية
        this.notificationQueue.forEach(notification => {
            this.hideNotification(notification);
        });
    }
    
    resumeNotifications() {
        this.isActive = true;
        console.log('🔄 تم تشغيل نظام الإشعارات مرة أخرى');
        
        // بدء إشعار سريع بعد العودة
        setTimeout(() => {
            this.scheduleNextNotification();
        }, 3000);
    }
    
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// تهيئة نظام الإشعارات
let socialProofSystem;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initializeMainSlider();
    initializeTouchSupport();
    initializeThumbnailNavigation();
    initializeForm();
    initializeModal();
    initializeFloatingNav();
    initializeHeaderTransparency();
    setupNumberConversion();
    initializeDemoVideo();
    
    // تهيئة نظام إشعارات الثقة الاجتماعية
    socialProofSystem = new SocialProofNotifications();
    
    // TikTok ViewContent Tracking
    if (typeof ttq !== 'undefined') {
        ttq.track('ViewContent', {
            content_type: 'product',
            content_id: 'police-288-3in1',
            content_name: 'منتج الصاعق والكشاف والليزر 3 في 1',
            value: '1700',
            currency: 'EGP'
        });
        console.log('✅ TikTok ViewContent tracked');
    }
    
    startMainAutoPlay();
    
    // Additional mobile optimizations
    if (window.innerWidth <= 768) {
        // Optimize images for mobile
        optimizeImagesForMobile();
        
        // Add touch feedback
        addTouchFeedback();
    }

    // Mobile Reviews Images Fix - تحسين صور التقييمات للموبايل
    const reviewsGallery = document.querySelector('.reviews-gallery');
    const reviewsGrid = document.querySelector('.reviews-gallery .reviews-grid');
    const reviewImages = document.querySelectorAll('.review-image');
    
    if (reviewsGallery && reviewsGrid && reviewImages.length > 0) {
        console.log('✅ تم العثور على صور التقييمات:', reviewImages.length);
        
        // التأكد من إعدادات العرض الصحيحة
        reviewsGallery.style.display = 'block';
        reviewsGallery.style.visibility = 'visible';
        reviewsGallery.style.opacity = '1';
        
        reviewsGrid.style.display = 'grid';
        reviewsGrid.style.visibility = 'visible';
        reviewsGrid.style.opacity = '1';
        
        // إعدادات الموبايل
        if (window.innerWidth <= 480) {
            reviewsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            reviewsGrid.style.gap = '15px';
        } else if (window.innerWidth <= 768) {
            reviewsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            reviewsGrid.style.gap = '20px';
        }
        
        // التأكد من ظهور كل صورة
        reviewImages.forEach((image, index) => {
            image.style.display = 'flex';
            image.style.visibility = 'visible';
            image.style.opacity = '1';
            
            const img = image.querySelector('img');
            if (img) {
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
                
                // إضافة event listener للتحقق من تحميل الصورة
                img.addEventListener('load', function() {
                    console.log(`✅ تم تحميل صورة التقييم ${index + 1}`);
                    img.classList.add('loaded');
                });
                
                img.addEventListener('error', function() {
                    console.error(`❌ فشل تحميل صورة التقييم ${index + 1}:`, img.src);
                });
            }
        });
        
        // تشخيص إضافي للموبايل
        if (window.innerWidth <= 768) {
            console.log('📱 وضع الموبايل نشط - عرض الشاشة:', window.innerWidth);
            console.log('🖼️ عدد صور التقييمات الظاهرة:', reviewImages.length);
        }
    } else {
        console.error('❌ لم يتم العثور على قسم صور التقييمات');
    }
});

// مراقبة تغيير حجم الشاشة لإعادة تطبيق الإعدادات
window.addEventListener('resize', function() {
    const reviewsGrid = document.querySelector('.reviews-gallery .reviews-grid');
    if (reviewsGrid) {
        if (window.innerWidth <= 480) {
            reviewsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            reviewsGrid.style.gap = '15px';
        } else if (window.innerWidth <= 768) {
            reviewsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            reviewsGrid.style.gap = '20px';
        } else {
            reviewsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
            reviewsGrid.style.gap = '25px';
        }
    }
});

// السلايدر الرئيسي
function initializeMainSlider() {
    mainSlides = document.querySelectorAll('.main-slide');
    totalMainSlides = mainSlides.length;
    
    if (totalMainSlides > 0) {
        showMainSlide(0);
        updateIndicators(0);
    }
}

function showMainSlide(index) {
    if (totalMainSlides === 0) return;
    
    const wrapper = document.getElementById('mainSliderWrapper');
    if (wrapper) {
        wrapper.style.transform = `translateX(${index * 100}%)`;
        updateIndicators(index);
    }
}

function changeMainSlide(direction) {
    if (totalMainSlides === 0) return;
    
    currentMainSlide += direction;
    
    if (currentMainSlide >= totalMainSlides) {
        currentMainSlide = 0;
    } else if (currentMainSlide < 0) {
        currentMainSlide = totalMainSlides - 1;
    }
    
    showMainSlide(currentMainSlide);
    resetMainAutoPlay();
}

function goToSlide(index) {
    if (index >= 0 && index < totalMainSlides) {
        currentMainSlide = index;
        showMainSlide(currentMainSlide);
        resetMainAutoPlay();
    }
}

function updateIndicators(activeIndex) {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === activeIndex);
    });
}

function pauseMainAutoPlay() {
    clearInterval(mainAutoPlayInterval);
}

// القائمة العائمة
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = 70;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function initializeFloatingNav() {
    const floatingNav = document.getElementById('floatingNav');
    if (floatingNav) {
        setTimeout(() => {
            floatingNav.style.opacity = '0.8';
        }, 1000);
    }
}

// النموذج
function initializeForm() {
    const form = document.getElementById('orderFormElement');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
        });
    }
}

// إرسال البيانات إلى Make.com webhook مع إعادة المحاولة
async function sendToMakeWebhook(formData, retryCount = 0) {
    const maxRetries = 2;
    const timeout = 10000; // 10 ثواني timeout
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch('https://hook.eu2.make.com/jbw8c58qrbe1dp1djwdiac6elyf3srym', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            console.log('✅ تم إرسال البيانات بنجاح إلى Make.com');
            return { success: true, data: await response.text() };
        } else {
            throw new Error(`خطأ HTTP: ${response.status}`);
        }
        
    } catch (error) {
        console.error(`❌ المحاولة ${retryCount + 1} فشلت:`, error.message);
        
        // إعادة المحاولة في حالة الفشل
        if (retryCount < maxRetries && !error.name === 'AbortError') {
            console.log(`🔄 إعادة المحاولة ${retryCount + 2}...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // انتظار ثانيتين
            return sendToMakeWebhook(formData, retryCount + 1);
        }
        
        return { success: false, error: error.message };
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    // TikTok AddToCart Tracking
    if (typeof ttq !== 'undefined') {
        const quantity = document.getElementById('quantity').value;
        const productName = 'منتج الصاعق والكشاف والليزر 3 في 1';
        let price = quantity === '1' ? '1700' : '2999';
        
        ttq.track('AddToCart', {
            value: price,
            currency: 'EGP',
            content_type: 'product',
            content_id: 'police-288-3in1',
            content_name: productName,
            quantity: parseInt(quantity)
        });
        console.log('✅ TikTok AddToCart tracked');
    }
    
    if (!validateForm()) {
        return;
    }
    
    // جمع بيانات النموذج مع تحويل الأرقام
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: convertArabicToEnglishNumbers(document.getElementById('phone').value.trim()),
        whatsapp: convertArabicToEnglishNumbers(document.getElementById('whatsapp').value.trim()) || 'غير محدد',
        quantity: document.getElementById('quantity').value,
        address: document.getElementById('address').value.trim(),
        timestamp: new Date().toLocaleString('ar-EG', {
            timeZone: 'Africa/Cairo',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        source: 'موقع منتج الصاعق والكشاف والليزر 3 في 1',
        product: 'منتج الصاعق والكشاف والليزر 3 في 1',
        userAgent: navigator.userAgent,
        pageUrl: window.location.href
    };
    
    // إضافة معلومات السعر حسب الكمية
    if (formData.quantity === '1') {
        formData.price = '1,700 جنيه';
        formData.offer = 'قطعة واحدة - عرض خاص';
        formData.totalSavings = '300 جنيه موفرة';
    } else if (formData.quantity === '2') {
        formData.price = '2,999 جنيه';
        formData.offer = 'قطعتين - عرض مميز (وفر 401 جنيه)';
        formData.totalSavings = '1,001 جنيه موفرة';
    }
    
    showLoading();
    console.log('📤 إرسال بيانات العميل إلى Make.com...', formData);
    
    // إرسال البيانات مع معالجة متقدمة للأخطاء
    sendToMakeWebhook(formData)
        .then(result => {
            hideLoading();
            
            if (result.success) {
                // TikTok Conversion Tracking
                if (typeof ttq !== 'undefined') {
                    ttq.track('CompletePayment', {
                        value: formData.price.replace(/[^\d]/g, ''),
                        currency: 'EGP',
                        content_type: 'product',
                        content_id: 'police-288-3in1',
                        content_name: formData.product,
                        quantity: parseInt(formData.quantity)
                    });
                    console.log('✅ TikTok conversion tracked');
                }
                
                showSuccessMessage(formData);
                resetForm();
                
                // إيقاف الإشعارات بعد الطلب الناجح
                if (window.socialProofSystem) {
                    socialProofSystem.pauseNotifications();
                }
            } else {
                showErrorMessage(result.error);
            }
        });
}

function validateForm() {
    const requiredFields = ['name', 'phone', 'quantity', 'address'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    let value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // تحويل الأرقام العربية إلى إنجليزية للحقول الرقمية
    if (field.id === 'phone' || field.id === 'whatsapp') {
        value = convertArabicToEnglishNumbers(value);
        // تحديث قيمة الحقل إذا تم التحويل
        if (field.value !== value) {
            field.value = value;
        }
    }
    
    removeFieldError(field);
    
    switch(field.id) {
        case 'name':
            if (!value) {
                errorMessage = 'الاسم مطلوب';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'الاسم قصير جداً';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (!value) {
                errorMessage = 'رقم الهاتف مطلوب';
                isValid = false;
            }
            break;
            
        case 'whatsapp':
            // حقل الواتساب اختياري ولا توجد قيود على عدد الأرقام
            break;
            
        case 'address':
            if (!value) {
                errorMessage = 'العنوان مطلوب';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'يرجى كتابة عنوان مفصل أكثر';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e53e3e';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'block';
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

function showSuccessMessage(orderData) {
    // بدلاً من عرض رسالة، توجيه المستخدم إلى صفحة التأكيد
    const params = new URLSearchParams(orderData);
    window.location.href = `confirmation.html?${params.toString()}`;
}

function showErrorMessage(errorText) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
            min-width: 320px;
            max-width: 90%;
        ">
            <div style="font-size: 3rem; margin-bottom: 15px;">⚠️</div>
            <h3 style="margin-bottom: 10px; font-size: 1.4rem;">حدث خطأ في الإرسال</h3>
            <p style="margin-bottom: 15px; line-height: 1.6;">
                يرجى المحاولة مرة أخرى<br>
                أو التواصل معنا مباشرة
            </p>
            <div style="font-size: 0.9rem; color: rgba(255,255,255,0.9);">
                📞 اتصل بنا أو أرسل على الواتساب<br>
                ${errorText ? `خطأ تقني: ${errorText}` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 6000);
}

function resetForm() {
    const form = document.getElementById('orderFormElement');
    if (form) {
        form.reset();
        
        const errorDivs = form.querySelectorAll('.field-error');
        errorDivs.forEach(div => div.remove());
        
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.style.borderColor = '#e2e8f0';
        });
    }
}

// النافذة المنبثقة
function initializeModal() {
    window.onclick = function(event) {
        const modal = document.getElementById('imageModal');
        if (event.target === modal) {
            closeModal();
        }
    };
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = imageSrc;
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}

// مستمعي الأحداث
window.addEventListener('load', function() {
    // تحسين السلايدر
    const mainSlider = document.querySelector('.main-slider');
    if (mainSlider) {
        mainSlider.addEventListener('mouseenter', pauseMainAutoPlay);
        mainSlider.addEventListener('mouseleave', startMainAutoPlay);
        
        // دعم اللمس
        let startX = 0;
        
        mainSlider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            pauseMainAutoPlay();
        });
        
        mainSlider.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                changeMainSlide(diff > 0 ? 1 : -1);
            }
            
            startMainAutoPlay();
        });
    }
    
    // تحسين الإحصائيات
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalText = element.textContent;
                const numberMatch = finalText.match(/[\d.]+/);
                
                if (numberMatch) {
                    const finalNumber = parseFloat(numberMatch[0]);
                    let currentNumber = 0;
                    const increment = finalNumber / 30;
                    
                    const countInterval = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= finalNumber) {
                            element.textContent = finalText;
                            clearInterval(countInterval);
                        } else {
                            const displayNumber = finalText.includes('.') ? 
                                currentNumber.toFixed(1) : 
                                Math.floor(currentNumber);
                            element.textContent = finalText.replace(/[\d.]+/, displayNumber);
                        }
                    }, 50);
                }
                
                observer.unobserve(element);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
});

// تحسين الأداء للأجهزة الضعيفة
if (navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.4s');
}

// تحديث السعر (للتوافق مع HTML)
function updatePrice() {
    // السعر معروض في القائمة المنسدلة
}

// Header Transparency on Scroll
function initializeHeaderTransparency() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add transparency class when scrolling down
        if (scrollTop > 100) {
            header.classList.add('transparent');
        } else {
            header.classList.remove('transparent');
        }
        
        lastScrollTop = scrollTop;
    }, 10));
}

// Demo Video Functions
function playDemoVideo() {
    const video = document.getElementById('demoVideo');
    const overlay = document.querySelector('.video-overlay');
    
    if (video && overlay) {
        video.play();
        overlay.classList.add('hidden');
        
        // TikTok Video Play Tracking
        if (typeof ttq !== 'undefined') {
            ttq.track('ViewContent', {
                content_type: 'video',
                content_id: 'police-288-demo-video',
                content_name: 'فيديو توضيحي - منتج الصاعق والكشاف والليزر 3 في 1',
                value: '1700',
                currency: 'EGP',
                video_title: 'شاهد المنتج أثناء العمل'
            });
            console.log('📹 TikTok Video Play Event Tracked');
        }
    }
}

// Video Event Listeners
function initializeDemoVideo() {
    const video = document.getElementById('demoVideo');
    const overlay = document.querySelector('.video-overlay');
    
    if (video && overlay) {
        // Show overlay when video ends
        video.addEventListener('ended', () => {
            overlay.classList.remove('hidden');
        });
        
        // Hide overlay when video starts playing
        video.addEventListener('play', () => {
            overlay.classList.add('hidden');
        });
        
        // Show overlay when video is paused
        video.addEventListener('pause', () => {
            if (!video.ended) {
                setTimeout(() => {
                    overlay.classList.remove('hidden');
                }, 1000);
            }
        });
        
        // Track video completion
        video.addEventListener('ended', () => {
            if (typeof ttq !== 'undefined') {
                ttq.track('CompleteRegistration', {
                    content_name: 'مشاهدة كاملة للفيديو التوضيحي',
                    content_category: 'video_completion',
                    value: '1700',
                    currency: 'EGP'
                });
                console.log('✅ TikTok Video Completion Tracked');
            }
        });
    }
}

// Mobile image optimization
function optimizeImagesForMobile() {
    const reviewImages = document.querySelectorAll('.review-image img');
    
    reviewImages.forEach(img => {
        // Add loading="lazy" if not present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding="async" for better performance
        img.setAttribute('decoding', 'async');
        
        // Optimize dimensions for 1080x1080 mobile screens
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
}

// Add touch feedback for better UX
function addTouchFeedback() {
    const interactiveElements = document.querySelectorAll('.thumbnail-item, .review-image, .slide-indicators .indicator');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('touchcancel', function() {
            this.style.transform = '';
            this.style.transition = 'transform 0.3s ease';
        });
    });
}

function resetMainAutoPlay() {
    clearInterval(mainAutoPlayInterval);
    startMainAutoPlay();
}

// YouTube Lite Loading Function
function loadYouTubeVideo() {
    const youtubeLite = document.getElementById('youtube-lite');
    const youtubeIframe = document.getElementById('youtube-iframe');
    
    if (youtubeLite && youtubeIframe) {
        // Add loading state
        youtubeLite.classList.add('loading');
        
        // Set iframe source
        youtubeIframe.src = 'https://www.youtube.com/embed/3cAxo01FWuw?si=HC9sF_042MUE47SK&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&loop=1&playlist=3cAxo01FWuw&vq=hd720';
        
        // Show iframe and hide lite version
        setTimeout(() => {
            youtubeLite.style.display = 'none';
            youtubeIframe.style.display = 'block';
            
            // TikTok tracking for video play
            if (typeof ttq !== 'undefined') {
                ttq.track('ViewContent', {
                    content_type: 'video',
                    content_id: 'youtube-hero-video',
                    content_name: 'عرض منتج الصاعق والكشاف والليزر 3 في 1',
                    value: '1700',
                    currency: 'EGP'
                });
                console.log('✅ TikTok Video Play tracked');
            }
        }, 500);
    }
} 