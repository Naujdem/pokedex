/* ============================================================
   db.js · Biotaxo dex
   Todo lo de IndexedDB (la base de datos del dispositivo) y la cola de
   sincronización con Supabase:
     idb, tx, dbPut, dbGet, dbAll, dbDel, dbClear   → leer y escribir en el dispositivo
     persist(o)   → guarda una ficha en el dispositivo y la deja en la cola
     flush()      → sube la cola a Supabase (y las fotos loc: a Drive)
     reconcile()  → mezcla las fichas del servidor con las del dispositivo
   Se carga ANTES de supabase.js, drive.js y del <script> principal de index.html.
   Al cargar solo abre la base de datos; lo demás usa cosas que se definen en
   otros archivos (SB, subirFotos, gdTrash, toRow, fromRow, netUI, render, data,
   sel, $) únicamente cuando se ejecuta, nunca al cargar el archivo.
   (Código movido tal cual desde index.html, sin cambios.)
   ============================================================ */

/* ---------- IndexedDB: fichas, cola de pendientes y metadatos ---------- */
const idb=new Promise((ok,ko)=>{const r=indexedDB.open('pokedex',2);r.onupgradeneeded=()=>{const d=r.result;[['especies',{keyPath:'id'}],['cola',{keyPath:'id'}],['meta'],['fotos']].forEach(([n,o])=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n,o)})};r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)});
const tx=async(s,m,f)=>{const d=await idb;return new Promise((ok,ko)=>{const t=d.transaction(s,m);let q;try{q=f(t.objectStore(s))}catch(e){return ko(e)}t.oncomplete=()=>ok(q&&q.result);t.onerror=t.onabort=()=>ko(t.error)})};
const dbPut=(s,v,k)=>tx(s,'readwrite',o=>o.put(v,k)),dbGet=(s,k)=>tx(s,'readonly',o=>o.get(k)),dbAll=s=>tx(s,'readonly',o=>o.getAll()),dbDel=(s,k)=>tx(s,'readwrite',o=>o.delete(k)),dbClear=s=>tx(s,'readwrite',o=>o.clear());

/* Guarda primero en el dispositivo y deja la ficha en la cola; sube si hay red */
async function persist(o,trash){o.pend=true;await dbPut('especies',Object.assign({},o));const prev=await dbGet('cola',o.id),tr=[...((prev&&prev.trash)||[]),...(trash||[])];await dbPut('cola',{id:o.id,op:'upsert',ts:Date.now(),trash:tr});netUI();return flush()}
async function flush(){
 if(!SB||!navigator.onLine)return;if(flush.busy){flush.again=true;return}flush.busy=true;flush.err='';let n=0;netUI();
 try{
  for(const j of (await dbAll('cola')).sort((a,b)=>a.ts-b.ts)){
   let error;
   if(j.op==='delete')({error}=await SB.from('especies').delete().eq('id',j.id));
   else{const o=await dbGet('especies',j.id);if(!o){await dbDel('cola',j.id);continue}if(!(await subirFotos(o)))continue;({error}=await SB.from('especies').upsert(toRow(o)))}
   if(error&&j.op!=='delete'&&/row-level security/i.test(error.message)){
    /* El id pertenece a otra cuenta (p. ej. ficha importada de otra copia): se le da un id nuevo y se reintenta una vez */
    const o=await dbGet('especies',j.id);
    if(o&&!o.reid){
     const old=o.id;o.id=crypto.randomUUID();o.reid=1;
     await dbPut('especies',o);await dbDel('especies',old);await dbDel('cola',old);
     await dbPut('cola',{id:o.id,op:'upsert',ts:j.ts,trash:j.trash||[]});
     const m=data.find(x=>x.id===old);if(m)m.id=o.id;if(sel===old)sel=o.id;
     flush.again=true;continue;
    }
   }
   if(error){flush.err=error.message+(/distribucion|rasgos|fotos/i.test(error.message)?' (Falta ejecutar distribucion.sql en Supabase).':'');break}
   for(const r of (j.trash||[]))await gdTrash(r);
   await dbDel('cola',j.id);n++;netUI();
   const o=await dbGet('especies',j.id);if(o){delete o.pend;await dbPut('especies',o)}
   const m=data.find(x=>x.id===j.id);if(m){delete m.pend;if(o&&o.fotos){m.fotos=o.fotos;m.foto=o.foto}}
  }
 }catch(e){flush.err=String(e.message||e)}
 flush.busy=false;netUI();if(n&&!$('app').hidden)render();
 if(!flush.err&&typeof gdTrashRetry==='function')gdTrashRetry();
 if(flush.again){flush.again=false;return flush()}
}
async function reconcile(rows,prune){
 const loc=Object.fromEntries((await dbAll('especies')).map(x=>[x.id,x])),q=new Set((await dbAll('cola')).map(j=>j.id)),seen=new Set();
 for(const r of rows){seen.add(r.id);if(q.has(r.id))continue;const o=fromRow(r),l=loc[r.id];if(l&&l.fotos&&o.fotos===undefined&&l.foto===o.foto)o.fotos=l.fotos;await dbPut('especies',o)}
 if(prune)for(const id in loc)if(!seen.has(id)&&!q.has(id))await dbDel('especies',id);
}
