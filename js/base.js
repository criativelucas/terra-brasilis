// utilidades de tela, configurações e efeitos sonoros
const $=id=>document.getElementById(id),cv=$('map'),x=cv.getContext('2d');
const hue=f=>f*137.508%360, px=i=>[(S[i][2]-X0)/D*C,(Y0-S[i][3])/D*C];
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]};
const FONT=n=>`600 ${Math.round(n*1.45)}px "Pixelify Sans",sans-serif`; // fonte de pixel moderna; n segue a escala antiga
CFG.q=2;CFG.big=0;CFG.cb=0;CFG.confirm=1;CFG.calm=matchMedia('(prefers-reduced-motion: reduce)').matches?1:0; // q: qualidade dos efeitos; calm: efeitos fortes reduzidos
try{Object.assign(CFG,JSON.parse(localStorage.getItem('tb-cfg')||'{}'))}catch{}
const applyCfg=()=>{document.body.classList.toggle('big',!!CFG.big)};applyCfg();
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
// contadores: números de ouro e tropas sobem ou descem até o valor novo
const CNT={},cnt=(k,v)=>`<b class="cnt" data-cnt="${k}" data-v="${v}">${CNT[k]??v}</b>`;
setInterval(()=>document.querySelectorAll('[data-cnt]').forEach(el=>{const k=el.dataset.cnt,v=+el.dataset.v,c=CNT[k]??v;
  if(c==v){CNT[k]=v;el.classList.remove('up','dn');return}const n=c+Math.sign(v-c)*Math.max(1,Math.abs(v-c)/6|0);CNT[k]=n;el.textContent=n;el.classList.toggle('up',v>c);el.classList.toggle('dn',v<c)}),45);
function toast(t){const box=$('toasts'),d=document.createElement('div');d.className='toast';d.textContent=t;box.prepend(d);while(box.children.length>4)box.lastChild.remove();setTimeout(()=>d.remove(),2700)}

