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

  const S = { all: [], byId: new Map(), cat: store.get('cat', 'all'), equip: '', q: '', shown: PAGE, favs: new Set(store.get('favs', [])), current: null, seances: store.get('seances', []), history: store.get('history', []), picking: null };
  const $ = id => document.getElementById(id);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const title = s => s.replace(/(^|[\s(-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const saveSeances = () => store.set('seances', S.seances);
  const saveHistory = () => store.set('history', S.history);
  function fmtDuration(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    if (m < 60) return s ? `${m} min ${s}` : `${m} min`;
    return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`;
  }
  function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  /* Hors-ligne : l'appli reste utilisable à la salle sans réseau */
  if ('serviceWorker' in navigator) {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
  }

  /* Écran qui reste allumé pendant l'entraînement */
  let wakeLock = null;
  async function requestWake() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch { }
  }
  function releaseWake() { try { wakeLock && wakeLock.release(); } catch { } wakeLock = null; }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !$('viewRun').hidden) requestWake();
  });

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
    if (e.target.closest('.open')) {
      if (S.picking) return addExToSeance(S.picking, c.dataset.id);
      location.hash = '#/exercice/' + c.dataset.id;
    }
  });

  function toggleFav(id) {
    S.favs.has(id) ? S.favs.delete(id) : S.favs.add(id);
    store.set('favs', [...S.favs]);
    document.querySelectorAll(`.card[data-id="${CSS.escape(id)}"] .bm`).forEach(b => b.setAttribute('aria-pressed', S.favs.has(id)));
    if (S.current && S.current.id === id) setFavBtn();
    if (S.cat === 'fav') renderGrid();
  }

  /* Minuteur réutilisable (fiche exercice + mode séance) */
  function makeTimer(displayEl, onDone) {
    let total = 45, remaining = 45, iv = null, running = false;
    function render() {
      const m = Math.floor(remaining / 60), s = remaining % 60;
      displayEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    }
    function beep() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(.16, ctx.currentTime);
        o.start(); o.stop(ctx.currentTime + .35);
        o.onended = () => ctx.close();
      } catch { }
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    render();
    return {
      set(sec) { total = Math.max(5, sec); remaining = total; render(); },
      adjust(d) { remaining = Math.max(0, remaining + d); if (remaining > total) total = remaining; render(); },
      start() {
        if (running || remaining <= 0) return; running = true;
        iv = setInterval(() => {
          remaining--; render();
          if (remaining <= 0) { clearInterval(iv); running = false; beep(); onDone && onDone(); }
        }, 1000);
      },
      pause() { running = false; clearInterval(iv); },
      toggle() { this.running ? this.pause() : this.start(); },
      reset() { this.pause(); remaining = total; render(); },
      get running() { return running; },
      get remaining() { return remaining; },
    };
  }
  const exTimer = makeTimer($('timerDisplay'), () => { $('timerStart').textContent = 'Démarrer'; });
  $('mTimerWrap').addEventListener('click', e => {
    const p = e.target.closest('[data-preset]');
    if (p) { exTimer.set(+p.dataset.preset); $('timerStart').textContent = 'Démarrer'; return; }
    const a = e.target.closest('[data-adj]');
    if (a) return exTimer.adjust(+a.dataset.adj);
  });
  $('timerStart').addEventListener('click', () => { exTimer.toggle(); $('timerStart').textContent = exTimer.running ? 'Pause' : 'Démarrer'; });
  $('timerReset').addEventListener('click', () => { exTimer.reset(); $('timerStart').textContent = 'Démarrer'; });

  /* Séances : création, édition, ajout d'exercices, mode entraînement */
  function renderSeancesList() {
    $('seancesEmpty').hidden = !!S.seances.length;
    $('seancesList').innerHTML = S.seances.map(s => `
      <button class="seance-card" data-id="${s.id}">
        <span class="nm">${s.name || 'Séance sans nom'}</span>
        <span class="cnt">${s.items.length} exercice${s.items.length > 1 ? 's' : ''}</span>
      </button>`).join('');
  }
  $('seancesList').addEventListener('click', e => {
    const b = e.target.closest('.seance-card'); if (!b) return;
    location.hash = '#/seance/' + b.dataset.id;
  });
  $('newSeanceBtn').addEventListener('click', () => {
    const s = { id: uid(), name: '', items: [] };
    S.seances.push(s); saveSeances();
    location.hash = '#/seance/' + s.id;
  });

  function addExToSeance(seanceId, exId) {
    const s = S.seances.find(x => x.id === seanceId); if (!s) return;
    if (s.items.some(it => it.exId === exId)) { toast('Déjà dans la séance'); return; }
    const last = lastPerf(exId);
    s.items.push({ exId, sets: 3, reps: last ? last.reps : 12, rest: 60, weight: last ? last.weight : 0 });
    saveSeances();
    toast('Ajouté à la séance');
  }

  let curSeance = null;
  function openSeance(id) {
    curSeance = S.seances.find(s => s.id === id);
    if (!curSeance) { location.hash = '#/seances'; return; }
    $('seanceNameInput').value = curSeance.name || '';
    renderSeanceItems();
    showView('seanceDetail');
  }
  function renderSeanceItems() {
    const items = curSeance.items;
    $('seanceEmptyMsg').hidden = !!items.length;
    $('seanceItems').innerHTML = items.map((it, i) => {
      const ex = S.byId.get(it.exId); if (!ex) return '';
      return `<div class="seitem" data-i="${i}">
        <img src="${ex.gif}" alt="" loading="lazy" onerror="window.gifFail(this)">
        <div class="seitem-info">
          <span class="nm">${ex.name}</span>
          <div class="seitem-fields">
            <label>Séries<input type="number" min="1" class="f-sets" value="${it.sets}"></label>
            <label>Répét.<input type="number" min="1" class="f-reps" value="${it.reps}"></label>
            <label>Charge<input type="number" min="0" step="0.5" class="f-weight" value="${it.weight || ''}"> kg</label>
            <label>Repos<input type="number" min="0" step="5" class="f-rest" value="${it.rest}"> s</label>
          </div>
        </div>
        <div class="seitem-actions">
          <button class="icon" data-act="up" aria-label="Monter" ${i === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
          <button class="icon" data-act="down" aria-label="Descendre" ${i === items.length - 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg></button>
          <button class="icon" data-act="del" aria-label="Retirer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        </div>
      </div>`;
    }).join('');
  }
  $('seanceItems').addEventListener('click', e => {
    const row = e.target.closest('.seitem'); if (!row) return;
    const i = +row.dataset.i;
    const act = e.target.closest('[data-act]'); if (!act) return;
    if (act.dataset.act === 'del') curSeance.items.splice(i, 1);
    if (act.dataset.act === 'up' && i > 0) [curSeance.items[i - 1], curSeance.items[i]] = [curSeance.items[i], curSeance.items[i - 1]];
    if (act.dataset.act === 'down' && i < curSeance.items.length - 1) [curSeance.items[i + 1], curSeance.items[i]] = [curSeance.items[i], curSeance.items[i + 1]];
    saveSeances(); renderSeanceItems();
  });
  $('seanceItems').addEventListener('change', e => {
    const row = e.target.closest('.seitem'); if (!row) return;
    const it = curSeance.items[+row.dataset.i];
    if (e.target.classList.contains('f-sets')) it.sets = Math.max(1, +e.target.value || 1);
    if (e.target.classList.contains('f-reps')) it.reps = Math.max(1, +e.target.value || 1);
    if (e.target.classList.contains('f-weight')) it.weight = Math.max(0, +e.target.value || 0);
    if (e.target.classList.contains('f-rest')) it.rest = Math.max(0, +e.target.value || 0);
    saveSeances();
  });
  $('seanceNameInput').addEventListener('input', e => { curSeance.name = e.target.value; saveSeances(); });
  $('seanceDeleteBtn').addEventListener('click', () => {
    if (!confirm('Supprimer cette séance ?')) return;
    S.seances = S.seances.filter(s => s.id !== curSeance.id); saveSeances();
    location.hash = '#/seances';
  });
  $('seanceBackBtn').addEventListener('click', () => location.hash = '#/seances');
  $('seanceAddExBtn').addEventListener('click', () => location.hash = '#/seance/' + curSeance.id + '/ajouter');
  $('seanceStartBtn').addEventListener('click', () => {
    if (!curSeance.items.length) { toast('Ajoute au moins un exercice'); return; }
    location.hash = '#/seance/' + curSeance.id + '/lancer';
  });
  $('pickDone').addEventListener('click', () => { location.hash = '#/seance/' + S.picking; });

  /* Sélecteur de séance depuis la fiche exercice */
  function renderPickList() {
    $('pickList').innerHTML = S.seances.length
      ? S.seances.map(s => `<button class="pick-row" data-id="${s.id}"><span>${s.name || 'Séance sans nom'}</span><span class="cnt">${s.items.length}</span></button>`).join('')
      : '<p class="status">Aucune séance pour l’instant.</p>';
  }
  $('mAddSeance').addEventListener('click', () => { renderPickList(); $('pickModal').hidden = false; });
  $('pickModal').addEventListener('click', e => { if (e.target.closest('[data-close-pick]')) $('pickModal').hidden = true; });
  $('pickList').addEventListener('click', e => {
    const b = e.target.closest('.pick-row'); if (!b || !S.current) return;
    addExToSeance(b.dataset.id, S.current.id);
    $('pickModal').hidden = true;
  });
  $('pickNewBtn').addEventListener('click', () => {
    const name = $('pickNewName').value.trim();
    const s = { id: uid(), name, items: [] };
    if (S.current) {
      const last = lastPerf(S.current.id);
      s.items.push({ exId: S.current.id, sets: 3, reps: last ? last.reps : 12, rest: 60, weight: last ? last.weight : 0 });
    }
    S.seances.push(s); saveSeances();
    $('pickNewName').value = ''; $('pickModal').hidden = true;
    toast('Séance créée et exercice ajouté');
  });

  /* Historique : dernières performances connues pour un exercice */
  function lastPerf(exId) {
    for (const h of S.history) {
      const e = h.exercises.find(x => x.exId === exId);
      if (e && e.sets.length) return e.sets[e.sets.length - 1];
    }
    return null;
  }
  function exHistoryPoints(exId) {
    const pts = [];
    [...S.history].reverse().forEach(h => {
      const e = h.exercises.find(x => x.exId === exId);
      if (e && e.sets.length) {
        const best = e.sets.reduce((a, b) => (b.weight * (1 + b.reps / 30)) > (a.weight * (1 + a.reps / 30)) ? b : a);
        pts.push({ date: h.date, value: Math.round(best.weight * (1 + best.reps / 30) * 10) / 10, weight: best.weight, reps: best.reps });
      }
    });
    return pts;
  }
  function renderProgress(ex) {
    const pts = exHistoryPoints(ex.id);
    $('mProgressWrap').hidden = !pts.length;
    if (!pts.length) { $('mProgressChart').innerHTML = ''; return; }
    const last = pts[pts.length - 1];
    if (pts.length === 1) {
      $('mProgressChart').innerHTML = `<p class="run-meta">Dernière fois : ${last.weight} kg × ${last.reps}. Termine une deuxième séance avec cet exercice pour voir ta progression.</p>`;
      return;
    }
    const W = 560, H = 130, pad = 20;
    const vmax = Math.max(...pts.map(p => p.value)), vmin = Math.min(...pts.map(p => p.value));
    const span = Math.max(1, vmax - vmin);
    const xs = pts.map((_, i) => pad + i * (W - 2 * pad) / (pts.length - 1));
    const ys = pts.map(p => H - pad - (p.value - vmin) / span * (H - 2 * pad));
    const d = xs.map((x, i) => (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + ys[i].toFixed(1)).join(' ');
    const dots = xs.map((x, i) => `<circle cx="${x.toFixed(1)}" cy="${ys[i].toFixed(1)}" r="3.5"></circle>`).join('');
    $('mProgressChart').innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" class="progress-chart" role="img" aria-label="Évolution de la charge estimée au fil des séances">
        <path d="${d}" fill="none" class="line"/>
        ${dots}
      </svg>
      <p class="run-meta">Dernière fois : ${last.weight} kg × ${last.reps} (${fmtDate(last.date).split(' à ')[0]}) — 1RM estimé ${last.value} kg</p>`;
  }

  /* Mode entraînement : enchaîne séries et repos d'une séance, en notant le poids et les répétitions réels */
  let runState = null, runTimer = null, runClockIv = null;
  function buildRunSteps(seance) {
    const steps = [];
    seance.items.forEach((it, ii) => {
      for (let set = 1; set <= it.sets; set++) {
        steps.push({ type: 'work', itemIdx: ii, set });
        const last = ii === seance.items.length - 1 && set === it.sets;
        if (!last) steps.push({ type: 'rest', itemIdx: ii, seconds: it.rest });
      }
    });
    return steps;
  }
  function startRun(id) {
    const s = S.seances.find(x => x.id === id);
    if (!s || !s.items.length) { location.hash = '#/seance/' + id; return; }
    runState = { seance: s, steps: buildRunSteps(s), i: 0, startedAt: Date.now(), perf: new Map() };
    showView('run');
    requestWake();
    clearInterval(runClockIv);
    runClockIv = setInterval(() => {
      if (runState) $('runElapsed').textContent = fmtDuration(Math.round((Date.now() - runState.startedAt) / 1000));
    }, 1000);
    $('runElapsed').textContent = '0 min';
    renderRun();
  }
  function endRun() {
    releaseWake();
    clearInterval(runClockIv);
  }
  function renderRun() {
    if (runTimer) runTimer.pause();
    const { seance, steps, i } = runState;
    const step = steps[i];
    const it = seance.items[step.itemIdx];
    const ex = S.byId.get(it.exId);
    $('runProgress').textContent = `Étape ${i + 1} / ${steps.length}`;
    if (step.type === 'work') {
      const prev = lastPerf(it.exId);
      const w = it.weight || (prev ? prev.weight : 0);
      const r = it.reps || (prev ? prev.reps : '');
      $('runBody').innerHTML = `
        <img src="${ex.gif}" alt="">
        <h2>${ex.name}</h2>
        <p class="run-meta">Série ${step.set} / ${it.sets}</p>
        <div class="run-fields">
          <label>Poids (kg)<input type="number" inputmode="decimal" min="0" step="0.5" id="runWeight" value="${w || ''}"></label>
          <label>Répétitions<input type="number" inputmode="numeric" min="0" id="runReps" value="${r}"></label>
        </div>
        <button class="btn-primary btn-block" id="runNext">Valider la série</button>`;
      $('runNext').addEventListener('click', () => {
        const w2 = parseFloat($('runWeight').value) || 0;
        const r2 = parseInt($('runReps').value, 10) || 0;
        if (!runState.perf.has(it.exId)) runState.perf.set(it.exId, []);
        runState.perf.get(it.exId).push({ weight: w2, reps: r2 });
        advanceRun();
      });
    } else {
      const nextIt = seance.items[steps[i + 1] ? steps[i + 1].itemIdx : step.itemIdx];
      const nextEx = S.byId.get(nextIt.exId);
      $('runBody').innerHTML = `
        <h2>Repos</h2>
        <p class="run-meta">Prochain : ${nextEx ? nextEx.name : ''}</p>
        <div class="timer-display" id="runTimerDisplay">00:00</div>
        <div class="timer-adjust">
          <button class="tbtn" data-radj="-15">−15 s</button>
          <button class="tbtn" data-radj="15">+15 s</button>
        </div>
        <button class="btn-secondary btn-block" id="runSkip">Passer le repos</button>`;
      runTimer = makeTimer($('runTimerDisplay'), advanceRun);
      runTimer.set(step.seconds);
      runTimer.start();
      $('runBody').querySelectorAll('[data-radj]').forEach(b => b.addEventListener('click', () => runTimer.adjust(+b.dataset.radj)));
      $('runSkip').addEventListener('click', () => { runTimer.pause(); advanceRun(); });
    }
  }
  function advanceRun() {
    if (!runState) return;
    runState.i++;
    if (runState.i >= runState.steps.length) {
      const durationSec = Math.round((Date.now() - runState.startedAt) / 1000);
      const exercises = runState.seance.items.map(it => {
        const ex = S.byId.get(it.exId);
        const sets = runState.perf.get(it.exId) || [];
        if (sets.length) { it.weight = sets[sets.length - 1].weight; it.reps = sets[sets.length - 1].reps; }
        return { exId: it.exId, name: ex ? ex.name : it.exId, sets };
      }).filter(x => x.sets.length);
      if (exercises.length) {
        S.history.unshift({ id: uid(), seanceId: runState.seance.id, seanceName: runState.seance.name || 'Séance sans nom', date: new Date().toISOString(), durationSec, exercises });
        saveHistory();
      }
      saveSeances();
      endRun();
      $('runProgress').textContent = ''; $('runElapsed').textContent = '';
      $('runBody').innerHTML = `<h2>Séance terminée</h2><p class="run-meta">Durée : ${fmtDuration(durationSec)}</p><button class="btn-primary btn-block" id="runFinish">Retour à la séance</button>`;
      $('runFinish').addEventListener('click', () => location.hash = '#/seance/' + runState.seance.id);
      return;
    }
    renderRun();
  }
  $('runClose').addEventListener('click', () => { if (runTimer) runTimer.pause(); endRun(); location.hash = '#/seance/' + runState.seance.id; });

  /* Historique des séances effectuées + sauvegarde/restauration des données */
  function renderHistList() {
    $('histEmpty').hidden = !!S.history.length;
    $('histList').innerHTML = S.history.map(h => `
      <div class="hist-card">
        <div class="hist-head"><span class="nm">${h.seanceName}</span><span class="date">${fmtDate(h.date)}</span></div>
        <div class="hist-meta">${fmtDuration(h.durationSec)} · ${h.exercises.length} exercice${h.exercises.length > 1 ? 's' : ''}</div>
        <div class="hist-ex">${h.exercises.map(x => `<div>${x.name} <span class="muted">— ${x.sets.map(s => `${s.weight}kg×${s.reps}`).join(', ')}</span></div>`).join('')}</div>
      </div>`).join('');
  }
  $('dataBtn').addEventListener('click', () => $('dataModal').hidden = false);
  $('dataModal').addEventListener('click', e => { if (e.target.closest('[data-close-data]')) $('dataModal').hidden = true; });
  $('exportBtn').addEventListener('click', () => {
    const payload = { app: 'atlas-muscu', version: 1, exportedAt: new Date().toISOString(), seances: S.seances, history: S.history, favs: [...S.favs] };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'atlas-muscu-sauvegarde-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  $('importInput').addEventListener('change', async e => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!confirm('Remplacer tes séances, ton historique et tes favoris actuels par ceux de ce fichier ?')) return;
      if (Array.isArray(data.seances)) { S.seances = data.seances; saveSeances(); }
      if (Array.isArray(data.history)) { S.history = data.history; saveHistory(); }
      if (Array.isArray(data.favs)) { S.favs = new Set(data.favs); store.set('favs', [...S.favs]); }
      $('dataModal').hidden = true;
      toast('Données importées');
      renderSeancesList(); renderHistList(); renderGrid();
    } catch { toast('Fichier de sauvegarde invalide'); }
  });

  /* Bascule entre les grandes vues de l'appli */
  const VIEWS = { exercices: 'viewExercices', seances: 'viewSeances', seanceDetail: 'viewSeanceDetail', run: 'viewRun', historique: 'viewHistorique' };
  function showView(name) {
    Object.entries(VIEWS).forEach(([k, id]) => $(id).hidden = k !== name);
    $('tabbar').hidden = name === 'run';
    window.scrollTo({ top: 0 });
  }
  function setTab(name) {
    $('tabbar').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.tab === name));
  }
  $('tabbar').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    location.hash = b.dataset.tab === 'exercices' ? '' : '#/' + b.dataset.tab;
  });

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
    exTimer.pause(); exTimer.set(45); $('timerStart').textContent = 'Démarrer';
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
    renderProgress(e);
    $('mSteps').innerHTML = e.steps.map(s => `<li>${s}</li>`).join('');
    const rel = S.all.filter(x => x.id !== e.id && x.tg[0] === e.tg[0]).slice(0, 12);
    $('mRelatedWrap').hidden = !rel.length;
    $('mRelated').innerHTML = rel.map(x => `<button data-id="${x.id}"><img src="${x.gif}" alt="" loading="lazy" onerror="window.gifFail(this)"><span>${x.name}</span></button>`).join('');
    $('modal').hidden = false; document.body.style.overflow = 'hidden';
    $('sheet').scrollTop = 0;
    $('sheet').querySelector('.icon').focus();
  }
  function closeEx() {
    exTimer.pause();
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
    const h = location.hash;
    let m;
    if (m = h.match(/^#\/exercice\/(.+)$/)) { openEx(decodeURIComponent(m[1])); return; }
    if (!$('modal').hidden) closeEx();

    if (!/\/lancer$/.test(h) && runTimer) runTimer.pause();

    if (m = h.match(/^#\/seance\/([^/]+)\/ajouter$/)) {
      S.picking = m[1];
      const s = S.seances.find(x => x.id === m[1]);
      $('pickBarLabel').textContent = 'Ajout à : ' + (s && s.name ? s.name : 'la séance');
      $('pickBar').hidden = false;
      showView('exercices'); setTab('seances');
      return;
    }
    $('pickBar').hidden = true; S.picking = null;

    if (m = h.match(/^#\/seance\/([^/]+)\/lancer$/)) { startRun(m[1]); return; }
    if (m = h.match(/^#\/seance\/([^/]+)$/)) { openSeance(m[1]); setTab('seances'); return; }
    if (h === '#/seances') { renderSeancesList(); showView('seances'); setTab('seances'); return; }
    if (h === '#/historique') { renderHistList(); showView('historique'); setTab('historique'); return; }

    showView('exercices'); setTab('exercices');
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
