"""Desenha os ícones 16x16 da interface com contorno, luz (canto de cima à esquerda) e sombra, e imprime o bloco PXI16 para js/base.js.
python3 tools/icones.py > /tmp/pxi16.js"""
from PIL import Image, ImageDraw
import math, json
# cor: (base, luz, sombra) como letras da paleta PXC
CO = {'ouro': 'YLy', 'verm': 'RQr', 'mad': 'BTb', 'aco': 'GHg', 'pap': 'SWs', 'azul': 'UVu', 'verde': 'NMn', 'preto': 'KKK', 'mar': 'CcC', 'ourod': 'yyy', 'madd': 'bbb'}
def M(): return Image.new('L', (16, 16), 0)
def icon(layers):
    g = [['.'] * 16 for _ in range(16)]; occ = [[0] * 16 for _ in range(16)]
    for col, fn, sh in layers:
        m = M(); fn(ImageDraw.Draw(m)); px = m.load(); b, l, d = CO[col]
        inside = lambda x, y: 0 <= x < 16 and 0 <= y < 16 and px[x, y] > 0
        for y in range(16):
            for x in range(16):
                if not inside(x, y): continue
                c = b
                if sh and (not inside(x - 1, y) or not inside(x, y - 1)): c = l
                if sh and (not inside(x + 1, y) or not inside(x, y + 1)): c = d
                g[y][x] = c; occ[y][x] = 1
    for y in range(16):  # contorno escuro em volta de tudo
        for x in range(16):
            if not occ[y][x] and any(0 <= x + a < 16 and 0 <= y + b < 16 and occ[y + b][x + a] for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))): g[y][x] = 'O'
    return [''.join(r) for r in g]
E = lambda box: (lambda d: d.ellipse(box, fill=255))
R = lambda box: (lambda d: d.rectangle(box, fill=255))
P = lambda pts: (lambda d: d.polygon(pts, fill=255))
Lw = lambda pts, w: (lambda d: d.line(pts, fill=255, width=w))
def star(cx, cy, r1, r2): return [(cx + (r1 if k % 2 == 0 else r2) * math.sin(k * math.pi / 5), cy - (r1 if k % 2 == 0 else r2) * math.cos(k * math.pi / 5)) for k in range(10)]
I = {
 'coin': [('ouro', E((0, 5, 9, 14)), 1), ('ourod', E((4, 0, 15, 11)), 0), ('ouro', E((5, 1, 14, 10)), 1), ('ourod', E((7, 3, 12, 8)), 0), ('ouro', E((8, 4, 11, 7)), 0)],
 'swords': [('aco', Lw([(2, 13), (13, 2)], 2), 1), ('aco', Lw([(2, 2), (13, 13)], 2), 1), ('ouro', Lw([(2, 10), (5, 13)], 2), 0), ('ouro', Lw([(10, 13), (13, 10)], 2), 0), ('mad', R((1, 13, 2, 14)), 0), ('mad', R((13, 13, 14, 14)), 0)],
 'flag': [('mad', R((2, 1, 3, 15)), 1), ('verm', P([(4, 2), (14, 3), (11, 6), (14, 9), (4, 9)]), 1), ('ouro', R((1, 14, 4, 15)), 0)],
 'star': [('ouro', P(star(7.5, 8, 7.5, 3.2)), 1)],
 'scroll': [('pap', R((3, 3, 12, 13)), 1), ('mad', R((2, 1, 13, 3)), 1), ('mad', R((2, 13, 13, 15)), 1), ('mad', R((5, 6, 10, 6)), 0), ('mad', R((5, 9, 10, 9)), 0)],
 'shield': [('aco', P([(2, 1), (13, 1), (13, 8), (7.5, 15), (2, 8)]), 1), ('verm', P([(6, 2), (9, 2), (9, 11), (7.5, 13), (6, 11)]), 1)],
 'house': [('pap', R((3, 7, 12, 14)), 1), ('verm', P([(0, 8), (7.5, 1), (15, 8)]), 1), ('mad', R((6, 10, 9, 14)), 1)],
 'anchor': [('aco', E((5, 0, 10, 5)), 1), ('aco', R((7, 4, 8, 14)), 1), ('aco', R((4, 6, 11, 7)), 1), ('aco', lambda d: d.arc((1, 5, 14, 15), 30, 150, fill=255, width=2), 1)],
 'warn': [('ouro', P([(7.5, 1), (15, 14), (0, 14)]), 1), ('preto', R((7, 5, 8, 9)), 0), ('preto', R((7, 11, 8, 12)), 0)],
 'check': [('verde', Lw([(2, 8), (6, 12), (14, 3)], 3), 1)],
 'eye': [('pap', E((0, 4, 15, 12)), 1), ('azul', E((5, 4, 10, 11)), 1), ('preto', R((7, 7, 8, 8)), 0)],
 'spk': [('aco', R((2, 6, 5, 10)), 1), ('aco', P([(5, 6), (10, 2), (10, 14), (5, 10)]), 1), ('ouro', lambda d: d.arc((8, 4, 15, 12), -55, 55, fill=255, width=1), 0)],
 'note': [('ouro', E((1, 10, 6, 15)), 1), ('ouro', E((9, 8, 14, 13)), 1), ('ouro', R((5, 2, 6, 12)), 0), ('ouro', R((13, 1, 14, 10)), 0), ('ouro', P([(5, 1), (14, 0), (14, 3), (5, 4)]), 1)],
 'menu': [('ouro', R((2, 2, 13, 4)), 1), ('ouro', R((2, 7, 13, 9)), 1), ('ouro', R((2, 12, 13, 14)), 1)],
 'undo': [('ouro', Lw([(12, 15), (13, 11), (13, 8), (11, 5), (8, 4), (5, 4)], 3), 1), ('ouro', P([(0, 4), (6, -1), (6, 9)]), 1)],
 'sun': [('ouro', E((4, 4, 11, 11)), 1)] + [('ouro', Lw([(7.5 + 5 * math.cos(a), 7.5 + 5 * math.sin(a)), (7.5 + 7.5 * math.cos(a), 7.5 + 7.5 * math.sin(a))], 2), 0) for a in [k * math.pi / 4 for k in range(8)]],
 'moon': [('ouro', lambda d: (d.ellipse((1, 1, 14, 14), fill=255), d.ellipse((5, -1, 17, 11), fill=0)), 1)],
 'boot': [('mad', P([(4, 2), (10, 2), (10, 9), (15, 11), (15, 13), (3, 13), (4, 9)]), 1), ('madd', R((3, 13, 15, 14)), 0), ('ouro', R((4, 1, 10, 3)), 1)],
 'crown': [('ouro', P([(1, 4), (4, 8), (7.5, 2), (11, 8), (14, 4), (13, 13), (2, 13)]), 1), ('verm', R((7, 9, 8, 10)), 0)],
 'book': [('verm', R((1, 2, 14, 14)), 1), ('pap', R((3, 3, 13, 12)), 1), ('verm', R((7, 3, 8, 12)), 0), ('ouro', R((10, 0, 11, 6)), 0)],
 'quill': [('pap', P([(14, 0), (10, 2), (5, 8), (4, 11), (7, 10), (12, 5)]), 1), ('preto', Lw([(1, 15), (5, 10)], 1), 0), ('azul', E((0, 12, 4, 15)), 1)],
 'r_caf': [('mad', E((1, 2, 8, 12)), 1), ('mad', E((7, 4, 14, 14)), 1), ('preto', Lw([(4, 3), (5, 11)], 1), 0), ('preto', Lw([(10, 5), (11, 13)], 1), 0)],
 'r_acu': [('verde', R((3, 2, 5, 15)), 1), ('verde', R((7, 0, 9, 15)), 1), ('verde', R((11, 3, 13, 15)), 1), ('pap', R((2, 6, 14, 6)), 0), ('pap', R((2, 11, 14, 11)), 0)],
 'r_bor': [('mad', R((6, 6, 9, 15)), 1), ('verde', E((1, 0, 14, 9)), 1), ('pap', E((10, 9, 13, 14)), 1)],
 'r_our': [('ouro', P([(1, 11), (4, 6), (8, 8), (7, 13)]), 1), ('ouro', P([(7, 5), (11, 2), (14, 6), (12, 10), (8, 9)]), 1), ('ouro', P([(8, 13), (11, 11), (14, 14), (9, 15)]), 1)],
 'r_gad': [('pap', E((3, 4, 12, 15)), 1), ('aco', Lw([(3, 6), (0, 1)], 2), 1), ('aco', Lw([(12, 6), (15, 1)], 2), 1), ('preto', R((5, 8, 6, 9)), 0), ('preto', R((9, 8, 10, 9)), 0), ('verm', R((6, 12, 9, 13)), 0)],
 'r_alg': [('verde', R((7, 9, 8, 15)), 1), ('pap', E((1, 2, 9, 10)), 1), ('pap', E((6, 1, 14, 9)), 1), ('pap', E((4, 5, 11, 12)), 1)],
 'r_erv': [('verde', P([(1, 14), (3, 5), (8, 1), (6, 10)]), 1), ('verde', P([(7, 14), (9, 6), (14, 3), (12, 11)]), 1), ('mad', Lw([(3, 15), (12, 6)], 1), 0)],
 'r_cac': [('mad', E((2, 2, 13, 15)), 1), ('ouro', Lw([(5, 4), (5, 13)], 1), 0), ('ouro', Lw([(10, 4), (10, 13)], 1), 0), ('verde', R((7, 0, 8, 2)), 0)],
}
print('const PXI16=' + json.dumps({k: icon(v) for k, v in I.items()}, separators=(',', ':')) + '; // ícones 16x16 gerados por tools/icones.py')
