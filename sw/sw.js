let staticCacheName = 'currency-converter-v1';

self.addEventListener('install', event => {
    console.log("Service woker installation in in progress....");
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll([
                '/7daysofcode/',
                '/7daysofcode/currency_converter.html',
                '/7daysofcode/style.css',
                '/7daysofcode/js/currency_converter.js',
                '/7daysofcode/sw/sw.js',
                'https://free.currencyconverterapi.com/api/v5/currencies',
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(cacheName !== staticCacheName)
                    return caches.delete(cacheName);
                })
            );
            
        }).catch(error => {
            console.log("Activation failed with error: ", error);
        })
    );
});


self.addEventListener('fetch', event => {
    let requestUrl = new URL(event.request.url);
    //let checklink ="https://free.currencyconverterapi.com/api/v5/convert?";
    let confirmlink = requestUrl.startsWith("/convert", 44);
    if (requestUrl.origin === location.origin){
        if(confirmlink === true){
            event.respondWith(saveRates(event.request));
            return;
        }else{
            event.respondWith(
                caches.match(event.request).then(response => {
                    if(response){
                        return response;
                    }
                })
            );
        }
    }
});

const saveRates = (request) => {
    let ratesURL = request.url;
    return caches.open(staticCacheName).then(cache => {
        return cache.match(ratesURL).then(response => {
            let networkFetch = fetch(request).then(networkResponse => {
                cache.put(ratesURL, networkResponse.clone());
                return networkResponse;
            });
            return response || networkFetch;
        });
    });
    
}