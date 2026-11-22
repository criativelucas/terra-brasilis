// batalha tática: turno, IA de campo, cena de combate, desenho

function nextRaid(){
  const r=raids.shift();if(!r){closeTurn();return ui()}
  if(over||owner[r.to]!=me||owner[r.from]!=r.f||troops[r.from]<2)return nextRaid(); // situação mudou desde a ordem
  tactical(r.from,r.to,troops[r.from]-1,1);ui()}
tactical=(from,to,n,ps=0)=>zoomTo(from,to,()=>capTalk(from,to,()=>{startBattle(from,to,n,ps);ui()})); // ataque a capital abre com diálogo // câmera fecha no alvo, depois abre o campo
const startBattle=(from,to,n,ps)=>{tutEv('battle'); // ps: lado do jogador (0 ataca pela esquerda, 1 defende pela direita)
  const af=owner[from],was=owner[to],bio=BIO[BOF[to]],rnd=Math.random(),
    kind=fort[to]||to==was&&Math.random()<.35?'cerco':rnd<(bio.river?.5:.12)?'travessia':rnd>(bio.f>=18?.75:.9)?'emboscada':'campo';
  const kOf=tot=>Math.min(12,Math.max(1,Math.ceil(tot/3))),km=Math.max(kOf(n),kOf(troops[to])); /* o campo cresce com os exércitos: de 24x16 a 30x20 */
  GW=km>9?30:km>6?27:24;GH=km>9?20:km>6?18:16;const T=genMap(bio,kind),a0=A0(),bg=bake(T,bio);
  B={from,to,n,ps,af,was,T,bg,bio,kind,wc:GW-a0-4,rl:[0,0],pw:[null,null],vil:new Map,qt:new Map,qn:{},wx:BOF[to]=='ama'&&Math.random()<.5?'rain':BOF[to]=='ser'&&Math.random()<.5?'dry':null,units:[],round:1,selU:null,pops:[],fxs:[],parts:[],busy:false,hov:null,t0:Date.now(),nextBolt:Date.now()+2500,
    cam:{x:0,y:0,z:1,tx:0,ty:0,tz:1}};
  const OFF=[0,1,-1,2,-2,3,-3,4,-4,5,-5,6]; // da linha do meio para fora
  const side=(sd,tot)=>{const k=kOf(tot),f=sd?was:af,st=sd?to:from,E=ELITE[S[st][0]],TY=['inf','cav','ati','inf','cav','art','inf','ati','cav','inf','ati','art'],rb=RU[BOF[st]];if(rb)TY[rb[0]]=rb[1];
    for(let j=0;j<k;j++){const hp=Math.floor(tot/k)+(j<tot%k?1:0),back=UT[TY[j]][2]>1||!j?1:0, // atiradores, canhões e o comandante ficam uma coluna atrás
      u={side:sd,type:TY[j],el:E&&E[1]==CL(TY[j])?E:null,x:sd?GW-1-a0+back:a0-back,y:Math.max(0,Math.min(GH-1,(GH>>1)+OFF[j])),
        j,lv:lvl(xp[st][j]||0),hits:0,hp,hp0:hp,max:hp,moved:false,done:false,ld:!j,sk:j?'LTBDT'[(f+j)%5]:L[f][0],ph:j*.37};
      [u.x,u.y]=freeNear(u.x,u.y,true)||[u.x,u.y];B.units.push(u)}};
  side(0,n);side(1,troops[to]);
  B.forest=[];B.puddles=[];T.forEach((row,y)=>row.forEach((t,c)=>{const h=hash(c,y);if(t=='f')B.forest.push([c,y,h]);else if(t=='g'&&B.wx=='rain'&&h%6==0)B.puddles.push([c,y,h]);
    if(t=='v')B.vil.set(c+','+y,-1);if(t=='Q')B.qt.set(c+','+y,-1);if(t=='D')B.gate={x:c,y,hp:10+6*fort[to]+(to==was?4:0),max:10+6*fort[to]+(to==was?4:0)};if(t=='P')B.pr={x:c,y}}));
  { /* objetivo extra em parte dos mapas: segurar duas vilas, levar o comandante à saída, tomar a ponte */
    const r=Math.random(),vs=[...B.vil.keys()].map(k=>k.split(',').map(Number)).filter(([c])=>c>GW/2).sort((p,q)=>q[0]-p[0]),br=[];T.forEach((row,y)=>row.forEach((t,c)=>{if(t=='b')br.push([c,y])}));
    const ob=kind=='campo'?(r<.3&&vs.length>=2?'vilas':r<.55?'saida':''):kind=='travessia'&&r<.6&&br.length?'ponte':'';
    if(ob){B.obj=ob;B.goals=ob=='vilas'?vs.slice(0,2):ob=='ponte'?[br.sort((p,q)=>Math.abs(p[1]-(GH>>1))-Math.abs(q[1]-(GH>>1)))[0]]:[[GW-1,T.findIndex(row=>row[GW-1]=='r')]]}}
  camTo((GW-1)/2,(GH-1)/2,zMin());Object.assign(B.cam,{x:B.cam.tx,y:B.cam.ty,z:B.cam.tz}); // abre com o campo inteiro e depois aproxima das suas tropas
  banner(`${KIND[kind][0]}: ${ps?'defenda':'ataque'} ${S[to][1]}.`,ps?'#d0452f':'#e2a83c');
  B.prep=true; /* preparação: o jogador posiciona as tropas antes da rodada 1 */
  const b0=B;setTimeout(()=>{if(B===b0)camTo(ps?GW-1-a0:a0,GH>>1,1)},1300);let lf=0;(function loop(t){if(B!==b0)return;requestAnimationFrame(loop);if(document.hidden||t-lf<1000/[15,40,60][CFG.q]-2)return;lf=t;drawBattle()})(performance.now())};
function bake(T,bio){ // fundo fixo do campo; refeito quando uma ponte queima
  const[bg,g]=mk(GW*CS,GH*CS);for(let y=0;y<GH;y++)for(let c=0;c<GW;c++)tile(g,T,c,y,bio);
  for(let y=0;y<GH;y++)for(let c=0;c<GW;c++)if('mfvW'.includes(T[y][c])){const X=c*CS,Y=y*CS; // sombra projetada para sudeste
    g.fillStyle='rgba(10,20,50,.22)';g.beginPath();g.moveTo(X+6,Y+CS-5);g.lineTo(X+CS+2,Y+CS-5);g.lineTo(X+CS+16,Y+CS+9);g.lineTo(X+20,Y+CS+9);g.fill()}
  const lg=g.createLinearGradient(0,0,GW*CS,GH*CS);lg.addColorStop(0,'rgba(255,236,170,.24)');lg.addColorStop(.5,'rgba(255,255,255,0)');lg.addColorStop(1,'rgba(20,10,60,.3)');
  g.fillStyle=lg;g.fillRect(0,0,GW*CS,GH*CS); // sol de noroeste
  g.strokeStyle='rgba(0,0,0,.07)';g.lineWidth=1;for(let c=1;c<GW;c++)g.strokeRect(c*CS-.5,-1,0,GH*CS+2);for(let y=1;y<GH;y++)g.strokeRect(-1,y*CS-.5,GW*CS+2,0);
  const[mc,mg]=mk(GW,GH),MC={r:'#c79a5e',b:'#8a5a2b',w:'#3a86cc',a:'#7ab0d8',f:'#2c6a34',m:'#6b6258',h:'#a2925c',v:'#efe2c0',Q:'#c0504a',W:'#555',D:'#8a5a2b',P:'#e2a83c'}; // minimapa: uma casa por pixel
  for(let y=0;y<GH;y++)for(let c=0;c<GW;c++){mg.fillStyle=MC[T[y][c]]||bio.g[0];mg.fillRect(c,y,1,1)}bg.mini=mc;
  return bg}
let bCap=null; // general inimigo capturado na última batalha (pode ser libertado na tela de resultado)
function recruit(sd,x,y,hp,type){const f=sd?B.was:B.af,k=B.units.length; /* regimento novo numa casa livre */
  B.units.push({side:sd,type,el:null,x,y,j:-1,lv:0,hits:0,hp,hp0:hp,max:hp,moved:true,done:true,ld:false,sk:'LTBDT'[(f+k+2)%5],ph:k*.4});
  puff(OX+x*CS+CS/2,OY+y*CS+CS-10,'rgba(214,190,140,A)',12,80)}
function spawn(sd,n,tot){ // regimentos novos entram atrás da linha do próprio lado
  const a0=A0(),xs=sd?GW-a0:a0-1;let made=0;
  for(;made<n;made++){const c=freeNear(xs,GH>>1,true);if(!c)break;recruit(sd,c[0],c[1],Math.max(1,Math.floor(tot/n)+(made<tot%n?1:0)),made?'ati':'inf')}
  return made}
function usePower(sd){ // poder único do líder, uma vez por batalha, conforme a vocação dele
  const f=sd?B.was:B.af,k=S[f][5]||'atk';B.pw[sd]={k,until:B.round+1};
  if(!B.auto)B.cut={f,k,start:Date.now()};sfx.cut();mood[f]={m:'angry',until:Date.now()+5000};
  if(k=='def')alive(sd).forEach(u=>{u.hp+=3;u.max=Math.max(u.max,u.hp);B.pops.push({x:u.x,y:u.y,txt:'+3',until:Date.now()+900})});
  if(k=='gold')alive(sd).forEach(u=>u.moved=u.done=false);
  if(k=='rec')spawn(sd,2,Math.max(4,Math.round(B.units.filter(u=>u.side==sd).reduce((s,u)=>s+u.hp0,0)*.25)));
  alive(sd).forEach(u=>puff(OX+u.x*CS+CS/2,OY+u.y*CS+CS/2,'rgba(200,140,255,A)',6,90))}
const bridgeNear=u=>[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[u.x+dx,u.y+dy]).find(([a,b])=>B.T[b]?.[a]=='b'&&!B.units.some(v=>v.hp>0&&v.x==a&&v.y==b));
function burnBridge(u,[bx,by]){B.T[by][bx]='w';B.bg=bake(B.T,B.bio);u.moved=u.done=true;banner('A ponte foi queimada!','#ff8a1e');sfx.hit();
  for(let k=0;k<4;k++)puff(OX+bx*CS+CS/2,OY+by*CS+CS/2,'rgba(255,'+(80+k*50)+',30,A)',10,100)}
function gateHit(a){ // golpe no portão do cerco: canhão rende muito, cavalaria pouco
  const g=B.gate,d=Math.max(1,Math.round(a.hp*.5*UT[a.type][3]*(a.type=='art'?2.5:a.type=='cav'?.6:1)*(B.rl[a.side]==B.round?1.4:1)));g.hp=Math.max(0,g.hp-d);a.done=a.moved=true;a.hits++;a.atkT=Date.now();(B.rings=B.rings||[]).push({x:g.x,y:g.y,start:Date.now()});
  a.lunge={dx:Math.sign(g.x-a.x),dy:Math.sign(g.y-a.y),until:Date.now()+180};B.pops.push({x:g.x,y:g.y,txt:'-'+d,until:Date.now()+800});sfx.hit();B.shake=Date.now()+160;
  B.fxs.push({a:[a.x,a.y],t:[g.x,g.y],shot:dist(a,g)>1,start:Date.now()});puff(OX+g.x*CS+CS/2,OY+g.y*CS+CS/2,'rgba(160,110,60,A)',12,140);
  if(!g.hp){banner('O portão caiu!','#ff8a1e');for(let k=0;k<3;k++)puff(OX+g.x*CS+CS/2,OY+g.y*CS+CS/2,'rgba(214,190,140,A)',14,120)}}
const gateFor=u=>u.side==0&&B.gate?.hp>0&&inR(u,B.gate);
function prCheck(){if(B.pr&&!B.taken&&B.units.some(u=>u.side==0&&u.hp>0&&u.x==B.pr.x&&u.y==B.pr.y)){B.taken=true;banner('A praça foi tomada!','#e2a83c')}} // vale ao fim da vez do defensor
function roundEnd(){ // vilas: quem está nela toma a vila e cura 2
  B.vil.forEach((o,k)=>{const[gx,gy]=k.split(',').map(Number),u=B.units.find(v=>v.hp>0&&v.x==gx&&v.y==gy);if(!u)return;if(B.vil.get(k)!==u.side){B.pops.push({x:gx,y:gy,txt:'Vila tomada!',until:Date.now()+1100});if(u.side==B.ps)sfx.win()}B.vil.set(k,u.side);
    if(u.hp<u.max){const h=Math.min(2,u.max-u.hp);u.hp+=h;B.pops.push({x:gx,y:gy,txt:'+'+h,until:Date.now()+900})}});
  B.qt.forEach((o,k)=>{const[gx,gy]=k.split(',').map(Number),u=B.units.find(v=>v.hp>0&&v.x==gx&&v.y==gy); /* quartel: quem ocupa toma; o dono recruta a cada 2 rodadas, até 2 vezes */
    if(u&&o!==u.side){B.qt.set(k,o=u.side);B.pops.push({x:gx,y:gy,txt:'Quartel tomado!',until:Date.now()+1100});if(u.side==B.ps)sfx.win()}
    if(o>=0&&B.round%2==0&&(B.qn[k]||0)<2){const c=freeNear(gx,gy);if(c){B.qn[k]=(B.qn[k]||0)+1;recruit(o,c[0],c[1],3,'inf');B.pops.push({x:c[0],y:c[1],txt:'Recruta!',until:Date.now()+1100})}}});
  if(B.goals&&!B.taken&&B.goals.every(([gx,gy])=>B.obj=='vilas'?B.vil.get(gx+','+gy)===0:B.units.some(u=>u.side==0&&u.hp>0&&u.x==gx&&u.y==gy&&(B.obj!='saida'||u.ld)))){B.hold=(B.hold||0)+1; /* vilas e ponte: segurar por dois fins de rodada seguidos */
    if(B.hold>=(B.obj=='saida'?1:2)){B.taken=true;banner(OBJ[B.obj][3],'#e2a83c')}else banner(B.ps?'O inimigo tomou o objetivo: retome já!':'Objetivo tomado: segure mais uma rodada!',B.ps?'#d0452f':'#e2a83c')}
  else if(B.goals)B.hold=0}
function reinforce(){ // na 4ª rodada, um vizinho do defensor manda reforços
  if(B.rf)return;B.rf=-1;const nb=adj[B.to].filter(j=>owner[j]==B.was&&j!=B.from&&troops[j]>=4).sort((a,b)=>troops[b]-troops[a])[0];if(nb==null)return;
  const k=Math.min(4,troops[nb]-2);if(!spawn(1,2,k))return;troops[nb]-=k;B.rf=nb;banner(`Reforços chegam de ${S[nb][1]}!`,B.ps?'#3f8fb0':'#d0452f')}
function reach(u){ // casas alcançáveis: [x,y,chave da casa anterior,passos]; morro baixo e vau custam 2 (o primeiro passo sempre vale)
  const mv=mvOf(u),best=new Map([[u.x+','+u.y,[u.x,u.y,null,0]]]),q=[[u.x,u.y,0]],occ=new Set(B.units.filter(v=>v.hp>0&&v!=u).map(v=>v.x+','+v.y));
  while(q.length){const[cx,cy,d]=q.shift();if(d>=mv)continue;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const nx=cx+dx,ny=cy+dy,k=nx+','+ny;
      if(nx<0||ny<0||nx>=GW||ny>=GH||occ.has(k)||!pass(nx,ny,u))return;const nd=d+('ha'.includes(B.T[ny][nx])?2:1);
      if(nd>mv&&d>0||best.has(k)&&best.get(k)[3]<=nd)return;best.set(k,[nx,ny,cx+','+cy,nd]);q.push([nx,ny,nd])})}
  return[...best.values()]}
const banner=(t,col='#e2a83c')=>{if(B&&!B.auto)B.banner={t,col,start:Date.now()}}; // balão de aviso no meio do campo
const phase=(t,sub,mine)=>{if(B&&!B.auto){B.phase={t,sub,mine,start:Date.now()};B.banner=null;sfx.page()}}; // faixa de fase: atravessa a tela inteira
const puff=(px,py,col,n,spd)=>{if(!CFG.q)return;for(let i=0;i<n;i++){const an=Math.random()*6.28,v=spd*(.4+Math.random()*.6); // partículas: poeira, respingo, faísca
  B.parts.push({x:px,y:py,vx:Math.cos(an)*v,vy:Math.sin(an)*v-spd*.4,g:spd*1.4,t:Date.now(),life:320+Math.random()*320,col,s:3+Math.random()*3|0})}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms)), clashLeft=()=>B&&B.clash?Math.max(0,B.clash.until-Date.now()):0;
const STEP=120; // ms por casa andada
function walk(u,gx,gy,R){ // move na lógica já; o desenho percorre o caminho casa a casa
  const m=new Map(R.map(c=>[c[0]+','+c[1],c])),pts=[];let c=m.get(gx+','+gy);while(c){pts.unshift([c[0],c[1]]);c=m.get(c[2])}
  const step=STEP/(B.busy?bFast:1);u.x=gx;u.y=gy;u.anim={pts,start:Date.now(),step};if(pts.length>1&&(u.type=='cav'||u.type=='lan'))sfx.hooves();const d=(pts.length-1)*step;B.lock=Date.now()+d;return d}
const quick=()=>B.auto||B.skip; // automático ou "pular": sem esperas nem cenas
function hit(a,t,back){ // aplica o dano na hora; a cena de combate é só a encenação do que já aconteceu
  const ha0=a.hp,ht0=t.hp,rl=roll(),crit=!back&&rl>1.18,d=Math.min(t.hp,Math.max(1,Math.round(est(a,t,back)*rl))),now=Date.now();t.hp-=d;
  if(crit&&!quick()){B.punch={x:t.x,y:t.y,start:now};B.shakeA=14;B.pops.push({x:t.x,y:t.y-.5,txt:'CRÍTICO!',until:now+1000,big:1})} /* golpe crítico: zoom rápido e tremor forte */a.hits++;a.atkT=t.hurtT=Date.now();(B.rings=B.rings||[]).push({x:t.x,y:t.y,start:Date.now()});
  a.lunge={dx:Math.sign(t.x-a.x),dy:Math.sign(t.y-a.y),until:Date.now()+180};t.flash=Date.now()+220;
  B.pops.push({x:t.x,y:t.y,txt:'-'+d,until:Date.now()+800,big:crit});sfx.strike(a.type,dist(a,t)>1);
  B.fxs.push({a:[a.x,a.y],t:[t.x,t.y],shot:dist(a,t)>1,start:Date.now()});puff(OX+t.x*CS+CS/2,OY+t.y*CS+CS/2-6,'rgba(255,230,120,A)',8,150);if(t.hp<=0)puff(OX+t.x*CS+CS/2,OY+t.y*CS+CS-10,'rgba(214,190,140,A)',10,60);if(t.hp<=0&&t.ld)banner(`O comandante de ${S[t.side?B.was:B.af][4]} caiu!`,t.side==B.ps?'#d0452f':'#e2a83c');B.shake=Date.now()+(crit?320:160);if(!crit)B.shakeA=8;if(t.hp<=0)t.dead=Date.now()+200;
  if(back)return d;
  a.done=true;const d1=t.hp>0&&t.type!='art'&&dist(a,t)<=rgOf(t)?hit(t,a,true):0;
  if(CFG.clash&&!quick()){const dur=CLASH/(B.busy?bFast:1);B.clash={a,t,ha0,ht0,d0:d,d1,shot:dist(a,t)>1,start:Date.now(),until:Date.now()+dur,dur}}}
const CLASH=2000,SLOTS=[[160,196],[84,222],[236,226],[122,268],[208,274]];
function drawClash(now){ // dois quadros: corrida, golpe, queda e revide. Tempos: ataque .08–.32, revide .54–.78
  const c=B.clash,p=(now-c.start)/c.dur,w=320,h=300,by=178,boxes=[[c.a.side?c.t:c.a,70],[c.a.side?c.a:c.t,420]];
  x.fillStyle='rgba(10,6,20,.62)';x.fillRect(0,VY-5,cv.width,VH+10);
  boxes.forEach(([u,bx])=>{
    const isA=u==c.a,f=u.side?B.was:B.af,mine=u.side==B.ps,dir=u.side?-1:1,s0=isA?.08:.54,hitT=isA?.32:.78,myHit=isA?.78:.32,
      acts=isA||c.d1>0,ranged=c.shot||u.type=='art',h0=isA?c.ha0:c.ht0,dmg=isA?c.d1:c.d0,hp=p>myHit?h0-dmg:h0,
      n0=h0>0?Math.min(5,Math.ceil(h0/2)):0,n1=hp>0?Math.min(5,Math.ceil(hp/2)):0,tl=B.T[u.y][u.x];
    parch(x,bx-12,by-12,w+24,h+24,16);x.fillStyle='#3b2618';x.fillRect(bx-2,by-2,w+4,h+4);
    const sky=x.createLinearGradient(0,by,0,by+170);sky.addColorStop(0,'#6fbdf0');sky.addColorStop(1,'#dff2fc');x.fillStyle=sky;x.fillRect(bx,by,w,h);
    x.fillStyle='rgba(255,255,255,.85)';x.fillRect(bx+20+now/70%60,by+78,84,12);x.fillRect(bx+36+now/70%60,by+68,44,10);x.fillRect(bx+200-now/90%50,by+104,96,10);
    x.fillStyle=tl=='r'||tl=='b'?'#c79a5e':B.bio.g[0];x.fillRect(bx,by+160,w,h-160);x.fillStyle=B.bio.gd;x.fillRect(bx,by+160,w,6);
    for(let k=0;k<14;k++){const v=hash(k,u.x+7);x.fillStyle=k%2?B.bio.gd:B.bio.gl;x.fillRect(bx+v%(w-12),by+172+(v>>>5)%118,12,4)}
    if(cover(u)){const q=(a,b,ww,hh,col)=>{x.fillStyle=col;x.fillRect(bx+a*5,by+b*5,ww*5,hh*5)};[[2,22],[52,23],[27,20]].forEach(([a,b],k)=>tree(q,B.bio.tree,a,b,k))}
    let off=0,fr=Math.floor(now/220)%2,st=['parado',now+u.ph*1000];
    if(acts&&p>s0&&p<hitT+.1){const q=(p-s0)/(hitT+.1-s0);
      if(ranged){fr=q>.6&&q<.9?4:0;st=q>.45?['golpe',(q-.45)/.55*animLen(u,'golpe')]:st;if(q>.62)off=-dir*Math.max(0,8-(q-.62)*40)} // tiro: mira, dispara, recua
      else{off=(q<.55?q/.55:Math.max(0,1-(q-.75)/.25))*95*dir;fr=q<.55?2+Math.floor(now/80)%2:4;st=q<.55?['andar',now]:['golpe',(q-.55)/.45*animLen(u,'golpe')]}} // carga: corre, golpeia, volta
    const hurt=dmg>0&&p>myHit&&p<myHit+.1;if(dmg>0&&p>myHit&&p<myHit+.15)st=['dano',(p-myHit)*CLASH];if(dmg>0&&p>myHit&&p<myHit+.12)off-=dir*(Math.floor(now/40)%2?10:3);
    SLOTS.slice(0,n0).forEach(([sx,sy],k)=>{const fallen=k>=n1&&p>myHit,fp=fallen?Math.min(1,(p-myHit)/.16):0,X=bx+(dir>0?sx:w-sx)+off,Y=by+sy,ql=animLen(u,'queda'),sp=sprite(u,f,mine,fallen?animFr(u,'queda',(p-myHit)*CLASH,0):animFr(u,st[0],st[1],fr));
      x.fillStyle='rgba(0,0,0,.25)';x.fillRect(X-34,Y-8,68,10);
      x.save();x.globalAlpha=1-fp*.75;x.translate(X,Y);x.rotate(ql?0:-fp*dir*1.45);x.scale(dir,1);x.drawImage(sp,-65,-120,130,120);
      if(hurt&&!fallen&&!CFG.calm){x.globalCompositeOperation='lighter';x.drawImage(sp,-65,-120,130,120)}x.restore();
      const t1=s0+(hitT-s0)*.6;
      if(acts&&ranged&&!fallen&&p>t1&&p<t1+(hitT-s0)*.2){x.fillStyle='#ffd23f';x.fillRect(X+dir*58-7,Y-72,14,14);x.fillStyle='#fff';x.fillRect(X+dir*58-3,Y-68,6,6)} // clarão do disparo
      if(acts&&ranged&&p>t1&&p<hitT+.16){const q=(p-t1)/(hitT+.16-t1);x.fillStyle=`rgba(230,230,230,${.6*(1-q)})`;x.fillRect(X+dir*(58+q*34)-12,Y-80-q*34,22+q*16,16+q*12)} // fumaça
      if(fallen&&fp>.55&&fp<1){x.fillStyle='rgba(214,190,140,.55)';x.fillRect(X-26,Y-14,52,10)}});
    const px_=dir>0?bx+8:bx+w-56,tx=dir>0?bx+64:bx+w-64; // cabeçalho: retrato, tipo, barra de vida
    x.fillStyle='#22140c';x.fillRect(px_-3,by+5,54,54);x.drawImage(fcv[f],px_,by+8,48,48);
    x.textAlign=dir>0?'left':'right';x.font=FONT(8);x.fillStyle='#22140c';x.fillText(nmOf(u)+(cover(u)?' · abrigo':''),tx,by+12);
    const bw=180,bx0=dir>0?tx:tx-bw,shown=p>myHit?Math.max(hp,h0-dmg*Math.min(1,(p-myHit)/.1)):h0;x.fillRect(bx0-2,by+26,bw+4,18);x.fillStyle='#5a2a22';x.fillRect(bx0,by+28,bw,14);
    x.fillStyle=mine?'#2f6fe0':'#d0452f';x.fillRect(bx0,by+28,bw*shown/u.max,14);
    x.fillStyle='#fff';x.textAlign='center';x.fillText(`${Math.round(shown)}/${u.max}`,bx0+bw/2,by+31);
    if(dmg>0&&p>myHit){x.font=FONT(22);const yy=by+110-(p-myHit)*60;x.fillStyle='#22140c';x.fillText('-'+dmg,bx+w/2+3,yy+3);x.fillStyle='#ffd23f';x.fillText('-'+dmg,bx+w/2,yy)}
    if(!hp&&p>myHit+.1){x.font=FONT(12);x.fillStyle='#b3312a';x.fillText('DERROTADOS',bx+w/2,by+220)}});
  [[c.a,c.t,.08,.32,true],[c.t,c.a,.54,.78,c.d1>0]].forEach(([au,tu,s0,hitT,go])=>{if(!go)return; // projétil cruzando os quadros, corte e estilhaço no alvo
    const ranged=c.shot||au.type=='art',ax=boxes.find(b=>b[0]==au)[1]+160,tx=boxes.find(b=>b[0]==tu)[1]+160,y=by+190,t1=s0+(hitT-s0)*.65;
    if(ranged&&p>t1&&p<hitT){const q=(p-t1)/(hitT-t1),X=ax+(tx-ax)*q,Y=y-(au.type=='art'?Math.sin(q*Math.PI)*120:0);
      if(au.type=='art'){x.fillStyle='#22140c';x.beginPath();x.arc(X,Y,8,0,7);x.fill();x.fillStyle='#8a8a94';x.fillRect(X-3,Y-4,3,3)}
      else{x.strokeStyle='#fff3c0';x.lineWidth=4;x.beginPath();x.moveTo(X,Y);x.lineTo(X-(tx-ax)*.1,Y);x.stroke()}}
    if(p>hitT&&p<hitT+.12){const q=(p-hitT)/.12;
      if(ranged){x.fillStyle=`rgba(255,200,80,${1-q})`;x.beginPath();x.arc(tx,y+20,10+q*50,0,7);x.fill()}
      else{x.strokeStyle=`rgba(255,255,255,${1-q})`;x.lineWidth=7;x.beginPath();x.arc(tx,y+20,70,-2.6+q*1.8,-1.2+q*1.8);x.stroke();x.beginPath();x.arc(tx,y+30,55,-2.2+q*1.8,-.8+q*1.8);x.stroke()}
      for(let i=0;i<10;i++){const an=i*.628,r=20+q*70;x.fillStyle=i%2?'#ffd23f':'#fff';x.fillRect(tx+Math.cos(an)*r-3,y+20+Math.sin(an)*r-3,6,6)}}})}
async function aiSide(sd,ms){
  const b0=B,ldr=B.units.find(u=>u.side==sd&&u.ld),pk=S[sd?B.was:B.af][5],press=()=>B.round>=4||ldr.hp<ldr.max/2||(B.round>=2&&total(sd)<total(1-sd)),wait=()=>sleep(quick()?0:ms*SPD[CFG.speed]/bFast+clashLeft());
  if(!B.pw[sd]&&sd!=B.ps&&pk!='gold'&&press()){usePower(sd);await sleep(quick()?60:1750/bFast);if(B!==b0)return}
  if(!B.rl[sd]&&sd!=B.ps&&(B.round>=3||ldr.hp<ldr.max/2||(B.round>=2&&total(sd)<total(1-sd)))){B.rl[sd]=B.round; // a IA usa o brado quando aperta
    B.pops.push({x:ldr.x,y:ldr.y,txt:'BRADO!',until:Date.now()+1100});sfx.win();await sleep(quick()?0:500/bFast);if(B!==b0)return}
  for(const u of alive(sd)){
    if(B!==b0||bOver())return;
    const pri=p=>dist(u,p)*.9-(beats(u,p)?1.5:0)-(p.ld?2:0)-(est(u,p)>=p.hp?3:0)-(1-p.hp/p.max)*2,t=alive(1-sd).sort((p,q)=>pri(p)-pri(q))[0]; if(u.hp<=0||!t)continue; // prefere quem ela vence e o comandante
    if(!quick()&&seen(u)&&camFrame(u,t)){await sleep(420/bFast);if(B!==b0)return} /* a câmera vai até a ação */
    const gl=sd==0&&B.goals&&!B.taken&&(B.obj=='saida'?u.ld:u.j%2==0||u.j<0)?B.goals.map(([gx,gy])=>({x:gx,y:gy})).sort((p,q)=>dist(u,p)-dist(u,q))[0]:null; // parte do ataque corre para o objetivo
    const br=sd==1&&B.kind=='travessia'&&!inR(u,t)?bridgeNear(u):null;
    if(br&&alive(0).some(e=>e.x<br[0])){burnBridge(u,br);await wait();continue} // defensor corta a passagem
    if(!inR(u,t)&&gateFor(u)){gateHit(u);await wait();continue} // atacante arromba o portão
    if(u.ld&&u.hp<u.max*.6&&alive(1-sd).some(e=>dist(u,e)<=3)&&!(inR(u,t)&&est(u,t)>=t.hp)){ /* comandante ferido recua para longe e para o abrigo */
      const R=reach(u),safe=c=>Math.min(...alive(1-sd).map(e=>Math.abs(e.x-c[0])+Math.abs(e.y-c[1])))+('fvh'.includes(B.T[c[1]][c[0]])?1:0),c=[...R].sort((p,q)=>safe(q)-safe(p))[0];
      const d=walk(u,c[0],c[1],R);await sleep(quick()?40:d+80);if(B!==b0)return;if(inR(u,t))hit(u,t);await wait();continue}
    const goal=sd==0&&B.gate?.hp>0&&!inR(u,t)?B.gate:gl&&!(inR(u,t)&&!u.ld)?gl:t,rg=rgOf(u),far=c=>{const tl=B.T[c[1]][c[0]];return Math.abs(Math.abs(c[0]-goal.x)+Math.abs(c[1]-goal.y)-(rg>1&&goal==t?2:1))-('fvh'.includes(tl)?.9:0)-(tl=='v'&&B.vil.get(c[0]+','+c[1])!==sd||tl=='Q'&&B.qt.get(c[0]+','+c[1])!==sd?1.2:0)+(rg>1?alive(1-sd).filter(e=>rgOf(e)<2&&Math.abs(e.x-c[0])+Math.abs(e.y-c[1])<=2).length*.7:0)}; // fica à distância de tiro e busca abrigo
    if(!inR(u,t)||goal==gl&&u.ld){if(!u.ld||dist(u,t)<=4||goal==gl){ // comandante só se mexe com o inimigo perto, ou rumo à saída
     const R=reach(u),pr=sd==0&&(B.pr&&!(B.gate?.hp>0)?R.find(c=>c[0]==B.pr.x&&c[1]==B.pr.y):gl&&R.find(c=>c[0]==gl.x&&c[1]==gl.y)),c=pr||[...R].sort((p,q)=>far(p)-far(q))[0]; // corre para a praça ou o objetivo se puder
      const d=walk(u,c[0],c[1],R);await sleep(quick()?40:d+80);if(B!==b0)return}} // no automático não espera a caminhada
    if(inR(u,t))hit(u,t);else if(gateFor(u))gateHit(u);
    await wait()}
  if(!B.pw[sd]&&sd!=B.ps&&pk=='gold'&&press()&&B===b0&&!bOver()){usePower(sd);await sleep(quick()?60:1750/bFast);if(B===b0)return aiSide(sd,ms)}}
async function bEnd(auto){
  if(B.busy)return;B.prep=false;const b0=B;B.busy=true;B.selU=B.undo=null;B.auto=!!auto;ui();
  await sleep(Math.max(clashLeft(),(B.lock||0)-Date.now(),0)+150);if(B!==b0)return;
  do{if(auto)await aiSide(B.ps,140);
    if(B!==b0)return;
    if(B.ps==1)prCheck();
    if(!bOver()){if(!auto){phase('Fase do inimigo',`${S[B.ps?B.af:B.was][4]} · rodada ${B.round}`,false);await sleep(1150/bFast);if(B!==b0)return}
      await aiSide(1-B.ps,auto?140:320)}
    if(B!==b0)return;
    if(B.ps==0)prCheck();roundEnd();
    B.round++;B.units.forEach(u=>u.moved=u.done=false);B.skip=false;if(!auto&&!bOver())phase('Sua fase',`Rodada ${Math.min(B.round,MAXR)} de ${MAXR}`,true);if(B.round==4&&!bOver())reinforce()}while(auto&&!bOver());
  B.busy=false;bOver()?bFinish():ui()}
function bFinish(){tutEv('bdone');closeCmd();const stg=$('stage');stg.classList.remove('fade');void stg.offsetWidth;stg.classList.add('fade');
  const{from,to,n,was,af,ps,kind}=B,a=total(0),d=total(1),won=(B.taken||!ld(1))&&ld(0),e=ps?af:was,wonP=ps?!won:won; // won = atacante venceu
  const loss=sd=>Math.max(0,B.units.filter(u=>u.side==sd).reduce((s,u)=>s+u.hp0,0)-total(sd)),lvUp=[],
    best=B.units.filter(u=>u.side==ps&&u.hits).sort((p,q)=>q.hits-p.hits)[0],vg=2*[...B.vil.values()].filter(v=>v==ps).length,
    R={perks:[],to,kind,e,win:wonP,l0:loss(ps),l1:loss(1-ps),vg,lv:lvUp,best:best&&`${nmOf(best)}${best.ld?' (comandante)':''}, ${best.hits} golpe${best.hits>1?'s':''}`};
  troops[from]-=n;
  // experiência: regimento que sobreviveu ganha 1, mais 1 se acertou golpes, mais 1 se o lado venceu
  for(const sd of[0,1]){const st=sd?to:from,win=sd?!won:won;B.units.filter(u=>u.side==sd&&u.j>=0).forEach(u=>{if(u.hp>0){xp[st][u.j]=(xp[st][u.j]||0)+1+(u.hits>0)+win;if(sd==ps&&lvl(xp[st][u.j])>u.lv){lvUp.push(`${nmOf(u)} nível ${lvl(xp[st][u.j])}`);R.perks.push({st:sd==0&&won?to:st,j:u.j,n:nmOf(u)})}}})}
  gold[me]+=vg;bCap=null;
  if(wonP&&!ld(1-ps)){gold[me]+=10;bCap=e;R.cap=1} // general inimigo preso: resgate
  if(!ld(ps)){R.paid=Math.min(gold[me],8);gold[me]-=R.paid}
  if(won){xp[to]=[...xp[from]];for(let j=0;j<12;j++){const p=perk[from+'-'+j];if(p)perk[to+'-'+j]=[...p]}}
  if(won){burn[to]=turn;if(ps)lastLoss=turn;fort[to]=0;owner[to]=af;troops[to]=Math.max(1,a)}else{troops[to]=Math.max(1,d);troops[from]+=a}
  if(ps)say(won?`${S[af][4]} tomou ${S[to][0]} de você!`:`Você repeliu ${S[af][4]} em ${S[to][0]}`);
  else{say(won?`Você conquistou ${S[to][1]} de ${S[was][4]}`:a?`Recuo em ${S[to][1]}`:`Derrota em ${S[to][1]}`);moved.add(from).add(to)}
  sel=to;B=null;check();onFight(af,was,to,won);
  setTimeout(()=>{if(!over&&!B&&$('screen').hidden)showBRes(R)},1300); // depois do painel de confronto
  ps?nextRaid():ui()}
let lastRes=null;
function showBRes(R){lastRes=R;
  scr(`<h2 class="big">${R.win?'VITÓRIA':'DERROTA'}</h2><p class="c">${KIND[R.kind][0]} de ${S[R.to][1]}</p>
    <div class="row c"><img class="hero" src="${face[me]}" alt="${S[me][4]}"><img class="hero" src="${face[R.e]}" alt="${S[R.e][4]}"></div>
    <div class="chips"><span>Suas perdas: ${R.l0}</span><span>Perdas de ${S[R.e][4]}: ${R.l1}</span>${R.vg?`<span>Vilas tomadas: +${R.vg} ouro</span>`:''}</div>
    ${R.best?`<p>★ <b>Destaque:</b> ${R.best}</p>`:''}${R.lv.length?`<p><b>Subiram de nível:</b> ${R.lv.join(', ')}</p>`:''}${R.perks.length?`<div class="perks"><b>Escolha uma melhoria para cada regimento</b>${R.perks.map((p,k)=>`<div class="pk"><span>${p.n}</span>${PERKS.map(([id,nm,d])=>`<button data-s="perk-${k}-${id}" data-help="${d}" title="${d}" ${perk[p.st+'-'+p.j]?.includes(id)?'disabled':''}>${nm}</button>`).join('')}</div>`).join('')}</div>`:''}
    ${R.cap?`<p><b>${S[R.e][4]} foi capturado!</b> Resgate de 10 ouro recebido.</p><button data-s="bfree">Libertar sem resgate: devolve os 10 ouro e firma pacto de 4 turnos</button>`:''}
    ${R.paid!=null?`<p class="warn">Seu comandante foi capturado. Resgate pago: ${R.paid} ouro.</p>`:''}
    <button data-s="close" class="end">Continuar</button>`)}
function playBattleCard(id,t){const c=CARDS[id];cmd-=c[2];hand.splice(hand.indexOf(id),1);banner(`Carta: ${c[0]}.`,'#3f8fb0');sfx.win(); // cartas de batalha
  if(id=='embosc')B.amb=B.round;
  if(id=='carga')B.chg=B.round;
  if(id=='reforco')alive(B.ps).forEach(u=>{u.hp+=2;u.max=Math.max(u.max,u.hp);B.pops.push({x:u.x,y:u.y,txt:'+2',until:Date.now()+900})});
  if(id=='fogo'){const d=Math.max(1,Math.round(t.hp*.4));t.hp-=d;t.flash=Date.now()+300;B.pops.push({x:t.x,y:t.y,txt:'-'+d,until:Date.now()+900});
    for(let k=0;k<3;k++)puff(OX+t.x*CS+CS/2,OY+t.y*CS+CS/2,'rgba(255,'+(90+k*60)+',30,A)',8,90);sfx.hit();if(t.hp<=0)t.dead=Date.now()+200;
    if(bOver()){B.busy=true;setTimeout(()=>B&&bFinish(),900)}}}
function hudAt(e){const[px,py]=bPt(e);return(B.hud||[]).find(a=>px>=a.x&&py>=a.y&&px<a.x+a.w&&py<a.y+a.h)}
function hudAct(h,e){ /* fichas do placar, botões de velocidade e minimapa */
  if(h.spd){bFast=h.spd;try{localStorage.setItem('tb-fast',bFast)}catch{}sfx.tick();return}
  if(h.skip){if(B.busy){B.skip=true;B.clash=null;sfx.tick()}return}
  if(h.mini){const[px,py]=bPt(e);camTo((px-h.x)/h.w*GW-.5,(py-h.y)/h.h*GH-.5);return}
  const u=h.u;if(!u||u.hp<=0)return;camTo(u.x,u.y);if(B.busy||B.prep)return;
  if(u.side==B.ps&&!u.done){B.selU=u;B.peek=null;sfx.sel();closeCmd()}else if(u.side!=B.ps&&seen(u)){B.selU=null;B.peek=u;sfx.sel()}ui()}
function bClick(e){
  const hh=hudAt(e);if(hh)return hudAct(hh,e);
  if(B.busy||clashLeft()||B.lock>Date.now())return;
  const[gx,gy]=bCell(e),b0=B;let R;
  if(B.prep){const pu=B.units.find(v=>v.hp>0&&v.x==gx&&v.y==gy),ps0=B.selU; /* preparação: troca de lugar ou leva para uma casa da zona */
    if(pu&&pu.side==B.ps){if(ps0&&ps0!==pu){const ax=ps0.x,ay=ps0.y;ps0.x=pu.x;ps0.y=pu.y;pu.x=ax;pu.y=ay;B.selU=null;sfx.move()}else{B.selU=pu==ps0?null:pu;sfx.sel()}}
    else if(ps0&&!pu&&gx>=0&&gy>=0&&gx<GW&&gy<GH&&inZone([gx,gy])&&pass(gx,gy,ps0)){ps0.x=gx;ps0.y=gy;B.selU=null;sfx.move()}
    return ui()}
  if(B.aim){const u=B.units.find(v=>v.hp>0&&v.side!=B.ps&&v.x==gx&&v.y==gy&&seen(v));if(u)playBattleCard(B.aim,u);else note('Ataque de fogo cancelado: clique numa unidade inimiga');B.aim=null;return ui()}
  const u=B.units.find(v=>v.hp>0&&v.x==gx&&v.y==gy&&seen(v)),s=B.selU;
  closeCmd();
  if(u&&u.side==B.ps){if(u==s&&!u.done){battleCmd(u);return ui()}B.selU=u.done?null:u;B.peek=null;sfx.sel();camFrame(u)}
  else if(s&&u&&inR(s,u)){hit(s,u);B.selU=B.undo=null}
  else if(s&&!u&&B.gate&&gx==B.gate.x&&gy==B.gate.y&&gateFor(s)){gateHit(s);B.selU=B.undo=null}
  else if(s&&!u&&!s.moved&&(R=reach(s)).some(c=>c[0]==gx&&c[1]==gy)){B.undo={u:s,x:s.x,y:s.y};const wd=walk(s,gx,gy,R);s.moved=true;sfx.move();tutEv('bmove');camFrame(s);
    setTimeout(()=>{if(B===b0&&B.selU===s&&!s.done&&!B.busy)battleCmd(s)},wd+60)} // depois de andar, o menu de comando abre ao lado
  else if(s&&!u&&!s.done&&gx>=0&&gy>=0&&gx<GW&&gy<GH){const t=B.T[gy][gx],why=s.moved?'Esta unidade já andou: ataque um alvo vermelho ou escolha Esperar no menu.':!pass(gx,gy,s)||(t=='D'&&B.gate?.hp>0)?`${TN[t].split(':')[0]}: não dá para entrar nesta casa.`:`Longe demais: ${nmOf(s)} anda ${mvOf(s)} casas por rodada.`; /* movimento inválido: X vermelho e o motivo */
    B.bad={x:gx,y:gy,until:Date.now()+700,why};help(why);beep(180,.08,'square')}
  else{B.selU=null;B.peek=u&&B.peek!=u?u:null;if(u)sfx.sel()} // inimigo fora de alcance: espia o movimento dele
  if(bOver()){B.busy=true;setTimeout(()=>B===b0&&bFinish(),700+clashLeft())}
  else if(alive(B.ps).every(v=>v.done))return bEnd(); // todas as unidades agiram: a rodada passa sozinha para o inimigo
  ui()}
function drawUnit(u,now){
  let vx=u.x,vy=u.y,hop=0,face=u.side?-1:1;const an=u.anim;
  if(an){const t=(now-an.start)/(an.step||STEP),i=Math.floor(t);if(i>=an.pts.length-1)u.anim=null;
    else{const[a,b]=an.pts[i],[c,d]=an.pts[i+1],fr=t-i;vx=a+(c-a)*fr;vy=b+(d-b)*fr;hop=Math.sin(fr*Math.PI)*9;if(c!=a)face=c>a?1:-1}}
  const f=u.side?B.was:B.af,mine=u.side==B.ps,k=u.lunge&&u.lunge.until>now?10:0,
    px_=OX+vx*CS+(k&&u.lunge.dx*k),py=OY+vy*CS+(k&&u.lunge.dy*k),
    st=u.hp<=0?['queda',now-u.dead+200]:u.atkT&&now-u.atkT<animLen(u,'golpe')?['golpe',now-u.atkT]:u.anim?['andar',now-u.anim.start]:u.hurtT&&now-u.hurtT<animLen(u,'dano')?['dano',now-u.hurtT]:['parado',u.done?0:now+u.ph*1000], // animação pela etiqueta
    sp=sprite(u,f,mine,animFr(u,st[0],st[1],k?4:u.anim?2+Math.floor(now/110)%2:u.done?0:Math.floor(now/420+u.ph)%2));
  if(an&&now-(u.dust||0)>90){u.dust=now;const tl=B.T[Math.round(vy)]?.[Math.round(vx)],wet=tl=='w'||tl=='b';puff(px_+CS/2,py+CS-8,wet?'rgba(150,205,255,A)':'rgba(214,190,140,A)',wet?4:2,wet?70:30)} // poeira ou respingo
  {const fc=`hsl(${hue(f)},${mine?70:55}%,${CFG.cb?35:45}%)`,bx_=px_+CS/2,by_=py+CS-8,dw=22-hop/3,dh=8,
    dia=(w,h,dy=0)=>{x.beginPath();x.moveTo(bx_-w,by_+dy);x.lineTo(bx_,by_+dy-h);x.lineTo(bx_+w,by_+dy);x.lineTo(bx_,by_+dy+h);x.closePath()}; /* losango na cor do lado embaixo da unidade */
    x.fillStyle='rgba(0,0,0,.32)';dia(dw,dh,2);x.fill();
    if(u.hp>0){x.globalAlpha=.55;x.fillStyle=fc;dia(dw,dh);x.fill();x.globalAlpha=1;x.strokeStyle=mine?'#a8c8ff':'#ff9c86';x.lineWidth=2;dia(dw,dh);x.stroke()}
    if(mine&&!u.done&&u.hp>0&&!B.busy&&!B.prep){const p=(Math.sin(now/260+u.ph*3)+1)/2;x.strokeStyle=`rgba(255,240,170,${.35+.55*p})`;x.lineWidth=2;dia(dw+3+p*2,dh+1+p);x.stroke()}}
  const ql=animLen(u,'queda'),dead=u.hp<=0?Math.max(0,(now-u.dead-(ql?ql-200:0))/450):0;x.save();x.globalAlpha=u.hp<=0?Math.max(0,1-dead):u.done&&!u.anim&&!('filter' in x)?.6:1;if(u.done&&!u.anim&&u.hp>0&&'filter' in x)x.filter='saturate(.2) brightness(.85)'; // com animação de queda, só some depois de cair
  if(face<0){x.translate(px_+CS/2+39,py+CS-74-hop+(ql?0:dead*14));x.scale(-1,1)}else x.translate(px_+CS/2-39,py+CS-74-hop+(ql?0:dead*14));
  x.drawImage(sp,0,0,78,72);
  if(u.flash>now){x.globalCompositeOperation='lighter';x.drawImage(sp,0,0,78,72);x.globalCompositeOperation='source-over'}
  x.restore();
  if(u.hp<=0)return;
  if(u.ld){const bx=px_+CS/2-11,by=py-56-hop;x.fillStyle='#22140c';x.fillRect(bx-2,by-2,26,26);x.fillStyle='#ffd23f';x.fillRect(bx-1,by-1,24,24);x.drawImage(fcv[f],bx,by,22,22)} // comandante: retrato do líder acima da barra
  {x.font=FONT(6.5);const t=''+u.hp,tw=Math.max(14,Math.ceil(x.measureText(t).width)+6),bw=28,hx=px_+CS/2-(tw+bw)/2,hy=py-31-hop; /* vida: número e barra azul (sua) ou vermelha (inimiga) sobre a cabeça */
    x.fillStyle='#1a1220';x.beginPath();x.roundRect(hx-1,hy-1,tw+bw+2,12,4);x.fill();x.fillStyle=mine?'#2a4f9a':'#8a2a22';x.fillRect(hx,hy,tw,10);
    x.fillStyle='#fff';x.textAlign='center';x.fillText(t,hx+tw/2,hy-2.5);x.textAlign='left';
    x.fillStyle='#3a2226';x.fillRect(hx+tw+1,hy+2,bw-2,6);x.fillStyle=mine?'#5a9cff':'#ff5a48';x.fillRect(hx+tw+1,hy+2,(bw-2)*Math.min(1,u.hp/u.max),6);x.fillStyle='rgba(255,255,255,.45)';x.fillRect(hx+tw+1,hy+2,(bw-2)*Math.min(1,u.hp/u.max),1)}
  if(u.el){x.fillStyle='#22140c';x.fillRect(px_+CS-12,py+CS-24,9,9);x.fillStyle='#ffd23f';x.fillRect(px_+CS-11,py+CS-23,7,7)} // selo de elite
  for(let k=0;k<u.lv;k++){const cx_=u.side?px_+CS-8:px_+6,cy_=py+CS-26-k*5;x.fillStyle='#22140c';x.fillRect(cx_-4,cy_-1,9,5);x.fillStyle='#ffd23f';x.fillRect(cx_-3,cy_,3,2);x.fillRect(cx_,cy_+1,1,2);x.fillRect(cx_+1,cy_,3,2)}} // divisas de nível
function drawBattle(){
  const now=Date.now(),s=B.selU,ps=B.ps,cw=cv.width;
  {const bgr=x.createRadialGradient(cw/2,0,40,cw/2,0,cv.height);bgr.addColorStop(0,'#3d2b31');bgr.addColorStop(1,'#1a1215');x.fillStyle=bgr;x.fillRect(0,0,cw,cv.height)}x.textBaseline='top';
  const ent=Math.min(1,(now-B.t0)/550),es=1+.3*Math.pow(1-ent,2); // entrada: o campo cresce e clareia
  x.save();if(es>1){x.translate(cw/2,cv.height/2);x.scale(es,es);x.translate(-cw/2,-cv.height/2)}
  B.hud=[];teamBar(0,VX,now);teamBar(1,cw-VX-262,now); // placar dos dois lados: líder e uma ficha por unidade
  lac(x,cw/2-118,8,236,94,12);scriptT(x,`Rodada ${Math.min(B.round,MAXR)}`,cw/2-14,11,26,'center');
  x.textAlign='left';x.font=FONT(8);x.fillStyle='#d9c8a8';x.fillText('/'+MAXR,cw/2+38,24); // placa central da rodada, no estilo da placa de turno
  const hc=B.hov&&B.T[B.hov[1]]?.[B.hov[0]],hu=hc&&B.units.find(v=>v.hp>0&&v.x==B.hov[0]&&v.y==B.hov[1]&&seen(v));
  x.textAlign='center';x.font=FONT(9);x.fillStyle='#f3e7cf';x.fillText(S[B.to][1],cw/2,48,220);
  x.font=FONT(7.5);x.fillStyle='#d9c8a8';x.fillText(hc?TN[hc]+(hu?` · ${nmOf(hu)} ${hu.hp}`:''):KIND[B.kind][0]+' · '+B.bio.nome+(B.wx=='rain'?' · chuva':B.wx=='dry'?' · seca':''),cw/2,73,222);
  camStep(now);x.save();x.beginPath();x.rect(VX,VY,VW,VH);x.clip();x.fillStyle='#120c10';x.fillRect(VX,VY,VW,VH); /* janela da câmera */
  {const c=B.cam;let z=c.z,cx=c.x,cy=c.y;if(B.punch){const p=(now-B.punch.start)/320;if(p>=1)B.punch=null;else{const wx=(B.punch.x+.5)*CS,wy=(B.punch.y+.5)*CS,sx=(wx-cx)*z,sy=(wy-cy)*z;z*=1+.14*Math.sin(Math.PI*p);cx=wx-sx/z;cy=wy-sy/z}} // crítico: zoom rápido no alvo
    x.translate(VX,VY);x.scale(z,z);x.translate(-cx,-cy);if(B.shake>now&&CFG.shake&&!CFG.calm){const a=B.shakeA||8;x.translate((Math.random()-.5)*a,(Math.random()-.5)*a)}}
  x.fillStyle='#1a0f0b';x.fillRect(OX-7,OY-7,GW*CS+14,GH*CS+14);x.fillStyle='#b8955a';x.fillRect(OX-5,OY-5,GW*CS+10,GH*CS+10);x.fillStyle='#6b4a2e';x.fillRect(OX-3,OY-3,GW*CS+6,GH*CS+6); // moldura de madeira com filete dourado
  if(B.wx=='dry'&&CFG.q)for(let r=0;r<GH*CS;r+=6)x.drawImage(B.bg,0,r,GW*CS,6,OX+Math.round(Math.sin(now/260+r*.09)*1.6),OY+r,GW*CS,6); // calor tremendo no sertão
  else x.drawImage(B.bg,OX,OY);
  B.puddles.forEach(([gx,gy,h])=>{const X=OX+gx*CS+14+h%18,Y=OY+gy*CS+28+h%12,q=((now+h)%1100)/1100;x.fillStyle='rgba(90,150,220,.38)';x.beginPath();x.ellipse(X,Y,11+h%6,4,0,0,7);x.fill();
    x.strokeStyle=`rgba(220,235,255,${.7*(1-q)})`;x.lineWidth=1;x.beginPath();x.ellipse(X,Y,2+q*9,1+q*3,0,0,7);x.stroke()});
  const wt=now/260|0; // marolas
  for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++)if(B.T[gy][gx]=='w'){const h=hash(gx,gy);x.fillStyle='#8fc7ea';
    x.fillRect(OX+gx*CS+6+(h+wt)%30,OY+gy*CS+12+h%8,12,3);x.fillRect(OX+gx*CS+6+(h*7+wt*2)%30,OY+gy*CS+34+h%10,9,3)}
  {const U=CS/18;B.forest.forEach(([gx,gy,h])=>{const X=OX+gx*CS+(CFG.q?Math.round(Math.sin(now/650+gx*.9+gy*1.7)*1.4):0),Y=OY+gy*CS, // árvores balançando
    q=(a,bb,w,hh,col)=>{x.fillStyle=col;x.fillRect(Math.round(X+a*U),Math.round(Y+bb*U),Math.ceil(w*U),Math.ceil(hh*U))};
    [[1,0],[9,2],[4,8]].forEach(([a,bb],k)=>tree(q,B.bio.tree,a+(h>>k)%2,bb,h>>k))})}
  B.vil.forEach((o,k)=>{if(o<0)return;const[gx,gy]=k.split(',').map(Number),X=OX+gx*CS+34,Y=OY+gy*CS+2; // bandeirinha de quem tomou a vila
    x.fillStyle='#3a2413';x.fillRect(X,Y,2,16);x.fillStyle=`hsl(${hue(o?B.was:B.af)},75%,50%)`;x.fillRect(X+2,Y+Math.round(Math.sin(now/220+gx)),10,7)});
  if(B.gate){const g=B.gate,X=OX+g.x*CS,Y=OY+g.y*CS; // portão de madeira com barra de vida; destroços quando cai
    if(g.hp>0){x.fillStyle='#5a3a1c';x.fillRect(X+8,Y+6,CS-16,CS-6);x.fillStyle='#8a5a2b';for(let k=0;k<4;k++)x.fillRect(X+10+k*7.5,Y+8,5,CS-10);
      x.fillStyle='#2f2f36';x.fillRect(X+8,Y+16,CS-16,3);x.fillRect(X+8,Y+34,CS-16,3);x.fillStyle='#22140c';x.fillRect(X+4,Y-8,CS-8,7);x.fillStyle='#d0452f';x.fillRect(X+5,Y-7,(CS-10)*g.hp/g.max,5)}
    else{x.fillStyle='#5a3a1c';x.fillRect(X+6,Y+CS-10,14,4);x.fillRect(X+26,Y+CS-8,12,4);x.fillRect(X+16,Y+CS-16,8,3)}
    if(s&&gateFor(s)){x.strokeStyle='#ff3b30';x.lineWidth=3;x.strokeRect(X+1.5,Y+1.5,CS-3,CS-3)}}
  if(B.pr){const X=OX+B.pr.x*CS,Y=OY+B.pr.y*CS;x.fillStyle='#3a2413';x.fillRect(X+CS/2-1,Y-16,3,CS-6); // mastro da praça com a bandeira do dono
    x.fillStyle=`hsl(${hue(B.taken?B.af:B.was)},75%,50%)`;x.fillRect(X+CS/2+2,Y-16+Math.round(Math.sin(now/200)),18,12)}
  B.qt.forEach((o,k)=>{if(o<0)return;const[gx,gy]=k.split(',').map(Number),X=gx*CS+CS-8,Y=gy*CS-6; // bandeira de quem tomou o quartel
    x.fillStyle=`hsl(${hue(o?B.was:B.af)},75%,50%)`;x.fillRect(X,Y+Math.round(Math.sin(now/220+gx)),11,8)});
  (B.goals||[]).forEach(([gx,gy])=>{const X=gx*CS+CS/2,Y=gy*CS+CS/2,p=(Math.sin(now/240)+1)/2; /* objetivo: casa dourada pulsando e estrela */
    x.strokeStyle=`rgba(255,214,90,${.5+.5*p})`;x.lineWidth=3;x.setLineDash([6,4]);x.strokeRect(gx*CS+3,gy*CS+3,CS-6,CS-6);x.setLineDash([]);
    const sy=Y-CS*.9-p*3;x.fillStyle='#22140c';x.beginPath();for(let i=0;i<10;i++){const r=i%2?6:13,an=-Math.PI/2+i*Math.PI/5;x.lineTo(X+Math.cos(an)*(r+2),sy+Math.sin(an)*(r+2))}x.fill();
    x.fillStyle='#ffd23f';x.beginPath();for(let i=0;i<10;i++){const r=i%2?5:11,an=-Math.PI/2+i*Math.PI/5;x.lineTo(X+Math.cos(an)*r,sy+Math.sin(an)*r)}x.fill();
    if(B.obj=='saida'){x.font=FONT(7);x.textAlign='center';x.lineWidth=4;x.strokeStyle='#1a1220';x.strokeText('SAÍDA',X,Y+8);x.fillStyle='#ffd23f';x.fillText('SAÍDA',X,Y+8)}});
  if(B.kind=='emboscada'){const mine=alive(ps);x.fillStyle='rgba(6,12,24,.5)'; // neblina: só se vê perto das suas tropas
    for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++)if(!mine.some(v=>Math.abs(v.x-gx)+Math.abs(v.y-gy)<=3))x.fillRect(OX+gx*CS,OY+gy*CS,CS,CS)}
  const cellBox=(gx,gy,fill)=>{x.fillStyle=fill;x.fillRect(OX+gx*CS+1,OY+gy*CS+1,CS-2,CS-2)};
  const R=s&&!s.moved&&!B.prep?reach(s):[];
  if(B.prep){for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++)if(inZone([gx,gy])&&pass(gx,gy,s)){cellBox(gx,gy,'rgba(110,170,255,.3)');x.strokeStyle='rgba(190,220,255,.8)';x.lineWidth=1;x.strokeRect(OX+gx*CS+.5,OY+gy*CS+.5,CS-1,CS-1)}
    if(s){x.strokeStyle='#fff';x.lineWidth=3;x.strokeRect(OX+s.x*CS+1.5,OY+s.y*CS+1.5,CS-3,CS-3)}}
  R.forEach(([gx,gy])=>{if(gx==s.x&&gy==s.y)return;cellBox(gx,gy,'rgba(255,246,200,.3)');cellBox(gx,gy,HATCH[0]);
    x.strokeStyle='rgba(255,246,200,.9)';x.lineWidth=1;x.strokeRect(OX+gx*CS+.5,OY+gy*CS+.5,CS-1,CS-1)});
  if(s&&!B.prep&&!s.done){const base=R.length?R:[[s.x,s.y]],mv=new Set(base.map(c=>c[0]+','+c[1])),rg=rgOf(s),at=new Set; /* onde ela pode atacar depois de andar */
    base.forEach(([cx,cy])=>{for(let dx=-rg;dx<=rg;dx++)for(let dy=-rg+Math.abs(dx);dy<=rg-Math.abs(dx);dy++){const ax=cx+dx,ay=cy+dy;if(ax>=0&&ay>=0&&ax<GW&&ay<GH&&!mv.has(ax+','+ay))at.add(ax+','+ay)}});
    x.strokeStyle='rgba(255,90,60,.5)';x.lineWidth=1;at.forEach(k=>{const[gx,gy]=k.split(',').map(Number);cellBox(gx,gy,'rgba(255,80,50,.13)');x.strokeRect(OX+gx*CS+2.5,OY+gy*CS+2.5,CS-5,CS-5)})}
  const pk=B.peek&&B.peek.hp>0?B.peek:null;
  if(pk){const PR=reach(pk),rg=rgOf(pk),key=new Set(PR.map(c=>c[0]+','+c[1])); // laranja: onde o inimigo chega; contorno: onde ele alcança atirando ou golpeando
    for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++)if(!key.has(gx+','+gy)&&PR.some(c=>Math.abs(c[0]-gx)+Math.abs(c[1]-gy)<=rg)){x.strokeStyle='rgba(255,90,40,.55)';x.lineWidth=2;x.setLineDash([4,4]);x.strokeRect(OX+gx*CS+3,OY+gy*CS+3,CS-6,CS-6);x.setLineDash([])}
    PR.forEach(([gx,gy])=>{cellBox(gx,gy,'rgba(255,140,30,.38)');x.strokeStyle='#ff8a1e';x.lineWidth=2;x.strokeRect(OX+gx*CS+1,OY+gy*CS+1,CS-2,CS-2)});
    x.strokeStyle='#fff';x.lineWidth=3;x.strokeRect(OX+pk.x*CS+1.5,OY+pk.y*CS+1.5,CS-3,CS-3)}
  if(s&&!B.prep){alive(1-ps).filter(f=>inR(s,f)&&seen(f)).forEach(f=>{cellBox(f.x,f.y,'rgba(255,60,40,.25)');cellBox(f.x,f.y,HATCH[1]);
      x.strokeStyle='#ff3b30';x.lineWidth=3;x.strokeRect(OX+f.x*CS+1.5,OY+f.y*CS+1.5,CS-3,CS-3)});
    x.strokeStyle=`rgba(255,214,90,${.65+.35*Math.sin(now/200)})`;x.lineWidth=3;x.strokeRect(OX+s.x*CS+1.5,OY+s.y*CS+1.5,CS-3,CS-3)}
  let aimT=null;const hv=B.hov&&!B.busy&&B.hov[0]>=0&&B.hov[1]>=0&&B.hov[0]<GW&&B.hov[1]<GH?B.hov:null;
  if(hv&&R.length){ // seta do caminho até a casa sob o cursor
    const m=new Map(R.map(c=>[c[0]+','+c[1],c]));let c=m.get(hv.join());
    if(c&&c[2]){const pts=[];while(c){pts.unshift([OX+c[0]*CS+CS/2,OY+c[1]*CS+CS/2]);c=m.get(c[2])}
      const[ex,ey]=pts.at(-1),[qx,qy]=pts.at(-2),dx=Math.sign(ex-qx),dy=Math.sign(ey-qy);pts[pts.length-1]=[ex-dx*12,ey-dy*12];
      [['#3a2413',18,24],['#f6ecc4',12,18]].forEach(([col,w,hd])=>{x.strokeStyle=x.fillStyle=col;x.lineWidth=w;x.lineJoin='miter';x.lineCap='butt';
        x.beginPath();pts.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.stroke();
        x.beginPath();x.moveTo(ex+dx*(hd-6),ey+dy*(hd-6));x.lineTo(ex-dx*12-dy*hd*.8,ey-dy*12+dx*hd*.8);x.lineTo(ex-dx*12+dy*hd*.8,ey-dy*12-dx*hd*.8);x.fill()})}}
  B.units.filter(u=>(u.hp>0||u.dead>now-450-animLen(u,'queda'))&&seen(u)).sort((a,b)=>a.y-b.y).forEach(u=>drawUnit(u,now));
  if(s&&s.hp>0&&!s.anim){const bob=Math.round(Math.sin(now/180)*3),ax=OX+s.x*CS+CS/2,ay=OY+s.y*CS-(s.ld?72:46)+bob;x.fillStyle='#1a1220';x.beginPath();x.moveTo(ax-10,ay-2);x.lineTo(ax+10,ay-2);x.lineTo(ax,ay+10);x.fill();x.fillStyle='#ffd23f';x.beginPath();x.moveTo(ax-6,ay);x.lineTo(ax+6,ay);x.lineTo(ax,ay+6);x.fill()} /* seta sobre a unidade escolhida */
  if(B.bad&&B.bad.until>now){const X=OX+B.bad.x*CS,Y=OY+B.bad.y*CS,a=(B.bad.until-now)/700;x.strokeStyle=`rgba(255,60,40,${a})`;x.lineWidth=5;x.beginPath();x.moveTo(X+12,Y+12);x.lineTo(X+CS-12,Y+CS-12);x.moveTo(X+CS-12,Y+12);x.lineTo(X+12,Y+CS-12);x.stroke()}
  B.rings=(B.rings||[]).filter(r=>now-r.start<420);B.rings.forEach(r=>{const p=(now-r.start)/420,X=OX+r.x*CS+CS/2,Y=OY+r.y*CS+CS-10; // anel de impacto no chão e faíscas
    x.strokeStyle=`rgba(255,240,200,${1-p})`;x.lineWidth=1+3*(1-p);x.beginPath();x.ellipse(X,Y,8+p*30,3+p*11,0,0,7);x.stroke();
    for(let i=0;i<8;i++){const an=i*.785,r2=10+p*34;x.fillStyle=i%2?'#ffd23f':'#fff';x.fillRect(X+Math.cos(an)*r2-2,Y-16+Math.sin(an)*r2*.6-2,4,4)}});
  B.parts=B.parts.filter(q=>now-q.t<q.life);B.parts.forEach(q=>{const dt=(now-q.t)/1000;x.fillStyle=q.col.replace('A',(1-(now-q.t)/q.life).toFixed(2));x.fillRect(q.x+q.vx*dt,q.y+q.vy*dt+q.g*dt*dt,q.s,q.s)});
  B.fxs=B.fxs.filter(f=>now-f.start<320);
  B.fxs.forEach(f=>{const p=(now-f.start)/320,ax=OX+f.a[0]*CS+CS/2,ay=OY+f.a[1]*CS+CS/2-8,tx=OX+f.t[0]*CS+CS/2,ty=OY+f.t[1]*CS+CS/2-8; // golpe: tiro riscado ou corte, e estilhaço no alvo
    if(f.shot){const q=Math.min(1,p*2.2),q0=Math.max(0,q-.35);x.strokeStyle='#fff3c0';x.lineWidth=4;x.beginPath();x.moveTo(ax+(tx-ax)*q0,ay+(ty-ay)*q0);x.lineTo(ax+(tx-ax)*q,ay+(ty-ay)*q);x.stroke();
      if(p<.3){x.fillStyle='#ffd23f';x.fillRect(ax-7,ay-7,14,14);x.fillStyle='rgba(230,230,230,.7)';x.fillRect(ax-12,ay-22-p*40,16,12)}}
    else if(p<.6){x.strokeStyle='#fff';x.lineWidth=5;x.beginPath();x.arc(tx,ty,24,-2.2+p*3,-.9+p*3);x.stroke()}
    if(p>.3){const r=(p-.3)*46;x.fillStyle=p<.7?'#fff':'#ffd23f';for(let i=0;i<8;i++)x.fillRect(tx+Math.cos(i*.785)*r-3,ty+Math.sin(i*.785)*r-3,6,6)}});
  if(hv){const[hx,hy]=hv,t=B.units.find(v=>v.hp>0&&v.side!=ps&&v.x==hx&&v.y==hy&&seen(v)),X=OX+hx*CS,Y=OY+hy*CS,n=12;
    x.fillStyle='#ffd23f';[[0,0,1,1],[CS,0,-1,1],[0,CS,1,-1],[CS,CS,-1,-1]].forEach(([a,b,sx,sy])=>{x.fillRect(X+a,Y+b,n*sx,3*sy);x.fillRect(X+a,Y+b,3*sx,n*sy)});
    if(s&&t&&inR(s,t)&&!B.busy){aimT=t; // mira girando em volta do alvo
      const cx_=X+CS/2,cy_=Y+CS/2,r=CS*.62,a0=now/500;x.strokeStyle='#1a1220';x.lineWidth=6;x.beginPath();x.arc(cx_,cy_,r,0,7);x.stroke();x.strokeStyle='#ff3b30';x.lineWidth=3;x.beginPath();x.arc(cx_,cy_,r,0,7);x.stroke();
      for(let i=0;i<4;i++){const an=a0+i*Math.PI/2;x.lineWidth=4;x.beginPath();x.moveTo(cx_+Math.cos(an)*(r-9),cy_+Math.sin(an)*(r-9));x.lineTo(cx_+Math.cos(an)*(r+9),cy_+Math.sin(an)*(r+9));x.stroke()}}}
  if(B.wx=='rain'){x.strokeStyle='rgba(200,225,255,.6)';x.lineWidth=2;x.beginPath(); // chuva forte, respingos e raios
    for(let i=0;i<(CFG.q?150:50);i++){const rx=(i*137+now/2.2)%(GW*CS),ry=(i*89+now/1.1)%(GH*CS);x.moveTo(OX+rx,OY+ry);x.lineTo(OX+rx-4,OY+ry+14)}x.stroke();
    for(let i=0;i<14;i++){const h=hash(i,now/300|0),q=(now%300)/300;x.strokeStyle=`rgba(220,235,255,${.6*(1-q)})`;x.lineWidth=1;x.beginPath();x.ellipse(OX+h%(GW*CS),OY+(h>>>9)%(GH*CS),2+q*6,1+q*2,0,0,7);x.stroke()}
    if(now>B.nextBolt){B.bolt=now;B.nextBolt=now+4500+Math.random()*5000;B.boltX=OX+Math.random()*GW*CS;sfx.thunder()}
    if(B.bolt&&now-B.bolt<260&&!CFG.calm){const a=1-(now-B.bolt)/260;x.fillStyle=`rgba(255,255,255,${.45*a})`;x.fillRect(OX,OY,GW*CS,GH*CS);
      x.strokeStyle=`rgba(255,255,220,${a})`;x.lineWidth=3;x.beginPath();let lx=B.boltX,ly=OY;x.moveTo(lx,ly);for(let k=0;k<8;k++){lx+=hash(k,B.bolt%99991)%40-20;ly+=GH*CS/10;x.lineTo(lx,ly)}x.stroke()}}
  if(B.wx=='dry'){const g2=x.createLinearGradient(0,OY,0,OY+GH*CS);g2.addColorStop(0,'rgba(255,170,60,.24)');g2.addColorStop(1,'rgba(255,120,30,.06)');x.fillStyle=g2;x.fillRect(OX,OY,GW*CS,GH*CS);
    const t=(now/5200)%1,dx=OX+t*GW*CS,dy=OY+GH*CS*.6+Math.sin(t*12)*40;for(let k=0;k<12;k++){const a=now/110+k;x.fillStyle='rgba(222,184,112,.4)';x.fillRect(dx+Math.cos(a)*(4+k*2.2),dy-k*5,4,4)}} // redemoinho
  {const tg=TOD[turn%4][2];if(tg[3]){x.fillStyle=`rgba(${tg[0]},${tg[1]},${tg[2]},${tg[3]*.75})`;x.fillRect(OX,OY,GW*CS,GH*CS)}} // período do dia também na batalha
  if(B.cardDrag)cardAimDraw(now);
  x.restore(); /* fim do mundo; daqui para baixo, na tela */
  B.pops=B.pops.filter(p=>p.until>now);x.textAlign='center';x.lineJoin='round'; // números de dano grandes, com contorno e um pulo ao surgir
  B.pops.forEach(p=>{const age=now-p.until+(p.txt.length>4?1100:800),[sx,sy0]=toScreen(p.x*CS+CS/2,p.y*CS+14),sy=sy0-age/22,dmg=p.txt[0]=='-',heal=p.txt[0]=='+',
    sc=age<140?1.6-.6*age/140:1;if(!inView(sx,sy0))return;x.save();x.translate(sx,sy);x.scale(sc,sc);x.font=FONT(p.big?17:dmg?14:heal?11:9);
    x.lineWidth=p.big?7:5;x.strokeStyle='#1a1220';x.strokeText(p.txt,0,0);x.fillStyle=p.big?'#ff6a3c':dmg?'#ffd23f':heal?'#8fe88a':'#fff3c0';x.fillText(p.txt,0,0);x.restore()});
  if(aimT)foreChip(s,aimT);
  if(!B.prep)speedBtns(now);if(miniOn)miniDraw();
  if(B.banner){const Tb=now-B.banner.start;if(Tb>1500)B.banner=null;else{ // balão de pergaminho no meio do campo, com a setinha de continuar
    const a=Math.max(0,Math.min(1,Tb/160,(1500-Tb)/220)),t=B.banner.t,hasF=B.banner.f!=null;x.font=FONT(13);
    const w=Math.min(VW-40,Math.max(360,x.measureText(t).width+(hasF?150:96))),h=74,bx=cw/2-w/2,by=VY+VH/2-h/2+(1-a)*10;
    x.save();x.globalAlpha=a;x.fillStyle='rgba(20,12,14,.22)';x.fillRect(VX,VY,VW,VH);parch(x,bx,by,w,h,18);
    if(hasF){x.fillStyle='#3b2618';x.fillRect(bx+13,by+8,60,58);x.fillStyle='#d8b878';x.fillRect(bx+14,by+9,58,56);x.drawImage(fcv[B.banner.f],bx+17,by+11,52,52)} // retrato do líder no poder
    else{x.fillStyle='#3b2618';x.beginPath();x.arc(bx+30,by+h/2,9,0,7);x.fill();x.fillStyle=B.banner.col;x.beginPath();x.arc(bx+30,by+h/2,7,0,7);x.fill();x.fillStyle='rgba(255,255,255,.55)';x.fillRect(bx+26,by+h/2-5,3,3)} // gema na cor do aviso
    x.font=FONT(13);x.textAlign='center';x.fillStyle='#3a2a1f';x.fillText(t,bx+w/2+(hasF?34:12),by+h/2-13,w-(hasF?110:70));
    const ay=by+h-22+Math.round(Math.sin(now/150)*2);x.fillStyle='#6b4a2e';x.beginPath();x.moveTo(bx+w-30,ay);x.lineTo(bx+w-16,ay);x.lineTo(bx+w-23,ay+8);x.fill();x.restore()}}
  if(B.phase)phaseDraw(now);
  x.restore();
  if(B.cut){const T=now-B.cut.start;if(T>1700)B.cut=null;else{ // entrada do líder: campo escurece, faixa diagonal na cor da facção, rosto grande entra pela direita
    const a=Math.min(1,T/200,(1700-T)/250),sl=T<260?1-T/260:T>1450?-(T-1450)/250:0,f=B.cut.f,ch=cv.height,cy=ch/2+20,h0=180,top=cy-h0/2;
    x.save();x.fillStyle=`rgba(12,6,10,${.62*a})`;x.fillRect(0,0,cw,ch);x.globalAlpha=a;
    x.fillStyle='#1a1220';x.beginPath();x.moveTo(-20,top+34);x.lineTo(cw+20,top-6);x.lineTo(cw+20,top+h0+6);x.lineTo(-20,top+h0+46);x.fill();
    x.fillStyle=`hsl(${hue(f)},62%,36%)`;x.beginPath();x.moveTo(-20,top+40);x.lineTo(cw+20,top);x.lineTo(cw+20,top+h0);x.lineTo(-20,top+h0+40);x.fill();
    x.fillStyle='rgba(255,255,255,.14)';for(let i=0;i<16;i++){const yy=top+16+(i*41)%(h0+10),ln=70+(i*53)%170;x.fillRect((i*131+T*1.8)%(cw+260)-260,yy,ln,2)} // linhas de velocidade
    const px_=cw-290+sl*420;x.imageSmoothingEnabled=false;x.fillStyle='#1a1220';x.fillRect(px_-7,cy-132,262,262);x.fillStyle='#d8b878';x.fillRect(px_-4,cy-129,256,256);x.drawImage(fcv[f],px_,cy-125,248,248);
    scriptT(x,POW[B.cut.k][0]+'!',56-sl*360,cy-46,58,'left');x.textAlign='left';x.font=FONT(11);x.fillStyle='#f3e7cf';x.fillText(S[f][4],62-sl*360,cy+24);
    x.font=FONT(8);x.fillStyle='#e8dcc0';x.fillText(POW[B.cut.k][1],62-sl*360,cy+52,cw-380);x.restore()}}
  if(B.clash&&now<B.clash.until)drawClash(now);
  if(ent<1){x.fillStyle=`rgba(0,0,0,${1-ent})`;x.fillRect(0,0,cw,cv.height)}}
const ICON=new Map, icon=(type,f,mine,ldr)=>{const k=[type,f,mine,ldr].join(); // sprite como imagem para os painéis
  if(!ICON.has(k))ICON.set(k,sprite({type,ld:ldr,sk:L[f][0]},f,mine,0).toDataURL());return ICON.get(k)};


// ---------- placar no topo: uma faixa por lado com o líder e uma ficha clicável por unidade ----------
function teamBar(sd,X,now){const f=sd?B.was:B.af,mine=sd==B.ps,W=262,L=!sd,al=L?'left':'right',hid=B.kind=='emboscada'&&!mine,col=mine?'#4f8fff':'#e0483a';
  lac(x,X,8,W,96,12);x.fillStyle=col;x.fillRect(X+10,10,W-20,3);
  const su=[B.selU,B.peek].find(u=>u&&u.hp>0&&u.side==sd&&seen(u));
  if(su)unitRow(su,X,sd);else{const px_=L?X+10:X+W-54;x.fillStyle='#140c0e';x.fillRect(px_-2,17,48,48);x.fillStyle=mine?'#e2a83c':'#9c7a44';x.fillRect(px_-1,18,46,46);x.drawImage(fcv[f],px_,19,44,44);
    const tx=L?X+62:X+W-62;scriptT(x,(mine?'Você · ':'')+(sd?'Defensor':'Atacante'),tx,15,16,al,W-72);x.textAlign=al;x.font=FONT(7.5);x.fillStyle='#f3e7cf';x.fillText(S[f][4],tx,36,W-72);
    x.fillStyle='#d9c8a8';x.fillText((hid?'?':total(sd)+' tropas · '+alive(sd).length+' unidades'),tx,50,W-72)}
  const us=B.units.filter(u=>u.side==sd&&(u.j>=0||u.hp>0)),n=us.length,cw_=Math.min(24,Math.floor((W-14)/Math.max(1,n))),y0=70;
  us.forEach((u,k)=>{const cx_=L?X+7+k*cw_:X+W-7-(k+1)*cw_,dead=u.hp<=0,unk=hid&&!seen(u),on=u==B.selU||u==B.peek;
    x.fillStyle=dead?'#241c20':mine?'#1f2f5a':'#4a1e1a';x.fillRect(cx_+1,y0,cw_-2,30);
    if(!dead&&!unk){const sp=sprite(u,f,mine,0),sh=(cw_-2)*72/78;x.save();if(u.done&&mine&&!B.busy)x.globalAlpha=.4;
      if(L)x.drawImage(sp,cx_+1,y0+1,cw_-2,sh);else{x.translate(cx_+cw_-1,0);x.scale(-1,1);x.drawImage(sp,0,y0+1,cw_-2,sh)}x.restore();
      x.fillStyle='#1a1220';x.fillRect(cx_+2,y0+24,cw_-4,5);x.fillStyle=col;x.fillRect(cx_+2,y0+25,(cw_-4)*Math.min(1,u.hp/u.max),3);if(u.ld){x.fillStyle='#ffd23f';x.fillRect(cx_+2,y0+2,4,4)}}
    else if(dead){x.strokeStyle='#8a3a30';x.lineWidth=2;x.beginPath();x.moveTo(cx_+5,y0+6);x.lineTo(cx_+cw_-5,y0+22);x.moveTo(cx_+cw_-5,y0+6);x.lineTo(cx_+5,y0+22);x.stroke()}
    else{x.font=FONT(8);x.textAlign='center';x.fillStyle='#d9c8a8';x.fillText('?',cx_+cw_/2,y0+6)}
    if(on){x.strokeStyle='#ffd23f';x.lineWidth=2;x.strokeRect(cx_+1,y0,cw_-2,30)}
    if(!dead&&!unk)B.hud.push({x:cx_,y:y0,w:cw_,h:30,u})})}
function unitRow(u,X,sd){ /* ficha da unidade escolhida no alto da faixa do lado dela */
  const L=!sd,f=u.side?B.was:B.af,mine=u.side==B.ps,W=262,al=L?'left':'right',ix_=L?X+8:X+W-56;
  x.fillStyle='#2e2a3a';x.fillRect(ix_,16,48,50);x.fillStyle=`hsl(${hue(f)},60%,40%)`;x.fillRect(ix_,62,48,4);
  x.save();if(L)x.drawImage(sprite(u,f,mine,0),ix_,18,48,44);else{x.translate(ix_+48,0);x.scale(-1,1);x.drawImage(sprite(u,f,mine,0),0,18,48,44)}x.restore();
  const tx=L?X+62:X+W-62,bw=W-74,bx=L?tx:tx-bw;scriptT(x,nmOf(u)+(u.ld?' ★':''),tx,14,15,al,bw);
  x.fillStyle='#1a1220';x.fillRect(bx-1,35,bw+2,12);x.fillStyle='#5a2a22';x.fillRect(bx,36,bw,10);x.fillStyle=mine?'#6f9fff':'#e0583f';x.fillRect(bx,36,bw*u.hp/u.max,10);
  x.font=FONT(6.5);x.fillStyle='#fff';x.textAlign='center';x.fillText(`${u.hp}/${u.max}`,bx+bw/2,34.5);
  x.textAlign=al;x.font=FONT(7);x.fillStyle='#f3e7cf';x.fillText(`Anda ${mvOf(u)} · Alcance ${rgOf(u)}${u.lv?' · nível '+u.lv:''}${u.done&&mine?' · já agiu':''}`,tx,50,bw)}
function skull(X,Y,k=2){const P=['.#####.','#######','#..#..#','#######','.##.##.','.#.#.#.'];
  [['#1a1220',1],['#1a1220',-1],['#f3e7cf',0]].forEach(([c,o])=>{x.fillStyle=c;P.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch=='#')x.fillRect(X+i*k+o,Y+j*k+Math.abs(o),k,k)}))})}
function foreChip(s,t){ /* prévia colada no alvo: quanto tira, vida antes → depois, caveira se derruba e o revide */
  const d0=Math.min(t.hp,Math.max(1,Math.round(est(s,t)))),left=t.hp-d0,d1=left>0&&t.type!='art'&&dist(s,t)<=rgOf(t)?Math.min(s.hp,Math.max(1,Math.round(est({...t,hp:left},s,true)))):0,
    kill=left<=0,pct=Math.round(d0/t.hp*100),fs=s.side?B.was:B.af,ft=t.side?B.was:B.af,[sx,sy]=toScreen(t.x*CS+CS/2,t.y*CS),w=200,h=d1?78:54;
  let bx=Math.max(VX+4,Math.min(VX+VW-w-4,sx-w/2)),by=sy-h-40,below=by<VY+4;if(below)by=toScreen(0,(t.y+1)*CS)[1]+10;
  lac(x,bx,by,w,h,10);x.fillStyle='#140c0e';const tx_=Math.max(bx+14,Math.min(bx+w-14,sx));x.beginPath();if(below){x.moveTo(tx_-9,by+1);x.lineTo(tx_+9,by+1);x.lineTo(tx_,by-9)}else{x.moveTo(tx_-9,by+h-1);x.lineTo(tx_+9,by+h-1);x.lineTo(tx_,by+h+9)}x.fill();
  x.fillStyle='#2e2a3a';x.fillRect(bx+6,by+6,42,42);x.save();x.translate(bx+48,0);x.scale(-1,1);x.drawImage(sprite(t,ft,t.side==B.ps,0),0,by+8,42,39);x.restore();
  x.textAlign='left';x.lineJoin='round';x.font=FONT(14);const big=kill?'ABATE':`-${pct}%`;x.lineWidth=6;x.strokeStyle='#1a1220';x.strokeText(big,bx+56,by+7);x.fillStyle=kill?'#ff6a3c':'#ffd23f';x.fillText(big,bx+56,by+7);
  if(kill)skull(bx+w-24,by+9);else if(beats(s,t)){x.font=FONT(7);x.fillStyle='#8fe88a';x.fillText('▲ vantagem',bx+w-70,by+10)}
  x.font=FONT(8);x.fillStyle='#f3e7cf';x.fillText(`${nmOf(t)}  ${t.hp} → `,bx+56,by+30,w-90);const lw=Math.min(w-90,x.measureText(`${nmOf(t)}  ${t.hp} → `).width);x.fillStyle=kill?'#ff6a3c':'#ffb3a6';x.fillText(''+left,bx+56+lw,by+30);
  if(d1){x.fillStyle='rgba(255,255,255,.15)';x.fillRect(bx+8,by+52,w-16,1);x.drawImage(sprite(s,fs,s.side==B.ps,0),bx+8,by+54,22,20);
    x.font=FONT(7.5);x.fillStyle='#d9c8a8';x.fillText(`Revide −${d1}: você ${s.hp} → `,bx+34,by+57,w-60);const rw=Math.min(w-60,x.measureText(`Revide −${d1}: você ${s.hp} → `).width);x.fillStyle=s.hp-d1<=0?'#ff6a3c':'#ffb3a6';x.fillText(''+(s.hp-d1),bx+34+rw,by+57)}}
function speedBtns(){ /* velocidade do turno inimigo e "pular": valem durante a fase do inimigo */
  const items=[['×1',{spd:1}],['×2',{spd:2}],['×4',{spd:4}],...(B.busy&&!B.auto?[['Pular ▸▸',{skip:1}]]:[])];let X=VX+VW-6;const Y=VY+6;x.font=FONT(7.5);x.textAlign='center';
  for(let i=items.length-1;i>=0;i--){const[t,a]=items[i],w=Math.ceil(x.measureText(t).width)+16,on=a.spd==bFast;X-=w;
    x.fillStyle='rgba(20,12,14,.82)';rr(x,X,Y,w,24,6);x.fill();if(on||a.skip){x.strokeStyle=a.skip?'#ff8a1e':'#ffd23f';x.lineWidth=2;rr(x,X+1,Y+1,w-2,22,5);x.stroke()}
    x.fillStyle=on?'#ffd23f':'#f3e7cf';x.fillText(t,X+w/2,Y+3);B.hud.push({x:X,y:Y,w,h:24,...a});X-=4}
  x.textAlign='right';x.font=FONT(6.5);x.lineWidth=4;x.strokeStyle='#1a1220';x.strokeText('Turno inimigo',X-2,Y+6);x.fillStyle='#f3e7cf';x.fillText('Turno inimigo',X-2,Y+6)}
let miniOn=true;
function miniDraw(){const mm=B.bg.mini,k=Math.min(150/GW,96/GH),w=GW*k,h=GH*k,X=VX+VW-w-8,Y=VY+VH-h-8,c=B.cam; /* minimapa: terreno, unidades, objetivos e o quadro da câmera */
  x.fillStyle='rgba(20,12,14,.85)';x.fillRect(X-4,Y-4,w+8,h+8);x.imageSmoothingEnabled=false;x.globalAlpha=.9;x.drawImage(mm,X,Y,w,h);x.globalAlpha=1;
  (B.goals||[]).forEach(([gx,gy])=>{x.fillStyle='#ffd23f';x.fillRect(X+gx*k-1,Y+gy*k-1,k+2,k+2)});
  B.units.forEach(u=>{if(u.hp<=0||!seen(u))return;x.fillStyle='#1a1220';x.fillRect(X+u.x*k+k/2-3,Y+u.y*k+k/2-3,6,6);x.fillStyle=u.side==B.ps?'#6fb0ff':'#ff5a48';x.fillRect(X+u.x*k+k/2-2,Y+u.y*k+k/2-2,4,4)});
  const rx=Math.max(X,X+c.x/CS*k),ry=Math.max(Y,Y+c.y/CS*k);x.strokeStyle='#fff';x.lineWidth=1.5;x.strokeRect(rx,ry,Math.min(X+w,X+(c.x+VW/c.z)/CS*k)-rx,Math.min(Y+h,Y+(c.y+VH/c.z)/CS*k)-ry);
  B.hud.push({x:X,y:Y,w,h,mini:1})}
function phaseDraw(now){const P=B.phase,T=now-P.start,D=1300,cw=cv.width;if(T>D){B.phase=null;return} /* faixa de fase: entra pela esquerda, para, sai pela direita */
  const e=t=>1-Math.pow(1-t,3),inn=Math.min(1,T/220),out=T>D-280?(T-D+280)/280:0,off=(1-e(inn))*-cw+e(out)*cw,cy=VY+VH/2,h=92;
  x.save();x.fillStyle=`rgba(10,6,12,${.4*inn*(1-out)})`;x.fillRect(VX,VY,VW,VH);x.translate(off,0);
  x.fillStyle='#1a1220';x.beginPath();x.moveTo(-60,cy-h/2+8);x.lineTo(cw+60,cy-h/2-12);x.lineTo(cw+60,cy+h/2-4);x.lineTo(-60,cy+h/2+16);x.fill();
  x.fillStyle=P.mine?'#2f5fc0':'#b0362a';x.beginPath();x.moveTo(-60,cy-h/2+14);x.lineTo(cw+60,cy-h/2-6);x.lineTo(cw+60,cy+h/2-10);x.lineTo(-60,cy+h/2+10);x.fill();
  x.fillStyle='rgba(255,255,255,.16)';for(let i=0;i<14;i++){const yy=cy-h/2+12+(i*29)%(h-16),ln=60+(i*53)%160;x.fillRect((i*131+T*2.2)%(cw+240)-240,yy,ln,2)}
  scriptT(x,P.t,cw/2,cy-36,46,'center');x.font=FONT(8.5);x.textAlign='center';x.fillStyle='#f3e7cf';x.fillText(P.sub,cw/2,cy+20);x.restore()}
function cardAimDraw(now){const c=CARDS[B.cardDrag.id],p=(Math.sin(now/180)+1)/2,foe=c[3]=='foe',h=B.cardDrag.cell; /* carta sendo arrastada: alvos possíveis acesos */
  (foe?alive(1-B.ps).filter(seen):alive(B.ps)).forEach(u=>{x.strokeStyle=foe?`rgba(255,120,40,${.5+.5*p})`:`rgba(120,200,255,${.5+.5*p})`;x.lineWidth=3;x.strokeRect(u.x*CS+2,u.y*CS+2,CS-4,CS-4)});
  if(h&&h[0]>=0){x.fillStyle='rgba(255,214,90,.28)';x.fillRect(h[0]*CS,h[1]*CS,CS,CS)}}
