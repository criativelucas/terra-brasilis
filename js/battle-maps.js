// mapa de batalha próprio de cada estado: relevo, água, cidade e as regras que vêm com eles
// cada código tem um nome de campo e traços; o mesmo estado gera sempre o mesmo mapa (semente fixa por estado e tipo de batalha)
const MAPF={
  AC:['Seringais do Acre',['selva','rio']],AM:['Encontro das Águas',['selva','rio','palafitas']],RR:['Lavrado e serras',['cerrado','serra']],
  RO:['Vale do Madeira',['selva','rio']],PA:['Delta e Marajó',['ilhas','selva']],AP:['Costa do Amapá',['litoral','selva']],
  TO:['Cerrado do Tocantins',['cerrado','rio']],MA:['Baía de São Marcos',['baia','litoral']],PI:['Chapadas do Piauí',['caatinga','chapada']],
  CE:['Sertão e dunas',['caatinga','litoral']],RN:['Dunas potiguares',['litoral','caatinga']],PB:['Canaviais da Paraíba',['canavial','litoral']],
  PE:['Recife das pontes',['canavial','rio','cidade']],AL:['Lagoas de Alagoas',['canavial','lagoas']],SE:['Foz do São Francisco',['canavial','rio']],
  BA:['Recôncavo baiano',['baia','cidade','litoral']],MT:['Pantanal norte',['pantanal','cerrado']],MS:['Pantanal sul',['pantanal','pampa']],
  GO:['Chapada dos Veadeiros',['cerrado','chapada']],DF:['Planalto Central',['cerrado','cidade']],MG:['Serras das Minas',['serra','minas']],
  ES:['Costa capixaba',['litoral','mata']],RJ:['Baía de Guanabara',['baia','serra','cidade']],SP:['Serra do Mar',['serra','cidade']],
  PR:['Campos de araucária',['araucaria','pampa']],SC:['Serra e litoral catarinense',['litoral','serra']],RS:['Pampa gaúcho',['pampa']],
  // campanhas históricas
  REC:['Recife das pontes',['canavial','rio','cidade']],NAT:['Dunas de Natal',['litoral','caatinga']],FOR:['Fortaleza e o sertão',['caatinga','litoral']],
  POA:['Porto Alegre e o Guaíba',['baia','cidade','pampa']],LAG:['Laguna',['litoral','lagoas']],RGR:['Barra do Rio Grande',['litoral','pampa']],
  BEL:['Belém e a baía do Guajará',['ilhas','cidade']],MAN:['Barra do Rio Negro',['selva','rio','palafitas']],MAR:['Ilha do Marajó',['ilhas','pampa']]};
const MBIO={ama:['selva','rio'],ser:['caatinga'],cer:['cerrado'],sud:['serra'],sul:['araucaria'],mata:['canavial'],pampa:['pampa']};
function mapOf(i){const m=MAPF[S[i][0]];if(m)return{nome:m[0],f:m[1]};const f=[...(MBIO[BOF[i]]||[])];if(COAST.includes(i))f.push('litoral');return{nome:BIO[BOF[i]].nome,f}}
// regra de cada traço: nome, efeito na batalha e quem ganha com ele ('atk', 'def' ou '' para os dois)
const FXR={selva:['Selva fechada','mata dá +40% de defesa; cavalaria anda 1 a menos','def'],rio:['Rio largo','pontes e vaus decidem a travessia','def'],
  palafitas:['Palafitas','vilas na beira d’água','def'],ilhas:['Ilhas e canais','canais cortam o campo; canoeiros andam pela água',''],
  litoral:['Bateria costeira','quem ocupa a bateria atira com +2 de alcance','def'],baia:['Baía','a água fecha um lado do campo: menos espaço para manobrar','def'],
  lagoas:['Lagoas','lagoas espalhadas isolam as vilas',''],caatinga:['Caatinga','calor forte: infantaria anda 1 a menos','def'],
  chapada:['Chapadas','paredões de pedra; tiro +1 nos morros ao redor',''],cerrado:['Cerrado aberto','pouco abrigo: cavalaria anda 1 a mais','atk'],
  serra:['Serra','uma serra corta o campo: só se passa pelos desfiladeiros','def'],minas:['Vilas mineiras','cada vila tomada rende 3 de ouro','atk'],
  canavial:['Canaviais','canavial dá +20% de defesa',''],pampa:['Pampa','campo aberto: cavalaria anda 1 a mais','atk'],
  pantanal:['Pantanal','alagados custam 2 passos; cavalaria anda 1 a menos','def'],cidade:['Cidade','muitas vilas e casario: +40% de defesa nelas','def'],
  mata:['Mata Atlântica','mata dá +40% de defesa','def'],araucaria:['Araucárias','faixas de mata alta: abrigo para emboscadas','']};
const fxOn=k=>!!B?.fx?.includes(k);
const tdef=t=>({f:fxOn('selva')||fxOn('mata')?1.4:1.3,v:fxOn('cidade')?1.4:1.3,Q:1.3,c:1.2,T:1.4,K:1.2,L:.9})[t]||1; // defesa do terreno onde o alvo está
const vgold=()=>fxOn('minas')?3:2; // ouro por vila tomada
const vgTot=sd=>Math.min(fxOn('minas')?12:8,vgold()*[...(B?.vil?.values()||[])].filter(v=>v==sd).length); // ouro de batalha, com teto (cidades têm muitas casas)
const seeded=s=>{let a=s>>>0;return()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
const strSeed=t=>[...t].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);

// ---------- antes da batalha: maquete 3D do campo, forças, objetivo e o que o terreno favorece ----------
function briefObj(){const ps=B.ps,en=ps?B.af:B.was;
  if(B.obj)return OBJ[B.obj][ps?2:1]+(ps?', até a última rodada':', ou derrube o comandante');
  if(B.kind=='cerco')return ps?'segure a cidade: derrube as escadas, use as torres e não deixe tomarem a praça':'abra caminho (portão, brecha de canhão ou escadas da infantaria) e leve uma unidade até a praça';
  return ps?`resista até a rodada ${MAXR} ou derrube o comandante de ${S[en][4]}`:`derrube o comandante de ${S[en][4]} ou faça o exército dele debandar`}
function showBrief(){if(!B||B.auto)return;const ps=B.ps,me_=ps?B.was:B.af,en=ps?B.af:B.was,hid=B.kind=='emboscada',mine=alive(ps),foe=alive(1-ps),b0=B;
  const fx=(B.fx||[]).map(k=>{const r=FXR[k];if(!r)return'';const cl=!r[2]?'':(r[2]=='def')==(ps==1)?'good':'bad';
    return`<li class="${cl}">${I(cl=='good'?'up':cl=='bad'?'down':'scroll')}<span><b>${r[0]}</b> · ${r[1]}</span></li>`}).join('');
  const wx=B.wx=='rain'?'<li>'+I('warn')+'<span><b>Chuva</b> · tiro com 1 casa a menos de alcance</span></li>':B.wx=='dry'?'<li>'+I('warn')+'<span><b>Seca</b> · infantaria anda 1 casa a menos</span></li>':'';
  const side=(f,us,cls,who)=>`<figure class="${cls}"><img src="${face[f]}" alt=""><b>${S[f][4]}</b><span>${hid&&cls=='them'?'?':us.reduce((a,u)=>a+u.hp,0)}</span><small>${who} · ${hid&&cls=='them'?'?':us.length} unidades</small></figure>`;
  scr(`<h2>${KIND[B.kind][0]} · ${S[B.to][1]}</h2><div class="brief"><div class="b3d"><canvas id="b3d" width="720" height="460" aria-label="Maquete do campo de batalha"></canvas>
      <div class="b3l"><span class="me">Você</span><span class="them">Inimigo</span>${B.goals||B.pr?'<span class="obj">Objetivo</span>':''}<em>Arraste para girar</em></div></div>
    <div class="binfo"><div class="vsr">${side(me_,mine,'me',ps?'defende':'ataca')}<em>×</em>${side(en,foe,'them',ps?'ataca':'defende')}</div>
      <div class="box"><b>${I('flag')}Objetivo</b><p>${briefObj()}</p></div>
      <div class="box"><b>${I('eye')}${B.mapName||B.bio.nome}</b><ul class="fxl">${fx}${wx}<li>${I('scroll')}<span><b>${KIND[B.kind][0]}</b> · ${KIND[B.kind][1]}</span></li></ul><p class="hint">Limite: ${MAXR} rodadas</p></div>
      <div class="bact"><button data-s="bgo" class="end" data-x>Posicionar tropas${I('play')}</button><button data-s="bauto2">Batalha automática</button>${!ps?'<button data-s="bback">Recuar</button>':''}</div></div></div>`);
  $('card').classList.add('wide');
  const cvb=$('b3d');let yaw=-.45,drag=null,auto=true;
  cvb.onpointerdown=e=>{drag={x:e.clientX,y:yaw};auto=false;cvb.setPointerCapture(e.pointerId)};
  cvb.onpointermove=e=>{if(drag)yaw=drag.y+(e.clientX-drag.x)*.008};cvb.onpointerup=()=>drag=null;
  let t0=performance.now();(function loop(t){if(!cvb.isConnected||B!==b0)return;requestAnimationFrame(loop);if(auto&&!CFG.calm)yaw=-.45+Math.sin((t-t0)/2600)*.35;brief3D(cvb,yaw,t)})(t0)}
function brief3D(c,yaw,now){const g=c.getContext('2d'),W0=c.width,H0=c.height,cs=Math.cos(yaw),sn=Math.sin(yaw),cx0=GW/2,cy0=GH/2;
  const HT={w:-.18,a:-.06,b:.04,r:.02,P:.06,R:.2,c:.22,f:.18,h:.5,v:.38,Q:.5,K:.38,m:1.25,W:.95,D:.85,T:1.35,L:.95},
    COL={g:B.bio.g[0],r:'#c79a5e',w:'#3a86cc',a:'#7ab0d8',b:'#9a6a36',f:B.bio.gd,m:'#9a9284',h:'#b8a868',v:'#efe2c0',Q:'#c0504a',W:'#a89c88',D:'#6b4524',T:'#b8ad98',P:'#e2a83c',L:'#c99a5c',R:'#8d877b',c:'#9fc84a',K:'#6b6258'};
  const rot=(x_,y_)=>{const dx=x_-cx0,dy=y_-cy0;return[dx*cs-dy*sn,dx*sn+dy*cs]};
  let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;[[0,0],[GW,0],[0,GH],[GW,GH]].forEach(([a,b])=>{const[rx,ry]=rot(a,b);mnx=Math.min(mnx,rx-ry);mxx=Math.max(mxx,rx-ry);mny=Math.min(mny,(rx+ry)*.5);mxy=Math.max(mxy,(rx+ry)*.5)});
  const s=Math.min((W0-30)/(mxx-mnx),(H0-70)/(mxy-mny)),ox=W0/2-(mnx+mxx)/2*s,oy=H0/2+20-(mny+mxy)/2*s;
  const P=(x_,y_,z)=>{const[rx,ry]=rot(x_,y_);return[ox+(rx-ry)*s,oy+(rx+ry)*.5*s-z*s*.85]};
  const shade=(hex,k)=>{const n=parseInt(hex.slice(1),16);return`rgb(${(n>>16&255)*k|0},${(n>>8&255)*k|0},${(n&255)*k|0})`};
  const quad=(pts,col)=>{g.fillStyle=col;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()};
  g.clearRect(0,0,W0,H0);const bg=g.createRadialGradient(W0/2,H0/2,40,W0/2,H0/2,W0*.7);bg.addColorStop(0,'#3a2c30');bg.addColorStop(1,'#140c0e');g.fillStyle=bg;g.fillRect(0,0,W0,H0);
  quad([P(-.4,-.4,-.35),P(GW+.4,-.4,-.35),P(GW+.4,GH+.4,-.35),P(-.4,GH+.4,-.35)],'#22160f'); // base de madeira da maquete
  const cells=[];for(let y_=0;y_<GH;y_++)for(let x_=0;x_<GW;x_++){const[rx,ry]=rot(x_+.5,y_+.5);cells.push([rx+ry,x_,y_])}cells.sort((a,b)=>a[0]-b[0]);
  const faces=[[0,1,0,0,1,0],[0,-1,0,1,1,1],[1,0,1,0,1,1],[-1,0,0,0,0,1]]; // normal e aresta: [nx,ny, x1,y1, x2,y2] relativos à casa
  for(const[,x_,y_]of cells){const t=B.T[y_][x_],z=HT[t]||0,col=COL[t]||COL.g,v=1+((hash(x_,y_)%7)-3)*.015;
    if(z>0)faces.forEach(([nx,ny,a1,b1,a2,b2])=>{const[rx,ry]=rot(nx+cx0,ny+cy0);if(rx+ry<=0)return; /* só as faces voltadas para quem olha */
      const k=(nx*cs-ny*sn)>0?.62:.8;quad([P(x_+a1,y_+b1,z),P(x_+a2,y_+b2,z),P(x_+a2,y_+b2,0),P(x_+a1,y_+b1,0)],shade(col,k*v))});
    quad([P(x_,y_,z),P(x_+1,y_,z),P(x_+1,y_+1,z),P(x_,y_+1,z)],shade(col,v));
    if(t=='f'){const[px_,py_]=P(x_+.5,y_+.5,z);g.fillStyle=shade(B.bio.gd,.8);g.beginPath();g.arc(px_,py_-s*.35,s*.38,0,7);g.fill();g.fillStyle=shade(B.bio.gl||'#74d05c',.9);g.beginPath();g.arc(px_-s*.1,py_-s*.45,s*.18,0,7);g.fill()}
    if(t=='v'||t=='Q'){const[a,b]=P(x_+.5,y_+.2,z),[c2,d2]=P(x_+.15,y_+.6,z),[e,f]=P(x_+.85,y_+.6,z);g.fillStyle=t=='Q'?'#8a2a1c':'#c8452f';g.beginPath();g.moveTo(a,b-s*.3);g.lineTo(c2,d2);g.lineTo(e,f);g.fill()}}
  const pin=(u,col,big)=>{const z=Math.max(0,HT[B.T[u.y][u.x]]||0),[px_,py_]=P(u.x+.5,u.y+.5,z),h=s*(big?1.9:1.4),w=s*(big?1:.8); /* bandeira de cada regimento; o comandante com estrela */
    g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(px_,py_,s*.35,s*.15,0,0,7);g.fill();g.strokeStyle='#2a1a10';g.lineWidth=2;g.beginPath();g.moveTo(px_,py_);g.lineTo(px_,py_-h);g.stroke();
    g.fillStyle=col;g.lineWidth=1.2;g.beginPath();g.moveTo(px_+1,py_-h);g.lineTo(px_+w,py_-h+w*.35);g.lineTo(px_+1,py_-h+w*.7);g.closePath();g.fill();g.stroke();
    g.fillStyle='rgba(255,255,255,.45)';g.fillRect(px_+2,py_-h+2,w*.35,2);
    if(big){g.fillStyle='#ffd23f';g.strokeStyle='#3a2413';g.beginPath();g.arc(px_,py_-h-s*.2,s*.24,0,7);g.fill();g.stroke()}};
  [...B.units].filter(u=>u.hp>0&&(u.side==B.ps||B.kind!='emboscada')).sort((a,b)=>rot(a.x,a.y).reduce((p,q)=>p+q)-rot(b.x,b.y).reduce((p,q)=>p+q))
    .forEach(u=>pin(u,u.side==B.ps?'#4f8fff':'#e0483a',u.ld));
  [...(B.goals||[]),...(B.pr?[[B.pr.x,B.pr.y]]:[])].forEach(([gx,gy])=>{const[px_,py_]=P(gx+.5,gy+.5,.1),r=s*.45*(1+.12*Math.sin(now/300));g.fillStyle='#ffd23f';g.strokeStyle='#3a2413';g.lineWidth=2;g.beginPath();
    for(let i=0;i<10;i++){const rr=i%2?r*.45:r,an=-Math.PI/2+i*Math.PI/5;g.lineTo(px_+Math.cos(an)*rr,py_-s*.8+Math.sin(an)*rr)}g.closePath();g.fill();g.stroke()})}
