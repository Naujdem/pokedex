const C='pokedex-v10',A=['./','./index.html','./db.js','./supabase.js','./drive.js','./inat.js','./map.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./world.svg'],X=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A).then(()=>Promise.all(X.map(u=>c.add(new Request(u,{mode:'cors'})).catch(()=>{}))))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
function keep(r,x){if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(C).then(k=>k.put(r,c))}return x}
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url),ext=u.origin!==location.origin;
 if(r.method!=='GET'||u.hostname.endsWith('supabase.co')||(ext&&!/^(cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname)))return;
 e.respondWith(ext
  ?caches.match(r).then(h=>h||fetch(r).then(x=>keep(r,x)))
  :fetch(r).then(x=>keep(r,x)).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||(r.mode==='navigate'&&caches.match('./index.html'))||Response.error())));
});