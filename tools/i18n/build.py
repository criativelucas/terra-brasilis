import json,sys,re
SITE=sys.argv[1];D={}
import os;os.chdir(os.path.dirname(os.path.abspath(__file__)))
for f in sorted(__import__('glob').glob('en*.txt')):
    for ln in open(f,encoding='utf8'):
        ln=ln.rstrip('\n')
        if ' => ' not in ln:continue
        k,v=ln.split(' => ',1);k=k.replace("\\'","'").strip()
        if k:D[k]=v.strip()
js='// Dicionário português → inglês, usado por js/i18n.js quando o idioma é inglês. Gerado a partir das frases do jogo.\nconst EN='+json.dumps(D,ensure_ascii=False,separators=(',',':'))+';\n'
open(SITE+'/js/en.js','w',encoding='utf8').write(js);print('entradas',len(D),'bytes',len(js))
segs=json.load(open('segs.json')) if os.path.exists('segs.json') else {};miss=[k for k in segs if not k.startswith('§') and k not in D]
print('sem tradução:',len(miss))
