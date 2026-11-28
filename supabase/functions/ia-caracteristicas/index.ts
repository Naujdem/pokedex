// Sugerencias de características de una especie con IA (Biotaxo dex).
// Se llama desde el formulario de agregar/editar especie (ia.js):
//   SB.functions.invoke('ia-caracteristicas', { body: { nombre, comun, reino, campos, wiki } })
// Prueba primero OpenRouter y, si falla, Gemini. Devuelve { ok, datos: { clave: { v, n } } }.
//
// Despliegue:  pegar este archivo en Supabase → Edge Functions → nueva función «ia-caracteristicas»
// Secretos:    OPENROUTER_API_KEY, OPENROUTER_MODEL (opcional, por defecto openrouter/free),
//              GEMINI_API_KEY, GEMINI_MODEL (opcional, por defecto gemini-3.5-flash-lite)
//              (los mismos valores que ya usas en SimulaPro)
// Seguridad:   verify_jwt activo: solo usuarios con sesión iniciada. Las claves nunca llegan al navegador.

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};
const reply = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { headers: { ...cors, 'content-type': 'application/json' } });

interface Campo { k: string; l: string; t: string; o?: string[] }

const SYSTEM = `Eres un biólogo experto en taxonomía y ecología, con buen conocimiento de la biodiversidad de Colombia y del Neotrópico.
Te doy una especie y una lista de campos de una ficha. Devuelve SOLO un objeto JSON (sin texto antes ni después, sin bloques de código) con esta forma:
{"clave_del_campo": {"v": valor, "n": "nota corta opcional"}, ...}

Reglas:
- Usa como fuente principal el texto de Wikipedia si te lo doy; completa con lo que sepas con seguridad.
- Si no estás seguro de un campo, NO lo incluyas. Es mejor omitir que inventar.
- Campos tipo "m" (varias opciones): "v" es una LISTA con valores copiados EXACTAMENTE de las opciones dadas. Si lo correcto no está en las opciones, usa la lista vacía y pon el dato en "n".
- Campos tipo "s" (una opción): "v" es UN valor copiado exactamente de las opciones; si no encaja, déjalo vacío y explica en "n".
- Campos tipo "t" o "a" (texto): "v" es un texto breve en español (máximo 2 frases).
- "n" es opcional: máximo 15 palabras (por ejemplo, la fuente o una aclaración: "según UICN 2020", "no evaluado por la UICN").
- Todo en español.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return reply({ ok: false, mensaje: 'Método no permitido.' });

  let nombre = '', comun = '', reino = '', wiki = '';
  let campos: Campo[] = [];
  try {
    const b = await req.json();
    nombre = String(b.nombre ?? '').trim().slice(0, 120);
    comun = String(b.comun ?? '').trim().slice(0, 120);
    reino = String(b.reino ?? '').trim().slice(0, 40);
    wiki = String(b.wiki ?? '').slice(0, 9000);
    campos = (Array.isArray(b.campos) ? b.campos : []).slice(0, 80).map((c: Record<string, unknown>) => ({
      k: String(c.k ?? '').slice(0, 40),
      l: String(c.l ?? '').slice(0, 120),
      t: String(c.t ?? 't').slice(0, 1),
      o: Array.isArray(c.o) ? c.o.slice(0, 40).map((x: unknown) => String(x).slice(0, 80)) : undefined,
    }));
  } catch {
    return reply({ ok: false, mensaje: 'La petición no es válida.' });
  }
  if (!nombre || !campos.length) return reply({ ok: false, mensaje: 'Falta el nombre científico o los campos.' });

  const lista = campos
    .map((c) => `- ${c.k} (tipo ${c.t}) «${c.l}»` + (c.o?.length ? ` · opciones: ${c.o.join(' | ')}` : ''))
    .join('\n');
  const user = `Especie: ${nombre}${comun ? ` (nombre común: ${comun})` : ''} · Reino: ${reino || 'desconocido'}

Campos de la ficha:
${lista}
${wiki ? `\nTexto de Wikipedia:\n"""\n${wiki}\n"""` : '\n(No hay texto de Wikipedia.)'}`;

  const fallos: string[] = [];
  for (const p of ['openrouter', 'gemini'] as const) {
    try {
      const txt = p === 'gemini' ? await viaGemini(user) : await viaOpenRouter(user);
      const datos = limpiar(txt, campos);
      if (!datos) { fallos.push(`${p}: la respuesta no fue un JSON válido.`); continue; }
      return reply({ ok: true, datos, proveedor: p });
    } catch (e) {
      fallos.push((e as Error).message);
    }
  }
  return reply({ ok: false, mensaje: fallos.join('\n') });
});

// Extrae el JSON y descarta claves desconocidas u opciones que no existen
function limpiar(txt: string, campos: Campo[]): Record<string, { v: string | string[]; n?: string }> | null {
  const a = txt.indexOf('{'), b = txt.lastIndexOf('}');
  if (a < 0 || b < a) return null;
  let raw: Record<string, { v?: unknown; n?: unknown }>;
  try { raw = JSON.parse(txt.slice(a, b + 1)); } catch { return null; }
  const out: Record<string, { v: string | string[]; n?: string }> = {};
  for (const c of campos) {
    const r = raw[c.k];
    if (!r || typeof r !== 'object') continue;
    const n = r.n ? String(r.n).slice(0, 160) : undefined;
    let v: string | string[];
    if (c.t === 'm' || c.t === 's') {
      const ops = new Map((c.o ?? []).map((o) => [o.toLowerCase(), o]));
      const arr = (Array.isArray(r.v) ? r.v : [r.v]).map((x) => ops.get(String(x ?? '').trim().toLowerCase())).filter(Boolean) as string[];
      v = c.t === 's' ? (arr[0] ?? '') : arr;
    } else {
      v = String(r.v ?? '').trim().slice(0, 400);
    }
    if ((Array.isArray(v) ? v.length : v) || n) out[c.k] = n ? { v, n } : { v };
  }
  return out;
}

async function viaOpenRouter(user: string): Promise<string> {
  const key = Deno.env.get('OPENROUTER_API_KEY');
  if (!key) throw new Error('Falta el secreto OPENROUTER_API_KEY en Supabase.');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', 'x-title': 'Biotaxo dex' },
    body: JSON.stringify({
      model: Deno.env.get('OPENROUTER_MODEL') || 'openrouter/free',
      temperature: 0.2,
      max_tokens: 3000,
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenRouter no respondió: ${data?.error?.message ?? `error ${res.status}`}`);
  return String(data?.choices?.[0]?.message?.content ?? '');
}

async function viaGemini(user: string): Promise<string> {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) throw new Error('Falta el secreto GEMINI_API_KEY en Supabase.');
  const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.5-flash-lite';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4096, responseMimeType: 'application/json' },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Gemini no respondió: ${data?.error?.message ?? `error ${res.status}`}`);
  const parts: { text?: string }[] = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? '').join('');
}
