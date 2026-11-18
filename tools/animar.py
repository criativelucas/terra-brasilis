"""Animações dos bonecos no Aseprite.

  python3 tools/animar.py gerar [unidades]   # cria assets/aseprite/<unidade>.aseprite a partir de tools/bonecos.py (sobrescreve!)
  python3 tools/animar.py exportar   # lê os .aseprite (editados por você ou não) e gera as folhas do jogo + assets/sprites.json

Cada arquivo tem uma camada e cinco etiquetas: parado, andar, golpe, dano, queda.
O jogo toca cada etiqueta com a duração de cada quadro definida no Aseprite.
Aseprite: ASEPRITE=caminho, senão ~/Applications/Aseprite.app.
"""
import json, os, shutil, subprocess, sys, tempfile
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bonecos as BN

ROOT = BN.ROOT
ASE_DIR = os.path.join(ROOT, 'assets', 'aseprite')
W, H = BN.W, BN.H
TAGS = ['parado', 'andar', 'golpe', 'dano', 'queda']


def exe():
    return os.environ.get('ASEPRITE') or shutil.which('aseprite') or os.path.expanduser('~/Applications/Aseprite.app/Contents/MacOS/aseprite')


def moved(im, dx=0, dy=0):
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    out.alpha_composite(im, (max(0, dx), max(0, dy)), (max(0, -dx), max(0, -dy)))
    return out


def spark(im):
    """Estrelinha de impacto na ponta da arma (pixel opaco mais à direita)."""
    out = im.copy(); px = out.load()
    pts = [(x, y) for y in range(H) for x in range(W) if px[x, y][3]]
    x, y = max(pts)
    for dx, dy, c in [(0, 0, '#ffffff'), (1, 0, '#fff6b0'), (-1, 0, '#fff6b0'), (0, 1, '#fff6b0'), (0, -1, '#fff6b0'), (1, 1, '#ffb03a'), (-1, -1, '#ffb03a'), (1, -1, '#ffb03a'), (-1, 1, '#ffb03a')]:
        if 0 <= x + dx < W and 0 <= y + dy < H:
            v = c.lstrip('#'); px[x + dx, y + dy] = (int(v[:2], 16), int(v[2:4], 16), int(v[4:], 16), 255)
    return out


def fallen(im, squash=False):
    """Queda: agachado (achatado) ou deitado de costas."""
    box = im.getbbox(); fig = im.crop(box)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    if squash:
        f = fig.resize((fig.width, max(1, fig.height * 3 // 4)), Image.NEAREST)
        out.alpha_composite(f, (box[0], H - f.height))
    else:
        f = fig.rotate(90, expand=True)
        if f.width > W: f = f.crop((f.width - W, 0, f.width, f.height))
        out.alpha_composite(f, (0, H - f.height))
    return out


def anim(t):
    """Quadros e durações (ms) por etiqueta, montados a partir das poses de tools/bonecos.py."""
    idle, wa, wb, atk, breath = [BN.to_img(g) for g in BN.UNITS[t]()]
    return {
        'parado': [(idle, 320), (breath, 160), (breath, 320), (idle, 160)],
        'andar':  [(wa, 110), (moved(idle, 0, -1), 90), (wb, 110), (moved(idle, 0, -1), 90)],
        'golpe':  [(moved(idle, -2), 150), (moved(atk, -1), 60), (spark(atk), 130), (atk, 120), (moved(idle, -1), 120)],
        'dano':   [(moved(idle, -2), 90), (moved(idle, -1), 150)],
        'queda':  [(moved(idle, 0, 1), 120), (fallen(idle, True), 140), (fallen(idle), 260), (fallen(idle), 500)] if t not in ('cav', 'art', 'lan', 'can') else
                  [(moved(idle, 0, 1), 120), (fallen(idle, True), 200), (moved(fallen(idle, True), 0, 2), 600)],  # cavalo e canhão não tombam de costas
    }


def gerar(only=None):
    """Recria os .aseprite; com nomes (ex.: gerar can lan), só esses, sem tocar nos outros."""
    os.makedirs(ASE_DIR, exist_ok=True)
    tmp = tempfile.mkdtemp()
    for t in (only or BN.UNITS):
        A = anim(t); files, durs, tags, i = [], [], [], 0
        for name in TAGS:
            a = i
            for im, ms in A[name]:
                p = os.path.join(tmp, f'{t}-{i}.png'); im.save(p); files.append(p); durs.append(ms); i += 1
            tags.append((name, a + 1, i))  # Aseprite conta quadros a partir de 1
        lua = [f'local spr=Sprite({W},{H},ColorMode.RGB)', 'spr.layers[1].name="Boneco"']
        for k, (p, ms) in enumerate(zip(files, durs), 1):
            if k > 1: lua.append('spr:newEmptyFrame()')
            lua.append(f'spr:newCel(spr.layers[1],{k},Image{{fromFile={json.dumps(p)}}},Point(0,0))')
            lua.append(f'spr.frames[{k}].duration={ms / 1000}')
        for name, a, b in tags:
            lua.append(f'do local tg=spr:newTag({a},{b});tg.name="{name}" end')
        lua.append(f'spr:saveAs({json.dumps(os.path.join(ASE_DIR, t + ".aseprite"))})')
        sp = os.path.join(tmp, f'{t}.lua'); open(sp, 'w').write('\n'.join(lua))
        subprocess.run([exe(), '-b', '--script', sp], check=True, capture_output=True)
        print(t, len(files), 'quadros em', ', '.join(f'{n} {b - a + 1}' for n, a, b in tags))


def exportar():
    man_path = os.path.join(ROOT, 'assets', 'sprites.json')
    man = json.load(open(man_path, encoding='utf8'))
    tmp = tempfile.mkdtemp()
    for f in sorted(os.listdir(ASE_DIR)):
        if not f.endswith('.aseprite'): continue
        t = f[:-9]; png, js = os.path.join(tmp, t + '.png'), os.path.join(tmp, t + '.json')
        subprocess.run([exe(), '-b', os.path.join(ASE_DIR, f), '--sheet', png, '--sheet-type', 'horizontal', '--data', js,
                        '--format', 'json-array', '--list-tags'], check=True, capture_output=True)
        d = json.load(open(js)); n = len(d['frames']); im = Image.open(png).convert('RGBA')
        fw, fh = d['frames'][0]['sourceSize']['w'], d['frames'][0]['sourceSize']['h']
        sheet = im.resize((im.width * 2, im.height * 2), Image.NEAREST)  # 26x24 vira 52x48, o tamanho do sprite no jogo
        sheet.save(os.path.join(ROOT, 'assets', 'units', t + '.png'))
        man['units'][t] = {'src': f'assets/units/{t}.png', 'frames': n, 'dur': [fr['duration'] for fr in d['frames']],
                           'tags': {tg['name']: [tg['from'], tg['to']] for tg in d['meta']['frameTags']}}
        print(t, n, 'quadros', fw, 'x', fh, '·', ', '.join(man['units'][t]['tags']))
    json.dump(man, open(man_path, 'w', encoding='utf8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    cmd = (sys.argv[1:] or [''])[0]
    gerar(sys.argv[2:] or None) if cmd == 'gerar' else exportar() if cmd == 'exportar' else sys.exit(__doc__)
