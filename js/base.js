// utilidades de tela, configurações e efeitos sonoros
const $=id=>document.getElementById(id),cv=$('map'),x=cv.getContext('2d');
const hue=f=>f*137.508%360, px=i=>[(S[i][2]-X0)/D*C,(Y0-S[i][3])/D*C];
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]};
const FONT=n=>`${n}px "Press Start 2P",monospace`;
try{Object.assign(CFG,JSON.parse(localStorage.getItem('tb-cfg')||'{}'))}catch{}
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

