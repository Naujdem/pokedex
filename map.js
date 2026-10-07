/* ============================================================
   map.js · Biotaxo dex
   Todo lo del mapa SVG de distribución geográfica: carga de world.svg,
   mapa interactivo (zoom, arrastre, pellizco), selección de países
   nativos / invasores en el formulario y el mapa de la ficha.
   Se carga DESPUÉS de inat.js y ANTES del <script> principal de index.html.
   Usa cosas que define el script principal ($, esc, tnorm, normDist, sel).
   Solo las usa cuando algo ocurre (un clic, abrir una ficha), nunca al cargar
   el archivo; los botones se enganchan en DOMContentLoaded.
   Lo que el script principal usa de aquí: edist, distLoad, distN,
   distBlock y wireDist.
   (Código movido tal cual desde index.html, sin cambios.)
   ============================================================ */

/* ---------- Mapa de distribución (SVG local, sin internet) ---------- */
let WORLD=null,edist={nativo:new Set(),invasor:new Set()},emap=null,emode='nativo',NM={};
const loadWorld=()=>WORLD?Promise.resolve(WORLD):fetch('world.svg').then(r=>{if(!r.ok)throw 0;return r.text()}).then(t=>WORLD=t.slice(t.indexOf('<svg')));
const DN=(()=>{try{return new Intl.DisplayNames(['es'],{type:'region'})}catch(_){return null}})();
const cname=c=>{try{return DN.of(c)||c}catch(_){return c}};
const CONT={'':[0,20,2000,837],NC:[90,30,640,460],SA:[520,410,280,450],EU:[905,100,360,210],AF:[930,270,360,460],AS:[1120,60,670,500],OC:[1560,480,440,330]};
function mkMap(host,opt){
 host.innerHTML=WORLD+'<div class="mname" hidden></div><div class="mz"><button type="button" data-z="1" aria-label="Acercar">＋</button><button type="button" data-z="-1" aria-label="Alejar">－</button></div>';
 const svg=host.querySelector('svg'),lab=host.querySelector('.mname'),st={vb:CONT[''].slice()},P=new Map();let d0=null,pd=0;
 const setVB=v=>{st.vb=v;svg.setAttribute('viewBox',v.join(' '))};
 const fitBox=b=>{let [x,y,w,h]=b;const r=svg.getBoundingClientRect(),ar=r.width&&r.height?r.width/r.height:1.5,cx=x+w/2,cy=y+h/2;if(w/h<ar)w=h*ar;else h=w/ar;setVB([cx-w/2,cy-h/2,w,h])};
 const zoomBy=f=>{const v=st.vb,w=Math.min(2200,Math.max(50,v[2]*f)),h=v[3]*w/v[2];setVB([v[0]+v[2]/2-w/2,v[1]+v[3]/2-h/2,w,h])};
 const sc=()=>{const r=svg.getBoundingClientRect();return Math.max(st.vb[2]/r.width,st.vb[3]/r.height)};
 const d2=()=>{const [a,b]=[...P.values()];return Math.hypot(a.x-b.x,a.y-b.y)};
 const show=c=>{const d=opt.get();lab.hidden=false;lab.textContent=cname(c)+(d.nativo.has(c)?' · 🟢 Nativo':d.invasor.has(c)?' · 🔴 Invasor':'')};
 svg.addEventListener('pointerdown',e=>{svg.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});if(P.size===1)d0={t:Date.now(),m:0};else{d0=null;pd=d2()}});
 svg.addEventListener('pointermove',e=>{const p=P.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(P.size===1){if(d0)d0.m+=Math.abs(dx)+Math.abs(dy);if(!d0||d0.m>8){const s=sc(),v=st.vb.slice();v[0]-=dx*s;v[1]-=dy*s;setVB(v)}}
  else if(P.size===2){const n=d2();if(pd)zoomBy(pd/n);pd=n}});
 svg.addEventListener('pointerup',e=>{const tap=d0&&P.size===1&&d0.m<8&&Date.now()-d0.t<500;P.delete(e.pointerId);if(P.size<2)pd=0;
  if(tap){const el=document.elementFromPoint(e.clientX,e.clientY),p=el&&el.closest&&el.closest('path[data-i]');if(p){if(opt.edit)opt.tap(p.dataset.i);show(p.dataset.i)}}
  if(!P.size)d0=null});
 svg.addEventListener('pointercancel',e=>{P.delete(e.pointerId);d0=null;pd=0});
 svg.addEventListener('wheel',e=>{e.preventDefault();zoomBy(e.deltaY>0?1.2:1/1.2)},{passive:false});
 host.querySelector('.mz').onclick=e=>{const b=e.target.closest('button');if(b)zoomBy(b.dataset.z==='1'?1/1.5:1.5)};
 fitBox(CONT['']);
 return{show,
  paint(){const d=opt.get();svg.querySelectorAll('path').forEach(p=>{const c=p.dataset.i;p.classList.toggle('n',d.nativo.has(c));p.classList.toggle('i',d.invasor.has(c))})},
  zoom:k=>fitBox(CONT[k||'']),
  fitSel(){const ps=[...svg.querySelectorAll('path.n,path.i')];if(!ps.length)return;let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;ps.forEach(p=>{const b=p.getBBox();x1=Math.min(x1,b.x);y1=Math.min(y1,b.y);x2=Math.max(x2,b.x+b.width);y2=Math.max(y2,b.y+b.height)});const mx=Math.max(25,(x2-x1)*.15),my=Math.max(25,(y2-y1)*.15);fitBox([x1-mx,y1-my,x2-x1+2*mx,y2-y1+2*my])}};
}
function setMode(m){emode=m;$('m-n').classList.toggle('on',m==='nativo');$('m-i').classList.toggle('on',m==='invasor')}
function esum(){const L=(a,e)=>a.size?'<div>'+e+' '+esc([...a].map(cname).sort().join(', '))+'</div>':'';$('m-sum').innerHTML=L(edist.nativo,'🟢')+L(edist.invasor,'🔴')||'<span class="hint">Aún sin países marcados.</span>'}
function etoggle(c){const a=edist[emode],b=edist[emode==='nativo'?'invasor':'nativo'];if(a.has(c))a.delete(c);else{a.add(c);b.delete(c)}emap.paint();esum()}
function distLoad(d){
 d=normDist(d);edist={nativo:new Set(d.nativo),invasor:new Set(d.invasor)};setMode('nativo');$('m-cont').value='';esum();
 loadWorld().then(()=>{
  if(!emap){emap=mkMap($('m-map'),{edit:1,get:()=>edist,tap:etoggle});
   const cs=[...new Set((WORLD.match(/data-i="[A-Z]{2}"/g)||[]).map(x=>x.slice(8,10)))];
   cs.forEach(c=>NM[tnorm(cname(c))]=c);$('m-dl').innerHTML=cs.map(c=>'<option value="'+esc(cname(c))+'">').join('')}
  emap.paint();emap.zoom('');
 }).catch(()=>{$('m-map').textContent='No se pudo cargar world.svg (¿está subido al repositorio?).'});
}
/* Botones del mapa del formulario (necesitan que la página ya esté cargada) */
document.addEventListener('DOMContentLoaded',()=>{
$('m-n').onclick=()=>setMode('nativo');$('m-i').onclick=()=>setMode('invasor');
$('m-cont').onchange=()=>emap&&emap.zoom($('m-cont').value);
$('m-q').onchange=e=>{const c=NM[tnorm(e.target.value)];if(c&&emap){etoggle(c);emap.show(c)}e.target.value=''};
});
const distN=sp=>sp.dist.nativo.length+sp.dist.invasor.length;
function distBlock(sp){
 if(!distN(sp))return '';const L=(a,e)=>a.length?'<p class="hint">'+e+' '+esc(a.map(cname).sort().join(', '))+'</p>':'';
 return '<details class="acc" open><summary>🌎 Distribución<small>'+distN(sp)+(distN(sp)===1?' país':' países')+'</small></summary><div class="accb"><div class="mapbox" id="fmap"></div>'+L(sp.dist.nativo,'🟢 Nativo:')+L(sp.dist.invasor,'🔴 Invasor / introducido:')+'</div></details>';
}
function wireDist(sp){if(!distN(sp))return;loadWorld().then(()=>{const h=$('fmap');if(!h||sel!==sp.id)return;const d={nativo:new Set(sp.dist.nativo),invasor:new Set(sp.dist.invasor)},m=mkMap(h,{get:()=>d});m.paint();m.fitSel()}).catch(()=>{})}
