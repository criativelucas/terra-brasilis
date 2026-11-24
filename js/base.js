// utilidades de tela, configurações e efeitos sonoros
const $=id=>document.getElementById(id),cv=$('map'),x=cv.getContext('2d');
const hue=f=>f*137.508%360, px=i=>[(S[i][2]-X0)/D*C,(Y0-S[i][3])/D*C];
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]};
const FONT=n=>`700 ${Math.round(n*1.6)}px ${n<9?'"Alegreya Sans",system-ui,sans-serif':'"Alegreya",Georgia,serif'}`; // textos pequenos do canvas na mesma fonte simples da interface
// caixas no canvas no tema de crônica: pergaminho, laca escura e letreiro caligráfico
const rr=(g,X,Y,w,h,r)=>{g.beginPath();g.roundRect(X,Y,w,h,Math.max(0,r))};
function parch(g,X,Y,w,h,r=12){g.save();g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=10;g.shadowOffsetY=4;g.fillStyle='#3b2618';rr(g,X,Y,w,h,r);g.fill();g.restore();
  r=Math.min(r,4);g.fillStyle='#e9e2cc';rr(g,X+2,Y+2,w-4,h-4,r);g.fill(); /* papel vergé com moldura de dois filetes */
  g.strokeStyle='rgba(36,28,19,.06)';g.lineWidth=1;for(let yy=Y+5;yy<Y+h-3;yy+=3){g.beginPath();g.moveTo(X+3,yy+.5);g.lineTo(X+w-3,yy+.5);g.stroke()}
  g.strokeStyle='#241c13';rr(g,X+2.5,Y+2.5,w-5,h-5,r);g.stroke();g.strokeStyle='#cda23a';rr(g,X+6.5,Y+6.5,w-13,h-13,Math.max(0,r-2));g.stroke()}
function lac(g,X,Y,w,h,r=10){g.save();g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=8;g.shadowOffsetY=3;g.fillStyle='#140c0e';rr(g,X,Y,w,h,r);g.fill();g.restore();
  r=Math.min(r,5);const gr=g.createLinearGradient(0,Y,0,Y+h);gr.addColorStop(0,'#24533d');gr.addColorStop(1,'#163625');g.fillStyle=gr;rr(g,X+1,Y+1,w-2,h-2,r);g.fill(); /* insígnia: verde Bragança com filete de ouro */
  g.strokeStyle='#cda23a';g.lineWidth=1;rr(g,X+3.5,Y+3.5,w-7,h-7,Math.max(0,r-2));g.stroke()}
function scriptT(g,t,X,Y,n,al='center',mw){g.font=`italic 400 ${Math.round(n*1.05)}px "Old Standard TT",Georgia,serif`;g.textAlign=al;g.lineJoin='round';g.lineWidth=Math.max(2.5,n/7);g.strokeStyle='#14321f';g.strokeText(t,X,Y,mw); /* letreiro: tipo moderno do século XIX, em ouro */
  g.fillStyle='#ebd38a';g.fillText(t,X,Y,mw)} // fonte de pixel moderna; n segue a escala antiga
CFG.q=2;CFG.big=0;CFG.cb=0;CFG.confirm=1;CFG.calm=matchMedia('(prefers-reduced-motion: reduce)').matches?1:0; // q: qualidade dos efeitos; calm: efeitos fortes reduzidos
try{Object.assign(CFG,JSON.parse(localStorage.getItem('tb-cfg')||'{}'))}catch{}
const applyCfg=()=>{document.body.classList.toggle('big',!!CFG.big);document.documentElement.style.setProperty('--uiz',[.9,1,1.15,1.3][CFG.uiz??1])};applyCfg(); // --uiz: tamanho da interface
// ícones em pixel 10x10 (no lugar dos emojis): O contorno, W branco, Y/y ouro, R vermelho, B/b madeira, G/g metal, U azul, S sol, K preto
const PXI={scroll:['..OOOOOO..','.OWWWWWWO.','.OWbbbbWO.','..OWWWWO..','..OWbbWO..','..OWWWWO..','..OWbbWO..','.OWWWWWWO.','.OWWWWWWO.','..OOOOOO..'],
  swords:['O........O','OGO....OGO','.OGO..OGO.','..OGOOGO..','...OGGO...','...OGGO...','..OYOOYO..','.OYO..OYO.','OBO....OBO','OO......OO'],
  flag:['.OOOOOO...','.ORRRRRO..','.ORRRRRRO.','.ORRRRRO..','.OOOOOO...','.Ob.......','.Ob.......','.Ob.......','.Ob.......','OOOO......'],
  back:['..........','....OO....','...OYO....','..OYYOOOO.','.OYYYYYYYO','.OYYYYYYYO','..OYYOOOO.','...OYO....','....OO....','..........'],
  fwd:['..........','....OO....','....OYO...','.OOOOYYO..','OYYYYYYYO.','OYYYYYYYO.','.OOOOYYO..','....OYO...','....OO....','..........'],
  play:['..OO......','..OYO.....','..OYYO....','..OYYYO...','..OYYYYO..','..OYYYYO..','..OYYYO...','..OYYO....','..OYO.....','..OO......'],
  check:['........OO','.......ONO','......ONO.','OO...ONO..','ONO.ONO...','.ONONO....','..ONO.....','...O......','..........','..........'],
  eye:['..........','..........','...OOOO...','..OWWWWO..','.OWWOOWWO.','OWWOKKOWWO','.OWWOOWWO.','..OWWWWO..','...OOOO...','..........'],
  up:['..........','....OO....','...ONNO...','..ONNNNO..','.ONNNNNNO.','OOOONNOOOO','...ONNO...','...ONNO...','...OOOO...','..........'],
  down:['..........','...OOOO...','...ORRO...','...ORRO...','OOOORROOOO','.ORRRRRRO.','..ORRRRO..','...ORRO...','....OO....','..........'],
  close:['.OO....OO.','OWWO..OWWO','.OWWOOWWO.','..OWWWWO..','...OWWO...','..OWWWWO..','.OWWOOWWO.','OWWO..OWWO','.OO....OO.','..........'],
  undo:['..........','...OO.....','..OYO.....','.OYYOOOOO.','OYYYYYYYYO','.OYYOOOOYO','..OYO..OYO','...OO.OYYO','.....OYYO.','......OO..'],
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
Object.assign(PXI,{r_caf:['...OOOO...','..ObbbbO..','.ObbBbbbO.','.ObbBbbbO.','.ObbbBbbO.','.ObbbBbbO.','.ObbbbBbO.','..ObbbbO..','...OOOO...','..........'],
  r_acu:['....O.....','...ONO....','..ONnO.O..','..ONnOONO.','..ONnONnO.','..ONnONnO.','..ONnONnO.','..ONnONnO.','..ONnONnO.','..OOOOOOO.'],
  r_bor:['....OO....','...OWWO...','..OWWWWO..','..OWWWWO..','.OWWWWWWO.','.OWWWWWwO.','.OWWWWWwO.','..OWWWwO..','...OOOO...','..........'],
  r_our:['..........','...OOOO...','..OYYYyO..','.OYWYYYyO.','.OYYYYyyO.','.OYYYyyyO.','..OyyyyO..','...OOOO...','..........','..........'],
  r_gad:['.O......O.','OWO....OWO','.OOBBBBOO.','..OBBBBO..','..OKBBKO..','..OBBBBO..','...ObbO...','...ObbO...','....OO....','..........'],
  r_alg:['...OOOO...','..OWWWWO..','.OWWWWWWO.','.OWWWWWWO.','..OWWWWO..','..OnOOnO..','...OnnO...','....On....','....On....','....OO....'],
  r_erv:['......OOO.','....OONNO.','...ONNNnO.','..ONNNnO..','.ONNNnO...','.ONNnO....','.OnnO.....','.OnO......','O.O.......','O.........'],
  r_cac:['....O.....','...OOO....','..OyYYO...','.OyYYYYO..','.OyYRYYO..','.OyYRYYO..','.OyYRYYO..','..OyYYO...','...OOO....','..........']});
const PXC={N:'#7fc65a',n:'#3f7a34',w:'#b9b3a8',O:'#1a1220',W:'#f4f0e6',Y:'#f6c64a',y:'#b07a20',R:'#d4382c',B:'#9a6234',b:'#5e3a1e',G:'#c3ccd4',g:'#6d7680',U:'#6f8fff',S:'#ffd88a',K:'#2b2633'},PXU={};
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
function toast(t){const box=$('toasts'),d=document.createElement('div'),k=/Traição|Faltam|Indisponível|recusa|perd|Derrota|não |Nada para|Solte|cancelad|caiu|tomou .* de você/i.test(t)?'bad':/\+\d|firmad|construído|conquist|treinad|adotad|Desfeito|Vitória|paga|repeliu/i.test(t)?'ok':'info'; /* aviso: laca, cor e ícone pelo tipo */
  d.className='toast '+k;d.innerHTML=I(k=='bad'?'warn':k=='ok'?'check':'scroll');d.append(t);box.prepend(d);while(box.children.length>4)box.lastChild.remove();setTimeout(()=>d.remove(),2700)}


// ---------- som com padrão: passar o mouse, clicar e errar soam igual em todos os botões ----------
{const s0=sfx.sel;let t0=0;sfx.sel=()=>{const n=performance.now();if(n-t0<90)return;t0=n;s0()}} // clique repetido no mesmo instante toca uma vez
sfx.hover=()=>{if(!CFG.vol)return;try{AC=AC||new AudioContext;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type='triangle';o.frequency.value=1700;
  g.gain.setValueAtTime(CFG.vol*.035,t);g.gain.exponentialRampToValueAtTime(.0005,t+.03);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.035)}catch{}};
sfx.err=()=>{beep(190,.08,'square');beep(150,.08,'square',.06)};
{let hb=null,ht=0;document.addEventListener('mouseover',e=>{const b=e.target.closest?.('button');if(b&&b!==hb&&!b.disabled&&!b.classList.contains('off')&&performance.now()-ht>45&&!matchMedia('(hover:none)').matches){ht=performance.now();sfx.hover()}hb=b});
  document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!b)return;b.classList.contains('off')?sfx.err():sfx.sel()},true)}
// ---------- dica de primeira vez: aparece uma vez por recurso, depois do tutorial ----------
function coach(k,t){if(typeof tut!='undefined'&&tut>=0)return;try{const s=JSON.parse(localStorage.getItem('tb-ft')||'{}');if(s[k])return;s[k]=1;localStorage.setItem('tb-ft',JSON.stringify(s))}catch{return}
  let c=$('coach');if(!c){c=document.createElement('div');c.id='coach';c.setAttribute('role','status');document.body.appendChild(c);c.addEventListener('click',e=>{if(e.target.closest('button'))c.hidden=true})}
  c.innerHTML=`<b>${I('star')}Dica</b><p>${t}</p><button class="mini end">Entendi</button>`;c.hidden=false;clearTimeout(coach.t);coach.t=setTimeout(()=>c.hidden=true,14000)}
