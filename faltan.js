/* ============================================================
   faltan.js · Biotaxo dex
   «🌿 Familias sin diagrama» (menú ⋮): lista de familias de plantas
   con flor (Magnoliopsida y Liliopsida) que todavía NO tienen
   diagrama de flor propio. Se actualiza sola:
   · una familia con diagrama (FLOR_DIAG en flor.js) desaparece;
   · una familia nueva de Plantae que agregues a tu app aparece arriba.
   Arriba van las familias que TÚ tienes; abajo, una lista de referencia
   de familias comunes para saber cuáles podrían faltar.
   Usa data, esc, florNorm, florClaveFam, FLOR_DIAG, florBuscarFam
   (flor.js) y setMenu (index.html); solo se llaman al ejecutar.
   Se carga ANTES del <script> principal de index.html.
   ============================================================ */
const FALTA_M='Magnoliopsida',FALTA_L='Liliopsida';
const FALTA_REF=[
 // [familia, clase, ejemplos]
 ['Acanthaceae',FALTA_M,'acanto, tumbergia'],['Amaranthaceae',FALTA_M,'amaranto, espinaca, remolacha'],['Anacardiaceae',FALTA_M,'mango, marañón'],
 ['Annonaceae',FALTA_M,'guanábana, chirimoya'],['Apiaceae',FALTA_M,'zanahoria, cilantro, perejil'],['Apocynaceae',FALTA_M,'adelfa, alamanda'],
 ['Aristolochiaceae',FALTA_M,'pipa, aristoloquia'],['Begoniaceae',FALTA_M,'begonia'],['Bignoniaceae',FALTA_M,'guayacán, jacarandá'],
 ['Bixaceae',FALTA_M,'achiote'],['Boraginaceae',FALTA_M,'borraja, nomeolvides'],['Brassicaceae',FALTA_M,'repollo, brócoli, mostaza'],
 ['Cactaceae',FALTA_M,'cactus, pitaya'],['Caryophyllaceae',FALTA_M,'clavel'],['Clusiaceae',FALTA_M,'mangostán, chagualo'],
 ['Convolvulaceae',FALTA_M,'batata, bejuco de la mañana'],['Cucurbitaceae',FALTA_M,'ahuyama, pepino, sandía'],['Ericaceae',FALTA_M,'arándano, azalea'],
 ['Euphorbiaceae',FALTA_M,'yuca, ricino, poinsetia'],['Fabaceae',FALTA_M,'fríjol, guamo, acacia'],['Fagaceae',FALTA_M,'roble, encino'],
 ['Gesneriaceae',FALTA_M,'violeta africana'],['Lamiaceae',FALTA_M,'menta, albahaca, romero'],['Lauraceae',FALTA_M,'aguacate, canela'],
 ['Lecythidaceae',FALTA_M,'nuez de Brasil, coco de mono'],['Lythraceae',FALTA_M,'granado, cufea'],['Magnoliaceae',FALTA_M,'magnolia'],
 ['Malpighiaceae',FALTA_M,'acerola, nance'],['Malvaceae',FALTA_M,'hibisco, cacao, algodón, ceiba'],['Melastomataceae',FALTA_M,'sietecueros'],
 ['Moraceae',FALTA_M,'higuera, caucho'],['Myrtaceae',FALTA_M,'guayaba, eucalipto'],['Nyctaginaceae',FALTA_M,'bugambilia'],
 ['Onagraceae',FALTA_M,'fucsia'],['Oxalidaceae',FALTA_M,'carambolo, acedera menor'],['Papaveraceae',FALTA_M,'amapola'],
 ['Passifloraceae',FALTA_M,'maracuyá, gulupa'],['Piperaceae',FALTA_M,'pimienta, cordoncillo'],['Plantaginaceae',FALTA_M,'llantén, digital'],
 ['Polygonaceae',FALTA_M,'acedera, trigo sarraceno'],['Primulaceae',FALTA_M,'primavera, ciclamen'],['Ranunculaceae',FALTA_M,'ranúnculo, clemátide'],
 ['Rhizophoraceae',FALTA_M,'mangle rojo'],['Rosaceae',FALTA_M,'rosa, fresa, manzana'],['Rubiaceae',FALTA_M,'café'],
 ['Rutaceae',FALTA_M,'naranja, limón'],['Salicaceae',FALTA_M,'sauce, álamo'],['Sapindaceae',FALTA_M,'lichi, jabonillo'],
 ['Solanaceae',FALTA_M,'tomate, papa, ají'],['Urticaceae',FALTA_M,'ortiga, yarumo'],['Verbenaceae',FALTA_M,'verbena, lantana'],
 ['Vitaceae',FALTA_M,'uva'],
 ['Alismataceae',FALTA_L,'lengua de agua'],['Amaryllidaceae',FALTA_L,'cebolla, ajo, amarilis'],['Arecaceae',FALTA_L,'palmas, coco'],
 ['Asparagaceae',FALTA_L,'espárrago, agave'],['Bromeliaceae',FALTA_L,'piña, bromelias'],['Cannaceae',FALTA_L,'achira'],
 ['Commelinaceae',FALTA_L,'siempreviva, canutillo'],['Costaceae',FALTA_L,'caña agria'],['Cyclanthaceae',FALTA_L,'iraca'],
 ['Cyperaceae',FALTA_L,'papiro, juncos'],['Dioscoreaceae',FALTA_L,'ñame'],['Iridaceae',FALTA_L,'iris, gladiolo'],
 ['Juncaceae',FALTA_L,'juncos'],['Liliaceae',FALTA_L,'lirio, tulipán'],['Marantaceae',FALTA_L,'bijao, maranta'],
 ['Musaceae',FALTA_L,'banano, plátano'],['Poaceae',FALTA_L,'maíz, arroz, pastos, bambú'],['Pontederiaceae',FALTA_L,'buchón de agua'],
 ['Smilacaceae',FALTA_L,'zarzaparrilla'],['Strelitziaceae',FALTA_L,'ave del paraíso'],['Typhaceae',FALTA_L,'enea'],
 ['Zingiberaceae',FALTA_L,'jengibre, cúrcuma']
];
const FALTA_NOMBRE_CLASE={Magnoliopsida:'Magnoliopsida · dicotiledóneas',Liliopsida:'Liliopsida · monocotiledóneas',otra:'Clase sin definir'};
let faltaTxt='';
const faltaTiene=f=>!!FLOR_DIAG[florClaveFam(f)];
function faltaCalc(){
 const ref={};FALTA_REF.forEach(r=>{ref[florNorm(r[0])]=r});
 const mias={};
 (typeof data!=='undefined'?data:[]).forEach(s=>{
  if(s.reino!=='Plantae')return;
  const f=String(s.familia||'').trim();if(!f)return;
  const k=florClaveFam(f),m=mias[k]||(mias[k]={nombre:f,n:0,clase:''});
  m.n++;if(!m.clase&&s.clase)m.clase=String(s.clase).trim();
 });
 const OTRAS=/^(pinopsida|polypodiopsida|bryopsida|lycopodiopsida|equisetopsida|marchantiopsida|jungermanniopsida|sphagnopsida|andreaeopsida|cycadopsida|ginkgoopsida|gnetopsida|isoetopsida|psilotopsida|polytrichopsida|anthocerotopsida)$/;
 const tuyas=[];
 Object.keys(mias).forEach(k=>{
  const m=mias[k];if(faltaTiene(k))return;
  const r=ref[k],cl=florNorm(m.clase);
  let clase=cl==='magnoliopsida'?FALTA_M:cl==='liliopsida'?FALTA_L:(r?r[1]:'otra');
  if(!r&&cl&&cl!=='magnoliopsida'&&cl!=='liliopsida'&&OTRAS.test(cl)&&cl!=='equisetopsida')return;   // helechos, coníferas, musgos: no llevan flor
  tuyas.push({nombre:m.nombre,n:m.n,clase,ej:r?r[2]:'',formula:!!florBuscarFam(m.nombre)});
 });
 const ya=[...new Set(Object.keys(FLOR_DIAG).map(florClaveFam))].map(k=>k.charAt(0).toUpperCase()+k.slice(1)).sort();
 const sin=FALTA_REF.filter(r=>!faltaTiene(r[0])&&!mias[florNorm(r[0])]).map(r=>({nombre:r[0],clase:r[1],ej:r[2],formula:!!florBuscarFam(r[0])}));
 const ord=(a,b)=>a.nombre.localeCompare(b.nombre,'es');
 tuyas.sort(ord);sin.sort(ord);
 return{tuyas,sin,ya};
}
function faltaFila(x){
 return '<li><b>'+esc(x.nombre)+'</b>'+(x.n?' <span class="fanum">'+x.n+(x.n===1?' especie':' especies')+'</span>':'')
  +(x.ej?'<small>'+esc(x.ej)+'</small>':'')+(x.formula?' <span class="fatag" title="Ya tiene fórmula floral en la app">🧬 fórmula</span>':'')+'</li>';
}
function faltaGrupos(L){
 return ['Magnoliopsida','Liliopsida','otra'].map(c=>{
  const g=L.filter(x=>x.clase===c);
  return g.length?'<h4>'+FALTA_NOMBRE_CLASE[c]+' <small>'+g.length+'</small></h4><ul class="falist">'+g.map(faltaFila).join('')+'</ul>':'';
 }).join('');
}
function faltaPintar(){
 const b=document.getElementById('faltabody');if(!b)return;
 const q=florNorm((document.getElementById('faltaq')||{}).value);
 const C=faltaCalc();
 const f=L=>q?L.filter(x=>florNorm(x.nombre).includes(q)||florNorm(x.ej).includes(q)):L;
 const T=f(C.tuyas),S=f(C.sin);
 faltaTxt=C.tuyas.map(x=>x.nombre).join(', ');
 b.innerHTML='<p class="hint">Familias de plantas con flor que aún no tienen diagrama. Ya tienen: <b>'+C.ya.length+'</b> ('+esc(C.ya.join(', '))+').</p>'
  +'<h3>📌 En tu app <small>'+C.tuyas.length+'</small></h3>'
  +(C.tuyas.length?(T.length?faltaGrupos(T):'<p class="hint">Ninguna coincide con la búsqueda.</p>'):'<p class="hint">'+(C.tuyas.length===0&&(typeof data!=='undefined'&&data.some(s=>s.reino==='Plantae'))?'¡Todas las familias de plantas que tienes ya tienen diagrama!':'Todavía no tienes plantas con familia escrita en tu app.')+'</p>')
  +'<h3>📚 Familias comunes que no tienes en tu app <small>'+C.sin.length+'</small></h3>'
  +'<p class="hint">Solo de referencia: se agregan a tu lista de arriba apenas registres una planta de esa familia.</p>'
  +(S.length?faltaGrupos(S):'<p class="hint">Ninguna coincide con la búsqueda.</p>');
 const cp=document.getElementById('faltacp');if(cp)cp.hidden=!C.tuyas.length;
}
function abrirFaltan(){
 const d=document.getElementById('dlgfalta');if(!d)return;
 const q=document.getElementById('faltaq');if(q)q.value='';
 const m=document.getElementById('faltamsg');if(m)m.textContent='';
 faltaPintar();
 d.showModal();
}
document.addEventListener('DOMContentLoaded',()=>{
 const d=document.getElementById('dlgfalta'),b=document.getElementById('faltab');
 if(b)b.onclick=()=>{if(typeof setMenu==='function')setMenu(false);abrirFaltan()};
 if(!d)return;
 const x=document.getElementById('faltax');if(x)x.onclick=()=>d.close();
 const q=document.getElementById('faltaq');if(q)q.oninput=faltaPintar;
 const cp=document.getElementById('faltacp');
 if(cp)cp.onclick=async()=>{
  const m=document.getElementById('faltamsg');
  try{await navigator.clipboard.writeText(faltaTxt);if(m)m.textContent='Copiado: '+faltaTxt}
  catch(_){if(m)m.textContent='No pude copiar. Esta es tu lista: '+faltaTxt}
 };
});
