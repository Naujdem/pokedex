/* ============================================================
   quizflor.js · Biotaxo dex
   «🎯 Quiz: ¿qué parte es?»: se muestra el diagrama de la flor con una
   parte resaltada (sin rótulos) y eliges su nombre entre 4 opciones.
   Repaso espaciado con el mismo cálculo del Modo estudio (srNext):
   si fallas vuelve pronto; si aciertas eliges Difícil / Bien / Fácil.
   El avance se guarda en ESTE dispositivo (localStorage), por diagrama
   y por parte; no se sincroniza con la nube.
   Usa FLOR_GEN, FLOR_DIAG (flor.js), srNext, srFmt (index.html), ls,
   lsSet, esc: viven en otros archivos y solo se llaman al ejecutar.
   Se carga ANTES del <script> principal de index.html.
   ============================================================ */
const QZ_KEY='pk_qzflor',QZ_NOM={general:'Esquema general',orchidaceae:'Orquídea (Orchidaceae)',araceae:'Arácea · inflorescencia',araceae_f:'Arácea · flor femenina',araceae_m:'Arácea · flor masculina',heliconiaceae:'Heliconia · inflorescencia',heliconiaceae_f:'Heliconia · flor',asteraceae:'Asterácea · capítulo radiado',asteraceae_l:'Asterácea · capítulo ligulado',asteraceae_d:'Asterácea · capítulo discoide',asteraceae_s:'Asterácea · capítulo disciforme',asteraceae_t:'Asterácea · flor tubular',asteraceae_g:'Asterácea · flor ligulada',euphorbiaceae:'Euforbiácea · flor femenina',euphorbiaceae_m:'Euforbiácea · flor masculina',euphorbiaceae_c:'Euforbiácea · ciatio (Euphorbia)',euphorbiaceae_df:'Euforbiácea · diagrama femenino',euphorbiaceae_dm:'Euforbiácea · diagrama masculino',malvaceae:'Malvácea · flor de hibisco',malvaceae_d:'Malvácea · diagrama floral'};
let QZ=null;
const qzSets=()=>Object.assign({general:FLOR_GEN},FLOR_DIAG,FLOR_EXTRA);
function qzKeyOf(set){const S=qzSets();return Object.keys(S).find(k=>S[k]===set)||'general'}
function qzLoad(){try{const o=JSON.parse(ls(QZ_KEY)||'{}');return o&&typeof o==='object'?o:{}}catch(_){return{}}}
function qzShuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const qzId=k=>QZ.sk+':'+k;
const qzOf=k=>{const e=QZ.store[qzId(k)]||{};return{ef:+e.ef||2.5,iv:+e.iv||0,rp:+e.rp||0,step:QZ.step[k]||0}};
function qzStart(sk,prac){
 const S=qzSets(),set=S[sk]||S.general;sk=S[sk]?sk:'general';
 const store=qzLoad(),now=Date.now();
 let q=set.orden.filter(k=>{const e=store[sk+':'+k];return !e||!(+e.due>now)});
 if(prac)q=set.orden.slice();
 q=qzShuffle(q);
 QZ={sk,set,store,queue:q,learning:[],cur:null,step:{},prac:!!prac,done:0,total:q.length,okc:0,ans:null,opts:[]};
 qzNext();
}
function qzNext(){
 const Z=QZ;Z.ans=null;
 Z.cur=Z.queue.length?Z.queue.shift():(Z.learning.length?Z.learning.shift():null);
 if(Z.cur){
  const otros=qzShuffle(Z.set.orden.filter(k=>k!==Z.cur)).slice(0,3);
  Z.opts=qzShuffle([Z.cur].concat(otros));
 }
 qzDraw();
}
function qzSvg(box,sk,key,reveal){
 const set=qzSets()[sk];
 box.innerHTML=set.svg;
 const s=box.querySelector('svg');if(!s)return;
 s.removeAttribute('id');s.setAttribute('viewBox',set.qvb||s.getAttribute('viewBox'));
 s.setAttribute('aria-label','Diagrama con una parte resaltada: ¿cuál es?');
 s.classList.add('fl-has');
 s.querySelectorAll(reveal?'[data-p="'+key+'"]':'.fl-f [data-p="'+key+'"]').forEach(e=>e.classList.add('fl-sel'));
 box.classList.toggle('rev',!!reveal);
}
function qzDraw(){
 const Z=QZ,b=document.getElementById('qzbody'),bar=document.getElementById('qzbar'),cnt=document.getElementById('qzcnt');
 if(!Z||!b||!bar)return;
 const X='<button type="button" data-a="x">Cerrar</button>';
 const left=Z.cur?Z.queue.length+Z.learning.length+1:0;
 if(cnt)cnt.textContent=Z.cur?'Quedan '+left:'';
 if(!Z.cur){
  b.innerHTML='<div class="qzmsg">'+(Z.total
   ?'<p style="font-size:2.4rem;margin:0">🎉</p><h3>'+(Z.prac?'Terminaste: '+Z.okc+' de '+Z.total:'¡Terminaste por hoy!')+'</h3>'+(Z.prac?'':'<p class="hint">Repasaste '+Z.done+(Z.done===1?' parte.':' partes.')+' Las que dominas volverán en unos días.</p>')
   :'<p style="font-size:2.4rem;margin:0">✅</p><h3>Todo al día</h3><p class="hint">No hay partes pendientes en este diagrama. Puedes practicarlas igual, sin que cuente para el repaso.</p>')+'</div>';
  bar.innerHTML='<div class="two">'+(Z.prac?'':'<button type="button" data-a="prac">Practicar todas</button>')+X+'</div>';
  return;
 }
 const k=Z.cur,P=Z.set.partes,rev=Z.ans!==null;
 b.innerHTML='<p class="hint" style="text-align:center;margin:0 0 4px">'+(Z.prac?'Práctica · no cuenta':'¿Qué parte de la flor está resaltada?')+'</p><div id="qzbox"></div>'
  +'<div id="qzopts">'+Z.opts.map(o=>'<button type="button" data-o="'+o+'" class="'+(rev?(o===k?'ok':(o===Z.ans?'no':'')):'')+'"'+(rev?' disabled':'')+'>'+esc(P[o].n)+'</button>').join('')+'</div>'
  +(rev?'<div id="qzdef"><h3>'+(Z.ans===k?'✅ ¡Correcto! ':'❌ Era: ')+esc(P[k].n)+'<small>'+esc(P[k].g)+'</small></h3><p>'+esc(P[k].d)+'</p><p class="hint">'+esc(P[k].c)+'</p></div>':'');
 qzSvg(document.getElementById('qzbox'),Z.sk,k,rev);
 if(!rev){bar.innerHTML='<p class="hint" style="text-align:center;margin:0">Toca tu respuesta</p>';return}
 if(Z.ans!==k)bar.innerHTML='<button type="button" class="primary one" data-a="again">'+(Z.prac?'Siguiente':'Entendido · repetir pronto')+'</button>';
 else if(Z.prac)bar.innerHTML='<button type="button" class="primary one" data-a="ok">Siguiente</button>';
 else{
  const now=new Date(),s=qzOf(k);
  bar.innerHTML='<div class="rate" style="grid-template-columns:repeat(3,1fr)">'+['hard','good','easy'].map(r=>{const n=srNext(s,r,now),t=SRB.find(x=>x[0]===r)[1];return '<button type="button" class="r-'+r+'" data-a="'+r+'">'+t+'<small>'+srFmt(n)+'</small></button>'}).join('')+'</div>';
 }
}
function qzAnswer(o){
 if(!QZ||!QZ.cur||QZ.ans!==null)return;
 QZ.ans=o;qzDraw();
}
function qzRate(r){
 const Z=QZ;if(!Z||!Z.cur||Z.ans===null)return;
 const k=Z.cur;
 if(Z.prac){if(r==='ok')Z.okc++;Z.done++;qzNext();return}
 const res=srNext(qzOf(k),r,new Date());
 Z.step[k]=res.step;
 const store=qzLoad(),old=store[qzId(k)]||{};
 store[qzId(k)]={ef:res.ef,iv:res.iv,rp:res.rp,due:res.due.getTime(),n:(old.n||0)+1,lr:r};
 lsSet(QZ_KEY,JSON.stringify(store));Z.store=store;
 if(res.delay!==undefined)Z.learning.push(k);else Z.done++;   // en minutos: todavía no cuenta como terminada
 qzNext();
}
function abrirQuizFlor(sk){
 const d=document.getElementById('dlgqz'),sel=document.getElementById('qzset');
 if(!d||!sel)return;
 const S=qzSets();
 sel.innerHTML=Object.keys(S).map(k=>'<option value="'+k+'">'+esc(QZ_NOM[k]||k)+'</option>').join('');
 sk=S[sk]?sk:(S[ls('pk_qzset')]?ls('pk_qzset'):'general');
 sel.value=sk;
 qzStart(sk,false);
 d.showModal();
}
document.addEventListener('DOMContentLoaded',()=>{
 const d=document.getElementById('dlgqz');
 if(!d)return;
 d.addEventListener('click',e=>{
  const o=e.target.closest&&e.target.closest('[data-o]');
  if(o&&d.contains(o)){qzAnswer(o.dataset.o);return}
  const b=e.target.closest&&e.target.closest('button[data-a]');
  if(!b||!d.contains(b))return;
  const a=b.dataset.a;
  if(a==='x')d.close();
  else if(a==='prac')qzStart(QZ&&QZ.sk,true);
  else qzRate(a);
 });
 const sel=document.getElementById('qzset');
 if(sel)sel.onchange=()=>{lsSet('pk_qzset',sel.value);qzStart(sel.value,false)};
 const f=document.getElementById('flqz');
 if(f)f.onclick=()=>{const fd=document.getElementById('dlgflor');if(fd&&fd.open)fd.close();abrirQuizFlor(qzKeyOf(typeof florBuilt!=='undefined'&&florBuilt||FLOR_GEN))};
 const s=document.getElementById('stqz');
 if(s)s.onclick=()=>{const sd=document.getElementById('dlgst');if(sd&&sd.open)sd.close();abrirQuizFlor()};
});
