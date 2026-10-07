/* ============================================================
   drive.js · Biotaxo dex
   Todo lo de Google Drive: conexión (token), API de Drive,
   mostrar fotos, subir fotos y botón «☁ Drive».
   (El botón «Entrar con Google» está ahora en supabase.js.)
   Se carga ANTES del <script> principal de index.html.
   (Código movido tal cual desde index.html, sin cambios.)
   ============================================================ */

/* ---------- Google Drive: almacenamiento de las fotos ----------
   Supabase guarda SOLO una referencia de texto por foto:
     gd:<fileId>   foto en el Drive del usuario
     data:...      foto antigua (base64) — se sigue mostrando igual
     loc:<uuid>    foto nueva aún no subida (solo existe en el dispositivo, nunca llega a Supabase) */
const GCLIENT='1051206554875-tmlvl2prc4vhppl81vkrs3pd3ikoieuv.apps.googleusercontent.com';  
const GSCOPE='https://www.googleapis.com/auth/drive.file';   // solo ve los archivos que crea esta app
const GFOLDER='Pokédex Taxonómica',FOTO_MAX=1024,FOTO_Q=.8,GDRIVE_ON=!!GCLIENT;
const API='https://www.googleapis.com/drive/v3',UP='https://www.googleapis.com/upload/drive/v3';
const isLoc=s=>/^loc:/.test(s||''),isGd=s=>/^gd:/.test(s||''),isUrl=s=>/^(data:|https?:|blob:)/.test(s||'');
const IMG=(s,x)=>'<img '+(isUrl(s)?'src':'data-ref')+'="'+esc(s)+'" alt=""'+(x||'')+'>';
const ls=k=>{try{return localStorage.getItem(k)||''}catch(_){return ''}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(_){}},lsDel=k=>{try{localStorage.removeItem(k)}catch(_){}};

/* --- Token de acceso: la app se lo pide a TU función de Supabase «drive-token».
   La función guarda en el servidor el permiso permanente (refresh token) y entrega tokens de 1 h sin ventanas. --- */
let gTok=null,folderP=null,tokP=null;
try{gTok=JSON.parse(ls('pk_gtok')||'null')}catch(_){}
const gdValid=()=>!!(gTok&&gTok.t&&gTok.exp>Date.now()+60000);
function gdSet(t,secs){gTok={t,exp:Date.now()+(+secs||3600)*1000};lsSet('pk_gtok',JSON.stringify(gTok));gdUI()}
function gdForget(){gTok=null;folderP=null;['pk_gtok','pk_gfolder','pk_ptok','pk_trashq'].forEach(lsDel);gdUI()}
async function gdFn(body){
 let r;try{r=await SB.functions.invoke('drive-token',{body})}catch(_){throw new Error('NOTOKEN')}
 if(r.error||!r.data)throw new Error('NOTOKEN');
 return r.data;
}
function gisCode(){
 return new Promise((ok,ko)=>{
  if(!(window.google&&google.accounts&&google.accounts.oauth2))return ko(new Error('Google no cargó (¿sin internet?)'));
  google.accounts.oauth2.initCodeClient({client_id:GCLIENT,scope:GSCOPE,ux_mode:'popup',
   callback:r=>r.error?ko(new Error(r.error_description||r.error)):ok(r.code),
   error_callback:e=>ko(new Error((e&&e.type)||'popup'))}).requestCode();
 });
}
/* Se hace UNA sola vez por cuenta (con un toque del usuario): Google da un código y la función lo cambia por el permiso permanente */
async function gdConnect(){
 const code=await gisCode(),d=await gdFn({action:'connect',code});
 if(d.error)throw new Error(d.message||d.error);
 gdSet(d.access_token,d.expires_in);
}
/* interactive=true solo desde un toque del usuario; si ya está conectado, nunca abre ventanas */
async function gdToken(interactive){
 if(!GDRIVE_ON)throw new Error('NODRIVE');
 if(gdValid())return gTok.t;
 if(!navigator.onLine)throw new Error('NOTOKEN');
 if(!tokP)tokP=gdFn({action:'token'}).then(d=>{if(d.error)throw new Error(d.error);gdSet(d.access_token,d.expires_in);return d.access_token}).finally(()=>{tokP=null});
 try{return await tokP}catch(e){
  if(interactive&&/noconnect|reconnect/.test(e.message)){await gdConnect();return gTok.t}
  throw new Error('NOTOKEN');
 }
}
async function gd(url,opt,retry=1){
 const t=await gdToken(false);
 const r=await fetch(url,Object.assign({},opt,{headers:Object.assign({Authorization:'Bearer '+t},opt&&opt.headers)}));
 if(r.status===401&&retry){gTok=null;lsDel('pk_gtok');gdUI();return gd(url,opt,0)}
 return r;
}
const gdOk=async r=>{if(r.ok)return;let m='';try{m=(await r.json()).error.message}catch(_){}const e=new Error('Drive '+r.status+(m?': '+m:''));e.status=r.status;throw e};

/* --- Carpeta «Pokédex Taxonómica»: se busca y, si no existe, se crea (una sola vez) --- */
function gdFolder(){
 return folderP||(folderP=(async()=>{
  try{
   let id=ls('pk_gfolder');
   if(id){const r=await gd(API+'/files/'+id+'?fields=id,trashed');if(r.ok&&!(await r.json()).trashed)return id}
   const q=encodeURIComponent("name='"+GFOLDER+"' and mimeType='application/vnd.google-apps.folder' and trashed=false");
   let r=await gd(API+'/files?q='+q+'&fields=files(id)&spaces=drive');await gdOk(r);const j=await r.json();
   if(j.files&&j.files.length)id=j.files[0].id;
   else{r=await gd(API+'/files?fields=id',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:GFOLDER,mimeType:'application/vnd.google-apps.folder'})});await gdOk(r);id=(await r.json()).id}
   lsSet('pk_gfolder',id);return id;
  }catch(e){folderP=null;throw e}
 })());
}
async function gdUpload(blob,name,sid,retry=1){
 const parent=await gdFolder(),b='pk'+Math.random().toString(36).slice(2),meta={name:name+'.jpg',parents:[parent],mimeType:'image/jpeg',appProperties:{especie:sid}};
 const body=new Blob(['--'+b+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n',JSON.stringify(meta),'\r\n--'+b+'\r\nContent-Type: image/jpeg\r\n\r\n',blob,'\r\n--'+b+'--']);
 const r=await gd(UP+'/files?uploadType=multipart&fields=id',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+b},body});
 if(r.status===404&&retry){folderP=null;lsDel('pk_gfolder');return gdUpload(blob,name,sid,0)}   // la carpeta fue borrada: se recrea
 await gdOk(r);return (await r.json()).id;
}
const gdBlob=async id=>{const r=await gd(API+'/files/'+id+'?alt=media');await gdOk(r);return r.blob()};
/* A la papelera de Drive (recuperable), nunca borrado definitivo. Si falla, no pasa nada. */
/* Cola de fotos pendientes de mandar a la papelera (si Drive no estaba conectado o falló) */
function trashQ(ref,add){let q;try{q=JSON.parse(ls('pk_trashq')||'[]')}catch(_){q=[]}q=q.filter(x=>x!==ref);if(add)q.push(ref);q.length?lsSet('pk_trashq',JSON.stringify(q)):lsDel('pk_trashq')}
function gdTrashRetry(){
 if(!gdValid())return;
 let q;try{q=JSON.parse(ls('pk_trashq')||'[]')}catch(_){q=[]}
 if(!q.length)return;lsDel('pk_trashq');q.forEach(gdTrash);
}
async function gdTrash(ref){
 if(!isGd(ref))return;
 /* Si otra ficha todavía usa esta foto (p. ej. fichas duplicadas por importar dos veces), no se toca */
 try{if((await dbAll('especies')).some(o=>o.foto===ref||(Array.isArray(o.fotos)&&o.fotos.includes(ref)))){trashQ(ref,false);return}}catch(_){}
 try{
  const r=await gd(API+'/files/'+ref.slice(3),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({trashed:true})});
  if(!r.ok&&r.status!==404)throw new Error('Drive '+r.status);
 }catch(_){trashQ(ref,true);return}   // se reintenta cuando haya conexión con Drive
 trashQ(ref,false);
 dbDel('fotos',ref).catch(()=>{});urlCache.delete(ref);
}

/* --- Mostrar fotos: primero la copia guardada en el dispositivo; si no hay, se baja de Drive y se guarda --- */
const urlCache=new Map();let gq=0;const gw=[];
const slot=()=>new Promise(ok=>{if(gq<4){gq++;ok()}else gw.push(ok)}),free=()=>{const n=gw.shift();if(n)n();else gq--};
async function getBlob(ref){
 let b=await dbGet('fotos',ref);if(b||isLoc(ref))return b;
 b=await gdBlob(ref.slice(3));await dbPut('fotos',b,ref);return b;
}
async function resolveSrc(ref){
 if(!ref||isUrl(ref))return ref||'';
 if(urlCache.has(ref))return urlCache.get(ref);
 const b=await getBlob(ref);if(!b)throw new Error('sin foto');
 const u=URL.createObjectURL(b);urlCache.set(ref,u);return u;
}
async function cargarImg(img){
 await slot();
 try{img.src=await resolveSrc(img.dataset.ref);img.classList.remove('nodrive')}
 catch(_){img.classList.add('nodrive');gdUI()}
 finally{free()}
}
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);cargarImg(e.target)}}),{rootMargin:'300px'}):null;
function hydrate(){document.querySelectorAll('img[data-ref]:not([data-ok])').forEach(i=>{i.dataset.ok='1';io&&i.closest('.card')?io.observe(i):cargarImg(i)})}
new MutationObserver(hydrate).observe(document.documentElement,{childList:true,subtree:true});
const retryImgs=()=>document.querySelectorAll('img.nodrive').forEach(i=>{i.classList.remove('nodrive');cargarImg(i)});

/* --- Fotos nuevas: se reducen, se guardan en el dispositivo (loc:) y se suben a Drive al guardar la ficha --- */
function toBlob(file){return new Promise(res=>{const u=URL.createObjectURL(file),im=new Image();
 im.onload=()=>{const k=Math.min(1,FOTO_MAX/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(res,'image/jpeg',FOTO_Q)};
 im.onerror=()=>{URL.revokeObjectURL(u);res(null)};im.src=u})}
async function addLocal(file){const b=await toBlob(file);if(!b)return '';const ref='loc:'+crypto.randomUUID();await dbPut('fotos',b,ref);formNew.add(ref);return ref}
function dropLoc(ref){dbDel('fotos',ref).catch(()=>{});const u=urlCache.get(ref);if(u){URL.revokeObjectURL(u);urlCache.delete(ref)}formNew.delete(ref)}
const fname=o=>((o.genero||'foto')+'_'+(o.especie||'')+'_'+Date.now().toString(36)).replace(/[^\w-]+/g,'_');
/* Sube las fotos loc: de una ficha. Cada foto subida se anota enseguida, así un corte a mitad no duplica nada. */
async function subirFotos(o){
 const L=o.fotos;if(!L||!L.some(isLoc))return true;
 try{
  for(let i=0;i<L.length;i++){
   if(!isLoc(L[i]))continue;
   const b=await dbGet('fotos',L[i]);if(!b){L.splice(i--,1);continue}
   const ref='gd:'+await gdUpload(b,fname(o),o.id);
   await dbPut('fotos',b,ref);await dbDel('fotos',L[i]);
   if(urlCache.has(L[i]))urlCache.set(ref,urlCache.get(L[i]));
   L[i]=ref;o.foto=L[0]||'';await dbPut('especies',Object.assign({},o));netUI();
  }
  o.foto=L[0]||'';await dbPut('especies',Object.assign({},o));return true;
 }catch(e){
  flush.err=/^(NOTOKEN|NODRIVE)$/.test(e.message)?'Conecta tu Google Drive (botón «☁ Conectar Drive») para subir las fotos pendientes.':'Drive: '+(e.message||e);
  return false;
 }
}
/* «Sincronizar»: además de las fichas, guarda en el dispositivo las fotos de Drive para verlas sin conexión */
async function cacheFotos(rows){
 if(!GDRIVE_ON)return true;
 for(const r of rows){
  for(const ref of (Array.isArray(r.fotos)&&r.fotos.length?r.fotos:(r.foto?[r.foto]:[])).filter(isGd)){
   if(await tx('fotos','readonly',o=>o.getKey(ref)))continue;
   await slot();
   try{await getBlob(ref)}catch(e){if(e.message==='NOTOKEN')return false}finally{free()}
  }
 }
 return true;
}
async function toDataURL(ref){
 if(!ref||/^data:/.test(ref))return ref;
 try{const b=await getBlob(ref);if(!b)return ref;return await new Promise((ok,ko)=>{const f=new FileReader();f.onload=()=>ok(f.result);f.onerror=ko;f.readAsDataURL(b)})}catch(_){return ref}
}

/* --- Botón «☁ Drive» --- */
function gdUI(){const b=$('gdb');if(!b)return;b.hidden=!GDRIVE_ON;b.className=gdValid()?'':'off';b.textContent=gdValid()?'☁ Drive ✓':'☁ Conectar Drive'}
setInterval(gdUI,30000);addEventListener('online',retryImgs);
document.addEventListener('DOMContentLoaded',()=>{
 gdUI();
 $('gdb').onclick=async()=>{
  try{await gdToken(true);gdUI();await flush();retryImgs()}
  catch(e){alert('No se pudo conectar con Google Drive: '+(e.message||e)+'\n\nSi estás en la app instalada (APK) y no se abre la ventana de Google, cierra sesión y usa «Entrar con Google».')}
 };
});
