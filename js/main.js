// início
reset();ui();intro=Date.now();showTitle();setInterval(()=>blink=!blink,450);
(function loop(){if(!B&&!HQ)draw();requestAnimationFrame(loop)})(); // o mapa se anima sem parar
document.fonts?.ready.then(draw);
