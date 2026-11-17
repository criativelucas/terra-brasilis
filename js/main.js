// início
reset();ui();intro=Date.now();showTitle();setInterval(()=>blink=!blink,450);
let lastF=0;(function loop(t){requestAnimationFrame(loop);if(document.hidden||B||HQ||t-lastF<1000/[12,30,60][CFG.q]-2)return;lastF=t;draw()})(performance.now()); // o mapa se anima; pausa com a aba oculta; quadros por segundo conforme a qualidade
document.fonts?.ready.then(draw);
