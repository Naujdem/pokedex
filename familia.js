/* ============================================================
   familia.js · Biotaxo dex
   «👪 Comparar familia»: desde la ficha de una especie se abre una
   ventana con (1) tus especies de la misma familia, agrupadas por
   género y con su foto, para compararlas; tocar una abre su ficha, y
   (2) bajo demanda, los géneros que GBIF registra para esa familia
   (necesita internet), marcando los que ya tienes.
   Usa data, path, sel, chainFor, render, photo, sci y esc, que viven
   en otros archivos y solo se llaman al ejecutar.
   Se carga ANTES del <script> principal de index.html.
   ============================================================ */
let famSp=null,famSeq=0,famGen=[],famCache={};
function famNorm(x){return String(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').trim().toLowerCase()}
function famMias(sp){
 const k=famNorm(sp&&sp.familia);
 return k?data.filter(s=>famNorm(s.familia)===k):[];
}
function famCardHTML(s,actual){
 return '<button type="button" class="famc'+(actual?' act':'')+'" data-fid="'+esc(s.id)+'">'
  +'<span class="famph">'+photo(s.foto,s.reino)+'</span>'
  +'<span class="famnm">'+esc(s.comun||sci(s))+'</span>'
  +'<span class="famsc">'+esc(sci(s))+(actual?' · esta':'')+'</span></button>';
}
function famMiasHTML(sp){
 const L=famMias(sp);
 const g={};L.forEach(s=>{const k=(s.genero||'').trim()||'(sin género)';(g[k]=g[k]||[]).push(s)});
 const ks=Object.keys(g).sort((a,b)=>a.localeCompare(b,'es'));
 famGen=ks.filter(k=>k!=='(sin género)').map(famNorm);
 return '<p class="hint">'+L.length+(L.length===1?' especie tuya':' especies tuyas')+' en esta familia, en '+ks.length+(ks.length===1?' género':' géneros')+'.'
  +(L.length<2?' Cuando registres más de esta familia, aparecerán aquí para compararlas.':' Toca una para abrir su ficha.')+'</p>'
  +ks.map(k=>'<section class="famg"><h4>'+esc(k)+' <small>'+g[k].length+'</small></h4><div class="famgrid">'
   +g[k].sort((a,b)=>sci(a).localeCompare(sci(b),'es')).map(s=>famCardHTML(s,s.id===sp.id)).join('')+'</div></section>').join('');
}
function abrirFam(sp){
 const d=document.getElementById('dlgfam'),b=document.getElementById('fambody');
 if(!d||!b||!sp||!sp.familia)return;
 famSp=sp;famSeq++;
 document.getElementById('famtit').textContent='👪 Familia '+String(sp.familia).trim();
 b.innerHTML=famMiasHTML(sp);
 const g=document.getElementById('famgbif');
 if(g)g.innerHTML='<button type="button" id="famgb">🌍 Ver los géneros de esta familia (GBIF)</button><div id="famgres" role="status"></div>';
 d.showModal();
}
async function famGbif(){
 const o=document.getElementById('famgres'),sp=famSp;
 if(!o||!sp)return;
 const fam=String(sp.familia).trim(),my=++famSeq,k=famNorm(fam);
 if(famCache[k]){famGenerosHTML(o,fam,famCache[k]);return}
 o.textContent='Consultando GBIF…';
 try{
  const m=await (await fetch('https://api.gbif.org/v1/species/match?name='+encodeURIComponent(fam)+'&rank=family')).json();
  if(my!==famSeq)return;
  const key=m.acceptedUsageKey||m.usageKey;
  if(!key||m.rank!=='FAMILY'){o.textContent='GBIF no reconoce «'+fam+'» como familia. Revisa cómo la escribiste en la ficha.';return}
  const gen=[];let off=0,fin=false;
  while(!fin&&off<3000){
   const r=await (await fetch('https://api.gbif.org/v1/species/'+key+'/children?limit=1000&offset='+off)).json();
   if(my!==famSeq)return;
   (r.results||[]).forEach(x=>{if(x.rank==='GENUS'&&x.canonicalName)gen.push(x.canonicalName)});
   fin=!!r.endOfRecords||!(r.results||[]).length;off+=1000;
  }
  const u=[...new Set(gen)].sort((a,b)=>a.localeCompare(b,'es'));
  const res={nombre:m.canonicalName||fam,sin:m.synonym?fam:'',lista:u,corto:!fin};
  famCache[k]=res;
  famGenerosHTML(o,fam,res);
 }catch(_){if(my===famSeq)o.textContent='No pude consultar GBIF (¿sin internet?). Tus especies de arriba sí están disponibles sin conexión.'}
}
function famGenerosHTML(o,fam,res){
 if(!res.lista.length){o.innerHTML='<p class="hint">GBIF no lista géneros directamente bajo «'+esc(res.nombre)+'» (en algunas familias están agrupados en subfamilias o tribus).</p>';return}
 o.innerHTML='<p class="hint">GBIF registra <b>'+res.lista.length+(res.corto?'+':'')+'</b> géneros en <b>'+esc(res.nombre)+'</b>'+(res.sin?' (nombre aceptado de «'+esc(res.sin)+'»)':'')+'. Los marcados con ✓ ya los tienes.'+(res.corto?' Se muestran los primeros 3000.':'')+'</p>'
  +'<input type="search" id="famq" placeholder="Buscar género…" aria-label="Buscar género" autocomplete="off">'
  +'<ul id="famlist"></ul>';
 famPintar(res);
}
function famPintar(res){
 const q=famNorm((document.getElementById('famq')||{}).value),u=document.getElementById('famlist');
 if(!u)return;
 const tengo=new Set(famGen);
 const L=res.lista.filter(n=>!q||famNorm(n).includes(q));
 u.innerHTML=L.length?L.map(n=>'<li class="'+(tengo.has(famNorm(n))?'tengo':'')+'">'+(tengo.has(famNorm(n))?'✓ ':'')+'<i>'+esc(n)+'</i></li>').join(''):'<li class="vacio">Ningún género coincide.</li>';
}
document.addEventListener('DOMContentLoaded',()=>{
 const d=document.getElementById('dlgfam');
 if(!d)return;
 const x=document.getElementById('famx');
 if(x)x.onclick=()=>d.close();
 d.addEventListener('click',e=>{
  if(e.target.id==='famgb'){famGbif();return}
  const c=e.target.closest&&e.target.closest('[data-fid]');
  if(c&&d.contains(c)){
   const s=data.find(z=>String(z.id)===c.dataset.fid);
   if(!s)return;
   d.close();
   sel=s.id;path=chainFor(s);render();
  }
 });
 d.addEventListener('input',e=>{
  if(e.target.id!=='famq')return;
  const k=famNorm(famSp&&famSp.familia);
  if(famCache[k])famPintar(famCache[k]);
 });
});
