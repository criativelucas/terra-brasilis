# Marca css e js do index.html com ?v=<data-hora>, para o navegador não misturar arquivos novos com antigos do cache.
# Rode antes de cada publicação: python3 tools/stamp.py
import re,time,pathlib
p=pathlib.Path(__file__).resolve().parent.parent/'index.html'
v=time.strftime('%Y%m%d%H%M%S')
s=re.sub(r'((?:src|href)="(?:js|css)/[^"?]+)(\?v=\d+)?"',lambda m:f'{m.group(1)}?v={v}"',p.read_text(encoding='utf8'))
p.write_text(s,encoding='utf8');print('versão',v,'·',s.count('?v='+v),'arquivos')
