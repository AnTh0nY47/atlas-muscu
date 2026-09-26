# Génère des planches pour vérifier que chaque animation correspond à son exercice
# Pour chaque exercice : deux images de l'animation (début et milieu) et son nom
import json, io, os, sys, textwrap, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont, ImageSequence

src = open('data/exercises.js', encoding='utf-8').read()
data = json.loads(src[src.index('['):src.rindex(']') + 1])
data.sort(key=lambda e: e['exerciseId'])
os.makedirs('revue', exist_ok=True)

FR = 140          # taille d'une image
COLS, ROWS = 4, 5  # exercices par planche
CELL_W, CELL_H = FR * 2 + 10, FR + 58
font = ImageFont.load_default(size=13) if hasattr(ImageFont, 'load_default') else None

def frames(url):
    for _ in range(3):
        try:
            raw = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read()
            im = Image.open(io.BytesIO(raw))
            fs = [f.convert('RGB') for f in ImageSequence.Iterator(im)]
            pick = [fs[0], fs[len(fs) // 2]]
            return [f.resize((FR, FR)) for f in pick]
        except Exception:
            pass
    return None

with ThreadPoolExecutor(12) as ex:
    shots = list(ex.map(lambda e: frames(e['gifUrl']), data))

per = COLS * ROWS
index = []
for s in range(0, len(data), per):
    sheet = Image.new('RGB', (COLS * CELL_W, ROWS * CELL_H), 'white')
    d = ImageDraw.Draw(sheet)
    for k, e in enumerate(data[s:s + per]):
        x, y = (k % COLS) * CELL_W, (k // COLS) * CELL_H
        fr = shots[s + k]
        if fr:
            sheet.paste(fr[0], (x + 2, y + 2)); sheet.paste(fr[1], (x + FR + 6, y + 2))
        else:
            d.rectangle([x + 2, y + 2, x + CELL_W - 8, y + FR], outline='red')
        label = f"{s + k + 1}. {e['name']}"
        d.multiline_text((x + 4, y + FR + 4), '\n'.join(textwrap.wrap(label, 38)[:3]), fill='black', font=font)
        index.append({'n': s + k + 1, 'id': e['exerciseId'], 'name': e['name'], 'fr': e.get('nameFr', ''), 'ok': bool(fr)})
    sheet.save(f"revue/planche-{s // per + 1:03d}.png", optimize=True)
json.dump(index, open('revue/index.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(index), 'exercices,', (len(data) + per - 1) // per, 'planches')
