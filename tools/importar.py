"""Importa arte externa (SpriteBrew, Piskel, Aseprite, gerador de imagens) para o jogo.

  python3 tools/importar.py unidade inf  folha.png [quadros]   # inf cav ati art ld; folha com quadros lado a lado, virada à direita
  python3 tools/importar.py unidade inf  boneco.aseprite       # exporta pelo Aseprite (ASEPRITE=caminho do binário, se não estiver no PATH)
  python3 tools/importar.py retratos 1   grade.png             # grade 3x3 na ordem de docs/arte.md (1: AC..PI, 2: CE..GO, 3: DF..RS)
  python3 tools/importar.py retrato  SP  rosto.png             # um retrato só

Tira o fundo liso, reduz a paleta, encaixa cada quadro em 52x48 (o tamanho do sprite no jogo) e atualiza assets/sprites.json.
"""
import json, os, shutil, subprocess, sys, tempfile
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, 'assets', 'sprites.json')
UF = ['AC','AM','RR','RO','PA','AP','TO','MA','PI','CE','RN','PB','PE','AL','SE','BA','MT','GO','DF','MS','MG','ES','RJ','SP','PR','SC','RS']
FW, FH = 52, 48  # quadro do sprite no jogo


def from_aseprite(path):
    exe = os.environ.get('ASEPRITE') or shutil.which('aseprite') or os.path.expanduser('~/Applications/Aseprite.app/Contents/MacOS/aseprite')
    out = os.path.join(tempfile.mkdtemp(), 'sheet.png')
    subprocess.run([exe, '-b', path, '--sheet', out, '--sheet-type', 'horizontal'], check=True, capture_output=True)
    return out


def remove_bg(im, tol=48):
    """Fundo liso: apaga, a partir das bordas, os pixels parecidos com a cor do canto."""
    im = im.convert('RGBA')
    px = im.load(); w, h = im.size
    if any(px[x, y][3] < 10 for x, y in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))):
        return im  # já tem transparência
    bg = px[0, 0]
    near = lambda c: sum(abs(c[i] - bg[i]) for i in range(3)) <= tol
    seen = set(); stack = [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    while stack:
        x, y = stack.pop()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h):
            continue
        seen.add((x, y))
        if near(px[x, y]):
            px[x, y] = (0, 0, 0, 0)
            stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    return im


def split_frames(im, n, even=False):
    """Separa os quadros pelas colunas vazias; se não bater com n (ou se a folha veio do Aseprite), divide em partes iguais."""
    a = im.getchannel('A'); w, h = im.size
    if even:
        return [im.crop((w * i // n, 0, w * (i + 1) // n, h)) for i in range(n)]
    cols = [a.crop((x, 0, x + 1, h)).getbbox() is not None for x in range(w)]
    segs, start = [], None
    for x, on in enumerate(cols + [False]):
        if on and start is None: start = x
        if not on and start is not None:
            segs.append([start, x]); start = None
    while len(segs) > n:  # junta a menor folga (pedaços soltos de um mesmo boneco)
        k = min(range(len(segs) - 1), key=lambda i: segs[i + 1][0] - segs[i][1])
        segs[k:k + 2] = [[segs[k][0], segs[k + 1][1]]]
    if len(segs) != n:
        segs = [[w * i // n, w * (i + 1) // n] for i in range(n)]
    return [im.crop((x0, 0, x1, h)) for x0, x1 in segs]


def fit(frames, fw=FW, fh=FH, colors=32):
    """Mesmo recorte vertical e mesma escala para todos os quadros; pés alinhados embaixo, centro na horizontal."""
    boxes = [f.getbbox() or (0, 0, 1, 1) for f in frames]
    top, bot = min(b[1] for b in boxes), max(b[3] for b in boxes)
    wmax = max(b[2] - b[0] for b in boxes)
    s = min((fh - 3) / (bot - top), (fw - 2) / wmax)
    sheet = Image.new('RGBA', (fw * len(frames), fh), (0, 0, 0, 0))
    for i, (f, b) in enumerate(zip(frames, boxes)):
        c = f.crop((b[0], top, b[2], bot))
        c = c.resize((max(1, round(c.width * s)), max(1, round(c.height * s))), Image.BOX if s < 1 else Image.NEAREST)
        sheet.alpha_composite(c, (i * fw + (fw - c.width) // 2, fh - 2 - c.height))
    return crisp(sheet, colors)


def crisp(im, colors):
    """Paleta curta e alfa sem meio-termo: cara de 16-bit."""
    alpha = im.getchannel('A').point(lambda v: 255 if v > 110 else 0)
    rgb = im.convert('RGB').quantize(colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    out = rgb.convert('RGBA'); out.putalpha(alpha)
    return out


def manifest():
    try:
        return json.load(open(MANIFEST, encoding='utf8'))
    except FileNotFoundError:
        return {'portraits': {}, 'units': {}}


def save_manifest(m):
    json.dump(m, open(MANIFEST, 'w', encoding='utf8'), ensure_ascii=False, indent=1)


def portrait(im, uf, m, size=96):
    im = im.convert('RGBA'); w, h = im.size; s = min(w, h)
    im = im.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2)).resize((size, size), Image.BOX)
    os.makedirs(os.path.join(ROOT, 'assets', 'portraits'), exist_ok=True)
    crisp(im, 48).save(os.path.join(ROOT, 'assets', 'portraits', uf + '.png'))
    m['portraits'][uf] = f'assets/portraits/{uf}.png'


def main(a):
    m = manifest()
    if a[0] == 'unidade':
        t, src = a[1], a[2]
        n = int(a[3]) if len(a) > 3 else 4
        ase = src.endswith(('.aseprite', '.ase'))
        if ase:
            src = from_aseprite(src)
        sheet = fit(split_frames(remove_bg(Image.open(src)), n, even=ase))
        os.makedirs(os.path.join(ROOT, 'assets', 'units'), exist_ok=True)
        sheet.save(os.path.join(ROOT, 'assets', 'units', t + '.png'))
        m['units'][t] = {'src': f'assets/units/{t}.png', 'frames': n}
        print(f'{t}: {n} quadros de {FW}x{FH}')
    elif a[0] == 'retratos':
        g, im = int(a[1]) - 1, Image.open(a[2])
        w, h = im.size; cw, ch = w / 3, h / 3; pad = 0.03
        for k, uf in enumerate(UF[g * 9:g * 9 + 9]):
            x, y = k % 3 * cw, k // 3 * ch
            portrait(im.crop((round(x + cw * pad), round(y + ch * pad), round(x + cw * (1 - pad)), round(y + ch * (1 - pad)))), uf, m)
        print('retratos:', ', '.join(UF[g * 9:g * 9 + 9]))
    elif a[0] == 'retrato':
        portrait(Image.open(a[2]), a[1], m)
        print('retrato:', a[1])
    else:
        sys.exit(__doc__)
    save_manifest(m)


def demo():
    """Autoteste: folha falsa de 4 bonecos em fundo branco vira 4 quadros de 52x48."""
    im = Image.new('RGB', (400, 120), 'white')
    for i in range(4):
        im.paste((40, 70, 220), (i * 100 + 30, 20, i * 100 + 60, 110))
    fr = split_frames(remove_bg(im), 4)
    assert len(fr) == 4 and all(f.getbbox() for f in fr)
    sh = fit(fr)
    assert sh.size == (FW * 4, FH) and sh.getpixel((0, 0))[3] == 0 and sh.getpixel((FW // 2, FH - 4))[3] == 255
    print('ok')


if __name__ == '__main__':
    demo() if sys.argv[1:] == ['teste'] else main(sys.argv[1:] or ['?'])
