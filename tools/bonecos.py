"""Bonecos desenhados pixel a pixel (26x24 por quadro, virados para a direita, luz do alto à esquerda).

  python3 tools/bonecos.py                  # gera assets/units/*.png, assets/piskel/*.piskel e atualiza assets/sprites.json
  python3 tools/bonecos.py previa [saída]   # só a prévia ampliada

Cada boneco = tronco (com cabeça e arma) + pernas por quadro.
Quadros: 0 parado, 1 passo A, 2 passo B, 3 golpe, 4 parado respirando.
O azul do uniforme (V U u) é trocado pela cor da facção no jogo; no comandante a cabeça vira o rosto do líder.
"""
import base64, io, json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAL = {
    'O': '#1a1220',                                   # contorno
    'V': '#6f8fff', 'U': '#3555c8', 'u': '#22348a',   # uniforme (vira a cor da facção)
    'T': '#ffe2b8', 'S': '#f2c594', 's': '#c98a5e', 'P': '#f0947a',  # pele: luz, base, sombra, bochecha
    'H': '#4a2c1c', 'h': '#7a4a2c',                   # cabelo
    'K': '#2b2633', 'k': '#544c62',                   # preto (barretina, botas) e brilho
    'W': '#f4f0e6', 'w': '#b9b3a8',                   # branco
    'R': '#d4382c', 'D': '#b02a22', 'r': '#7e1c17',   # vermelho
    'G': '#f6c64a', 'g': '#b07a20',                   # dourado
    'M': '#f4f7f8', 'm': '#a3adb6', 'n': '#5d6670',   # metal
    'C': '#d39a5c', 'B': '#9a6234', 'b': '#5e3a1e',   # madeira, couro
    'Y': '#c8844a', 'X': '#8f5428', 'Z': '#4e2c14',   # cavalo
    'F': '#fff6b0', 'f': '#ffb03a',                   # clarão
    'Q': '#9a6540', 'E': '#b88058', 'q': '#6b4228',   # pele escura (lanceiros negros)
}
W, H = 26, 24  # quadro em pixels de arte (no jogo vira 52x48)


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


def shift(rows, dx=0, dy=0):
    out = [['.'] * W for _ in range(H)]
    for y, r in enumerate(rows):
        for x, c in enumerate(r):
            if c != '.' and 0 <= y + dy < H and 0 <= x + dx < W:
                out[y + dy][x + dx] = c
    return [''.join(r) for r in out]


def frame(upper, legs, dy=0):
    """Tronco (linhas 0-17) por cima das pernas (linhas 18-23)."""
    return over(grid(['.' * W] * 18 + legs), shift(grid(upper), 0, dy))


def five(up, atk, legs):
    """Parado, passo A, passo B (tronco desce 1), golpe, parado respirando."""
    return [frame(up, legs['stand']), frame(up, legs['a']), frame(up, legs['b'], 1), frame(atk, legs['a']), frame(up, legs['stand'], 1)]


LEGS = {  # calça branca, bota preta com brilho
    'stand': ["......OWWWWOWWwO", "......OWWwOOWWwO", "......OWWwO.OWwO", "......OKkKO.OKkKO", ".....OKkKKO.OKkKKO", ".....OOOOOO.OOOOOO"],
    'a':     [".....OWWWO.OWWwO", "....OWWwO..OWWwO", "....OWwO....OWwO", "...OKkKO....OKkKO", "..OKkKKO....OKkKKO", "..OOOOOO....OOOOOO"],
    'b':     ["......OWWWWWWwO", ".......OWWWwO", ".......OWWwO", ".......OKkKKO", "......OKkKKKKO", "......OOOOOOOO"],
}
LEGS_B = {k: [r.replace('W', 'B').replace('w', 'b') for r in v] for k, v in LEGS.items()}  # calça de couro

FACE = [  # rosto de perfil, linhas 8-12
    "......OHHTSSSSSO",
    "......OHhSSSSOSO",
    "......OHSSSSSOSO",
    "......OhsSSSPSSO",
    ".......OssSSSrO",
]

# ---------------------------------------------------------------- infantaria
INF_HEAD = [
    "..........OO",
    ".........ORRO",
    ".........ORrO",
    "........OOOOOO",
    ".......OkkKKKKO",
    ".......OkKKGgKO",
    ".......OkKKKKKO",
    ".......ORRRRRrO",
] + FACE
INF_BODY = [
    "......OVUWUUUWUO",
    ".....OVVUUWUWUUuO",
    ".....OVUUUUWUUUuO",
    ".....OuVUUWUWUuuO",
    "......OuUWWGWWuO",
]
INF_GUN = [  # mosquete com baioneta, de pé à frente
    "..................O",
    ".................OMO",
    ".................OMO",
    ".................OmO",
    ".................OnO",
    ".................OnO",
    ".................OnO",
    ".................OBO",
    ".................OCO",
    ".................OBO",
    ".................OBO",
    "................OnBO",
    "................OOBO",
    "...............OSTBO",
    "...............OSSBO",
    "................OOBO",
    ".................OCO",
    ".................OBO",
    ".................ObO",
    ".................OOO",
]
INF_ATK = INF_HEAD[:12] + [
    ".......OssSSSrOOOOOOOOOOOO",
    "......OVUWUUUWSSOBCBBnnMMO",
    ".....OVVUUWUWUSSObbBBnmmO",
    ".....OVUUUUWUUUOOOOOOOOOO",
    ".....OuVUUWUWUuuO",
    "......OuUWWGWWuO",
]


def inf_frames():
    return five(over(grid(INF_HEAD + INF_BODY), grid(INF_GUN)), grid(INF_ATK), LEGS)


# ---------------------------------------------------------------- atiradores
ATI_HEAD = [
    "", "", "",
    ".........OOOOO",
    "........OBCCBbO",
    "........OBBBBbO",
    "........ORRRRrO",
    ".....OCBBBBBBBBBbO",
    "......OHsssssssO",
] + FACE[1:]
ATI_BODY = [
    "......OVUbUUUUUO",
    ".....OVVUUbUUUUuO",
    ".....OVUUUUbUUUuO",
    ".....OuVUUUUbUuuO",
    "......ObbbGbbbbO",
]
ATI_GUN = [
    "", "",
    ".................OOO",
    ".................OnO",
    ".................OnO",
    ".................OnO",
    ".................OnO",
    ".................OmO",
    ".................OBO",
    ".................OCO",
    ".................OBO",
    "................OnBO",
    "................OOBO",
    "...............OSTBO",
    "...............OSSBO",
    "................OOCO",
    ".................OCO",
    ".................OBO",
    ".................ObO",
    ".................OOO",
]
ATI_ATK = ATI_HEAD[:9] + [
    "......OHSSSSSOSOOOOOOOOFF",
    "......OHSSSSSOSSBBBnnnnFfF",
    "......OhsSSSPSSOOOOOOOOFF",
    ".......OssSSSrOSSO",
] + ATI_BODY


def ati_frames():
    return five(over(grid(ATI_HEAD + ATI_BODY), grid(ATI_GUN)), grid(ATI_ATK), LEGS_B)


# ---------------------------------------------------------------- cavalaria
HORSE = [
    "", "", "", "", "",
    "....................OO",
    "...................OZXO",
    "..................OZXXXO",
    ".................OZZXXXYO",
    "................OZZXXXXOXO",
    "...............OZZXbXXXXXO",
    "...............OZXXXbXXXOO",
    "...OOOOOOOOOOOOZZXXXOOO",
    "..OZYYYYYRRRRYYYXXXO",
    ".OZXYYYYORGGROYYXXO",
    ".OZXXXXXORRRROXXXXO",
    "OZZOXXXXXXXXXXXXXZO",
    "OZ.OZXXXXXXXXXXXZO",
    "....OZZZZZZZZZZZO",
]
HLEGS = {
    'stand': ["...OXO.OXO...OXO.OXO", "...OXO.OXO...OXO.OXO", "...OXO.OXO...OXO.OXO", "...OKO.OKO...OKO.OKO", "...OOO.OOO...OOO.OOO"],
    'a':     ["..OXO..OXO...OXO..OXO", ".OXO..OXO.....OXO..OXO", ".OXO..OXO.....OXO..OXO", "OKO..OKO.......OKO..OKO", "OOO..OOO.......OOO..OOO"],
    'b':     ["....OXOOXO..OXOOXO", "....OXOOXO..OXOOXO", ".....OKKO....OKKO", ".....OOOO....OOOO", ""],
}
RIDER = [
    "........OOOOO",
    ".......OBCCBbO",
    ".......ORRRRrO",
    "....OCBBBBBBBBBBbO",
    ".....OHsssssssO",
    ".....OHSSSSOSO",
    ".....OHSSSSOSO",
    ".....OhsSSPSSO",
    "......OsRRRrO",
    ".....OVUUUUUUO",
    "....OVVUUUUUUTO",
    "....OVUUUUUUUSO",
    "....OuVUUUUUuO",
    ".....OuWWWWwO",
    "......OWWWwO",
    "......OKkKO",
    "......OKkKO",
    "......OOOO",
]
LANCE = [
    "...............O",
    "..............OMO",
    "..............OMO",
    "..............OmRRRO",
    "..............OBRRO",
    "..............OBOO",
] + ["..............OBO"] * 11 + ["..............OOO"]
RIDER_ATK = RIDER[:9] + [
    ".....OVUUUUUUOOOOOOOOOOOOO",
    "....OVVUUUUUUTBBCBBBBBnMMO",
    "....OVUUUUUUUSOOOOOOOOOOOO",
] + RIDER[12:]


def cav_frames():
    def fr(legs, dy=0, atk=False):
        horse = over(grid(['.' * W] * 19 + legs), shift(grid(HORSE), 0, dy))
        return over(horse, shift(grid(RIDER_ATK if atk else over(grid(RIDER), grid(LANCE))), 0, dy))
    return [fr(HLEGS['stand']), fr(HLEGS['a']), fr(HLEGS['b'], 1), fr(HLEGS['a'], 0, True), fr(HLEGS['stand'], 1)]


# ---------------------------------------------------------------- artilharia
CANNON = [
    "", "", "", "", "", "", "", "",
    "..............OOOOOOOOOOO",
    "...........OOOgGGGgGGGGGOO",
    "..........OgGFFGGgGGGGGGnO",
    "..........OgGGGGGgGGGGGGnO",
    "...........OOgggggggggggOO",
    ".........OOBBBBBBBOOOOOO",
    "........OCBBBBBBBBBO",
    "........ObBBOOOOBBbO",
    "........ObBOCBBCObbO",
    "..........OCBOOBCO",
    "..........OCOGGOCO",
    "..........OCBOOBCO",
    "...........OCBBCO",
    "............OOOO",
]
GUNNER = [  # artilheiro com o soquete na mão
    ".......OO",
    ".......OwO",
    ".......OwO",
    ".......OBO",
    ".......OBO",
    "..OOOOOOBO",
    ".OkKKKKOBO",
    ".OKKGKKOBO",
    "OHTSSSSOBO",
    "OHSSSOSOBO",
    "OhsSSPSOBO",
    ".OsSSrOOBO",
    "OVUWUUUSSO",
    "OVUUWUUSSO",
    "OuUUUWUOBO",
    "OuUUUUuOBO",
    ".OWWWWO.ObO",
    "........OO",
]
GLEGS = {
    'stand': [".OWWWWO", ".OWwOWwO", ".OWwOWwO", ".OKkOKkO", "OKkKOKkKO", "OOOOOOOOO"],
    'a':     [".OWWWWO", "OWwO.OWwO", "OWwO.OWwO", "OKkO.OKkO", "OKkKOOKkKO", "OOOOOOOOOO"],
    'b':     [".OWWWWO", ".OWwWwO", ".OWwWwO", ".OKkKkO", ".OKkKKKO", ".OOOOOOO"],
}
FLASH = [''] * 8 + ["......................FFF.", ".....................FFfFF", ".....................FfFfF", "......................FFF."]


def art_frames():
    def fr(legs, dx=0, dy=0, fire=False):
        g = over(grid(['.' * W] * 18 + legs), shift(grid(GUNNER), dx, dy))
        out = over(g, shift(grid(CANNON), -1 if fire else 0, 0))
        return over(out, grid(FLASH)) if fire else out
    return [fr(GLEGS['stand']), fr(GLEGS['a'], 1), fr(GLEGS['b'], 1, 1), fr(GLEGS['stand'], 0, 0, True), fr(GLEGS['stand'], 0, 1)]


# ---------------------------------------------------------------- comandante
LD_UP = [
    "......OOOOOOOOO",
    ".....OKkKKKKKKKO",
    "....OKkKGKKKKKKKO",
    ".....OOGGGGGGGOO",
] + [r[:] for r in ["......OHHTSSSSSO", "......OHhSSSSOSO", "......OHSSSSSOSO", "......OhsSSSPSSO", ".......OssSSSrO"]] + [
    "....ORROGGUUUUGGO",
    "...ORDROgVUWUUUgGO",
    "...ORrDOuVUWGUUUO",
    "...ORrDOuUGWGUUSSO",
    "...ORrRDOuUUWGUSSO",
    "...ORrRDORRRRRrRO",
    "...ORrRROuUUGUUuO",
    "...ORrRROuUUUUuO",
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
LD_ARM = [  # espada erguida para o alto
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
    atk = over(grid(LD_UP[:12] + ["...ORrDOuUGWGUUO", "...ORrRDOuUUWGUO"] + LD_UP[14:]), shift(grid(LD_ARM), 6, 0))
    return five(up, atk, LEGS)


# ---------------------------------------------------------------- jagunço (Sertão): chapéu de couro com tachas, gibão
JAG_HEAD = [
    "", "",
    "..........OOO",
    "........OOCCBOO",
    ".......OCBBBBBbO",
    "......OCBGBGBGBbO",
    ".....OOBBBBBBBBbOO",
    "....OCBBBBBBBBBBBbO",
    "......OHsssssssO",
] + FACE[1:]
JAG_BODY = [
    "......OBUbUUUBBO",
    ".....OBBUUbUUUBBO",
    ".....OBUUUUbUUBBO",
    ".....OBbUUUUbUBbO",
    "......ObbbGbbbbO",
]
JAG_ATK = JAG_HEAD[:9] + ATI_ATK[9:13] + JAG_BODY


def jag_frames():
    return five(over(grid(JAG_HEAD + JAG_BODY), grid(ATI_GUN)), grid(JAG_ATK), LEGS_B)


# ---------------------------------------------------------------- lanceiro (Pampa): poncho com faixa, cavalo escuro, flâmula maior
DARK = str.maketrans('STsP', 'QEqq')
HORSE_L = [r.translate(str.maketrans('YXZ', 'XZK')) for r in HORSE]
RIDER_L = [r.translate(DARK) for r in RIDER]
RIDER_L[10] = "....OVRRRRRRREO"
LANCE_L = ["...............O", "..............OMO", "..............OMO", "..............OmRRRRO", "..............OBRRRO", "..............OBRRO", "..............OBOO"] + ["..............OBO"] * 10 + ["..............OOO"]
RIDER_L_ATK = [r.translate(DARK) for r in RIDER_ATK]


def lan_frames():
    def fr(legs, dy=0, atk=False):
        horse = over(grid(['.' * W] * 19 + legs), shift(grid(HORSE_L), 0, dy))
        return over(horse, shift(grid(RIDER_L_ATK if atk else over(grid(RIDER_L), grid(LANCE_L))), 0, dy))
    return [fr(HLEGS['stand']), fr(HLEGS['a']), fr(HLEGS['b'], 1), fr(HLEGS['a'], 0, True), fr(HLEGS['stand'], 1)]


# ---------------------------------------------------------------- canoeiro (Amazônia): canoa, remo e arco
CANOE = [''] * 14 + [
    "..OO..............OO",
    "..OCOOOOOOOOOOOOOOCO",
    "...OCCCCCCCCCCCCCCO",
    "....OBBBBBBBBBBBBO",
    ".....ObbbbbbbbbbO",
    "......OOOOOOOOOO",
]
PADDLER = [
    "", "", "",
    "...........OR",
    "..........ORYO",
    ".........OHHHHO",
    "........OHHTSSSO",
    "........OHSSSOSO",
    "........OHSSSSSO",
    ".........OsSSrO",
    "........OVUUUUUO",
    ".......OVUUUUUUSO",
    ".......OuUUUUUUSO",
    "........OuUUUUO",
]
PADDLE_A = [''] * 9 + ["..............OBO", "...............OBO", "................OBO", ".................OBO", "..................OBO", "...................OCO", "...................OCCO", "....................OO"]
PADDLE_B = [''] * 9 + ["...............OBO", "...............OBO", "...............OBO", "...............OBO", "...............OBO", "...............OCO", "..............OCCO", "...............OO"]
BOW = [''] * 7 + ["................OBO", ".................OBO", "...............SSOBmmmmMO", ".................OBO", "................OBO"]


def can_frames():
    def fr(paddle, dy=0):
        return shift(over(over(grid(CANOE), grid(PADDLER)), grid(paddle)), 0, dy)
    return [fr(PADDLE_A), fr(PADDLE_A, 1), fr(PADDLE_B), fr(BOW), fr(PADDLE_B, 1)]


UNITS = {'inf': inf_frames, 'cav': cav_frames, 'ati': ati_frames, 'art': art_frames, 'ld': ld_frames, 'jag': jag_frames, 'lan': lan_frames, 'can': can_frames}


def to_img(rows, scale=1):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    px = im.load()
    for y, r in enumerate(rows[:H]):
        for x, c in enumerate(r[:W]):
            if c in PAL:
                v = PAL[c].lstrip('#')
                px[x, y] = (int(v[0:2], 16), int(v[2:4], 16), int(v[4:6], 16), 255)
    return im.resize((W * scale, H * scale), Image.NEAREST) if scale > 1 else im


def preview(path='/tmp/bonecos.png', s=8):
    rows = [[to_img(f, s) for f in fn()] for fn in UNITS.values()]
    n = max(len(r) for r in rows)
    sh = Image.new('RGBA', (W * s * n + 6 * (n + 1), (H * s + 10) * len(rows)), (120, 160, 90, 255))
    for j, fr in enumerate(rows):
        for i, im in enumerate(fr):
            sh.alpha_composite(im, (6 + i * (W * s + 6), 5 + j * (H * s + 10)))
    sh.save(path); print(path)


def build():
    """Folha de quadros 52x48 para o jogo e um .piskel (26x24) para abrir e editar no piskelapp.com."""
    man_path = os.path.join(ROOT, 'assets', 'sprites.json')
    man = json.load(open(man_path, encoding='utf8'))
    for d in ('units', 'piskel'):
        os.makedirs(os.path.join(ROOT, 'assets', d), exist_ok=True)
    for t, fn in UNITS.items():
        frames = [to_img(f) for f in fn()]
        sheet = Image.new('RGBA', (W * 2 * len(frames), H * 2), (0, 0, 0, 0))
        strip = Image.new('RGBA', (W * len(frames), H), (0, 0, 0, 0))
        for i, im in enumerate(frames):
            sheet.alpha_composite(im.resize((W * 2, H * 2), Image.NEAREST), (i * W * 2, 0))
            strip.alpha_composite(im, (i * W, 0))
        sheet.save(os.path.join(ROOT, 'assets', 'units', t + '.png'))
        man['units'][t] = {'src': f'assets/units/{t}.png', 'frames': len(frames)}
        buf = io.BytesIO(); strip.save(buf, 'PNG')
        layer = {'name': 'Camada 1', 'opacity': 1, 'frameCount': len(frames),
                 'chunks': [{'layout': [[i] for i in range(len(frames))], 'base64PNG': 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()}]}
        pk = {'modelVersion': 2, 'piskel': {'name': f'Terra Brasilis {t}', 'description': '', 'fps': 6, 'height': H, 'width': W, 'layers': [json.dumps(layer)], 'hiddenFrames': []}}
        json.dump(pk, open(os.path.join(ROOT, 'assets', 'piskel', t + '.piskel'), 'w'))
        print(t, len(frames), 'quadros')
    json.dump(man, open(man_path, 'w', encoding='utf8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    preview(*sys.argv[2:3]) if sys.argv[1:2] == ['previa'] else build()
