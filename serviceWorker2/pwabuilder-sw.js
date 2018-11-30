//This is the "Offline copy of pages" service worker

var cacheName = 'pwabuilder-offline';

//Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener('install', function(event) {
  const indexPage = new Request('index.html');
  console.log('[PWA Builder] Install');
  event.waitUntil(
    fetch(indexPage).then(function(response) {

      return caches.open(cacheName).then(function(cache) {
        console.log('[PWA Builder] Cached index page during Install ' + response.url);
        return cache.put(indexPage, response);
      });
    })
  );
});

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function(event) {
  const updateCache = function(request){
    return caches.open('pwabuilder-offline').then(function (cache) {
  let updateCache = function(request){
    return caches.open(cacheName).then(function (cache) {
      return fetch(request.clone()).then(function (response) {
        console.log('[PWA Builder] add page to offline cache: ' + response.url);
        return cache.put(request, response);
      });
    });
  };

  event.waitUntil(updateCache(event.request));

  event.respondWith(
    fetch(event.request).catch(function(error) {
      console.log('[PWA Builder] Network request Failed. Serving content from cache: ' + error);

      //Check to see if you have it in the cache
      //Return response
      //If not in the cache, then return error page
      return caches.open(cacheName).then(function(cache) {
        return cache.match(event.request).then(function(matching) {
          let report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
          return report
        });
      });
    })
  );
});
