/* ======================================================================
   v7.6 · 🤖 Sugerir características con IA
   ----------------------------------------------------------------------
   Envía el nombre científico, el reino, la lista de campos (con sus
   opciones) y el texto de Wikipedia a la función de Supabase
   «ia-caracteristicas» (OpenRouter gratis → Gemini de respaldo).
   Debajo de cada característica aparece un recuadro 🤖 con lo que dice la IA:
   · Cuadros con icono: se resaltan con borde punteado los sugeridos,
     pero TÚ los marcas.
   · Listas: se muestra la opción sugerida.
   · Textos: la sugerencia aparece para autocompletar con «＋ Usar».
   Nada se guarda si no lo marcas o lo usas tú.
   ====================================================================== */
async function iaWiki(g,e){
 if(window._wk&&window._wk.length)return window._wk.map(s=>s.t+':\n'+s.x).join('\n\n');
 const sp=e?g+' '+e:g;
 for(const l of ['es','en']){try{const a=await wkGet(l,sp);if(a)return a.text}catch(_){}}
 return '';
}
function iaClear(){
 dlg.querySelectorAll('.aibox').forEach(b=>b.remove());
 dlg.querySelectorAll('.chip.aisug').forEach(b=>b.classList.remove('aisug'));
}
function iaBox(k,html){
 const el=$('r-'+k);if(!el)return null;
 const at=$('r-'+k+'-o')||el,d=document.createElement('div');
 d.className='aibox';d.innerHTML=html;at.insertAdjacentElement('afterend',d);return d;
}
$('ia').onclick=async()=>{
 const g=$('f-genero').value.trim(),e=$('f-especie').value.trim(),r=$('f-reino').value,o=$('iares');
 if(!g){o.textContent='Escribe al menos el género primero.';return}
 if(!SB||!navigator.onLine){o.textContent='La IA necesita internet y sesión iniciada.';return}
 iaClear();o.textContent='🤖 Leyendo Wikipedia y preguntando a la IA… (puede tardar unos segundos)';$('ia').disabled=true;
 try{
  const fs=UNIV.concat(ESP[r]||[]);
  const campos=fs.map(f=>({k:f.key,l:f.label,t:f.t,o:f.opts}));
  const wiki=await iaWiki(g,e);
  const {data,error}=await SB.functions.invoke('ia-caracteristicas',{body:{nombre:(g+' '+e).trim(),comun:$('f-comun').value.trim(),reino:r,campos,wiki}});
  if(error||!data)throw new Error(error&&error.message||'sin respuesta');
  if(!data.ok){o.textContent='La IA no pudo responder: '+(data.mensaje||'error');return}
  let n=0;
  Object.entries(data.datos||{}).forEach(([k,x])=>{
   const f=FD[k];if(!f)return;
   const nota=x.n?' <span class="hint">· '+esc(x.n)+'</span>':'';
   if(f.t==='m'){
    const vs=Array.isArray(x.v)?x.v:[];
    const el=$('r-'+k);if(el)el.querySelectorAll('.chip').forEach(b=>{if(vs.includes(b.dataset.v))b.classList.add('aisug')});
    if(iaBox(k,'🤖 <b>'+(vs.length?esc(vs.join(', ')):'Ninguna opción encaja')+'</b>'+nota+(vs.length?'<br><span class="hint">Márcalo tú en los cuadros resaltados.</span>':'')))n++;
   }else if(f.t==='s'){
    if(iaBox(k,'🤖 <b>'+esc(x.v||'Ninguna opción encaja')+'</b>'+nota))n++;
   }else if(x.v){
    const b=iaBox(k,'🤖 <span class="aiv">'+esc(x.v)+'</span>'+nota+' <button type="button" class="aiuse">＋ Usar</button>');
    if(b){n++;b.querySelector('.aiuse').onclick=()=>{const el=$('r-'+k),v=String(x.v);el.value=el.value.trim()?el.value.trim()+' '+v:v;el.dispatchEvent(new Event('input',{bubbles:true}));b.remove()}}
   }else if(iaBox(k,'🤖'+nota))n++;
  });
  o.textContent=n?'🤖 '+n+' sugerencias debajo de cada característica. Revísalas: la IA puede equivocarse.':'🤖 La IA no encontró datos seguros para esta especie.';
  dlg.querySelectorAll('#rg-u,#rg-e').forEach(x=>{const d=x.closest('details');if(d)d.open=true});
 }catch(err){o.textContent='No pude consultar la IA ('+err.message+'). ¿Ya creaste la función «ia-caracteristicas» en Supabase?'}
 finally{$('ia').disabled=false}
};
