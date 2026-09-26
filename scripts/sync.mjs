// Télécharge toute la base ExerciseDB (version libre) dans data/exercises.js
// Utilisation : node scripts/sync.mjs   (Node 18 ou plus récent)
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://oss.exercisedb.dev/api/v1/exercises';
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'exercises.js');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url, tries = 5) {
  for (let i = 1; i <= tries; i++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    if (i === tries) throw new Error(`HTTP ${r.status} sur ${url}`);
    await sleep(1500 * i);
  }
}

const all = [];
let after = null;
while (true) {
  const u = new URL(API);
  u.searchParams.set('limit', '100');
  if (after) u.searchParams.set('after', after);
  const j = await get(u);
  all.push(...j.data);
  process.stdout.write(`\r${all.length} / ${j.meta.total} exercices`);
  if (!j.meta.hasNextPage || !j.meta.nextCursor) break;
  after = j.meta.nextCursor;
  await sleep(250);
}
const seen = new Set();
const clean = all.filter(e => !seen.has(e.exerciseId) && seen.add(e.exerciseId));
await mkdir(dirname(out), { recursive: true });
await writeFile(out, 'window.EXERCISES = ' + JSON.stringify(clean) + ';\n');
console.log(`\n${clean.length} exercices enregistrés dans data/exercises.js`);
