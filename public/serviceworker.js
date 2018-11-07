"use strict";

const version = 9;
const staticCacheName = 'airplanetime-'+version;

// Cache all the required assets when the ServiceWorker installs
addEventListener('install', function (event) {
  console.log('The service worker is installing...');
  skipWaiting();
  event.waitUntil(
    cacheAssets()
  ); // end waitUntil
});

// When the ServiceWorker is activated, update the cache if the cache name changed
addEventListener('activate', activateEvent => {
  console.log('The service worker is activated.');

  activateEvent.waitUntil(
    caches.keys()
    .then( cacheNames => {
      return Promise.all(
        cacheNames.map( cacheName => {
          if (cacheName != staticCacheName) {
            return caches.delete(cacheName);
          } // end if
        }) // end map
      ); // end return Promise.all
    }) // end keys then
    .then( () => {
      var claim = clients.claim();
      sendAlert('version-'+version);
      return claim;
    }) // end then
  );

});

addEventListener('message', messageEvent => {
  console.log('Got message', messageEvent);

  if(messageEvent.data == 'version') {
    sendAlert('version-'+version);
    return;
  }

});

// Intercept HTTP requests
addEventListener("fetch", fetchEvent => {
  var t = fetchEvent.request, a = new URL(t.url);

  const request = fetchEvent.request;
  fetchEvent.respondWith(

    // First look in the cache
    caches.match(request)
    .then(responseFromCache => {
      if(responseFromCache) {
        return responseFromCache;
      }

      // Otherwise fetch from the network
      return fetch(request);

    }) // end match then

  ); // end respondWith
}); // end event listener

function cacheAssets() {
  caches.open(staticCacheName)
  .then( cache => {
    // Nice to have, won't error if these fail
    cache.addAll([
      'images/airplane-16px.png',
      'images/airplane-icon-57.png',
      'images/airplane-icon-72.png',
      'images/airplane-icon-114.png',
      'images/airplane-icon-144.png',
    ]);

    // Must have, will error if they fail to download
    return cache.addAll([
      '/',
      '/settings.html',
      '/style.css',
      '/js/jquery-3.3.1.js',
      '/js/script.js',
      '/bootstrap-4.1.3/css/bootstrap.min.css',
      '/bootstrap-4.1.3/js/bootstrap.min.js',
    ]);
  })
}


function sendAlert(alert) {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(alert);
    })
  })
}
