// início
reset();ui();showTitle();setInterval(()=>{blink=!blink;draw()},450);
document.fonts?.ready.then(draw);
