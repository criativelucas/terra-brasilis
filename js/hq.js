// quartel-general: maquete isométrica, salas e menus
// ---------- quartel-general: maquete isométrica em 405x305, ampliada 2x ----------
const[hqc,hg]=mk(405,305),IS=13,IH=6.5,ZS=1.6,HX=202,HY=124;
const iso=(a,b,z=0)=>[HX+(a-b)*IS,HY+(a+b)*IH-z*ZS];
const poly=(g,pts,col)=>{g.fillStyle=col;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.fill()};
function ibox(g,a,b,z,w,d,h,top,left,right){ // caixa com canto de trás em (a,b): w ao longo de a, d ao longo de b, h de altura
  const A=iso(a,b+d,z),Bp=iso(a+w,b+d,z),Cc=iso(a+w,b,z),At=iso(a,b+d,z+h),Bt=iso(a+w,b+d,z+h),Ct=iso(a+w,b,z+h),Dt=iso(a,b,z+h);
  poly(g,[At,Bt,Bp,A],left);poly(g,[Bt,Ct,Cc,Bp],right);poly(g,[Dt,Ct,Bt,At],top)}
const WOOD=['#9a6a36','#7a4f26','#5f3c1c'],STONE=['#b9b3a6','#8d877b','#757066'],TEAL=['#52c8d6','#2a9db0','#1f7385'];
const ROOMS=[{k:'war',n:'Sala de Guerra',s:'Estratégias',a:0,b:0,fl:['#a8743c','#96652f']},{k:'gen',n:'Salão dos Generais',s:'Generais',a:6,b:0,fl:['#b23a30','#a5332a']},
  {k:'bar',n:'Quartel',s:'Unidades',a:0,b:6,fl:['#a39d90','#8f897e']},{k:'tes',n:'Tesouraria',s:'Recursos',a:6,b:6,fl:['#ecd9a8','#d9a83c']}];
// pontos clicáveis: as quatro salas, a torre (campanha) e o portão (volta ao mapa)
const SPOTS=[...ROOMS.map(R=>({k:R.k,n:R.n,s:R.s,at:[R.a+3,R.b+3,3],up:60})),{k:'dip',n:'Chancelaria',s:'Diplomacia',at:[10.9,2.4,3],up:46},{k:'cam',n:'Torre de Vigia',s:'Campanha',at:[-.3,-.3,40],up:8},{k:'gate',n:'Portão',s:'Voltar ao mapa',at:[14.4,6,0],up:44}];
function itree(g,a,b,k){const[sx,sy]=iso(a,b),[d,m,l]=k%3?['#a8481a','#e0862a','#f8bc50']:['#1f6a2c','#34a03c','#74d05c'],r=(X,Y,w,h,c)=>{g.fillStyle=c;g.fillRect(sx+X|0,sy+Y|0,w,h)};
  r(-11,-2,22,5,'rgba(0,0,0,.25)');r(-2,-14,4,15,'#6b3a1c');r(1,-12,1,12,'#4a2612');r(-5,-11,3,2,'#6b3a1c');
  [8,14,18,22,22,20,16,10].forEach((w,i)=>{r(-w/2,-42+i*4,w,4,d);if(i<6)r(-w/2+1,-42+i*4,w-5,3,m);if(i<3)r(-w/2+2,-42+i*4,w/2,2,l)});
  for(let i=0;i<16;i++){const v=hash(i+k,a*7+b|0);r(-9+v%18,-38+(v>>4)%24,2,1,i%2?l:d)}}
function renderHQ(){
  const g=hg,h=hue(me),fc=`hsl(${h},80%,50%)`,fd=`hsl(${h},80%,34%)`,fl=`hsl(${h},85%,70%)`,gold='#ffd23f',gd='#e0b030',gdd='#b8891f',FC=[fc,fd,fd],GOLD=[gold,gd,gdd],
    own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0),PAPER=['#f4ecd4','#d8cfb4','#c0b79c'],IRON=['#8a8f98','#5f646c','#484c53'];
  const dm=(a,b,z,col,w=1,d=1)=>poly(g,[iso(a,b,z),iso(a+w,b,z),iso(a+w,b+d,z),iso(a,b+d,z)],col);
  const pt=(onA,t,z)=>onA?iso(0,t,z):iso(t,0,z); // ponto numa das duas paredes do fundo
  const wp=(onA,t,z0,z1,w,col)=>poly(g,[pt(onA,t,z1),pt(onA,t+w,z1),pt(onA,t+w,z0),pt(onA,t,z0)],col);
  const dot=(p,dx,dy,w,hh,col)=>{g.fillStyle=col;g.fillRect(p[0]+dx|0,p[1]+dy|0,w,hh)};
  const ln=(p,q,col,w=.7)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke()};
  const ball=(p,r,col)=>{g.fillStyle=col;g.beginPath();g.arc(p[0],p[1],r,0,7);g.fill()};
  const bx=(a,b,z,w,d,hh,c)=>ibox(g,a,b,z,w,d,hh,...c);
  g.setTransform(1,0,0,1,0,0);g.fillStyle='#1d2418';g.fillRect(0,0,405,305);
  for(let a=-7;a<21;a++)for(let b=-7;b<21;b++){const p=iso(a,b),v=hash(a+9,b+9); // gramado: tufos, capim, flores, pedrinhas
    dm(a,b,0,['#8f9f2c','#84942a','#9aa934','#8a9a2a'][v%4]);
    if(v%2==0)dot(p,-5+v%9,4+v%5,3,1,'#c9c63a');if(v%3==0)dot(p,v%7-3,5+v%4,1,3,'#66791f');if(v%4==0)dot(p,3-v%8,8,2,1,'#a9b83a');
    if(v%7==0){dot(p,2,6,3,1,'#fff');dot(p,3,5,1,3,'#fff');dot(p,3,6,1,1,gold)}
    if(v%23==0){dot(p,-4,5,5,3,'#8d877b');dot(p,-3,4,3,1,'#b9b3a6')}}
  for(let k=0;k<9;k++){const v=hash(k,3);dm(12.7+k*.95,5.2+v%3*.15,0,k%2?'#cfc6b0':'#b9b09a',.8,.8);dm(12.9+k*.95,6.3+v%2*.2,0,k%2?'#b9b09a':'#d8cfba',.7,.7)}
  [[-5.5,-1],[-4.5,4],[-5,9.5],[5,-5],[10,-4]].forEach(([a,b],k)=>itree(g,a,b,k+1));
  bx(-.7,-.7,0,13.4,13.4,3,STONE);
  for(let t=0;t<13;t+=.9){ln(iso(t-.3,12.7,0),iso(t-.3,12.7,3),'rgba(0,0,0,.25)');ln(iso(12.7,t-.3,0),iso(12.7,t-.3,3),'rgba(0,0,0,.3)')}
  for(let a=0;a<12;a++)for(let b=0;b<12;b++){const R=ROOMS[(a>5)+(b>5)*2],k=R.k,v=hash(a,b); // piso de cada sala
    dm(a,b,3,R.fl[k=='war'?b%2:(a+b)%2]);
    if(k=='war'){ln(iso(a,b,3),iso(a+1,b,3),'rgba(60,30,10,.4)');if(v%2)ln(iso(a+.5,b,3),iso(a+.5,b+1,3),'rgba(60,30,10,.3)')}
    else if(k!='gen'){ln(iso(a,b,3),iso(a+1,b,3),'rgba(0,0,0,.2)');ln(iso(a,b,3),iso(a,b+1,3),'rgba(0,0,0,.2)')}
    if(v%4==0)dot(iso(a+.5,b+.5,3),-2,0,3,1,'rgba(255,255,255,.14)');if(k=='bar'&&v%7==0)ln(iso(a+.2,b+.3,3),iso(a+.7,b+.6,3),'rgba(0,0,0,.3)')}
  dm(6.5,.6,3,gd,5,5);dm(6.7,.8,3,'#8c1f1a',4.6,4.6);dm(7.1,1.2,3,gd,3.8,3.8);dm(7.25,1.35,3,'#a82a24',3.5,3.5); // tapete dos generais
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)dm(7.75+i,1.85+j,3,gd,.3,.3);
  dm(1.5,1.5,3,gd,3.7,3.7);dm(1.65,1.65,3,'#1f4a8c',3.4,3.4);dm(1.95,1.95,3,'#2a5fb0',2.8,2.8); // tapete da sala de guerra
  dm(0,0,3,'rgba(0,0,0,.22)',12,.45);dm(0,0,3,'rgba(0,0,0,.22)',.45,12);
  dm(.5,1.2,3,'rgba(255,230,140,.22)',2.4,1.6);dm(.5,10.1,3,'rgba(255,230,140,.22)',2.4,1.6); // luz das janelas no chão
  // paredes do fundo: tijolo a tijolo, enxaimel, rodapé
  wp(0,0,3,36,12,'#ecd9a8');wp(1,0,3,36,12,'#cdb888');
  for(const onA of[0,1])for(let r=0;r<8;r++){const z=5+r*4;ln(pt(onA,0,z),pt(onA,12,z),'rgba(120,80,30,.3)');
    for(let t=r%2*.4;t<12;t+=.8){ln(pt(onA,t,z),pt(onA,t,z+4),'rgba(120,80,30,.24)');const v=hash(r+onA*9,t*10|0);if(v%5==0)wp(onA,t,z,z+4,.8,v%2?'rgba(150,90,40,.2)':'rgba(255,255,255,.16)')}}
  for(const onA of[0,1]){[0,3,6,9,11.75].forEach(t=>wp(onA,t,3,36,.25,'#6b4524'));wp(onA,0,33,36,12,'#5a3a1c');wp(onA,0,3,5.5,12,'#8a6a3c')}
  const win=(onA,t)=>{wp(onA,t-.15,12,30,1.8,'#5a3a1c');wp(onA,t,14,28,1.5,'#f6d26a');wp(onA,t+.1,21.5,27,.5,'#fff3c0');wp(onA,t+.7,14,28,.1,'#5a3a1c');wp(onA,t,20.5,21.5,1.5,'#5a3a1c');
    wp(onA,t-.25,10.5,12.5,2,'#8a6a3c');for(let i=0;i<6;i++)dot(pt(onA,t+.1+i*.26,13.6),0,-1,2,2,['#e0452f','#ff8fa3','#fff'][i%3])};
  const ban=(onA,t)=>{wp(onA,t-.15,31,32,1.3,'#3a2413');wp(onA,t,13,31,1,fc);wp(onA,t,13,16,1,fd);wp(onA,t+.42,16,31,.16,fl);wp(onA,t+.3,22,25.5,.4,gold)};
  win(1,1.2);win(1,10.1);ban(1,4.5);ban(0,11);
  [6.9,8.05].forEach(t=>{wp(1,t,17,27,.9,fd);wp(1,t+.1,18,26,.7,fc);wp(1,t+.38,18,26,.14,gold);wp(1,t+.1,21.4,22.6,.7,gold)}); // escudos no quartel
  ln(pt(1,9.1,27),pt(1,9.9,17),'#dfe5ea',1.2);ln(pt(1,9.9,27),pt(1,9.1,17),'#dfe5ea',1.2);
  wp(0,3.2,13,31,2.5,'#6b4524');wp(0,3.35,14.5,29.5,2.2,'#f0dfb0'); // mapa do Brasil na parede
  {const p=iso(3.35,0,29.5);g.setTransform(1,.5,0,1,p[0],p[1]);g.fillStyle='#3fae48';g.fillRect(5,3,16,9);g.fillRect(8,12,11,5);g.fillRect(11,17,6,4);g.fillRect(3,5,3,4);
    g.fillStyle='#2f6fb0';g.fillRect(6,6,12,1);g.fillStyle='#b3312a';g.fillRect(14,10,2,2);g.fillRect(9,5,2,2);g.setTransform(1,0,0,1,0,0)}
  own.slice(0,3).forEach((i,k)=>{wp(0,6.85+k*1.5,17,32,1.25,gd);wp(0,6.95+k*1.5,18,31,1.05,'#3a2413');const p=iso(7+k*1.5,0,30.5); // retratos dos generais
    g.setTransform(1,.5,0,1,p[0],p[1]);g.drawImage(fcv[i],0,0,12,17);g.setTransform(1,0,0,1,0,0)});
  bx(-.7,-1.9,36,13.4,1.9,4,TEAL);bx(-1.9,-.7,36,1.9,13.4,4,TEAL); // telhado azul, telha a telha
  for(let t=-.5;t<12.7;t+=.5){wp(0,t,36,40,.08,'#1f7385');wp(1,t,36,40,.08,'#16596a');ln(iso(t,-1.9,40),iso(t,0,40),'rgba(0,0,0,.2)');ln(iso(-1.9,t,40),iso(0,t,40),'rgba(0,0,0,.2)')}
  ln(iso(-.7,-1.9,40),iso(12.7,-1.9,40),'#b8f0f5',1);ln(iso(-1.9,-.7,40),iso(-1.9,12.7,40),'#b8f0f5',1);
  bx(9,-1.5,40,.9,.9,9,STONE);dm(9.15,-1.35,49,'#3a3a3a',.6,.6);
  bx(-1.9,-1.9,0,3.1,3.1,44,['#ecd9a8','#d6c290','#b39d6c']); // torre de vigia
  for(let z=4;z<44;z+=4){ln(iso(-1.9,1.2,z),iso(1.2,1.2,z),'rgba(120,80,30,.3)');ln(iso(1.2,1.2,z),iso(1.2,-1.9,z),'rgba(90,60,20,.3)');
    for(let t=-1.9+(z/4%2)*.4;t<1.2;t+=.8){ln(iso(t,1.2,z),iso(t,1.2,z+4),'rgba(120,80,30,.24)');ln(iso(1.2,t,z),iso(1.2,t,z+4),'rgba(90,60,20,.24)')}}
  poly(g,[iso(-1,1.2,37),iso(0,1.2,37),iso(0,1.2,25),iso(-1,1.2,25)],'#5a3a1c');poly(g,[iso(-.85,1.2,35.5),iso(-.15,1.2,35.5),iso(-.15,1.2,26),iso(-.85,1.2,26)],'#f6d26a');
  poly(g,[iso(1.2,0,37),iso(1.2,-1,37),iso(1.2,-1,25),iso(1.2,0,25)],'#5a3a1c');poly(g,[iso(1.2,-.15,35.5),iso(1.2,-.85,35.5),iso(1.2,-.85,26),iso(1.2,-.15,26)],'#e0b84a');
  bx(-2.1,-2.1,44,3.5,3.5,2.5,['#d6c290','#cdb888','#a8935f']);
  {const ap=iso(-.35,-.35,68),L=iso(-2.5,1.8,46.5),M=iso(1.8,1.8,46.5),R=iso(1.8,-2.5,46.5);poly(g,[ap,L,M],TEAL[0]);poly(g,[ap,M,R],TEAL[1]);
    for(let k=1;k<5;k++){ln(ap,[L[0]+(M[0]-L[0])*k/5,L[1]+(M[1]-L[1])*k/5],'rgba(0,0,0,.2)');ln(ap,[M[0]+(R[0]-M[0])*k/5,M[1]+(R[1]-M[1])*k/5],'rgba(0,0,0,.25)')}
    ln(ap,M,'#b8f0f5',1);dot(ap,0,-18,1,19,'#3a2413');dot(ap,-1,-19,3,2,gold)}
  const low=(a,b,w,d)=>{bx(a,b,3,w,d,6,['#ecd9a8','#cdb888','#b39d6c']);bx(a,b,9,w,d,.8,WOOD)};
  // sala de guerra: estante, globo, mesa com o mapa, cadeiras
  bx(.4,.15,3,2.5,.7,17,WOOD);for(let r=0;r<3;r++){ln(iso(.4,.85,20-r*5.6),iso(2.9,.85,20-r*5.6),'#4a2c17',1);
    for(let i=0;i<8;i++)dot(iso(.5+i*.29,.85,19.4-r*5.6),0,0,3,7-(i+r)%3,['#b3312a','#2a5fb0','#e0b030','#2f8a4a','#7a5a8a'][(i+r*2)%5])}
  bx(5,.5,3,.5,.5,5,WOOD);ball(iso(5.25,.75,12),4.5,'#3aa0d8');dot(iso(5.25,.75,12),-3,-2,3,3,'#3fae48');dot(iso(5.25,.75,12),0,1,3,2,'#3fae48');
  bx(1.3,3.5,3,.7,.7,3.5,WOOD);bx(1.3,3.5,6.5,.15,.7,5,WOOD);
  bx(2,2,3,2.7,2.7,5.5,['#d9c596',WOOD[1],WOOD[2]]);dm(2.2,2.2,8.5,'#3aa0d8',2.3,2.3);dm(2.5,2.4,8.5,'#3fae48',1.4,1.2);dm(2.9,3.4,8.5,'#3fae48',.9,.8);dm(3.6,2.6,8.5,'#3fae48',.5,.9);
  {let p=iso(3.2,3,8.5);dot(p,0,-4,1,4,'#3a2413');dot(p,1,-4,3,2,'#b3312a');p=iso(2.8,2.7,8.5);dot(p,0,-4,1,4,'#3a2413');dot(p,1,-4,3,2,fc);p=iso(4.4,2.3,8.5);dot(p,-1,-5,2,5,'#f4ecd4')}
  bx(2.2,4.2,8.5,.8,.25,1,PAPER);
  bx(4.9,2.9,3,.7,.7,3.5,WOOD);bx(5.45,2.9,6.5,.15,.7,5,WOOD);bx(3,4.9,3,.7,.7,3.5,WOOD);bx(3,5.45,6.5,.7,.15,5,WOOD);
  low(5.8,0,.4,2.4);low(5.8,3.8,.4,2.2);low(0,5.8,2.4,.4);low(3.8,5.8,2.2,.4);
  // salão dos generais: armadura, candelabros, trono no estrado, bustos
  bx(9.4,.5,3,.3,.3,10,WOOD);bx(9.2,.4,9,.7,.5,5,['#dfe5ea','#aab2bb','#8a94a0']);ball(iso(9.55,.65,17),3,'#dfe5ea');dot(iso(9.55,.65,17),-1,-6,2,3,'#b3312a');
  [[6.6,2.6],[6.6,4.3]].forEach(([a,b])=>{bx(a,b,3,.15,.15,11,GOLD);const p=iso(a+.07,b+.07,14);dot(p,-4,0,9,1,gd);[-4,0,4].forEach(d=>{dot(p,d,-3,1,3,'#f4ecd4');dot(p,d,-5,1,2,'#ffb030')})});
  bx(10.2,1.2,3,1.6,2.4,1.5,[gd,'#c99a2a',gdd]);bx(10.7,1.8,4.5,.9,1.2,3.5,FC);bx(11.4,1.8,4.5,.25,1.2,14,FC);
  bx(10.7,1.65,4.5,.9,.15,6,GOLD);bx(10.7,3,4.5,.9,.15,6,GOLD);{const p=iso(11.5,2.4,18.5);dot(p,-1,-3,3,3,gold)}
  for(let k=0;k<2;k++){bx(7+k*2,4.6,3,.8,.8,6,['#e8e4d8','#bdb8aa','#9a968a']);bx(7.15+k*2,4.75,9,.5,.5,3,['#d8d4c8','#aaa699','#8a877c']);ball(iso(7.4+k*2,5,14.5),3,'#e8e4d8');dot(iso(7.4+k*2,5,14.5),1,-1,2,3,'#bdb8aa')}
  // quartel: cabide de armas, barril, boneco de treino, canhão, caixotes, beliche
  bx(.15,6.5,3,.5,2.6,12,WOOD);for(let k=0;k<6;k++){const p=iso(.7,6.75+k*.42,14);dot(p,0,0,1,13,k%2?'#dfe5ea':'#6b4524');dot(p,-1,k%2?10:1,3,1,k%2?gd:'#8a94a0')}
  bx(.5,9.2,3,.7,.7,5,WOOD);ln(iso(.5,9.9,5),iso(1.2,9.9,5),'#3a3a3a',1);ln(iso(1.2,9.9,5),iso(1.2,9.2,5),'#3a3a3a',1);ln(iso(.5,9.9,7),iso(1.2,9.9,7),'#3a3a3a',1);
  bx(4.2,7,3,.3,.3,9,['#d9b95a','#b8983f','#96792c']);bx(3.8,7,9,1.1,.3,2,['#d9b95a','#b8983f','#96792c']);bx(4.05,6.9,12,.6,.5,3,['#e8cf7a','#b8983f','#96792c']);dot(iso(4.35,7.3,10),-1,0,3,3,'#b3312a');
  bx(.5,10.6,3,1,1,4,['#c99a5c','#9a6a36','#7a4f26']);ln(iso(.5,11.6,3),iso(1.5,11.6,7),'#5f3c1c');ln(iso(.5,11.6,7),iso(1.5,11.6,3),'#5f3c1c');bx(.7,10.8,7,.6,.6,3,['#c99a5c','#9a6a36','#7a4f26']);
  bx(2.2,10.6,3,1.6,.7,2,WOOD);bx(2,10.7,5,2.3,.5,2.2,['#5a5a64','#3a3a44','#26262e']);dot(iso(4.3,10.95,6),-1,-1,3,3,'#111');
  [[2.6,11.35],[3.6,11.35]].forEach(([a,b])=>{ball(iso(a,b,4.5),4,'#6b4524');ball(iso(a,b,4.5),2,'#9a6a36');dot(iso(a,b,4.5),-1,-1,2,2,'#22140c')});
  [[1.9,11.7,0],[2.25,11.75,0],[2.07,11.72,1.6]].forEach(([a,b,z])=>ball(iso(a,b,4+z),2.2,'#2f2f36'));
  bx(4.5,10,3,1.2,1.9,3,WOOD);bx(4.55,10.05,6,1.1,1.8,1,PAPER);bx(4.55,10.7,7,1.1,1.15,.6,FC);
  [[4.5,10],[5.6,10],[4.5,11.8],[5.6,11.8]].forEach(([a,b])=>bx(a,b,3,.1,.1,10,WOOD));bx(4.5,10,13,1.2,1.9,1.2,WOOD);bx(4.55,10.05,14.2,1.1,1.8,1,PAPER);bx(4.55,10.7,15.2,1.1,1.15,.6,FC);
  low(5.8,6,.4,2.2);low(5.8,9.8,.4,2.2);low(6,5.8,2.2,.4);low(9.8,5.8,2.2,.4);
  // tesouraria: cofre, baús abertos, moedas, barras de ouro, sacas, escrivaninha com balança
  bx(10.4,6.5,3,1.4,1.2,12,IRON);poly(g,[iso(10.55,7.7,13.5),iso(11.65,7.7,13.5),iso(11.65,7.7,4.5),iso(10.55,7.7,4.5)],'#484c53');ball(iso(11.1,7.7,9.5),3,gd);ball(iso(11.1,7.7,9.5),1.2,'#484c53');dot(iso(11.5,7.7,9),0,0,1,4,gold);
  for(let k=0;k<2;k++){const a=7+k*1.75;bx(a,6.8,6.5,1.5,.15,4,['#b3312a','#8c2f1f','#6b1f14']);bx(a,6.8,3,1.5,1,3.5,['#7a4f26',WOOD[1],WOOD[2]]);bx(a+.1,6.9,6.5,1.3,.8,1.2,GOLD);
    ln(iso(a+.5,7.8,3),iso(a+.5,7.8,6.5),gd,1);ln(iso(a+1,7.8,3),iso(a+1,7.8,6.5),gd,1);dot(iso(a+.75,7.8,5.5),-1,0,2,2,gold);dot(iso(a+.5,7.2,8),0,-1,2,1,'#fff')}
  for(let k=0;k<7;k++){const a=8.6+k%4*.45+(k>3?.2:0),b=8.5+(k>3?.6:0),hh=2+hash(k,2)%4*1.5;bx(a,b,3,.35,.35,hh,GOLD);for(let z=1;z<hh;z+=1.5)ln(iso(a,b+.35,3+z),iso(a+.35,b+.35,3+z),gdd,.5)}
  [[8.3,9.6],[10.3,9.1],[9.6,9.9],[11.2,8.6]].forEach(([a,b])=>dm(a,b,3,gold,.25,.25));
  for(let r=0;r<3;r++)for(let i=0;i<3-r;i++)bx(9.7+i*.5+r*.25,10.6,3+r*1.6,.45,.9,1.6,GOLD);
  [[11,9.4],[11.2,10.5]].forEach(([a,b])=>{bx(a,b,3,.8,.8,3.5,['#d9c596','#bca878','#a08c5c']);dot(iso(a+.4,b+.4,7),-1,-2,3,2,'#8a6a3c')});
  bx(7.2,10.3,3,2.3,1,4.5,['#b98a52',WOOD[1],WOOD[2]]);bx(7.4,10.5,7.5,.8,.6,.6,PAPER);ln(iso(7.5,10.7,8.2),iso(8.1,10.7,8.2),'#3a2413',.5);ln(iso(7.5,10.9,8.2),iso(8.1,10.9,8.2),'#3a2413',.5);
  {const p=iso(8.9,10.8,7.5);dot(p,0,-9,1,9,gd);dot(p,-6,-9,13,1,gd);dot(p,-7,-8,3,1,gold);dot(p,5,-7,3,1,gold);dot(p,-6,-8,1,2,gdd);dot(p,6,-8,1,2,gdd);const c=iso(9.3,10.5,7.5);dot(c,-1,-4,2,4,'#f4ecd4')}
  bx(8,11.5,3,.6,.6,3,WOOD);
  // lado de fora: escada, barris, lampiões, poço, canteiros, cerca, árvores
  bx(12.7,5.2,0,.6,1.8,2,STONE);bx(13.3,5.2,0,.6,1.8,1,STONE);
  bx(12.9,9.6,0,.7,.7,4.5,WOOD);bx(12.9,10.5,0,.7,.7,4.5,WOOD);ln(iso(12.9,10.3,3),iso(13.6,10.3,3),'#3a3a3a',1);ln(iso(12.9,11.2,3),iso(13.6,11.2,3),'#3a3a3a',1);
  [[12.9,12.9],[-.9,12.9],[12.9,4.4],[12.9,7.6]].forEach(([a,b])=>{bx(a,b,0,.2,.2,12,['#3a2413','#3a2413','#22140c']);const p=iso(a+.1,b+.1,14);dot(p,-4,-4,9,9,'rgba(255,210,90,.3)');dot(p,-2,-3,5,6,'#3a2413');dot(p,-1,-2,3,4,'#ffe9a0')});
  bx(14.6,9.6,0,1.3,1.3,3.5,STONE);dm(14.8,9.8,3.5,'#1f3a63',.9,.9);bx(14.6,10.2,3.5,.15,.15,9,WOOD);bx(15.75,10.2,3.5,.15,.15,9,WOOD);bx(14.4,9.9,12.5,1.7,.8,2,TEAL);dot(iso(15.25,10.25,8),-1,0,3,3,'#7a4f26');
  for(let i=0;i<23;i++){const v=hash(i,11),p=iso(.2+i*.55,13.15);dot(p,-2,-2,5,3,'#3f8a2c');dot(p,-1,-4,2,2,['#e0452f','#ffd23f','#fff','#ff8fa3'][v%4]);dot(p,2,-3,1,1,'#74d05c');
    if(i>12&&i<22){const q=iso(13.15,1.5+i*.5);dot(q,-2,-2,5,3,'#3f8a2c');dot(q,0,-4,2,2,['#fff','#e0452f','#ffd23f'][v%3])}}
  for(let a=1;a<11.5;a+=1.3)bx(a,15.2,0,.15,.15,5,WOOD);ln(iso(1,15.3,4),iso(11,15.3,4),'#7a4f26',1.4);ln(iso(1,15.3,2),iso(11,15.3,2),'#7a4f26',1.4);
  [[-1.5,13],[3.5,17],[8,17.5],[16,3],[17.5,8],[13.6,13.8]].forEach(([a,b],k)=>itree(g,a,b,k+5))}
function drawHQ(){
  const now=Date.now(),zm=HQ.zoom,own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0),fc=`hsl(${hue(me)},80%,50%)`,P=(a,b,z)=>{const p=iso(a,b,z);return[p[0]*2,p[1]*2]};
  x.fillStyle='#1d2418';x.fillRect(0,0,cv.width,cv.height);x.save();
  const ip=Math.min(1,(now-HQ.t0)/1300),ie=1-Math.pow(1-ip,3); // entrada: a câmera atravessa o pátio a partir do portão
  if(ip<1){const[gx,gy]=P(14.4,6,0),s=1+1.6*(1-ie);x.translate(405,305);x.scale(s,s);x.translate(-(405+(gx-405)*(1-ie)),-(305+(gy-305)*(1-ie)))}
  if(zm){const p=Math.min(1,(now-zm.start)/320),e=zm.dir>0?p:1-p,R=ROOMS.find(r=>r.k==(zm.room=='dip'?'gen':zm.room)),[cx,cy]=P(R.a+3,R.b+3,3);
    x.translate(405-150*e,305+20*e);x.scale(1+e*.85,1+e*.85);x.translate(-(405+(cx-405)*e),-(305+(cy-305)*e)); // a sala cresce e fica à esquerda; o painel dela entra pela direita
    if(p>=1&&zm.dir<0)HQ.zoom=null}
  x.drawImage(hqc,0,0,810,610);
  {const[fx_,fy]=P(-.35,-.35,68);for(let i=0;i<6;i++){const w=Math.sin(now/180+i*.9)*2.5;x.fillStyle=i%2?fc:`hsl(${hue(me)},80%,42%)`;x.fillRect(fx_+2+i*5,fy-36+w,5,14)}x.fillStyle='#ffd23f';x.fillRect(fx_+12,fy-32,6,6)} // bandeira ao vento
  {const[sx,sy]=P(9.45,-1.05,49);for(let i=0;i<5;i++){const t=(now/2400+i*.2)%1,s=8+t*18;x.fillStyle=`rgba(230,230,230,${(1-t)*.5})`;x.fillRect(sx-s/2+Math.sin(t*6+i)*8,sy-t*80-s/2,s,s)}} // fumaça da chaminé
  [[4.4,2.3,11.5],[6.67,2.67,17.5],[6.67,4.37,17.5],[9.3,10.5,10]].forEach(([a,b,z],i)=>{const[cx,cy]=P(a,b,z),f=(now/110+i*3|0)%3; // chamas das velas
    x.fillStyle='rgba(255,200,80,.25)';x.fillRect(cx-8,cy-10,16,16);x.fillStyle='#ffb030';x.fillRect(cx-2,cy-4-f,4,4+f);x.fillStyle='#fff3c0';x.fillRect(cx-1,cy-2,2,2)});
  // figuras vivas: líder na sala de guerra, generais, uma unidade de cada tipo no quartel, escrivão, sentinelas na escada
  const fig=[[4.6,4.4,{type:'inf',ld:true,sk:'L'},me,1,3],[2.6,7.6,{type:'inf',sk:'T'},me,1,3],[4.2,8.6,{type:'cav',sk:'L'},me,-1,3],[2,9.3,{type:'ati',sk:'B'},me,1,3],
    [9.4,11.3,{type:'ati',sk:'T'},me,-1,3],[13.6,4.5,{type:'inf',sk:'D'},me,1,0],[13.6,7.5,{type:'inf',sk:'L'},me,1,0]];
  own.filter(i=>i!=me).slice(0,2).forEach((i,k)=>fig.push([8.2+k*1.5,2.6+k*.9,{type:'inf',ld:true,sk:'L'},i,k?-1:1,3]));
  fig.sort((p,q)=>p[0]+p[1]-q[0]-q[1]).forEach(([a,b,u,f,dir,z],k)=>{const[sx,sy]=P(a,b,z),sp=sprite(u,f,true,((now/450+k*.3)|0)%2);
    x.fillStyle='rgba(0,0,0,.25)';x.fillRect(sx-18,sy-4,36,6);x.save();x.translate(sx-dir*39,sy-66);x.scale(dir,1);x.drawImage(sp,0,0,78,72);x.restore()});
  x.textBaseline='top';x.textAlign='center';HQ.bub=[];
  if(!zm)SPOTS.forEach((sp,k)=>{const hot=HQ.hov==sp.k,[cx,cy]=P(...sp.at),bh=hot?34:20,by=cy-sp.up*2+Math.sin(now/400+k)*4-(hot?14:0),w=(x.font=FONT(8),Math.ceil(Math.max(x.measureText(sp.n.toUpperCase()).width,hot?x.measureText(sp.s).width:0))+18),R=ROOMS.find(r=>r.k==sp.k);
    if(hot&&R){x.strokeStyle='#ffd23f';x.lineWidth=4;x.beginPath();[[0,0],[6,0],[6,6],[0,6]].forEach(([da,db],i)=>{const p=P(R.a+da,R.b+db,3);i?x.lineTo(...p):x.moveTo(...p)});x.closePath();x.stroke()}
    x.fillStyle='#22140c';x.fillRect(cx-w/2-3,by-3,w+6,bh+6);x.fillStyle=hot?'#ffd23f':'#f6ecc4';x.fillRect(cx-w/2,by,w,bh);
    x.fillStyle='#22140c';x.beginPath();x.moveTo(cx-7,by+bh+3);x.lineTo(cx+7,by+bh+3);x.lineTo(cx,by+bh+13);x.fill();
    x.fillStyle='#b3312a';x.font=FONT(8);x.fillText(sp.n.toUpperCase(),cx,by+6);if(hot){x.fillStyle='#3a2413';x.fillText(sp.s,cx,by+20)}
    if(!zm)HQ.bub.push([sp.k,cx-w/2,by,w,bh+13])});
  x.restore();
  if(ip<.55){const o=ip/.55*420;[[-o,0],[405+o,1]].forEach(([dx,k])=>{x.fillStyle='#6b4524';x.fillRect(dx,0,405,610);x.fillStyle='#4a2c17'; // portão abrindo
    for(let t=0;t<405;t+=45)x.fillRect(dx+t,0,4,610);x.fillStyle='#2f2f36';x.fillRect(dx,120,405,16);x.fillRect(dx,470,405,16);
    x.fillStyle='#8a8f98';for(let t=20;t<405;t+=45){x.fillRect(dx+t,124,6,6);x.fillRect(dx+t,474,6,6)}x.fillStyle='#e0b030';x.fillRect(dx+(k?18:375),290,12,28)})}
  x.fillStyle='rgba(10,6,20,.7)';x.fillRect(0,580,cv.width,30);x.fillStyle='#f1e3a8';x.font=FONT(10);x.textAlign='center';x.textBaseline='top';
  x.fillText('QUARTEL-GENERAL DE '+S[me][4].toUpperCase(),405,590)}
const hqSpot=e=>{ // balão clicado, senão sala sob o cursor, torre ou portão
  const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)*810/r.width,my=(e.clientY-r.top)*610/r.height,hb=(HQ.bub||[]).find(q=>mx>=q[1]&&mx<=q[1]+q[3]&&my>=q[2]&&my<=q[2]+q[4]);
  if(hb)return hb[0];
  const tw=iso(-.3,-.3,30);if(Math.abs(mx-tw[0]*2)<44&&Math.abs(my-tw[1]*2)<80)return'cam';
  const dx=(mx/2-HX)/IS,dy=(my/2-HY+3*ZS)/IH,a=(dy+dx)/2,b=(dy-dx)/2;
  return a>=0&&b>=0&&a<12&&b<12?ROOMS[(a>=6)+(b>=6)*2].k:a>12&&a<17&&b>4&&b<8?'gate':null};
function closeHQ(){HQ=null;document.body.classList.remove('hq');$('room').hidden=true;ui()}
function openHQ(){if(me<0||B||over||cam||aiShow)return;HQ={hov:null,zoom:null,t0:Date.now()};document.body.classList.add('hq');renderHQ();ui();let lf=0;(function loop(t){if(!HQ)return;requestAnimationFrame(loop);if(document.hidden||t-lf<1000/[15,40,60][CFG.q]-2)return;lf=t;drawHQ()})(performance.now())}
const enterRoom=k=>{if(!HQ||HQ.zoom)return;if(k=='cam')return showCampaign();if(k=='gate')return closeHQ();
  const h=HQ;HQ.zoom={room:k,start:Date.now(),dir:1};sfx.move();setTimeout(()=>HQ===h&&showRoom(k),340)};
$('room').addEventListener('change',e=>{const el=e.target;if(el.dataset.post==null)return;const i=+el.dataset.post; // nomear ou dispensar general
  for(const k in posts)if(posts[k]==i)posts[k]=-1;if(el.value){const prev=posts[el.value];posts[el.value]=i;note(`${S[i][4]} assume ${POSTS[el.value][0]}${prev>=0&&prev!=i?' no lugar de '+S[prev][4]:''}`)}
  save();showRoom('gen');ui()});
function showRoom(k){
  const g=gold[me],own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0),line=(t,btn)=>`<div class="rk"><span style="flex:1">${t}</span>${btn}</div>`;let h='';
  if(k=='war')h=`<h2>Sala de Guerra</h2><p class="c">${gl('doc','Doutrinas')} valem pelo resto da partida.</p>`+
    DOC.map(([id,n,d,c])=>line(`<b>${n}</b><br>${d}`,`<button data-s="hq-doc-${id}" ${hq.doc[id]||g<c?'disabled':''}>${hq.doc[id]?'Adotada':c+' ouro'}</button>`)).join('');
  if(k=='gen')h=`<h2>Salão dos Generais</h2><p class="c">Cada general comanda as tropas do seu ${TW1}, no ataque e na defesa. Conquiste o ${TW1} para ganhar o general. Barras: liderança, astúcia, política.</p><p class="c"><b>Cargos:</b> Comércio dá ouro pela política; Guerra dá tropas na fronteira pela liderança; Estratégia dá +1 de Comando e, com astúcia 60+, uma carta a mais; Diplomacia barateia pactos e alianças pela metade.</p>`+
    own.map(i=>{const v=hash(i+3,7);return`<div class="rk">${img(i,S[i][4])}<span style="flex:1"><b>${S[i][4]}</b> · ${S[i][0]}<br>${S[i][7]}: ${traitTxt(i)}<br>Comando: +${(gs(i)[0]-40)/4|0}% dano${gs(i)[1]>80?', +1 movimento':''}${gs(i)[2]>70?', +1 ouro':''}</span>
      <div class="st" title="Liderança, astúcia, política"><i style="width:${40+v%60}%"></i><i style="width:${40+(v>>6)%60}%"></i><i style="width:${40+(v>>12)%60}%"></i></div></div>
      <label class="opt" for="post${i}"><span>Cargo de ${S[i][4].split(' ')[0]}</span><select id="post${i}" data-post="${i}"><option value="">Nenhum</option>${Object.entries(POSTS).map(([k,[n,at]])=>`<option value="${k}" ${posts[k]==i?'selected':''}>${n} (${at})</option>`).join('')}</select></label>`}).join('');
  if(k=='bar')h=`<h2>Quartel</h2><p class="c">Treino aumenta o dano das suas unidades em batalha.</p>`+Object.keys(UT).map(t=>{const lv=hq.tech[t],c=6+4*lv;
    return`<div class="ucard"><img src="${icon(t,me,true,false)}" alt=""><div><b>${UT[t][0]} · nível ${lv}</b>
      <div class="chips"><span>Anda ${UT[t][1]}</span><span>Alcance ${UT[t][2]}</span><span>Dano +${lv*10}%</span></div><p>Forte contra ${strong(t)}</p>
      <button data-s="hq-tech-${t}" ${lv>2||g<c?'disabled':''}>${lv>2?'Treino máximo':`Treinar: ${c} ouro`}</button></div></div>`}).join('');
  if(k=='tes'){const base=own.reduce((a,i)=>a+inc(i),0),tax=Math.ceil(income(me)/2);
    h=`<h2>Tesouraria</h2>${SCN[scn].sub?.[me]?`<p class="c">${gl('sub','Subsídio da Corte')}: +${SCN[scn].sub[me]} ouro por turno</p>`:''}<div class="chips c"><span>◉ Ouro ${g}</span><span>Renda +${income(me)} por turno</span></div>
      <div class="rk"><span style="flex:1">${own.length} ${TW}</span><span>+${base}</span></div>`+
      REG.map(([n,st,b])=>`<div class="rk"><span style="flex:1">Região ${n} ${st.every(i=>owner[i]==me)?'completa':`(${st.filter(i=>owner[i]==me).length}/${st.length})`}</span><span>${st.every(i=>owner[i]==me)?'+'+b:'—'}</span></div>`).join('')+
      line('<b>Imposto de guerra</b><br>Uma vez por turno',`<button data-s="hq-tax" ${hq.tax==turn?'disabled':''}>${hq.tax==turn?'Cobrado':'+'+tax+' ouro'}</button>`)}
  if(k=='dip'){const nb=[...new Set(own.flatMap(i=>adj[i]).map(j=>owner[j]))].filter(f=>f!=me);
    h=`<h2>Chancelaria</h2><p class="c">Pacto: não se atacam. Aliança: pacto mais reforço de tropas na fronteira comum. Tributo: exige ouro de quem é bem mais fraco que você na fronteira; se recusar, fica hostil. Atacar quem tem pacto é traição.</p>`+
      nb.map(f=>`<div class="ucard" style="flex-direction:column;align-items:stretch">${dipHTML(f,'hq')}</div>`).join('')}
  $('room').innerHTML=h+`<p class="c">◉ Ouro em caixa: ${g}</p><button data-s="hq-close" class="end">Voltar ao quartel</button>`;$('room').hidden=false;HQ.room=k}

