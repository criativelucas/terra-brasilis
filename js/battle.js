// batalha tática: turno, IA de campo, cena de combate, desenho

function nextRaid(){
  const r=raids.shift();if(!r){closeTurn();return ui()}
  if(over||owner[r.to]!=me||owner[r.from]!=r.f||troops[r.from]<2)return nextRaid(); // situação mudou desde a ordem
  tactical(r.from,r.to,troops[r.from]-1,1);ui()}
tactical=(from,to,n,ps=0)=>zoomTo(from,to,()=>{startBattle(from,to,n,ps);ui()}); // câmera fecha no alvo, depois abre o campo
const startBattle=(from,to,n,ps)=>{tutEv('battle'); // ps: lado do jogador (0 ataca pela esquerda, 1 defende pela direita)
  const af=owner[from],was=owner[to],bio=BIO[BOF[to]],T=genMap(bio);
  const side=(sd,tot)=>{const k=Math.min(6,Math.ceil(tot/4)),f=sd?was:af,E=ELITE[S[sd?to:from][0]],TY=['inf','cav','ati','inf','cav','art'];
    return Array.from({length:k},(_,j)=>({side:sd,type:TY[j],el:E&&E[1]==TY[j]?E:null,x:sd?GW-1:0,y:Math.floor((j+.5)*GH/k),
      j,lv:lvl(xp[sd?to:from][j]),hits:0,hp:Math.floor(tot/k)+(j<tot%k?1:0),max:Math.floor(tot/k)+(j<tot%k?1:0),moved:false,done:false,ld:!j,sk:j?'LTBDT'[(f+j)%5]:L[f][0],ph:j*.37}))};
  const[bg,g]=mk(GW*CS,GH*CS);for(let y=0;y<GH;y++)for(let c=0;c<GW;c++)tile(g,T,c,y,bio);
  for(let y=0;y<GH;y++)for(let c=0;c<GW;c++)if('mfv'.includes(T[y][c])){const X=c*CS,Y=y*CS; // sombra projetada para sudeste
    g.fillStyle='rgba(10,20,50,.22)';g.beginPath();g.moveTo(X+6,Y+CS-5);g.lineTo(X+CS+2,Y+CS-5);g.lineTo(X+CS+16,Y+CS+9);g.lineTo(X+20,Y+CS+9);g.fill()}
  const lg=g.createLinearGradient(0,0,GW*CS,GH*CS);lg.addColorStop(0,'rgba(255,236,170,.24)');lg.addColorStop(.5,'rgba(255,255,255,0)');lg.addColorStop(1,'rgba(20,10,60,.3)');
  g.fillStyle=lg;g.fillRect(0,0,GW*CS,GH*CS); // sol de noroeste
  g.strokeStyle='rgba(0,0,0,.07)';g.lineWidth=1;for(let c=1;c<GW;c++)g.strokeRect(c*CS-.5,-1,0,GH*CS+2);for(let y=1;y<GH;y++)g.strokeRect(-1,y*CS-.5,GW*CS+2,0);
  B={from,to,n,ps,af,was,T,bg,bio,rl:[0,0],wx:BOF[to]=='ama'&&Math.random()<.5?'rain':BOF[to]=='ser'&&Math.random()<.5?'dry':null,units:[...side(0,n),...side(1,troops[to])],round:1,selU:null,pops:[],fxs:[],busy:false,hov:null};
  const b0=B;(function loop(){if(B!==b0)return;drawBattle();requestAnimationFrame(loop)})()};
function reach(u){ // casas alcançáveis: [x,y,chave da casa anterior]
  const mv=mvOf(u),seen=new Map([[u.x+','+u.y,[u.x,u.y,null]]]),q=[[u.x,u.y,0]],occ=new Set(B.units.filter(v=>v.hp>0&&v!=u).map(v=>v.x+','+v.y));
  while(q.length){const[cx,cy,d]=q.shift();if(d==mv)continue;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const nx=cx+dx,ny=cy+dy,k=nx+','+ny;
      if(nx<0||ny<0||nx>=GW||ny>=GH||seen.has(k)||'mw'.includes(B.T[ny][nx])||occ.has(k))return;seen.set(k,[nx,ny,cx+','+cy]);q.push([nx,ny,d+1])})}
  return[...seen.values()]}
const sleep=ms=>new Promise(r=>setTimeout(r,ms)), clashLeft=()=>B&&B.clash?Math.max(0,B.clash.until-Date.now()):0;
const STEP=120; // ms por casa andada
function walk(u,gx,gy,R){ // move na lógica já; o desenho percorre o caminho casa a casa
  const m=new Map(R.map(c=>[c[0]+','+c[1],c])),pts=[];let c=m.get(gx+','+gy);while(c){pts.unshift([c[0],c[1]]);c=m.get(c[2])}
  u.x=gx;u.y=gy;u.anim={pts,start:Date.now()};const d=(pts.length-1)*STEP;B.lock=Date.now()+d;return d}
function hit(a,t,back){ // aplica o dano na hora; a cena de combate é só a encenação do que já aconteceu
  const ha0=a.hp,ht0=t.hp,d=Math.min(t.hp,Math.max(1,Math.round(est(a,t,back)*roll())));t.hp-=d;a.hits++;
  a.lunge={dx:Math.sign(t.x-a.x),dy:Math.sign(t.y-a.y),until:Date.now()+180};t.flash=Date.now()+220;
  B.pops.push({x:t.x,y:t.y,txt:'-'+d,until:Date.now()+800});sfx.hit();
  B.fxs.push({a:[a.x,a.y],t:[t.x,t.y],shot:dist(a,t)>1,start:Date.now()});B.shake=Date.now()+160;if(t.hp<=0)t.dead=Date.now()+200;
  if(back)return d;
  a.done=true;const d1=t.hp>0&&t.type!='art'&&dist(a,t)<=rgOf(t)?hit(t,a,true):0;
  if(CFG.clash&&!B.auto)B.clash={a,t,ha0,ht0,d0:d,d1,start:Date.now(),until:Date.now()+1500}}
function drawClash(now){ // dois quadros: unidade do atacante à esquerda do campo, do defensor à direita
  const c=B.clash,p=(now-c.start)/1500,w=320,h=300,by=178;
  x.fillStyle='rgba(10,6,20,.62)';x.fillRect(0,OY-5,cv.width,GH*CS+10);
  [[c.a.side?c.t:c.a,70],[c.a.side?c.a:c.t,420]].forEach(([u,bx])=>{
    const isA=u==c.a,f=u.side?B.was:B.af,mine=u.side==B.ps,dir=u.side?-1:1,h0=isA?c.ha0:c.ht0,dmg=isA?c.d1:c.d0,tHit=isA?.78:.42,
      hp=p>tHit?h0-dmg:h0,strikes=isA?p>.2&&p<.42:c.d1>0&&p>.58&&p<.78,hurt=dmg>0&&p>tHit&&p<tHit+.14,tl=B.T[u.y][u.x];
    x.fillStyle='#22140c';x.fillRect(bx-9,by-9,w+18,h+18);x.fillStyle='#f6ecc4';x.fillRect(bx-6,by-6,w+12,h+12);
    const sky=x.createLinearGradient(0,by,0,by+170);sky.addColorStop(0,'#6fbdf0');sky.addColorStop(1,'#dff2fc');x.fillStyle=sky;x.fillRect(bx,by,w,h);
    x.fillStyle='rgba(255,255,255,.85)';x.fillRect(bx+20+now/70%60,by+78,84,12);x.fillRect(bx+36+now/70%60,by+68,44,10);x.fillRect(bx+200-now/90%50,by+104,96,10);
    x.fillStyle=tl=='r'||tl=='b'?'#c79a5e':B.bio.g[0];x.fillRect(bx,by+160,w,h-160);x.fillStyle=B.bio.gd;x.fillRect(bx,by+160,w,6);
    for(let k=0;k<14;k++){const v=hash(k,u.x+7);x.fillStyle=k%2?B.bio.gd:B.bio.gl;x.fillRect(bx+v%(w-12),by+172+(v>>>5)%118,12,4)}
    if(cover(u)){const q=(a,b,ww,hh,col)=>{x.fillStyle=col;x.fillRect(bx+a*5,by+b*5,ww*5,hh*5)};[[2,22],[52,23],[27,20]].forEach(([a,b],k)=>tree(q,B.bio.tree,a,b,k))}
    const n=hp>0?Math.min(5,Math.ceil(hp/2)):0,fr=(now/200|0)%2,off=strikes?Math.sin((p-(isA?.2:.58))/.2*Math.PI)*46*dir:hurt?(now/30|0)%2*8-4:0;
    [[160,196],[84,222],[236,226],[122,268],[208,274]].slice(0,n).forEach(([sx,sy])=>{const X=bx+(dir>0?sx:w-sx)+off,sp=sprite(u,f,mine,fr);
      x.fillStyle='rgba(0,0,0,.25)';x.fillRect(X-34,by+sy-8,68,10);
      x.save();x.translate(X-dir*65,by+sy-120);x.scale(dir,1);x.drawImage(sp,0,0,130,120);
      if(hurt){x.globalCompositeOperation='lighter';x.drawImage(sp,0,0,130,120)}x.restore()});
    const px_=dir>0?bx+8:bx+w-56,tx=dir>0?bx+64:bx+w-64; // cabeçalho: retrato, tipo, barra de vida
    x.fillStyle='#22140c';x.fillRect(px_-3,by+5,54,54);x.drawImage(fcv[f],px_,by+8,48,48);
    x.textAlign=dir>0?'left':'right';x.font=FONT(8);x.fillStyle='#22140c';x.fillText(nmOf(u)+(cover(u)?' · abrigo':''),tx,by+12);
    const bw=180,bx0=dir>0?tx:tx-bw;x.fillRect(bx0-2,by+26,bw+4,18);x.fillStyle='#5a2a22';x.fillRect(bx0,by+28,bw,14);
    x.fillStyle=mine?'#2f6fe0':'#d0452f';x.fillRect(bx0,by+28,bw*hp/u.max,14);
    x.fillStyle='#fff';x.textAlign='center';x.fillText(`${hp}/${u.max}`,bx0+bw/2,by+31);
    if(dmg>0&&p>tHit){x.font=FONT(22);x.fillStyle='#22140c';x.fillText('-'+dmg,bx+w/2+3,by+113-(p-tHit)*60);x.fillStyle='#ffd23f';x.fillText('-'+dmg,bx+w/2,by+110-(p-tHit)*60)}
    if(!hp&&p>tHit){x.font=FONT(12);x.fillStyle='#b3312a';x.fillText('DERROTADOS',bx+w/2,by+220)}})}
async function aiSide(sd,ms){
  const b0=B,ldr=B.units.find(u=>u.side==sd&&u.ld);
  if(!B.rl[sd]&&sd!=B.ps&&(B.round>=3||ldr.hp<ldr.max/2||(B.round>=2&&total(sd)<total(1-sd)))){B.rl[sd]=B.round; // a IA usa o brado quando aperta
    B.pops.push({x:ldr.x,y:ldr.y,txt:'BRADO!',until:Date.now()+1100});sfx.win();await sleep(500);if(B!==b0)return}
  for(const u of alive(sd)){
    if(B!==b0||bOver())return;
    const pri=p=>dist(u,p)-(BEATS[u.type]==p.type?1.5:0)-(p.ld?.5:0),t=alive(1-sd).sort((p,q)=>pri(p)-pri(q))[0]; if(u.hp<=0||!t)continue; // prefere quem ela vence e o comandante
    const rg=rgOf(u),far=c=>Math.abs(Math.abs(c[0]-t.x)+Math.abs(c[1]-t.y)-(rg>1?2:1))-('fv'.includes(B.T[c[1]][c[0]])?.6:0); // fica à distância de tiro e busca abrigo
    if(!inR(u,t)&&(!u.ld||dist(u,t)<=4)){ // comandante só se mexe com o inimigo perto
     const R=reach(u),c=[...R].sort((p,q)=>far(p)-far(q))[0]; // comandante segura posição
      const d=walk(u,c[0],c[1],R);await sleep(B.auto?40:d+80);if(B!==b0)return} // no automático não espera a caminhada
    if(inR(u,t))hit(u,t);
    await sleep(ms*SPD[CFG.speed]+clashLeft())}}
async function bEnd(auto){
  if(B.busy)return;const b0=B;B.busy=true;B.selU=B.undo=null;B.auto=!!auto;ui();
  await sleep(Math.max(clashLeft(),(B.lock||0)-Date.now(),0)+150);if(B!==b0)return;
  do{if(auto)await aiSide(B.ps,140);
    if(B!==b0)return;
    if(!bOver())await aiSide(1-B.ps,auto?140:320);
    if(B!==b0)return;
    B.round++;B.units.forEach(u=>u.moved=u.done=false)}while(auto&&!bOver());
  B.busy=false;bOver()?bFinish():ui()}
function bFinish(){tutEv('bdone');
  const{from,to,n,was,af,ps}=B,a=total(0),d=total(1),won=!ld(1)&&ld(0); // won = atacante venceu
  troops[from]-=n;
  // experiência: regimento que sobreviveu ganha 1, mais 1 se acertou golpes, mais 1 se o lado venceu
  for(const sd of[0,1]){const st=sd?to:from,win=sd?!won:won;B.units.filter(u=>u.side==sd).forEach(u=>{if(u.hp>0)xp[st][u.j]+=1+(u.hits>0)+win})}
  if(won)xp[to]=[...xp[from]];
  if(won){fort[to]=0;owner[to]=af;troops[to]=Math.max(1,a)}else{troops[to]=Math.max(1,d);troops[from]+=a}
  if(ps)say(won?`${S[af][4]} tomou ${S[to][0]} de você!`:`Você repeliu ${S[af][4]} em ${S[to][0]}`);
  else{say(won?`Você conquistou ${S[to][1]} de ${S[was][4]}`:a?`Recuo em ${S[to][1]}`:`Derrota em ${S[to][1]}`);moved.add(from).add(to)}
  sel=to;B=null;check();onFight(af,was,to,won);
  ps?nextRaid():ui()}
function bClick(e){
  if(B.busy||clashLeft()||B.lock>Date.now())return;
  const[gx,gy]=bCell(e),b0=B;let R;
  const u=B.units.find(v=>v.hp>0&&v.x==gx&&v.y==gy),s=B.selU;
  if(u&&u.side==B.ps){B.selU=u.done?null:u;B.peek=null;sfx.sel()}
  else if(s&&u&&inR(s,u)){hit(s,u);B.selU=B.undo=null}
  else if(s&&!u&&!s.moved&&(R=reach(s)).some(c=>c[0]==gx&&c[1]==gy)){B.undo={u:s,x:s.x,y:s.y};walk(s,gx,gy,R);s.moved=true;sfx.move();tutEv('bmove');
    if(!alive(1-B.ps).some(f=>inR(s,f))){s.done=true;B.selU=null}}
  else{B.selU=null;B.peek=u&&B.peek!=u?u:null;if(u)sfx.sel()} // inimigo fora de alcance: espia o movimento dele
  if(bOver()){B.busy=true;setTimeout(()=>B===b0&&bFinish(),700+clashLeft())}
  else if(alive(B.ps).every(v=>v.done))return bEnd(); // todas as unidades agiram: a rodada passa sozinha para o inimigo
  ui()}
function drawUnit(u,now){
  let vx=u.x,vy=u.y,hop=0,face=u.side?-1:1;const an=u.anim;
  if(an){const t=(now-an.start)/STEP,i=Math.floor(t);if(i>=an.pts.length-1)u.anim=null;
    else{const[a,b]=an.pts[i],[c,d]=an.pts[i+1],fr=t-i;vx=a+(c-a)*fr;vy=b+(d-b)*fr;hop=Math.sin(fr*Math.PI)*9;if(c!=a)face=c>a?1:-1}}
  const f=u.side?B.was:B.af,mine=u.side==B.ps,k=u.lunge&&u.lunge.until>now?16:0,
    px_=OX+vx*CS+(k&&u.lunge.dx*k),py=OY+vy*CS+(k&&u.lunge.dy*k),sp=sprite(u,f,mine,u.anim?(now/90|0)%2:u.done?0:((now/420+u.ph)|0)%2);
  x.fillStyle='rgba(0,0,0,.28)';x.fillRect(px_+CS/2-18+hop/2,py+CS-9,36-hop,6);
  const dead=u.hp<=0?Math.max(0,(now-u.dead)/450):0;x.save();x.globalAlpha=u.hp<=0?Math.max(0,1-dead):u.done&&!u.anim?.6:1;
  if(face<0){x.translate(px_+CS/2+39,py+CS-74-hop+dead*14);x.scale(-1,1)}else x.translate(px_+CS/2-39,py+CS-74-hop+dead*14);
  x.drawImage(sp,0,0,78,72);
  if(u.flash>now){x.globalCompositeOperation='lighter';x.drawImage(sp,0,0,78,72);x.globalCompositeOperation='source-over'}
  x.restore();
  if(u.hp<=0)return;
  if(u.ld){const bx=u.side?px_+CS-24:px_-2;x.fillStyle='#22140c';x.fillRect(bx-3,py-23,30,30);x.fillStyle='#ffd23f';x.fillRect(bx-2,py-22,28,28);x.drawImage(fcv[f],bx,py-20,24,24)}
  const t=''+u.hp,w=t.length*8+7,hx=u.side?px_+1:px_+CS-w-1;x.fillStyle='#fff';x.fillRect(hx-1,py+CS-17,w+2,15);
  x.fillStyle=mine?'#1d3fa8':'#22140c';x.fillRect(hx,py+CS-16,w,13);x.fillStyle='#fff';x.textAlign='left';x.font=FONT(8);x.fillText(t,hx+4,py+CS-13);
  if(u.el){x.fillStyle='#22140c';x.fillRect(hx+w-4,py+CS-24,9,9);x.fillStyle='#ffd23f';x.fillRect(hx+w-3,py+CS-23,7,7)} // selo de elite
  for(let k=0;k<u.lv;k++){const cx_=u.side?px_+CS-8:px_+6,cy_=py+CS-26-k*5;x.fillStyle='#22140c';x.fillRect(cx_-4,cy_-1,9,5);x.fillStyle='#ffd23f';x.fillRect(cx_-3,cy_,3,2);x.fillRect(cx_,cy_+1,1,2);x.fillRect(cx_+1,cy_,3,2)}} // divisas de nível
function drawBattle(){
  const now=Date.now(),s=B.selU,ps=B.ps,cw=cv.width;
  x.fillStyle='#161126';x.fillRect(0,0,cw,cv.height);x.textBaseline='top';
  x.save();if(B.shake>now&&CFG.shake)x.translate((Math.random()-.5)*8,(Math.random()-.5)*8);
  [[B.af,OX,'left',0],[B.was,cw-OX-80,'right',1]].forEach(([f,px_,al,sd])=>{
    x.fillStyle=sd==ps?'#ffd23f':'#8a5a2b';x.fillRect(px_-3,13,86,86);x.drawImage(fcv[f],px_,16,80,80);
    x.textAlign=al;const tx=al=='left'?px_+94:px_-14;
    x.fillStyle='#f1e3a8';x.font=FONT(10);x.fillText(S[f][4],tx,22);
    x.font=FONT(8);x.fillStyle='#bfae84';x.fillText((sd?'DEFENSOR':'ATACANTE')+(sd==ps?' · VOCÊ':''),tx,42);
    x.fillStyle='#fff';x.fillText(total(sd)+' tropas',tx,58)});
  x.textAlign='center';x.font=FONT(10);x.fillStyle='#ff6a5c';x.fillText(S[B.to][1].toUpperCase(),cw/2,58);
  const hc=B.hov&&B.T[B.hov[1]]?.[B.hov[0]],hu=hc&&B.units.find(v=>v.hp>0&&v.x==B.hov[0]&&v.y==B.hov[1]);
  x.font=FONT(8);x.fillStyle='#bfae84';x.fillText(hc?TN[hc]+(hu?` · ${nmOf(hu)} ${hu.hp}`:''):B.bio.nome+(B.wx=='rain'?' · CHUVA':B.wx=='dry'?' · SECA':''),cw/2,76);
  x.fillStyle='#f1e3a8';x.fillText(`RODADA ${Math.min(B.round,MAXR)}/${MAXR}`,cw/2,92);
  x.fillStyle='#5a3a1c';x.fillRect(OX-5,OY-5,GW*CS+10,GH*CS+10);x.fillStyle='#8a5a2b';x.fillRect(OX-3,OY-3,GW*CS+6,GH*CS+6);
  x.drawImage(B.bg,OX,OY);
  const wt=now/260|0; // marolas
  for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++)if(B.T[gy][gx]=='w'){const h=hash(gx,gy);x.fillStyle='#8fc7ea';
    x.fillRect(OX+gx*CS+6+(h+wt)%30,OY+gy*CS+12+h%8,12,3);x.fillRect(OX+gx*CS+6+(h*7+wt*2)%30,OY+gy*CS+34+h%10,9,3)}
  const cellBox=(gx,gy,fill)=>{x.fillStyle=fill;x.fillRect(OX+gx*CS+1,OY+gy*CS+1,CS-2,CS-2)};
  const R=s&&!s.moved?reach(s):[];
  R.forEach(([gx,gy])=>{if(gx==s.x&&gy==s.y)return;cellBox(gx,gy,'rgba(255,246,200,.3)');cellBox(gx,gy,HATCH[0]);
    x.strokeStyle='rgba(255,246,200,.9)';x.lineWidth=1;x.strokeRect(OX+gx*CS+.5,OY+gy*CS+.5,CS-1,CS-1)});
  const pk=B.peek&&B.peek.hp>0?B.peek:null;
  if(pk){const PR=reach(pk),rg=rgOf(pk),key=new Set(PR.map(c=>c[0]+','+c[1])); // laranja: onde o inimigo chega; contorno: onde ele alcança atirando ou golpeando
    for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++)if(!key.has(gx+','+gy)&&PR.some(c=>Math.abs(c[0]-gx)+Math.abs(c[1]-gy)<=rg)){x.strokeStyle='rgba(255,90,40,.55)';x.lineWidth=2;x.setLineDash([4,4]);x.strokeRect(OX+gx*CS+3,OY+gy*CS+3,CS-6,CS-6);x.setLineDash([])}
    PR.forEach(([gx,gy])=>{cellBox(gx,gy,'rgba(255,140,30,.38)');x.strokeStyle='#ff8a1e';x.lineWidth=2;x.strokeRect(OX+gx*CS+1,OY+gy*CS+1,CS-2,CS-2)});
    x.strokeStyle='#fff';x.lineWidth=3;x.strokeRect(OX+pk.x*CS+1.5,OY+pk.y*CS+1.5,CS-3,CS-3)}
  if(s){alive(1-ps).filter(f=>inR(s,f)).forEach(f=>{cellBox(f.x,f.y,'rgba(255,60,40,.25)');cellBox(f.x,f.y,HATCH[1]);
      x.strokeStyle='#ff3b30';x.lineWidth=3;x.strokeRect(OX+f.x*CS+1.5,OY+f.y*CS+1.5,CS-3,CS-3)});
    x.strokeStyle='#fff';x.lineWidth=3;x.strokeRect(OX+s.x*CS+1.5,OY+s.y*CS+1.5,CS-3,CS-3)}
  const hv=B.hov&&!B.busy&&B.hov[0]>=0&&B.hov[1]>=0&&B.hov[0]<GW&&B.hov[1]<GH?B.hov:null;
  if(hv&&R.length){ // seta do caminho até a casa sob o cursor
    const m=new Map(R.map(c=>[c[0]+','+c[1],c]));let c=m.get(hv.join());
    if(c&&c[2]){const pts=[];while(c){pts.unshift([OX+c[0]*CS+CS/2,OY+c[1]*CS+CS/2]);c=m.get(c[2])}
      const[ex,ey]=pts.at(-1),[qx,qy]=pts.at(-2),dx=Math.sign(ex-qx),dy=Math.sign(ey-qy);pts[pts.length-1]=[ex-dx*12,ey-dy*12];
      [['#3a2413',18,24],['#f6ecc4',12,18]].forEach(([col,w,hd])=>{x.strokeStyle=x.fillStyle=col;x.lineWidth=w;x.lineJoin='miter';x.lineCap='butt';
        x.beginPath();pts.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.stroke();
        x.beginPath();x.moveTo(ex+dx*(hd-6),ey+dy*(hd-6));x.lineTo(ex-dx*12-dy*hd*.8,ey-dy*12+dx*hd*.8);x.lineTo(ex-dx*12+dy*hd*.8,ey-dy*12-dx*hd*.8);x.fill()})}}
  B.units.filter(u=>u.hp>0||u.dead>now-450).sort((a,b)=>a.y-b.y).forEach(u=>drawUnit(u,now));
  B.fxs=B.fxs.filter(f=>now-f.start<320);
  B.fxs.forEach(f=>{const p=(now-f.start)/320,ax=OX+f.a[0]*CS+CS/2,ay=OY+f.a[1]*CS+CS/2-8,tx=OX+f.t[0]*CS+CS/2,ty=OY+f.t[1]*CS+CS/2-8; // golpe: tiro riscado ou corte, e estilhaço no alvo
    if(f.shot){const q=Math.min(1,p*2.2),q0=Math.max(0,q-.35);x.strokeStyle='#fff3c0';x.lineWidth=4;x.beginPath();x.moveTo(ax+(tx-ax)*q0,ay+(ty-ay)*q0);x.lineTo(ax+(tx-ax)*q,ay+(ty-ay)*q);x.stroke();
      if(p<.3){x.fillStyle='#ffd23f';x.fillRect(ax-7,ay-7,14,14);x.fillStyle='rgba(230,230,230,.7)';x.fillRect(ax-12,ay-22-p*40,16,12)}}
    else if(p<.6){x.strokeStyle='#fff';x.lineWidth=5;x.beginPath();x.arc(tx,ty,24,-2.2+p*3,-.9+p*3);x.stroke()}
    if(p>.3){const r=(p-.3)*46;x.fillStyle=p<.7?'#fff':'#ffd23f';for(let i=0;i<8;i++)x.fillRect(tx+Math.cos(i*.785)*r-3,ty+Math.sin(i*.785)*r-3,6,6)}});
  if(hv){const[hx,hy]=hv,t=B.units.find(v=>v.hp>0&&v.side!=ps&&v.x==hx&&v.y==hy),X=OX+hx*CS,Y=OY+hy*CS,n=12;
    x.fillStyle='#ffd23f';[[0,0,1,1],[CS,0,-1,1],[0,CS,1,-1],[CS,CS,-1,-1]].forEach(([a,b,sx,sy])=>{x.fillRect(X+a,Y+b,n*sx,3*sy);x.fillRect(X+a,Y+b,3*sx,n*sy)});
    if(s&&t&&inR(s,t)){ // previsão: dano médio e revide
      const d0=Math.min(t.hp,Math.max(1,Math.round(est(s,t)))),left=t.hp-d0,
        d1=left>0&&t.type!='art'&&dist(s,t)<=rgOf(t)?Math.max(1,Math.round(est({...t,hp:left},s,true))):0,
        adv=BEATS[s.type]==t.type?' ▲':'',txt=`-${d0}${adv}  revide -${d1}`,w=txt.length*8+48,bx=Math.min(cw-w-6,Math.max(6,X+CS/2-w/2)),by=Math.max(4,Y-50);
      x.fillStyle='#22140c';x.fillRect(bx-3,by-3,w+6,36);x.fillStyle='#f6ecc4';x.fillRect(bx,by,w,30);
      x.drawImage(fcv[s.side?B.was:B.af],bx+3,by+3,24,24);
      x.fillStyle='#b3312a';x.font=FONT(8);x.textAlign='left';x.fillText(txt,bx+34,by+11)}}
  x.font=FONT(14);x.textAlign='center';
  B.pops=B.pops.filter(p=>p.until>now);
  B.pops.forEach(p=>{const y=OY+p.y*CS+14-(800-(p.until-now))/22;x.fillStyle='#000';x.fillText(p.txt,OX+p.x*CS+CS/2+2,y+2);x.fillStyle='#ffd23f';x.fillText(p.txt,OX+p.x*CS+CS/2,y)});
  if(B.wx=='rain'){x.fillStyle='rgba(200,225,255,.55)';for(let i=0;i<70;i++)x.fillRect((i*137+now/3)%cw,OY+(i*89+now/1.6)%(GH*CS),2,11)}
  if(B.wx=='dry'){x.fillStyle='rgba(255,150,40,.1)';x.fillRect(OX,OY,GW*CS,GH*CS)}
  x.restore();
  if(B.clash&&now<B.clash.until)drawClash(now)}
const ICON=new Map, icon=(type,f,mine,ldr)=>{const k=[type,f,mine,ldr].join(); // sprite como imagem para os painéis
  if(!ICON.has(k))ICON.set(k,sprite({type,ld:ldr,sk:L[f][0]},f,mine,0).toDataURL());return ICON.get(k)};

