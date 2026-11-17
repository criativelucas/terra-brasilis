// batalha tática: geração do campo, terrenos e sprites
function genMap(b){ // g grama, r estrada, w água, b ponte, f mata, m morro, v vila
  const T=Array.from({length:GH},()=>Array(GW).fill('g')),rnd=n=>Math.random()*n|0;
  let y=GH>>1; // a estrada liga os dois lados e nunca é coberta: garante passagem
  for(let c=0;c<GW;c++){T[y][c]='r';if(c>1&&c<GW-2&&Math.random()<.35){y=Math.max(1,Math.min(GH-2,y+(rnd(2)?1:-1)));T[y][c]='r'}}
  if(b.river){let c=6+rnd(4);const wet=(yy,cc)=>T[yy][cc]=T[yy][cc]=='r'||T[yy][cc]=='b'?'b':'w';
    for(let yy=0;yy<GH;yy++){wet(yy,c);if(yy<GH-1&&Math.random()<.4){c=Math.max(5,Math.min(10,c+(rnd(2)?1:-1)));wet(yy,c)}}
    const ws=[];T.forEach((row,yy)=>row.forEach((t,cc)=>{if(t=='w'&&row[cc-1]=='g'&&row[cc+1]=='g')ws.push([cc,yy])}));
    if(ws.length){const[cc,yy]=ws[rnd(ws.length)];T[yy][cc]='b'}}
  const put=(ch,n)=>{for(let k=0,tries=0;k<n&&tries<500;tries++){const c=2+rnd(GW-4),yy=rnd(GH);if(T[yy][c]=='g'){T[yy][c]=ch;k++}}};
  put('m',b.m*1.3|0);put('f',b.f*1.3|0);put('v',3);return T}
function tree(q,st,a,b,h){
  if(st=='cactus'){q(a+3,b+1,2,8,'#3f8f4f');q(a+3,b+1,1,8,'#6fbf6f');q(a+1,b+3,1,3,'#3f8f4f');q(a+1,b+5,2,1,'#3f8f4f');q(a+6,b+2,1,4,'#3f8f4f');q(a+5,b+5,1,1,'#3f8f4f');q(a+3,b,1,1,'#f6c9d0');return}
  q(a+1,b+9,6,1,'rgba(0,0,0,.22)');
  if(st=='pine'){q(a+3,b+3,2,7,'#5a3a1c');q(a,b+1,8,2,'#1f5136');q(a+1,b,6,1,'#2f7048');q(a+1,b+1,4,1,'#3f8a58');q(a+1,b+3,2,1,'#1f5136');q(a+5,b+3,2,1,'#1f5136');return}
  if(st=='twist'){const ipe=h%3==0;q(a+3,b+4,1,6,'#4a2c17');q(a+4,b+5,2,1,'#4a2c17');q(a+1,b+1,6,3,ipe?'#e0ac1f':'#6f8a2c');q(a+2,b,4,1,ipe?'#f7d34a':'#93ad3f');q(a+2,b+1,2,1,ipe?'#f7d34a':'#93ad3f');q(a+5,b+4,2,2,ipe?'#e0ac1f':'#6f8a2c');return}
  const[d,m,l]=st=='jungle'?['#12502c','#1f8040','#52b855']:h%3==0?['#a8481a','#e0862a','#f8bc50']:['#1f6a2c','#34a03c','#74d05c']; // no Sudeste, uma em três é de outono
  q(a+3,b+6,2,4,'#5a3a1c');q(a,b+1,8,5,d);q(a+1,b,6,7,d);q(a+1,b+1,5,4,m);q(a+2,b+1,3,2,l);q(a+5,b+4,2,1,l);q(a+1,b+5,1,1,l)}
function tile(g,T,c,y,b){
  const t=T[y][c],h=hash(c,y),X=c*CS,Y=y*CS,U=CS/18,q=(a,bb,w,hh,col)=>{g.fillStyle=col;g.fillRect(Math.round(X+a*U),Math.round(Y+bb*U),Math.ceil(w*U),Math.ceil(hh*U))};
  const at=(dx,dy)=>T[y+dy]?.[c+dx],road=v=>v=='r'||v=='b',wet=v=>v=='w'||v=='b';
  q(0,0,18,18,b.g[(c+y)%2]);
  for(let k=0;k<5;k++){const v=h>>>(k*5);q(v%17,(v>>>3)%17,k%2?2:1,1,k%2?b.gd:b.gl)}
  if(h%4==0){q(3+h%11,4+(h>>5)%10,1,1,'#fff');q(4+h%11,4+(h>>5)%10,1,1,'#ffd23f')} // florzinhas
  if(t=='r'){const d='#c79a5e';q(3,3,12,12,d);
    if(c==0||road(at(-1,0)))q(0,4,3,10,d);if(c==GW-1||road(at(1,0)))q(15,4,3,10,d);if(road(at(0,-1)))q(4,0,10,3,d);if(road(at(0,1)))q(4,15,10,3,d);
    q(5+h%6,6+(h>>4)%6,2,1,'#a97f47');q(9+(h>>7)%4,11,1,1,'#e3c08a');q(4+(h>>9)%8,8,1,1,'#a97f47')}
  if(wet(t)){q(0,0,18,18,'#2f7fc4');q(2,2,14,14,'#2a72b5');const dry=v=>v&&!wet(v),foam='#cfeaf5';
    if(dry(at(0,-1)))q(0,0,18,1,foam);if(dry(at(0,1)))q(0,17,18,1,'#1f5f95');if(dry(at(-1,0)))q(0,0,1,18,foam);if(dry(at(1,0)))q(17,0,1,18,foam)}
  if(t=='b'){q(0,3,18,12,'#9a6a36');for(let k=0;k<18;k+=3)q(k,3,1,12,'#7a4f26');q(0,3,18,1,'#c99a5c');q(0,14,18,1,'#4a2c17');q(0,2,18,1,'#4a2c17')}
  if(t=='f')q(0,0,18,18,'rgba(0,40,0,.12)'); // as árvores são desenhadas ao vivo, balançando (drawBattle)
  if(t=='m'){const[l,d,top]=b.mc;q(1,16,16,1,'rgba(0,0,0,.25)');
    if(b.mesa){q(2,6,14,10,d);q(2,6,7,10,l);q(2,11,14,1,'rgba(0,0,0,.2)');q(1,4,16,3,top);q(1,4,16,1,'rgba(255,255,255,.25)');q(5,8,1,5,'rgba(0,0,0,.18)');q(11,9,1,6,'rgba(0,0,0,.18)')}
    else[[9,2,13],[4,7,8]].forEach(([cx_,ty,n])=>{for(let k=0;k<n;k++){const w=1+k;q(cx_-w,ty+k,w,1,l);q(cx_,ty+k,w,1,d)}q(cx_-2,ty+1,2,2,top);q(cx_-1,ty,1,1,top)})}
  if(t=='v'){q(3,8,8,6,'#efe2c0');q(9,8,2,6,'#cdbd95');q(2,5,10,3,'#2a9db0');q(3,4,8,1,'#52c8d6');q(2,7,10,1,'#1f7385');q(6,11,2,3,'#5a3a1c');q(4,10,1,1,'#f6d26a');
    q(11,11,5,4,'#efe2c0');q(10,9,7,2,'#2a9db0');q(13,13,1,2,'#5a3a1c');q(2,14,15,1,'rgba(0,0,0,.2)')}}

// sprites 26x24 com contorno; quadros: 0-1 parado, 2-3 andando, 4 golpe; cacheados por tipo, facção e pele
const SPR=new Map,CUSTOM={units:{}}; // CUSTOM: folhas de sprite carregadas de assets/sprites.json (js/assets.js)
function sprite(u,f,mine,fr){
  const key=[u.type,f,mine,u.ld,u.sk,fr].join();if(SPR.has(key))return SPR.get(key);
  const cu=CUSTOM.units[u.ld?'ld':u.type]||CUSTOM.units[u.type];
  if(cu){const fw=cu.im.width/cu.frames,[c,g]=mk(fw,cu.im.height);g.drawImage(cu.im,(fr%cu.frames)*fw,0,fw,cu.im.height,0,0,fw,cu.im.height);
    g.fillStyle=`hsl(${hue(f)},${mine?78:52}%,48%)`;g.fillRect(0,cu.im.height-2,fw,2);SPR.set(key,c);return c} // faixa na cor da facção
  const[t,g]=mk(26,24),h=hue(f),s=mine?78:52,C=`hsl(${h},${s}%,48%)`,Cd=`hsl(${h},${s}%,30%)`,Cl=`hsl(${h},${s}%,70%)`,
    [sk,skd]=SK[u.sk],O='#1a1020',mt='#dfe5ea',mtd='#8a94a0',wd='#8a5a2b',lt='#4a2c17',bk='#22140c',gold='#e0b030',red='#b3312a',wh='#ece6d6',b=fr==1||fr==3?1:0,st=fr==2?1:fr==3?-1:0,atk=fr==4;
  const r=(a,bb,w,hh,c)=>{g.fillStyle=c;g.fillRect(a+1,bb+1,w,hh)};
  if(u.type=='cav'){const hc=['#8a5a2b','#5a3a1c','#c9b08a','#4a3a32'][f%4],sh='rgba(0,0,0,.28)';
    r(1,10,2,7,bk);if(atk){r(14,7,11,1,wd);r(24,7,1,1,mt)}else{r(15,-1,1,14,wd);r(15,-1,1,2,mt);r(16,1,3,2,Cl);r(16,3,2,1,C)} // lança erguida ou em riste
    [[4,b?4:5],[7,b?5:4],[14,b?5:4],[17,b?4:5]].forEach(([a,n],k)=>{r(a,16,2,n,hc);if(k%2)r(a,16,2,n,sh);r(a,15+n,2,1,bk)});
    r(3,10,16,6,hc);r(3,15,16,1,sh);r(3,10,16,1,'rgba(255,255,255,.18)');
    r(16,6,4,6,hc);r(18,4,5,4,hc);r(22,6,1,2,sh);r(18,3,1,1,hc);r(20,5,1,1,O);r(15,5,2,6,bk);r(19,7,3,1,lt);
    r(8,9,6,3,Cd);r(8,11,6,1,gold);
    r(10,10,2,5,wh);r(10,14,3,2,bk);
    r(9,5+b,5,6,C);r(13,5+b,1,6,Cd);r(9,5+b,5,1,Cl);r(13,7+b,3,2,C);r(15,8+b,1,1,sk);
    r(10,1+b,4,4,sk);r(13,2+b,1,3,skd);r(12,2+b,1,1,O);r(9,0+b,6,1,lt);r(10,-1+b,4,1,lt)}
  else if(u.type=='art'){r(1,16,2,4,wh);r(3,16,2,4,wh);r(0,20,6,1,bk);r(1,9+b,4,7,C);r(1,9+b,4,1,Cl);r(4,9+b,1,7,Cd);r(1,5+b,4,4,sk);r(4,6+b,1,3,skd);r(3,6+b,1,1,O);r(0,4+b,6,1,bk);r(1,3+b,4,1,bk);
    r(7,15,11,3,wd);r(8,10,13,5,'#4a4a52');r(8,10,13,1,'#8a8a94');r(8,14,13,1,'#2f2f36');r(20,9,2,7,'#2f2f36');r(9,14,7,7,lt);r(10,15,5,5,wd);r(12,17,1,1,bk);r(5,11+b,4,2,C);if(atk){r(22,10,3,4,'#ffd23f');r(23,11,2,2,'#fff')}}
  else{const ati=u.type=='ati';
    r(9+st,16,2,4,ati?'#6b4a2a':wh);r(13-st,16,2,4,ati?'#6b4a2a':wh);r(8+st,19,3,2,bk);r(13-st,19,3,2,bk); // passada
    if(u.ld){r(6,9+b,2,10,red);r(7,9+b,1,11,'#8c2f1f')}
    r(7,10+b,1,4,Cd);r(8,9+b,8,7,C);r(14,9+b,2,7,Cd);r(8,9+b,8,1,Cl);
    if(ati)r(8,12+b,8,1,lt);else{for(let k=0;k<5;k++)r(9+k,10+k+b,1,1,wh);r(8,15+b,8,1,lt);r(8,9+b,2,1,gold)}
    if(!u.ld){r(9,4+b,6,5,sk);r(14,5+b,1,4,skd);r(13,6+b,1,1,O);r(9,8+b,5,1,skd)}
    if(u.ld);
    else if(ati){r(7,3+b,10,1,lt);r(9,1+b,6,2,lt);r(9,2+b,6,1,'#6b4524')}
    else{r(9,1+b,6,3,bk);r(9,3+b,6,1,Cl);r(13,4+b,3,1,bk);r(15,0+b,1,3,red)}
    if(ati){r(12,12+b,11,1,wd);r(17,11+b,6,1,mtd);r(13,11+b,3,2,C);r(16,12+b,1,1,sk);if(atk){r(23,10,2,3,'#ffd23f');r(22,11,1,1,'#fff')}}
    else if(atk){r(15,10,4,2,C);r(18,10,2,2,sk);r(19,11,6,1,mt);r(18,10,1,3,gold)} // estocada
    else{r(15,10+b,2,3,C);r(16,13+b,2,1,sk);r(18,3+b,1,10,mt);r(17,13+b,3,1,gold)}
    if(u.ld)g.drawImage(fhd[f],3,0,18,19,7,b,13,13)} // comandante: cabeça grande com o rosto, cabelo e chapéu do líder
  const[o,og]=mk(26,24);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>og.drawImage(t,dx,dy));
  og.globalCompositeOperation='source-in';og.fillStyle=O;og.fillRect(0,0,26,24);og.globalCompositeOperation='source-over';og.drawImage(t,0,0);
  SPR.set(key,o);return o}
const hatch=col=>{const[c,g]=mk(9,9);g.fillStyle=col;for(let k=0;k<9;k++)g.fillRect(k,8-k,2,1);return x.createPattern(c,'repeat')};
const HATCH=[hatch('rgba(255,246,200,.75)'),hatch('rgba(255,70,50,.85)')];
