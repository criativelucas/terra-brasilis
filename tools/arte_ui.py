"""Gera a arte da interface em pixel (assets/ui): moldura com filigrana dourada, capa de couro do livro,
papel envelhecido, moldura de item e a biblioteca da tela inicial.  python3 tools/arte_ui.py"""
import os, random
from PIL import Image, ImageDraw
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'ui')
os.makedirs(OUT, exist_ok=True)
H = lambda s: tuple(int(s[i:i+2], 16) for i in (1, 3, 5)) + (255,)
O, GOLD, GL, GD, GH = H('#2a160d'), H('#c8952f'), H('#f2cd63'), H('#8a5c18'), H('#fff0b8')

def band(im, x0, y0, w, h, cols, horiz):
    """faixa da moldura: camadas de cor da borda para dentro"""
    d = ImageDraw.Draw(im)
    for k, c in enumerate(cols):
        if horiz: d.rectangle([x0, y0 + k, x0 + w - 1, y0 + k], fill=c)
        else: d.rectangle([x0 + k, y0, x0 + k, y0 + h - 1], fill=c)

def frame(name, base, base2, size=72, s=24, orn=True):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    cols = [O, O] + [base] * 3 + [base2] + [base] * 8 + [base2] + [O, GD, GOLD, GL, GOLD, GD, O, O, O][:s - 15]
    cols = (cols + [O] * s)[:s]
    for k, c in enumerate(cols): d.rectangle([k, k, size - 1 - k, size - 1 - k], outline=c)  # faixas concêntricas: os cantos fecham certos
    # costura pontilhada no couro
    for k in range(4, size - 4, 4):
        for (x, y) in ((k, 3), (k, size - 4), (3, k), (size - 4, k)):
            if 2 < x < size - 3 and 2 < y < size - 3: im.putpixel((x, y), base2)
    if orn:
        c = Image.new('RGBA', (s, s), (0, 0, 0, 0)); g = ImageDraw.Draw(c)
        # arabesco: colchete em L que termina em voluta, com losango no canto
        for w_, col in ((4, O), (2, GOLD)):
            g.line([(2, 15), (2, 2), (15, 2)], fill=col, width=w_)
            g.arc([12, 1, 20, 9], 180, 450, fill=col, width=w_ - 1 if w_ > 2 else 1)
            g.arc([1, 12, 9, 20], 90, 360, fill=col, width=w_ - 1 if w_ > 2 else 1)
        g.polygon([(7, 4), (10, 7), (7, 10), (4, 7)], fill=O); g.polygon([(7, 5), (9, 7), (7, 9), (5, 7)], fill=GL)
        for (x, y) in ((2, 2), (3, 2), (2, 3)): c.putpixel((x, y), GH)
        g.line([(2, 4), (2, 13)], fill=GL); g.line([(4, 2), (13, 2)], fill=GL)
        for k in range(4):
            cc = c.rotate(-90 * k) if k else c
            pos = [(0, 0), (size - s, 0), (size - s, size - s), (0, size - s)][k]
            im.alpha_composite(cc, pos)
    im.save(os.path.join(OUT, name)); return im

frame('frame.png', H('#4a2614'), H('#6b3a20'))      # janelas: couro escuro com filigrana dourada
frame('book.png', H('#7c1f18'), H('#9e2f22'))       # capa do livro: couro vermelho com cantos dourados
# moldura de item: ouro com tachas, miolo escuro
sl = Image.new('RGBA', (48, 48), (0, 0, 0, 0)); d = ImageDraw.Draw(sl)
d.rectangle([0, 0, 47, 47], fill=O); d.rectangle([2, 2, 45, 45], fill=GD); d.rectangle([3, 3, 44, 44], fill=GOLD)
d.line([(3, 3), (44, 3)], fill=GL); d.line([(3, 3), (3, 44)], fill=GL); d.rectangle([7, 7, 40, 40], fill=O); d.rectangle([8, 8, 39, 39], fill=H('#3a2218'))
for (x, y) in ((5, 5), (42, 5), (5, 42), (42, 42)): d.rectangle([x - 1, y - 1, x + 1, y + 1], fill=O); sl.putpixel((x, y), GH)
sl.save(os.path.join(OUT, 'slot.png'))
# papel envelhecido: fibras, granulado e manchas leves (ladrilho 128x128)
random.seed(7); P = Image.new('RGBA', (128, 128), H('#f0dba6')); px = P.load()
for y in range(128):
    for x in range(128):
        n = random.random()
        if n < .06: px[x, y] = H('#e3c88c')
        elif n < .085: px[x, y] = H('#f8e8bf')
        elif n < .089: px[x, y] = H('#c9a46a')
for _ in range(22):  # fibras horizontais
    x, y, L = random.randrange(128), random.randrange(128), random.randrange(4, 14)
    for k in range(L): px[(x + k) % 128, y] = H('#e6cd93')
for _ in range(5):  # manchas
    cx, cy, r = random.randrange(128), random.randrange(128), random.randrange(6, 16)
    for y in range(-r, r + 1):
        for x in range(-r, r + 1):
            if x * x + y * y < r * r and random.random() < .55:
                c = px[(cx + x) % 128, (cy + y) % 128]; px[(cx + x) % 128, (cy + y) % 128] = (max(0, c[0] - 10), max(0, c[1] - 14), max(0, c[2] - 20), 255)
P.save(os.path.join(OUT, 'paper.png'))
# biblioteca da tela inicial: estantes, janela com lua, mesa com vela e mapa (320x180)
random.seed(3); B = Image.new('RGBA', (320, 180), H('#2a1810')); d = ImageDraw.Draw(B)
for x in range(0, 320, 8): d.line([(x, 0), (x, 180)], fill=H('#24140d'))  # lambris
d.rectangle([128, 20, 192, 120], fill=H('#1a2a44')); d.ellipse([128, 4, 192, 52], fill=H('#1a2a44'))  # janela em arco
d.ellipse([164, 22, 178, 36], fill=H('#f6e7b0')); d.ellipse([168, 20, 182, 34], fill=H('#1a2a44'))
for k in range(40): B.putpixel((random.randrange(132, 188), random.randrange(10, 116)), H('#c9d6f0'))
d.line([(160, 8), (160, 120)], fill=H('#3a2214'), width=2); d.line([(128, 64), (192, 64)], fill=H('#3a2214'), width=2)
d.rectangle([124, 118, 196, 124], fill=H('#5e331d'))
BK = ['#7c1f18', '#2f4a7a', '#2c6a3f', '#8a5c18', '#5a2a5e', '#9e2f22', '#3d5a2a', '#6b3a20', '#b07a20']
for sx in (8, 212):  # duas estantes
    d.rectangle([sx, 10, sx + 100, 170], fill=H('#3a2214')); d.rectangle([sx + 3, 13, sx + 97, 167], fill=H('#1c100a'))
    for sy in range(14, 160, 30):
        x = sx + 4
        while x < sx + 94:
            w = random.choice((3, 4, 4, 5, 6)); h = random.randrange(18, 27); c = H(random.choice(BK))
            d.rectangle([x, sy + 27 - h, x + w - 1, sy + 26], fill=c)
            d.line([(x, sy + 29 - h), (x + w - 1, sy + 29 - h)], fill=H('#e0b030'))
            x += w + (1 if random.random() < .2 else 0)
        d.rectangle([sx + 3, sy + 27, sx + 97, sy + 29], fill=H('#5e331d'))
d.rectangle([110, 140, 210, 180], fill=H('#5e331d')); d.rectangle([110, 138, 210, 142], fill=H('#81492a'))  # mesa
d.polygon([(124, 139), (176, 136), (182, 141), (130, 144)], fill=H('#e8d3a2'))  # mapa aberto
d.rectangle([188, 124, 191, 138], fill=H('#f3ead0')); d.ellipse([186, 116, 193, 125], fill=H('#ffd24a'))  # vela
for r_, a in ((30, 28), (20, 40), (12, 60)):
    halo = Image.new('RGBA', B.size, (0, 0, 0, 0)); ImageDraw.Draw(halo).ellipse([190 - r_, 120 - r_, 190 + r_, 120 + r_], fill=(255, 190, 80, a)); B.alpha_composite(halo)
B.save(os.path.join(OUT, 'biblioteca.png'))
print('ok', sorted(os.listdir(OUT)))
