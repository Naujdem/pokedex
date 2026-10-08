/* ============================================================
   formulario.js · Biotaxo dex
   Todo lo del formulario de añadir / editar especie:
     S, T, A, M, UNIV, ESP, CAMPO, TXN, TAXR, LABEL, FD...  → los campos y sus opciones
     fHTML, ordF, buildRasgos, collectRasgos, fillRasgos, depAll, legacy → dibujar y leer el formulario
     openEdit, drawThumbs, resize, el botón «Guardar» (save), fotos y etiquetas Flor/Hoja/Fruto
     EXIF (exifRead, exifFill), descripciones por nivel (txLabels, txFind, txSync)
     sugerencia de foto
   Se carga ANTES de inat.js y del <script> principal de index.html.
   Al cargar solo declara funciones y datos: los botones y la construcción de los
   campos se hacen en initFormulario(), que corre en DOMContentLoaded (y antes que
   el DOMContentLoaded de inat.js, que usa drawThumbs, formFotos y window.onDrawThumbs).
   Usa cosas de otros archivos (dlg, data, editId, LV, LN, esc, $, persist, ...) solo
   cuando se ejecuta. distLoad (el mapa del formulario) sigue en map.js.
   (Código movido tal cual desde index.html, sin cambios de lógica.)
   ============================================================ */

/* ---------- Características: s = lista + "Otra…", t = texto corto, a = texto largo ---------- */
const OTRA='__otra';
const S=(key,label,opts,ph)=>({key,label,t:'s',opts,ph});
const T=(key,label,ph)=>({key,label,t:'t',ph});
const A=(key,label,ph)=>({key,label,t:'a',ph});
/* M = selección múltiple en cuadros. items: [icono, valor, texto corto opcional]. x: {ex:'valor exclusivo', al:{valorAntiguo:valorNuevo}} */
const M=(key,label,items,ph,x)=>Object.assign({key,label,t:'m',items,opts:items.map(i=>i[1]),ph},x||{});
const UNIV=[
 M('uicn','Estado de conservación (UICN)',[['🔵','Preocupación Menor (LC)'],['🟡','Casi Amenazado (NT)'],['🟠','Vulnerable (VU)'],['🔴','En Peligro (EN)'],['🟣','En Peligro Crítico (CR)'],['⚫','Extinto en Estado Silvestre (EW)'],['⬛','Extinto (EX)'],['❔','Datos Insuficientes (DD)']],'',{ex:1}),
 Object.assign(M('origen','Origen / Endemismo',[['🌍','Exótico / Introducido'],['🏠','Endémico']],'',{ex:1}),{noOtra:1}),
 Object.assign(T('origen_lugar','Lugar de endemismo / introducción','Ej: Andes colombianos, Madagascar…'),{dep:1,lab:r=>r.origen==='Endémico'?'Endémico de':'Introducido desde'}),
 M('habitat','Hábitat',[['🏙️','Ciudades'],['🌲','Bosques'],['🌴','Bosque húmedo tropical'],['🏔️','Bosques andinos de montaña'],['🍂','Bosques secos tropicales'],['🌵','Matorrales'],['🌾','Sabana'],['🏜️','Desierto'],['🦆','Humedal'],['🏖️','Costa'],['⛰️','Montaña'],['🕳️','Cuevas'],['🌴','Selva'],['🛣️','Bordes de caminos'],['🚜','Antrópico / agroecosistemas']]),
 M('peligro','Nivel de peligrosidad / toxicidad',[['🕊️','Inofensivo'],['☠️','Venenoso'],['🐍','Ponzoñoso'],['⚠️','Irritante'],['🦠','Patógeno']],'',{ex:'Inofensivo'}),
 T('tamano','Tamaño / dimensiones','Longitud, altura, envergadura, diámetro…'),
 T('ciclo','Ciclo de vida','Anual, bienal, perenne; fases principales…'),
 T('longevidad','Longevidad','Esperanza de vida aproximada'),
 M('metamorfosis','Metamorfosis',[['🦋','Completa (holometábola)'],['🦗','Incompleta (hemimetábola)'],['🐛','Sin metamorfosis (desarrollo directo)']],'',{ex:1}),
 M('poblacion','Estado poblacional / tendencia',[['➡️','Estable'],['⬇️','En declive'],['⬆️','En aumento']],'',{ex:1}),
 T('amenazas','Amenazas principales','Pérdida de hábitat, caza, contaminación…'),
 T('ecologica','Importancia ecológica','Polinizador, dispersor de semillas, depredador tope, bioindicador…'),
 T('humanos','Interacciones con humanos','Beneficio económico, conflicto, uso cultural/tradicional'),
 T('legal','Estatus legal','Protegida, veda, CITES…'),
 A('diagnosticas','Características diagnósticas','Rasgos clave para identificarla'),
 T('similares','Especies similares / confusiones frecuentes'),
 A('curiosos','Datos curiosos o culturales'),
 A('fuentes','Referencias / fuentes')
];
const ESP={
 Animalia:[
  M('an_defensa','Mecanismo de defensa / ataque',[['☠️','Venenoso'],['🐍','Ponzoñoso'],['🦎','Camuflaje'],['🐢','Armadura / Caparazón'],['🤢','Química por olor desagradable'],['🚫','Ninguno']],'',{ex:'Ninguno'}),
  M('an_dieta','Dieta / trofismo',[['🌿','Herbívoro'],['🥩','Carnívoro'],['🍽️','Omnívoro'],['🍎','Frugívoro'],['🐛','Fitófago'],['🍂','Detritívoro'],['🩸','Hematófago']]),
  M('an_actividad','Patrón de actividad',[['☀️','Diurno'],['🌙','Nocturno'],['🌅','Crepuscular']]),
  M('an_habitos','Hábitos de vida',[['🧍','Solitario'],['👥','Gregario'],['🐝','Eusocial']],'',{al:{'Gregario (manada / bandada)':'Gregario','Social (eusocial)':'Eusocial'}}),
  M('an_respiracion','Tipo de respiración',[['🫁','Pulmonar'],['🐟','Branquial'],['🐸','Cutánea'],['🪲','Traqueal']]),
  M('an_reproduccion','Reproducción / desarrollo',[['🥚','Ovíparo'],['🍼','Vivíparo'],['🐣','Ovovivíparo']]),
  T('an_camada','Tamaño de camada / número de crías'),
  M('an_locomocion','Tipo de locomoción',[['🏃','Cursorial'],['🦘','Saltador'],['🦅','Volador'],['🧗','Trepador'],['⛏️','Excavador'],['🏊','Nadador']]),
  M('an_sentidos','Sensibilidad sensorial destacada',[['👁️','Visión'],['👃','Olfato'],['🦇','Ecolocación'],['⚡','Electrorrecepción'],['🧪','Quimiorrecepción']]),
  M('an_territorialidad','Territorialidad',[['🛡️','Territorial'],['🕊️','No territorial'],['✈️','Migratorio']],'',{ex:1}),
  M('an_estrategia','Estrategia reproductiva',[['🐘','K estratega'],['🐁','r estratega']],'',{ex:1}),
  Object.assign(M('an_dimorfismo','Dimorfismo sexual',[['👫','Presente'],['🧍','Ausente']],'',{ex:1}),{noOtra:1}),
  Object.assign(A('an_dimorfismo_dif','Diferencia entre sexos','Ej: el macho es más grande y colorido'),{dep:1}),
  T('an_nido','Tipo de nido / refugio'),
  M('anat_grupo','Grupo de artrópodo (si aplica)',[['🦗','Insecto'],['🕷️','Arácnido'],['🦀','Crustáceo'],['🪱','Miriápodo'],['🦐','Otro artrópodo']],'',{ex:1}),
  M('anat_patas','Número de patas',[['🐍','Sin patas'],['🦩','2 patas'],['🐆','4 patas'],['🐜','6 patas'],['🕷️','8 patas'],['🦐','10 patas'],['🐛','Muchas']],'',{ex:'Sin patas'}),
  M('anat_alas','Tipo de alas',[['🚫','Sin alas'],['🦋','Un par'],['🐝','Dos pares'],['🪲','Élitros'],['🦟','Halterios']],'',{ex:'Sin alas'}),
  M('anat_esqueleto','Tipo de esqueleto',[['🦈','Cartilaginoso'],['🦴','Óseo'],['💧','Hidrostático'],['🪲','Quitinoso'],['🪱','Sin esqueleto']],'',{ex:'Sin esqueleto'}),
  M('anat_cobertura','Cobertura corporal',[['🐻','Pelo'],['🪶','Plumas'],['🐍','Escamas'],['🐸','Piel desnuda'],['🦗','Quitina'],['🐚','Concha'],['🦔','Espinas']]),
  M('anat_segmentacion','Segmentación del cuerpo',[['⚪','No segmentado'],['🐜','Cabeza-tórax-abdomen'],['🕷️','Cefalotórax-abdomen'],['🪱','Anillos'],['❓','Otros']],'',{ex:1}),
  M('anat_bucal','Tipo de aparato bucal',[['🦗','Masticador'],['🦋','Chupador'],['🦟','Picador-suctor'],['🐝','Lamedor'],['🦪','Filtrador'],['🪰','Espongívoro']],'',{ex:1}),
  M('anat_antenas','Número de antenas',[['🚫','Sin antenas'],['🐜','Un par'],['🦐','Dos pares']],'',{ex:'Sin antenas'}),
  M('anat_fecundacion','Tipo de fecundación',[['🌊','Externa'],['🔒','Interna']],'',{ex:1}),
  Object.assign(M('ar_grupo','Tipo de arácnido',[['🕷️','Araña'],['🦂','Escorpión'],['🕸️','Opilión'],['🦟','Ácaro'],['🦀','Garrapata']],'',{ex:1}),{dep:1}),
  Object.assign(M('ar_ojos','Número de ojos',[['2','2 ojos'],['4','4 ojos'],['6','6 ojos'],['8','8 ojos'],['0','Sin ojos']],'',{ex:1}),{dep:1}),
  Object.assign(M('ar_hileras','Hileras (glándulas de seda)',[['✅','Presentes'],['🚫','Ausentes']],'',{ex:'Ausentes'}),{dep:1}),
  Object.assign(M('ar_telar','Tipo de telaraña',[['🚫','Ninguna'],['⭕','Orbicular'],['🌀','Irregular'],['🕳️','Tubular'],['🌪️','Embudo']],'',{ex:'Ninguna'}),{dep:1}),
  Object.assign(M('ar_aguijon','Aguijón',[['✅','Presente'],['🚫','Ausente']],'',{ex:'Ausente'}),{dep:1})
 ],
 Plantae:[
  M('pl_uso','Toxicidad / uso humano',[['💊','Medicinal'],['🍽️','Comestible'],['🌺','Ornamental'],['☠️','Tóxica / Venenosa'],['🏭','Industrial'],['🪵','Maderable']]),
  M('pl_habito','Forma de crecimiento (hábito)',[['🌳','Árbol'],['🪴','Arbusto'],['🌱','Hierba'],['🍃','Trepadora / Liana'],['🌸','Epífita'],['🪨','Litófita']]),
  M('pl_follaje','Tipo de hoja / follaje',[['🌲','Perennifolio'],['🍂','Caduco (caducifolio)']],'',{ex:1}),
  M('pl_polinizacion','Tipo de polinización',[['💨','Anemófila (viento)','Viento'],['🐝','Entomófila (insectos)','Insectos'],['🐦','Ornitófila (aves)','Aves'],['🦇','Quiropterófila (murciélagos)','Murciélagos']]),
  M('pl_estructuras','Estructuras de interés',[['🌸','Flores'],['🍎','Frutos comestibles'],['🌵','Espinas / Aguijones'],['🍄','Esporas']]),
  M('pl_raiz','Tipo de raíz',[['🥕','Pivotante'],['🌾','Fasciculada'],['🌿','Adventicia'],['🎈','Aérea']],'',{ex:1}),
  M('pl_fruto','Tipo de fruto',[['🍇','Baya'],['🍑','Drupa'],['🌰','Cápsula'],['🫛','Legumbre'],['🌾','Aquenio']],'',{ex:1}),
  M('pl_dispersion','Dispersión de semillas',[['🐦','Zoocoria'],['💨','Anemocoria'],['💧','Hidrocoria'],['🌱','Autocoria']]),
  M('pl_luz','Requerimientos de luz',[['☀️','Heliófita'],['🌑','Esciófita'],['🌤️','Intermedia']],'',{ex:1}),
  T('pl_sequia','Tolerancia a la sequía'),
  T('pl_inundacion','Tolerancia a la inundación'),
  T('pl_latex','Látex, resinas o metabolitos secundarios'),
  T('pl_fenologia','Fenología','Época de floración y fructificación'),
  S('pl_inflorescencia','Tipo de inflorescencia',['Racimo','Espiga','Panoja / Panícula','Umbela','Corimbo','Capítulo','Cima','Espádice','Amento','Solitaria (flor solitaria)'])
 ],
 Fungi:[
  M('fu_comestibilidad','Comestibilidad y toxicidad',[['⭐','Comestible excelente'],['👍','Comestible con precaución'],['😐','Sin valor culinario'],['⚠️','Tóxico / Venenoso'],['☠️','Mortal'],['🍄','Alucinógeno / Psicoactivo']],'',{ex:1}),
  M('fu_nutricion','Ecología / nutrición',[['🍄','Saprófito (descomponedor)'],['🤝','Micorrícico'],['🩸','Parásito']],'',{ex:1}),
  M('fu_esporocarpo','Tipo de esporocarpo (cuerpo fructífero)',[['☂️','Sombrilla (láminas / poros)'],['🥣','Copa'],['🍮','Gelatinoso'],['🪸','Coralino'],['💨','Polvo (bejín)']],'',{ex:1}),
  M('fu_sustrato','Sustrato',[['🪵','Madera en descomposición (lígnicola)'],['🌱','Suelo (humícola)'],['🍂','Hojarasca'],['🐛','Sobre insectos (entomopatógeno)']]),
  T('fu_esporada','Color de la esporada'),
  T('fu_olor','Olor característico'),
  T('fu_sabor','Sabor (solo si se prueba con precaución)'),
  M('fu_estacionalidad','Estacionalidad',[['🌸','Primavera'],['☀️','Verano'],['🍂','Otoño'],['❄️','Invierno'],['🔄','Todo el año']]),
  T('fu_simbiosis','Relación simbiótica específica','Con qué árboles o plantas forma micorrizas'),
  M('fu_anillo','Anillo / volva (agaricales)',[['💍','Con anillo'],['🥚','Con volva'],['💍🥚','Con anillo y volva'],['⭕','Sin anillo ni volva']],'',{ex:1})
 ],
 Protista:[
  M('pr_nutricion','Nutrición',[['🌿','Autótrofo (fotosintético)'],['🍽️','Heterótrofo'],['🔄','Mixótrofo']],'',{ex:1}),
  M('pr_locomocion','Locomoción',[['〰️','Flagelos'],['👁️','Cilios'],['🦶','Seudópodos'],['🛑','Inmóvil']],'',{ex:1}),
  M('pr_rol','Importancia / rol',[['🌱','Productor primario acuático'],['✨','Bioluminiscente'],['🩸','Causa mareas rojas'],['🦠','Patógeno / Parásito'],['🤝','Simbionte']]),
  M('pr_pared','Pared celular',[['🧱','Presente'],['⭕','Ausente']],'Ej: Presente, de celulosa',{ex:1}),
  M('pr_reproduccion','Forma de reproducción',[['🧬','Binaria'],['💕','Sexual'],['🔴','Formación de quistes']],'',{ex:1}),
  M('pr_habitat','Hábitat específico',[['🌊','Planctónico'],['⚓','Bentónico'],['🤝','Endosimbionte']]),
  T('pr_pigmentos','Pigmentos fotosintéticos','Clorofila a/b/c, ficoeritrina…')
 ],
 Monera:[
  M('mo_morfologia','Morfología',[['⚪','Coco'],['🟫','Bacilo'],['🌀','Espirilo'],['❓','Vibrión']],'',{ex:1}),
  M('mo_oxigeno','Relación con el oxígeno',[['💨','Aerobia estricta'],['🚫','Anaerobia estricta'],['🌀','Anaerobia facultativa']],'',{ex:1}),
  M('mo_efecto','Efecto / patogenicidad',[['🤝','Benéfica (simbionte / flora intestinal / fijadora de nitrógeno)'],['🍺','Utilidad industrial (fermentación)'],['🦠','Patógena']],'',{ex:1}),
  M('mo_gram','Tinción de Gram',[['🟪','Gram positiva'],['🟥','Gram negativa']],'',{ex:1}),
  M('mo_metabolismo','Metabolismo energético',[['⚡','Quimioautótrofo'],['🌞','Fotoautótrofo'],['🍽️','Quimioheterótrofo']],'',{ex:1}),
  M('mo_endosporas','Presencia de endosporas',[['✅','Presente'],['❌','Ausente']],'',{ex:1}),
  M('mo_movilidad','Movilidad',[['〰️','Flagelos'],['🐌','Deslizamiento'],['🛑','Inmóvil']],'',{ex:1}),
  M('mo_biofilm','Capacidad de formar biofilms',[['🟢','Sí'],['🔴','No']],'',{ex:1}),
  T('mo_antibioticos','Resistencia a antibióticos','Solo cuando sea relevante'),
  M('mo_extremo','Hábitat extremo',[['🔥','Termófila'],['🧪','Acidófila'],['🧂','Halófila']])
 ]
};
const ESPN={Animalia:'Animales',Plantae:'Plantas',Fungi:'Hongos',Protista:'Protistas',Monera:'Bacterias y arqueas'};
const TIT={Animalia:'Características animales',Plantae:'Características de la planta',Fungi:'Características del hongo',Protista:'Características del protista',Monera:'Características de la bacteria o arquea'};
/* Dato antiguo (ya separado en sequía / inundación): solo se muestra si la ficha lo tiene, para no perderlo */
const LEGP=T('pl_tolerancia','Tolerancia a la sequía / inundación (dato anterior)','Pásalo a los dos campos nuevos y bórralo de aquí');
let legOn=false;
const LABEL={},FD={};UNIV.concat(...Object.values(ESP),[LEGP]).forEach(f=>{LABEL[f.key]=f.label;FD[f.key]=f});LABEL.subphylum='Subphylum';LABEL.suborden='Suborden';
const CAMPO=[T('c_fecha','Fecha de la observación','AAAA-MM-DD o AAAA-MM-DD HH:MM'),T('c_lugar','Lugar de la observación','Municipio, vereda…'),T('c_salida','Salida / diario de campo','Ej: Salida a Chingaza · 12 mar'),T('c_lat','Latitud (GPS)','Ej: 4.711000'),T('c_lon','Longitud (GPS)','Ej: -74.072100'),A('c_nota','Nota personal')];
// v3.4 · una descripción por cada nivel (incluye los opcionales subphylum y suborden)
const TXN=[['dominio','dominio','del dominio'],['reino','reino','del reino'],['filo','filo o división','del filo o división'],['subphylum','subphylum','del subphylum'],['clase','clase','de la clase'],['orden','orden','del orden'],['suborden','suborden','del suborden'],['familia','familia','de la familia'],['genero','género','del género']];
const TAXR=TXN.map(n=>A('tx_'+n[0],'Descripción '+n[2],'Qué caracteriza '+n[2].replace(/^de(l| la)? /,(m,a)=>a==='l'?'al ':'a la ')+'…'));
// v3.3 · descripción por órgano (Plantae)
const PLORG=[A('pl_d_flor','Flor · descripción','Color, forma, número de pétalos…'),A('pl_d_hoja','Hoja · descripción','Forma, borde, disposición…'),A('pl_d_fruto','Fruto · descripción','Forma, color, tamaño…')];
ESP.Plantae.push(...PLORG);PLORG.concat([CAMPO[2]]).forEach(f=>{FD[f.key]=f});
Object.assign(LABEL,{pl_d_flor:'Flor · descripción',pl_d_hoja:'Hoja · descripción',pl_d_fruto:'Fruto · descripción',c_salida:'Salida / diario de campo',_fo:'Órgano de cada foto'});
TXN.forEach(n=>{LABEL['tx_'+n[0]]='Descripción '+n[2]});LABEL._adv='Advertencia';LABEL._src='Id de origen (importación)';
/* ---------- Formulario (añadir / editar) ---------- */
const PH={filo:'Chordata',clase:'Mammalia',orden:'Carnivora',familia:'Felidae',genero:'Panthera',especie:'onca'};
const OPC={filo:['subphylum','Subphylum (opcional)','Opcional · Ej: Vertebrata'],orden:['suborden','Suborden (opcional)','Opcional · Ej: Feliformia']};
function fHTML(f){
 const id='r-'+f.key,ph=esc(f.ph||'');
 let c;
 if(f.t==='m')c='<div class="chips" id="'+id+'" data-k="'+f.key+'" data-m="1" role="group" aria-labelledby="l-'+f.key+'">'
  +f.items.map(i=>'<button type="button" class="chip" aria-pressed="false" data-v="'+esc(i[1])+'"><span class="ci" aria-hidden="true">'+i[0]+'</span><span>'+esc(i[2]||i[1])+'</span></button>').join('')
  +(f.noOtra?'':'<button type="button" class="chip otra" aria-pressed="false" data-v="'+OTRA+'"><span class="ci" aria-hidden="true">✏️</span><span>Otra…</span></button>')+'</div>'
  +(f.noOtra?'':'<textarea class="otro" id="'+id+'-o" hidden rows="2" placeholder="'+(ph||'Escribe cuál (Enter = nueva línea)')+'"></textarea>');
 else if(f.t==='s')c='<select id="'+id+'" data-k="'+f.key+'"><option value="">—</option>'+f.opts.map(o=>'<option>'+esc(o)+'</option>').join('')+(f.noOtra?'':'<option value="'+OTRA+'">Otra…</option>')+'</select>'
  +(f.noOtra?'':'<textarea class="otro" id="'+id+'-o" hidden rows="2" placeholder="'+(ph||'Escribe cuál (Enter = nueva línea)')+'"></textarea>');
 else if(f.t==='a')c='<textarea id="'+id+'" data-k="'+f.key+'" rows="2" placeholder="'+ph+'"></textarea>';
 else c='<input id="'+id+'" data-k="'+f.key+'" placeholder="'+ph+'">';
 const h='<label id="l-'+f.key+'"'+(f.t==='m'?'':' for="'+id+'"')+'>'+esc(f.label)+'</label>'+c;
 return f.dep?'<div id="w-'+f.key+'" hidden>'+h+'</div>':h;
}
/* Orden en el formulario y en el TXT: cuadros (m) → desplegables (s) → textos (t/a).
   Cada campo dependiente (dep) se queda pegado a su padre, que se lee de DEPS. */
function ordF(arr){
 const par={};DEPS.forEach(d=>{par[d[0]]=d[1]});
 const keys=new Set(arr.map(f=>f.key)),gs=[],by={};
 arr.forEach(f=>{if(!(par[f.key]&&keys.has(par[f.key]))){const g={f,d:[],i:gs.length};gs.push(g);by[f.key]=g}});
 arr.forEach(f=>{if(par[f.key]&&keys.has(par[f.key]))by[par[f.key]].d.push(f)});
 const rk=f=>f.t==='m'?0:f.t==='s'?1:2;
 gs.sort((a,b)=>rk(a.f)-rk(b.f)||a.i-b.i);
 return [].concat(...gs.map(g=>[g.f].concat(g.d)));
}
function buildRasgos(){
 const r=$('f-reino').value;
 $('rg-u').innerHTML=ordF(UNIV).map(fHTML).join('');
 $('rg-c').innerHTML=ordF(CAMPO).map(fHTML).join('');
 $('rg-t').innerHTML=ordF(TAXR).map(fHTML).join('');txLabels();
 $('rg-e').innerHTML=ordF((ESP[r]||[]).concat(legOn&&r==='Plantae'?[LEGP]:[])).map(fHTML).join('');
 $('rg-et').textContent='Características específicas · '+(ESPN[r]||r)+' (opcional)';
 /* El subfilo no se usa en plantas: se ocultan su campo y su descripción */
 const pl=r==='Plantae',sf=$('r-subphylum');
 if(sf)sf.parentElement.hidden=pl;
 ['l-tx_subphylum','r-tx_subphylum'].forEach(i=>{const e=$(i);if(e)e.hidden=pl});
}
function collectRasgos(){
 const o={};
 dlg.querySelectorAll('[data-k]').forEach(el=>{
  let v;
  if(el.dataset.m){
   const on=[...el.querySelectorAll('.chip.on:not(.otra)')].map(b=>b.dataset.v),ot=el.querySelector('.chip.otra.on')?$(el.id+'-o').value.trim():'';
   v=on.concat(ot?[ot]:[]).join(', ');
  }else{
   v=el.value;
   if(el.tagName==='SELECT'&&v===OTRA)v=$(el.id+'-o').value;
  }
  v=(v||'').trim();
  if(v)o[el.dataset.k]=v;
 });
 return o;
}
const setChip=(b,on)=>{b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false')};
function fillRasgos(obj){
 dlg.querySelectorAll('[data-k]').forEach(el=>{
  const v=obj[el.dataset.k],f=FD[el.dataset.k];
  if(el.dataset.m){
   const sel=new Set(),rest=[];
   (v==null||v===''?[]:String(v).split(', ')).forEach(t=>{const n=(f&&f.al&&f.al[t])||t;if(f&&f.opts.includes(n))sel.add(n);else rest.push(t)});
   el.querySelectorAll('.chip:not(.otra)').forEach(b=>setChip(b,sel.has(b.dataset.v)));
   const ob=el.querySelector('.chip.otra');if(ob)setChip(ob,rest.length>0);
   const o=$(el.id+'-o');if(o){o.hidden=!rest.length;o.value=rest.join(', ')}
  }else if(el.tagName==='SELECT'){
   const o=$(el.id+'-o');
   if(v==null||v===''){el.value='';if(o){o.hidden=true;o.value=''}}
   else if([...el.options].some(op=>op.value===v&&v!==OTRA)){el.value=v;if(o){o.hidden=true;o.value=''}}
   else if(o){el.value=OTRA;o.hidden=false;o.value=v}
   else el.value='';
  }else el.value=v||'';
 });
 depAll();
}
/* Campos que aparecen según otra respuesta: lugar de origen (si hay origen) y diferencia entre sexos (si hay dimorfismo) */
const ES_ARAC=v=>{const a=String(v||'').split(', ');return a.includes('Arácnido')||a.includes('Escorpión')};
const DEPS=[['origen_lugar','origen',v=>!!v],['an_dimorfismo_dif','an_dimorfismo',v=>v==='Presente']]
 .concat(['ar_grupo','ar_ojos','ar_hileras','ar_telar','ar_aguijon'].map(k=>[k,'anat_grupo',ES_ARAC]));
/* Valor actual de un campo: sirve para listas, textos y cuadros (selección múltiple) */
function depVal(el){
 if(!el)return '';
 if(el.dataset.m){
  const on=[...el.querySelectorAll('.chip.on:not(.otra)')].map(b=>b.dataset.v),o=el.querySelector('.chip.otra.on')?$(el.id+'-o').value.trim():'';
  return on.concat(o?[o]:[]).join(', ');
 }
 return el.value;
}
function depClear(x,k){
 if(!x)return;
 if(x.dataset.m){x.querySelectorAll('.chip').forEach(b=>setChip(b,false));const o=$('r-'+k+'-o');if(o){o.hidden=true;o.value=''}}
 else{x.value='';const o=$('r-'+k+'-o');if(o){o.hidden=true;o.value=''}}
}
function depAll(){
 DEPS.forEach(([k,on,when])=>{const s=$('r-'+on),w=$('w-'+k);if(!s||!w)return;const show=when(depVal(s));w.hidden=!show;if(!show)depClear($('r-'+k),k)});
 const s=$('r-origen'),l=$('l-origen_lugar');if(s&&l){const ov=depVal(s);l.textContent=ov==='Endémico'?'¿De dónde es endémico?':ov?'¿De dónde fue introducido?':''}
}
/* Fichas antiguas: «Nativo» / «Invasor» ya no existen (lo maneja el mapa); los textos de endemismo se conservan en el campo de lugar */
function legacy(r){
 r=Object.assign({},r);const o=r.origen;
 if(o&&o!=='Endémico'&&o!=='Exótico / Introducido'){
  const k=/^end[eé]m/i.test(o)?'Endémico':/^(ex[oó]tic|introd)/i.test(o)?'Exótico / Introducido':'';
  if(k){r.origen=k;if(!r.origen_lugar&&o.trim().length>k.length)r.origen_lugar=o.trim()}else delete r.origen;
 }
 const d=r.an_dimorfismo;
 if(d&&d!=='Presente'&&d!=='Ausente'){
  if(/^ausente/i.test(d))r.an_dimorfismo='Ausente';
  else{r.an_dimorfismo='Presente';if(!r.an_dimorfismo_dif)r.an_dimorfismo_dif=d.replace(/^presente\s*[:\-–—,.]?\s*/i,'').trim()}
 }
 if(r.an_suborden&&!r.suborden)r.suborden=r.an_suborden;
 if(r.pl_subphylum&&!r.subphylum)r.subphylum=r.pl_subphylum;
 delete r.an_suborden;delete r.pl_subphylum;
 if(r.an_reproduccion){const t=String(r.an_reproduccion).split(', ').filter(x=>x!=='Metamorfosis');if(t.length)r.an_reproduccion=t.join(', ');else delete r.an_reproduccion}   // «Metamorfosis» ya tiene su propio campo
 return r;
}
async function openEdit(sp){
 editId=sp.id;legOn=!!(sp.rasgos&&sp.rasgos.pl_tolerancia);distLoad(sp.dist);
 $('fcmpb').style.display='';$('fcmpbox').innerHTML='';
 formFotos=(await ensureFotos(sp)).slice();formOrig=formFotos.slice();formNew=new Set();formSaved=false;formOrg=orgLoad(sp,formFotos);formCred=credLoad(sp,formFotos);drawThumbs();
 $('dtitle').textContent='Editar especie';$('save').textContent='Guardar cambios';
 $('err').textContent='';$('f-foto').value='';$('f-comun').value=sp.comun;$('f-car').value=sp.car;
 LV.forEach(k=>{$('f-'+k).value=sp[k]});
 buildRasgos();fillRasgos(legacy(sp.rasgos||{}));drawThumbs();
 dlg.querySelectorAll('details').forEach(d=>d.open=false);
 txSync();
 dlg.showModal();
}
let formFotos=[],formOrig=[],formNew=new Set(),formSaved=false;
window.onDrawThumbs=[];
function drawThumbs(){
 $('fthumbs').innerHTML=formFotos.map((s,i)=>'<div class="th'+(i===0?' cover':'')+'">'+IMG(s)+orgBtn(s,i)
  +(i?'<button type="button" class="st" data-st="'+i+'" title="Hacer portada">★</button>':'')
  +'<button type="button" class="rm" data-rm="'+i+'" title="Quitar">✕</button></div>').join('');
 window.onDrawThumbs.forEach(f=>f());
}
function resize(file){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,520/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};im.onerror=()=>res('');im.src=r.result};r.onerror=()=>res('');r.readAsDataURL(file)})}
/* ======================================================================
   v3.2 · 2) EXIF: fecha/hora original y coordenadas GPS de la foto
   ----------------------------------------------------------------------
   Lector mínimo de EXIF en JavaScript puro (solo JPEG). Se lee el archivo
   ORIGINAL antes de redimensionarlo, porque al redimensionar se pierden
   los metadatos. Solo rellena campos que estén vacíos y siguen editables.
   ====================================================================== */
function exifRead(buf){
 const v=new DataView(buf);
 if(v.byteLength<4||v.getUint16(0)!==0xFFD8)return null;                  // no es JPEG
 let p=2;
 while(p+4<v.byteLength){
  if(v.getUint8(p)!==0xFF)return null;
  const mk=v.getUint8(p+1),len=v.getUint16(p+2);
  if(mk===0xDA)return null;                                              // empieza la imagen: ya no hay metadatos
  if(mk===0xE1&&p+10<v.byteLength&&v.getUint32(p+4)===0x45786966&&v.getUint16(p+8)===0)   // APP1 «Exif\0\0»
   return exifTiff(v,p+10,Math.min(v.byteLength,p+2+len));
  p+=2+len;
 }
 return null;
}
function exifTiff(v,t,end){
 const le=v.getUint16(t)===0x4949;                                       // «II» = little-endian
 const u16=o=>v.getUint16(t+o,le),u32=o=>v.getUint32(t+o,le);
 if(u16(2)!==42)return null;
 const SZ={1:1,2:1,3:2,4:4,5:8,7:1,9:4,10:8};
 // Lee una tabla de etiquetas (IFD): {etiqueta:{type,cnt,at}}; «at» = dónde está el valor (relativo a t)
 const ifd=off=>{
  const r={};if(!off||t+off+2>end)return r;
  const n=u16(off);
  for(let i=0;i<n;i++){
   const e=off+2+i*12;if(t+e+12>end)break;
   const type=u16(e+2),cnt=u32(e+4),size=(SZ[type]||1)*cnt;
   r[u16(e)]={type,cnt,at:size>4?u32(e+8):e+8};
  }
  return r;
 };
 const str=x=>{if(!x||x.type!==2)return '';let s='';for(let i=0;i<x.cnt;i++){const c=v.getUint8(t+x.at+i);if(!c)break;s+=String.fromCharCode(c)}return s.trim()};
 const rat=(x,i)=>{const a=u32(x.at+i*8),b=u32(x.at+i*8+4);return b?a/b:0};
 const i0=ifd(u32(4)),ex=i0[0x8769]?ifd(u32(i0[0x8769].at)):{},gp=i0[0x8825]?ifd(u32(i0[0x8825].at)):{};
 const out={fecha:'',lat:null,lon:null};
 // Fecha/hora original de la toma (0x9003); si no hay, fecha de creación digital (0x9004) o de archivo (0x0132)
 const m=(str(ex[0x9003])||str(ex[0x9004])||str(i0[0x0132])).match(/^(\d{4}):(\d\d):(\d\d)[ T](\d\d):(\d\d)/);
 if(m&&m[1]!=='0000'&&m[2]!=='00'&&m[3]!=='00')out.fecha=m[1]+'-'+m[2]+'-'+m[3]+' '+m[4]+':'+m[5];
 // GPS: grados/minutos/segundos → decimal, con signo según N/S y E/W
 const dms=x=>x&&x.type===5&&x.cnt>=3?rat(x,0)+rat(x,1)/60+rat(x,2)/3600:null;
 let lat=dms(gp[2]),lon=dms(gp[4]);
 if(lat!=null&&lon!=null){
  if(/^S/i.test(str(gp[1])))lat=-lat;
  if(/^W/i.test(str(gp[3])))lon=-lon;
  if(Math.abs(lat)<=90&&Math.abs(lon)<=180&&(lat||lon)){out.lat=lat.toFixed(6);out.lon=lon.toFixed(6)}
 }
 return out.fecha||out.lat!=null?out:null;
}
// Rellena «Datos de campo» con la primera foto que traiga metadatos (solo campos vacíos)
async function exifFill(files){
 try{
  for(const f of files){
   if(!/jpe?g/i.test((f.type||'')+' '+(f.name||'')))continue;
   const m=exifRead(await f.slice(0,262144).arrayBuffer());              // los metadatos están al inicio del archivo
   if(!m)continue;
   const put=(k,val)=>{const el=$('r-'+k);if(el&&val&&!el.value.trim()){el.value=val;return true}return false};
   const got=[];
   if(put('c_fecha',m.fecha))got.push('la fecha y hora');
   if(m.lat!=null&&put('c_lat',m.lat)){put('c_lon',m.lon);got.push('la ubicación GPS')}
   if(got.length)$('exifmsg').textContent='📍 Tomé '+got.join(' y ')+' de la foto. Puedes corregirlo en «Datos de campo».';
   return;
  }
 }catch(_){}
}

/* ======================================================================
   v3.2 · 3) RASGOS TAXONÓMICOS (género · familia · orden) + WIKIPEDIA
   ----------------------------------------------------------------------
   Se guardan por ficha en rasgos.tx_genero / tx_familia / tx_orden.
   Al elegir un género, familia u orden ya registrado en otra especie, el
   texto se autocompleta (solo si el campo está vacío; sigue editable).
   ====================================================================== */
function txLabels(){
 TXN.forEach(n=>{const l=$('l-tx_'+n[0]),v=tval(n[0]).trim();if(l)l.textContent='Descripción '+n[2]+(v?' «'+v+'»':'')});
}
function txFind(k,name){                                                   // el texto más reciente registrado para ese taxón
 const n=norm(name);if(!n)return '';
 for(let i=data.length-1;i>=0;i--){
  const s=data[i];
  if(s.id!==editId&&norm(lvVal(s,k))===n){const t=(s.rasgos||{})['tx_'+k];if(t&&t.trim())return t}
 }
 return '';
}
function txSync(){
 txLabels();
 const done=[];
 TXN.forEach(n=>{
  const el=$('r-tx_'+n[0]);if(!el||el.value.trim())return;
  const t=n[0]==='especie'?'':txFind(n[0],tval(n[0]));
  if(t){el.value=t;done.push(n[1])}
 });
 if(done.length)$('tx-msg').textContent='↺ Rasgos autocompletados desde otra especie ya registrada ('+done.join(', ')+'). Puedes editarlos.';
}
// Al cambiar género/familia/orden a mano (o al pulsar «Usar este» del reconocimiento con IA)
const tval=k=>{const el=$((k==='subphylum'||k==='suborden'?'r-':'f-')+k);return el?el.value:''};
/* ======================================================================
   v3.3 · 4) CATEGORIZACIÓN BOTÁNICA (Flor · Hoja · Fruto) — solo Plantae
   ----------------------------------------------------------------------
   · Formulario: si el reino es Plantae, cada miniatura muestra un botón
     que al tocarlo cambia la etiqueta: sin etiqueta → Flor → Hoja → Fruto.
   · Se guarda en rasgos._fo como «Flor||Hoja|Fruto» (una posición por foto,
     en el mismo orden que la galería).
   · Ficha: cada foto muestra su etiqueta y arriba aparecen pestañas para
     ver solo las flores, las hojas o los frutos.
   · Además hay tres campos de texto (flor/hoja/fruto) en las
     características específicas de Plantae.
   ====================================================================== */
const ORG=[['Flor','🌸'],['Hoja','🍃'],['Fruto','🍎']];
const ORG_IC={Flor:'🌸',Hoja:'🍃',Fruto:'🍎'};
let formOrg={};                                    // etiqueta por foto del formulario: {referencia:'Flor'|…}

function orgTags(sp){return sp.reino==='Plantae'&&sp.rasgos&&sp.rasgos._fo?String(sp.rasgos._fo).split('|'):[]}
function credTags(sp){return sp.rasgos&&sp.rasgos._fc?String(sp.rasgos._fc).split('|'):[]}
function credLoad(sp,list){const t=credTags(sp),m={};list.forEach((r,i)=>{if(t[i])m[r]=t[i]});return m}
let formCred={};                                   // crédito por foto del formulario: {referencia:'(c) autor…'}
function orgLoad(sp,list){const t=orgTags(sp),m={};list.forEach((r,i)=>{if(t[i])m[r]=t[i]});return m}

// Botón de etiqueta sobre cada miniatura del formulario (solo si el reino es Plantae)
function orgBtn(s,i){
 if($('f-reino').value!=='Plantae')return '';
 const t=formOrg[s];
 return '<button type="button" class="po'+(t?' on':'')+'" data-po="'+i+'" title="Tipo de foto: toca para cambiar">'+(t?ORG_IC[t]+' '+t:'＋ Tipo')+'</button>';
}
/* ======================================================================
   v3.3 · 5) INTERFAZ: sugerencia de foto
   ----------------------------------------------------------------------
   (Ocultar dominios vacíos está en render(): solo se listan los dominios
   que tienen al menos una especie.)
   Si empiezas a llenar el formulario sin haber elegido ninguna foto, aparece
   una sugerencia (una sola vez por apertura) y el botón «Elegir fotos» pulsa
   un instante. No bloquea nada.
   ====================================================================== */
let fhShown=false;
window.onDrawThumbs.push(()=>{if(formFotos.length)$('fotohint').hidden=true});

/* Conexión con la página: botones, campos y avisos del formulario (necesita que la página ya esté cargada) */
function initFormulario(){
$('fields').innerHTML=LV.map((k,i)=>'<div><label for="f-'+k+'">'+LN[i]+'</label>'+(k==='dominio'?'<select id="f-dominio">'+DOM.map(x=>'<option>'+x+'</option>').join('')+'</select>':k==='reino'?'<select id="f-reino">'+['Animalia','Plantae','Fungi','Protista','Monera'].map(x=>'<option>'+x+'</option>').join('')+'</select>':'<input id="f-'+k+'" placeholder="'+PH[k]+'">')+'</div>'+(OPC[k]?'<div><label for="r-'+OPC[k][0]+'">'+OPC[k][1]+'</label><input id="r-'+OPC[k][0]+'" data-k="'+OPC[k][0]+'" placeholder="'+OPC[k][2]+'"></div>':'')).join('');

dlg.addEventListener('click',e=>{
 const b=e.target.closest&&e.target.closest('.chip');if(!b)return;
 const box=b.parentElement,f=FD[box.dataset.k],on=!b.classList.contains('on');
 const isO=b.classList.contains('otra'),o=$(box.id+'-o');
 if(on&&f&&f.ex===1){   // ex:1 → solo se permite una opción
  box.querySelectorAll('.chip.on').forEach(x=>{if(x!==b)setChip(x,false)});
  if(!isO&&o){o.hidden=true;o.value=''}
 }
 setChip(b,on);
 if(isO){o.hidden=!on;if(on)o.focus();depAll();return}
 if(on&&f&&f.ex&&f.ex!==1)box.querySelectorAll('.chip.on:not(.otra)').forEach(x=>{if(x!==b&&((b.dataset.v===f.ex)!==(x.dataset.v===f.ex)))setChip(x,false)});
 depAll();
});
dlg.addEventListener('change',e=>{
 const el=e.target;
 if(el.matches&&el.matches('select[data-k]')){
  const o=$(el.id+'-o');
  if(o){o.hidden=el.value!==OTRA;if(!o.hidden)o.focus()}
  depAll();
 }
});
$('f-reino').onchange=()=>{
 const m=$('f-reino').value==='Monera';
 if(m&&$('f-dominio').value==='Eukarya')$('f-dominio').value='Bacteria';
 if(!m)$('f-dominio').value='Eukarya';
 const keep=collectRasgos();buildRasgos();fillRasgos(keep);drawThumbs();
};

$('add').onclick=()=>{
 editId=null;legOn=false;distLoad(null);
 $('fcmpb').style.display='';$('fcmpbox').innerHTML='';
 $('dtitle').textContent='Añadir especie';$('save').textContent='Guardar especie';
 formFotos=[];formOrig=[];formNew=new Set();formSaved=false;formOrg={};formCred={};drawThumbs();
 $('err').textContent='';$('f-foto').value='';$('f-comun').value='';$('f-car').value='';
 const stA=lvState();LV.forEach((k,i)=>{const j=stA.ks.indexOf(k);$('f-'+k).value=(j>=0?path[j]:'')||(i<2?$('f-'+k).options[0].value:'')});
 buildRasgos();fillRasgos({});drawThumbs();
 ['subphylum','suborden'].forEach(k=>{const j=stA.ks.indexOf(k);if(j>=0&&$('r-'+k))$('r-'+k).value=path[j]});
 dlg.querySelectorAll('details').forEach(d=>d.open=false);
 txSync();
 dlg.showModal();
};
$('cancel').onclick=()=>dlg.close();
dlg.addEventListener('close',()=>{if(!formSaved)[...formNew].forEach(dropLoc);formNew=new Set()});
$('fthumbs').onclick=e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.rm!==undefined){const [x]=formFotos.splice(+b.dataset.rm,1);if(formNew.has(x))dropLoc(x)}
 else if(b.dataset.st!==undefined){const [x]=formFotos.splice(+b.dataset.st,1);formFotos.unshift(x)}
 drawThumbs();
};
$('f-foto').onchange=async e=>{
 const files=[...e.target.files];e.target.value='';
 exifFill(files);
 $('err').textContent='';
 for(const f of files){
  if(formFotos.length>=MAXF){$('err').textContent='Máximo '+MAXF+' fotos por especie.';break}
  const s=GDRIVE_ON?await addLocal(f):await resize(f);if(s)formFotos.push(s);
 }
 drawThumbs();
};
$('save').onclick=async()=>{
 const rec={comun:$('f-comun').value.trim(),caracteristicas:$('f-car').value.trim(),rasgos:withFav(collectRasgos())};
 LV.forEach(k=>rec[k]=$('f-'+k).value.trim());
 const miss=LV.filter(k=>!rec[k]).map(k=>LN[LV.indexOf(k)].toLowerCase());
 if(miss.length){$('err').textContent='Falta: '+miss.join(', ')+'.';return}
 // v3.2 · ¿faltan campos clave? → modal: cancelar / con advertencia / sin advertencia
 if(rec.reino==='Plantae'){delete rec.rasgos.subphylum;delete rec.rasgos.tx_subphylum}   // el subfilo no aplica a plantas
 const falta=faltantes(Object.assign({},rec,{car:rec.caracteristicas,fotos:formFotos}));
 if(falta.length){const c=await askWarn(falta);if(c==='cancel')return;if(c==='warn')rec.rasgos._adv='1'}
 rec.fotos=formFotos.slice();rec.foto=formFotos[0]||'';
 if(rec.reino==='Plantae'){const tg=formFotos.map(r=>formOrg[r]||'');if(tg.some(Boolean))rec.rasgos._fo=tg.join('|')}{const cr=formFotos.map(r=>formCred[r]||'');if(cr.some(Boolean))rec.rasgos._fc=cr.join('|')}   // v3.3 · etiqueta Flor/Hoja/Fruto por foto
 const trash=formOrig.filter(r=>/^gd:/.test(r)&&!formFotos.includes(r));
 if(GDRIVE_ON&&formFotos.some(isLoc)&&navigator.onLine&&!gdValid())await gdToken(true).catch(()=>{});
 rec.distribucion={nativo:[...edist.nativo],invasor:[...edist.invasor]};
 $('save').disabled=true;
 const prev=editId&&data.find(x=>x.id===editId);
 const o=fromRow(Object.assign({},rec,{id:editId||crypto.randomUUID(),creado:prev&&prev.creado||new Date().toISOString()}));
 formSaved=true;formNew.clear();
 await persist(o,trash);
 $('save').disabled=false;
 if(editId)data=data.map(x=>x.id===editId?o:x);else data.push(o);
 byC(data);
 path=chainFor(o);sel=o.id;dlg.close();render();
 bToast('✓ Especie guardada');
 if(flush.err&&!driveErr())alert('La ficha quedó guardada en el dispositivo, pero no se pudo subir: '+flush.err);
};

dlg.addEventListener('change',e=>{if(/^(f-(dominio|reino|filo|clase|orden|familia|genero)|r-(subphylum|suborden))$/.test(e.target.id||''))txSync()});
dlg.addEventListener('close',()=>{$('exifmsg').textContent='';$('tx-msg').textContent=''});

$('fthumbs').addEventListener('click',e=>{
 const b=e.target.closest('button[data-po]');if(!b)return;
 const r=formFotos[+b.dataset.po],cur=formOrg[r]||'';
 const nx=cur===''?'Flor':cur==='Flor'?'Hoja':cur==='Hoja'?'Fruto':'';
 if(nx)formOrg[r]=nx;else delete formOrg[r];
 drawThumbs();
});
dlg.addEventListener('focusin',e=>{
 const t=e.target;
 if(fhShown||formFotos.length||!t.matches||!t.matches('input,select,textarea')||t.id==='f-foto')return;
 fhShown=true;
 $('fotohint').hidden=false;
 const b=dlg.querySelector('label.filebtn');
 if(b){b.classList.remove('nudge');void b.offsetWidth;b.classList.add('nudge')}
});
dlg.addEventListener('close',()=>{fhShown=false;$('fotohint').hidden=true});
}
document.addEventListener('DOMContentLoaded',initFormulario);
