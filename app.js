(() => {
  const API = 'https://oss.exercisedb.dev/api/v1/exercises';
  const PAGE = 48;

  /* Traductions */
  const BP = { back: 'Dos', cardio: 'Cardio', chest: 'Pectoraux', 'lower arms': 'Avant-bras', 'lower legs': 'Mollets', neck: 'Cou', shoulders: 'Épaules', 'upper arms': 'Bras', 'upper legs': 'Cuisses', waist: 'Abdos' };
  const EQ = { assisted: 'Assisté', band: 'Élastique', barbell: 'Barre', 'body weight': 'Poids du corps', 'bosu ball': 'Bosu', cable: 'Poulie', dumbbell: 'Haltère', 'elliptical machine': 'Elliptique', 'ez barbell': 'Barre EZ', hammer: 'Masse', kettlebell: 'Kettlebell', 'leverage machine': 'Machine guidée', 'medicine ball': 'Médecine ball', 'olympic barbell': 'Barre olympique', 'resistance band': 'Bande de résistance', roller: 'Rouleau', rope: 'Corde', 'skierg machine': 'SkiErg', 'sled machine': 'Traîneau', 'smith machine': 'Smith machine', 'stability ball': 'Swiss ball', 'stationary bike': 'Vélo', 'stepmill machine': 'Stepper', tire: 'Pneu', 'trap bar': 'Trap bar', 'upper body ergometer': 'Ergomètre bras', weighted: 'Lesté', 'wheel roller': 'Roue abdominale' };
  const MU = { abductors: 'Abducteurs', abs: 'Abdominaux', adductors: 'Adducteurs', biceps: 'Biceps', calves: 'Mollets', 'cardiovascular system': 'Système cardio', delts: 'Deltoïdes', deltoids: 'Deltoïdes', forearms: 'Avant-bras', glutes: 'Fessiers', hamstrings: 'Ischio-jambiers', lats: 'Grand dorsal', 'latissimus dorsi': 'Grand dorsal', 'levator scapulae': 'Élévateur de la scapula', pectorals: 'Pectoraux', chest: 'Pectoraux', 'upper chest': 'Haut des pectoraux', quads: 'Quadriceps', quadriceps: 'Quadriceps', 'serratus anterior': 'Grand dentelé', spine: 'Érecteurs du rachis', traps: 'Trapèzes', trapezius: 'Trapèzes', triceps: 'Triceps', 'upper back': 'Haut du dos', shoulders: 'Épaules', core: 'Sangle abdominale', 'lower back': 'Bas du dos', obliques: 'Obliques', 'hip flexors': 'Fléchisseurs de hanche', rhomboids: 'Rhomboïdes', 'rear deltoids': 'Deltoïdes postérieurs', wrists: 'Poignets', wrist: 'Poignets', back: 'Dos', 'inner thighs': 'Intérieur des cuisses', groin: 'Adducteurs', ankles: 'Chevilles', 'ankle stabilizers': 'Stabilisateurs de cheville', soleus: 'Soléaire', brachialis: 'Brachial', 'lower abs': 'Bas des abdos', feet: 'Pieds', shins: 'Tibias', hands: 'Mains', neck: 'Cou', sternocleidomastoid: 'Sterno-cléido-mastoïdien', 'rotator cuff': 'Coiffe des rotateurs', hips: 'Hanches', 'grip muscles': 'Muscles de la préhension', 'wrist extensors': 'Extenseurs du poignet', 'wrist flexors': 'Fléchisseurs du poignet' };
  const mu = (e, k) => MU[k] || e.mfr[k] || fr(MU, k);
  const fr = (d, k) => d[k] || (k ? k.charAt(0).toUpperCase() + k.slice(1) : '');

  /* Carte musculaire : moitié gauche, recopiée en miroir */
  const FRONT = [
    ['base', 'e', 60, 20, 11, 14, 0],
    ['neck', 'p', 'M53 31 L53 42 L67 42 L67 31 Z', 0],
    ['trapsF', 'p', 'M53 40 Q45 43 38 47 L53 47 Z', 1],
    ['delts', 'p', 'M38 47 Q28 48 26 60 Q26 67 30 71 Q34 60 42 53 Z', 1],
    ['pecs', 'p', 'M42 49 Q52 46 59.5 48 L59.5 67 Q48 72 38 66 Q35 58 42 49 Z', 1],
    ['biceps', 'p', 'M26 67 Q22 80 25 93 Q30 95 33 90 Q35 79 31 71 Z', 1],
    ['forearms', 'p', 'M24.5 95 Q19 108 18 125 Q21 127 24 125 Q30 111 32.5 92 Z', 1],
    ['base', 'e', 19.5, 132, 4, 7, 1],
    ['serratus', 'p', 'M38 67 Q39 74 41 81 L46 79 L45 70 Z', 1],
    ['obliques', 'p', 'M41 82 Q40 97 46 108 L50.5 105 L49 79 Z', 1],
    ['abs', 'p', 'M50.5 72 L59.5 72 L59.5 110 L52 110 Q50.5 92 50.5 72 Z', 1],
    ['base', 'p', 'M46 108 L52 110 L59.5 110 L59.5 122 L47 121 Z', 1],
    ['quads', 'p', 'M46 121 Q38 142 40.5 169 Q46 175 52 169 Q56 146 56 123 Z', 1],
    ['adductors', 'p', 'M56 123 Q56 142 54.5 160 L59.5 150 L59.5 122 Z', 1],
    ['base', 'e', 47, 177, 5, 5, 1],
    ['calvesF', 'p', 'M42 183 Q39 206 42.5 229 L47.5 229 Q51 206 51 183 Z', 1],
    ['base', 'e', 45, 236, 6, 3.6, 1],
  ];
  const BACK = [
    ['base', 'e', 60, 20, 11, 14, 0],
    ['traps', 'p', 'M60 31 L53 32 L50 40 L38 47 Q50 52 60 80 Q70 52 82 47 L70 40 L67 32 Z', 0],
    ['delts', 'p', 'M38 47 Q28 48 26 60 Q26 67 30 71 Q34 60 42 53 Z', 1],
    ['triceps', 'p', 'M26 67 Q22 80 25 93 Q30 95 33 90 Q35 79 31 71 Z', 1],
    ['forearms', 'p', 'M24.5 95 Q19 108 18 125 Q21 127 24 125 Q30 111 32.5 92 Z', 1],
    ['base', 'e', 19.5, 132, 4, 7, 1],
    ['upperback', 'p', 'M42 53 L52 57 L58 76 L49 72 Z', 1],
    ['lats', 'p', 'M40 57 Q35 76 43 97 L55 90 Q53 80 49 73 L42 54 Z', 1],
    ['lowerback', 'p', 'M55 90 L59.5 82 L59.5 108 L47 108 Q45 100 43 97 Z', 1],
    ['glutes', 'p', 'M47 108 Q40 122 45 134 Q53 139 59.5 133 L59.5 108 Z', 1],
    ['hamstrings', 'p', 'M45 136 Q40 153 43 171 L52 171 Q56 153 57.5 137 Z', 1],
    ['base', 'e', 47, 177, 5, 5, 1],
    ['calves', 'p', 'M41.5 183 Q37 199 42 215 L48 215 Q53 199 51 183 Z', 1],
    ['base', 'p', 'M42 215 L48 215 L47 231 L43 231 Z', 1],
    ['base', 'e', 45, 236, 6, 3.6, 1],
  ];
  function shape(s, cls) {
    const [, t] = s;
    const el = t === 'e' ? `<ellipse cx="${s[2]}" cy="${s[3]}" rx="${s[4]}" ry="${s[5]}" class="${cls}"/>` : `<path d="${s[2]}" class="${cls}"/>`;
    const mirror = s[s.length - 1];
    return mirror ? el + el.replace(/^<(\w+)/, '<$1 transform="matrix(-1 0 0 1 120 0)"') : el;
  }
  function bodySVG(view, prim = new Set(), sec = new Set()) {
    const set = view === 'b' ? BACK : FRONT;
    return `<svg class="body" viewBox="0 0 120 244" aria-hidden="true">${set.map(s => shape(s, prim.has(s[0]) ? 'p' : sec.has(s[0]) ? 's' : '')).join('')}</svg>`;
  }
  const RULES = [
    [/pectoral|chest/, ['pecs']],
    [/delt|shoulder|rotator/, ['delts']],
    [/bicep|brachialis/, ['biceps']],
    [/tricep/, ['triceps']],
    [/forearm|wrist|grip|hand/, ['forearms']],
    [/oblique/, ['obliques']],
    [/serratus/, ['serratus']],
    [/\babs\b|abdominal|core|lower abs/, ['abs']],
    [/quad|hip flexor/, ['quads']],
    [/adductor|inner thigh|groin/, ['adductors']],
    [/abductor|glute|^hips?$/, ['glutes']],
    [/hamstring/, ['hamstrings']],
    [/calv|soleus|gastrocnemius|ankle|shin|tibialis|feet/, ['calves', 'calvesF']],
    [/\blats?\b|latissimus/, ['lats']],
    [/upper back|rhomboid|rear delt/, ['upperback']],
    [/trap|levator/, ['traps', 'trapsF']],
    [/neck|sternocleido/, ['neck', 'trapsF']],
    [/spine|lower back|erector/, ['lowerback']],
    [/^back$/, ['lats', 'upperback']],
  ];
  function regions(list) {
    const s = new Set();
    for (const m of list) {
      const t = m.toLowerCase();
      for (const [re, rs] of RULES) if (re.test(t)) rs.forEach(r => s.add(r));
    }
    return s;
  }

  /* Catégories, comme la barre de filtres de la capture */
  const HEART = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#e8452c" stroke-width="1.6" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M5 12h4l1.5-2 2 4 1.5-2H19" stroke-linecap="round"/></svg>';
  const BOOK = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#3a3f46" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';
  const has = (arr, v) => arr.includes(v);
  const CATS = [
    { id: 'fav', label: 'Favoris', icon: BOOK },
    { id: 'all', label: 'Tous', view: 'f', hl: [] },
    { id: 'cardio', label: 'Cardio', icon: HEART, test: e => has(e.bp, 'cardio') },
    { id: 'chest', label: 'Pectoraux', view: 'f', hl: ['pecs'], test: e => has(e.bp, 'chest') },
    { id: 'back', label: 'Dos', view: 'b', hl: ['lats', 'upperback', 'traps', 'lowerback'], test: e => has(e.bp, 'back') },
    { id: 'biceps', label: 'Biceps', view: 'f', hl: ['biceps'], test: e => has(e.tg, 'biceps') },
    { id: 'triceps', label: 'Triceps', view: 'b', hl: ['triceps'], test: e => has(e.tg, 'triceps') },
    { id: 'quads', label: 'Quadriceps', view: 'f', hl: ['quads'], test: e => has(e.tg, 'quads') },
    { id: 'hams', label: 'Ischios', view: 'b', hl: ['hamstrings'], test: e => has(e.tg, 'hamstrings') },
    { id: 'shoulders', label: 'Épaules', view: 'f', hl: ['delts'], test: e => has(e.bp, 'shoulders') },
    { id: 'glutes', label: 'Fessiers', view: 'b', hl: ['glutes'], test: e => ['glutes', 'abductors', 'adductors'].some(m => has(e.tg, m)) },
    { id: 'waist', label: 'Abdos', view: 'f', hl: ['abs', 'obliques'], test: e => has(e.bp, 'waist') },
    { id: 'calves', label: 'Mollets', view: 'b', hl: ['calves'], test: e => has(e.bp, 'lower legs') },
    { id: 'forearms', label: 'Avant-bras', view: 'f', hl: ['forearms'], test: e => has(e.bp, 'lower arms') },
    { id: 'neck', label: 'Cou', view: 'f', hl: ['neck', 'trapsF'], test: e => has(e.bp, 'neck') },
  ];

  /* Stockage local */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('atlas.' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('atlas.' + k, JSON.stringify(v)); } catch { } },
  };

  const S = { all: [], byId: new Map(), cat: store.get('cat', 'all'), equip: '', q: '', shown: PAGE, favs: new Set(store.get('favs', [])), current: null };
  const $ = id => document.getElementById(id);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const title = s => s.replace(/(^|[\s(-])([a-z])/g, (m, a, b) => a + b.toUpperCase());

  function normalize(raw) {
    return raw.map(x => {
      const e = {
        id: x.exerciseId || x.id, name: x.nameFr || title(x.name || ''), en: x.name || '', gif: x.gifUrl, mfr: x.musclesFr || {},
        bp: x.bodyParts || (x.bodyPart ? [x.bodyPart] : []), eq: x.equipments || (x.equipment ? [x.equipment] : []),
        tg: x.targetMuscles || (x.target ? [x.target] : []), sec: x.secondaryMuscles || [],
        steps: x.instructionsFr || (x.instructions || []).map(s => s.replace(/^step\s*:?\s*\d+\s*[:.)-]?\s*/i, '')),
      };
      e.hay = norm([e.name, e.en, ...e.bp.map(v => fr(BP, v)), ...e.eq.map(v => fr(EQ, v)), ...e.tg.map(v => fr(MU, v)), ...e.bp, ...e.eq, ...e.tg].join(' '));
      return e;
    }).filter(e => e.id && e.gif).sort((a, b) => a.name.localeCompare(b.name));
  }

  async function load() {
    if (Array.isArray(window.EXERCISES) && window.EXERCISES.length) return window.EXERCISES;
    const cached = store.get('cache', null);
    if (cached && cached.length) return cached;
    const out = []; let after = null;
    for (let i = 0; i < 200; i++) {
      const u = new URL(API); u.searchParams.set('limit', '100'); if (after) u.searchParams.set('after', after);
      const r = await fetch(u);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      out.push(...j.data);
      $('status').textContent = `Chargement des exercices : ${out.length} sur ${j.meta.total}`;
      if (!j.meta.hasNextPage || !j.meta.nextCursor) break;
      after = j.meta.nextCursor;
    }
    store.set('cache', out);
    return out;
  }

  /* Filtres */
  function renderCats() {
    $('cats').innerHTML = CATS.map(c => `<button class="cat" data-cat="${c.id}" aria-pressed="${c.id === S.cat}"><span class="ico">${c.icon || bodySVG(c.view, new Set(c.hl))}</span><span>${c.label}</span></button>`).join('');
  }
  $('cats').addEventListener('click', e => {
    const b = e.target.closest('.cat'); if (!b) return;
    S.cat = b.dataset.cat; store.set('cat', S.cat); S.shown = PAGE;
    $('cats').querySelectorAll('.cat').forEach(x => x.setAttribute('aria-pressed', x.dataset.cat === S.cat));
    renderGrid(); window.scrollTo({ top: 0 });
  });
  let qt; $('q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { S.q = norm(e.target.value.trim()); S.shown = PAGE; renderGrid(); }, 120); });
  $('equip').addEventListener('change', e => { S.equip = e.target.value; S.shown = PAGE; renderGrid(); });

  function filtered() {
    const cat = CATS.find(c => c.id === S.cat) || CATS[1];
    const words = S.q ? S.q.split(/\s+/) : [];
    return S.all.filter(e =>
      (cat.id !== 'fav' || S.favs.has(e.id)) &&
      (!cat.test || cat.test(e)) &&
      (!S.equip || e.eq.includes(S.equip)) &&
      words.every(w => e.hay.includes(w)));
  }

  const BM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';
  const sub = e => fr(BP, e.bp[0]);
  function card(e) {
    return `<article class="card" data-id="${e.id}">
      <button class="open" aria-label="${e.name}"><span class="pic"><img src="${e.gif}" alt="" loading="lazy" decoding="async" onerror="window.gifFail(this)"></span>
      <span class="txt"><span class="nm">${e.name}</span><span class="sub">${sub(e)}</span></span></button>
      <button class="bm" aria-pressed="${S.favs.has(e.id)}" aria-label="Enregistrer">${BM}</button></article>`;
  }
  let list = [];
  function renderGrid() {
    list = filtered();
    $('count').textContent = `${list.length} exercice${list.length > 1 ? 's' : ''}`;
    if (!list.length) {
      $('grid').innerHTML = `<p class="empty">${S.cat === 'fav' && !S.q ? 'Aucun exercice enregistré. Appuie sur le marque-page d\'un exercice pour le retrouver ici.' : 'Aucun exercice trouvé.'}</p>`;
      return;
    }
    $('grid').innerHTML = list.slice(0, S.shown).map(card).join('');
  }
  new IntersectionObserver(en => {
    if (en[0].isIntersecting && S.shown < list.length) {
      const from = S.shown; S.shown += PAGE;
      $('grid').insertAdjacentHTML('beforeend', list.slice(from, S.shown).map(card).join(''));
    }
  }, { rootMargin: '600px' }).observe($('more'));

  $('grid').addEventListener('click', e => {
    const c = e.target.closest('.card'); if (!c) return;
    if (e.target.closest('.bm')) return toggleFav(c.dataset.id);
    if (e.target.closest('.open')) location.hash = '#/exercice/' + c.dataset.id;
  });

  function toggleFav(id) {
    S.favs.has(id) ? S.favs.delete(id) : S.favs.add(id);
    store.set('favs', [...S.favs]);
    document.querySelectorAll(`.card[data-id="${CSS.escape(id)}"] .bm`).forEach(b => b.setAttribute('aria-pressed', S.favs.has(id)));
    if (S.current && S.current.id === id) setFavBtn();
    if (S.cat === 'fav') renderGrid();
  }

  /* Fiche exercice */
  function setFavBtn() {
    const on = S.favs.has(S.current.id);
    $('mFav').setAttribute('aria-pressed', on);
    $('mFav').querySelector('span').textContent = on ? 'Enregistré' : 'Enregistrer';
  }
  let lastFocus = null;
  function openEx(id) {
    const e = S.byId.get(id); if (!e) return;
    if ($('modal').hidden) lastFocus = document.activeElement;
    S.current = e;
    $('mTitle').textContent = e.name;
    const g = $('mGif'); g.style.width = '';
    g.onload = () => { const w = g.naturalWidth; if (w) g.style.width = Math.min(420, Math.round(w * 1.5)) + 'px'; };
    g.src = e.gif; $('mGif').alt = 'Démonstration animée : ' + e.name;
    setFavBtn();
    const prim = regions(e.tg), sec = regions(e.sec); prim.forEach(r => sec.delete(r));
    $('mMaps').innerHTML = bodySVG('f', prim, sec) + bodySVG('b', prim, sec);
    const row = (k, v) => `<dt>${k}</dt><dd>${v || '-'}</dd>`;
    $('mFacts').innerHTML =
      row('Zone', e.bp.map(v => fr(BP, v)).join(', ')) +
      row('Matériel', e.eq.map(v => fr(EQ, v)).join(', ')) +
      row('Muscles principaux', e.tg.map(v => mu(e, v)).join(', ')) +
      row('Muscles secondaires', e.sec.map(v => mu(e, v)).join(', '));
    $('mSteps').innerHTML = e.steps.map(s => `<li>${s}</li>`).join('');
    const rel = S.all.filter(x => x.id !== e.id && x.tg[0] === e.tg[0]).slice(0, 12);
    $('mRelatedWrap').hidden = !rel.length;
    $('mRelated').innerHTML = rel.map(x => `<button data-id="${x.id}"><img src="${x.gif}" alt="" loading="lazy" onerror="window.gifFail(this)"><span>${x.name}</span></button>`).join('');
    $('modal').hidden = false; document.body.style.overflow = 'hidden';
    $('sheet').scrollTop = 0;
    $('sheet').querySelector('.icon').focus();
  }
  function closeEx() {
    $('modal').hidden = true; document.body.style.overflow = ''; S.current = null; $('mGif').removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('modal').addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { history.length > 1 && location.hash ? history.back() : (location.hash = ''); return; }
    const r = e.target.closest('.rel button'); if (r) location.hash = '#/exercice/' + r.dataset.id;
  });
  $('mFav').addEventListener('click', () => S.current && toggleFav(S.current.id));
  $('mShare').addEventListener('click', async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: S.current.name, url });
      else { await navigator.clipboard.writeText(url); toast('Lien copié'); }
    } catch { }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('modal').hidden) $('modal').querySelector('[data-close]').click(); });
  function route() {
    const m = location.hash.match(/^#\/exercice\/(.+)$/);
    if (m) openEx(decodeURIComponent(m[1])); else if (!$('modal').hidden) closeEx();
  }
  addEventListener('hashchange', route);

  let tt; function toast(t) { const el = $('toast'); el.textContent = t; el.hidden = false; clearTimeout(tt); tt = setTimeout(() => el.hidden = true, 1800); }

  /* Animation qui ne se charge pas : un nouvel essai, puis on masque la carte */
  window.gifFail = img => {
    if (!img.dataset.retry) {
      img.dataset.retry = '1';
      const src = img.src.split('?')[0];
      setTimeout(() => { img.src = src + '?r=' + Date.now(); }, 1500);
      return;
    }
    const box = img.closest('.card, .rel button');
    if (box) box.hidden = true;
  };

  /* Démarrage */
  renderCats();
  load().then(raw => {
    S.all = normalize(raw);
    S.all.forEach(e => S.byId.set(e.id, e));
    const eqs = [...new Set(S.all.flatMap(e => e.eq))].sort((a, b) => fr(EQ, a).localeCompare(fr(EQ, b)));
    $('equip').insertAdjacentHTML('beforeend', eqs.map(q => `<option value="${q}">${fr(EQ, q)}</option>`).join(''));
    $('status').hidden = true;
    renderGrid(); route();
  }).catch(err => {
    $('status').textContent = 'Impossible de charger les exercices (' + err.message + '). Lance "node scripts/sync.mjs" pour les télécharger, puis recharge la page.';
  });
})();
