// mapa estratégico: render em perspectiva, rotas, zoom, seleção
// ---------- mapa estratégico ----------
const[flat,fg]=mk(SW,SH),[scene,sg]=mk(cv.width,cv.height),[world,wg]=mk(SW,SH);
const sil=['#3a1c0c','#b0622a'].map(col=>{const[c,g]=mk(SW,SH);g.fillStyle=col;cell.forEach((s,k)=>{if(s>=0)g.fillRect(k%W*C,(k/W|0)*C,C,C)});return c});
x.imageSmoothingEnabled=false;
const relief=new Float32Array(W*H); // relevo falso: ruído suave iluminado de noroeste
{const nz=(a,b)=>hash(a+50,b+50)%1000/1000,sm=(X,Y)=>{const i=Math.floor(X),j=Math.floor(Y),f=X-i,g=Y-j;return(nz(i,j)*(1-f)+nz(i+1,j)*f)*(1-g)+(nz(i,j+1)*(1-f)+nz(i+1,j+1)*f)*g},
  hg=(X,Y)=>sm(X/7,Y/7)+sm(X/2.6,Y/2.6)*.45;for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)relief[cy*W+cx]=hg(cx*C/10-1,cy*C/10-1)-hg(cx*C/10+1,cy*C/10+1)}
if(TH.NB)for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(cell[cy*W+cx]!=-2)continue; // terra vizinha: apagada, com relevo e praia
  const h=hash(cx,cy);wg.fillStyle=`hsl(${80+h%12},${12+h%5}%,${34+relief[cy*W+cx]*18+h%3}%)`;wg.fillRect(cx*C,cy*C,C,C);
  if(h%11==0){wg.fillStyle='rgba(20,40,10,.25)';wg.fillRect(cx*C+1,cy*C+1,C-2,C-2)}
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{if(cell[(cy+dy)*W+cx+dx]!=-1)return;wg.fillStyle='rgba(241,227,168,.6)';dx?wg.fillRect(cx*C+(dx>0?C-1:0),cy*C,1,C):wg.fillRect(cx*C,cy*C+(dy>0?C-1:0),C,1)})}
const LEFT=new Set(TH.LEFT||[]); // bandeiras viradas para a esquerda, para não se sobreporem
let blink=false,tick=0,tags=[],hov=-1,fx=null,B=null,HQ=null,cam=null; // cam: zoom no estado atacado antes da batalha
let oddsC={},aiShow=null,cele=null,evtDue=false,dayTint=[0,0,0,0]; // aiShow: reencenação dos ataques da IA; cele: festa de conquista
const area=S.map((_,i)=>cell.reduce((a,c)=>a+(c==i),0)); // casas de cada território: limita o tamanho do exército desenhado
const revealAt=[];S.map((_,i)=>i).sort((a,b)=>S[b][3]-S[a][3]).forEach((s,k)=>revealAt[s]=k/N*1400); // abertura: o mapa se forma de norte a sul
let intro=null,rKey='';const lastOwner=[],flagT=[];
const coastSea=[];for(let cy=1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){const k=cy*W+cx;if(cell[k]!=-1)continue; // mar junto da costa, para as jangadas
  const lon=X0+(cx+.5)*D,lat=Y0-(cy+.5)*D;if(LAKES.some(q=>inPoly(lon,lat,q)))continue;
  if([1,-1,W,-W].some(d=>cell[k+d]!=-1)&&hash(cx,cy)%11==0)coastSea.push([cx*C+C/2,cy*C+C/2])}
const TOD=[['Manhã','☀',[255,170,110,.12]],['Dia','☀',[0,0,0,0]],['Tarde','☀',[255,130,40,.18]],['Noite','☾',[12,18,70,.44]]]; // ciclo do dia: um período por turno
function playAI(then){ // fim do turno: todos os ataques da IA correm ao mesmo tempo pelo mapa, depois o jogo segue
  if(!evts.length||!CFG.clash)return then();const s=aiShow={start:Date.now(),ev:evts.slice(0,30),dur:2300};
  if(evts.some(e=>e.was==me))sfx.lose();setTimeout(()=>{if(aiShow===s){aiShow=null;then()}},s.dur)}
function route(a,b,col,prog=1){ // rota de marcha: tracejado andando, contorno escuro e ponta de seta
  const[ax,ay]=proj(...px(a)),[tx,ty]=proj(...px(b)),bx=ax+(tx-ax)*prog,by=ay+(ty-ay)*prog,an=Math.atan2(by-ay,bx-ax);
  [['#120a1c',9],[col,5]].forEach(([c,w],k)=>{x.strokeStyle=x.fillStyle=c;x.lineWidth=w;x.setLineDash(k?[12,8]:[]);x.lineDashOffset=-Date.now()/40;
    x.beginPath();x.moveTo(ax,ay);x.lineTo(bx,by);x.stroke();x.setLineDash([]);const s=k?11:15;
    x.beginPath();x.moveTo(bx+Math.cos(an)*s,by+Math.sin(an)*s);x.lineTo(bx+Math.cos(an+2.4)*s,by+Math.sin(an+2.4)*s);x.lineTo(bx+Math.cos(an-2.4)*s,by+Math.sin(an-2.4)*s);x.fill()})}
let mfx=null;
onMarch=(a,b)=>{const m=mfx={a,b,start:Date.now()};sfx.move();setTimeout(()=>{if(mfx===m)mfx=null},700)};
function zoomTo(from,to,then){const c=cam={from,to,start:Date.now(),dur:1100};sfx.move();
  setTimeout(()=>{if(cam===c){cam=null;then()}},c.dur)} // o fim vem por timer: rAF pausa em aba de fundo e travaria o jogo
function render(){ // terreno em cache: só redesenha quando algo do mapa muda
  const hot0=fx&&Date.now()<fx.until?fx.s:-1,el=intro?Date.now()-intro:1e9,stepI=el<1500?el/60|0:-1,
    key=[owner.join(),hov,sel,blink,marching,aim,CFG.cb,CFG.calm,hot0>=0?(Date.now()/90|0)%2:'',stepI].join('|');
  if(key==rKey)return;rKey=key;if(stepI<0)intro=null;
  fg.clearRect(0,0,SW,SH);
  const tgt=marching?adj[sel]:aim?S.map((_,j)=>j).filter(j=>cardOk(aim,j)):[],hot=fx&&Date.now()<fx.until?fx.s:-1;
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    const s=cell[cy*W+cx];if(s<0||revealAt[s]>el)continue;
    const h=hash(cx,cy),f=owner[s],X=cx*C,Y=cy*C,d=(a,b,w,hh)=>fg.fillRect(X+a*C/10,Y+b*C/10,w*C/10,hh*C/10);const edge=(dx,dy)=>{const t=cell[(cy+dy)*W+cx+dx];return t==null||t<0||owner[t]!=f};
    let l=46+h%3*2+relief[cy*W+cx]*30+(edge(0,-1)||edge(-1,0)?7:edge(0,1)||edge(1,0)?-9:0);
    if(s==hov)l+=6;
    if((blink||CFG.calm)&&(s==sel||tgt.includes(s)))l+=s==sel?16:9;
    fg.fillStyle=s==hot?((Date.now()/90|0)%2?'#fff':'#b3312a'):`hsl(${hue(f)},${f==me?88:62}%,${l}%)`;d(0,0,10,10);
    if(h%4==1){fg.fillStyle='rgba(255,255,255,.1)';d(1,1,4,2)}
    if(CFG.cb){const pt=f%6;fg.fillStyle='rgba(0,0,0,.32)'; // modo daltônico: textura por facção além da cor
      if(pt==1&&(cx+cy)%3==0)d(0,4,10,2);else if(pt==2&&cx%2==0&&cy%2==0)d(3,3,4,4);else if(pt==3&&cx%2==0)d(4,0,2,10);
      else if(pt==4&&(cx-cy+99)%3==0){d(0,0,3,3);d(3,3,3,3);d(6,6,3,3)}else if(pt==5&&(cx+cy)%2==0){d(4,1,2,8);d(1,4,8,2)}}
    const bio=BOF[s]; // relevo por bioma, em tinta translúcida para não esconder a cor do dono
    if(bio=='ama'&&h%3==0){fg.fillStyle='rgba(0,45,10,.38)';d(2,2,7,6);fg.fillStyle='rgba(190,255,160,.16)';d(3,2,3,2)}
    else if(bio=='ser'&&h%5==0){fg.fillStyle='rgba(255,225,150,.32)';d(2,5,6,2);d(4,3,2,2)}
    else if(bio=='cer'&&h%6==0){fg.fillStyle=h%12?'rgba(40,60,0,.3)':'rgba(255,220,60,.6)';d(3,3,4,4)}
    else if(bio=='sud'&&h%4==0){fg.fillStyle='rgba(0,0,0,.3)';d(1,6,8,3);d(3,3,4,3);fg.fillStyle='rgba(255,255,255,.3)';d(3,3,2,2)}
    else if(bio=='sul'&&h%5==0){fg.fillStyle='rgba(0,50,20,.35)';d(2,2,6,2);d(4,4,2,5)}}
  RIOS.forEach(r=>{for(let k=0;k<r.length-1;k++)for(let t=0;t<1;t+=.03){ // rios em quadradinhos, só sobre o Brasil
    const lon=r[k][0]+(r[k+1][0]-r[k][0])*t,lat=r[k][1]+(r[k+1][1]-r[k][1])*t,sx=(lon-X0)/D*C,sy=(Y0-lat)/D*C;
    if(cell[(sy/C|0)*W+(sx/C|0)]<0)continue;
    fg.fillStyle='#2f6fb0';fg.fillRect(sx-3,sy-3,6,6);fg.fillStyle='#6fb3e6';fg.fillRect(sx-1,sy-2,3,3)}});
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){ // fronteiras e costa
    const s=cell[cy*W+cx];
    [[1,0],[0,1]].forEach(([dx,dy])=>{
      const t=cx+dx<W&&cy+dy<H?cell[(cy+dy)*W+cx+dx]:-1;if(t==s||(s<0&&t<0))return;
      if((s>=0&&revealAt[s]>el)||(t>=0&&revealAt[t]>el))return;
      const coast=s==-1||t==-1,ext=!coast&&(s<0||t<0),war=!coast&&!ext&&owner[s]!=owner[t]; // ext: divisa com terra vizinha
      fg.fillStyle=coast?'#f1e3a8':war||ext?'#120a1c':'rgba(0,0,0,.35)';
      const w=(coast||war||ext?4:2)*Math.max(.75,C/10);
      dx?fg.fillRect((cx+1)*C-w/2,cy*C,w,C):fg.fillRect(cx*C,(cy+1)*C-w/2,C,w)})}
  sg.clearRect(0,0,scene.width,scene.height);
  // cada linha da tela puxa uma linha do mapa plano; as silhuetas esticadas para baixo formam o barranco
  [[world,1],[sil[0],1,.4,18,36],[sil[0],18],[sil[1],11],[flat,1]].forEach(([src,th,al=1,ox=0,oy=0])=>{sg.globalAlpha=al; // primeiro, a sombra do continente no mar
    for(let dy=YB-HS;dy<=YB;dy++){const u=unproj(SW/2,dy);
      sg.drawImage(src,0,Math.min(SH-1,u[1])|0,SW,1,SW/2*(1-u[2])+ox,dy+oy,SW*u[2],Math.max(1,th*u[2]))}})}
function ship(sx,sy,flip){x.save();x.translate(sx,sy);if(flip)x.scale(-1,1);const r=(a,b,w,h,c)=>{x.fillStyle=c;x.fillRect(a*3,b*3,w*3,h*3)};
  r(0,7,12,2,'#5a3a1c');r(1,9,10,1,'#3a2413');r(11,6,2,2,'#5a3a1c');r(-1,6,2,2,'#5a3a1c');r(5,0,1,7,'#3a2413');
  r(2,1,7,5,'#f1e9d6');r(3,0,5,1,'#f1e9d6');r(5,2,1,3,'#b3312a');r(4,3,3,1,'#b3312a');r(9,3,3,3,'#ded5bd');r(6,-1,2,1,'#b3312a');
  x.fillStyle='rgba(255,255,255,.35)';x.fillRect(-9,30,54,2);x.restore()}
function draw(){
  if(B||HQ||!owner)return; // nada a desenhar antes do jogo iniciar
  render();const now=Date.now();tick=now/90;x.textAlign='left';
  const sea=x.createLinearGradient(0,0,0,cv.height);sea.addColorStop(0,'#0f4aa0');sea.addColorStop(.55,'#1b82d0');sea.addColorStop(1,'#34b6dc');
  x.fillStyle=sea;x.fillRect(0,0,cv.width,cv.height);
  const camOn=cam;
  if(camOn){const p=Math.min(1,(now-cam.start)/cam.dur),e=1-Math.pow(1-Math.min(1,p*1.8),3),[tx,ty]=proj(...px(cam.to));
    x.save();x.translate(405,305);x.scale(1+.8*e,1+.8*e);x.translate(-(405+(tx-405)*e),-(305+(ty-305)*e))}
  for(let k=0;k<(CFG.q?170:50);k++){const h=Math.imul(k+1,2654435761)>>>0,y=8+h%596,sc=.4+y/650,wx=((h>>>9)%cv.width+tick*(1+k%3))%cv.width;
    x.fillStyle=k%4?'#5fb0e6':'#c8ecfa';x.fillRect(wx,y,7*sc,2);x.fillRect(wx+7*sc,y-2,5*sc,2)}
  ship((tick*1.2+590)%900-50,250,false);ship(860-(tick*.8+300)%900,505,true);
  x.drawImage(scene,0,0);
  if(TH.NBL){x.font=FONT(9);x.textAlign='center';TH.NBL.forEach(([n,lon,lat])=>{const[lx,ly]=proj((lon-X0)/D*C,(Y0-lat)/D*C),sea=n.startsWith('OCEANO'); // nomes dos vizinhos e do mar
    x.fillStyle='rgba(0,0,0,.4)';x.fillText(n,lx+1,ly+1);x.fillStyle=sea?'rgba(190,225,255,.6)':'rgba(240,232,205,.7)';x.fillText(n,lx,ly)});x.textAlign='left'}
  if(CFG.q)for(let k=0;k<5;k++){const cx_=(tick*(.6+k*.25)+k*330)%960-120,cy_=30+k*46;x.fillStyle='rgba(10,20,40,.13)';x.fillRect(cx_+40,cy_+150,66,12);x.fillRect(cx_+52,cy_+141,36,9)} // sombra das nuvens
  if(CFG.q)RIOS.forEach((r,ri)=>{const n=r.length-1,t=(now/42000+ri*.37)%1,u=t<.5?t*2:2-t*2,fi=u*n,k=Math.min(n-1,fi|0),q=fi-k, // canoas subindo e descendo os rios
    lon=r[k][0]+(r[k+1][0]-r[k][0])*q,lat=r[k][1]+(r[k+1][1]-r[k][1])*q,sx=(lon-X0)/D*C,sy=(Y0-lat)/D*C;if(!(cell[(sy/C|0)*W+(sx/C|0)]>=0))return;
    const[bx,by]=proj(sx,sy);x.fillStyle='#5a3a1c';x.fillRect(bx-6,by-1,12,3);x.fillStyle='#3a2413';x.fillRect(bx-5,by+2,10,1);x.fillStyle='#22140c';x.fillRect(bx-1,by-6,2,5);x.fillStyle='#e8c99a';x.fillRect(bx-1,by-8,2,2)});
  if(CFG.q&&TKEY!='farrapos')coastSea.filter((_,k)=>k%Math.max(1,coastSea.length/7|0)==0).slice(0,7).forEach(([sx,sy],k)=>{const[bx,by0]=proj(sx,sy),by=by0+Math.sin(now/700+k)*2; // jangadas
    x.fillStyle='#8a5a2b';x.fillRect(bx-7,by,14,3);x.fillStyle='#f6ecc4';x.beginPath();x.moveTo(bx-1,by-1);x.lineTo(bx-1,by-14);x.lineTo(bx+7,by-2);x.fill();x.fillStyle='#22140c';x.fillRect(bx-2,by-14,1,14)});
  if(CFG.q&&TKEY=='farrapos')for(let k=0;k<4;k++){const fx_=((now/90+k*260)%1100)-200,fy=180+k*95; // neblina do pampa
    x.fillStyle='rgba(235,240,245,.16)';x.fillRect(fx_,fy,240,22);x.fillRect(fx_+40,fy-12,150,14);x.fillRect(fx_+70,fy+22,120,10)}
  {const tg=TOD[turn%4][2];dayTint=dayTint.map((v,k)=>v+(tg[k]-v)*.04); // período do dia
    if(dayTint[3]>.005){x.fillStyle=`rgba(${dayTint[0]|0},${dayTint[1]|0},${dayTint[2]|0},${dayTint[3]})`;x.fillRect(0,0,cv.width,cv.height)}
    if(dayTint[3]>.25&&dayTint[2]>40){const a=Math.min(1,(dayTint[3]-.25)*6);S.forEach((_,i)=>{const[fx_,fy]=proj(...px(i));if(revealAt[i]>(intro?now-intro:1e9))return; // luzes das vilas à noite
      x.fillStyle=`rgba(255,200,90,${.28*a})`;x.fillRect(fx_-12,fy-16,24,18);x.fillStyle=`rgba(255,236,160,${a})`;x.fillRect(fx_-6,fy-9,3,3);x.fillRect(fx_+3,fy-9,3,3);x.fillRect(fx_-2,fy-5,3,3)})}}
  [...SEA,...portLinks].forEach(([a,b])=>{const[ax,ay]=proj(...px(a)),[bx,by]=proj(...px(b));x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=2;x.setLineDash([3,7]); // rotas marítimas
    x.beginPath();x.moveTo(ax,ay);x.quadraticCurveTo((ax+bx)/2+120,(ay+by)/2,bx,by);x.stroke();x.setLineDash([])});
  // bússola
  x.save();x.translate(74,522);x.fillStyle='rgba(10,6,20,.35)';x.beginPath();x.arc(0,0,44,0,7);x.fill();
  for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.fillStyle=k==3?'#b3312a':'#e3c98b';x.beginPath();x.moveTo(0,-38);x.lineTo(8,0);x.lineTo(-8,0);x.fill();
    x.fillStyle=k==3?'#7a1f1a':'#8a5a2b';x.beginPath();x.moveTo(0,-38);x.lineTo(8,0);x.lineTo(0,0);x.fill()}
  x.fillStyle='#f1e3a8';x.fillRect(-3,-3,6,6);x.restore();
  x.font=FONT(8);x.textBaseline='top';x.fillStyle='#f1e3a8';x.textAlign='center';x.fillText('N',74,468);x.textAlign='left';
  tags=[];
  if(marching)adj[sel].forEach(j=>{route(sel,j,owner[j]==me?'#7fd0ff':'#ff5a48',.86);const o=oddsC[j];if(!o)return; // chance de vitória em cada rota de ataque
    const[ax,ay]=proj(...px(sel)),[tx,ty]=proj(...px(j)),mx=ax+(tx-ax)*.6,my=ay+(ty-ay)*.6,t=`~${Math.round(o[0]*100)}%`,col=o[0]>.65?'#2f8a4a':o[0]>.35?'#b8891f':'#b3312a';
    x.font=FONT(10);const w=Math.ceil(x.measureText(t).width)+10;x.fillStyle='#22140c';x.fillRect(mx-w/2-2,my-11,w+4,22);x.fillStyle=col;x.fillRect(mx-w/2,my-9,w,18);x.fillStyle='#fff';x.textAlign='center';x.fillText(t,mx,my-8);x.textAlign='left'});
  const LB=labelOffsets();
  S.map((_,i)=>i).sort((a,b)=>S[b][3]-S[a][3]).forEach(i=>{
    if(intro&&revealAt[i]>now-intro)return;
    const TS=CFG.big?12:10,[fx_,fy]=proj(...px(i)),t=S[i][0]+troops[i],w=(x.font=FONT(TS),Math.ceil(x.measureText(t).width)+20),bx=Math.round(fx_),by0=Math.round(fy)-30-(TS-10),by=by0+LB[i],
      left=LEFT.has(S[i][0]),rx=left?bx-w-1:bx+1,f=owner[i];
    if(lastOwner[i]!==f){if(lastOwner[i]!=null)flagT[i]=now;lastOwner[i]=f} // bandeira desce e sobe na cor nova
    const fp=flagT[i]?(now-flagT[i])/900:1,fb=by+(fp<1?(fp<.45?fp/.45:1-(fp-.45)/.55)*20:0);
    const ar=area[i]*C*C/100,nA=Math.min(ar<30?1:ar<80?2:4,1+(troops[i]/7|0)); // exército: cresce com as tropas
    for(let k=nA-1;k>=0;k--){const sp=sprite({type:['inf','cav','ati','inf'][k],sk:'LTBDT'[(f+k)%5]},f,f==me,CFG.q?Math.floor(now/450+i*.3+k*.5)%2:0),
      ax=bx-14-k*11,ay=Math.round(fy)+(k%2)*3;x.fillStyle='rgba(0,0,0,.3)';x.fillRect(ax-9,ay-1,18,3);x.drawImage(sp,ax-13,ay-24,26,24)}
    if(burn[i]>=turn-1){for(let k=0;k<3;k++){const fl=CFG.calm?k:Math.floor(now/90+k*3)%3;x.fillStyle=['#ff5a1e','#ffb030','#ffe27a'][(k+fl)%3];x.fillRect(bx+6+k*4,Math.round(fy)-8-fl*2-k%2*2,4,7+fl*2)} // fogo e fumaça
      for(let k=0;k<4;k++){const q=(now/1700+k/4)%1,s=5+q*11;x.fillStyle=`rgba(80,80,80,${.5*(1-q)})`;x.fillRect(bx+10-s/2+Math.sin(q*6+k)*5,Math.round(fy)-12-q*50,s,s)}}
    x.fillStyle='rgba(0,0,0,.4)';x.fillRect(bx-3,by0+27,7,2);
    x.fillStyle='#22140c';x.fillRect(bx-8,by0+18,16,11);x.fillStyle='#f6ecc4';x.fillRect(bx-6,by0+22,12,6);x.fillStyle='#b3312a';x.fillRect(bx-7,by0+19,14,4);x.fillStyle='#3a2413';x.fillRect(bx-1,by0+25,3,3); // capital
    if(port[i]){const ax=bx+11,ay=by0+16;x.fillStyle='#22140c';x.fillRect(ax-5,ay-2,11,13);x.fillStyle='#9fd0ff';x.fillRect(ax,ay,1,9);x.fillRect(ax-2,ay+1,5,1);x.fillRect(ax-3,ay+7,7,1);x.fillRect(ax-3,ay+6,1,1);x.fillRect(ax+3,ay+6,1,1)} // âncora
    x.fillStyle='#120a1c';x.fillRect(bx-1,by,2,by0+28-by);if(by<by0){x.fillStyle='rgba(255,240,200,.35)';x.fillRect(bx,by,1,by0-by)}
    const LH=Math.round(TS*1.45)+6,mineT=owner[i]==me;x.fillStyle='#2a1810';x.fillRect(rx-1,fb-1,w+2,LH+2);x.fillStyle=mineT?'#4d3238':'#efe3c6';x.fillRect(rx,fb,w,LH);x.fillStyle=mineT?'rgba(255,230,180,.18)':'rgba(255,255,255,.6)';x.fillRect(rx,fb,w,1); // plaquinha: pergaminho, ou laca se for sua
    x.fillStyle=`hsl(${hue(owner[i])},70%,${CFG.cb?40:55}%)`;x.fillRect(left?rx+w-11:rx,fb,11,LH);emblem(x,(left?rx+w-11:rx)+2,fb+(LH-7)/2|0,owner[i],'#fff'); // faixa com emblema da facção
    if(i==sel||i==hov){x.strokeStyle='#f08a3a';x.lineWidth=2;x.strokeRect(rx-1,fb-1,w+2,LH+2)}
    x.font=FONT(TS);x.fillStyle=mineT?(moved.has(i)?'#a89880':'#f3e7cf'):'#3a2a1f';x.fillText(t,rx+(left?4:14),fb+2);
    if(f==me&&danger(i)){const ax=rx-12,ay=fb+1,on=CFG.calm||Math.floor(now/400)%2;x.fillStyle='#22140c';x.beginPath();x.moveTo(ax+6,ay-2);x.lineTo(ax+14,ay+14);x.lineTo(ax-2,ay+14);x.fill(); // em perigo
      x.fillStyle=on?'#ff3b30':'#b3312a';x.beginPath();x.moveTo(ax+6,ay+1);x.lineTo(ax+12,ay+12);x.lineTo(ax,ay+12);x.fill();x.fillStyle='#fff';x.fillRect(ax+5,ay+4,2,5);x.fillRect(ax+5,ay+10,2,2)}
    for(let k=0;k<fort[i];k++){x.fillStyle='#22140c';x.fillRect(rx+1+k*9,fb-9,8,8);x.fillStyle='#ffd23f';x.fillRect(rx+2+k*9,fb-6,6,5);x.fillRect(rx+2+k*9,fb-8,2,2);x.fillRect(rx+6+k*9,fb-8,2,2)}
    tags.push([Math.min(rx,bx-2),by,w+3,by0-by+28+(TS-10),i])});
  if(mfx){const p=(now-mfx.start)/700,[ax,ay]=proj(...px(mfx.a)),[bx,by]=proj(...px(mfx.b)),sp=sprite({type:'inf',sk:'T'},me,true,Math.floor(now/90)%2); // tropa marchando entre estados seus
    if(p<1)x.drawImage(sp,ax+(bx-ax)*p-26,ay+(by-ay)*p-44-Math.abs(Math.sin(p*18))*5,52,48)}
  if(aiShow){const T=now-aiShow.start,dur=aiShow.dur;
    aiShow.ev.forEach((e,k)=>{const p=Math.max(0,Math.min(1,(T-k*55)/1200)),vs=e.was==me,col=vs?'#ff2a2a':`hsl(${hue(e.f)},80%,62%)`;if(!p)return;
      route(e.a,e.b,col,p*.92);const[ax,ay]=proj(...px(e.a)),[tx,ty]=proj(...px(e.b));
      if(p<1){const sp=sprite({type:'cav',sk:L[e.f][0]},e.f,false,2+Math.floor(now/110)%2);x.save();x.translate(ax+(tx-ax)*p,ay+(ty-ay)*p-34);if(tx<ax)x.scale(-1,1);x.drawImage(sp,-20,0,40,37);x.restore()}
      else if(e.won){x.strokeStyle=col;x.lineWidth=3;x.beginPath();x.arc(tx,ty-6,10+(T/70)%16,0,7);x.stroke()}
      if(vs&&p>=1){x.fillStyle='#ff2a2a';x.font=FONT(16);x.textAlign='center';x.fillText('!',tx,ty-52);x.textAlign='left'}});
    const sl=T<300?(T/300-1)*810:T>dur-300?(T-dur+300)/300*810:0;x.fillStyle='rgba(10,6,20,.8)';x.fillRect(sl,22,810,46);x.fillStyle='#ffd23f';x.fillRect(sl,22,810,3);x.fillRect(sl,65,810,3);
    x.font=FONT(14);x.textAlign='center';x.fillText(`TURNO DOS RIVAIS · ${aiShow.ev.length} ATAQUE${aiShow.ev.length>1?'S':''}`,405+sl,37);x.textAlign='left';x.font=FONT(8)}
  if(cele){const T=now-cele.start;if(T>cele.dur)cele=null;else{const[tx,ty]=proj(...px(cele.i)),rise=Math.min(1,T/700),fy=ty-30-50*rise; // bandeira subindo e confete
    x.fillStyle='#22140c';x.fillRect(tx-1,fy,3,50*rise+30);x.fillStyle=`hsl(${hue(me)},85%,55%)`;x.fillRect(tx+2,fy,28,17);x.fillStyle='#ffd23f';x.fillRect(tx+11,fy+4,9,9);
    if(!CFG.calm)for(let k=0;k<cele.n;k++){const h=Math.imul(k+7,2654435761)>>>0,t=T/1000,cx_=h%810+Math.sin(t*3+k)*14,cy_=-30-(h>>>10)%160+t*(150+(h>>>20)%170);
      if(cy_>-10&&cy_<620){x.fillStyle=['#ffd23f','#ff5a48','#52c8d6','#74d05c','#fff'][k%5];x.fillRect(cx_,cy_,(k%3)+3,(k%2)+3)}}}}
  if(camOn){route(camOn.from,camOn.to,'#ff4a3a',Math.min(1,(now-camOn.start)/camOn.dur*1.5));x.restore()}
  for(let k=0;k<5;k++){const cx_=(tick*(.6+k*.25)+k*330)%960-120,cy_=30+k*46; // nuvens
    x.fillStyle=`rgba(255,255,255,${.5-dayTint[3]*.5})`;x.fillRect(cx_,cy_,66,12);x.fillRect(cx_+12,cy_-9,36,9);x.fillRect(cx_+24,cy_+12,30,6)}
  if(CFG.q){const t=(now/17000)%1,bx=-80+t*980,by=110+Math.sin(t*9)*22,wh=TKEY=='cabanagem',fl=Math.floor(now/170)%2; // revoada (garças brancas no Marajó)
    x.fillStyle=wh?'#fff':'#22140c';[[0,0],[-12,-7],[-12,7],[-24,-14],[-24,14],[-36,-21],[-36,21]].forEach(([ox,oy])=>{const X=bx+ox,Y=by+oy,s=wh?2:1;
      if(fl){x.fillRect(X-4*s,Y,3*s,s);x.fillRect(X+s,Y,3*s,s);x.fillRect(X-s,Y+s,2*s,s)}else{x.fillRect(X-4*s,Y-2*s,s,2*s);x.fillRect(X+3*s,Y-2*s,s,2*s);x.fillRect(X-3*s,Y,6*s,s)}})}
  const vg=x.createRadialGradient(405,305,260,405,305,560);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(8,4,20,.3)');
  x.fillStyle=vg;x.fillRect(0,0,cv.width,cv.height)}
function pick(e){const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)*cv.width/r.width,my=(e.clientY-r.top)*cv.height/r.height;
  const tag=tags.findLast(([bx,by,w,h])=>mx>=bx&&mx<=bx+w&&my>=by&&my<=by+h);if(tag)return tag[4];
  const u=unproj(mx,my);if(!u)return-1;
  const cx=Math.floor(u[0]/C),cy=Math.floor(u[1]/C);
  return cx>=0&&cx<W&&cy>=0&&cy<H?Math.max(-1,cell[cy*W+cx]):-1}


function labelOffsets(){ /* bandeirinhas que se tocam sobem (mastro mais alto) até não se sobreporem */
  const TS=CFG.big?12:10,LH=Math.round(TS*1.45)+6;x.font=FONT(TS);
  const L=S.map((_,i)=>{const[fx_,fy]=proj(...px(i)),w=Math.ceil(x.measureText(S[i][0]+troops[i]).width)+20,bx=Math.round(fx_);return{x:LEFT.has(S[i][0])?bx-w-1:bx+1,y:Math.round(fy)-30-(TS-10),w,dy:0}});
  for(let it=0;it<12;it++){let moved_=false;
    for(let a=0;a<L.length;a++)for(let b=a+1;b<L.length;b++){const A=L[a],Q=L[b];if(A.x>=Q.x+Q.w+2||Q.x>=A.x+A.w+2)continue;
      const ay=A.y+A.dy,qy=Q.y+Q.dy,ov=Math.min(ay,qy)+LH+2-Math.max(ay,qy);if(ov<=0)continue;
      const up=ay<=qy?A:Q;if(up.dy>-64){up.dy=Math.max(-64,up.dy-ov);moved_=true}}
    if(!moved_)break}
  return L.map(l=>l.dy)}
