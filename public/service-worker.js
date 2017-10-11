/*
** this is not the service worker in urlsToCache
** the app service worker is being added by the npm package sw-precache-webpack-plugin https://www.npmjs.com/package/sw-precache-webpack-plugin
** as it is much mor eeffecient than the script i wrote.
*/

var CACHE_NAME = 'scracth-card'
var urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/assets/sounds/',
  '/assets/sounds/lose.mp3',
  '/assets/sounds/win.mp3',
  '/assets/sounds/scratch.mp3'
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(urlsToCache)
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('files cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('failed to cache', error)
      })
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache)
              })
            return response
          }
        )
      })
    )
})
