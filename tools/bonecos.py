"""Bonecos desenhados pixel a pixel (24x24 por quadro, virados para a direita).

  python3 tools/bonecos.py            # gera assets/units/*.png, assets/piskel/*.piskel e atualiza assets/sprites.json
  python3 tools/bonecos.py previa     # só a prévia ampliada em /tmp/bonecos.png

Cada boneco = tronco (com cabeça e arma) + pernas por quadro. Quadros: 0 parado, 1 passo A, 2 passo B, 3 golpe.
O azul do uniforme (U V u) é trocado pela cor da facção no jogo.
"""
import base64, io, json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAL = {
    'O': '#1a1220',                                   # contorno
    'V': '#6f8fff', 'U': '#3555c8', 'u': '#22348a',   # uniforme (vira a cor da facção)
    'S': '#f2c594', 's': '#c98a5e', 'H': '#4a2c1c', 'h': '#7a4a2c',  # pele, cabelo
    'K': '#2b2633', 'k': '#4d4659',                   # preto (barretina, botas)
    'W': '#f4f0e6', 'w': '#b9b3a8',                   # branco
    'R': '#d4382c', 'r': '#8a1f1a',                   # vermelho
    'G': '#f6c64a', 'g': '#b07a20',                   # dourado
    'M': '#eef2f4', 'm': '#a3adb6', 'n': '#5d6670',   # metal
    'C': '#c98d50', 'B': '#9a6234', 'b': '#5e3a1e',   # madeira, couro
    'Y': '#c27c40', 'X': '#8f5428', 'Z': '#5a3418',   # cavalo
    'F': '#fff2a0', 'f': '#ffb03a',                   # clarão
}


W = 26  # largura do quadro em pixels de arte (no jogo vira 52x48)


def grid(rows, w=W):
    return [r.ljust(w, '.')[:w] for r in rows]


def over(base, top):
    """Sobrepõe 'top' em 'base' (ponto = mantém)."""
    out = [list(r) for r in base]
    for y, r in enumerate(top):
        for x, c in enumerate(r):
            if c != '.' and y < len(out) and x < len(out[y]):
                out[y][x] = c
    return [''.join(r) for r in out]


def shift(rows, dx=0, dy=0, w=W, h=24):
    out = [['.'] * w for _ in range(h)]
    for y, r in enumerate(rows):
        for x, c in enumerate(r):
            if c != '.' and 0 <= y + dy < h and 0 <= x + dx < w:
                out[y + dy][x + dx] = c
    return [''.join(r) for r in out]


def frame(upper, legs, dy_upper=0):
    """Tronco (linhas 0-17) por cima das pernas (linhas 18-23)."""
    body = shift(grid(upper) + ['.' * W] * (24 - len(upper)), 0, dy_upper)
    return over(grid(['.' * W] * 18 + legs), body)


# ---------------------------------------------------------------- infantaria
INF_UP = [
    "..........O",
    ".........ORO",
    ".........ORr",
    "........OOOOOO",
    ".......OkKKKKKO",
    ".......OkKKGKKO",
    ".......OKKKKKKO",
    ".......ORRRRRRO",
    "......OHHSSSSSSO",
    "......OHSSSSSOSO",
    "......OHSSSSSOSO",
    "......OhsSSSSSsO",
    ".......OssSSSSO",
    "......OVUWUUUWVO",
    ".....OVUUUWUWUUUO",
    ".....OuUUUUWUUUUO",
    ".....OuUUUWUWUUuO",
    "......OuuWWWWWuO",
]
INF_GUN = [  # mosquete com baioneta, de pé à frente
    "..................O",
    ".................OMO",
    ".................OMO",
    ".................OmO",
    ".................OnO",
    ".................OBO",
    ".................OBO",
    ".................OBO",
    ".................OBO",
    ".................OBO",
    ".................OBO",
    ".................OCO",
    ".................OBO",
    "................OOBO",
    "...............OSSBO",
    "...............OSSSO",
    "................OOBO",
    ".................ObO",
    ".................ObO",
    ".................OOO",
]
INF_ATK = [  # estocada: braço estendido, mosquete na horizontal
    "..........O",
    ".........ORO",
    ".........ORr",
    "........OOOOOO",
    ".......OkKKKKKO",
    ".......OkKKGKKO",
    ".......OKKKKKKO",
    ".......ORRRRRRO",
    "......OHHSSSSSSO",
    "......OHSSSSSOSO",
    "......OHSSSSSOSO",
    "......OhsSSSSSsO",
    ".......OssSSSSOOOOOOOOOOOO",
    "......OVUWUUUWUUSSOBBCBBnMO",
    ".....OVUUUWUWUUUSSObbBBnmO",
    ".....OuUUUUWUUUUOOOOOOOOOO",
    ".....OuUUUWUWUUuO",
    "......OuuWWWWWuO",
]
LEGS = {  # calça branca e bota preta
    'stand': ["......OWWWOWWWO", "......OWWwOWWwO", "......OWWwOWWwO", "......OKKKOKKKO", ".....OKKKKOKKKKO", ".....OOOOOOOOOOO"],
    'a':     [".....OWWWO.OWWWO", ".....OWWwO.OWwO", "....OWWwO..OWwO", "....OKKKO..OKKKO", "...OKKKKO..OKKKKO", "...OOOOO...OOOOOO"],
    'b':     ["......OWWWOWWWO", "......OWWwOWWwO", ".......OWwOWwO", ".......OKKKKKO", "......OKKKKKKO", "......OOOOOOOO"],
}


def inf_frames():
    up = over(grid(INF_UP), grid(INF_GUN))
    f0 = frame(up, LEGS['stand'])
    f1 = frame(up, LEGS['a'], 0)
    f2 = frame(up, LEGS['b'], 1)
    f3 = frame(grid(INF_ATK), LEGS['a'])
    return [f0, f1, f2, f3]


# ---------------------------------------------------------------- atiradores
ATI_UP = [
    "", "", "",
    ".........OOOOO",
    "........OBBCBBO",
    "........ObBBBbO",
    "......OOObbbbbOOO",
    ".....OBBBBBBBBBBBO",
    "......OHSSSSSSSO",
    "......OHSSSSSOSO",
    "......OHSSSSSOSO",
    "......OhsSSSSSsO",
    ".......OssSsSSO",
    "......OVUUUUUUVO",
    ".....OVUUbUUUUUUO",
    ".....OuUUUbUUUUUO",
    ".....OuUUUUbUUGuO",
    "......ObbbbbbbbO",
]
ATI_GUN = [
    "", "",
    ".................OOO",
    ".................OnO",
    ".................OnO",
    ".................OnO",
    ".................OmO",
    ".................OBO",
    ".................OBO",
    ".................OBO",
    ".................OBO",
    ".................OBO",
    ".................OBO",
    "................OOBO",
    "...............OSSBO",
    "...............OSSSO",
    "................OOCO",
    ".................OCO",
    ".................OCO",
    ".................OOO",
]
ATI_ATK = [
    "", "", "",
    ".........OOOOO",
    "........OBBCBBO",
    "........ObBBBbO",
    "......OOObbbbbOOO",
    ".....OBBBBBBBBBBBO",
    "......OHSSSSSSSO.......FF",
    "......OHSSSSSOSOOOOOOOOFfF",
    "......OHSSSSSOSSSBBBBnnnfF",
    "......OhsSSSSSsSSCOOOOOOFF",
    ".......OssSsSSOOOO",
    "......OVUUUUUUVO",
    ".....OVUUbUUUUUUO",
    ".....OuUUUbUUUUUO",
    ".....OuUUUUbUUGuO",
    "......ObbbbbbbbO",
]
LEGS_B = {k: [r.replace('W', 'B').replace('w', 'b') for r in v] for k, v in LEGS.items()}


def ati_frames():
    up = over(grid(ATI_UP), grid(ATI_GUN))
    return [frame(up, LEGS_B['stand']), frame(up, LEGS_B['a']), frame(up, LEGS_B['b'], 1), frame(grid(ATI_ATK), LEGS_B['stand'])]


# ---------------------------------------------------------------- cavalaria
HORSE = [
    "", "", "", "", "",
    "....................OO",
    "...................OXZO",
    "..................OXXXZO",
    ".................OYXXXXZO",
    "................OYYXXXOXO",
    "...............OYYXXXXXXXO",
    "...............OYXXXXXXXOO",
    "...OOOOOOOOOOOOYYXXXOOO",
    "..OZYYYYYYYYYYYYXXXO",
    ".OZXYYYYYYYYYYYYXXO",
    ".OZXXXXXXXRRRXXXXXO",
    ".OZOXXXXXXRRRXXXXZO",
    "..OZZXXXXXXXXXXXZO",
    "...OZZZZZZZZZZZZO",
]
HLEGS = {
    'stand': ["...OXO.OXO...OXO.OXO", "...OXO.OXO...OXO.OXO", "...OXO.OXO...OXO.OXO", "...OKO.OKO...OKO.OKO", "...OOO.OOO...OOO.OOO"],
    'a':     ["..OXO..OXO...OXO..OXO", ".OXO..OXO.....OXO..OXO", ".OXO..OXO.....OXO..OXO", "OKO..OKO.......OKO..OKO", "OOO..OOO.......OOO..OOO"],
    'b':     ["....OXOOXO..OXOOXO", "....OXOOXO..OXOOXO", ".....OKKO....OKKO", ".....OOOO....OOOO", ""],
}
RIDER = [
    "........OOOOO",
    ".......OBBCBBO",
    ".....OOObbbbbOOO",
    "....OBBBBBBBBBBBO",
    ".....OHSSSSSSO",
    ".....OHSSSSOSO",
    ".....OHSSSSOSO",
    ".....OhsSSSSsO",
    "......OsRRRRO",
    ".....OVUUUUUUO",
    "....OVUUUUUUUSO",
    "....OuUUUUUUUSO",
    "....OuUUUUUUuO",
    ".....OuWWWWuO",
    "......OWWWWO",
    "......OWwKO",
    "......OKKKO",
    "......OOOO",
]
LANCE = [
    "...............O",
    "..............OMO",
    "..............OMO",
    "..............OBRRRO",
    "..............OBRRO",
    "..............OBOO",
] + ["..............OBO"] * 11 + ["..............OOO"]
RIDER_ATK = RIDER[:9] + [
    ".....OVUUUUUUOOOOOOOOOOOOO",
    "....OVUUUUUUUSBBBBBBBBBnMO",
    "....OuUUUUUUUSOOOOOOOOOOOO",
] + RIDER[12:]


def cav_frames():
    def fr(legs, dy=0, atk=False):
        horse = over(grid(['.' * W] * 19 + legs), shift(grid(HORSE), 0, dy))
        rider = shift(grid(RIDER_ATK if atk else over(grid(RIDER), grid(LANCE))), 0, dy)
        return over(horse, rider)
    return [fr(HLEGS['stand']), fr(HLEGS['a']), fr(HLEGS['b'], 1), fr(HLEGS['a'], 0, True)]


# ---------------------------------------------------------------- artilharia
CANNON = [
    "", "", "", "", "", "", "", "",
    "..............OOOOOOOOOOO",
    "...........OOOgGGGGGGGGGOO",
    "..........OgGGGGGGGGGGGGnO",
    "..........OgGGGGGGGGGGGGnO",
    "...........OOgggggggggggOO",
    ".........OOBBBBBBBOOOOOO",
    "........OCBBBBBBBBBO",
    "........ObBBOOOOBBbO",
    "........ObBOCBBCObbO",
    ".......OOOOCBOOBCOOO",
    "......OBBOCBOGGOBCO",
    ".....OBBO.OCBOOBCO",
    ".....OBO..OCBBBBCO",
    ".....OO....OCCCCO",
    "............OOOO",
]
GUNNER = [
    "", "", "", "", "",
    "..OOOOOO",
    ".OKKKKKKO",
    ".OKKGKKKO",
    "OHSSSSSO",
    "OHSSSOSO",
    "OhsSSSsO",
    ".OsSSSO",
    "OVUWUUVO",
    "OUUUWUUSO",
    "OuUUUWUSO",
    "OuUUUUuO",
    ".OWWWWO",
]
GLEGS = {
    'stand': [".OWWWWO", ".OWwOWwO", ".OWwOWwO", ".OKKOKKO", "OKKKOKKKO", "OOOOOOOOO"][:6],
    'a':     [".OWWWWO", "OWwO.OWwO", "OWwO.OWwO", "OKKO.OKKO", "OKKKOOKKKO", "OOOOOOOOOO"],
    'b':     [".OWWWWO", ".OWwWwO", ".OWwWwO", ".OKKKKO", ".OKKKKKO", ".OOOOOOO"],
}


def art_frames():
    def fr(legs, dx=0, fire=False):
        g = over(grid(['.' * W] * 17 + [''] + legs), shift(grid(GUNNER), dx, 0))
        c = shift(grid([r if i < 17 else '.' * 10 + r[10:] for i, r in enumerate(grid(CANNON))]), -1 if fire else 0, 0)
        out = over(g, c)
        if fire:
            out = over(out, grid([''] * 8 + ["......................FFF.", ".....................FFfFF", ".....................FfFfF", "......................FFF."]))
        return out
    return [fr(GLEGS['stand']), fr(GLEGS['a'], 1), fr(GLEGS['b'], 1), fr(GLEGS['stand'], 0, True)]


# ---------------------------------------------------------------- comandante (no jogo a cabeça vira o rosto do líder)
LD_UP = [
    "......OOOOOOOOO",
    ".....OKKKKKKKKKO",
    "....OKKKGKKKKKKKO",
    ".....OOGGGGGGGOO",
    "......OHHSSSSSSO",
    "......OHSSSSSOSO",
    "......OHSSSSSOSO",
    "......OhsSSSSSsO",
    ".......OssSSSSO",
    "....ORROGVUUUUGO",
    "...ORRROGUUWUUUGO",
    "...ORrROuUUWUUUUO",
    "...ORrROuUGWGUUSSO",
    "...ORrRROuUUWUUSSO",
    "...ORrRRORRRRRRRO",
    "...ORrRROuUUUUUuO",
    "...ORrRROuUUUUUuO",
    "....ORRROWWWWWWO",
]
SWORD = [
    "", "",
    ".................O",
    "................OMO",
    "................OMO",
    "................OMO",
    "................OMO",
    "................OMO",
    "................OmO",
    "................OMO",
    "...............OGGGO",
    "................OgO",
]
LD_ATK_ARM = [
    "...................OO",
    "..................OMO",
    ".................OMO",
    "................OMO",
    "...............OMO",
    "..............OMO",
    ".............OGO",
    "............OGGO",
    "...........OSSO",
    "..........OSSO",
    "..........OUO",
]


def ld_frames():
    up = over(grid(LD_UP), grid(SWORD))
    atk = over(grid(LD_UP[:12] + ["...ORrROuUGWGUUO", "...ORrRROuUUWUUO"] + LD_UP[14:]), shift(grid(LD_ATK_ARM), 6, 0))
    return [frame(up, LEGS['stand']), frame(up, LEGS['a']), frame(up, LEGS['b'], 1), frame(atk, LEGS['a'])]


UNITS = {'inf': inf_frames, 'cav': cav_frames, 'ati': ati_frames, 'art': art_frames, 'ld': ld_frames}


def to_img(rows, scale=1):
    w, h = W, 24
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    px = im.load()
    for y, r in enumerate(rows[:h]):
        for x, c in enumerate(r[:w]):
            if c in PAL:
                v = PAL[c].lstrip('#')
                px[x, y] = (int(v[0:2], 16), int(v[2:4], 16), int(v[4:6], 16), 255)
    return im.resize((w * scale, h * scale), Image.NEAREST) if scale > 1 else im


def preview(path='/tmp/bonecos.png', s=8):
    rows = [[to_img(f, s) for f in fn()] for fn in UNITS.values()]
    Wd = W * s * 4 + 30; H = (24 * s + 10) * len(rows)
    sh = Image.new('RGBA', (Wd, H), (120, 160, 90, 255))
    for j, fr in enumerate(rows):
        for i, im in enumerate(fr):
            sh.alpha_composite(im, (6 + i * (W * s + 6), 5 + j * (24 * s + 10)))
    sh.save(path); print(path)


def build():
    """Folha de 4 quadros 52x48 para o jogo e um .piskel (26x24) para abrir e editar no piskelapp.com."""
    man_path = os.path.join(ROOT, 'assets', 'sprites.json')
    man = json.load(open(man_path, encoding='utf8'))
    for d in ('units', 'piskel'):
        os.makedirs(os.path.join(ROOT, 'assets', d), exist_ok=True)
    for t, fn in UNITS.items():
        frames = [to_img(f) for f in fn()]
        sheet = Image.new('RGBA', (W * 2 * len(frames), 48), (0, 0, 0, 0))
        strip = Image.new('RGBA', (W * len(frames), 24), (0, 0, 0, 0))
        for i, im in enumerate(frames):
            sheet.alpha_composite(im.resize((W * 2, 48), Image.NEAREST), (i * W * 2, 0))
            strip.alpha_composite(im, (i * W, 0))
        sheet.save(os.path.join(ROOT, 'assets', 'units', t + '.png'))
        man['units'][t] = {'src': f'assets/units/{t}.png', 'frames': len(frames)}
        buf = io.BytesIO(); strip.save(buf, 'PNG')
        layer = {'name': 'Camada 1', 'opacity': 1, 'frameCount': len(frames),
                 'chunks': [{'layout': [[i] for i in range(len(frames))], 'base64PNG': 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()}]}
        pk = {'modelVersion': 2, 'piskel': {'name': f'Terra Brasilis {t}', 'description': '', 'fps': 6, 'height': 24, 'width': W, 'layers': [json.dumps(layer)], 'hiddenFrames': []}}
        json.dump(pk, open(os.path.join(ROOT, 'assets', 'piskel', t + '.piskel'), 'w'))
        print(t, len(frames), 'quadros')
    json.dump(man, open(man_path, 'w', encoding='utf8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    preview(*sys.argv[2:3]) if sys.argv[1:2] == ['previa'] else build()
