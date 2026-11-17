// mapa estratégico: render em perspectiva, rotas, zoom, seleção
// ---------- mapa estratégico ----------
const[flat,fg]=mk(SW,SH),[scene,sg]=mk(cv.width,cv.height),[world,wg]=mk(SW,SH);
const sil=['#3a1c0c','#b0622a'].map(col=>{const[c,g]=mk(SW,SH);g.fillStyle=col;cell.forEach((s,k)=>{if(s>=0)g.fillRect(k%W*C,(k/W|0)*C,C,C)});return c});
x.imageSmoothingEnabled=false;
const relief=new Float32Array(W*H); // relevo falso: ruído suave iluminado de noroeste
{const nz=(a,b)=>hash(a+50,b+50)%1000/1000,sm=(X,Y)=>{const i=Math.floor(X),j=Math.floor(Y),f=X-i,g=Y-j;return(nz(i,j)*(1-f)+nz(i+1,j)*f)*(1-g)+(nz(i,j+1)*(1-f)+nz(i+1,j+1)*f)*g},
  hg=(X,Y)=>sm(X/7,Y/7)+sm(X/2.6,Y/2.6)*.45;for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++)relief[cy*W+cx]=hg(cx-1,cy-1)-hg(cx+1,cy+1)}
const LEFT=new Set(TH.LEFT||[]); // bandeiras viradas para a esquerda, para não se sobreporem
let blink=false,tick=0,tags=[],hov=-1,fx=null,B=null,HQ=null,cam=null; // cam: zoom no estado atacado antes da batalha
function route(a,b,col,prog=1){ // rota de marcha: tracejado andando, contorno escuro e ponta de seta
  const[ax,ay]=proj(...px(a)),[tx,ty]=proj(...px(b)),bx=ax+(tx-ax)*prog,by=ay+(ty-ay)*prog,an=Math.atan2(by-ay,bx-ax);
  [['#120a1c',9],[col,5]].forEach(([c,w],k)=>{x.strokeStyle=x.fillStyle=c;x.lineWidth=w;x.setLineDash(k?[12,8]:[]);x.lineDashOffset=-Date.now()/40;
    x.beginPath();x.moveTo(ax,ay);x.lineTo(bx,by);x.stroke();x.setLineDash([]);const s=k?11:15;
    x.beginPath();x.moveTo(bx+Math.cos(an)*s,by+Math.sin(an)*s);x.lineTo(bx+Math.cos(an+2.4)*s,by+Math.sin(an+2.4)*s);x.lineTo(bx+Math.cos(an-2.4)*s,by+Math.sin(an-2.4)*s);x.fill()})}
let mfx=null;
onMarch=(a,b)=>{const m=mfx={a,b,start:Date.now()};sfx.move();setTimeout(()=>{if(mfx===m)mfx=null},700);(function st(){if(mfx!==m)return;draw();requestAnimationFrame(st)})()};
function zoomTo(from,to,then){const c=cam={from,to,start:Date.now(),dur:1100};sfx.move();
  setTimeout(()=>{if(cam===c){cam=null;then()}},c.dur); // o fim vem por timer: rAF pausa em aba de fundo e travaria o jogo
  (function step(){if(cam!==c)return;draw();requestAnimationFrame(step)})()}
function render(){
  fg.clearRect(0,0,SW,SH);
  const tgt=marching?adj[sel]:[],hot=fx&&Date.now()<fx.until?fx.s:-1;
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    const s=cell[cy*W+cx];if(s<0)continue;
    const h=hash(cx,cy),f=owner[s],X=cx*C,Y=cy*C;const edge=(dx,dy)=>{const t=cell[(cy+dy)*W+cx+dx];return t==null||t<0||owner[t]!=f};
    let l=46+h%3*2+relief[cy*W+cx]*30+(edge(0,-1)||edge(-1,0)?7:edge(0,1)||edge(1,0)?-9:0);
    if(s==hov)l+=6;
    if(blink&&(s==sel||tgt.includes(s)))l+=s==sel?16:9;
    fg.fillStyle=s==hot?((Date.now()/90|0)%2?'#fff':'#b3312a'):`hsl(${hue(f)},${f==me?88:62}%,${l}%)`;fg.fillRect(X,Y,C,C);
    if(h%4==1){fg.fillStyle='rgba(255,255,255,.1)';fg.fillRect(X+1,Y+1,4,2)}
    const bio=BOF[s]; // relevo por bioma, em tinta translúcida para não esconder a cor do dono
    if(bio=='ama'&&h%3==0){fg.fillStyle='rgba(0,45,10,.38)';fg.fillRect(X+2,Y+2,7,6);fg.fillStyle='rgba(190,255,160,.16)';fg.fillRect(X+3,Y+2,3,2)}
    else if(bio=='ser'&&h%5==0){fg.fillStyle='rgba(255,225,150,.32)';fg.fillRect(X+2,Y+5,6,2);fg.fillRect(X+4,Y+3,2,2)}
    else if(bio=='cer'&&h%6==0){fg.fillStyle=h%12?'rgba(40,60,0,.3)':'rgba(255,220,60,.6)';fg.fillRect(X+3,Y+3,4,4)}
    else if(bio=='sud'&&h%4==0){fg.fillStyle='rgba(0,0,0,.3)';fg.fillRect(X+1,Y+6,8,3);fg.fillRect(X+3,Y+3,4,3);fg.fillStyle='rgba(255,255,255,.3)';fg.fillRect(X+3,Y+3,2,2)}
    else if(bio=='sul'&&h%5==0){fg.fillStyle='rgba(0,50,20,.35)';fg.fillRect(X+2,Y+2,6,2);fg.fillRect(X+4,Y+4,2,5)}}
  RIOS.forEach(r=>{for(let k=0;k<r.length-1;k++)for(let t=0;t<1;t+=.03){ // rios em quadradinhos, só sobre o Brasil
    const lon=r[k][0]+(r[k+1][0]-r[k][0])*t,lat=r[k][1]+(r[k+1][1]-r[k][1])*t,sx=(lon-X0)/D*C,sy=(Y0-lat)/D*C;
    if(cell[(sy/C|0)*W+(sx/C|0)]<0)continue;
    fg.fillStyle='#2f6fb0';fg.fillRect(sx-3,sy-3,6,6);fg.fillStyle='#6fb3e6';fg.fillRect(sx-1,sy-2,3,3)}});
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){ // fronteiras e costa
    const s=cell[cy*W+cx];
    [[1,0],[0,1]].forEach(([dx,dy])=>{
      const t=cx+dx<W&&cy+dy<H?cell[(cy+dy)*W+cx+dx]:-1;if(t==s||(s<0&&t<0))return;
      const coast=s<0||t<0,war=!coast&&owner[s]!=owner[t];
      fg.fillStyle=coast?'#f1e3a8':war?'#120a1c':'rgba(0,0,0,.35)';
      const w=coast||war?4:2;
      dx?fg.fillRect((cx+1)*C-w/2,cy*C,w,C):fg.fillRect(cx*C,(cy+1)*C-w/2,C,w)})}
  sg.clearRect(0,0,scene.width,scene.height);
  // cada linha da tela puxa uma linha do mapa plano; as silhuetas esticadas para baixo formam o barranco
  [[sil[0],1,.4,18,36],[sil[0],18],[sil[1],11],[flat,1]].forEach(([src,th,al=1,ox=0,oy=0])=>{sg.globalAlpha=al; // primeiro, a sombra do continente no mar
    for(let dy=YB-HS;dy<=YB;dy++){const u=unproj(SW/2,dy);
      sg.drawImage(src,0,Math.min(SH-1,u[1])|0,SW,1,SW/2*(1-u[2])+ox,dy+oy,SW*u[2],Math.max(1,th*u[2]))}})}
function ship(sx,sy,flip){x.save();x.translate(sx,sy);if(flip)x.scale(-1,1);const r=(a,b,w,h,c)=>{x.fillStyle=c;x.fillRect(a*3,b*3,w*3,h*3)};
  r(0,7,12,2,'#5a3a1c');r(1,9,10,1,'#3a2413');r(11,6,2,2,'#5a3a1c');r(-1,6,2,2,'#5a3a1c');r(5,0,1,7,'#3a2413');
  r(2,1,7,5,'#f1e9d6');r(3,0,5,1,'#f1e9d6');r(5,2,1,3,'#b3312a');r(4,3,3,1,'#b3312a');r(9,3,3,3,'#ded5bd');r(6,-1,2,1,'#b3312a');
  x.fillStyle='rgba(255,255,255,.35)';x.fillRect(-9,30,54,2);x.restore()}
function draw(){
  if(B||HQ)return;
  render();tick++;x.textAlign='left';
  const sea=x.createLinearGradient(0,0,0,cv.height);sea.addColorStop(0,'#0f4aa0');sea.addColorStop(.55,'#1b82d0');sea.addColorStop(1,'#34b6dc');
  x.fillStyle=sea;x.fillRect(0,0,cv.width,cv.height);
  const camOn=cam,now=Date.now();
  if(camOn){const p=Math.min(1,(now-cam.start)/cam.dur),e=1-Math.pow(1-Math.min(1,p*1.8),3),[tx,ty]=proj(...px(cam.to));
    x.save();x.translate(405,305);x.scale(1+.8*e,1+.8*e);x.translate(-(405+(tx-405)*e),-(305+(ty-305)*e))}
  for(let k=0;k<170;k++){const h=Math.imul(k+1,2654435761)>>>0,y=8+h%596,sc=.4+y/650,wx=((h>>>9)%cv.width+tick*(1+k%3))%cv.width;
    x.fillStyle=k%4?'#5fb0e6':'#c8ecfa';x.fillRect(wx,y,7*sc,2);x.fillRect(wx+7*sc,y-2,5*sc,2)}
  ship((tick*1.2+590)%900-50,250,false);ship(860-(tick*.8+300)%900,505,true);
  x.drawImage(scene,0,0);
  [...SEA,...portLinks].forEach(([a,b])=>{const[ax,ay]=proj(...px(a)),[bx,by]=proj(...px(b));x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=2;x.setLineDash([3,7]); // rotas marítimas
    x.beginPath();x.moveTo(ax,ay);x.quadraticCurveTo((ax+bx)/2+120,(ay+by)/2,bx,by);x.stroke();x.setLineDash([])});
  // bússola
  x.save();x.translate(74,522);x.fillStyle='rgba(10,6,20,.35)';x.beginPath();x.arc(0,0,44,0,7);x.fill();
  for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.fillStyle=k==3?'#b3312a':'#e3c98b';x.beginPath();x.moveTo(0,-38);x.lineTo(8,0);x.lineTo(-8,0);x.fill();
    x.fillStyle=k==3?'#7a1f1a':'#8a5a2b';x.beginPath();x.moveTo(0,-38);x.lineTo(8,0);x.lineTo(0,0);x.fill()}
  x.fillStyle='#f1e3a8';x.fillRect(-3,-3,6,6);x.restore();
  x.font=FONT(8);x.textBaseline='top';x.fillStyle='#f1e3a8';x.textAlign='center';x.fillText('N',74,468);x.textAlign='left';
  tags=[];
  if(marching)adj[sel].forEach(j=>route(sel,j,owner[j]==me?'#7fd0ff':'#ff5a48',.86));
  S.map((_,i)=>i).sort((a,b)=>S[b][3]-S[a][3]).forEach(i=>{
    const[fx_,fy]=proj(...px(i)),t=S[i][0]+troops[i],w=t.length*8+9,bx=Math.round(fx_),by=Math.round(fy)-28,
      left=LEFT.has(S[i][0]),rx=left?bx-w-1:bx+1;
    x.fillStyle='rgba(0,0,0,.4)';x.fillRect(bx-3,by+27,7,2);
    x.fillStyle='#22140c';x.fillRect(bx-8,by+18,16,11);x.fillStyle='#f6ecc4';x.fillRect(bx-6,by+22,12,6);x.fillStyle='#b3312a';x.fillRect(bx-7,by+19,14,4);x.fillStyle='#3a2413';x.fillRect(bx-1,by+25,3,3); // capital
    if(port[i]){const ax=bx+11,ay=by+16;x.fillStyle='#22140c';x.fillRect(ax-5,ay-2,11,13);x.fillStyle='#9fd0ff';x.fillRect(ax,ay,1,9);x.fillRect(ax-2,ay+1,5,1);x.fillRect(ax-3,ay+7,7,1);x.fillRect(ax-3,ay+6,1,1);x.fillRect(ax+3,ay+6,1,1)} // âncora
    x.fillStyle='#120a1c';x.fillRect(bx-1,by,2,28);
    x.fillStyle=owner[i]==me?'#1d3fa8':'#22140c';x.fillRect(rx,by,w,14);
    x.fillStyle=`hsl(${hue(owner[i])},70%,60%)`;x.fillRect(left?rx+w-3:rx,by,3,14);
    if(i==sel||i==hov){x.strokeStyle='#fff';x.lineWidth=2;x.strokeRect(rx,by,w,14)}
    x.fillStyle=owner[i]==me&&moved.has(i)?'#9aa':'#fff';x.fillText(t,rx+(left?3:6),by+3);
    for(let k=0;k<fort[i];k++){x.fillStyle='#22140c';x.fillRect(rx+1+k*9,by-9,8,8);x.fillStyle='#ffd23f';x.fillRect(rx+2+k*9,by-6,6,5);x.fillRect(rx+2+k*9,by-8,2,2);x.fillRect(rx+6+k*9,by-8,2,2)}
    tags.push([Math.min(rx,bx-2),by,w+3,28,i])});
  if(mfx){const p=(now-mfx.start)/700,[ax,ay]=proj(...px(mfx.a)),[bx,by]=proj(...px(mfx.b)),sp=sprite({type:'inf',sk:'T'},me,true,(now/90|0)%2); // tropa marchando entre estados seus
    if(p<1)x.drawImage(sp,ax+(bx-ax)*p-26,ay+(by-ay)*p-44-Math.abs(Math.sin(p*18))*5,52,48)}
  if(camOn){route(camOn.from,camOn.to,'#ff4a3a',Math.min(1,(now-camOn.start)/camOn.dur*1.5));x.restore()}
  for(let k=0;k<3;k++){const cx_=(tick*(.6+k*.25)+k*330)%960-120,cy_=30+k*46; // nuvens
    x.fillStyle='rgba(255,255,255,.5)';x.fillRect(cx_,cy_,66,12);x.fillRect(cx_+12,cy_-9,36,9);x.fillRect(cx_+24,cy_+12,30,6)}
  const vg=x.createRadialGradient(405,305,260,405,305,560);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(8,4,20,.3)');
  x.fillStyle=vg;x.fillRect(0,0,cv.width,cv.height)}
function pick(e){const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)*cv.width/r.width,my=(e.clientY-r.top)*cv.height/r.height;
  const tag=tags.findLast(([bx,by,w,h])=>mx>=bx&&mx<=bx+w&&my>=by&&my<=by+h);if(tag)return tag[4];
  const u=unproj(mx,my);if(!u)return-1;
  const cx=Math.floor(u[0]/C),cy=Math.floor(u[1]/C);
  return cx>=0&&cx<W&&cy>=0&&cy<H?Math.max(-1,cell[cy*W+cx]):-1}

