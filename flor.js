/* ============================================================
   flor.js · Biotaxo dex
   «🌸 Diagrama de la flor»: esquema de una flor completa (corte
   longitudinal) con sus partes rotuladas en español. Se abre desde
   el botón de la ficha de las especies del reino Plantae.
   Paso 2: al tocar una parte (en el dibujo, en su rótulo o en los
   botones de abajo) se resalta y aparece qué es y cómo reconocerla.
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
 d.showModal();
}
document.addEventListener('DOMContentLoaded',()=>{
 const d=document.getElementById('dlgflor');
 if(!d)return;
 const x=document.getElementById('flx');
 if(x)x.onclick=()=>d.close();
 d.addEventListener('click',e=>{
  const t=e.target.closest&&e.target.closest('[data-p]');
  if(t&&d.contains(t))florSel(t.dataset.p);
 });
});
