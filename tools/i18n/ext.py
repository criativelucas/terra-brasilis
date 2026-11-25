import re,glob,json,sys
SITE=sys.argv[1]
def scan(s):
    out=[];i=0;n=len(s);prev=''
    def code(i,stop_brace):
        nonlocal out
        depth=0;prev=''
        while i<n:
            c=s[i]
            if s.startswith('//',i):i=s.index('\n',i) if '\n' in s[i:] else n;continue
            if s.startswith('/*',i):i=s.index('*/',i)+2;continue
            if c in '\'"':
                j=i+1;buf=''
                while j<n and s[j]!=c:
                    if s[j]=='\\':buf+=s[j:j+2];j+=2;continue
                    buf+=s[j];j+=1
                out.append(buf);i=j+1;prev='a';continue
            if c=='`':i=tmpl(i+1);prev='a';continue
            if c=='/' and (prev=='' or prev in '(,=:[!&|?{};+-*%<>~^'):
                j=i+1;cls=False
                while j<n:
                    if s[j]=='\\':j+=2;continue
                    if s[j]=='[':cls=True
                    elif s[j]==']':cls=False
                    elif s[j]=='/' and not cls:break
                    elif s[j]=='\n':break
                    j+=1
                i=j+1
                while i<n and s[i].isalpha():i+=1
                prev='a';continue
            if c=='{':depth+=1
            elif c=='}':
                if stop_brace and depth==0:return i+1
                depth-=1
            if not c.isspace():prev=c if not (c.isalnum() or c in '_$') else 'a'
            i+=1
        return i
    def tmpl(i):
        buf=''
        while i<n:
            c=s[i]
            if c=='\\':buf+=s[i:i+2];i+=2;continue
            if c=='`':out.append(buf);return i+1
            if s.startswith('${',i):out.append(buf);buf='';i=code(i+2,True);continue
            buf+=c;i+=1
        return i
    code(0,False);return out
segs={}
for f in sorted(glob.glob(SITE+'/js/*.js')):
    s=open(f,encoding='utf8').read()
    for lit in scan(s):
        for part in re.split(r'<[^>]*>|<[^>]*$|^[^<]*>',lit):
            for p in re.split(r'\s+·\s+|\\n',part):
                p=p.strip(' ,.;:·')
                p=p.strip()
                if len(re.findall(r'[A-Za-zÀ-ÿ]',p))<2 or not re.search(r'[a-zà-ÿ]',p):continue
                if re.search(r'=>|[;{}]|\(\)|^\w+\.\w+|^[#.][\w-]|^\w+-\w+$|px|rgba|hsl|var\(|data-|\$\{',p):continue
                if re.fullmatch(r'[a-z_][a-zA-Z0-9_]*',p) and not re.search(r'[à-ÿ]',p):p='§'+p
                segs.setdefault(p,set()).add(f.split('/')[-1])
json.dump({k:sorted(v) for k,v in segs.items()},open('segs.json','w'),ensure_ascii=False,indent=0)
idw=[k for k in segs if k.startswith('§')];txt=[k for k in segs if not k.startswith('§')]
print('texto',len(txt),sum(len(k) for k in txt),'identificadores minúsculos',len(idw))
from collections import Counter;print(Counter(f for k in txt for f in segs[k]))
