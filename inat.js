/* ============================================================
   inat.js · Biotaxo dex
   Todo lo de iNaturalist: reconocimiento de especie con IA (Computer Vision),
   conexión OAuth (PKCE) y token JWT, botones «🔍 Analizar con IA» y «Usar este».
   Se carga ANTES del <script> principal de index.html (después de drive.js).
   Todo va dentro de DOMContentLoaded porque envuelve drawThumbs y usa
   $, esc, LV, LN, dlg, formFotos, getBlob, isLoc, isGd, que se definen
   en el script principal (que se ejecuta después).
   ============================================================ */
document.addEventListener('DOMContentLoaded',()=>{


/* =====================================================================
   🔍 Reconocimiento de especie con IA (iNaturalist Computer Vision)
   + Conexión con iNaturalist por OAuth (PKCE): se autoriza UNA vez y la app
     obtiene sola el token (JWT) cada día.

   DÓNDE PEGAR: en el <script> principal, justo DESPUÉS del manejador de
   «Verificar en GBIF» y ANTES del comentario «Arranque sin conexión».

   Usa lo que ya existe en tu app: $, esc, LV, LN, dlg, formFotos,
   drawThumbs, getBlob, isLoc, isGd.
   ===================================================================== */

/* >>> PON AQUÍ el Client ID de tu aplicación registrada en iNaturalist
       (https://www.inaturalist.org/oauth/applications/new).
       Si lo dejas vacío, la app vuelve al modo antiguo: pedir el token a mano. */
const IA_CID='';

const IA_SITE='https://www.inaturalist.org',IA_URL='https://api.inaturalist.org/v1/';
let iaSeq=0,iaRef=null,iaCands=[],iaManualRes=null;            // iaSeq: descarta respuestas "viejas"
const IA_RANGO={species:'especie',subspecies:'subespecie',variety:'variedad',form:'forma',hybrid:'híbrido',genus:'género'};
// iNaturalist → tus 5 reinos
const IA_KR={Bacteria:'Monera',Archaea:'Monera',Protozoa:'Protista',Chromista:'Protista'};
// Mensajes de error propios (códigos que lanzan las funciones de conexión)
const IA_ERR={
 POPUP:'El navegador bloqueó la ventana de iNaturalist. Permite las ventanas emergentes para este sitio y vuelve a pulsar el botón.',
 CANCEL:'Cancelaste la conexión con iNaturalist.',
 DENIED:'No se autorizó el acceso en iNaturalist.',
 TIMEOUT:'No recibí la respuesta de iNaturalist. Si usas la app instalada en iPhone, prueba desde el navegador.',
 FOTO:'No pude leer la foto (¿está solo en Drive y no hay conexión?).'
};

/* ---- Utilidades de interfaz ---- */
function iaMsg(t,err){const m=$('iamsg');m.innerHTML=t;m.style.color=err?'var(--dng)':''}   // t = HTML ya escapado
function iaBusy(on){const b=$('ia');b.disabled=on;b.textContent=on?'⏳ Analizando…':'🔍 Analizar con IA'}
function iaClear(){iaSeq++;if(iaManualRes)iaManualRes('');iaCands=[];iaRef=formFotos[0]||null;$('iares').innerHTML='';iaMsg('');iaBusy(false)}

/* Si la foto de portada (la primera) cambia, o se abre/cierra el formulario, se limpia el panel.
   Se engancha a drawThumbs() sin tocar su código. */
const _drawThumbs=drawThumbs;
drawThumbs=function(){_drawThumbs.apply(this,arguments);if((formFotos[0]||null)!==iaRef)iaClear()};
dlg.addEventListener('close',iaClear);

/* =====================  TOKEN DE INATURALIST  =====================
   score_image exige un JWT (24 h). Con IA_CID configurado:
     1) Conexión única: ventana emergente de iNaturalist (OAuth + PKCE, sin secreto).
        Vuelve a inat-callback.html, que deja el código en localStorage; aquí se canjea.
     2) Cada día: con el token OAuth guardado se pide un JWT nuevo, sin ventanas.
   Claves en localStorage: inat_oauth (token OAuth), inat_jwt2 (JWT), inat_cb (respuesta de la ventana). */
const iaLoad=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const iaSave=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const iaDel=(...k)=>k.forEach(x=>{try{localStorage.removeItem(x)}catch(_){}});
const IA_REDIR=()=>new URL('inat-callback.html',location.href).href;   // debe coincidir con la URI registrada

function iaSaveJwt(t){
 let exp=Date.now()+23*36e5;                       // por defecto 23 h
 try{const p=JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));if(p.exp)exp=Math.min(exp,p.exp*1000-6e4)}catch(_){}
 iaSave('inat_jwt2',{t,exp});
}
function iaSaveTokens(j,rtOld){
 const o={at:j.access_token,rt:j.refresh_token||rtOld||'',exp:j.expires_in?Date.now()+j.expires_in*1000:0};
 iaSave('inat_oauth',o);return o;
}

/* Modo antiguo (sin Client ID): pegar el JWT a mano.
   Panel dentro del formulario (no un prompt) para poder tener un enlace pulsable. */
function iaManual(){
 return new Promise(ok=>{
  if(iaManualRes)iaManualRes('');
  const box=$('iares');
  const fin=v=>{iaManualRes=null;box.innerHTML='';ok(v)};
  iaManualRes=fin;
  box.innerHTML='<div class="iac" style="flex-direction:column;align-items:stretch">'
   +'<div><b>Necesito tu token de iNaturalist</b> (caduca cada 24 h):</div>'
   +'<ol style="margin:6px 0 4px;padding-left:20px">'
   +'<li>Abre <a href="https://www.inaturalist.org/users/api_token" target="_blank" rel="noopener" style="color:var(--lnk,var(--acc));font-weight:700">inaturalist.org/users/api_token</a> (con tu sesión iniciada).</li>'
   +'<li>Copia todo el texto que aparece (o solo el valor de «api_token»).</li>'
   +'<li>Vuelve aquí y pégalo:</li></ol>'
   +'<input id="iatok" placeholder="Pega aquí el token" autocomplete="off" autocapitalize="off" spellcheck="false">'
   +'<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button type="button" id="iatok-no">Cancelar</button><button type="button" class="primary" id="iatok-ok">Continuar</button></div></div>';
  $('iatok-ok').onclick=()=>{
   const m=$('iatok').value.match(/eyJ[\w-]+\.[\w-]+\.[\w-]+/);
   if(!m){iaMsg('No encuentro un token válido en lo que pegaste (debe empezar por «eyJ»).',1);return}
   iaMsg('');iaSaveJwt(m[0]);fin(m[0]);
  };
  $('iatok-no').onclick=()=>fin('');
  $('iatok').focus();
 });
}

/* Renovar el token OAuth si iNaturalist entregó refresh_token (si no, devuelve null) */
async function iaRefresh(o){
 try{
  const r=await fetch(IA_SITE+'/oauth/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
   body:new URLSearchParams({client_id:IA_CID,grant_type:'refresh_token',refresh_token:o.rt})});
  if(!r.ok){iaDel('inat_oauth');return null}
  return iaSaveTokens(await r.json(),o.rt);
 }catch(e){if(e instanceof TypeError)throw e;iaDel('inat_oauth');return null}
}

/* Token OAuth guardado → JWT nuevo (sin ventanas). '' si no hay conexión válida. */
async function iaJwtOauth(){
 let o=iaLoad('inat_oauth');if(!o||!o.at)return '';
 if(o.rt&&o.exp&&o.exp<Date.now()+6e4){o=await iaRefresh(o);if(!o)return ''}
 const get=a=>fetch(IA_SITE+'/users/api_token',{headers:{Authorization:'Bearer '+a}});
 let r=await get(o.at);
 if(r.status===401&&o.rt){o=await iaRefresh(o);if(!o)return '';r=await get(o.at)}
 if(r.status===401||r.status===403){iaDel('inat_oauth','inat_jwt2');return ''}
 if(!r.ok)throw new Error('HTTP '+r.status);
 const t=(await r.json()).api_token||'';
 if(t)iaSaveJwt(t);return t;
}

/* Conexión única: ventana emergente + PKCE. Debe llamarse desde un toque/clic del usuario. */
async function iaConnect(){
 const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const w=window.open('','inat_auth','width=520,height=720');      // se abre ya (con el gesto del usuario) y luego se redirige
 if(!w)throw new Error('POPUP');
 try{
  const ver=b64(crypto.getRandomValues(new Uint8Array(32))),st=b64(crypto.getRandomValues(new Uint8Array(16)));
  const ch=b64(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ver)));
  iaDel('inat_cb');
  iaMsg('Autoriza el acceso en la ventana de iNaturalist…');
  w.location.href=IA_SITE+'/oauth/authorize?'+new URLSearchParams({client_id:IA_CID,redirect_uri:IA_REDIR(),response_type:'code',code_challenge:ch,code_challenge_method:'S256',state:st});
  // Esperar la respuesta que deja inat-callback.html (se consulta cada 0,5 s, máx. 3 min)
  let cb=null;const t0=Date.now();
  while(!cb){
   await new Promise(r=>setTimeout(r,500));
   let v=iaLoad('inat_cb');if(v&&v.st===st){cb=v;break}
   if(w.closed){await new Promise(r=>setTimeout(r,800));v=iaLoad('inat_cb');if(v&&v.st===st){cb=v;break}throw new Error('CANCEL')}
   if(Date.now()-t0>18e4)throw new Error('TIMEOUT');
  }
  iaDel('inat_cb');
  if(cb.err||!cb.code)throw new Error('DENIED');
  const r=await fetch(IA_SITE+'/oauth/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
   body:new URLSearchParams({client_id:IA_CID,grant_type:'authorization_code',code:cb.code,redirect_uri:IA_REDIR(),code_verifier:ver})});
  if(!r.ok)throw new Error('HTTP '+r.status);
  iaSaveTokens(await r.json());
  iaMsg('');
  return await iaJwtOauth();
 }finally{try{w.close()}catch(_){}}
}

/* Punto de entrada: devuelve un JWT válido ('' si no se pudo).
   forzar=true → ignorar el guardado (p. ej. tras un 401); en ese caso nunca abre ventanas. */
async function iaToken(forzar){
 const J=iaLoad('inat_jwt2');
 if(!forzar&&J&&J.t&&J.exp>Date.now())return J.t;
 if(!IA_CID)return iaManual();
 const t=await iaJwtOauth();
 if(t||forzar)return t;
 return iaConnect();
}

/* ---- Foto → Blob (loc:/gd: desde IndexedDB/Drive; data:/http: con fetch) ---- */
async function iaBlob(ref){return (isLoc(ref)||isGd(ref))?getBlob(ref):(await fetch(ref)).blob()}

/* ---- Llamada a la API (prueba el JWT tal cual y, si da 401/403, con prefijo "Bearer ") ---- */
function iaPost(blob,auth){
 const fd=new FormData();fd.append('image',blob,'foto.jpg');fd.append('locale','es');
 return fetch(IA_URL+'computervision/score_image',{method:'POST',headers:{Authorization:auth},body:fd});
}
async function iaPostAuth(blob,tok){
 let r=await iaPost(blob,tok);
 if(r.status===401||r.status===403)r=await iaPost(blob,'Bearer '+tok);
 return r;
}

/* ---- Botón «Analizar con IA» ---- */
$('ia').onclick=async()=>{
 const my=++iaSeq,ref=formFotos[0];
 $('iares').innerHTML='';iaMsg('');
 if(!ref){iaMsg('Añade primero una foto para poder analizarla.',1);return}
 if(!navigator.onLine){iaMsg('Sin conexión: el reconocimiento con IA necesita internet.',1);return}
 iaRef=ref;iaBusy(true);            // solo el botón cambia: el resto del formulario sigue usable
 try{
  let tok=await iaToken(false);    // primero el token: si hay que conectar, la ventana se abre con el toque del usuario
  if(my!==iaSeq)return;
  if(!tok){iaMsg('Hace falta conectar con iNaturalist para analizar.',1);return}
  const blob=await iaBlob(ref);
  if(!blob)throw new Error('FOTO');
  let r=await iaPostAuth(blob,tok);
  if(r.status===401||r.status===403){          // JWT caducado o inválido: pedir uno nuevo y reintentar una vez
   tok=await iaToken(true);
   if(tok)r=await iaPostAuth(blob,tok);
   if(r.status===401||r.status===403){
    iaDel('inat_jwt2','inat_oauth');          // la próxima vez se vuelve a conectar desde cero
    if(my===iaSeq)iaMsg('iNaturalist rechazó el acceso. Vuelve a pulsar «Analizar con IA» para reconectar.',1);
    return;
   }
  }
  if(my!==iaSeq)return;                        // el usuario cambió de foto mientras tanto
  if(r.status===429){iaMsg('Demasiadas consultas a iNaturalist. Espera un momento y reintenta.',1);return}
  if(!r.ok)throw new Error('HTTP '+r.status);
  const j=await r.json();
  const rs=(j.results||[]).filter(x=>x&&x.taxon);
  // Preferir especie (o inferior); si no hay ninguna, aceptar también género, etc.
  const sp=rs.filter(x=>/^(species|subspecies|variety|form|hybrid)$/.test(x.taxon.rank));
  iaCands=(sp.length?sp:rs).slice(0,3).map(x=>({t:x.taxon,s:Number(x.combined_score!=null?x.combined_score:x.vision_score)||0}));
  if(!iaCands.length){iaMsg('No se pudo identificar con suficiente confianza. Prueba con otra foto o complétala a mano.');return}
  $('iares').innerHTML='<div class="ia">'+iaCands.map((c,i)=>{
   // Foto de referencia de iNaturalist (solo https) y enlace a la ficha del taxón para ver más fotos
   const dp=c.t.default_photo||{},pu=/^https:\/\//.test(dp.medium_url||dp.square_url||'')?(dp.medium_url||dp.square_url):'';
   const tx='https://www.inaturalist.org/taxa/'+encodeURIComponent(c.t.id);
   return '<div class="iac">'
    +'<a href="'+tx+'" target="_blank" rel="noopener" class="iaph" title="Ver más fotos en iNaturalist">'
    +(pu?'<img src="'+esc(pu)+'" alt="Foto de referencia de '+esc(c.t.name)+'" loading="lazy" onerror="this.replaceWith(document.createTextNode(\'🌿\'))">':'🌿')+'</a>'
    +'<div class="it"><b>'+esc(c.t.name)+'</b><br><span>'+esc(c.t.preferred_common_name||'sin nombre común')+'</span>'
    +'<div class="pc">'+Math.round(c.s)+'% de confianza · '+esc(IA_RANGO[c.t.rank]||c.t.rank||'')+'</div>'
    +'<a class="pc" href="'+tx+'" target="_blank" rel="noopener" style="color:var(--lnk,var(--acc))">Ver más fotos ↗</a>'
    +(dp.attribution?'<div class="pc" style="font-size:.7rem">📷 '+esc(dp.attribution)+'</div>':'')+'</div>'
    +'<button type="button" class="primary" data-i="'+i+'">Usar este</button></div>'}).join('')
   +'<p class="hint">Compara con tu foto: toca la imagen para ver más fotos de esa especie. La IA puede equivocarse: revisa siempre el resultado.</p></div>';
 }catch(err){
  if(my!==iaSeq)return;
  const k=err&&err.message;
  iaMsg(IA_ERR[k]||(err instanceof TypeError?'No pude conectar con iNaturalist (¿sin internet o bloqueado por el navegador?).'
   :'Error de la API de iNaturalist ('+esc(k||err)+'). Inténtalo más tarde.'),1);
 }finally{if(my===iaSeq)iaBusy(false)}
};

/* ---- Botón «Usar este» ---- */
$('iares').onclick=e=>{const b=e.target.closest&&e.target.closest('button[data-i]');if(b)iaUse(+b.dataset.i,b)};

async function iaUse(i,btn){
 const c=iaCands[i],my=iaSeq;if(!c)return;
 const txt=btn.textContent;btn.disabled=true;btn.textContent='Cargando…';
 const fail=m=>{btn.disabled=false;btn.textContent=txt;iaMsg(m,1)};
 try{
  // La jerarquía suele venir en taxon.ancestors; si no, se pide a /taxa/{id} (endpoint público).
  let anc=c.t.ancestors,com=c.t.preferred_common_name||'';
  if(!Array.isArray(anc)||!anc.length){
   const r=await fetch(IA_URL+'taxa/'+c.t.id+'?locale=es');
   if(!r.ok)throw new Error('HTTP '+r.status);
   const d=((await r.json()).results||[])[0]||{};
   anc=d.ancestors||[];com=com||d.preferred_common_name||'';
  }
  if(my!==iaSeq)return;
  const m={};anc.forEach(a=>{m[a.rank]=a.name});m[c.t.rank]=c.t.name;
  const kg=m.kingdom;
  if(!kg)return fail('iNaturalist no devolvió el reino de este taxón; complétalo a mano.');
  const reino=IA_KR[kg]||kg;
  if(![...$('f-reino').options].some(o=>o.value===reino))return fail('iNaturalist lo clasifica como «'+esc(kg)+'», que tu app no tiene como reino.');
  const dom=kg==='Archaea'?'Archaea':kg==='Bacteria'?'Bacteria':'Eukarya';
  const T={filo:m.phylum,clase:m.class,orden:m.order,familia:m.family,genero:m.genus,especie:(m.species||'').split(' ')[1]||''};
  const cm=com?com.charAt(0).toUpperCase()+com.slice(1):'';
  // [id del campo, etiqueta, valor nuevo]; solo los que existen y traen valor
  const F=LV.slice(2).map(k=>['f-'+k,LN[LV.indexOf(k)],T[k]])
   .concat([['f-comun','Nombre común',cm],['r-subphylum','Subphylum',m.subphylum],['r-suborden','Suborden',m.suborder]])
   .filter(f=>f[2]&&$(f[0]));

  // ¿Hay datos distintos ya escritos? → preguntar si sobrescribir
  const fresh=LV.slice(2).every(k=>!$('f-'+k).value.trim());      // formulario aún sin taxonomía: reino/dominio son valores por defecto
  const dif=F.filter(f=>{const cur=$(f[0]).value.trim();return cur&&cur.toLowerCase()!==f[2].toLowerCase()});
  const cambiaSel=!fresh&&($('f-reino').value!==reino||$('f-dominio').value!==dom);
  let pisar=true;
  if(dif.length||cambiaSel){
   pisar=confirm('Hay campos que ya tienen datos distintos:\n'
    +(cambiaSel?'· Dominio/Reino: '+$('f-dominio').value+' / '+$('f-reino').value+' → '+dom+' / '+reino+'\n':'')
    +dif.map(f=>'· '+f[1]+': '+$(f[0]).value.trim()+' → '+f[2]).join('\n')
    +'\n\nAceptar = sobrescribir todo\nCancelar = rellenar solo los campos vacíos');
  }
  // Reino/dominio (selects)
  if(pisar||!cambiaSel){
   $('f-reino').value=reino;
   if($('f-reino').onchange)$('f-reino').onchange();   // reconstruye los campos específicos del reino (y ajusta dominio)
   $('f-dominio').value=dom;                           // después, el dominio exacto (Bacteria/Archaea/Eukarya)
  }
  // Campos de texto
  const keep=[];
  F.forEach(f=>{const el=$(f[0]);if(!el.value.trim()||pisar)el.value=f[2];else if(el.value.trim().toLowerCase()!==f[2].toLowerCase())keep.push(f[1])});

  // Cerrar panel y avisar
  $('iares').innerHTML='';iaCands=[];
  iaMsg('✓ Rellenado con <i>'+esc(c.t.name)+'</i> ('+Math.round(c.s)+'% de confianza). La IA puede equivocarse: revisa los datos.'
   +(keep.length?' Se mantuvieron tus valores en: '+esc(keep.join(', '))+'.':''));
  txSync();
 }catch(err){
  if(my!==iaSeq)return;
  fail(err instanceof TypeError?'No pude descargar la clasificación (¿sin internet?).':'Error al leer la clasificación ('+esc(err&&err.message||err)+').');
 }
}

/* ======================================================================
   v3.3 · 6b) COMPARAR CON INATURALIST (foto del usuario ↔ foto de referencia)
   ----------------------------------------------------------------------
   Consulta la API pública /v1/taxa con el nombre científico (sin token) y
   muestra lado a lado la foto que estás viendo en la galería y las fotos de
   referencia de iNaturalist.
   ====================================================================== */
const INAT='https://api.inaturalist.org/v1/';
const okUrl=u=>/^https:\/\//.test(u||'')?u:'';
async function cmpInat(sp,o){
 o=o||{};
 const box=o.box||$('cmpbox'),b=o.btn||$('cmpb'),name=o.name||sci(sp);
 if(!navigator.onLine){box.innerHTML='<p class="note">Sin conexión: la comparación necesita internet.</p>';return}
 b.disabled=true;b.textContent='⏳ Buscando…';box.innerHTML='';
 try{
  const r=await fetch(INAT+'taxa?q='+encodeURIComponent(name)+'&per_page=5&locale=es');
  if(!r.ok)throw new Error('HTTP '+r.status);
  const res=(await r.json()).results||[];
  const t=res.find(x=>norm(x.name)===norm(name));
  if(!t){
   box.innerHTML='<p class="note">No encontré «'+esc(name)+'» en iNaturalist.'+(res[0]?' Lo más parecido es «'+esc(res[0].name)+'».':'')+' Revisa el nombre científico.</p>';
   return;
  }
  // Fotos de referencia: las de la ficha del taxón; si fallan, la principal
  let ph=[],com=t.preferred_common_name||'';
  try{
   const d=await fetch(INAT+'taxa/'+t.id+'?locale=es');
   if(d.ok){const j=((await d.json()).results||[])[0]||{};ph=(j.taxon_photos||[]).map(x=>x.photo).filter(Boolean);com=com||j.preferred_common_name||''}
  }catch(_){}
  if(!ph.length&&t.default_photo)ph=[t.default_photo];
  ph=ph.filter(p=>okUrl(p.medium_url)).slice(0,6);
  // Foto del usuario: la que se ve ahora en la galería (respeta el filtro Flor/Hoja/Fruto)
  let ref;
  if(o.ref!==undefined)ref=o.ref;   // desde el formulario: la portada que estás añadiendo
  else{const g=$('gal'),vis=g?[...g.children].filter(c=>!c.hidden):[];
  const sl=vis[g&&g.clientWidth?Math.min(vis.length-1,Math.round(g.scrollLeft/g.clientWidth)):0]||vis[0],im=sl&&sl.querySelector('img');
  ref=im?(im.dataset.ref||im.getAttribute('src')||''):''}
  const mine=ref?IMG(ref):'<span class="nophoto" aria-hidden="true">'+(EMO[sp.reino]||'🧬')+'</span>';
  const m=ph[0];
  box.innerHTML='<div class="cmp">'
   +'<div class="cmpc"><b>Tu foto</b><div class="cmpi">'+mine+'</div></div>'
   +'<div class="cmpc"><b>iNaturalist</b><div class="cmpi">'+(m?'<img id="cmpref" src="'+esc(okUrl(m.medium_url))+'" alt="Foto de referencia de '+esc(t.name)+'">':'<span aria-hidden="true">🌿</span>')+'</div>'
   +(ph.length>1?'<div class="cmpth">'+ph.map(p=>'<img src="'+esc(okUrl(p.square_url||p.medium_url))+'" data-big="'+esc(okUrl(p.medium_url))+'" data-at="'+esc(p.attribution||'')+'" alt="Otra foto de referencia">').join('')+'</div>':'')
   +'<small class="pcm" id="cmpat">'+(m&&m.attribution?'📷 '+esc(m.attribution):'')+'</small></div></div>'
   +'<p class="hint"><i>'+esc(t.name)+'</i>'+(com?' · '+esc(com):'')+' · <a href="https://www.inaturalist.org/taxa/'+encodeURIComponent(t.id)+'" target="_blank" rel="noopener" style="color:var(--lnk)">Ver más fotos en iNaturalist ↗</a> · <button type="button" id="cmpx" class="lnkb">Cerrar</button></p>';
  box.onclick=e=>{
   const th=e.target.closest&&e.target.closest('.cmpth img');
   if(th){$('cmpref').src=th.dataset.big;$('cmpat').textContent=th.dataset.at?'📷 '+th.dataset.at:''}
   else if(e.target.id==='cmpx')box.innerHTML='';
  };
 }catch(err){
  box.innerHTML='<p class="note">'+(err instanceof TypeError?'No pude conectar con iNaturalist (¿sin internet?).':'Error al consultar iNaturalist ('+esc(err&&err.message||err)+').')+'</p>';
 }finally{b.disabled=false;b.textContent='🔍 Comparar con iNaturalist'}
}

$('fcmpb').onclick=async()=>{
 const g=$('f-genero').value.trim(),e=$('f-especie').value.trim(),box=$('fcmpbox');
 if(!g||!e){box.innerHTML='<p class="note">Escribe el género y la especie para comparar.</p>';return}
 await cmpInat({reino:$('f-reino').value},{box,btn:$('fcmpb'),name:g+' '+e,ref:formFotos[0]||''});
 $('fcmpb').textContent='🔍 Comparar especie';   // cmpInat deja el texto antiguo al terminar: se corrige aquí
};

/* Comparar a nivel de género (solo usa el campo «Género») */
$('fcmpg').onclick=async()=>{
 const g=$('f-genero').value.trim(),box=$('fcmpbox');
 if(!g){box.innerHTML='<p class="note">Escribe el género primero.</p>';return}
 await cmpInat({reino:$('f-reino').value},{box,btn:$('fcmpg'),name:g,ref:formFotos[0]||''});
 $('fcmpg').textContent='🔍 Comparar género';
};

/* ======================================================================
   v4.1 · Completar Flor / Hoja / Fruto con fotos de iNaturalist (solo Plantae)
   Si ya etiquetaste alguna foto y falta algún órgano, el formulario sugiere buscarlo.
   Se listan fotos de observaciones con licencia abierta; al tocar una se descarga, se añade
   a la ficha con su etiqueta y se guarda el crédito de su autor (rasgos._fc, paralelo a _fo).
   Flor = fenología «Floración/Botón»; Fruto = «Fructificación»; Hoja = «Sin evidencia de floración»
   (suele mostrar el follaje): elige tú la foto que muestre bien el órgano.
   ====================================================================== */
const ORG_Q={Flor:'13,15',Fruto:'14',Hoja:'21'};
let orgCands=[],orgCur='';
function orgMissing(){
 if($('f-reino').value!=='Plantae')return [];
 const have=new Set(formFotos.map(r=>formOrg[r]).filter(Boolean));
 return have.size?ORG.map(o=>o[0]).filter(o=>!have.has(o)):[];
}
function orgSug(){
 const el=$('orgsug');if(!el)return;
 const m=orgMissing();
 if(!m.length){el.hidden=true;el.innerHTML='';return}
 el.hidden=false;
 el.innerHTML='🌿 Te falta: '+m.map(o=>ORG_IC[o]+' '+o).join(', ')+'. Puedes completarla con una foto de iNaturalist (se guarda con el crédito de quien la tomó).<br>'
  +m.map(o=>'<button type="button" data-og="'+o+'" style="margin:6px 6px 0 0">'+ORG_IC[o]+' Buscar '+o.toLowerCase()+'</button>').join('');
}
const _dtOrg=drawThumbs;
drawThumbs=function(){_dtOrg.apply(this,arguments);orgSug()};
dlg.addEventListener('close',()=>{$('orgres').innerHTML='';orgCands=[]});
$('orgsug').onclick=e=>{const b=e.target.closest('button[data-og]');if(b)orgSearch(b.dataset.og)};
$('orgres').onclick=e=>{const b=e.target.closest('button[data-i]');if(b)orgPick(+b.dataset.i,b)};
async function orgSearch(org){
 const box=$('orgres'),g=$('f-genero').value.trim(),e=$('f-especie').value.trim();
 if(!g||!e){box.innerHTML='<p class="note">Escribe el género y la especie para buscar.</p>';return}
 if(!navigator.onLine){box.innerHTML='<p class="note">Sin conexión: la búsqueda necesita internet.</p>';return}
 box.innerHTML='<p class="hint">⏳ Buscando '+esc(org.toLowerCase())+' de '+esc(g+' '+e)+'…</p>';
 try{
  const r=await fetch(INAT+'observations?taxon_name='+encodeURIComponent(g+' '+e)+'&term_id=12&term_value_id='+ORG_Q[org]
   +'&photos=true&photo_license=cc0,cc-by,cc-by-sa,cc-by-nc,cc-by-nc-sa&quality_grade=research&order_by=votes&per_page=12&locale=es');
  if(!r.ok)throw new Error(r.status);
  const d=await r.json(),c=[];
  (d.results||[]).forEach(o=>{const p=(o.photos||[])[0];if(p&&p.license_code&&okUrl(p.url))c.push({th:p.url,big:p.url.replace('/square.','/large.'),at:p.attribution||'',oid:o.id})});
  orgCands=c;orgCur=org;
  if(!c.length){box.innerHTML='<p class="note">No encontré fotos con licencia abierta de «'+esc(org.toLowerCase())+'» para '+esc(g+' '+e)+'.</p>';return}
  box.innerHTML='<p class="hint">Toca la foto que mejor muestre '+ORG_IC[org]+' '+esc(org.toLowerCase())+'. Se descarga con el crédito de su autor.</p>'
   +'<div style="display:flex;flex-wrap:wrap;gap:6px">'+c.map((x,i)=>'<button type="button" data-i="'+i+'" style="padding:0;border:0;background:none;border-radius:10px;overflow:hidden;width:76px;height:76px"><img src="'+esc(x.th)+'" alt="Foto de iNaturalist" style="width:100%;height:100%;object-fit:cover;display:block"></button>').join('')+'</div>';
 }catch(err){
  box.innerHTML='<p class="note">'+(err instanceof TypeError?'No pude conectar con iNaturalist (¿sin internet?).':'Error al consultar iNaturalist ('+esc(err&&err.message||err)+').')+'</p>';
 }
}
async function orgPick(i,btn){
 const c=orgCands[i],box=$('orgres');if(!c)return;
 if(formFotos.length>=MAXF){box.innerHTML='<p class="note">Máximo '+MAXF+' fotos por especie.</p>';return}
 btn.disabled=true;
 try{
  const r=await fetch(c.big);if(!r.ok)throw new Error(r.status);
  const b=await r.blob(),f=new File([b],'inat.jpg',{type:b.type||'image/jpeg'});
  const ref=GDRIVE_ON?await addLocal(f):await resize(f);
  if(!ref)throw new Error('imagen');
  formFotos.push(ref);formOrg[ref]=orgCur;
  formCred[ref]=(String(c.at||'iNaturalist').replace(/[|\n\r]+/g,' ').trim()+' · vía iNaturalist');
  drawThumbs();
  box.innerHTML='<p class="hint">✔ Foto de '+esc(orgCur.toLowerCase())+' añadida con su crédito. Se guarda al pulsar «Guardar».</p>';
  orgCands=[];
 }catch(err){
  btn.disabled=false;
  box.innerHTML='<p class="note">No pude descargar esa imagen (iNaturalist puede bloquearla desde el navegador). Ábrela en <a href="https://www.inaturalist.org/observations/'+encodeURIComponent(c.oid)+'" target="_blank" rel="noopener" style="color:var(--lnk)">iNaturalist ↗</a> y súbela con «Elegir fotos».</p>';
 }
}

/* =====================================================================
   LO QUE SE AÑADIÓ A ESTE ARCHIVO (movido desde index.html, sin cambios):
   1) «Comparar con iNaturalist»: const INAT, const okUrl, cmpInat(sp,o)
      y el listener $('fcmpb').onclick.
   2) «Completar Flor / Hoja / Fruto» (solo Plantae): ORG_Q, orgCands/orgCur,
      orgMissing(), orgSug(), orgSearch(org), orgPick(i,btn), los listeners
      $('orgsug').onclick y $('orgres').onclick, y dlg.addEventListener('close',...).
   3) Segundo wrapper de drawThumbs (_dtOrg → orgSug), colocado DESPUÉS del
      wrapper de iaClear. El wrapper de iaClear no se duplicó.
   ===================================================================== */

});
