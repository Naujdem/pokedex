/* ============================================================
   flor.js · Biotaxo dex
   «🌸 Diagrama de la flor»: esquema de una flor completa (corte
   longitudinal) con sus partes rotuladas en español. Se abre desde
   el botón de la ficha de las especies del reino Plantae.
   Paso 2: al tocar una parte (en el dibujo, en su rótulo o en los
   botones de abajo) se resalta y aparece qué es y cómo reconocerla.
   Paso 3: si la especie tiene una foto etiquetada como 🌸 Flor, se
   muestra junto al esquema para compararlas (si tiene varias, se elige
   con las miniaturas). Usa orgTags/credTags, IMG, esc y ensureFotos,
   que viven en otros archivos y solo se llaman al ejecutar.
   El dibujo es original (SVG propio): no depende de internet ni de
   ninguna licencia externa. Cada parte lleva data-p="…".
   Se carga ANTES del <script> principal de index.html.
   ============================================================ */

const FLOR_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 168 520 302" role="img" aria-label="Corte longitudinal de una flor con sus partes"><g class="fl-f" transform="translate(60,0)" stroke-linejoin="round" stroke-linecap="round"><g data-p="pedunculo"><rect x="192" y="380" width="16" height="84" rx="3" fill="#8fbf6a" stroke="#3d6b2e" stroke-width="2"/></g><g data-p="receptaculo"><path d="M166 358 C170 384 190 396 200 396 C210 396 230 384 234 358 Q200 368 166 358 Z" fill="#b5d58a" stroke="#3d6b2e" stroke-width="2"/></g><g data-p="petalo" fill="#f7b2c9" stroke="#b24d78" stroke-width="2"><path d="M184 354 C146 336 102 290 98 232 C98 214 116 212 126 230 C148 266 178 304 194 342 Z"/><path d="M216 354 C254 336 298 290 302 232 C302 214 284 212 274 230 C252 266 222 304 206 342 Z"/></g><g data-p="sepalo" fill="#7fb069" stroke="#3d6b2e" stroke-width="2"><path d="M178 362 C150 372 120 362 104 334 C138 330 166 344 184 356 Z"/><path d="M222 362 C250 372 280 362 296 334 C262 330 234 344 216 356 Z"/></g><g data-p="filamento" fill="none" stroke="#c8a93a" stroke-width="5"><path d="M190 352 C184 320 172 280 164 252"/><path d="M210 352 C216 320 228 280 236 252"/></g><g data-p="antera" fill="#f4c542" stroke="#9a7b0c" stroke-width="2"><ellipse cx="163" cy="238" rx="9" ry="17" transform="rotate(-8 163 238)"/><ellipse cx="237" cy="238" rx="9" ry="17" transform="rotate(8 237 238)"/></g><g data-p="estilo"><rect x="195" y="212" width="10" height="90" fill="#b9d98a" stroke="#55822f" stroke-width="2"/></g><g data-p="ovario"><ellipse cx="200" cy="326" rx="24" ry="32" fill="#cfe6a0" stroke="#55822f" stroke-width="2"/></g><g data-p="ovulo" fill="#fff0a8" stroke="#a68b1d" stroke-width="1.6"><circle cx="192" cy="316" r="6"/><circle cx="208" cy="316" r="6"/><circle cx="200" cy="338" r="6"/></g><g data-p="estigma"><path d="M184 214 C182 194 218 194 216 214 C210 221 190 221 184 214 Z" fill="#e8806a" stroke="#963e2a" stroke-width="2"/></g></g><g class="fl-r"><g data-p="petalo"><text class="fl-t" x="10" y="244">Pétalo<tspan class="fl-s" x="10" dy="15">corola</tspan></text><path class="fl-l" d="M62 240 L190 268"/><circle class="fl-d" cx="190" cy="268" r="3"/></g><g data-p="estilo"><text class="fl-t" x="10" y="290">Estilo<tspan class="fl-s" x="10" dy="15">pistilo</tspan></text><path class="fl-l" d="M52 286 L255 262"/><circle class="fl-d" cx="255" cy="262" r="3"/></g><g data-p="ovario"><text class="fl-t" x="10" y="336">Ovario<tspan class="fl-s" x="10" dy="15">pistilo</tspan></text><path class="fl-l" d="M60 332 L238 326"/><circle class="fl-d" cx="238" cy="326" r="3"/></g><g data-p="sepalo"><text class="fl-t" x="10" y="384">Sépalo<tspan class="fl-s" x="10" dy="15">cáliz</tspan></text><path class="fl-l" d="M62 380 L198 352"/><circle class="fl-d" cx="198" cy="352" r="3"/></g><g data-p="pedunculo"><text class="fl-t" x="10" y="440">Pedúnculo</text><path class="fl-l" d="M86 436 L252 430"/><circle class="fl-d" cx="252" cy="430" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="estigma"><text class="fl-t" x="510" y="190">Estigma<tspan class="fl-s" x="510" dy="15">pistilo</tspan></text><path class="fl-l" d="M446 186 L272 207"/><circle class="fl-d" cx="272" cy="207" r="3"/></g><g data-p="antera"><text class="fl-t" x="510" y="236">Antera<tspan class="fl-s" x="510" dy="15">estambre</tspan></text><path class="fl-l" d="M452 232 L306 238"/><circle class="fl-d" cx="306" cy="238" r="3"/></g><g data-p="filamento"><text class="fl-t" x="510" y="292">Filamento<tspan class="fl-s" x="510" dy="15">estambre</tspan></text><path class="fl-l" d="M424 288 L286 296"/><circle class="fl-d" cx="286" cy="296" r="3"/></g><g data-p="ovulo"><text class="fl-t" x="510" y="338">Óvulo<tspan class="fl-s" x="510" dy="15">dentro del ovario</tspan></text><path class="fl-l" d="M452 334 L272 318"/><circle class="fl-d" cx="272" cy="318" r="3"/></g><g data-p="receptaculo"><text class="fl-t" x="510" y="400">Receptáculo</text><path class="fl-l" d="M410 396 L284 381"/><circle class="fl-d" cx="284" cy="381" r="3"/></g></g></svg>`;

/* Las 10 partes: nombre · grupo al que pertenece · qué es · cómo reconocerla en el campo */
const FLOR_PARTES={
 estigma:{n:'Estigma',g:'pistilo · gineceo (parte femenina)',
  d:'Extremo superior del pistilo. Es la superficie que recibe el polen: allí se pega y germina el grano de polen.',
  c:'Suele verse más grueso que el estilo, y puede ser pegajoso, plumoso o lobulado para atrapar polen.'},
 estilo:{n:'Estilo',g:'pistilo · gineceo (parte femenina)',
  d:'Columna o tubito que une el estigma con el ovario. Por dentro baja el tubo polínico hasta los óvulos.',
  c:'Puede ser largo, corto o faltar del todo (entonces el estigma queda pegado al ovario).'},
 ovario:{n:'Ovario',g:'pistilo · gineceo (parte femenina)',
  d:'Base ensanchada del pistilo que guarda los óvulos. Después de la fecundación se convierte en el fruto.',
  c:'Aquí es súpero: queda por encima de donde se insertan sépalos, pétalos y estambres. Si queda por debajo se llama ínfero.'},
 ovulo:{n:'Óvulo',g:'pistilo · gineceo (parte femenina)',
  d:'Estructura dentro del ovario que contiene la célula sexual femenina. Tras la fecundación se convierte en semilla.',
  c:'Un ovario puede tener un solo óvulo o muchos; cada semilla del fruto viene de un óvulo.'},
 antera:{n:'Antera',g:'estambre · androceo (parte masculina)',
  d:'Parte superior del estambre, donde se forma y se guarda el polen. Al madurar se abre y lo libera.',
  c:'Suele verse amarilla o anaranjada y, al tocarla, deja un polvillo en los dedos.'},
 filamento:{n:'Filamento',g:'estambre · androceo (parte masculina)',
  d:'Tallito delgado que sostiene la antera y la coloca donde el polen pueda salir o ser recogido.',
  c:'Puede ser largo o corto, y a veces está pegado a los pétalos o unido a otros estambres.'},
 petalo:{n:'Pétalo',g:'corola · perianto (atrae polinizadores)',
  d:'Pieza interna del perianto. Todos los pétalos juntos forman la corola, que suele ser colorida o aromática para atraer polinizadores.',
  c:'Si sépalos y pétalos se ven iguales (como en muchos lirios y orquídeas), a esas piezas se les llama tépalos.'},
 sepalo:{n:'Sépalo',g:'cáliz · perianto (protege)',
  d:'Pieza externa del perianto. Todos los sépalos juntos forman el cáliz, que protege el botón floral antes de abrirse.',
  c:'Suelen ser verdes y más firmes que los pétalos; en el botón cerrado quedan por fuera.'},
 receptaculo:{n:'Receptáculo',g:'soporte de la flor',
  d:'Extremo ensanchado del pedúnculo donde se insertan todas las demás piezas de la flor.',
  c:'Está justo debajo de sépalos y pétalos. En la fresa crece y forma la parte carnosa que comemos.'},
 pedunculo:{n:'Pedúnculo',g:'soporte de la flor',
  d:'Tallito que sostiene la flor y la une al resto de la planta.',
  c:'Si las flores nacen juntas en una inflorescencia, el tallito de cada flor se llama pedicelo y el del conjunto, pedúnculo.'}
};
/* Orden de los botones: de arriba hacia abajo en el dibujo */
const FLOR_ORDEN=['estigma','estilo','ovario','ovulo','antera','filamento','petalo','sepalo','receptaculo','pedunculo'];

/* Resalta una parte (y su rótulo) y muestra su explicación. Tocarla otra vez la deselecciona. */
function florSel(id){
 const b=document.getElementById('flbox'),s=b&&b.querySelector('svg');
 if(!s)return;
 if(id&&s.dataset.sel===id)id='';
 s.dataset.sel=id||'';
 s.classList.toggle('fl-has',!!id);
 s.querySelectorAll('[data-p]').forEach(e=>e.classList.toggle('fl-sel',!!id&&e.dataset.p===id));
 document.querySelectorAll('#flchips button').forEach(c=>c.classList.toggle('on',!!id&&c.dataset.p===id));
 const p=id&&FLOR_PARTES[id],c=document.getElementById('fldef');
 if(c)c.innerHTML=p
  ?'<h3>'+p.n+'<small>'+p.g+'</small></h3><p>'+p.d+'</p><p class="hint">'+p.c+'</p>'
  :'<p class="hint">Toca una parte del esquema, o uno de los botones, para ver qué es y cómo reconocerla.</p>';
}
function abrirFlor(sp){
 const d=document.getElementById('dlgflor'),b=document.getElementById('flbox');
 if(!d||!b)return;
 if(!b.firstChild){   // se dibuja una sola vez
  b.innerHTML=FLOR_SVG;
  const ch=document.getElementById('flchips');
  if(ch)ch.innerHTML=FLOR_ORDEN.map(k=>'<button type="button" data-p="'+k+'">'+FLOR_PARTES[k].n+'</button>').join('');
 }
 florSel('');
 florSp=sp&&sp.id;
 florFormula(sp);
 florFoto(sp);   // no se espera: el esquema se ve de inmediato y la foto aparece cuando esté lista
 d.showModal();
}

/* --- Paso 3: foto de Flor de la especie junto al esquema --- */
let florSp=null,florFotos=[];
function florFotoHTML(i){
 const f=florFotos[i];
 return '<div class="flph">'+IMG(f.ref)+'</div>'
  +(florFotos.length>1?'<div class="flthumbs">'+florFotos.map((g,k)=>'<button type="button" data-fi="'+k+'" class="'+(k===i?'on':'')+'" aria-label="Foto de flor '+(k+1)+'">'+IMG(g.ref)+'</button>').join('')+'</div>':'')
  +'<p class="flcred">🌸 Tu foto de la flor'+(f.cred?' · 📷 '+esc(f.cred):'')+'</p>';
}
function florElegir(i){
 const box=document.getElementById('flfoto');
 if(!box||!florFotos[i])return;
 box.innerHTML=florFotoHTML(i);
}
async function florFoto(sp){
 const box=document.getElementById('flfoto'),cmp=document.getElementById('flcmp');
 if(!box||!cmp)return;
 box.hidden=true;box.innerHTML='';cmp.classList.remove('con-foto');florFotos=[];   // limpia lo de la especie anterior
 if(!sp)return;
 let list=sp.fotos;
 if(!list){try{list=await ensureFotos(sp)}catch(_){list=[]}}
 if(florSp!==sp.id)return;   // mientras tanto se cerró o se abrió otra especie
 const t=orgTags(sp),c=credTags(sp);
 florFotos=(list||[]).map((r,i)=>({ref:r,cred:c[i]||'',tag:t[i]})).filter(x=>x.tag==='Flor');
 box.hidden=false;
 if(florFotos.length){cmp.classList.add('con-foto');florElegir(0)}
 else box.innerHTML='<p class="flnote">📷 Esta especie aún no tiene una foto etiquetada como 🌸 Flor. En «Editar ficha» puedes marcar una de tus fotos como Flor (botón «＋ Tipo») o traer una de iNaturalist, y así podrás compararla aquí con el esquema.</p>';
}

/* --- Paso 4: fórmula floral típica de la familia de la especie ---
   Notación: ✱ simétrica radial · ↓ bilateral · K cáliz · C corola · P perianto (tépalos) · A estambres · G carpelos.
   ( ) = piezas soldadas · a+b = dos verticilos · ∞ = muchos · G subrayado = ovario súpero · G con raya arriba = ínfero.
   Son fórmulas TÍPICAS de la familia (hay géneros que se salen); contrástalas con tu libro. */
const FLOR_FAM=[
 {n:'Fabaceae',a:['leguminosae'],f:[{s:'↓',K:'(5)',C:'5',A:'(9)+1',G:'1',o:'s'}],t:'Leguminosas. Corola papilionada (estandarte, alas y quilla) en Faboideae; el fruto es una legumbre. En Mimosoideae las flores son pequeñas, radiales y de estambres largos y numerosos.'},
 {n:'Asteraceae',a:['compositae'],f:[{l:'flor del disco',s:'✱',K:'0 (vilano)',C:'(5)',A:'(5)',G:'(2)',o:'i'},{l:'flor del rayo',s:'↓',K:'0 (vilano)',C:'(5) lígula',A:'0',G:'(2)',o:'i'}],t:'Las «flores» que ves son capítulos: muchas florecillas juntas rodeadas de brácteas. Anteras soldadas en tubo (sinanteria); el fruto es una cipsela.'},
 {n:'Poaceae',a:['gramineae'],f:[{s:'',P:'2 (lodículas)',A:'3',G:'(2-3)',o:'s'}],t:'Gramíneas. Flores diminutas dentro de glumas, lemas y páleas, agrupadas en espiguillas. Polinización por viento; el fruto es una cariopsis.'},
 {n:'Solanaceae',f:[{s:'✱',K:'(5)',C:'(5)',A:'5',G:'(2)',o:'s'}],t:'Corola rotácea o campanulada; estambres pegados al tubo de la corola. Fruto en baya o cápsula.'},
 {n:'Brassicaceae',a:['cruciferae'],f:[{s:'✱',K:'4',C:'4',A:'2+4',G:'(2)',o:'s'}],t:'Cuatro pétalos en cruz y seis estambres (2 cortos y 4 largos: tetradínamos). Fruto en silicua o silícula.'},
 {n:'Rosaceae',f:[{s:'✱',K:'5',C:'5',A:'∞',G:'1–∞',o:'v'}],t:'Hipanto (copa floral) bien marcado. El ovario es súpero en la mayoría (rosas, fresas), pero ínfero en manzana y pera. Muy variable en carpelos.'},
 {n:'Lamiaceae',a:['labiatae'],f:[{s:'↓',K:'(5)',C:'(5) bilabiada',A:'2+2',G:'(2)',o:'s'}],t:'Tallo cuadrangular, hojas opuestas y aromáticas. Corola con dos labios; 4 estambres de dos largos y dos cortos (didínamos). Fruto en tetranúcula.'},
 {n:'Apiaceae',a:['umbelliferae'],f:[{s:'✱',K:'5 (muy reducido)',C:'5',A:'5',G:'(2)',o:'i'}],t:'Flores pequeñas agrupadas en umbelas (a menudo compuestas). Fruto seco que se divide en dos mericarpos.'},
 {n:'Orchidaceae',f:[{s:'↓',P:'3+3 (uno es el labelo)',A:'1',G:'(3)',o:'i'}],t:'Estambres y estilo fundidos en la columna. El pétalo central se vuelve el labelo. Polen en masas (polinias); semillas diminutas.'},
 {n:'Liliaceae',f:[{s:'✱',P:'3+3',A:'3+3',G:'(3)',o:'s'}],t:'Flores con seis tépalos parecidos entre sí. Varias familias antes incluidas aquí (cebolla, agave, jacinto) hoy están separadas.'},
 {n:'Arecaceae',a:['palmae'],f:[{s:'✱',P:'3+3',A:'3+3',G:'(3) o 3',o:'s'}],t:'Palmas. Flores pequeñas, a menudo unisexuales, en inflorescencias grandes protegidas por una espata.'},
 {n:'Araceae',f:[{s:'✱',P:'0–4',A:'1–6',G:'(1–∞)',o:'s'}],t:'Muy variable. Las flores minúsculas van sobre una espiga gruesa (espádice) rodeada de una espata, que es lo que parece «la flor». Pueden ser bisexuales o unisexuales según el género.'},
 {n:'Cucurbitaceae',f:[{l:'♂',s:'✱',K:'(5)',C:'(5)',A:'(3)',G:'0'},{l:'♀',s:'✱',K:'(5)',C:'(5)',A:'0',G:'(3)',o:'i'}],t:'Flores unisexuales (en la misma planta o en plantas distintas). Zarcillos; el fruto es un pepónide.'},
 {n:'Malvaceae',f:[{s:'✱',K:'(5)',C:'5',A:'(∞)',G:'(5–∞)',o:'s'}],t:'Estambres soldados en un tubo alrededor del estilo (androceo monadelfo). Suelen tener un calículo (brácteas bajo el cáliz).'},
 {n:'Euphorbiaceae',f:[{l:'♂',s:'✱',P:'0–5',A:'1–∞',G:'0'},{l:'♀',s:'✱',P:'0–5',A:'0',G:'(3)',o:'s'}],t:'Flores unisexuales. En Euphorbia van reunidas en un ciatio (una falsa flor). Muchas tienen látex.'},
 {n:'Rubiaceae',f:[{s:'✱',K:'(4–5)',C:'(4–5)',A:'4–5',G:'(2)',o:'i'}],t:'Hojas opuestas con estípulas entre los pecíolos. Corola tubular; estambres pegados a ella. Incluye al café.'},
 {n:'Myrtaceae',f:[{s:'✱',K:'4–5',C:'4–5',A:'∞',G:'(2–5)',o:'i'}],t:'Estambres numerosos y vistosos, hojas con glándulas de aceite (puntos translúcidos). Guayaba, eucalipto, clavo.'},
 {n:'Melastomataceae',f:[{s:'✱',K:'(4–5)',C:'4–5',A:'8–10',G:'(3–5)',o:'v'}],t:'Hojas con 3–7 nervios que corren paralelos de la base a la punta. Anteras con apéndices y poro apical; ovario ínfero o semiínfero.'},
 {n:'Convolvulaceae',f:[{s:'✱',K:'5',C:'(5)',A:'5',G:'(2)',o:'s'}],t:'Corola en embudo, plegada en el botón. Muchas son trepadoras volubles (batata, bejuco de la mañana).'},
 {n:'Zingiberaceae',f:[{s:'↓',K:'(3)',C:'(3)',A:'1 (+ staminodios)',G:'(3)',o:'i'}],t:'Solo un estambre fértil; los demás se vuelven pétalos vistosos (labelo). Rizomas aromáticos: jengibre, cúrcuma, cardamomo.'},
 {n:'Bromeliaceae',f:[{s:'✱',K:'3',C:'3',A:'3+3',G:'(3)',o:'v'}],t:'Rosetas de hojas que acumulan agua. Ovario súpero en unas y ínfero en otras (la piña es una infrutescencia).'}
];
function florNorm(x){return String(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').trim().toLowerCase()}
function florBuscarFam(nombre){
 const k=florNorm(nombre);
 if(!k)return null;
 return FLOR_FAM.find(e=>florNorm(e.n)===k||(e.a||[]).includes(k))||null;
}
function florFormulaHTML(f){
 const g=f.G==null?'':(f.o==='s'?'<u>G</u>':f.o==='i'?'<span class="ov">G</span>':'G')+esc(f.G);
 const parts=[f.s,f.P!=null?'P'+f.P:'K'+f.K+' C'+f.C,'A'+f.A].filter(Boolean).map(esc);
 if(g)parts.push(g);
 return (f.l?'<span class="fllb">'+esc(f.l)+'</span>':'')+'<code>'+parts.join(' ')+'</code>';
}
function florFormula(sp){
 const box=document.getElementById('flform');
 if(!box)return;
 const fam=sp&&sp.familia&&String(sp.familia).trim(),e=fam&&florBuscarFam(fam);
 const clave='<details class="flkey"><summary>¿Cómo se lee una fórmula floral?</summary><p><b>✱</b> simetría radial (actinomorfa) · <b>↓</b> bilateral (cigomorfa)<br><b>K</b> cáliz (sépalos) · <b>C</b> corola (pétalos) · <b>P</b> perianto, cuando sépalos y pétalos se parecen (tépalos)<br><b>A</b> androceo (estambres) · <b>G</b> gineceo (carpelos)<br>Los números son cuántas piezas hay; <b>( )</b> significa piezas soldadas entre sí; <b>2+4</b> son dos verticilos; <b>∞</b> muchas; <b>0</b> ausente.<br>El ovario <b>súpero</b> (por encima de las demás piezas) se marca con la <u>G</u> subrayada; el <b>ínfero</b>, con una raya encima: <span class="ov">G</span>.</p></details>';
 if(!fam){box.innerHTML='';return}
 if(!e){box.innerHTML='<div class="flfm"><h3>🧬 Fórmula floral · '+esc(fam)+'</h3><p class="hint">Todavía no tengo la fórmula típica de esta familia. Búscala en tu libro y compárala con el esquema y con tu foto.</p>'+clave+'</div>';return}
 const ov=e.f.some(f=>f.o==='v')?'<p class="hint">El tipo de ovario varía dentro de la familia.</p>':'';
 box.innerHTML='<div class="flfm"><h3>🧬 Fórmula floral típica · '+esc(e.n)+(florNorm(fam)!==florNorm(e.n)?' <small>(en tu ficha: '+esc(fam)+')</small>':'')+'</h3>'
  +e.f.map(florFormulaHTML).join('')+'<p>'+esc(e.t)+'</p>'+ov+'<p class="hint">Es la fórmula típica de la familia; algunos géneros se salen. Contrástala con tu libro.</p>'+clave+'</div>';
}
document.addEventListener('DOMContentLoaded',()=>{
 const d=document.getElementById('dlgflor');
 if(!d)return;
 const x=document.getElementById('flx');
 if(x)x.onclick=()=>d.close();
 d.addEventListener('click',e=>{
  const f=e.target.closest&&e.target.closest('[data-fi]');
  if(f&&d.contains(f))return florElegir(+f.dataset.fi);
  const t=e.target.closest&&e.target.closest('[data-p]');
  if(t&&d.contains(t))florSel(t.dataset.p);
 });
});
