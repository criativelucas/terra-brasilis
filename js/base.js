// utilidades de tela, configurações e efeitos sonoros
const $=id=>document.getElementById(id),cv=$('map'),x=cv.getContext('2d');
const hue=f=>f*137.508%360, px=i=>[(S[i][2]-X0)/D*C,(Y0-S[i][3])/D*C];
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]};
const FONT=n=>`700 ${Math.round(n*1.6)}px "Alegreya",Georgia,serif`;
// caixas no canvas no tema de crônica: pergaminho, laca escura e letreiro caligráfico
const rr=(g,X,Y,w,h,r)=>{g.beginPath();g.roundRect(X,Y,w,h,Math.max(0,r))};
function parch(g,X,Y,w,h,r=12){g.save();g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=10;g.shadowOffsetY=4;g.fillStyle='#3b2618';rr(g,X,Y,w,h,r);g.fill();g.restore();
  const gr=g.createLinearGradient(0,Y,0,Y+h);gr.addColorStop(0,'#f6ecd4');gr.addColorStop(1,'#dcc9a2');g.fillStyle=gr;rr(g,X+2,Y+2,w-4,h-4,r-2);g.fill();
  g.lineWidth=1;g.strokeStyle='#6b4a2e';rr(g,X+2.5,Y+2.5,w-5,h-5,r-2);g.stroke();g.strokeStyle='rgba(168,135,90,.6)';g.lineWidth=1.5;rr(g,X+6,Y+6,w-12,h-12,r-5);g.stroke()}
function lac(g,X,Y,w,h,r=10){g.save();g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=8;g.shadowOffsetY=3;g.fillStyle='#140c0e';rr(g,X,Y,w,h,r);g.fill();g.restore();
  const gr=g.createLinearGradient(0,Y,0,Y+h);gr.addColorStop(0,'#5a3a41');gr.addColorStop(1,'#2a1a1f');g.fillStyle=gr;rr(g,X+1,Y+1,w-2,h-2,r-1);g.fill();
  g.strokeStyle='#b8955a';g.lineWidth=1.5;rr(g,X+3.5,Y+3.5,w-7,h-7,r-3);g.stroke()}
function scriptT(g,t,X,Y,n,al='center',mw){g.font=`italic 800 ${n}px "Alegreya",Georgia,serif`;g.textAlign=al;g.lineJoin='round';g.lineWidth=Math.max(3,n/5);g.strokeStyle='#3a1a0c';g.strokeText(t,X,Y,mw);
  const gr=g.createLinearGradient(0,Y,0,Y+n*1.1);gr.addColorStop(0,'#ffd88a');gr.addColorStop(.75,'#f08a3a');g.fillStyle=gr;g.fillText(t,X,Y,mw)} // fonte de pixel moderna; n segue a escala antiga
CFG.q=2;CFG.big=0;CFG.cb=0;CFG.confirm=1;CFG.calm=matchMedia('(prefers-reduced-motion: reduce)').matches?1:0; // q: qualidade dos efeitos; calm: efeitos fortes reduzidos
try{Object.assign(CFG,JSON.parse(localStorage.getItem('tb-cfg')||'{}'))}catch{}
const applyCfg=()=>{document.body.classList.toggle('big',!!CFG.big)};applyCfg();
// ícones em pixel 10x10 (no lugar dos emojis): O contorno, W branco, Y/y ouro, R vermelho, B/b madeira, G/g metal, U azul, S sol, K preto
const PXI={scroll:['..OOOOOO..','.OWWWWWWO.','.OWbbbbWO.','..OWWWWO..','..OWbbWO..','..OWWWWO..','..OWbbWO..','.OWWWWWWO.','.OWWWWWWO.','..OOOOOO..'],
  swords:['O........O','OGO....OGO','.OGO..OGO.','..OGOOGO..','...OGGO...','...OGGO...','..OYOOYO..','.OYO..OYO.','OBO....OBO','OO......OO'],
  flag:['.OOOOOO...','.ORRRRRO..','.ORRRRRRO.','.ORRRRRO..','.OOOOOO...','.Ob.......','.Ob.......','.Ob.......','.Ob.......','OOOO......'],
  menu:['..........','.OOOOOOOO.','.OWWWWWWO.','.OOOOOOOO.','.OWWWWWWO.','.OOOOOOOO.','.OWWWWWWO.','.OOOOOOOO.','..........','..........'],
  coin:['...OOOO...','..OYYYYO..','.OYWYYyyO.','.OYYyYYyO.','.OYYyYYyO.','.OYYyYYyO.','.OYYYYyyO.','..OyyyyO..','...OOOO...','..........'],
  star:['....OO....','....OYO...','...OYYO...','OOOOYYOOOO','OYYYYYYYYO','.OYYYYYYO.','..OYYYYO..','.OYYOOYYO.','.OYO..OYO.','.OO....OO.'],
  sun:['....Y.....','.Y..Y..Y..','..YOOOOY..','..OSSSSO..','YYOSSSSOYY','..OSSSSO..','..YOOOOY..','.Y..Y..Y..','....Y.....','..........'],
  moon:['...OOOO...','..OUUUO...','.OUUUO....','.OUUO.....','.OUUO.....','.OUUUO....','..OUUUOOO.','...OUUUUO.','....OOOO..','..........'],
  shield:['.OOOOOOOO.','.OGGGGGGO.','.OGWGGGgO.','.OGWGGGgO.','.OGGGGGgO.','..OGGGgO..','..OGGGgO..','...OGgO...','....OO....','..........'],
  anchor:['....OO....','...OGGO...','....OO....','..OOGGOO..','....GG....','....GG....','.O..GG..O.','.OG.GG.GO.','..OGGGGO..','...OOOO...'],
  warn:['....OO....','...OYYO...','...OYYO...','..OYKKYO..','..OYKKYO..','.OYYKKYYO.','.OYYYYYYO.','OYYYKKYYYO','OOOOOOOOOO','..........'],
  house:['....OO....','...ORRO...','..ORRRRO..','.ORRRRRRO.','OOOOOOOOOO','.OWWWWWWO.','.OWbbWWWO.','.OWbbWBWO.','.OWbbWWWO.','.OOOOOOOO.'],
  boot:['..OOOO....','..OBBO....','..OBBO....','..OBBO....','..OBBO....','..OBBBOOO.','.OBBBBBBO.','.OBBBBBBO.','.OOOOOOOO.','..........'],
  aim:['....OO....','..OOROOO..','.OR.RR.RO.','.O..RR..O.','ORRRRRRRRO','.O..RR..O.','.OR.RR.RO.','..OOROOO..','....OO....','..........']};
const PXC={O:'#1a1220',W:'#f4f0e6',Y:'#f6c64a',y:'#b07a20',R:'#d4382c',B:'#9a6234',b:'#5e3a1e',G:'#c3ccd4',g:'#6d7680',U:'#6f8fff',S:'#ffd88a',K:'#2b2633'},PXU={};
const pxIcon=n=>{if(!PXU[n]){const[c,g]=mk(10,10);PXI[n].forEach((r,y)=>[...r].forEach((ch,x_)=>{if(PXC[ch]){g.fillStyle=PXC[ch];g.fillRect(x_,y,1,1)}}));PXU[n]=c.toDataURL()}return PXU[n]};
const I=n=>`<img class="ico" src="${pxIcon(n)}" alt="">`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
// glossário: termos com data-g mostram a explicação ao passar o mouse ou ao focar pelo teclado
const GLOSS={def:'Defesa: reduz o dano recebido quando este território é atacado. Somam o traço do líder, os fortes e a doutrina Guerrilha.',
  forte:'Forte: cada nível dá +20% de defesa, até 2 níveis. Some quando o território é conquistado.',
  porto:'Porto: +1 ouro por turno e rotas marítimas até territórios litorâneos próximos.',
  elite:'Tropa de elite: um regimento deste território luta com bônus próprio (alcance, movimento, dano ou defesa).',
  xp:'Regimentos: cada um dos 6 regimentos ganha experiência ao sobreviver e vencer. Cada nível dá +8% de dano, até o nível 3.',
  renda:'Renda: ouro que o território rende por turno. Regiões completas dão bônus extra.',
  recruta:'Recrutar: custo em ouro de cada tropa nova neste território.',
  tri:'Triângulo: Infantaria vence Cavalaria, Cavalaria vence Atiradores, Atiradores vencem Infantaria. Quem vence leva +50% de dano. A Artilharia fica de fora.',
  brado:'Brado do comandante: uma vez por batalha, +40% de dano para todo o seu exército durante a rodada.',
  doc:'Doutrinas: melhorias permanentes compradas na Sala de Guerra do quartel. Os rivais ganham as suas conforme crescem.',
  sub:'Subsídio da Corte: ouro extra que o lado imperial recebe do Rio de Janeiro a cada turno nas campanhas históricas.',
  chance:'Estimativa pelo combate automático. Na batalha tática, o resultado depende das suas jogadas.',
  perigo:'Em perigo: um vizinho sem pacto tem tropas para tomar este território no próximo turno.'};
const gl=(k,t)=>`<span class="gl" data-g="${k}" tabindex="0">${t}</span>`;
const glossShow=(el,x_,y_)=>{const g=$('gloss');if(!el){g.hidden=true;return}g.textContent=GLOSS[el.dataset.g];g.hidden=false;
  const w=g.offsetWidth;g.style.left=Math.max(6,Math.min(innerWidth-w-6,x_+12))+'px';g.style.top=(y_+18)+'px'};
document.addEventListener('mouseover',e=>{const el=e.target.closest?.('[data-g]');glossShow(el,e.clientX,e.clientY)});
document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-g]');if(el){const r=el.getBoundingClientRect();glossShow(el,r.left,r.bottom-10)}else glossShow(null)});
// emblemas 7x7 por facção, para não depender só da cor
const EMB=[['...#...','..###..','#######','.#####.','..###..','.##.##.','##...##'],['..###..','..###..','#######','#######','#######','..###..','..###..'],
  ['...#...','..###..','.#####.','#######','.#####.','..###..','...#...'],['..###..','.#####.','#######','#######','#######','.#####.','..###..'],
  ['#######','#######','.......','#######','#######','.......','#######'],['#.....#','##...##','.##.##.','..###..','...#...','.......','.......'],
  ['...#...','...#...','..###..','..###..','.#####.','.#####.','#######'],['#######','#.....#','#.###.#','#.###.#','#.###.#','#.....#','#######']].map(r=>r.join(''));
function emblem(g,X,Y,f,col,s=1){const m=EMB[f%8];g.fillStyle=col;for(let k=0;k<49;k++)if(m[k]=='#')g.fillRect(X+(k%7)*s,Y+(k/7|0)*s,s,s)}
const saveCfg=()=>{try{localStorage.setItem('tb-cfg',JSON.stringify(CFG))}catch{}};

// som: bipes de oscilador, só depois do primeiro clique
let AC;
const beep=(f,d=.08,type='square',when=0)=>{if(!CFG.vol)return;try{AC=AC||new AudioContext;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+when;
  o.type=type;o.frequency.value=f;g.gain.setValueAtTime(CFG.vol*.12,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d)}catch{}};
const sfx={sel:()=>beep(660,.05),move:()=>beep(330,.07,'triangle'),hit:()=>{beep(140,.12,'sawtooth');beep(90,.16,'square',.03)},
  win:()=>[523,659,784,1047].forEach((f,i)=>beep(f,.16,'square',i*.11)),lose:()=>[392,330,262,196].forEach((f,i)=>beep(f,.22,'triangle',i*.14)),
  thunder:()=>{beep(55,.7,'sawtooth');beep(41,.9,'square',.06)},fanfare:()=>[523,659,784,1047,784,1047,1319].forEach((f,i)=>beep(f,.2,'square',i*.12))};
// ruído filtrado: papel, lâmina, pólvora, cascos
let NB=null;const noise=(d,f,q=1,type='bandpass',vol=.25,when=0,f2)=>{if(!CFG.vol)return;try{AC=AC||new AudioContext;if(!NB){NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const c=NB.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=Math.random()*2-1}
  const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain(),t=AC.currentTime+when;s.buffer=NB;fl.type=type;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);fl.Q.value=q;
  g.gain.setValueAtTime(CFG.vol*vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl).connect(g).connect(AC.destination);s.start(t,Math.random()*.4);s.stop(t+d)}catch{}};
Object.assign(sfx,{page:()=>{noise(.2,1400,.8,'bandpass',.22,0,500);noise(.1,3500,1,'highpass',.08,.07)},tick:()=>{beep(1400,.025,'square');beep(900,.02,'triangle',.02)},
  sword:()=>{noise(.12,4200,6,'bandpass',.32);beep(1760,.16,'triangle');beep(2490,.12,'sine',.01)},musket:()=>{noise(.3,1100,.7,'lowpass',.55,0,180);noise(.05,3200,1,'highpass',.35)},
  cannon:()=>{noise(.7,380,.6,'lowpass',.8,0,50);beep(55,.55,'sine');beep(41,.6,'triangle',.05)},bow:()=>{noise(.18,2200,2,'bandpass',.2,0,800);beep(330,.06,'triangle')},
  hooves:()=>[0,.1,.24,.34,.48,.58].forEach(w=>noise(.05,650,3,'bandpass',.4,w)),
  cut:()=>{noise(.5,300,.8,'bandpass',.3,0,3500);[392,523,659,784,1047].forEach((f,i)=>beep(f,.22,'square',.15+i*.07))},
  strike:(t,far)=>{if(t=='art')sfx.cannon();else if(far)t=='can'?sfx.bow():sfx.musket();else{sfx.sword();if(t=='cav'||t=='lan')sfx.hooves()}beep(110,.1,'sawtooth',.02)}});
// contadores: números de ouro e tropas sobem ou descem até o valor novo
const CNT={},cnt=(k,v)=>`<b class="cnt" data-cnt="${k}" data-v="${v}">${CNT[k]??v}</b>`;
setInterval(()=>document.querySelectorAll('[data-cnt]').forEach(el=>{const k=el.dataset.cnt,v=+el.dataset.v,c=CNT[k]??v;
  if(c==v){CNT[k]=v;el.classList.remove('up','dn');return}const n=c+Math.sign(v-c)*Math.max(1,Math.abs(v-c)/6|0);CNT[k]=n;el.textContent=n;el.classList.toggle('up',v>c);el.classList.toggle('dn',v<c)}),45);
function toast(t){const box=$('toasts'),d=document.createElement('div');d.className='toast';d.textContent=t;box.prepend(d);while(box.children.length>4)box.lastChild.remove();setTimeout(()=>d.remove(),2700)}

