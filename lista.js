/* ============================================================
   lista.js · Biotaxo dex
   Todo lo de la lista de tarjetas y la navegación por niveles:
     render()                       → dibuja los pasos, la miga de pan, las tarjetas y la ficha
     spCard                         → una tarjeta de especie
     lvState, scoped, chainFor, stepSeq, curLv, BASE, OPTL, LBL, CIDX → niveles taxonómicos
     hay, XF, XFP, XFL, matches, filt, fchipsUI, clearF, favToggle    → búsqueda y filtros rápidos
     nom, SORTF, SORT, byC          → orden de la lista
   Se carga ANTES del <script> principal de index.html (después de ficha.js).
   Al cargar solo declara funciones y datos (SORT lee la preferencia con ls() de drive.js).
   Los clics de la miga de pan, los pasos, las tarjetas, el buscador, los filtros y el
   selector de orden se enganchan en initLista(), que corre en DOMContentLoaded.
   Usa cosas de otros archivos (data, path, sel, Q, onlyFav, selSet, selMode, selTap,
   chkHTML, advBadge, faltantes, lvVal, lvInfoHTML, galHTML, openEdit, dlgdel...) solo
   cuando se ejecuta, nunca al cargar el archivo.
   (Código movido tal cual desde index.html, sin cambios de lógica.)
   ============================================================ */

/* Orden de la lista (preferencia guardada en localStorage). byC se usa en cada carga, así el orden elegido se conserva. */
const nom=s=>String(s.comun||sci(s));
const SORTF={
 rec:(x,y)=>String(y.creado||'').localeCompare(String(x.creado||'')),
 az:(x,y)=>nom(x).localeCompare(nom(y),'es',{sensitivity:'base'}),
 reino:(x,y)=>String(x.reino||'').localeCompare(String(y.reino||''),'es')||nom(x).localeCompare(nom(y),'es',{sensitivity:'base'})
};
let SORT=SORTF[ls('bdx_sort')]?ls('bdx_sort'):'rec';
const byC=a=>a.sort(SORTF[SORT]);
/* Niveles de navegación. Subfilo y suborden son opcionales: solo existen en la ruta si alguna especie
   de la selección actual los tiene (si algunas sí y otras no, las que no, van en «Sin subfilo / suborden»). */
const BASE=['dominio','reino','filo','subphylum','clase','orden','suborden','familia','genero'];
const OPTL={subphylum:1,suborden:1};
const LBL={dominio:'Dominio',reino:'Reino',filo:'Filo o división',subphylum:'Subfilo',clase:'Clase',orden:'Orden',suborden:'Suborden',familia:'Familia',genero:'Género',especie:'Especie'};
const CIDX={dominio:0,reino:1,filo:2,subphylum:2,clase:3,orden:4,suborden:4,familia:5,genero:6,especie:7};
function lvState(){
 let f=data,ks=[],bi=0;
 const skip=()=>{while(bi<BASE.length&&OPTL[BASE[bi]]&&!f.some(x=>lvVal(x,BASE[bi])))bi++};
 for(const v of path){skip();const k=BASE[bi++];ks.push(k);f=f.filter(x=>lvVal(x,k)===v)}
 skip();
 return {ks,f,next:bi<BASE.length?BASE[bi]:'especie'};
}
const scoped=()=>lvState().f;
function chainFor(o){
 let f=data.filter(x=>x.id!==o.id).concat([o]),p=[];
 for(const b of BASE){if(OPTL[b]&&!f.some(x=>lvVal(x,b)))continue;const v=lvVal(o,b);p.push(v);f=f.filter(x=>lvVal(x,b)===v)}
 return p;
}
function stepSeq(st){
 const seq=st.ks.slice();
 if(st.next!=='especie'){seq.push(st.next);for(let b=BASE.indexOf(st.next)+1;b<BASE.length;b++)if(!OPTL[BASE[b]])seq.push(BASE[b])}
 seq.push('especie');return seq;
}
const spCard=s=>'<div class="cardw"><button class="card'+(s.id===sel?' sel':'')+(selSet.has(s.id)?' picked':'')+'" data-id="'+s.id+'"><div class="ph">'+photo(s.foto,s.reino)+advBadge(s)+chkHTML(s)+'<span class="rtag">'+esc(s.reino)+'</span></div><div class="cap"><b>'+(s.pend?'⏳ ':'')+(dest(s)?'📌 ':'')+(fav(s)?'★ ':'')+esc(s.comun||sci(s))+'</b><i>'+esc(sci(s))+'</i></div></button>'
 +'<span class="cact"><button type="button" data-act="edit" data-id="'+s.id+'" aria-label="Editar '+esc(s.comun||sci(s))+'">✎</button><button type="button" data-act="del" data-id="'+s.id+'" aria-label="Eliminar '+esc(s.comun||sci(s))+'">🗑</button></span></div>';
const hay=s=>norm([].concat(LV.map(k=>s[k]),[s.comun,s.car],Object.values(s.rasgos||{}).filter(v=>typeof v==='string')).join(' '));
/* Filtros rápidos. Regla: si hay algún filtro activo (búsqueda Q, ★ Favoritas o un chip) se muestra una lista plana
   de TODA la colección, sin tocar `path`; al quitar los filtros vuelve el carrete donde estabas.
   Q + Favoritas + un chip se combinan con AND. Incompletas / Con foto / Sin foto son excluyentes entre sí.
   «Todas» quita Favoritas y el chip (no la búsqueda). */
let XF='';
const hasFoto=s=>!!((s.fotos&&s.fotos.length)||s.foto);
const XFP={inc:s=>!!(s.rasgos&&s.rasgos._adv)&&faltantes(s).length>0,foto:hasFoto,sinfoto:s=>!hasFoto(s)};
const XFL={inc:'incompletas',foto:'con foto',sinfoto:'sin foto'};
const matches=s=>(!onlyFav||fav(s))&&(!XF||XFP[XF](s))&&(!Q||hay(s).includes(norm(Q)));
const filt=()=>!!(Q||onlyFav||XF);
function fchipsUI(){
 const act={all:!onlyFav&&!XF,fav:onlyFav,inc:XF==='inc',foto:XF==='foto',sinfoto:XF==='sinfoto'};
 document.querySelectorAll('#fchips button').forEach(b=>{
  const k=b.dataset.f;b.classList.toggle('on',!!act[k]);b.setAttribute('aria-pressed',act[k]?'true':'false');
  if(XFP[k])b.textContent=b.dataset.t+' · '+data.filter(XFP[k]).length;
 });
}
let qT=0;   // temporizador del retraso de búsqueda (200 ms)
function clearF(){clearTimeout(qT);Q='';onlyFav=false;XF='';$('q').value=''}
function render(){
 const st=lvState(),d=path.length,atSp=st.next==='especie',cur=curLv(st),sp=data.find(x=>x.id===sel);
 $('steps').innerHTML=stepSeq(st).map((k,j)=>{
  const insp=k==='especie'&&atSp&&sp,val=j<d?(path[j]||'Sin '+LBL[k].toLowerCase()):(insp?sci(sp):'—'),can=j<d||insp;
  return '<button class="step'+(j===cur?' on':'')+'" style="--c:'+COL[CIDX[k]]+'" data-i="'+j+'"'+(can?'':' disabled')+(j===cur?' aria-current="step"':'')+'><span class="lv">'+LBL[k]+'</span><span class="val">'+esc(val)+'</span></button>';
 }).join('');
 if(window.matchMedia&&window.matchMedia('(max-width:900px)').matches){
  const on=$('steps').querySelector('.step.on');
  if(on)$('steps').scrollLeft=Math.max(0,on.offsetLeft-$('steps').offsetLeft-($('steps').clientWidth-on.offsetWidth)/2);
 }
 const showSp=!!sp&&atSp;fchipsUI();
 const bc=(d?['<button class="bc" data-bc="-1">Inicio</button>']:[]).concat(path.map((p,j)=>'<button class="bc" data-bc="'+j+'">'+esc(p)+'</button>')).join(' › ');
 const tail=d<7?'elige '+(LN[d]==='Filo o división'?'un filo o división':'un/a '+LN[d].toLowerCase()):'elige una especie';
 $('crumb').innerHTML='';
 const items=scoped();let h='';
 if(filt()){h=data.filter(matches).map(spCard).join('')||'<p class="empty">Sin resultados.</p>'}
 else if(!atSp){const nk=st.next;
  let keys=nk==='dominio'?DOM.filter(k=>items.some(s=>s.dominio===k)):nk==='reino'?(REINOS[path[0]]||[]):[...new Set(items.map(s=>lvVal(s,nk)))].sort((a,b)=>(a===''?1:0)-(b===''?1:0));
  h=keys.map(k=>{
   const g=items.filter(s=>lvVal(s,nk)===k),ph=g.find(s=>dest(s)&&s.foto)||g.find(s=>s.foto),r=nk==='dominio'?(g[0]&&g[0].reino):(nk==='reino'?k:path[1]);
   return '<button class="card" data-k="'+esc(k)+'"><div class="ph">'+photo(ph&&ph.foto,r)+'</div><div class="cap"><b>'+esc(k||'Sin '+LBL[nk].toLowerCase())+'</b><small>'+g.length+(g.length===1?' especie':' especies')+'</small></div></button>';
  }).join('')||'<p class="empty">Aún no hay nada aquí.</p>';
 }else{
  h=items.filter(dest).concat(items.filter(s=>!dest(s))).map(spCard).join('');
 }
 $('grid').innerHTML=h;
 if(filt()&&!showSp){const n=data.filter(matches).length;$('crumb').textContent=n+(n===1?' resultado':' resultados')+(Q?' para «'+Q+'»':'')+(onlyFav?' · solo favoritas':'')+(XF?' · '+XFL[XF]:'')}
 else if(!filt()&&d>=1&&!showSp){const n=items.length;$('crumb').textContent=(path[d-1]||'Sin '+LBL[st.ks[d-1]].toLowerCase())+' · '+n+(n===1?' especie':' especies')}
 const ver=!!sp&&atSp;
 document.body.classList.toggle('ficha-abierta',ver);
 $('lvinfo').innerHTML=(!ver&&!filt()&&d>=1)?lvInfoHTML():'';
 $('grid').hidden=ver;$('detail').hidden=!ver;
 $('detail').innerHTML=ver
  ?'<button id="back">← Volver a las especies</button>'
   +'<div class="ficha">'+galHTML(sp)
   +'<div class="finfo"><h2>'+esc(sp.comun||sci(sp))+'</h2><p class="sci">'+esc(sci(sp))+' <button type="button" id="cpsci" title="Copiar nombre científico" aria-label="Copiar nombre científico" style="padding:2px 8px;font-size:.85rem;margin-left:6px;vertical-align:middle;border-radius:8px">📋</button></p>'
   +advLine(sp)+sumHTML(sp)+'<ol class="lin deskonly">'+linHTML(sp)+'</ol>'
   +'<div class="btns"><button id="favb">'+(fav(sp)?'★ Favorito':'☆ Favorito')+'</button><button id="destb">'+(dest(sp)?'📌 Quitar destacado':'📌 Destacar')+'</button><button id="shr">↗ Compartir</button><button id="edit">Editar ficha</button><button class="danger" id="del">🗑 Eliminar</button></div></div>'
   +'<div class="ficha-car">'+distBlock(sp)+rgHTML(sp)
   +'</div></div>'
  :'';
 if(ver){
  wireGal();wireOrg();wireDist(sp);
  if(sp.fotos===undefined)ensureFotos(sp).then(()=>{if(sel===sp.id&&sp.fotos.length>1)render()});
 }
}
/* Nivel actual = el último elegido (con una especie abierta, «Especie») */
function curLv(st){st=st||lvState();return st.next==='especie'&&data.some(x=>x.id===sel)?path.length:path.length-1}
/* Tocar un nivel anterior te lleva a él; tocar el nivel actual sube uno */
function favToggle(){onlyFav=!onlyFav;sel=null;render()}

/* Conexión con la página: clics de la lista, buscador, filtros y orden (necesita que la página ya esté cargada) */
function initLista(){
$('crumb').onclick=e=>{const b=e.target.closest('.bc');if(!b)return;clearF();path=path.slice(0,+b.dataset.bc+1);sel=null;render()};
$('steps').onclick=e=>{const b=e.target.closest('.step');if(!b||b.disabled||b.dataset.i===undefined)return;const j=+b.dataset.i;clearF();path=path.slice(0,j===curLv()?j:j+1);sel=null;render()};
$('grid').onclick=e=>{
 if(selMode&&selTap(e))return;
 const a=e.target.closest('[data-act]');
 if(a){
  const sp=data.find(x=>x.id===a.dataset.id);if(!sp)return;
  if(a.dataset.act==='edit')openEdit(sp);
  else{delId=sp.id;$('delerr').textContent='';$('deltxt').textContent='Vas a eliminar «'+(sp.comun||sci(sp))+'» ('+sci(sp)+').';dlgdel.showModal()}
  return;
 }
 const c=e.target.closest('.card');if(!c)return;if(c.dataset.id){sel=c.dataset.id;const s0=data.find(x=>x.id===sel);if(s0)path=chainFor(s0)}else{path.push(c.dataset.k);sel=null}render()};
$('sortsel').value=SORT;
$('sortsel').onchange=e=>{SORT=SORTF[e.target.value]?e.target.value:'rec';lsSet('bdx_sort',SORT);byC(data);render()};
$('q').oninput=()=>{clearTimeout(qT);qT=setTimeout(()=>{Q=$('q').value.trim();sel=null;render()},200)};   // busca al dejar de escribir 200 ms
$('fchips').onclick=e=>{
 const b=e.target.closest('button[data-f]');if(!b)return;const k=b.dataset.f;
 if(k==='fav')return favToggle();
 if(k==='all'){onlyFav=false;XF=''}else XF=XF===k?'':k;
 sel=null;render();
};
}
document.addEventListener('DOMContentLoaded',initLista);
