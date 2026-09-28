// Outil temporaire, à usage unique : récupère toute la base d'exercices publique
// de wger.de et la renvoie sous une forme compacte, prête à être analysée puis
// intégrée en dur dans Atlas Muscu (plus aucun appel à ce Worker ni à wger.de
// ne sera nécessaire une fois les données récupérées).
//
// Déploiement : même procédure que pour le Worker de l'IA (Cloudflare
// dashboard > Workers & Pages > Create > coller ce code > Deploy).
// Pas de mot de passe nécessaire ici, les données sont publiques en lecture.
//
// Une fois déployé, ouvre l'URL du Worker dans Safari. La réponse JSON
// s'affiche ou se télécharge. Sauvegarde ce fichier puis envoie le moi.

const WGER_BASE = 'https://wger.de/api/v2/exerciseinfo/';
const FR = 12; // id de langue française chez wger
const EN = 2;

async function fetchAllExercises() {
  const all = [];
  let url = `${WGER_BASE}?limit=100&format=json`;
  let pages = 0;
  while (url && pages < 30) {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      throw new Error(`wger a répondu ${res.status} sur ${url}`);
    }
    const data = await res.json();
    all.push(...(data.results || []));
    url = data.next;
    pages++;
  }
  return all;
}

function pickTranslation(translations) {
  const fr = translations.find(t => t.language === FR && t.name);
  if (fr) return { ...fr, lang: 'fr' };
  const en = translations.find(t => t.language === EN && t.name);
  if (en) return { ...en, lang: 'en' };
  const any = translations.find(t => t.name);
  return any ? { ...any, lang: 'autre' } : null;
}

function pickImage(images) {
  if (!images || !images.length) return null;
  const main = images.find(i => i.is_main) || images[0];
  return {
    url: main.image || (main.thumbnails && main.thumbnails.medium) || null,
    license_title: main.license_title || null,
    license_author: main.license_author || null,
  };
}

function stripHtml(s) {
  return (s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default {
  async fetch(request) {
    try {
      const raw = await fetchAllExercises();

      let withFr = 0, withImage = 0, withAnyTranslation = 0;
      const exercises = [];

      for (const ex of raw) {
        const tr = pickTranslation(ex.translations || []);
        if (tr) withAnyTranslation++;
        if (tr && tr.lang === 'fr') withFr++;
        const img = pickImage(ex.images);
        if (img && img.url) withImage++;

        exercises.push({
          id: ex.id,
          uuid: ex.uuid,
          category: ex.category ? ex.category.name : null,
          muscles: (ex.muscles || []).map(m => ({ name: m.name, name_en: m.name_en })),
          muscles_secondary: (ex.muscles_secondary || []).map(m => ({ name: m.name, name_en: m.name_en })),
          equipment: (ex.equipment || []).map(e => e.name),
          name: tr ? tr.name : null,
          nameLang: tr ? tr.lang : null,
          description: tr ? stripHtml(tr.description) : null,
          image: img,
        });
      }

      const body = {
        summary: {
          total: raw.length,
          avec_traduction_francaise: withFr,
          avec_traduction_quelconque: withAnyTranslation,
          avec_image: withImage,
          genere_le: new Date().toISOString(),
        },
        exercises,
      };

      return new Response(JSON.stringify(body), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'access-control-allow-origin': '*',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err && err.message || err) }), {
        status: 500,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }
  },
};
