// 淨明宗 PWA Service Worker
const CACHE_NAME = 'jingming-v15';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './data.js',
  './vendor/lunar.js',
  './vendor/gua64.js',
  './vendor/qrcode.js',
  './liturgy.js',
  './extras.js',
  './fonts/jm-kai.woff2',
  './assets/img/zj-hand-1.png',
  './jingming-almanac.ics',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// 代码文件（导航 / js / html / json / css）：联网优先，离线回退缓存
function networkFirst(request) {
  return fetch(request).then(function(resp) {
    if (resp && resp.status === 200) {
      var clone = resp.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(request, clone);
      });
    }
    return resp;
  }).catch(function() {
    return caches.match(request).then(function(r) {
      return r || caches.match('./index.html');
    });
  });
}

// 静态资源（字体 / 图片 / 图标）：缓存优先，未命中再走网络
function cacheFirst(request) {
  return caches.match(request).then(function(resp) {
    if (resp) return resp;
    return fetch(request).then(function(r) {
      if (r && r.status === 200) {
        var clone = r.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, clone);
        });
      }
      return r;
    }).catch(function() {
      return caches.match('./index.html');
    });
  });
}

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  var isCode =
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    /\.(js|html|json|css)(\?|$)/i.test(url.pathname);
  if (isCode) {
    event.respondWith(networkFirst(event.request));
  }  else {
    event.respondWith(cacheFirst(event.request));
  }
});
