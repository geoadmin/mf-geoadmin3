// should be per version and also path dependant
var VERSION = ${version};
var CACHE_BASE_NAME = 'ltjeg-geo-admin-';
var CACHE_NAME = CACHE_BASE_NAME + '${version}';

var log = function(txt) {
  // Quick switch to enable/disable console output
  if (false) {
    console.log('SW ' + VERSION + ': ' + txt);
  }
};

log('Init');

var cachekey = function(url) {
  var match = /http[s]?:\/\/(wmts[0-9]?)\.geo\.admin\.ch/.exec(url);
  //log(match);
  if (match && match.length >= 2) {
    return url.replace(match[1], 'wmts');
  }
  return url;
};

var cacheUrls = [
  '${cachebase}/?',
  '${cachebase}/index.html',
  '${cachebase}/${version}/style/',
  '${cachebase}/${version}/lib/',
  '${cachebase}/${version}/img/',
  '${cachebase}/${version}/locales/',
  '${cachebase}/${version}}/layersConfig',
  '${cachebase}/${version}}/services',
  '${apibase}/${version}/rest/services/ech/CatalogServer',
  '1.0.0/ch.swisstopo.pixelkarte-farbe/default/20151231/21781/14',
  '1.0.0/ch.swisstopo.pixelkarte-farbe/default/20151231/21781/15',
  '1.0.0/ch.swisstopo.pixelkarte-farbe/default/20151231/21781/16',
  '1.0.0/ch.swisstopo.pixelkarte-farbe/default/20151231/21781/17',
  '1.0.0/ch.swisstopo.pixelkarte-farbe/default/20151231/21781/18',
  '1.0.0/ch.swisstopo.pixelkarte-farbe/default/20151231/21781/19',
  '1.0.0/ch.swisstopo.pixelkarte-farbe/default/20151231/21781/20'

];

var urlToCache = function(url) {
  for (var i = 0; i < cacheUrls.length; i++) {
    if (url.indexOf(cacheUrls[i]) != -1) {
      return true;
    }
  }
  return false;
};

// Set the callback for the install step
self.addEventListener('install', function(event) {
  log('install called');
  // Perform install steps
  // This could mean preparing a cache already.
  // But doing it here would mean to download the
  // resources in this moment exactly
    // Perform install steps
  event.waitUntil(
    caches.keys().then(function(keys) {
      var promises = [];
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(CACHE_BASE_NAME) != -1 &&
            keys[i].indexOf(CACHE_NAME) == -1) {
          log('Deleting Cache with name ' + keys[i]);
          promises.push(caches.delete(keys[i]).then(function(succ) {
            log('Deleting Cache ok? -> ' + succ + '!');
            return true;
          }));
        }
      }
      promises.push(caches.open(CACHE_NAME).then(function(cache) {
        log('Cache with name ' + CACHE_NAME + ' created.');
        return true;
      }));
      return Promise.all(promises).then(function() {
        // Try to reload parent page to disable caching of old active service
        // worker. This does not work yet!
        //log('sending posmessage');
        //self.postMessage('reload');
        return true;
      });
    })
  );
});


caches.keys().then(function(keys) {
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].indexOf(CACHE_BASE_NAME) != -1) {
      log('found geo cache ' + keys[i]);
    }
  }
});

self.addEventListener('activate', function(event) {
  log('activated called');
});

self.addEventListener('fetch', function(event) {
  //log('fetch called');

  event.respondWith(

    caches.has(CACHE_NAME).then(function(exists) {
      // This is the case where the cache was deleted
      // by a new service worker.
      // we simply forward the request to the browser
      // to assure we have newest data
      if (!exists) {
        //log('deleted cache....');
        return fetch(event.request);
      }

      return caches.open(CACHE_NAME).then(function(cache) {

        var ckey = cachekey(event.request.url);

        return cache.match(ckey).then(function(response) {
            // Cache hit - return response
            if (response) {
              //log('cache hit with: ' + ckey);
              return response;
            }

            //Decide if we want to cache this requets
            if (!urlToCache(ckey)) {
              //log('non caching url: ' + ckey);
              return fetch(event.request);
            } 
            

            //log('trying to cache url: ' + ckey);

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
              function(response) {
                // Check if we received a valid response
                if(!response || response.status !== 200) {
                  //log('not valid response with type - no caching: ');
                  return response;
                }

                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have 2 stream.
                var responseToCache = response.clone();
                //log('Putting into cache: ' + ckey);
                cache.put(ckey, responseToCache);

                return response;
              }
            );
          }
        )
            
      });
    })

  );
});

