/* ============================================================
   glosario.js · Biotaxo dex
   Términos clickeables y Wikipedia:
     GLOS, TMAP, TRX, tnorm   → el glosario y el buscador de términos en los textos
     TerminoClickeable, termHTML(txt,campo) → convierten un texto en HTML con los
                              términos del glosario como botones ⓘ
     menú contextual (📖 Wikipedia / 🖼 Imágenes) y visor (iframe de Wikipedia o
     galería de Wikimedia Commons)
     wikiUrl, wikiGo          → enlaces a Wikipedia
   Se carga ANTES del <script> principal de index.html.
   Usa $ y esc, que define el script principal, solo cuando algo ocurre
   (un clic, mostrar una ficha), nunca al cargar el archivo; los botones se
   enganchan en DOMContentLoaded. tnorm también lo usa map.js.
   (Código movido tal cual desde index.html, sin cambios de lógica.)
   ============================================================ */

/* ---------- Términos clickeables: glosario ---------- */
// formato: nombre | variantes (coma) | título/búsqueda en Wikipedia | contexto para imágenes | solo en este campo
const GLOS=`
Preocupación Menor||Preocupación menor|UICN lista roja|uicn
Casi Amenazado||Casi amenazado|UICN lista roja|uicn
Vulnerable||Vulnerable (UICN)|UICN lista roja|uicn
En Peligro Crítico||En peligro crítico|UICN lista roja|uicn
En Peligro||En peligro de extinción|UICN lista roja|uicn
Extinto en Estado Silvestre||Extinto en estado silvestre|UICN lista roja|uicn
Extinto||Extinción|UICN lista roja|uicn
Datos Insuficientes||Datos insuficientes UICN|UICN lista roja|uicn
Endémico|Endémica|Endemismo|especie endémica
Invasor|Invasora|Especie invasora|especie invasora
Exótico|Exótica|Especie introducida|especie introducida
Ecorregión||Ecorregión|ecosistema
Ponzoñoso|Ponzoñosa|Ponzoña|animal ponzoñoso
Venenoso|Venenosa|Veneno|animal venenoso
Patógeno|Patógena|Patógeno|microorganismo patógeno
Ingeniero ecosistémico|Ingeniero de ecosistemas|Ingeniero de ecosistemas|especie
Bioindicador|Bioindicadora|Bioindicador|especie bioindicadora
CITES||CITES|convención especies amenazadas
Hematófago|Hematófaga|Hematofagia|animal
Detritívoro|Detritívora|Detritívoro|animal
Frugívoro|Frugívora|Frugívoro|animal
Eusocial|Eusocialidad|Eusocialidad|insectos
Ovovivíparo|Ovoviviparidad|Ovoviviparidad|animal
Metamorfosis||Metamorfosis|animal
Cursorial||Cursorial locomoción|animal
Ecolocación|Ecolocalización|Ecolocalización|animal
Electrorrecepción|Electrorecepción|Electrorrecepción|animal
Quimiorrecepción|Quimiorreceptor|Quimiorrecepción|animal
Fitófago|Fitófaga,Fitofagia|Fitofagia|insecto herbívoro
K estratega|K-estratega|Selección r/K|estrategia reproductiva
r estratega|r-estratega|Selección r/K|estrategia reproductiva
Dimorfismo sexual||Dimorfismo sexual|animal
Heliófita|Heliófila|Planta heliófila|planta
Esciófita|Esciófila|Planta esciófila|planta
Anemófila|Anemófilo,Anemofilia|Anemofilia|polinización por viento
Entomófila|Entomófilo,Entomofilia|Entomofilia|polinización por insectos
Ornitófila|Ornitófilo,Ornitofilia|Ornitofilia|polinización por aves
Quiropterófila|Quiropterófilo,Quiropterofilia|Quiropterofilia|polinización por murciélagos
Zoocoria||Zoocoria|dispersión de semillas
Anemocoria||Anemocoria|dispersión de semillas
Hidrocoria||Hidrocoria|dispersión de semillas
Autocoria||Autocoria|dispersión de semillas
Racimo||Racimo inflorescencia|inflorescencia
Espiga||Espiga inflorescencia|inflorescencia
Panoja|Panícula|Panícula inflorescencia|inflorescencia
Umbela||Umbela inflorescencia|inflorescencia
Corimbo||Corimbo inflorescencia|inflorescencia
Capítulo||Capítulo inflorescencia|inflorescencia
Cima||Cima inflorescencia|inflorescencia
Espádice||Espádice|inflorescencia
Amento||Amento inflorescencia|inflorescencia
Pivotante||Raíz pivotante|raíz
Fasciculada||Raíz fasciculada|raíz
Adventicia||Raíz adventicia|raíz
Saprófito|Saprófita|Saprofitismo|hongo
Micorrícico|Micorrícica,Micorriza|Micorriza|hongo
Parásito|Parásita|Parasitismo|hongo
Lignícola|Lígnicola|Lignícola hongo|hongo
Humícola||Humícola hongo|hongo
Entomopatógeno||Hongo entomopatógeno|hongo
Esporada||Esporada hongos|hongo
Volva||Volva|hongo
Anillo||Anillo hongo|hongo|fu_anillo
Mixótrofo|Mixótrofa|Mixotrofia|protista
Seudópodos|Pseudópodos,Seudópodo|Seudópodo|protista
Quimioautótrofo|Quimioautótrofa|Quimioautótrofo|bacteria
Fotoautótrofo|Fotoautótrofa|Fotoautótrofo|bacteria
Endosporas|Endospora|Endospora|bacteria
Biofilms|Biofilm,Biopelícula|Biopelícula|bacteria
Termófila|Termófilo|Termófilo|extremófilo
Acidófila|Acidófilo|Acidófilo|extremófilo
Halófila|Halófilo|Halófilo|extremófilo
Tinción de Gram|Gram positiva,Gram negativa,Gram positivo,Gram negativo|Tinción de Gram|bacteria
`.trim().split('\n').map(l=>{const [n,a,w,c,o]=l.split('|');return {name:n,forms:[n].concat(a?a.split(','):[]),wiki:w||n,ctx:c||'',only:o||''}});
const tnorm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const TMAP={},TACC={a:'aáàä',e:'eéèë',i:'iíìï',o:'oóòö',u:'uúùü'};
const TRX=(()=>{
 const all=[];GLOS.forEach((g,i)=>g.forms.forEach(f=>{TMAP[tnorm(f)]=i;all.push(f)}));
 all.sort((a,b)=>b.length-a.length);
 // Cada vocal acepta su versión con o sin tilde; los espacios aceptan cualquier espacio en blanco
 const pat=f=>f.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&').replace(/[aeiouáéíóúü]/gi,c=>'['+TACC[tnorm(c)]+']').replace(/ /g,'\\s+');
 return new RegExp('(?<![\\p{L}\\p{N}])(?:'+all.map(pat).join('|')+')(?![\\p{L}\\p{N}])','giu');
})();
/* Componente reutilizable: <TerminoClickeable termino="Espádice" /> */
const TerminoClickeable=(i,label)=>'<button type="button" class="term" data-ti="'+i+'" aria-haspopup="dialog">'+esc(label==null?GLOS[i].name:label)+'</button>';
/* Detecta términos dentro de un texto (y escapa el resto). key = campo, para términos que solo aplican en uno */
function termHTML(txt,key){
 txt=String(txt==null?'':txt);let out='',last=0,m;TRX.lastIndex=0;
 while((m=TRX.exec(txt))){
  const i=TMAP[tnorm(m[0])];
  if(i===undefined||(GLOS[i].only&&GLOS[i].only!==key))continue;
  out+=esc(txt.slice(last,m.index))+TerminoClickeable(i,m[0]);last=m.index+m[0].length;
 }
 return out+esc(txt.slice(last));
}

/* ---------- Menú contextual / bottom sheet + visor ---------- */
let curT=null,imgTok=0;
let tmenu,tback,tview;   // se asignan en DOMContentLoaded (la página aún no existe al cargar este archivo)
function closeMenu(){tmenu.hidden=true;tback.hidden=true}
document.addEventListener('click',e=>{
 if(!tmenu||!tback||!tview)return;
 const b=e.target.closest&&e.target.closest('.term');if(!b)return;
 curT=GLOS[+b.dataset.ti];$('tm-t').textContent=curT.name;
 tback.hidden=false;tmenu.hidden=false;
 if(window.matchMedia('(min-width:701px)').matches){
  const r=b.getBoundingClientRect(),w=tmenu.offsetWidth,h=tmenu.offsetHeight;
  tmenu.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';
  tmenu.style.top=(r.bottom+6+h>innerHeight?Math.max(8,r.top-h-6):r.bottom+6)+'px';
 }else{tmenu.style.left=tmenu.style.top=''}
 $('tm-w').focus();
});
const enc=encodeURIComponent;
function openView(kind){
 const t=curT;if(!t)return;closeMenu();
 const ext=$('tv-ext'),body=$('tv-b'),q=t.name+(t.ctx?' '+t.ctx:'');
 $('tv-t').textContent=(kind==='w'?'Wikipedia · ':'Imágenes · ')+t.name;
 if(kind==='w'){
  const path='/w/index.php?title=Especial:Buscar&go=Ir&search='+enc(t.wiki);
  ext.href='https://es.wikipedia.org'+path;ext.textContent='↗ Abrir en el navegador';
  body.innerHTML='<iframe title="Wikipedia: '+esc(t.name)+'" src="https://es.m.wikipedia.org'+path+'" referrerpolicy="no-referrer"></iframe>';
 }else{
  ext.href='https://www.google.com/search?tbm=isch&hl=es&q='+enc(q);ext.textContent='↗ Google Imágenes';
  loadImgs(q,body);
 }
 if(!tview.open)tview.showModal();
}
async function loadImgs(q,body){
 const tok=++imgTok,msg=h=>{if(tok===imgTok)body.innerHTML='<p class="empty" style="padding:16px">'+h+'</p>'};
 msg('Buscando imágenes…');
 try{
  const u='https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=24&gsrsearch='+enc(q+' filetype:bitmap')+'&prop=imageinfo&iiprop=url&iiurlwidth=320';
  const j=await (await fetch(u)).json();
  if(tok!==imgTok)return;
  const p=Object.values((j.query&&j.query.pages)||{}).sort((a,b)=>a.index-b.index).filter(x=>x.imageinfo&&x.imageinfo[0].thumburl);
  if(!p.length)return msg('Sin resultados en Wikimedia Commons. Prueba con «Google Imágenes» (arriba a la derecha).');
  body.innerHTML='<div class="tgrid">'+p.map(x=>'<a href="'+esc(x.imageinfo[0].descriptionurl)+'" target="_blank" rel="noopener"><img loading="lazy" alt="'+esc(x.title.replace(/^(Archivo|File):/,''))+'" src="'+esc(x.imageinfo[0].thumburl)+'"></a>').join('')+'</div><p class="hint" style="padding:0 12px 14px">Imágenes de Wikimedia Commons. Para más resultados usa «Google Imágenes».</p>';
 }catch(err){msg('No se pudieron cargar las imágenes (¿sin internet?).')}
}

/* Botones del menú y del visor (necesitan que la página ya esté cargada) */
document.addEventListener('DOMContentLoaded',()=>{
 tmenu=$('tmenu');tback=$('tback');tview=$('tview');
 tback.onclick=closeMenu;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!tmenu.hidden)closeMenu()});
 $('tm-w').onclick=()=>openView('w');$('tm-i').onclick=()=>openView('i');
 $('tv-x').onclick=()=>tview.close();
 tview.addEventListener('close',()=>{imgTok++;$('tv-b').innerHTML=''});
});

/* Enlaces a Wikipedia */
const wikiUrl=n=>'https://es.wikipedia.org/wiki/'+encodeURIComponent(String(n).trim().replace(/\s+/g,'_'));
const wikiGo=n=>'https://es.wikipedia.org/w/index.php?title=Especial:Buscar&go=Ir&search='+encodeURIComponent(String(n).trim());
