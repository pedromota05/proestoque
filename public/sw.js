const CACHE_NAME = 'proestoque-cache-v1';

self.addEventListener('install', (event) => {
    console.log('[SW] Instalação iniciada.');
    self.skipWaiting(); // Força a ativação da nova versão imediatamente
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cache aberto. Pré-cache dos arquivos principais.');
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/icon.png' // Adicionado o ícone para garantir no offline
            ]).catch(err => console.warn('[SW] Erro no pré-cache:', err));
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Ativação iniciada. Limpando caches antigos.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Assume o controle das abas abertas imediatamente
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                    return networkResponse;
                }).catch(() => {
                    // Opcional: Aqui você poderia retornar uma página de "Offline" genérica
                    console.log('[SW] Falha na rede ao buscar:', event.request.url);
                });
            })
        );
    }
});