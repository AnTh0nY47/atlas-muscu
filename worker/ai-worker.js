// Relais entre Atlas Muscu et l'API Gemini (Google), à déployer sur Cloudflare Workers
// (offre gratuite, aucune carte requise). Ce fichier n'est jamais servi par le site :
// il vit uniquement dans le tableau de bord Cloudflare, à part.
//
// Rôle de ce relais : garder la clé de l'API Gemini secrète. Le site (public, sur GitHub
// Pages) ne connaît jamais cette clé : il ne connaît que l'adresse de ce relais et un mot
// de passe simple (APP_SECRET), stockés localement sur le téléphone de la personne qui
// utilise l'appli.
//
// Deux variables à configurer dans Cloudflare, en tant que secrets (jamais écrites ici) :
//   GEMINI_API_KEY  la clé récupérée sur aistudio.google.com
//   APP_SECRET      un mot de passe inventé par toi, à recopier aussi dans l'appli

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders() });
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    if (env.APP_SECRET && request.headers.get('x-app-secret') !== env.APP_SECRET) {
      return json({ error: 'forbidden' }, 403);
    }

    let body;
    try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

    const prompt = body && body.prompt;
    if (!prompt || typeof prompt !== 'string' || prompt.length > 6000) {
      return json({ error: 'bad_prompt' }, 400);
    }

    const model = 'gemini-3.5-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

    let geminiRes;
    try {
      geminiRes = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
        }),
      });
    } catch {
      return json({ error: 'gemini_unreachable' }, 502);
    }

    if (!geminiRes.ok) {
      const detail = await geminiRes.text().catch(() => '');
      return json({ error: 'gemini_error', detail: detail.slice(0, 300) }, 502);
    }

    const data = await geminiRes.json();
    const text = data && data.candidates && data.candidates[0] && data.candidates[0].content
      && data.candidates[0].content.parts && data.candidates[0].content.parts[0]
      && data.candidates[0].content.parts[0].text || '';

    return json({ text });
  },
};

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type, x-app-secret',
  };
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...corsHeaders() } });
}
