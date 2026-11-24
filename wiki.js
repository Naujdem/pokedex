/* ======================================================================
   v7.5 · Traer de Wikipedia (formulario de agregar / editar especie)
   ----------------------------------------------------------------------
   Busca el artículo de la especie (género + especie) en Wikipedia en
   español; si no existe, en inglés; si tampoco, el del género.
   Muestra la introducción y cada sección (Hábitat, Alimentación…) en
   cuadros plegables, con un botón 📋 para copiar el texto y pegarlo en
   el campo que tú elijas. No llena nada solo: tú decides qué guardar.
   ====================================================================== */
const WK_SKIP=/^(referencias|notas|bibliograf|enlaces externos|véase también|vease tambien|see also|references|notes|further reading|external links|bibliography|galería|galeria|gallery|sinonimia|synonyms)/i;

async function wkGet(lang,title){
 const u='https://'+lang+'.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext=1&redirects=1&titles='+encodeURIComponent(title);
 const r=await (await fetch(u)).json();
 const p=Object.values((r.query&&r.query.pages)||{})[0];
 if(!p||p.missing!==undefined||!p.extract||!p.extract.trim())return null;
 return {lang,title:p.title,text:p.extract};
}
function wkSections(text){                                              // «== Título ==» → [{t,x}]
 const out=[{t:'Introducción',x:''}];
 text.split('\n').forEach(l=>{
  const m=l.match(/^(={2,})\s*(.+?)\s*\1\s*$/);
  if(m)out.push({t:(m[1].length>2?'· ':'')+m[2],x:''});
  else out[out.length-1].x+=l+'\n';
 });
 return out.map(s=>({t:s.t,x:s.x.replace(/\n{3,}/g,'\n\n').trim()})).filter(s=>s.x&&!WK_SKIP.test(s.t.replace(/^· /,'')));
}
$('wk').onclick=async()=>{
 const g=$('f-genero').value.trim(),e=$('f-especie').value.trim(),o=$('wkres');
 if(!g){o.textContent='Escribe al menos el género primero.';return}
 const sp=e?g+' '+e:g;
 o.textContent='Buscando en Wikipedia…';
 try{
  let a=null,note='';
  for(const [l,t] of [['es',sp],['en',sp]].concat(e?[['es',g],['en',g]]:[])){a=await wkGet(l,t);if(a)break}
  if(!a){o.textContent='No encontré «'+sp+'» en Wikipedia (español ni inglés). Revisa la ortografía.';return}
  if(a.lang==='en')note+=' · en inglés (no hay artículo en español)';
  if(e&&!a.title.toLowerCase().includes(e.toLowerCase())&&a.title.toLowerCase()!==sp.toLowerCase())note+=' · puede ser del género, no de la especie';
  const S=wkSections(a.text);
  window._wk=S;
  const link='https://'+a.lang+'.wikipedia.org/wiki/'+encodeURIComponent(a.title.replace(/ /g,'_'));
  o.innerHTML='<b>Wikipedia: '+esc(a.title)+'</b>'+esc(note)+' · <a href="'+link+'" target="_blank" rel="noopener">↗ abrir</a>'
   +S.map((s,i)=>'<details class="wks"'+(i?'':' open')+'><summary>'+esc(s.t)+'</summary><p>'+esc(s.x).replace(/\n/g,'<br>')+'</p><button type="button" data-wk="'+i+'">📋 Copiar</button></details>').join('')
   +'<p class="hint">Copia lo que te sirva y pégalo (con tus palabras) en la característica que corresponda. Wikipedia puede tener errores: compara con tus fuentes.</p>';
 }catch(err){o.textContent='No pude consultar Wikipedia (¿sin internet?).'}
};
$('wkres').addEventListener('click',async ev=>{
 const b=ev.target.closest('[data-wk]');if(!b)return;
 try{await navigator.clipboard.writeText(window._wk[+b.dataset.wk].x);b.textContent='✓ Copiado';setTimeout(()=>b.textContent='📋 Copiar',1500)}
 catch(_){b.textContent='No se pudo copiar'}
});
