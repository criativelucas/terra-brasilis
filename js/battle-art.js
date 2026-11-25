// batalha tática: geração do campo, terrenos e sprites
function genMap(b,kind,si){ // g grama, r estrada, w água, b ponte, a vau/alagado, f mata, m serra, h morro baixo, v vila, Q quartel, c canavial, K bateria, W muralha, T torre, D portão, P praça
  const MF=si!=null?mapOf(si):{f:[]},F_=k=>MF.f.includes(k),R=seeded(strSeed((si!=null?S[si][0]:'x')+kind+GW));
    /* semente fixa: o mesmo estado dá sempre o mesmo campo */
  const T=Array.from({length:GH},()=>Array(GW).fill('g')),rnd=n=>R()*n|0,a0=A0(),wc=GW-a0-4,A=GW*GH/160,at=(c,yy)=>T[yy]?.[c];
  let y=GH>>1; // a estrada liga os dois lados e nunca é coberta: garante passagem
  for(let c=0;c<GW;c++){T[y][c]='r';if(c>1&&c<GW-2&&R()<.3){y=Math.max(3,Math.min(GH-5,y+(rnd(2)?1:-1)));
    T[y][c]='r'}}
  const wet=(yy,cc)=>{if(T[yy]?.[cc]==null)return;T[yy][cc]=T[yy][cc]=='r'||T[yy][cc]=='b'?'b':'w'};
  const zone=c=>(c>=a0-2&&c<=a0+1)||(c>=GW-a0-2&&c<=GW-a0+1)||(kind=='cerco'&&c>=wc-1); // faixas de posicionamento e a cidade murada
  const cx0=a0+3,cx1=kind=='cerco'?wc-3:GW-a0-4,rx=()=>cx0+rnd(Math.max(1,cx1-cx0+1)),mid=(cx0+cx1)>>1;
  const free=(c,yy)=>at(c,yy)=='g'&&!zone(c);
  const blob=(ch,c,yy,n,sp)=>{const q=[[c,yy]];let k=0,g=0;while(q.length&&k<n&&g++<200){const[a,bb]=q.splice(rnd(q.length),1)[0];
    if(!free(a,bb))continue;T[bb][a]=ch;k++;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{if(R()<sp)q.push([a+dx,bb+dy])})}return k};
  const river=(c0,lo,hi)=>{let c=c0;for(let yy=0;yy<GH;yy++){wet(yy,c);if(yy<GH-1&&R()<.4){c=Math.max(lo,Math.min(hi,c+(rnd(2)?1:-1)));
    wet(yy,c)}}};
  const crossings=(n,ford)=>{const ws=[];T.forEach((row,yy)=>row.forEach((t,cc)=>{if(t=='w'&&row[cc-1]=='g'&&row[cc+1]=='g'&&yy>1&&yy<GH-2)ws.push([cc,yy])}));
    const pick=()=>ws.splice(rnd(ws.length),1)[0];for(let k=0;k<n&&ws.length;k++){const[cc,yy]=pick();
      T[yy][cc]='b'}if(ford&&ws.length){const[cc,yy]=pick();T[yy][cc]='a'}};
  // ---- água: rio, ilhas e canais, baía, litoral, lagoas, pantanal ----
  if(kind!='cerco'&&(kind=='travessia'||F_('rio')||b.river&&!F_('baia'))){river(mid-1+rnd(3),mid-4,mid+3);
    crossings(GH>16?2:1,kind=='travessia')}
  if(F_('ilhas')&&kind!='cerco'){river(cx0+2+rnd(2),cx0+1,cx0+4);river(cx1-2-rnd(2),cx1-4,cx1-1);crossings(2,true);
    crossings(1,true)} // dois canais: ilha no meio
  if(F_('litoral')){for(let c=0;c<GW;c++){wet(GH-1,c);if(c%7!=3)wet(GH-2,c)} // mar no sul do campo, com uma bateria do lado de quem defende
    const kx=GW-a0-3,ky=GH-3;if(T[ky]?.[kx]=='g')T[ky][kx]='K';else if(T[ky-1]?.[kx]=='g')T[ky-1][kx]='K'}
  if(F_('baia')){const ecx=mid+2,ecy=GH-1,erx=Math.max(4,(cx1-cx0)*.45),ery=GH*.32; // baía: um bolsão de água no sul, com uma ilhota
    for(let yy=0;yy<GH;yy++)for(let c=0;c<GW;c++){if(zone(c))continue;const d=((c-ecx)/erx)**2+((yy-ecy)/ery)**2;
      if(d<1)wet(yy,c)}
    const ix0=ecx+rnd(3)-1,iy0=GH-3;if(T[iy0]?.[ix0]=='w'){T[iy0][ix0]='h';if(T[iy0][ix0+1]=='w')T[iy0][ix0+1]='f'}}
  if(F_('lagoas'))for(let k=0;k<4+rnd(3);k++)blob('w',rx(),1+rnd(GH-2),3+rnd(4),.6);
  if(F_('pantanal'))for(let k=0;k<8+rnd(5);k++)blob('a',rx(),rnd(GH),3+rnd(5),.55); // alagados
  // ---- relevo: serra com desfiladeiros, chapadas ----
  if(F_('serra')){const sc=mid+rnd(3)-1,ry=[...T.keys()].find(yy=>T[yy][sc]=='r'),pz=new Set([2+rnd(3),GH-3-rnd(3),(GH>>1)+(rnd(2)?3:-3)]);
    /* uma serra de ponta a ponta; passa pela estrada e por três desfiladeiros */
    for(let yy=0;yy<GH;yy++){const c=sc+((yy>>2)%2);if(T[yy][c]!='g')continue;T[yy][c]=pz.has(yy)?'h':'m';
      if(T[yy][c+1]=='g'&&R()<.35)T[yy][c+1]='m'}
    if(ry!=null){T[ry][sc]='r';T[ry][sc+1]=T[ry][sc+1]=='m'?'r':T[ry][sc+1]}}
  if(F_('chapada'))for(let k=0;k<3;k++){const c=rx(),yy=1+rnd(GH-4),w=2+rnd(3),h=2+rnd(2);for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++)if(free(c+dx,yy+dy))T[yy+dy][c+dx]='m';
    for(let dy=-1;dy<=h;dy++)for(let dx=-1;dx<=w;dx++)if(free(c+dx,yy+dy)&&R()<.5)T[yy+dy][c+dx]='h'}
  // ---- cerco: muralha com torres, dois portões e casario por dentro ----
  if(kind=='cerco'){let gy=-1;const pg=y<GH/2?GH-4:3; // portão principal na estrada e um portão menor longe dela
    for(let yy=0;yy<GH;yy++){if(T[yy][wc]=='r'&&gy<0){gy=yy;T[yy][wc]='D'}else if(yy==pg)T[yy][wc]='D';
      else T[yy][wc]=(yy%4==1)?'T':'W'}
    T[gy][wc+2]='P';for(let c=wc+1;c<GW;c++)for(let yy=0;yy<GH;yy++)if(T[yy][c]=='g'&&(c+yy)%3==0&&Math.abs(yy-gy)>1&&R()<.5)T[yy][c]='v'} // casario
  // ---- campo: vilas, quartéis, montanhas, matas, canaviais, morros ----
  const roadY=c=>{for(let yy=0;yy<GH;yy++)if(T[yy][c]=='r')return yy;return GH>>1};
  const nv=(GW>=27?3:2+rnd(2))+(F_('cidade')?2:0)+(F_('minas')?1:0);
  for(let k=0;k<nv;k++){const c=Math.round(cx0+(cx1-cx0)*(k+.5)/nv)+rnd(3)-1,r0=roadY(c),up=rnd(2)?1:-1,vy=Math.max(1,Math.min(GH-3,r0+up*(2+rnd(3)))); // vilarejos: 2 ou 3 casas juntas, ligadas à estrada
    for(let yy=r0+up;yy!=vy+up;yy+=up){if(T[yy]?.[c]!='g')break;T[yy][c]='r'}const ok=blob('v',c+1,vy,2+rnd(2)+(F_('cidade')?1:0),.9)||blob('v',c-1,vy,2,.9);
    if(F_('minas')&&ok)[[0,-1],[2,-1],[0,1],[2,1]].forEach(([dx,dy])=>{if(free(c+dx,vy+dy))T[vy+dy][c+dx]='h'})} // vilas mineiras no alto dos morros
  if(F_('palafitas'))T.forEach((row,yy)=>row.forEach((t,c)=>{if(t=='w'&&R()<.08&&free(c+1,yy))T[yy][c+1]='v'}));
  for(let k=0,n=kind=='cerco'?0:GW>=27?2:1;k<n;k++){const c=rx(),yy=k%2?1+rnd(2):GH-3-rnd(2);blob('Q',c,yy,1,1)} // quartel no flanco
  let M=Math.round(b.m*1.3*Math.sqrt(A)*(kind=='emboscada'?.5:1)*(F_('pampa')||F_('cerrado')?.4:F_('minas')?1.1:F_('serra')?.8:1)*(kind=='cerco'?.6:1)),g=0; // cordilheiras: linhas tortas de serra com passagens
  while(M>0&&g++<40){let c=rx(),yy=rnd(GH);const dx=rnd(2)?1:-1,dy=rnd(2)?1:-1;for(let k=0,n=4+rnd(5);k<n&&M>0;k++){if(free(c,yy)&&k%4!=3){T[yy][c]='m';
    M--}if(rnd(3))c+=dx;else yy+=dy}}
  T.forEach((row,yy)=>row.forEach((t,c)=>{if(t=='m')[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{if(free(c+dx,yy+dy)&&R()<.12)T[yy+dy][c+dx]='h'})})); // sopé de morros
  const fm=F_('selva')?1.6:F_('mata')?1.3:F_('araucaria')?1.2:F_('pampa')?.3:F_('cerrado')||F_('caatinga')?.7:F_('pantanal')?.5:1,spread=F_('cerrado')||F_('caatinga')?.25:.55;
  let Fn=Math.round((b.f*1.3*fm+(kind=='emboscada'?40:0))*A);g=0;while(Fn>0&&g++<120)Fn-=blob('f',rnd(GW),rnd(GH),Math.min(Fn,spread<.4?1+rnd(2):3+rnd(7)),spread); // matas: faixas fechadas ou árvores ralas
  if(F_('canavial'))for(let k=0;k<4+rnd(3);k++){const c=rx(),yy=rnd(GH-2),w=2+rnd(3),h=2+rnd(2);for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++)if(free(c+dx,yy+dy))T[yy+dy][c+dx]='c'} // canaviais em talhões
  for(let k=0,n=Math.round((kind=='emboscada'?2:F_('pampa')?9:4)*Math.sqrt(A)),tr=0;k<n&&tr<300;tr++){const c=rx(),yy=rnd(GH);
    if(free(c,yy)){T[yy][c]='h';k++}} // morros baixos; coxilhas no pampa
  return T}
function tree(q,st,a,b,h){ // q aceita meia unidade: dá para desenhar detalhes finos
  if(st=='cactus'){const G='#3f8f4f',Gd='#2a6a38',Gl='#7fcf7f'; // mandacaru: braços em candelabro, costelas claras, flor no topo
    q(a+2,b+9,4,.5,'rgba(0,0,0,.25)');q(a+3,b+1,2,8,G);q(a+3,b+1,.5,8,Gl);q(a+4.5,b+1,.5,8,Gd);
    q(a+1,b+3,1,3,G);q(a+1,b+5.5,2,1,G);q(a+1,b+3,.5,3,Gl);q(a+6,b+2,1,4,G);q(a+5,b+5,1.5,1,G);q(a+6.5,b+2,.5,4,Gd);
    q(a+3.5,b,1,1,'#f6c9d0');q(a+3.75,b+.25,.5,.5,'#fff');return}
  q(a,b+9.5,8,.75,'rgba(0,0,0,.22)'); // sombra no chão
  if(st=='pine'){ // araucária: tronco alto e copa em taça, em andares
    q(a+3.5,b+2,1,8,'#5a3a1c');q(a+3.5,b+2,.5,8,'#7a5030');
    q(a,b+1,8,1.5,'#1f5136');q(a+.5,b,7,1,'#2f7048');q(a+1,b-.5,6,.5,'#3f8a58');q(a+1.5,b-.5,2,.5,'#6fb07a');
    q(a+1,b+3,6,1,'#1f5136');q(a+1.5,b+2.5,5,.5,'#3f8a58');q(a+2,b+5,4,.75,'#1f5136');q(a+2.5,b+4.5,3,.5,'#2f7048');
      return}
  if(st=='twist'){const ipe=h%3==0,[d,m,l]=ipe?['#c08a12','#e0ac1f','#f7d34a']:['#4f6a1c','#6f8a2c','#93ad3f']; // cerrado: tronco torto, copa rala; um em três é ipê
    q(a+3,b+4,1,6,'#4a2c17');q(a+3.5,b+4,.5,6,'#6b4524');q(a+4,b+5,2,1,'#4a2c17');q(a+2,b+6,1,.75,'#4a2c17');
    q(a+1,b+1,6,3,d);q(a+1.5,b+.5,5,2.5,m);q(a+2,b,3,1.5,l);q(a+5,b+4,2,2,d);q(a+5.5,b+4,1,1,m);q(a+2.5,b+.5,1,.5,'rgba(255,255,255,.4)');
      return}
  const[d,m,l]=st=='jungle'?['#12502c','#1f8040','#52b855']:h%3==0?['#a8481a','#e0862a','#f8bc50']:['#1f6a2c','#34a03c','#74d05c'];
  q(a+3,b+6,2,4,'#5a3a1c');q(a+3,b+6,.5,4,'#7a5030');q(a+4.5,b+6,.5,4,'#3a2413');q(a+2.5,b+9.5,3,.5,'#3a2413'); // tronco com luz e raízes
  q(a,b+1.5,8,4.5,d);q(a+.5,b+.5,7,6,d);q(a+1,b,6,6.5,d); // copa: massa escura
  q(a+.5,b+1,6,4,m);q(a+1,b+.5,5,4,m); // tom médio
  q(a+1.5,b+1,3,2,l);q(a+1,b+2,1,1,l);q(a+5,b+3,1.5,1,l);q(a+2,b+.5,1.5,.5,'rgba(255,255,255,.3)'); // luz de noroeste
  q(a+6,b+4,1.5,1.5,'rgba(0,0,0,.18)');q(a+1,b+5,2,1,'rgba(0,0,0,.15)'); // sombra interna
  for(let k=0;k<4;k++){const v=hash(h+k,a*3+b|0);q(a+1+v%5,b+1+(v>>4)%4,.5,.5,k%2?l:d)}} // folhas soltas
function tile(g,T,c,y,b){
  const t=T[y][c],h=hash(c,y),X=c*CS,Y=y*CS,U=CS/18,q=(a,bb,w,hh,col)=>{g.fillStyle=col;g.fillRect(Math.round(X+a*U),Math.round(Y+bb*U),Math.max(1,Math.round(w*U)),Math.max(1,Math.round(hh*U)))};
  const at=(dx,dy)=>T[y+dy]?.[c+dx],road=v=>v=='r'||v=='b',wet=v=>v=='w'||v=='b'||v=='a';
  // grama: xadrez suave, luz no alto da casa, tufos em 3 tons, pedrinhas e flores
  q(0,0,18,18,b.g[(c+y)%2]);q(0,0,18,2,'rgba(255,255,255,.05)');q(0,16,18,2,'rgba(0,0,0,.05)');
  for(let k=0;k<7;k++){const v=hash(c*7+k,y*13+k),tx=v%16,ty=(v>>>4)%16;q(tx,ty+1,1,.5,b.gd);q(tx+.5,ty,.5,1,b.gl);
    q(tx+1,ty+.5,.5,.5,b.gd)}
  if(h%5==0){const px_=2+h%12,py=3+(h>>5)%11;q(px_,py,1.5,1,'#8d877b');q(px_,py,1,.5,'#c9c4b8')}
  if(h%4==0){const fx_=3+h%11,fy=4+(h>>5)%10;q(fx_,fy,1,1,'#fff');q(fx_+.25,fy+.25,.5,.5,'#ffd23f');q(fx_+4,fy+3,1,1,'#ff8fa3');
    q(fx_+4.25,fy+3.25,.5,.5,'#fff')}
  if(t=='r'){const d='#c79a5e',e='#a97f47',hz=c==0||c==GW-1||road(at(-1,0))||road(at(1,0)); // estrada de terra com borda, sulcos e cascalho
    q(3,3,12,12,e);q(3.5,3.5,11,11,d);
    if(c==0||road(at(-1,0))){q(0,4,3.5,10,e);q(0,4.5,3.5,9,d)}if(c==GW-1||road(at(1,0))){q(14.5,4,3.5,10,e);
      q(14.5,4.5,3.5,9,d)}
    if(road(at(0,-1))){q(4,0,10,3.5,e);q(4.5,0,9,3.5,d)}if(road(at(0,1))){q(4,14.5,10,3.5,e);q(4.5,14.5,9,3.5,d)}
    if(hz){q(0,7,18,.5,'#b58a52');q(0,11,18,.5,'#b58a52')}else{q(7,0,.5,18,'#b58a52');q(11,0,.5,18,'#b58a52')}
    for(let k=0;k<4;k++){const v=hash(c+k*5,y+k*3);q(4+v%10,5+(v>>4)%8,.5,.5,k%2?'#e3c08a':'#8a6a3a')}}
  if(wet(t)){q(0,0,18,18,'#2f7fc4');q(2,2,14,14,'#2a72b5');q(4,4,10,10,'#2668a8'); // água: mais funda no meio
    q(3+h%6,4+(h>>3)%4,3,.5,'rgba(255,255,255,.35)');q(9+(h>>5)%5,10+(h>>7)%4,2,.5,'rgba(255,255,255,.25)');
      q(5+(h>>9)%6,13,1.5,.5,'rgba(255,255,255,.2)'); // reflexos
    const dry=v=>v&&!wet(v),sand='#e3cf94',foam='#e6f4fb';
    if(dry(at(0,-1))){q(0,0,18,1,sand);q(0,1,18,.5,foam)}if(dry(at(0,1))){q(0,17,18,1,sand);q(0,16.5,18,.5,foam)}
    if(dry(at(-1,0))){q(0,0,1,18,sand);q(1,0,.5,18,foam)}if(dry(at(1,0))){q(17,0,1,18,sand);q(16.5,0,.5,18,foam)}}
  if(t=='a'){q(0,0,18,18,'rgba(170,225,255,.35)');[[3,4],[9,8],[13,3],[5,12],[12,13]].forEach(([a,c2])=>{q(a,c2,2.5,2,'#8d877b');q(a,c2,2.5,.5,'#c9c4b8')})} // vau: raso, com pedras
  if(t=='h'){q(2,13,15,2,'rgba(0,0,0,.18)');q(2,8,14,6,b.gd);q(4,5,10,4,b.gd);q(3,8,12,5,b.gl);q(5,5.5,8,3,b.gl);
    q(6,5.5,4,1,'rgba(255,255,255,.35)');q(11,8,3,5,'rgba(0,0,0,.12)')} // morro baixo
  if(t=='W'||t=='D'||t=='T'||t=='L'){const top=t=='T'?0:3; /* muralha com volume: topo claro com ameias, face de pedra, sombra à direita */
    q(0,top,18,18-top,'#8a8070');for(let r=top+4;r<18;r+=4)for(let k=(r/4%2)*3-3;k<18;k+=6){q(Math.max(0,k),r,5.5,3.5,'#a89c88');
      q(Math.max(0,k),r,5.5,.5,'#c9bea8')}
    q(0,top,18,4,'#b8ad98');q(0,top,18,.75,'#ddd2bb');for(let k=0;k<18;k+=4.5)q(k,top-1.5,2.5,2,'#b8ad98'); // ameias
    q(15,top,3,18-top,'rgba(0,0,0,.22)');q(0,17,18,1,'rgba(0,0,0,.25)');
    if(t=='T'){q(2,1,14,3,'#6a6050');q(3,5,4,3,'#22140c');q(11,5,4,3,'#22140c');q(8.5,-1,1,3,'#3a2413');
      q(9.5,-1,4,2,'#b3312a')} // torre: seteiras e bandeira
    if(t=='D'){q(4,6,10,12,'#3a2413');q(5,7,8,11,'#5a3a1c');for(let k=5;k<13;k+=2.5)q(k,7,.5,11,'#3a2413');
      q(4,10,10,1,'#2f2f36');q(4,14,10,1,'#2f2f36')}
    if(t=='L'){for(let k=1;k<18;k+=3.5)q(5.5,k,7,1,'#c99a5c');q(5,0,1.5,18,'#7a4f26');q(11.5,0,1.5,18,'#7a4f26')}} // escada encostada
  if(t=='R'){q(1,6,16,11,'#8d877b');[[2,8,5,3],[8,7,6,4],[4,12,7,3],[11,12,5,4],[1,14,4,2]].forEach(([a,c2,w,hh])=>{q(a,c2,w,hh,'#a89c88');q(a,c2,w,.5,'#c9bea8');q(a+w-1,c2,1,hh,'rgba(0,0,0,.2)')})} // brecha: escombros
  if(t=='c'){for(let k=0;k<18;k+=3){q(k+1,2,1,15,'#6f9a2a');q(k+1.5,1,1,6,'#9fc84a');q(k+.5,7,2,.5,'#c8e070')}q(0,16,18,2,'rgba(60,40,10,.25)')} // canavial em fileiras
  if(t=='K'){q(1,5,16,12,'#8d877b');q(1,5,16,1,'#c9bea8');q(4,7,10,3,'#2f2f36');q(12,7.5,4,2,'#1a1a20');
    q(5,10,3,3,'#5a3a1c');q(10,10,3,3,'#5a3a1c');q(1,16,16,1,'rgba(0,0,0,.25)')} // bateria costeira
  if(t=='P'){q(1,1,16,16,'#b8ab90');for(let r=1;r<17;r+=3)for(let k=1+(r%2)*1.5;k<17;k+=3){q(k,r,2.5,2.5,'#cfc3a6');
    q(k,r,2.5,.5,'#e6dcc2')}q(1,1,16,16,'rgba(255,220,120,.08)')} // praça de pedra
  if(t=='b'){q(0,4,18,10,'rgba(0,0,0,.25)'); // ponte: tábuas com luz, corrimão e postes
    q(0,3,18,11,'#9a6a36');for(let k=0;k<18;k+=3){q(k,3,.5,11,'#6b4524');q(k+.5,3,2,.5,'#c99a5c')}
    q(0,2,18,1,'#5a3a1c');q(0,2,18,.5,'#8a5a2b');q(0,14,18,1,'#5a3a1c');
    for(let k=1;k<18;k+=6){q(k,1,1,2,'#4a2c17');q(k,14,1,2.5,'#4a2c17')}}
  if(t=='m'){const[l,d,top]=b.mc;q(1,16,16,1,'rgba(0,0,0,.25)');
    if(b.mesa){q(2,6,14,10,d);q(2,6,7,10,l);for(let k=8;k<16;k+=2.5)q(2,k,14,.5,'rgba(0,0,0,.14)'); // chapada em camadas
      q(1,4,16,3,top);q(1,4,16,.5,'rgba(255,255,255,.3)');q(1,6.5,16,.5,'rgba(0,0,0,.2)');q(5,8,.5,6,'rgba(0,0,0,.2)');
        q(11,9,.5,6,'rgba(0,0,0,.2)');q(3,9,1,.5,'rgba(255,255,255,.2)')}
    else[[9,2,13],[4,7,8]].forEach(([cx_,ty,n])=>{for(let k=0;k<n;k++){const w=1+k;q(cx_-w,ty+k,w,1,l);q(cx_,ty+k,w,1,d)} // pico: face clara e face escura
      q(cx_-1,ty+3,.5,n-4,'rgba(0,0,0,.18)');q(cx_+2,ty+5,.5,n-6,'rgba(0,0,0,.2)');q(cx_-3,ty+n-3,1,.5,'rgba(255,255,255,.2)'); // veios na rocha
      q(cx_-2,ty+1,2,2,top);q(cx_-1,ty,1,1,top);q(cx_,ty+1,1.5,1.5,'rgba(255,255,255,.6)')})}
  if(t=='Q'){q(1,15,16,1.5,'rgba(0,0,0,.25)');q(2,7,14,8,'#b8ab90');q(2,7,14,.5,'#e6dcc2');q(13,7,3,8,'#9a8e74'); // quartel: paredes de pedra, telhado vermelho, portão e mastro
    for(let k=8.5;k<15;k+=2)q(2,k,11,.5,'rgba(0,0,0,.08)');q(1,4,16,3,'#b3412f');q(1,4,16,.5,'#e0705a');
      q(1,6.5,16,.5,'#7a2a1f');
    q(7,10,4,5,'#3a2413');q(7.5,10.5,3,4.5,'#22140c');q(3.5,9,2,2,'#3a2413');q(12.5,9,2,2,'#3a2413');
      q(3.75,9.25,1.5,1.5,'#ffe27a');q(15,0,.75,4,'#3a2413')}
  if(t=='v'){q(2,14,15,1,'rgba(0,0,0,.22)'); // vila: casa com telhas, janela acesa, porta e chaminé; casinha ao lado
    q(3,8,8,6,'#efe2c0');q(9,8,2,6,'#cdbd95');q(3,8,8,.5,'rgba(255,255,255,.3)');
    q(2,5,10,3,'#2a9db0');for(let k=5.5;k<8;k+=1)q(2,k,10,.5,'#1f7385');q(3,4,8,1,'#52c8d6');q(3,4,8,.5,'#9fe6ee');
    q(9,2.5,1.5,2,'#8a6a3c');q(9,2.5,1.5,.5,'#a98a5a');
    q(6,11,2,3,'#5a3a1c');q(7.5,12.5,.5,.5,'#ffd23f');q(3.75,9.5,1.5,1.5,'#3a2413');q(4,9.75,1,1,'#ffe27a');
    q(11,11,5,4,'#efe2c0');q(15,11,1,4,'#cdbd95');q(10,9,7,2,'#2a9db0');q(10,9,7,.5,'#52c8d6');q(10,10.5,7,.5,'#1f7385');
      q(13,13,1,2,'#5a3a1c');
    q(1,15,.5,2,'#8a5a2b');q(4,15,.5,2,'#8a5a2b');q(1,15.5,3.5,.5,'#8a5a2b')}}
// sprites 52x48 (base em blocos de 2 px e detalhes de 1 px) com contorno; quadros: 0-1 parado, 2-3 andando, 4 golpe; cacheados por tipo, facção e pele
const rgb2hsl=(r,g,b)=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2,d=M-m;
  if(!d)return[0,0,l];
  return[(M==r?(g-b)/d+(g<b?6:0):M==g?(b-r)/d+2:(r-g)/d+4)/6,d/(1-Math.abs(2*l-1)),l]};
const hsl2rgb=(h,s,l)=>{const a=s*Math.min(l,1-l),f=n=>{const k=(n+h*12)%12;return 255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))};
  return[f(0),f(8),f(4)]};
const SPR=new Map,CUSTOM={units:{}}; // CUSTOM: folhas de sprite carregadas de assets/sprites.json (js/assets.js)
function sprite(u,f,mine,fr){
  const key=[u.type,f,mine,u.ld,u.sk,fr].join();if(SPR.has(key))return SPR.get(key);
  const cu=CUSTOM.units[u.ld?'ld':u.type]||CUSTOM.units[u.type];
  if(cu){const n=cu.frames,T=cu.tags,i=fr<0?-1-fr:T?{0:T.parado[0],1:T.parado[0]+1,2:T.andar[0],3:T.andar[0]+2,4:T.golpe[0]+2}[fr]??T.parado[0]:(n>=5?[0,4,1,2,3]:n>=4?[0,0,1,2,3]:[])[fr]??Math.abs(fr)%n,fw=cu.im.width/n,ih=cu.im.height,[c,g]=mk(fw,ih);
    g.drawImage(cu.im,i*fw,0,fw,ih,0,0,fw,ih); // folha de 4: parado, passo A, passo B, golpe
    const d=g.getImageData(0,0,fw,ih),p=d.data,H=hue(f)/360,Sa=mine?.78:.52;
    for(let k=0;k<p.length;k+=4){if(!p[k+3])continue;const[hh,ss,ll]=rgb2hsl(p[k],p[k+1],p[k+2]);if(hh>.53&&hh<.74&&ss>.3){const q=hsl2rgb(H,Sa*Math.min(1,ss+.2),ll);
      p[k]=q[0];p[k+1]=q[1];p[k+2]=q[2]}}
    g.putImageData(d,0,0);if(u.ld&&fhd[f]){g.clearRect(10,0,22,18);g.drawImage(fhd[f],6,0,36,38,10,-3,28,30)} // comandante: rosto, cabelo e chapéu do líder
    SPR.set(key,c);return c}
  const[t,g]=mk(52,48),h=hue(f),s=mine?78:52,C=`hsl(${h},${s}%,48%)`,Cd=`hsl(${h},${s}%,30%)`,Cl=`hsl(${h},${s}%,70%)`,
    [sk,skd]=SK[u.sk],O='#1a1020',mt='#dfe5ea',mtd='#8a94a0',wd='#8a5a2b',lt='#4a2c17',bk='#22140c',gold='#e0b030',red='#b3312a',wh='#ece6d6',b=fr==1||fr==3?1:0,st=fr==2?1:fr==3?-1:0,atk=fr==4;
  const r=(a,bb,w,hh,c)=>{g.fillStyle=c;g.fillRect((a+1)*2,(bb+1)*2,w*2,hh*2)}, // desenho base em blocos de 2 px
    p=(a,bb,c,w=1,hh=1)=>{g.fillStyle=c;g.fillRect(Math.round(a*2+2),Math.round(bb*2+2),w,hh)}; // detalhe de 1 px (16-bit)
  if(u.type=='cav'){const hc=['#8a5a2b','#5a3a1c','#c9b08a','#4a3a32'][f%4],sh='rgba(0,0,0,.28)';
    r(1,10,2,7,bk);if(atk){r(14,7,11,1,wd);r(24,7,1,1,mt)}else{r(15,-1,1,14,wd);r(15,-1,1,2,mt);r(16,1,3,2,Cl);
      r(16,3,2,1,C)} // lança erguida ou em riste
    [[4,b?4:5],[7,b?5:4],[14,b?5:4],[17,b?4:5]].forEach(([a,n],k)=>{r(a,16,2,n,hc);if(k%2)r(a,16,2,n,sh);r(a,15+n,2,1,bk)});
    r(3,10,16,6,hc);r(3,15,16,1,sh);r(3,10,16,1,'rgba(255,255,255,.18)');
    r(16,6,4,6,hc);r(18,4,5,4,hc);r(22,6,1,2,sh);r(18,3,1,1,hc);r(20,5,1,1,O);r(15,5,2,6,bk);r(19,7,3,1,lt);
    r(8,9,6,3,Cd);r(8,11,6,1,gold);
    r(10,10,2,5,wh);r(10,14,3,2,bk);
    r(9,5+b,5,6,C);r(13,5+b,1,6,Cd);r(9,5+b,5,1,Cl);r(13,7+b,3,2,C);r(15,8+b,1,1,sk);
    r(10,1+b,4,4,sk);r(13,2+b,1,3,skd);r(12,2+b,1,1,O);r(9,0+b,6,1,lt);r(10,-1+b,4,1,lt)}
  else if(u.type=='art'){r(1,16,2,4,wh);r(3,16,2,4,wh);r(0,20,6,1,bk);r(1,9+b,4,7,C);r(1,9+b,4,1,Cl);
    r(4,9+b,1,7,Cd);r(1,5+b,4,4,sk);r(4,6+b,1,3,skd);r(3,6+b,1,1,O);r(0,4+b,6,1,bk);r(1,3+b,4,1,bk);
    r(7,15,11,3,wd);r(8,10,13,5,'#4a4a52');r(8,10,13,1,'#8a8a94');r(8,14,13,1,'#2f2f36');r(20,9,2,7,'#2f2f36');
      r(9,14,7,7,lt);r(10,15,5,5,wd);r(12,17,1,1,bk);r(5,11+b,4,2,C);if(atk){r(22,10,3,4,'#ffd23f');r(23,11,2,2,'#fff')}}
  else{const ati=u.type=='ati';
    r(9+st,16,2,4,ati?'#6b4a2a':wh);r(13-st,16,2,4,ati?'#6b4a2a':wh);r(8+st,19,3,2,bk);r(13-st,19,3,2,bk); // passada
    if(u.ld){r(6,9+b,2,10,red);r(7,9+b,1,11,'#8c2f1f')}
    r(7,10+b,1,4,Cd);r(8,9+b,8,7,C);r(14,9+b,2,7,Cd);r(8,9+b,8,1,Cl);
    if(ati)r(8,12+b,8,1,lt);else{for(let k=0;k<5;k++)r(9+k,10+k+b,1,1,wh);r(8,15+b,8,1,lt);r(8,9+b,2,1,gold)}
    if(!u.ld){r(9,4+b,6,5,sk);r(14,5+b,1,4,skd);r(13,6+b,1,1,O);r(9,8+b,5,1,skd)}
    if(u.ld);
    else if(ati){r(7,3+b,10,1,lt);r(9,1+b,6,2,lt);r(9,2+b,6,1,'#6b4524')}
    else{r(9,1+b,6,3,bk);r(9,3+b,6,1,Cl);r(13,4+b,3,1,bk);r(15,0+b,1,3,red)}
    if(ati){r(12,12+b,11,1,wd);r(17,11+b,6,1,mtd);r(13,11+b,3,2,C);r(16,12+b,1,1,sk);if(atk){r(23,10,2,3,'#ffd23f');
      r(22,11,1,1,'#fff')}}
    else if(atk){r(15,10,4,2,C);r(18,10,2,2,sk);r(19,11,6,1,mt);r(18,10,1,3,gold)} // estocada
    else{r(15,10+b,2,3,C);r(16,13+b,2,1,sk);r(18,3+b,1,10,mt);r(17,13+b,3,1,gold)}
    if(u.ld)g.drawImage(fhd[f],6,0,36,38,14,b*2,26,26)} // comandante: cabeça grande com o rosto, cabelo e chapéu do líder
  if(u.type=='inf'||u.type=='ati'){p(8,9+b,Cl,1,14);p(11.5,11+b,gold,2,2);p(11.5,13.5+b,gold,2,2);p(8+st,20,'#7a6a5a',4,1);
    p(13-st,20,'#7a6a5a',4,1); // brilho do casaco, botões, bota
    if(!u.ld){p(12,5+b,'#3a2413',3,1);p(11.5,7.5+b,'#9a4a3a',3,1);p(10,7+b,'rgba(230,90,70,.4)',2,2);
      p(9.5,4+b,'rgba(255,255,255,.3)',5,1)} // sobrancelha, boca, bochecha, testa
    if(u.type=='inf'&&!atk&&!u.ld)p(18,3+b,'#ffffff',1,20);if(u.type=='inf'&&!u.ld)p(9,1+b,'rgba(255,255,255,.25)',10,1); // fio da espada, brilho da barretina
    if(u.type=='ati')p(17,11+b,'#c8d0d8',12,1)}
  if(u.type=='cav'){p(20.5,5,'#fff');p(22.5,7,'#2a1a10');p(4,10,'rgba(255,255,255,.25)',30,1);p(11.5,4+b,'#9a4a3a',3,1);
    p(9,5+b,Cl,1,12);p(15.5,5,'rgba(255,255,255,.2)',1,12);p(8.5,9,'#ffd23f',2,2)}
  if(u.type=='art'){p(8,10,'#c8c8d4',26,1);p(12,15,'#3a2413',2,10);p(10,17,'#3a2413',10,2);p(1,9+b,Cl,1,14)}
  const[o,og]=mk(52,48);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>og.drawImage(t,dx,dy)); // contorno fino de 1 px
  og.globalCompositeOperation='source-in';og.fillStyle=O;og.fillRect(0,0,52,48);og.globalCompositeOperation='source-over';
    og.drawImage(t,0,0);
  SPR.set(key,o);return o}
// animações do Aseprite: etiqueta + tempo decorrido viram o quadro da folha (negativo = índice direto); sem etiquetas, usa o quadro antigo fb
const cuOf=u=>CUSTOM.units[u.ld?'ld':u.type]||CUSTOM.units[u.type];
const animLen=(u,st)=>{const cu=cuOf(u),T=cu?.tags?.[st];return T?cu.dur.slice(T[0],T[1]+1).reduce((s,v)=>s+v,0):0};
function animFr(u,st,ms,fb){const cu=cuOf(u),T=cu?.tags?.[st];if(!T)return fb;
  const[a,b]=T,tot=animLen(u,st);let t=st=='parado'||st=='andar'?((ms%tot)+tot)%tot:Math.max(0,Math.min(ms,tot-1));
  for(let i=a;i<=b;i++){t-=cu.dur[i];if(t<0)return -1-i}return -1-b}
const hatch=col=>{const[c,g]=mk(9,9);g.fillStyle=col;for(let k=0;k<9;k++)g.fillRect(k,8-k,2,1);return x.createPattern(c,'repeat')};
const HATCH=[hatch('rgba(255,246,200,.75)'),hatch('rgba(255,70,50,.85)')];
