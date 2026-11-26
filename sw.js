// Funciona sem internet: a página vem da rede quando dá (para pegar versões novas); o resto vem do cache.
// Os arquivos js e css têm ?v=<data> no nome, então uma versão nova nunca se mistura com a antiga.
const CACHE='terra-brasilis-v3';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','assets/logo.png','assets/logo-mini.png','assets/icon-192.png'])))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!='GET')return;
  const page=r.mode=='navigate',font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!=location.origin&&!font)return;
  const save=res=>{if(res.ok||res.type=='opaque'){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res};
  e.respondWith(page?fetch(r).then(save).catch(()=>caches.match(r).then(x=>x||caches.match('./'))) /* página: rede primeiro */
    :caches.match(r).then(x=>x||fetch(r).then(save)))}); // arquivos versionados e fontes: cache primeiro
