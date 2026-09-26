// Traduit en français les noms et les consignes des exercices de data/exercises.js
// Les traductions sont gardées dans data/fr-cache.json pour ne pas tout refaire à chaque fois
// Utilisation : node scripts/translate.mjs (après node scripts/sync.mjs)
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = join(root, 'data', 'exercises.js');
const cacheFile = join(root, 'data', 'fr-cache.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Noms courants traduits à la main, comme on les dit en salle
const NAMES = {
  'barbell bench press': 'Développé couché barre',
  'dumbbell bench press': 'Développé couché haltères',
  'barbell incline bench press': 'Développé incliné barre',
  'dumbbell incline bench press': 'Développé incliné haltères',
  'barbell decline bench press': 'Développé décliné barre',
  'smith bench press': 'Développé couché Smith machine',
  'dumbbell fly': 'Écarté couché haltères',
  'dumbbell incline fly': 'Écarté incliné haltères',
  'cable standing fly': 'Écarté debout à la poulie',
  'cable cross-over variation': 'Poulie vis-à-vis',
  'lever pec deck fly': 'Pec deck',
  'push-up': 'Pompes',
  'chest dip': 'Dips pectoraux',
  'triceps dip': 'Dips triceps',
  'bench dip (knees bent)': 'Dips sur banc genoux pliés',
  'pull-up': 'Tractions',
  'chin-up': 'Tractions supination',
  'cable bar lateral pulldown': 'Tirage vertical à la poulie',
  'cable lateral pulldown with v-bar': 'Tirage vertical prise serrée',
  'cable seated row': 'Tirage horizontal à la poulie',
  'barbell bent over row': 'Rowing barre buste penché',
  'dumbbell one arm bent-over row': 'Rowing unilatéral haltère',
  'lever t-bar row': 'Rowing T-bar',
  'barbell deadlift': 'Soulevé de terre barre',
  'barbell romanian deadlift': 'Soulevé de terre roumain barre',
  'dumbbell romanian deadlift': 'Soulevé de terre roumain haltères',
  'barbell shrug': 'Shrug barre',
  'dumbbell shrug': 'Shrug haltères',
  'barbell full squat': 'Squat complet barre',
  'barbell front squat': 'Squat avant barre',
  'dumbbell goblet squat': 'Goblet squat haltère',
  'smith squat': 'Squat Smith machine',
  'sled 45° leg press': 'Presse à cuisses 45°',
  'lever leg extension': 'Leg extension',
  'lever lying leg curl': 'Leg curl allongé',
  'lever seated leg curl': 'Leg curl assis',
  'dumbbell lunge': 'Fentes haltères',
  'barbell lunge': 'Fentes barre',
  'dumbbell bulgarian split squat': 'Squat bulgare haltères',
  'barbell hip thrust': 'Hip thrust barre',
  'barbell glute bridge': 'Pont fessier barre',
  'lever standing calf raise': 'Mollets debout machine',
  'lever seated calf raise': 'Mollets assis machine',
  'barbell standing military press': 'Développé militaire barre',
  'dumbbell seated shoulder press': 'Développé épaules assis haltères',
  'dumbbell standing overhead press': 'Développé épaules debout haltères',
  'dumbbell lateral raise': 'Élévations latérales haltères',
  'cable lateral raise': 'Élévations latérales à la poulie',
  'dumbbell front raise': 'Élévations frontales haltères',
  'dumbbell rear fly': 'Oiseau haltères',
  'cable rear delt row (with rope)': 'Face pull à la corde',
  'barbell upright row': 'Rowing menton barre',
  'barbell curl': 'Curl barre',
  'dumbbell biceps curl': 'Curl biceps haltères',
  'dumbbell hammer curl': 'Curl marteau haltères',
  'dumbbell concentration curl': 'Curl concentré haltère',
  'ez barbell curl': 'Curl barre EZ',
  'barbell preacher curl': 'Curl pupitre barre',
  'cable curl': 'Curl à la poulie',
  'cable pushdown': 'Extension triceps à la poulie',
  'cable pushdown (with rope attachment)': 'Extension triceps à la corde',
  'barbell lying triceps extension skull crusher': 'Barre au front',
  'dumbbell seated triceps extension': 'Extension triceps nuque assis haltère',
  'barbell close-grip bench press': 'Développé couché prise serrée',
  'crunch floor': 'Crunch au sol',
  'hanging leg raise': 'Relevé de jambes suspendu',
  'front plank with twist': 'Gainage avec rotation',
  'russian twist': 'Rotations russes',
  'mountain climber': 'Mountain climber',
  'burpee': 'Burpee',
  'jump rope': 'Corde à sauter',
  'run': 'Course',
};

// Corrections des erreurs classiques de la traduction automatique sur le vocabulaire de salle
const FIXES = [
  [/\bpresse (?:de banc|sur banc|au banc|couchée)\b/gi, 'développé couché'],
  [/\bboucles?\b/gi, 'curl'],
  [/\brangées?\b/gi, 'rowing'],
  [/\bà levier\b/gi, 'à la machine'],
  [/\blevier\b/gi, 'machine'],
  [/\bcâble\b/gi, 'poulie'],
  [/\bcâbles\b/gi, 'poulies'],
  [/\bpulldown\b/gi, 'tirage vertical'],
  [/\bhaussements? d'épaules\b/gi, 'shrug'],
  [/\bmouches?\b/gi, 'écarté'],
  [/\bvol\b/gi, 'écarté'],
  [/\bsquat de gobelet\b/gi, 'goblet squat'],
  [/\bpoids corporel\b/gi, 'poids du corps'],
];
const fixName = s => FIXES.reduce((t, [re, v]) => t.replace(re, v), s);
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const cleanStep = s => s.replace(/^step\s*:?\s*\d+\s*[:.)-]?\s*/i, '').trim();

async function gtx(text) {
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t';
  let last = '';
  for (let i = 1; i <= 4; i++) {
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: new URLSearchParams({ q: text }) });
      if (r.ok) { const j = await r.json(); return j[0].map(x => x[0]).join(''); }
      last = 'HTTP ' + r.status;
    } catch (e) { last = e.message; }
    await sleep(3000 * i);
  }
  throw new Error(last);
}

// Traduit une liste de phrases par petits paquets, une phrase par ligne
async function translateAll(list, cache, save) {
  const todo = [...new Set(list.filter(s => s && !(s in cache)))];
  console.log(`${todo.length} textes à traduire`);
  let done = 0, errors = 0;
  for (let i = 0; i < todo.length;) {
    const batch = [];
    let len = 0;
    while (i < todo.length && batch.length < 25 && len + todo[i].length < 1800) { batch.push(todo[i]); len += todo[i].length + 1; i++; }
    if (!batch.length) batch.push(todo[i++]);
    try {
      const out = (await gtx(batch.join('\n'))).split('\n');
      if (out.length === batch.length) batch.forEach((s, k) => cache[s] = out[k].trim());
      else for (const s of batch) { cache[s] = (await gtx(s)).trim(); await sleep(200); }
    } catch (e) {
      errors++;
      console.log(`Paquet ignoré (${e.message})`);
      if (errors >= 8) { console.log('Trop d\'erreurs, arrêt. On reprendra au prochain passage.'); break; }
      await sleep(5000);
    }
    done += batch.length;
    if (done % 500 < batch.length) { console.log(`${done} / ${todo.length}`); await save(); }
    await sleep(350);
  }
}
const src = await readFile(dataFile, 'utf8');
const list = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1));
let cache = {};
try { cache = JSON.parse(await readFile(cacheFile, 'utf8')); } catch { }

const names = list.map(e => e.name.toLowerCase()).filter(n => !NAMES[n]);
const steps = list.flatMap(e => (e.instructions || []).map(cleanStep));
const muscles = list.flatMap(e => [...(e.targetMuscles || []), ...(e.secondaryMuscles || [])]);

const save = () => writeFile(cacheFile, JSON.stringify(cache));
try {
  await translateAll([...names, ...steps, ...muscles], cache, save);
} finally {
  await save();
}

for (const e of list) {
  const n = e.name.toLowerCase();
  e.nameFr = NAMES[n] || cap(fixName(cache[n] || '')) || undefined;
  e.instructionsFr = (e.instructions || []).map(s => cache[cleanStep(s)] || '').filter(Boolean);
  if (e.instructionsFr.length !== (e.instructions || []).length) delete e.instructionsFr;
  const m = [...(e.targetMuscles || []), ...(e.secondaryMuscles || [])];
  e.musclesFr = Object.fromEntries(m.filter(x => cache[x]).map(x => [x, cap(cache[x])]));
}
await writeFile(dataFile, 'window.EXERCISES = ' + JSON.stringify(list) + ';\n');
console.log(`${list.filter(e => e.nameFr).length} exercices traduits en français`);
