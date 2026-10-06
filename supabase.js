/* ============================================================
   supabase.js · Biotaxo dex
   Todo lo de Supabase: el cliente (SB), la sesión (entrar / salir / cambios de
   usuario), el perfil (nombre y foto) y el botón «Entrar con Google».
   Se carga DESPUÉS de la librería de Supabase y ANTES de drive.js y del
   <script> principal de index.html.
   Usa cosas que define el script principal (dbGet, dbPut, dbClear, dbAll, flush,
   loadData, off, uid, data, path, sel, $, esc...). Solo las usa cuando algo
   ocurre (un clic, un cambio de sesión), nunca al cargar el archivo.
   ============================================================ */

/* ---------- Cliente de Supabase ---------- */
const SB=window.supabase?supabase.createClient('https://amybwsnzxmfdvaomkopm.supabase.co','sb_publishable_DVidqeawdNUHxd46TWgfbg_xfDGda_z'):null;

/* ---------- Cola de eventos de sesión ----------
   Supabase avisa de la sesión (p. ej. al volver de entrar con Google) muy pronto, a veces
   ANTES de que el script principal esté listo. Para no perder ese aviso se guarda en una
   cola y se procesa cuando la página ya cargó (ver DOMContentLoaded más abajo). */
let authFn=null;const authCola=[];
SB&&SB.auth.onAuthStateChange((e,s)=>{if(authFn)return authFn(e,s);authCola.push([e,s])});

/* ---------- Perfil: nombre y foto de usuario ---------- */
let prof={name:'',foto:'',email:'',uid:''},setFoto=null;
const profIni=n=>String(n||prof.name||prof.email||'?').trim()[0].toUpperCase();
const avHTML=(f,n,big)=>'<span class="av'+(big?' big':'')+'">'+(f?'<img alt="" referrerpolicy="no-referrer" src="'+esc(f)+'">':esc(profIni(n)))+'</span>';
function drawWho(){
 const w=$('who');if(!w)return;
 w.innerHTML=prof.email?avHTML(prof.foto)+'<span class="wtx"><b>'+esc(prof.name||prof.email.split('@')[0])+'</b><small>'+esc(prof.email)+'</small></span>':'';
}
async function loadProf(email,uid,meta){
 meta=meta||{};
 let f='';try{f=(await dbGet('meta','avatar_'+uid))||''}catch(_){}
 prof={email,uid,name:meta.nombre_perfil||ls('pk_pn_'+uid)||meta.full_name||meta.name||'',foto:f==='none'?'':(f||meta.avatar_url||meta.picture||'')};
 drawWho();
}
function setPrev(){$('set-av').outerHTML=avHTML(setFoto===null?prof.foto:setFoto,$('set-name').value,1).replace('class="av big"','class="av big" id="set-av"')}
function avatarFrom(file){return new Promise(res=>{const u=URL.createObjectURL(file),im=new Image();
 im.onload=()=>{const S=256,c=document.createElement('canvas');c.width=c.height=S;const m=Math.min(im.width,im.height);c.getContext('2d').drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,S,S);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.85))};
 im.onerror=()=>{URL.revokeObjectURL(u);res('')};im.src=u})}

/* ---------- Sesión: qué hacer cuando entra o sale un usuario ---------- */
async function authCambio(_e,sess){
 const u=sess&&sess.user;if(!u&&off)return;
 if(u){off=false;const m=await dbGet('meta','uid');if(m&&m!==u.id){await dbClear('especies');await dbClear('cola');await dbClear('fotos');gdForget()}await dbPut('meta',u.id,'uid');await dbPut('meta',u.email,'email');if(_e==='SIGNED_IN'&&sess.provider_token&&GDRIVE_ON&&sess.provider_token!==ls('pk_ptok')){lsSet('pk_ptok',sess.provider_token);gdSet(sess.provider_token,3500);if(sess.provider_refresh_token)gdFn({action:'store',refresh_token:sess.provider_refresh_token}).catch(()=>{})}}

 $('auth').hidden=!!u;$('app').hidden=!u;$('top').hidden=!u;if(u)await loadProf(u.email,u.id,u.user_metadata);else{prof.email='';drawWho()}
 gdUI();if(u&&u.id!==uid){uid=u.id;loadData()}
 if(!u){uid=null;data=[];path=[];sel=null}
}

/* ---------- Botones (necesitan que la página ya esté cargada) ---------- */
document.addEventListener('DOMContentLoaded',()=>{
const dlgset=$('dlgset');
$('setb').onclick=()=>{setFoto=null;$('set-name').value=prof.name;$('set-mail').textContent=prof.email;$('set-err').textContent='';$('set-foto').value='';setPrev();dlgset.showModal()};
$('set-name').oninput=()=>{if((setFoto===null?prof.foto:setFoto)==='')setPrev()};
$('set-foto').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const d=await avatarFrom(f);if(!d){$('set-err').textContent='No se pudo leer esa imagen.';return}$('set-err').textContent='';setFoto=d;setPrev()};
$('set-rm').onclick=()=>{setFoto='';setPrev()};
$('set-cancel').onclick=()=>dlgset.close();
$('set-save').onclick=async()=>{
 const name=$('set-name').value.trim().slice(0,40);
 prof.name=name;lsSet('pk_pn_'+prof.uid,name);
 if(setFoto!==null){prof.foto=setFoto;await dbPut('meta',setFoto||'none','avatar_'+prof.uid)}
 drawWho();dlgset.close();
 if(SB&&navigator.onLine){try{const r=await SB.auth.updateUser({data:{nombre_perfil:name}});if(r.error)alert('El nombre quedó guardado en este dispositivo, pero no se pudo sincronizar: '+r.error.message)}catch(_){}}
};

$('out').onclick=async()=>{
 if(!SB)return;await flush();
 if((await dbAll('cola')).length&&!confirm('Hay fichas sin subir que se perderán si sales ahora. ¿Salir de todos modos?'))return;
 off=false;await dbClear('especies');await dbClear('cola');await dbClear('meta');await dbClear('fotos');gdForget();SB.auth.signOut();
};

/* Entrar con Google */
 $('glogin').onclick=async()=>{
  if(!SB){$('aerr').textContent='No se pudo cargar el servicio de acceso (¿sin internet?).';return}
  const r=await SB.auth.signInWithOAuth({provider:'google',options:{scopes:GSCOPE,redirectTo:location.origin+location.pathname,queryParams:{access_type:'offline',prompt:'consent'}}});
  if(r.error)$('aerr').textContent=r.error.message;
 };

/* Procesar los avisos de sesión que llegaron antes de tiempo y, desde ahora, atender los nuevos directamente */
(async()=>{
 while(authCola.length){const a=authCola.shift();try{await authCambio(a[0],a[1])}catch(e){console.error(e)}}
 authFn=authCambio;
})();
});
