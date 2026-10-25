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

/* --- Paso 5: diagramas propios por familia. Orchidaceae: vista frontal (tipo Phalaenopsis) --- */
const FLOR_ORQ_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 30 520 370" role="img" aria-label="Vista frontal de una flor de orquídea con sus partes"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="ovario"><path d="M251 300 C248 330 266 350 252 392 L270 392 C284 350 268 330 269 300 Z" fill="#cfe6a0" stroke="#55822f" stroke-width="2"/><path d="M252 335 C260 340 266 342 268 346 M251 360 C258 364 264 366 266 370" fill="none" stroke="#55822f" stroke-width="1.6"/></g><g data-p="sepalo_l" fill="#f9d4e3" stroke="#b24d78" stroke-width="2"><ellipse cx="192" cy="270" rx="40" ry="74" transform="rotate(34 192 270)"/><ellipse cx="328" cy="270" rx="40" ry="74" transform="rotate(-34 328 270)"/></g><g data-p="sepalo_d" fill="#f9d4e3" stroke="#b24d78" stroke-width="2"><ellipse cx="260" cy="112" rx="46" ry="64"/></g><g data-p="petalo" fill="#fdeef5" stroke="#b24d78" stroke-width="2"><ellipse cx="168" cy="186" rx="76" ry="60" transform="rotate(-12 168 186)"/><ellipse cx="352" cy="186" rx="76" ry="60" transform="rotate(12 352 186)"/></g><g data-p="labelo" fill="#fff3b0" stroke="#b8941c" stroke-width="2"><ellipse cx="232" cy="248" rx="17" ry="28" transform="rotate(14 232 248)"/><ellipse cx="288" cy="248" rx="17" ry="28" transform="rotate(-14 288 248)"/><path d="M246 260 Q260 252 274 260 C276 286 270 306 260 330 C250 306 244 286 246 260 Z"/><path d="M258 328 C250 336 244 334 240 328 M262 328 C270 336 276 334 280 328" fill="none"/></g><g data-p="columna"><path d="M247 196 C246 222 250 240 260 244 C270 240 274 222 273 196 Z" fill="#f4efe0" stroke="#8a7f5a" stroke-width="2"/></g><g data-p="estigma"><ellipse cx="260" cy="224" rx="6" ry="9" fill="#e8806a" stroke="#963e2a" stroke-width="1.8"/></g><g data-p="antera" fill="#f4c542" stroke="#9a7b0c" stroke-width="2"><path d="M246 198 C246 182 274 182 274 198 Z"/><circle cx="254" cy="193" r="3.4" fill="#ffe27a"/><circle cx="266" cy="193" r="3.4" fill="#ffe27a"/></g></g><g class="fl-r"><g data-p="sepalo_d"><text class="fl-t" x="10" y="84">Sépalo dorsal<tspan class="fl-s" x="10" dy="15">cáliz</tspan></text><path class="fl-l" d="M100 80 L238 92"/><circle class="fl-d" cx="238" cy="92" r="3"/></g><g data-p="petalo"><text class="fl-t" x="10" y="160">Pétalo<tspan class="fl-s" x="10" dy="15">corola</tspan></text><path class="fl-l" d="M62 156 L136 176"/><circle class="fl-d" cx="136" cy="176" r="3"/></g><g data-p="sepalo_l"><text class="fl-t" x="10" y="296">Sépalo lateral<tspan class="fl-s" x="10" dy="15">cáliz</tspan></text><path class="fl-l" d="M104 292 L176 292"/><circle class="fl-d" cx="176" cy="292" r="3"/></g><g data-p="ovario"><text class="fl-t" x="10" y="366">Ovario ínfero<tspan class="fl-s" x="10" dy="15">bajo la flor</tspan></text><path class="fl-l" d="M100 362 L254 362"/><circle class="fl-d" cx="254" cy="362" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="antera"><text class="fl-t" x="510" y="130">Antera y polinias<tspan class="fl-s" x="510" dy="15">masas de polen</tspan></text><path class="fl-l" d="M400 126 L274 190"/><circle class="fl-d" cx="274" cy="190" r="3"/></g><g data-p="columna"><text class="fl-t" x="510" y="196">Columna<tspan class="fl-s" x="510" dy="15">estambre + pistilo</tspan></text><path class="fl-l" d="M440 192 L273 210"/><circle class="fl-d" cx="273" cy="210" r="3"/></g><g data-p="estigma"><text class="fl-t" x="510" y="262">Estigma<tspan class="fl-s" x="510" dy="15">bajo la antera</tspan></text><path class="fl-l" d="M440 258 L266 226"/><circle class="fl-d" cx="266" cy="226" r="3"/></g><g data-p="labelo"><text class="fl-t" x="510" y="326">Labelo<tspan class="fl-s" x="510" dy="15">pétalo modificado</tspan></text><path class="fl-l" d="M400 322 L272 300"/><circle class="fl-d" cx="272" cy="300" r="3"/></g></g></svg>`;
const FLOR_ORQ_PARTES={
 sepalo_d:{n:'Sépalo dorsal',g:'cáliz · perianto (protege)',
  d:'El sépalo de arriba. En una orquídea hay tres sépalos (uno dorsal y dos laterales) y juntos forman el cáliz, aunque casi siempre son tan vistosos como los pétalos.',
  c:'En el botón cerrado protegen la flor. Cuando sépalos y pétalos se parecen tanto, a todas esas piezas se les llama tépalos.'},
 sepalo_l:{n:'Sépalos laterales',g:'cáliz · perianto (protege)',
  d:'Los dos sépalos de abajo, a los lados del labelo. En algunas orquídeas se sueldan entre sí.',
  c:'En la orquídea mariposa (Phalaenopsis) son anchos y parecidos a los pétalos; en Paphiopedilum se fusionan y quedan detrás del labelo.'},
 petalo:{n:'Pétalos',g:'corola · perianto (atrae polinizadores)',
  d:'Las dos piezas internas laterales. La flor tiene simetría bilateral (zigomorfa) porque el tercer pétalo se transforma en el labelo.',
  c:'En la orquídea mariposa son más anchos que los sépalos y forman las «alas» de la flor.'},
 labelo:{n:'Labelo',g:'pétalo modificado (el tercer pétalo)',
  d:'Pétalo muy distinto de los otros dos, casi siempre más decorado. Funciona como pista de aterrizaje y guía al polinizador hacia la columna.',
  c:'Suele tener otro color, manchas, rayas o zonas peludas; en algunas orquídeas forma un saco o una espuela con néctar. En muchas, la flor gira al abrir (resupinación) y el labelo queda abajo.'},
 columna:{n:'Columna',g:'estambre + pistilo fundidos (ginostemio)',
  d:'Estructura central donde se unen el androceo y el gineceo en una sola pieza. Es lo más característico de las orquídeas.',
  c:'Es una pieza corta y carnosa frente al labelo: arriba lleva la antera y debajo, el estigma.'},
 antera:{n:'Antera y polinias',g:'androceo (parte masculina)',
  d:'En la punta de la columna, bajo una tapita. El polen no es polvo suelto: forma masas compactas llamadas polinias.',
  c:'Las polinias se pegan al polinizador como un solo bloque y se llevan juntas a otra flor. La mayoría de las orquídeas tiene una sola antera fértil.'},
 estigma:{n:'Estigma',g:'pistilo · gineceo (parte femenina)',
  d:'Superficie pegajosa y hundida en la cara inferior de la columna, que recibe las polinias.',
  c:'Se ve como una cavidad húmeda y brillante bajo la antera. Una pieza llamada rostelo la separa del polen y ayuda a evitar la autopolinización.'},
 ovario:{n:'Ovario ínfero',g:'pistilo · gineceo (parte femenina)',
  d:'Queda por debajo de sépalos, pétalos y columna (ínfero). Parece un tallito alargado, a menudo retorcido, bajo la flor; en realidad incluye el pedicelo y el ovario.',
  c:'Tras la fecundación se convierte en una cápsula con miles de semillas diminutas, casi como polvo.'}
};
const FLOR_ORQ_ORDEN=['sepalo_d','petalo','sepalo_l','labelo','columna','antera','estigma','ovario'];
/* --- Paso 8: Araceae. Corte longitudinal de una inflorescencia con espata y espádice --- */
const FLOR_ARA_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 20 520 460" role="img" aria-label="Corte longitudinal de una inflorescencia de arácea con sus partes"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="pedunculo"><rect x="250" y="418" width="20" height="46" rx="4" fill="#8fbf6a" stroke="#3d6b2e" stroke-width="2"/></g><g data-p="espata" stroke="#8c4a55" stroke-width="2"><path d="M206 420 C190 380 188 300 206 244 C214 222 224 214 230 206 C214 172 206 110 258 44 C300 22 350 40 362 66 C346 112 318 172 294 206 C300 214 308 222 314 244 C332 300 330 380 314 420 Z" fill="#e6c9cb"/></g><g data-p="camara"><path d="M222 416 C208 380 206 304 220 252 C224 236 232 224 238 214 L282 214 C288 224 296 236 300 252 C314 304 312 380 298 416 Z" fill="#fbf7ec" stroke="#c9b88a" stroke-width="2" stroke-dasharray="5 4"/></g><g data-p="espadice" fill="#f3f0e3" stroke="#8a7f5a" stroke-width="2"><path d="M252 190 C250 140 246 96 260 62 C274 96 270 140 268 190 Z"/><rect x="255" y="188" width="10" height="160" rx="3"/></g><g data-p="masculina" fill="#f5e3a0" stroke="#b39a3a" stroke-width="1.8"><ellipse cx="245" cy="238" rx="8" ry="6"/><ellipse cx="260" cy="234" rx="8" ry="6"/><ellipse cx="275" cy="238" rx="8" ry="6"/><ellipse cx="245" cy="252" rx="8" ry="6"/><ellipse cx="260" cy="249" rx="8" ry="6"/><ellipse cx="275" cy="252" rx="8" ry="6"/><ellipse cx="247" cy="266" rx="8" ry="6"/><ellipse cx="260" cy="263" rx="8" ry="6"/><ellipse cx="273" cy="266" rx="8" ry="6"/></g><g data-p="olfativos" fill="#f6d9a0" stroke="#a77c25" stroke-width="1.8"><ellipse cx="238" cy="352" rx="12" ry="6" transform="rotate(-24 238 352)"/><ellipse cx="282" cy="352" rx="12" ry="6" transform="rotate(24 282 352)"/><ellipse cx="240" cy="338" rx="9" ry="5" transform="rotate(-20 240 338)"/><ellipse cx="280" cy="338" rx="9" ry="5" transform="rotate(20 280 338)"/></g><g data-p="pistilo" fill="#cfe6a0" stroke="#55822f" stroke-width="2"><ellipse cx="238" cy="394" rx="12" ry="19"/><ellipse cx="282" cy="394" rx="12" ry="19"/><ellipse cx="260" cy="396" rx="13" ry="19"/></g><g data-p="estigma" fill="#e8806a" stroke="#963e2a" stroke-width="1.8"><ellipse cx="238" cy="376" rx="10" ry="5"/><ellipse cx="282" cy="376" rx="10" ry="5"/><ellipse cx="260" cy="378" rx="11" ry="5"/></g></g><g class="fl-r"><g data-p="espata"><text class="fl-t" x="10" y="96">Espata<tspan class="fl-s" x="10" dy="15">hoja modificada</tspan></text><path class="fl-l" d="M70 92 L232 118"/><circle class="fl-d" cx="232" cy="118" r="3"/></g><g data-p="camara"><text class="fl-t" x="10" y="270">Cámara floral<tspan class="fl-s" x="10" dy="15">base de la espata</tspan></text><path class="fl-l" d="M112 266 L214 300"/><circle class="fl-d" cx="214" cy="300" r="3"/></g><g data-p="pedunculo"><text class="fl-t" x="10" y="440">Pedúnculo</text><path class="fl-l" d="M86 436 L252 440"/><circle class="fl-d" cx="252" cy="440" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="espadice"><text class="fl-t" x="510" y="116">Espádice estéril<tspan class="fl-s" x="510" dy="15">eje sin flores</tspan></text><path class="fl-l" d="M410 112 L268 140"/><circle class="fl-d" cx="268" cy="140" r="3"/></g><g data-p="masculina"><text class="fl-t" x="510" y="214">Flores masculinas<tspan class="fl-s" x="510" dy="15">estambres</tspan></text><path class="fl-l" d="M400 210 L283 244"/><circle class="fl-d" cx="283" cy="244" r="3"/></g><g data-p="olfativos"><text class="fl-t" x="510" y="304">Cuerpos olfativos<tspan class="fl-s" x="510" dy="15">flores estériles</tspan></text><path class="fl-l" d="M396 300 L292 344"/><circle class="fl-d" cx="292" cy="344" r="3"/></g><g data-p="estigma"><text class="fl-t" x="510" y="364">Estigma<tspan class="fl-s" x="510" dy="15">parte femenina</tspan></text><path class="fl-l" d="M440 360 L294 376"/><circle class="fl-d" cx="294" cy="376" r="3"/></g><g data-p="pistilo"><text class="fl-t" x="510" y="424">Pistilo<tspan class="fl-s" x="510" dy="15">ovario</tspan></text><path class="fl-l" d="M456 420 L294 400"/><circle class="fl-d" cx="294" cy="400" r="3"/></g></g></svg>`;
const FLOR_ARA_PARTES={
 espata:{n:'Espata',g:'bráctea grande (hoja modificada)',
  d:'Hoja modificada, grande y a menudo vistosa, que envuelve al espádice. La parte baja forma un tubo o cámara y la parte alta se abre en una lámina.',
  c:'Es lo que parece «la flor» de un anturio o un cartucho. Las flores de verdad son diminutas y están dentro, sobre el espádice.'},
 camara:{n:'Cámara floral',g:'base de la espata',
  d:'Espacio hueco que forma la base de la espata alrededor de las flores. En algunas aráceas retiene por un tiempo a los insectos que polinizan.',
  c:'En una foto de corte se ve como la cavidad clara alrededor del espádice, más ancha abajo (donde están las flores femeninas) y estrecha arriba.'},
 espadice:{n:'Espádice estéril',g:'inflorescencia · eje',
  d:'El espádice es la espiga carnosa que lleva las flores diminutas. Aquí se resalta su parte sin flores: el eje entre las zonas florales y el apéndice del extremo.',
  c:'En muchas aráceas termina en un apéndice estéril, a veces largo, que puede calentarse y oler para atraer insectos.'},
 masculina:{n:'Flores masculinas',g:'androceo (parte masculina)',
  d:'Zona del espádice con flores reducidas a estambres, sin pétalos ni sépalos, muy apretadas unas contra otras.',
  c:'Se ven como un racimito de masas cremosas o amarillas. Suelen madurar después que las femeninas, y así se evita que la planta se polinice a sí misma.'},
 olfativos:{n:'Cuerpos olfativos',g:'flores estériles modificadas',
  d:'Estructuras estériles del espádice que producen olor y atraen a los polinizadores.',
  c:'En el corte de referencia aparecen justo sobre las flores femeninas. Su posición y su forma cambian según el género.'},
 estigma:{n:'Estigma',g:'pistilo · gineceo (parte femenina)',
  d:'Superficie receptora del pistilo. En las aráceas suele ir directamente sobre el ovario, sin un estilo largo.',
  c:'Se ve como un casquete o un puntito brillante sobre cada pistilo; recibe el polen que traen los insectos.'},
 pistilo:{n:'Pistilo (flores femeninas)',g:'gineceo (parte femenina)',
  d:'Cada flor femenina es un pistilo casi desnudo: un ovario con su estigma, a menudo sin perianto. Se agrupan en la base del espádice.',
  c:'Tras la fecundación el ovario se convierte en una baya, y todas juntas forman la infrutescencia de frutos carnosos.'},
 pedunculo:{n:'Pedúnculo',g:'soporte de la inflorescencia',
  d:'Tallo que sostiene la espata y el espádice.',
  c:'Sale entre las hojas o directamente del rizoma.'}
};
const FLOR_ARA_ORDEN=['espata','camara','espadice','masculina','olfativos','estigma','pistilo','pedunculo'];
const FLOR_ARAF_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 150 520 250" role="img" aria-label="Corte longitudinal de una flor femenina de arácea"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="espadice"><rect x="176" y="342" width="168" height="44" rx="6" fill="#f3f0e3" stroke="#8a7f5a" stroke-width="2"/></g><g data-p="ovario"><ellipse cx="260" cy="270" rx="62" ry="74" fill="#cfe6a0" stroke="#55822f" stroke-width="2.5"/></g><g data-p="loculo"><ellipse cx="260" cy="276" rx="44" ry="58" fill="#f7fbe9" stroke="#9bbf6a" stroke-width="2"/></g><g data-p="placenta"><path d="M236 332 C246 318 274 318 284 332 C274 338 246 338 236 332 Z" fill="#b5d58a" stroke="#55822f" stroke-width="2"/></g><g data-p="ovulo" fill="#fff0a8" stroke="#a68b1d" stroke-width="2"><ellipse cx="243" cy="296" rx="14" ry="22" transform="rotate(10 243 296)"/><ellipse cx="277" cy="296" rx="14" ry="22" transform="rotate(-10 277 296)"/><circle cx="243" cy="298" r="5" fill="#f4c542"/><circle cx="277" cy="298" r="5" fill="#f4c542"/></g><g data-p="estilo"><path d="M250 202 L270 202 L268 192 L252 192 Z" fill="#b9d98a" stroke="#55822f" stroke-width="2"/></g><g data-p="estigma"><ellipse cx="260" cy="186" rx="28" ry="9" fill="#e8806a" stroke="#963e2a" stroke-width="2"/></g></g><g class="fl-r"><g data-p="estigma"><text class="fl-t" x="10" y="184">Estigma<tspan class="fl-s" x="10" dy="15">recibe el polen</tspan></text><path class="fl-l" d="M86 180 L234 186"/><circle class="fl-d" cx="234" cy="186" r="3"/></g><g data-p="estilo"><text class="fl-t" x="10" y="238">Estilo<tspan class="fl-s" x="10" dy="15">muy corto</tspan></text><path class="fl-l" d="M64 234 L252 198"/><circle class="fl-d" cx="252" cy="198" r="3"/></g><g data-p="ovario"><text class="fl-t" x="10" y="298">Ovario<tspan class="fl-s" x="10" dy="15">pared</tspan></text><path class="fl-l" d="M64 294 L202 290"/><circle class="fl-d" cx="202" cy="290" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="loculo"><text class="fl-t" x="510" y="226">Lóculo<tspan class="fl-s" x="510" dy="15">cavidad</tspan></text><path class="fl-l" d="M462 222 L286 246"/><circle class="fl-d" cx="286" cy="246" r="3"/></g><g data-p="ovulo"><text class="fl-t" x="510" y="284">Óvulo<tspan class="fl-s" x="510" dy="15">futura semilla</tspan></text><path class="fl-l" d="M458 280 L290 292"/><circle class="fl-d" cx="290" cy="292" r="3"/></g><g data-p="placenta"><text class="fl-t" x="510" y="336">Placenta<tspan class="fl-s" x="510" dy="15">donde se unen</tspan></text><path class="fl-l" d="M428 332 L282 328"/><circle class="fl-d" cx="282" cy="328" r="3"/></g><g data-p="espadice"><text class="fl-t" x="510" y="382">Espádice<tspan class="fl-s" x="510" dy="15">eje</tspan></text><path class="fl-l" d="M432 378 L336 366"/><circle class="fl-d" cx="336" cy="366" r="3"/></g></g></svg>`;
const FLOR_ARAF_PARTES={
 estigma:{n:'Estigma',g:'pistilo · gineceo (parte femenina)',
  d:'Superficie receptora del pistilo, donde se pega el polen. En muchas aráceas es un disco o un casquete pequeño, directamente sobre el ovario.',
  c:'En una flor receptiva se ve húmedo y brillante.'},
 estilo:{n:'Estilo',g:'pistilo · gineceo (parte femenina)',
  d:'Cuello entre el estigma y el ovario. En las aráceas suele ser muy corto o faltar, y entonces el estigma queda pegado al ovario.',
  c:'Si el estigma parece «sentado» sobre el ovario, la flor tiene estigma sésil.'},
 ovario:{n:'Ovario',g:'pistilo · gineceo (parte femenina)',
  d:'Pared que protege los óvulos. En muchas aráceas la flor femenina es solo un ovario con su estigma, sin sépalos ni pétalos.',
  c:'Tras la fecundación se convierte en fruto, normalmente una baya. Según el género puede tener uno o varios lóculos.'},
 loculo:{n:'Lóculo',g:'ovario · cavidad',
  d:'Cavidad interior del ovario donde están los óvulos.',
  c:'En un corte transversal (como en tu lámina) cada lóculo se ve como un espacio redondo que contiene su óvulo.'},
 ovulo:{n:'Óvulo',g:'ovario · contiene la célula sexual femenina',
  d:'Estructura que guarda la célula sexual femenina; tras la fecundación se convierte en la semilla. Se une a la placenta por un tallito llamado funículo.',
  c:'El número de óvulos por lóculo cambia mucho: puede ser uno solo o muchos.'},
 placenta:{n:'Placenta',g:'ovario · punto de unión de los óvulos',
  d:'Zona de la pared del ovario donde se insertan los óvulos.',
  c:'Aquí está en la base del lóculo, pero su posición cambia según el género.'},
 espadice:{n:'Espádice',g:'inflorescencia · eje',
  d:'Eje carnoso sobre el que se insertan todas las flores de la inflorescencia.',
  c:'Estas flores no tienen pedicelo: nacen directamente del eje (son sésiles).'}
};
const FLOR_ARAF_ORDEN=['estigma','estilo','ovario','loculo','ovulo','placenta','espadice'];
const FLOR_ARAM_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 150 520 250" role="img" aria-label="Corte longitudinal de una flor masculina de arácea (un estambre)"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="espadice"><rect x="176" y="346" width="168" height="40" rx="6" fill="#f3f0e3" stroke="#8a7f5a" stroke-width="2"/></g><g data-p="filamento"><rect x="248" y="288" width="24" height="62" rx="4" fill="#e9d98a" stroke="#9a7b0c" stroke-width="2"/></g><g data-p="teca" fill="#f4c542" stroke="#9a7b0c" stroke-width="2"><ellipse cx="226" cy="252" rx="28" ry="44"/><ellipse cx="294" cy="252" rx="28" ry="44"/></g><g data-p="conectivo"><rect x="250" y="214" width="20" height="78" rx="4" fill="#d9b94a" stroke="#9a7b0c" stroke-width="2"/></g><g data-p="polen" fill="#fff4b8" stroke="#b39a3a" stroke-width="1.2"><circle cx="218" cy="236" r="5"/><circle cx="232" cy="250" r="5"/><circle cx="216" cy="264" r="5"/><circle cx="230" cy="276" r="5"/><circle cx="302" cy="236" r="5"/><circle cx="288" cy="250" r="5"/><circle cx="304" cy="264" r="5"/><circle cx="290" cy="276" r="5"/><circle cx="222" cy="190" r="4.5"/><circle cx="232" cy="178" r="4.5"/><circle cx="216" cy="174" r="4.5"/><circle cx="298" cy="190" r="4.5"/><circle cx="288" cy="178" r="4.5"/><circle cx="304" cy="174" r="4.5"/></g><g data-p="poro" fill="#6b5300" stroke="#3d2f00" stroke-width="1.6"><ellipse cx="226" cy="208" rx="9" ry="5"/><ellipse cx="294" cy="208" rx="9" ry="5"/></g></g><g class="fl-r"><g data-p="polen"><text class="fl-t" x="10" y="178">Polen<tspan class="fl-s" x="10" dy="15">granos</tspan></text><path class="fl-l" d="M60 174 L210 178"/><circle class="fl-d" cx="210" cy="178" r="3"/></g><g data-p="poro"><text class="fl-t" x="10" y="232">Poro<tspan class="fl-s" x="10" dy="15">abertura de la antera</tspan></text><path class="fl-l" d="M60 228 L218 210"/><circle class="fl-d" cx="218" cy="210" r="3"/></g><g data-p="teca"><text class="fl-t" x="10" y="298">Teca<tspan class="fl-s" x="10" dy="15">saco de polen</tspan></text><path class="fl-l" d="M60 294 L204 270"/><circle class="fl-d" cx="204" cy="270" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="conectivo"><text class="fl-t" x="510" y="238">Conectivo<tspan class="fl-s" x="510" dy="15">une las dos tecas</tspan></text><path class="fl-l" d="M426 234 L270 240"/><circle class="fl-d" cx="270" cy="240" r="3"/></g><g data-p="filamento"><text class="fl-t" x="510" y="304">Filamento<tspan class="fl-s" x="510" dy="15">muy corto</tspan></text><path class="fl-l" d="M420 300 L272 316"/><circle class="fl-d" cx="272" cy="316" r="3"/></g><g data-p="espadice"><text class="fl-t" x="510" y="368">Espádice<tspan class="fl-s" x="510" dy="15">eje</tspan></text><path class="fl-l" d="M432 364 L336 368"/><circle class="fl-d" cx="336" cy="368" r="3"/></g></g></svg>`;
const FLOR_ARAM_PARTES={
 teca:{n:'Teca',g:'antera · androceo (parte masculina)',
  d:'Cada antera tiene dos tecas, o mitades, y dentro de cada una se forma el polen.',
  c:'Se ven como dos lóbulos a los lados del conectivo. En las aráceas las anteras son pequeñas y están muy juntas.'},
 conectivo:{n:'Conectivo',g:'antera · androceo (parte masculina)',
  d:'Tejido que une las dos tecas de la antera y la conecta con el filamento.',
  c:'Es la «bisagra» central de la antera, entre una teca y la otra.'},
 filamento:{n:'Filamento',g:'estambre · androceo (parte masculina)',
  d:'Tallito que sostiene la antera. En muchas aráceas es muy corto o falta, y la antera parece pegada al espádice.',
  c:'Si no ves tallito bajo la antera, el estambre es sésil.'},
 poro:{n:'Poro',g:'antera · abertura para liberar el polen',
  d:'Abertura por donde sale el polen. En muchas aráceas la antera se abre por un poro o una hendidura en la punta, y no a lo largo de toda la antera.',
  c:'Mira la punta de la antera: ahí suele verse el agujero o la rajadura.'},
 polen:{n:'Polen',g:'células sexuales masculinas',
  d:'Granos que contienen las células sexuales masculinas. Dentro de la antera están en las tecas, y afuera se pegan a los insectos.',
  c:'Puede salir en hilos o en masas pegajosas, que los insectos llevan hasta las flores femeninas.'},
 espadice:{n:'Espádice',g:'inflorescencia · eje',
  d:'Eje carnoso sobre el que se insertan todas las flores de la inflorescencia.',
  c:'En una flor masculina de arácea hay entre uno y varios estambres, a veces fundidos en un solo bloque (sinandrio).'}
};
const FLOR_ARAM_ORDEN=['polen','poro','teca','conectivo','filamento','espadice'];
const FLOR_VISTAS_ARA=[['araceae','Inflorescencia'],['araceae_f','Flor femenina'],['araceae_m','Flor masculina']];
/* --- Paso 9: Asteraceae. Cuatro vistas, porque el capítulo y las flores cambian mucho entre géneros --- */
const FLOR_AST1_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 130 520 300" role="img" aria-label="Corte de un capítulo de Asteraceae radiada (tipo girasol)"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="pedunculo"><rect x="248" y="338" width="24" height="76" rx="4" fill="#8fbf6a" stroke="#3d6b2e" stroke-width="2"/></g><g data-p="involucro" fill="#7fb069" stroke="#3d6b2e" stroke-width="2"><ellipse cx="156" cy="334" rx="42" ry="11" transform="rotate(34 156 334)"/><ellipse cx="176" cy="350" rx="40" ry="11" transform="rotate(22 176 350)"/><ellipse cx="364" cy="334" rx="42" ry="11" transform="rotate(-34 364 334)"/><ellipse cx="344" cy="350" rx="40" ry="11" transform="rotate(-22 344 350)"/></g><g data-p="radio" fill="#f6c93a" stroke="#a67c00" stroke-width="2"><ellipse cx="92" cy="270" rx="58" ry="17" transform="rotate(-14 92 270)"/><ellipse cx="100" cy="304" rx="52" ry="16" transform="rotate(6 100 304)"/><ellipse cx="428" cy="270" rx="58" ry="17" transform="rotate(14 428 270)"/><ellipse cx="420" cy="304" rx="52" ry="16" transform="rotate(-6 420 304)"/></g><g data-p="receptaculo"><path d="M146 300 C168 256 352 256 374 300 L372 336 C330 356 190 356 148 336 Z" fill="#c9b27a" stroke="#6b5a2a" stroke-width="2"/></g><g data-p="paleas" fill="#e6d79c" stroke="#8a7f5a" stroke-width="1.4"><path d="M179.5 285.3 l-3 -20 l6 0 Z"/><path d="M202.5 275.8 l-3 -20 l6 0 Z"/><path d="M225.5 269.5 l-3 -20 l6 0 Z"/><path d="M248.5 266.4 l-3 -20 l6 0 Z"/><path d="M271.5 266.4 l-3 -20 l6 0 Z"/><path d="M294.5 269.5 l-3 -20 l6 0 Z"/><path d="M317.5 275.8 l-3 -20 l6 0 Z"/><path d="M340.5 285.3 l-3 -20 l6 0 Z"/></g><g data-p="disco" fill="#d9a441" stroke="#7a5a10" stroke-width="1.6"><g transform="translate(168.0 293.2) rotate(-21.7)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(191.0 282.2) rotate(-16.3)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(214.0 274.3) rotate(-10.9)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(237.0 269.6) rotate(-5.4)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(260.0 268.0) rotate(0.0)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(283.0 269.6) rotate(5.4)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(306.0 274.3) rotate(10.9)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(329.0 282.2) rotate(16.3)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(352.0 293.2) rotate(21.7)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g></g></g><g class="fl-r"><g data-p="radio"><text class="fl-t" x="10" y="218">Flor del radio<tspan class="fl-s" x="10" dy="15">lígula · estéril en el girasol</tspan></text><path class="fl-l" d="M186 214 L70 262"/><circle class="fl-d" cx="70" cy="262" r="3"/></g><g data-p="involucro"><text class="fl-t" x="10" y="352">Involucro<tspan class="fl-s" x="10" dy="15">brácteas</tspan></text><path class="fl-l" d="M92 348 L170 358"/><circle class="fl-d" cx="170" cy="358" r="3"/></g><g data-p="pedunculo"><text class="fl-t" x="10" y="410">Pedúnculo</text><path class="fl-l" d="M92 406 L250 396"/><circle class="fl-d" cx="250" cy="396" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="disco"><text class="fl-t" x="510" y="196">Flores del disco<tspan class="fl-s" x="510" dy="15">tubulares · fértiles</tspan></text><path class="fl-l" d="M374 192 L278 236"/><circle class="fl-d" cx="278" cy="236" r="3"/></g><g data-p="paleas"><text class="fl-t" x="510" y="272">Páleas<tspan class="fl-s" x="510" dy="15">entre las flores</tspan></text><path class="fl-l" d="M410 268 L298 262"/><circle class="fl-d" cx="298" cy="262" r="3"/></g><g data-p="receptaculo"><text class="fl-t" x="510" y="334">Receptáculo</text><path class="fl-l" d="M412 330 L300 330"/><circle class="fl-d" cx="300" cy="330" r="3"/></g></g></svg>`;
const FLOR_AST1_PARTES={
 radio:{n:'Flores del radio',g:'flores del borde · con lígula',
  d:'Flores del borde del capítulo, cada una con una lígula grande que parece un pétalo. En el girasol son estériles y solo atraen polinizadores; en otras, como la margarita, son femeninas.',
  c:'Cada «pétalo» de un girasol o de una margarita es en realidad una flor distinta, muy reducida.'},
 disco:{n:'Flores del disco',g:'flores del centro · tubulares',
  d:'Las pequeñas flores del centro: tubulares, con la corola de 5 lóbulos, y normalmente hermafroditas y fértiles. Cada una forma un fruto seco (cipsela).',
  c:'Se abren de afuera hacia adentro. Las pipas del girasol son los frutos de estas flores.'},
 paleas:{n:'Páleas',g:'brácteas entre las flores',
  d:'Pequeñas brácteas que hay entre las flores del disco, sobre el receptáculo. No todas las Asteraceae las tienen.',
  c:'El girasol tiene páleas; el diente de león no (su receptáculo es desnudo).'},
 receptaculo:{n:'Receptáculo',g:'soporte común de las flores',
  d:'Ensanchamiento del extremo del pedúnculo sobre el que se insertan todas las flores del capítulo. Por eso un capítulo parece una sola flor.',
  c:'Puede ser plano, convexo o cónico, según la especie.'},
 involucro:{n:'Involucro',g:'brácteas que rodean el capítulo',
  d:'Conjunto de brácteas verdes (filarias) que rodean la base del capítulo y lo protegen cuando es botón.',
  c:'Parecen un cáliz, pero no lo son: el cáliz de cada flor está reducido al vilano.'},
 pedunculo:{n:'Pedúnculo',g:'soporte del capítulo',
  d:'Tallo que sostiene el capítulo.',
  c:'Su grosor y si es hueco o macizo cambian según la especie.'}
};
const FLOR_AST1_ORDEN=['radio','disco','paleas','receptaculo','involucro','pedunculo'];
const FLOR_AST2_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 130 520 300" role="img" aria-label="Corte de un capítulo ligulado de Asteraceae (tipo diente de león)"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="pedunculo"><rect x="246" y="344" width="28" height="74" rx="4" fill="#8fbf6a" stroke="#3d6b2e" stroke-width="2"/><rect x="255" y="344" width="10" height="74" fill="#eef7e0"/></g><g data-p="externas" fill="#7fb069" stroke="#3d6b2e" stroke-width="2"><ellipse cx="148" cy="352" rx="40" ry="9" transform="rotate(38 148 352)"/><ellipse cx="372" cy="352" rx="40" ry="9" transform="rotate(-38 372 352)"/><ellipse cx="170" cy="368" rx="36" ry="8" transform="rotate(30 170 368)"/><ellipse cx="350" cy="368" rx="36" ry="8" transform="rotate(-30 350 368)"/></g><g data-p="involucro" fill="#9ccb83" stroke="#3d6b2e" stroke-width="2"><ellipse cx="172" cy="316" rx="9" ry="44" transform="rotate(-6 172 316)"/><ellipse cx="348" cy="316" rx="9" ry="44" transform="rotate(6 348 316)"/></g><g data-p="receptaculo"><path d="M180 322 C200 304 320 304 340 322 L338 346 C310 358 210 358 182 346 Z" fill="#c9b27a" stroke="#6b5a2a" stroke-width="2"/></g><g data-p="ligulada" fill="#f0b90a" stroke="#a67c00" stroke-width="1.5"><g transform="translate(196.0 322.0) rotate(-48.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(212.0 319.4) rotate(-36.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(228.0 317.5) rotate(-24.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(244.0 316.4) rotate(-12.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(260.0 316.0) rotate(0.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(276.0 316.4) rotate(12.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(292.0 317.5) rotate(24.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(308.0 319.4) rotate(36.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(324.0 322.0) rotate(48.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g><g transform="translate(340.0 325.4) rotate(60.0)"><rect x="-4" y="-36" width="8" height="36" rx="2"/><path d="M-5 -36 C-12 -52 -10 -70 0 -84 C10 -70 12 -52 5 -36 Z" fill="#f6d34a"/><path d="M-6 -78 L-3 -86 L0 -79 L3 -86 L6 -78" fill="none" stroke="#a67c00" stroke-width="1.4"/></g></g></g><g class="fl-r"><g data-p="ligulada"><text class="fl-t" x="10" y="200">Flores ligulares<tspan class="fl-s" x="10" dy="15">todas con lígula</tspan></text><path class="fl-l" d="M146 196 L148 274"/><circle class="fl-d" cx="148" cy="274" r="3"/></g><g data-p="involucro"><text class="fl-t" x="10" y="300">Involucro interno<tspan class="fl-s" x="10" dy="15">brácteas erguidas</tspan></text><path class="fl-l" d="M153 296 L164 300"/><circle class="fl-d" cx="164" cy="300" r="3"/></g><g data-p="pedunculo"><text class="fl-t" x="10" y="410">Pedúnculo<tspan class="fl-s" x="10" dy="15">hueco</tspan></text><path class="fl-l" d="M92 406 L246 392"/><circle class="fl-d" cx="246" cy="392" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="externas"><text class="fl-t" x="510" y="320">Brácteas externas<tspan class="fl-s" x="510" dy="15">reflexas, hacia abajo</tspan></text><path class="fl-l" d="M367 316 L374 356"/><circle class="fl-d" cx="374" cy="356" r="3"/></g><g data-p="receptaculo"><text class="fl-t" x="510" y="384">Receptáculo<tspan class="fl-s" x="510" dy="15">desnudo, sin páleas</tspan></text><path class="fl-l" d="M393 380 L334 340"/><circle class="fl-d" cx="334" cy="340" r="3"/></g></g></svg>`;
const FLOR_AST2_PARTES={
 ligulada:{n:'Flores ligulares',g:'todas las flores del capítulo',
  d:'Todas las flores del capítulo tienen lígula, y son hermafroditas y fértiles. No hay flores tubulares en el centro.',
  c:'Cada «pétalo» amarillo de un diente de león es una flor completa, con 5 dientecitos en la punta de la lígula.'},
 involucro:{n:'Involucro interno',g:'brácteas que rodean el capítulo',
  d:'Fila interna de brácteas erguidas que rodean las flores y cierran el capítulo de noche o con mal tiempo.',
  c:'Se doblan hacia abajo cuando el fruto madura y se abre el «paracaídas».'},
 externas:{n:'Brácteas externas',g:'brácteas que rodean el capítulo',
  d:'Fila externa de brácteas más cortas, dobladas hacia abajo (reflexas) en el diente de león.',
  c:'Su forma y su posición ayudan a distinguir especies de la familia.'},
 receptaculo:{n:'Receptáculo desnudo',g:'soporte común de las flores',
  d:'Base ensanchada sobre la que están todas las flores. En el diente de león no tiene páleas, por eso se le llama desnudo.',
  c:'Cuando los frutos se dispersan, el receptáculo queda como una superficie con huequitos.'},
 pedunculo:{n:'Pedúnculo (escapo)',g:'soporte del capítulo',
  d:'Tallo hueco y sin hojas que sostiene el capítulo.',
  c:'Al cortarlo sale látex blanco, típico de muchas Asteraceae de lígula (diente de león, lechuga).'}
};
const FLOR_AST2_ORDEN=['ligulada','involucro','externas','receptaculo','pedunculo'];
const FLOR_AST3_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 100 520 330" role="img" aria-label="Corte de una flor tubular (del disco) de Asteraceae"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="vilano" fill="none" stroke="#7a6a3a" stroke-width="1.8"><path d="M244 338 L222 296"/><path d="M250 338 L238 290"/><path d="M256 338 L252 286"/><path d="M264 338 L268 286"/><path d="M270 338 L282 290"/><path d="M276 338 L298 296"/><path d="M240 338 L214 304"/><path d="M280 338 L306 304"/></g><g data-p="ovario"><path d="M234 414 C226 384 228 356 240 338 L280 338 C292 356 294 384 286 414 Z" fill="#cfe6a0" stroke="#55822f" stroke-width="2"/></g><g data-p="ovulo"><ellipse cx="260" cy="382" rx="9" ry="16" fill="#fff0a8" stroke="#a68b1d" stroke-width="2"/></g><g data-p="corola"><path d="M242 338 C246 300 246 250 242 206 L278 206 C274 250 274 300 278 338 Z" fill="#f7d56a" stroke="#9a7b0c" stroke-width="2"/><path d="M242 206 C232 196 222 184 214 170 C230 168 244 178 250 194 Z M278 206 C288 196 298 184 306 170 C290 168 276 178 270 194 Z M252 206 C254 190 258 178 260 166 C262 178 266 190 268 206 Z" fill="#f7d56a" stroke="#9a7b0c" stroke-width="2"/></g><g data-p="filamento" fill="none" stroke="#9a7b0c" stroke-width="3"><path d="M252 246 C250 268 248 290 247 318"/><path d="M268 246 C270 268 272 290 273 318"/></g><g data-p="antera"><rect x="249" y="204" width="22" height="46" rx="6" fill="#d9a441" stroke="#7a5a10" stroke-width="2"/><path d="M251 204 L255 194 L259 204 M261 204 L265 194 L269 204" fill="#d9a441" stroke="#7a5a10" stroke-width="1.6"/></g><g data-p="estilo"><rect x="257" y="148" width="6" height="190" rx="2" fill="#b9d98a" stroke="#55822f" stroke-width="1.8"/></g><g data-p="estigma" fill="none" stroke="#c4543c" stroke-width="5"><path d="M260 150 C252 134 238 128 230 138"/><path d="M260 150 C268 134 282 128 290 138"/></g></g><g class="fl-r"><g data-p="estigma"><text class="fl-t" x="10" y="136">Estigmas<tspan class="fl-s" x="10" dy="15">dos ramas</tspan></text><path class="fl-l" d="M85 132 L222 138"/><circle class="fl-d" cx="222" cy="138" r="3"/></g><g data-p="corola"><text class="fl-t" x="10" y="214">Corola tubular<tspan class="fl-s" x="10" dy="15">5 lóbulos</tspan></text><path class="fl-l" d="M130 210 L243 226"/><circle class="fl-d" cx="243" cy="226" r="3"/></g><g data-p="filamento"><text class="fl-t" x="10" y="286">Filamentos<tspan class="fl-s" x="10" dy="15">libres</tspan></text><path class="fl-l" d="M100 282 L248 276"/><circle class="fl-d" cx="248" cy="276" r="3"/></g><g data-p="vilano"><text class="fl-t" x="10" y="340">Vilano<tspan class="fl-s" x="10" dy="15">pelos o escamas</tspan></text><path class="fl-l" d="M105 336 L230 300"/><circle class="fl-d" cx="230" cy="300" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="estilo"><text class="fl-t" x="510" y="170">Estilo<tspan class="fl-s" x="510" dy="15">pasa por el tubo</tspan></text><path class="fl-l" d="M410 166 L263 172"/><circle class="fl-d" cx="263" cy="172" r="3"/></g><g data-p="antera"><text class="fl-t" x="510" y="240">Anteras soldadas<tspan class="fl-s" x="510" dy="15">sinanteria</tspan></text><path class="fl-l" d="M374 236 L271 230"/><circle class="fl-d" cx="271" cy="230" r="3"/></g><g data-p="ovario"><text class="fl-t" x="510" y="334">Ovario ínfero<tspan class="fl-s" x="510" dy="15">bajo la corola</tspan></text><path class="fl-l" d="M397 330 L288 372"/><circle class="fl-d" cx="288" cy="372" r="3"/></g><g data-p="ovulo"><text class="fl-t" x="510" y="392">Óvulo<tspan class="fl-s" x="510" dy="15">uno solo</tspan></text><path class="fl-l" d="M453 388 L268 384"/><circle class="fl-d" cx="268" cy="384" r="3"/></g></g></svg>`;
const FLOR_AST3_PARTES={
 estigma:{n:'Estigmas',g:'pistilo · gineceo (parte femenina)',
  d:'Dos ramas que se abren como una «Y» y reciben el polen. Quedan por fuera de la corola.',
  c:'Primero el estilo empuja el polen hacia afuera; después las ramas se abren. Así se reduce la autopolinización.'},
 estilo:{n:'Estilo',g:'pistilo · gineceo (parte femenina)',
  d:'Columna que une el ovario con los estigmas. Atraviesa el tubo formado por las anteras.',
  c:'Al crecer empuja el polen fuera del tubo de anteras.'},
 corola:{n:'Corola tubular',g:'perianto · corola',
  d:'Los pétalos están soldados en un tubo que termina en 5 lóbulos pequeños.',
  c:'En las flores del disco de un girasol suele ser amarilla o pardo-rojiza.'},
 antera:{n:'Anteras soldadas',g:'estambres · androceo (parte masculina)',
  d:'Las cinco anteras están pegadas por los lados y forman un tubo alrededor del estilo (sinanteria). El polen se libera dentro del tubo.',
  c:'Es una de las características que identifican a la familia.'},
 filamento:{n:'Filamentos',g:'estambres · androceo (parte masculina)',
  d:'Los cinco filamentos sostienen las anteras. Son libres entre sí y van pegados a la pared de la corola.',
  c:'Se ven como hilitos delgados dentro del tubo.'},
 ovario:{n:'Ovario ínfero',g:'pistilo · gineceo (parte femenina)',
  d:'Queda por debajo de la corola y del vilano. Tiene una sola cavidad con un solo óvulo. Al madurar forma una cipsela.',
  c:'La cipsela es el fruto seco típico de la familia.'},
 ovulo:{n:'Óvulo',g:'ovario · contiene la célula sexual femenina',
  d:'Hay uno solo dentro del ovario, y se convierte en la semilla.',
  c:'Por eso el fruto de las Asteraceae (la cipsela) tiene una sola semilla.'},
 vilano:{n:'Vilano',g:'cáliz transformado',
  d:'El cáliz reducido a pelos, cerdas o escamas sobre el ovario. Cuando madura el fruto ayuda a dispersarlo con el viento.',
  c:'Es el «paracaídas» del diente de león; en el girasol son dos escamas pequeñas que se caen.'}
};
const FLOR_AST3_ORDEN=['estigma','estilo','corola','antera','filamento','ovario','ovulo','vilano'];
const FLOR_AST4_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 110 520 330" role="img" aria-label="Corte de una flor ligulada de Asteraceae (tipo diente de león)"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="vilano" fill="none" stroke="#7a6a3a" stroke-width="1.6"><path d="M262 330 L230.1 318.4"/><path d="M262 330 L235.0 309.3"/><path d="M262 330 L242.5 302.1"/><path d="M262 330 L251.8 297.6"/><path d="M262 330 L262.0 296.0"/><path d="M262 330 L272.2 297.6"/><path d="M262 330 L281.5 302.1"/><path d="M262 330 L289.0 309.3"/><path d="M262 330 L293.9 318.4"/></g><g data-p="ovario"><path d="M240 420 C232 396 234 372 248 360 L276 360 C290 372 292 396 284 420 Z" fill="#cfe6a0" stroke="#55822f" stroke-width="2"/></g><g data-p="pico"><rect x="257" y="326" width="10" height="36" rx="3" fill="#b5d58a" stroke="#55822f" stroke-width="2"/></g><g data-p="tubo"><path d="M246 330 C248 312 248 296 246 278 L278 278 C276 296 276 312 278 330 Z" fill="#f6d34a" stroke="#a67c00" stroke-width="2"/></g><g data-p="ligula"><path d="M246 278 C222 252 204 200 214 148 L262 148 C268 200 272 252 278 278 Z" fill="#f6d34a" stroke="#a67c00" stroke-width="2"/><path d="M214 148 L219 134 L226 148 L233 134 L240 148 L247 134 L254 148 L259 134 L262 148" fill="#f6d34a" stroke="#a67c00" stroke-width="2"/></g><g data-p="antera"><rect x="268" y="252" width="16" height="42" rx="5" fill="#d9a441" stroke="#7a5a10" stroke-width="2"/></g><g data-p="estilo"><path d="M276 294 C278 262 280 232 282 204" fill="none" stroke="#7aa346" stroke-width="5"/></g><g data-p="estigma" fill="none" stroke="#c4543c" stroke-width="5"><path d="M282 204 C276 188 262 184 256 192"/><path d="M282 204 C290 188 304 186 310 194"/></g></g><g class="fl-r"><g data-p="ligula"><text class="fl-t" x="10" y="160">Lígula<tspan class="fl-s" x="10" dy="15">5 dientes</tspan></text><path class="fl-l" d="M73 156 L222 170"/><circle class="fl-d" cx="222" cy="170" r="3"/></g><g data-p="tubo"><text class="fl-t" x="10" y="300">Tubo de la corola<tspan class="fl-s" x="10" dy="15">muy corto</tspan></text><path class="fl-l" d="M153 296 L246 304"/><circle class="fl-d" cx="246" cy="304" r="3"/></g><g data-p="vilano"><text class="fl-t" x="10" y="340">Vilano<tspan class="fl-s" x="10" dy="15">pelos finos</tspan></text><path class="fl-l" d="M83 336 L238 326"/><circle class="fl-d" cx="238" cy="326" r="3"/></g><g data-p="ovario"><text class="fl-t" x="10" y="404">Ovario ínfero</text><path class="fl-l" d="M123 400 L244 396"/><circle class="fl-d" cx="244" cy="396" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="estigma"><text class="fl-t" x="510" y="182">Estigmas<tspan class="fl-s" x="510" dy="15">dos ramas</tspan></text><path class="fl-l" d="M435 178 L296 194"/><circle class="fl-d" cx="296" cy="194" r="3"/></g><g data-p="estilo"><text class="fl-t" x="510" y="238">Estilo</text><path class="fl-l" d="M450 234 L281 236"/><circle class="fl-d" cx="281" cy="236" r="3"/></g><g data-p="antera"><text class="fl-t" x="510" y="280">Anteras soldadas<tspan class="fl-s" x="510" dy="15">sinanteria</tspan></text><path class="fl-l" d="M374 276 L284 276"/><circle class="fl-d" cx="284" cy="276" r="3"/></g><g data-p="pico"><text class="fl-t" x="510" y="350">Pico<tspan class="fl-s" x="510" dy="15">tallito del fruto</tspan></text><path class="fl-l" d="M404 346 L268 344"/><circle class="fl-d" cx="268" cy="344" r="3"/></g></g></svg>`;
const FLOR_AST4_PARTES={
 ligula:{n:'Lígula',g:'corola · parte plana',
  d:'Parte plana de la corola, formada por 5 pétalos soldados. Su borde tiene 5 dientecitos que muestran cuántos pétalos la forman.',
  c:'Cuenta los dientes de la punta: son 5.'},
 tubo:{n:'Tubo de la corola',g:'corola · parte soldada',
  d:'Base soldada de la corola, de donde sale la lígula. Por aquí salen los estambres y el estilo.',
  c:'En una flor ligular el tubo es mucho más corto que la lígula.'},
 antera:{n:'Anteras soldadas',g:'estambres · androceo (parte masculina)',
  d:'Las cinco anteras están pegadas por los lados y forman un tubo alrededor del estilo (sinanteria).',
  c:'Se ven como un manguito oscuro en la base de la lígula, por donde sale el estilo.'},
 estilo:{n:'Estilo',g:'pistilo · gineceo (parte femenina)',
  d:'Columna que une el ovario con los estigmas y sale por el tubo de anteras.',
  c:'Al crecer empuja el polen fuera del tubo de anteras.'},
 estigma:{n:'Estigmas',g:'pistilo · gineceo (parte femenina)',
  d:'Dos ramas que se enroscan hacia afuera y reciben el polen.',
  c:'Cuando se enroscan, la flor ya es receptiva.'},
 ovario:{n:'Ovario ínfero',g:'pistilo · gineceo (parte femenina)',
  d:'Queda por debajo de la corola y el vilano; tiene un solo óvulo. Al madurar forma una cipsela.',
  c:'La cipsela es el fruto seco típico de la familia.'},
 pico:{n:'Pico',g:'tallito entre el ovario y el vilano',
  d:'Prolongación delgada del ovario que sostiene el vilano. En el fruto del diente de león se alarga mucho y eleva los pelos.',
  c:'No todas las Asteraceae tienen pico.'},
 vilano:{n:'Vilano de pelos',g:'cáliz transformado',
  d:'En el diente de león son pelos finos que forman el «paracaídas» del fruto.',
  c:'En la flor son pequeños; crecen cuando madura el fruto.'}
};
const FLOR_AST4_ORDEN=['ligula','tubo','antera','estilo','estigma','ovario','pico','vilano'];
const FLOR_AST5_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 130 520 300" role="img" aria-label="Corte de un capítulo discoide de Asteraceae"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="pedunculo"><rect x="248" y="338" width="24" height="76" rx="4" fill="#8fbf6a" stroke="#3d6b2e" stroke-width="2"/></g><g data-p="involucro" fill="#7fb069" stroke="#3d6b2e" stroke-width="2"><ellipse cx="156" cy="334" rx="42" ry="11" transform="rotate(34 156 334)"/><ellipse cx="176" cy="350" rx="40" ry="11" transform="rotate(22 176 350)"/><ellipse cx="364" cy="334" rx="42" ry="11" transform="rotate(-34 364 334)"/><ellipse cx="344" cy="350" rx="40" ry="11" transform="rotate(-22 344 350)"/></g><g data-p="receptaculo"><path d="M146 300 C168 256 352 256 374 300 L372 336 C330 356 190 356 148 336 Z" fill="#c9b27a" stroke="#6b5a2a" stroke-width="2"/></g><g data-p="disco" fill="#d9a441" stroke="#7a5a10" stroke-width="1.6"><g transform="translate(168.0 293.2) rotate(-21.7)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(191.0 282.2) rotate(-16.3)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(214.0 274.3) rotate(-10.9)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(237.0 269.6) rotate(-5.4)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(260.0 268.0) rotate(0.0)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(283.0 269.6) rotate(5.4)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(306.0 274.3) rotate(10.9)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(329.0 282.2) rotate(16.3)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(352.0 293.2) rotate(21.7)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g></g></g><g class="fl-r"><g data-p="involucro"><text class="fl-t" x="10" y="352">Involucro<tspan class="fl-s" x="10" dy="15">brácteas</tspan></text><path class="fl-l" d="M92 348 L170 358"/><circle class="fl-d" cx="170" cy="358" r="3"/></g><g data-p="pedunculo"><text class="fl-t" x="10" y="410">Pedúnculo</text><path class="fl-l" d="M92 406 L250 396"/><circle class="fl-d" cx="250" cy="396" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="disco"><text class="fl-t" x="510" y="200">Flores del disco<tspan class="fl-s" x="510" dy="15">todas tubulares</tspan></text><path class="fl-l" d="M374 196 L278 236"/><circle class="fl-d" cx="278" cy="236" r="3"/></g><g data-p="receptaculo"><text class="fl-t" x="510" y="334">Receptáculo</text><path class="fl-l" d="M412 330 L300 330"/><circle class="fl-d" cx="300" cy="330" r="3"/></g></g></svg>`;
const FLOR_AST5_PARTES={
 disco:{n:'Flores del disco',g:'todas las flores · tubulares',
  d:'En un capítulo discoide todas las flores son tubulares, con la corola de 5 lóbulos y normalmente hermafroditas. No hay flores con lígula.',
  c:'Se ve como un «botón» o un pompón sin pétalos, por ejemplo en los cardos (Cirsium).'},
 receptaculo:{n:'Receptáculo',g:'soporte común de las flores',
  d:'Ensanchamiento del extremo del pedúnculo sobre el que se insertan todas las flores. Puede tener cerdas, pelos o páleas, según el género.',
  c:'En el cardo suele tener cerdas entre las flores.'},
 involucro:{n:'Involucro',g:'brácteas que rodean el capítulo',
  d:'Conjunto de brácteas que rodean la base del capítulo. En muchos cardos son espinosas.',
  c:'Parecen un cáliz, pero no lo son: el cáliz de cada flor está reducido al vilano.'},
 pedunculo:{n:'Pedúnculo',g:'soporte del capítulo',
  d:'Tallo que sostiene el capítulo.',
  c:'Su grosor y si es hueco o macizo cambian según la especie.'}
};
const FLOR_AST5_ORDEN=['disco','receptaculo','involucro','pedunculo'];
const FLOR_AST6_SVG=`<svg id="flsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 130 520 300" role="img" aria-label="Corte de un capítulo disciforme de Asteraceae"><g class="fl-f" stroke-linejoin="round" stroke-linecap="round"><g data-p="pedunculo"><rect x="248" y="338" width="24" height="76" rx="4" fill="#8fbf6a" stroke="#3d6b2e" stroke-width="2"/></g><g data-p="involucro" fill="#7fb069" stroke="#3d6b2e" stroke-width="2"><ellipse cx="156" cy="334" rx="42" ry="11" transform="rotate(34 156 334)"/><ellipse cx="176" cy="350" rx="40" ry="11" transform="rotate(22 176 350)"/><ellipse cx="364" cy="334" rx="42" ry="11" transform="rotate(-34 364 334)"/><ellipse cx="344" cy="350" rx="40" ry="11" transform="rotate(-22 344 350)"/></g><g data-p="receptaculo"><path d="M146 300 C168 256 352 256 374 300 L372 336 C330 356 190 356 148 336 Z" fill="#c9b27a" stroke="#6b5a2a" stroke-width="2"/></g><g data-p="marginales" fill="#e9b8a6" stroke="#8c4a35" stroke-width="1.5"><g transform="translate(158.0 299.0) rotate(-24.1)"><rect x="-2.5" y="-36" width="5" height="36" rx="2"/><path d="M0 -36 C-6 -44 -9 -46 -10 -43 M0 -36 C6 -44 9 -46 10 -43" fill="none" stroke="#c4543c" stroke-width="2"/></g><g transform="translate(172.0 291.0) rotate(-20.8)"><rect x="-2.5" y="-36" width="5" height="36" rx="2"/><path d="M0 -36 C-6 -44 -9 -46 -10 -43 M0 -36 C6 -44 9 -46 10 -43" fill="none" stroke="#c4543c" stroke-width="2"/></g><g transform="translate(348.0 291.0) rotate(20.8)"><rect x="-2.5" y="-36" width="5" height="36" rx="2"/><path d="M0 -36 C-6 -44 -9 -46 -10 -43 M0 -36 C6 -44 9 -46 10 -43" fill="none" stroke="#c4543c" stroke-width="2"/></g><g transform="translate(362.0 299.0) rotate(24.1)"><rect x="-2.5" y="-36" width="5" height="36" rx="2"/><path d="M0 -36 C-6 -44 -9 -46 -10 -43 M0 -36 C6 -44 9 -46 10 -43" fill="none" stroke="#c4543c" stroke-width="2"/></g></g><g data-p="disco" fill="#d9a441" stroke="#7a5a10" stroke-width="1.6"><g transform="translate(192.0 281.8) rotate(-16.1)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(215.0 274.0) rotate(-10.6)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(238.0 269.4) rotate(-5.2)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(261.0 268.0) rotate(0.2)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(284.0 269.7) rotate(5.7)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(307.0 274.6) rotate(11.1)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g><g transform="translate(330.0 282.6) rotate(16.5)"><rect x="-6" y="-46" width="12" height="46" rx="3"/><path d="M-6 -46 L-9 -55 L-3 -50 L0 -58 L3 -50 L9 -55 L6 -46 Z" fill="#8a5a1c"/></g></g></g><g class="fl-r"><g data-p="marginales"><text class="fl-t" x="10" y="226">Flores marginales<tspan class="fl-s" x="10" dy="15">filiformes · sin lígula</tspan></text><path class="fl-l" d="M153 222 L154 262"/><circle class="fl-d" cx="154" cy="262" r="3"/></g><g data-p="involucro"><text class="fl-t" x="10" y="352">Involucro<tspan class="fl-s" x="10" dy="15">brácteas</tspan></text><path class="fl-l" d="M92 348 L170 358"/><circle class="fl-d" cx="170" cy="358" r="3"/></g><g data-p="pedunculo"><text class="fl-t" x="10" y="410">Pedúnculo</text><path class="fl-l" d="M92 406 L250 396"/><circle class="fl-d" cx="250" cy="396" r="3"/></g></g><g class="fl-r" text-anchor="end"><g data-p="disco"><text class="fl-t" x="510" y="200">Flores del disco<tspan class="fl-s" x="510" dy="15">tubulares</tspan></text><path class="fl-l" d="M374 196 L278 236"/><circle class="fl-d" cx="278" cy="236" r="3"/></g><g data-p="receptaculo"><text class="fl-t" x="510" y="334">Receptáculo</text><path class="fl-l" d="M412 330 L300 330"/><circle class="fl-d" cx="300" cy="330" r="3"/></g></g></svg>`;
const FLOR_AST6_PARTES={
 marginales:{n:'Flores marginales',g:'flores del borde · femeninas',
  d:'En un capítulo disciforme las flores del borde son femeninas y filiformes: muy delgadas, sin lígula, con solo el pistilo y una corola diminuta o ausente.',
  c:'Se parecen a hilitos alrededor de las flores centrales, y no forman «pétalos». Es lo que distingue al disciforme del discoide.'},
 disco:{n:'Flores del disco',g:'flores del centro · tubulares',
  d:'Las flores centrales son tubulares y suelen ser hermafroditas (o masculinas), como en el capítulo discoide.',
  c:'Se ven iguales a las del disco de un girasol.'},
 receptaculo:{n:'Receptáculo',g:'soporte común de las flores',
  d:'Ensanchamiento del extremo del pedúnculo sobre el que se insertan todas las flores.',
  c:'Puede tener pelos o páleas según el género.'},
 involucro:{n:'Involucro',g:'brácteas que rodean el capítulo',
  d:'Conjunto de brácteas que rodean la base del capítulo y lo protegen cuando es botón.',
  c:'Suelen ser secas y a veces escariosas (como papel) en los géneros de capítulos disciformes.'},
 pedunculo:{n:'Pedúnculo',g:'soporte del capítulo',
  d:'Tallo que sostiene el capítulo.',
  c:'Su grosor y si es hueco o macizo cambian según la especie.'}
};
const FLOR_AST6_ORDEN=['marginales','disco','receptaculo','involucro','pedunculo'];
const FLOR_VISTAS_AST=[['asteraceae','Radiado'],['asteraceae_l','Ligulado'],['asteraceae_d','Discoide'],['asteraceae_s','Disciforme'],['asteraceae_t','Flor tubular'],['asteraceae_g','Flor ligulada']];
/* Un diagrama por familia (clave = nombre sin tildes ni mayúsculas). Si la familia no está aquí se usa el esquema general. */
const FLOR_GEN={qvb:'140 180 240 290',svg:FLOR_SVG,partes:FLOR_PARTES,orden:FLOR_ORDEN,sub:'Corte longitudinal de una flor completa (esquema general).',pie:'Es un esquema general: cada familia tiene sus variaciones (flores sin cáliz o sin corola, estambres soldados, ovario ínfero, etc.).'};
const FLOR_DIAG={
 asteraceae:{vistas:FLOR_VISTAS_AST,qvb:'20 140 480 290',svg:FLOR_AST1_SVG,partes:FLOR_AST1_PARTES,orden:FLOR_AST1_ORDEN,sub:'Capítulo radiado (tipo girasol) en corte: muchas flores pequeñas juntas que parecen una sola.',pie:'Un capítulo parece una flor, pero son muchas flores pequeñas sobre un receptáculo común. Hay cuatro tipos principales: radiado (flores del radio y del disco: girasol, margarita; Helianthus, Aster), ligulado (solo flores con lígula: diente de león, lechuga; Taraxacum), discoide (solo flores tubulares: cardos; Cirsium) y disciforme (flores marginales filiformes y centrales tubulares: Gnaphalium). Usa los botones para ver cada uno.'},
 araceae:{vistas:FLOR_VISTAS_ARA,qvb:'170 24 210 450',svg:FLOR_ARA_SVG,partes:FLOR_ARA_PARTES,orden:FLOR_ARA_ORDEN,sub:'Corte longitudinal de una inflorescencia de arácea (espata y espádice): diagrama propio de la familia Araceae.',pie:'En las aráceas lo que parece una flor es una inflorescencia. El dibujo muestra el tipo de espata con cámara y espádice con apéndice; en Anthurium, Monstera o Philodendron la espata y el espádice se ven distintos y las flores pueden ser hermafroditas.'},
 orchidaceae:{qvb:'80 40 360 360',svg:FLOR_ORQ_SVG,partes:FLOR_ORQ_PARTES,orden:FLOR_ORQ_ORDEN,sub:'Vista frontal de una orquídea (tipo Phalaenopsis): diagrama propio de la familia Orchidaceae.',pie:'Hay mucha variación entre géneros de orquídeas; por ejemplo, en Paphiopedilum el labelo forma un «zapatito» y hay dos anteras fértiles.'}
};
/* Vistas extra de una familia (no se eligen por la familia de la ficha, sino con los botones de vista) */
const FLOR_EXTRA={
 asteraceae_d:{vistas:FLOR_VISTAS_AST,qvb:'20 140 480 290',svg:FLOR_AST5_SVG,partes:FLOR_AST5_PARTES,orden:FLOR_AST5_ORDEN,sub:'Capítulo discoide (ejemplo: cardo, Cirsium) en corte: todas las flores son tubulares.',pie:'En el capítulo discoide no hay flores del radio ni lígulas. Hay cardos (Cirsium) y otros géneros que lo tienen. Algunos géneros, como Artemisia, se describen como discoides o como disciformes según la especie y el autor.'},
 asteraceae_s:{vistas:FLOR_VISTAS_AST,qvb:'20 140 480 290',svg:FLOR_AST6_SVG,partes:FLOR_AST6_PARTES,orden:FLOR_AST6_ORDEN,sub:'Capítulo disciforme (ejemplo: Gnaphalium) en corte: flores marginales filiformes y flores del disco tubulares.',pie:'El capítulo disciforme es como el discoide, pero las flores del borde son femeninas y filiformes. Se describe en géneros como Gnaphalium y, según el autor, en algunas Artemisia.'},
 asteraceae_l:{vistas:FLOR_VISTAS_AST,qvb:'90 150 340 280',svg:FLOR_AST2_SVG,partes:FLOR_AST2_PARTES,orden:FLOR_AST2_ORDEN,sub:'Capítulo ligulado (tipo diente de león) en corte: todas las flores tienen lígula.',pie:'En un capítulo ligulado no hay flores tubulares. Suele haber látex blanco en la planta. El discoide es como el radiado, pero sin flores del radio, y el disciforme tiene flores marginales filiformes.'},
 asteraceae_t:{vistas:FLOR_VISTAS_AST,qvb:'190 120 140 300',svg:FLOR_AST3_SVG,partes:FLOR_AST3_PARTES,orden:FLOR_AST3_ORDEN,sub:'Flor tubular (del disco) de una Asteraceae en corte longitudinal.',pie:'Es la flor de las zonas centrales del capítulo radiado y de todo el capítulo discoide. Todas las Asteraceae tienen las anteras soldadas en tubo.'},
 asteraceae_g:{vistas:FLOR_VISTAS_AST,qvb:'190 124 140 310',svg:FLOR_AST4_SVG,partes:FLOR_AST4_PARTES,orden:FLOR_AST4_ORDEN,sub:'Flor ligulada (tipo diente de león) en corte longitudinal.',pie:'La flor ligulada es la de todo el capítulo del diente de león y la lechuga. En las flores del radio del girasol la lígula es parecida, pero la flor suele ser estéril.'},
 araceae_f:{vistas:FLOR_VISTAS_ARA,qvb:'160 170 200 230',svg:FLOR_ARAF_SVG,partes:FLOR_ARAF_PARTES,orden:FLOR_ARAF_ORDEN,sub:'Flor femenina de una arácea en corte longitudinal (diagrama propio).',pie:'Cada flor femenina es un pistilo casi desnudo sobre el espádice. El número de lóculos y de óvulos cambia según el género.'},
 araceae_m:{vistas:FLOR_VISTAS_ARA,qvb:'170 160 180 240',svg:FLOR_ARAM_SVG,partes:FLOR_ARAM_PARTES,orden:FLOR_ARAM_ORDEN,sub:'Flor masculina de una arácea en corte longitudinal: un estambre (diagrama propio).',pie:'Una flor masculina puede tener de uno a varios estambres, libres o fundidos entre sí. Aquí se dibuja uno solo para ver sus partes.'}
};
const FLOR_SIN={compositae:'asteraceae'};   // nombres antiguos de familias
const florClaveFam=f=>{const k=florNorm(f);return FLOR_SIN[k]||k};
const florPorClave=k=>FLOR_DIAG[k]||FLOR_EXTRA[k]||null;
let florSet=FLOR_GEN,florBuilt=null;

/* Resalta una parte (y su rótulo) y muestra su explicación. Tocarla otra vez la deselecciona. */
function florSel(id){
 const b=document.getElementById('flbox'),s=b&&b.querySelector('svg');
 if(!s)return;
 if(id&&s.dataset.sel===id)id='';
 s.dataset.sel=id||'';
 s.classList.toggle('fl-has',!!id);
 s.querySelectorAll('[data-p]').forEach(e=>e.classList.toggle('fl-sel',!!id&&e.dataset.p===id));
 document.querySelectorAll('#flchips button').forEach(c=>c.classList.toggle('on',!!id&&c.dataset.p===id));
 const p=id&&florSet.partes[id],c=document.getElementById('fldef');
 if(c)c.innerHTML=p
  ?'<h3>'+p.n+'<small>'+p.g+'</small></h3><p>'+p.d+'</p><p class="hint">'+p.c+'</p>'
  :'<p class="hint">Toca una parte del esquema, o uno de los botones, para ver qué es y cómo reconocerla.</p>';
}
function florPintar(set){
 const b=document.getElementById('flbox');
 if(!b)return;
 florSet=set;florBuilt=set;
 b.innerHTML=set.svg;
 const ch=document.getElementById('flchips'),su=document.getElementById('flsub'),pi=document.getElementById('flpie'),vi=document.getElementById('flvistas');
 if(ch)ch.innerHTML=set.orden.map(k=>'<button type="button" data-p="'+k+'">'+set.partes[k].n+'</button>').join('');
 if(su)su.textContent=set.sub;
 if(pi)pi.textContent=set.pie;
 if(vi){
  vi.hidden=!set.vistas;
  vi.innerHTML=set.vistas?set.vistas.map(v=>'<button type="button" data-v="'+v[0]+'" class="'+(florPorClave(v[0])===set?'on':'')+'">'+v[1]+'</button>').join(''):'';
 }
 florSel('');
}
function florVista(k){
 const set=florPorClave(k);
 if(set&&set!==florBuilt)florPintar(set);
}
function abrirFlor(sp){
 const d=document.getElementById('dlgflor'),b=document.getElementById('flbox');
 if(!d||!b)return;
 const fam=sp&&sp.familia,set=(fam&&FLOR_DIAG[florClaveFam(fam)])||FLOR_GEN;
 if(florBuilt!==set)florPintar(set);   // se dibuja al abrir por primera vez o al cambiar de diagrama/vista
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
 {n:'Asteraceae',a:['compositae'],f:[{l:'flor del disco',s:'✱',K:'0 (vilano)',C:'(5)',A:'(5)',G:'(2)',o:'i'},{l:'flor del rayo',s:'↓',K:'0 (vilano)',C:'(5) lígula',A:'0',G:'(2)',o:'i'},{l:'flor ligulada (diente de león)',s:'↓',K:'0 (vilano)',C:'(5) lígula',A:'(5)',G:'(2)',o:'i'}],t:'Las «flores» que ves son capítulos: muchas florecillas juntas rodeadas de brácteas. Hay capítulos radiados (girasol, margarita: flores del disco y del rayo), ligulados (diente de león, lechuga: todas con lígula), discoides (cardos: solo flores tubulares) y disciformes (flores marginales filiformes). Anteras soldadas en tubo (sinanteria); el fruto es una cipsela.'},
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
  const v=e.target.closest&&e.target.closest('[data-v]');
  if(v&&d.contains(v))return florVista(v.dataset.v);
  const t=e.target.closest&&e.target.closest('[data-p]');
  if(t&&d.contains(t))florSel(t.dataset.p);
 });
});
