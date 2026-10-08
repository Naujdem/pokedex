/* ============================================================
   ficha.js · Biotaxo dex
   Todo lo que dibuja la ficha de una especie (la vista de detalle):
     sumHTML, linHTML, valHTML, rgHTML   → resumen, clasificación y características
     galHTML, wireGal, slideHTML          → galería de fotos (y teclas ← →)
     orgTabs, wireOrg                     → pestañas Flor / Hoja / Fruto
     distBlock, wireDist                  → bloque «Distribución» con su mapa
   Se carga ANTES del <script> principal de index.html (después de glosario.js).
   Usa cosas de otros archivos (esc, $, IMG, termHTML, loadWorld, mkMap, distN,
   cname, UNIV, ESP, CAMPO, LV, LN, COL, orgTags, dlg...) solo cuando se ejecuta,
   nunca al cargar el archivo.
   «Comparar con iNaturalist» (cmpInat) NO está aquí: vive en inat.js porque
   comparte INAT, okUrl y cmpFoto con el resto de ese módulo.
   (Código movido tal cual desde index.html y map.js, sin cambios.)
   ============================================================ */

const SUMK={Animalia:['an_dieta','an_actividad','ciclo','peligro'],Plantae:['pl_habito','pl_uso','ciclo','peligro'],Fungi:['fu_comestibilidad','fu_nutricion','peligro'],Protista:['pr_nutricion','pr_locomocion','pr_rol'],Monera:['mo_morfologia','mo_efecto','mo_oxigeno']};
function sumHTML(sp){
 const r=sp.rasgos||{},u=(r.uicn||'').match(/\(([A-Z]{2})\)/),c=[];
 if(u)c.push('UICN '+u[1]);
 (SUMK[sp.reino]||[]).forEach(k=>{if(r[k])c.push(String(r[k]).split(', ').map(x=>x.replace(/\s*\(.*\)$/,'')).join(', '))});
 return c.length?'<p class="sum">'+c.map(t=>'<span>'+esc(t)+'</span>').join('')+'</p>':'';
}
/* Valor de una característica: en cuadros si es de selección múltiple, texto normal en los demás */
const SUBX={filo:['subphylum','Subphylum',2],orden:['suborden','Suborden',4]};
function linHTML(sp){
 const r=sp.rasgos||{},v={subphylum:sp.reino==='Plantae'?'':(r.subphylum||r.pl_subphylum),suborden:r.suborden||r.an_suborden};
 return LV.map((k,i)=>{const x=SUBX[k];
  return '<li style="--c:'+COL[i]+'"><span>'+LN[i]+'</span> '+esc(sp[k])+'</li>'+(x&&v[x[0]]?'<li style="--c:'+COL[x[2]]+'"><span>'+x[1]+'</span> '+esc(v[x[0]])+'</li>':'');
 }).join('');
}
function valHTML(f,v){
 if(f.t!=='m')return termHTML(v,f.key);
 const sel=[],rest=[];
 String(v).split(', ').forEach(t=>{const n=(f.al&&f.al[t])||t,i=f.items.find(x=>x[1]===n);if(i){if(!sel.includes(i))sel.push(i)}else rest.push(t)});
 return (sel.length?'<div class="vchips">'+sel.map(i=>'<div class="vchip"><span class="ci" aria-hidden="true">'+i[0]+'</span><span>'+termHTML(i[1],f.key)+'</span></div>').join('')+'</div>':'')
  +(rest.length?'<div class="vo">'+(sel.length?'✏️ ':'')+termHTML(rest.join(', '),f.key)+'</div>':'');
}
function rgHTML(sp){
 const r=sp.rasgos||{},W=window.matchMedia,max=!W('(min-width:701px)').matches?1:W('(min-width:1100px)').matches?3:2;
 const li=fs=>fs.filter(f=>r[f.key]).map(f=>'<li><b>'+esc(f.lab?f.lab(r):f.label)+'</b>'+valHTML(f,r[f.key])+'</li>').join('');
 const DIA=['diagnosticas','similares'],FUN=['curiosos','fuentes'];
 const pick=(a,inc)=>a.filter(f=>inc?DIA.concat(FUN).includes(f.key)===false:true);
 const secs=[
  ['Características generales',li(UNIV.filter(f=>!DIA.concat(FUN).includes(f.key)))],
  ['Características diagnósticas',li(UNIV.filter(f=>DIA.includes(f.key)))],
  [TIT[sp.reino]||('Características · '+sp.reino),li((ESP[sp.reino]||[]).concat(sp.reino==='Plantae'?[LEGP]:[]))],
  ['Datos de campo',li(CAMPO)],
  ['💡 Datos curiosos y notas',li(UNIV.filter(f=>FUN.includes(f.key)))+(sp.car?'<li><b>Notas</b>'+esc(sp.car)+'</li>':''),'fun']
 ];
 let n=0;
 const acc=(t,h,c)=>{if(!h)return '';const o=n++<max;return '<details class="acc '+(c||'')+'"'+(o?' open':'')+'><summary>'+esc(t)+'<small>'+h.match(/<li>/g).length+'</small></summary><div class="accb"><ul class="rg">'+h+'</ul></div></details>'};
 const cl='<details class="acc mobonly"><summary>Clasificación taxonómica<small>8 niveles</small></summary><div class="accb"><ol class="lin">'+linHTML(sp)+'</ol></div></details>';
 const body=secs.map(x=>acc(x[0],x[1],x[2])).join('');
 return cl+(body||'<p class="empty">Aún no hay características. Toca «Editar ficha» para añadirlas.</p>');
}

function galHTML(sp){
 const list=sp.fotos||(sp.foto?[sp.foto]:[]),n=list.length,tg=orgTags(sp).slice(0,n).some(Boolean);
 const slides=n?list.map((s,i)=>slideHTML(sp,s,i)).join(''):'<div class="slide"><span aria-hidden="true">'+(EMO[sp.reino]||'🧬')+'</span></div>';
 return '<div class="galw'+(sp.fotos===undefined?' ld':'')+'">'+'<div class="gal" id="gal">'+slides+'</div>'
  +(n>1?'<button class="gnav prev" id="gprev" aria-label="Foto anterior">‹</button><button class="gnav next" id="gnext" aria-label="Foto siguiente">›</button>'+(tg?'':'<span class="gcount" id="gcount">1 / '+n+'</span>'):'')+'</div>';
}
const SM=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth';
function wireGal(){
 const g=$('gal');if(!g)return;
 const n=()=>[...g.children].filter(c=>!c.hidden).length;
 g.addEventListener('scroll',()=>{const c=$('gcount');if(c&&g.clientWidth)c.textContent=(Math.round(g.scrollLeft/g.clientWidth)+1)+' / '+n()});
 const by=s=>g.scrollBy({left:s*g.clientWidth,behavior:SM()});
 if($('gprev'))$('gprev').onclick=()=>by(-1);
 if($('gnext'))$('gnext').onclick=()=>by(1);
}
document.addEventListener('keydown',e=>{
 if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
 if(dlg.hasAttribute('open')||dlgdel.hasAttribute('open'))return;
 if(/^(INPUT|TEXTAREA|SELECT)$/.test((e.target&&e.target.tagName)||''))return;
 const g=$('gal');if(!g||$('detail').hidden)return;
 g.scrollBy({left:(e.key==='ArrowRight'?1:-1)*g.clientWidth,behavior:SM()});
});

// Galería de la ficha: etiqueta sobre la foto + pestañas para filtrar
function slideHTML(sp,s,i){
 const t=orgTags(sp)[i],c=credTags(sp)[i];
 return '<div class="slide"'+(t?' data-o="'+esc(t)+'"':'')+'>'+IMG(s)+(t?'<span class="otag">'+(ORG_IC[t]||'')+' '+esc(t)+'</span>':'')
  +(c?'<span class="ocr" style="position:absolute;left:8px;bottom:8px;max-width:calc(100% - 16px);font-size:.7rem;line-height:1.3;color:#fff;background:rgba(0,0,0,.62);padding:2px 8px;border-radius:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">📷 '+esc(c)+'</span>':'')+'</div>';
}
function orgTabs(sp,list){
 const n={};orgTags(sp).slice(0,list.length).forEach(t=>{if(t)n[t]=(n[t]||0)+1});
 if(!Object.keys(n).length)return '';
 return '<div class="otabs" id="otabs"><button type="button" class="on" data-o="">Todas · '+list.length+'</button>'
  +ORG.filter(o=>n[o[0]]).map(o=>'<button type="button" data-o="'+o[0]+'">'+o[1]+' '+o[0]+' · '+n[o[0]]+'</button>').join('')+'</div>';
}
function wireOrg(){
 const bar=$('otabs'),g=$('gal');if(!bar||!g)return;
 bar.onclick=e=>{
  const b=e.target.closest('button[data-o]');if(!b)return;
  const o=b.dataset.o;
  bar.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
  [...g.children].forEach(sl=>{sl.hidden=!!o&&sl.dataset.o!==o});
  g.scrollLeft=0;
  const v=[...g.children].filter(c=>!c.hidden).length,c=$('gcount');
  if(c)c.textContent='1 / '+v;
  ['gprev','gnext','gcount'].forEach(id=>{const x=$(id);if(x)x.hidden=v<2});
 };
}

/* Distribución en la ficha (usa loadWorld, mkMap y distN de map.js) */
function distBlock(sp){
 if(!distN(sp))return '';const L=(a,e)=>a.length?'<p class="hint">'+e+' '+esc(a.map(cname).sort().join(', '))+'</p>':'';
 return '<details class="acc" open><summary>🌎 Distribución<small>'+distN(sp)+(distN(sp)===1?' país':' países')+'</small></summary><div class="accb"><div class="mapbox" id="fmap"></div>'+L(sp.dist.nativo,'🟢 Nativo:')+L(sp.dist.invasor,'🔴 Invasor / introducido:')+'</div></details>';
}
function wireDist(sp){if(!distN(sp))return;loadWorld().then(()=>{const h=$('fmap');if(!h||sel!==sp.id)return;const d={nativo:new Set(sp.dist.nativo),invasor:new Set(sp.dist.invasor)},m=mkMap(h,{get:()=>d});m.paint();m.fitSel()}).catch(()=>{})}
