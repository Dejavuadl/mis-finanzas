const CACHE='finanzas-v3';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// network-first; las navegaciones SIEMPRE saltan la caché HTTP para ver la última versión al instante
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  const req=(r.mode==='navigate')?new Request(r.url,{cache:'reload'}):r;
  e.respondWith(fetch(req).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));});
// notificaciones push
self.addEventListener('push',e=>{let d={title:'Mis Finanzas',body:'Tienes un aviso de pago'};try{d=e.data.json();}catch(x){}
  e.waitUntil(self.registration.showNotification(d.title||'Mis Finanzas',{body:d.body||'',icon:'./icon-192.png',badge:'./icon-192.png',vibrate:[80,40,80]}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(ws=>{for(const w of ws){if('focus'in w)return w.focus();}return clients.openWindow('./');}));});
