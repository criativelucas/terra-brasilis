// trilha chiptune
// trilha: baião no mapa, marcha em menor na batalha (transposta por bioma), modinha no quartel; [ms por passo, melodia, baixo]
const SONG={map:[190,[67,0,71,72,74,0,72,71,69,0,71,69,67,0,65,0,67,0,71,72,74,0,77,76,74,0,72,71,72,0,0,0],[43,0,0,43,0,0,50,0]],
  bat:[125,[69,0,69,72,76,0,74,72,69,0,69,72,77,76,74,72,68,0,68,71,74,0,72,71,69,72,76,81,80,0,76,0],[45,0,45,0,45,0,52,0]],
  hq:[230,[72,0,0,76,0,0,79,0,77,0,0,76,0,0,74,0,72,0,0,74,0,0,76,0,74,0,0,0,71,0,0,0],[48,0,0,0,55,0,0,0]]};
document.addEventListener('pointerdown',()=>{try{AC=AC||new AudioContext}catch{}},{once:true});
let step=0;
(function tune(){const[ms,mel,bas]=SONG[B?'bat':HQ?'hq':'map'],tr=B?[0,3,-2,5,2][Object.keys(BIO).indexOf(BOF[B.to])]:0;
  if(AC&&CFG.mus&&!document.hidden&&me>=0)try{[[mel[step%32],'square',.03,1.8],[bas[step%8],'triangle',.09,2.6]].forEach(([n,type,v,d])=>{if(!n)return;
    const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=type;o.frequency.value=440*2**((n+tr-69)/12);
    g.gain.setValueAtTime(CFG.mus*v,t);g.gain.exponentialRampToValueAtTime(.001,t+ms/1000*d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+ms/1000*d)})}catch{}
  step++;setTimeout(tune,ms)})();
