// retratos 24x24 dos líderes
// retratos 24x24
const SK={L:['#e9b58c','#c98f66'],T:['#c98d5e','#a56d42'],B:['#9a6238','#7a4a28'],D:['#6b4226','#4f2f1a'],I:['#b5713f','#8f5530']};
const HC={k:'#1c1410',b:'#4a2c17',g:'#9a9a9a',w:'#e8e4d8'};
const fcv=[],fhd=[]; // fhd: mesmo rosto sem fundo, vira a cabeça do comandante no campo
const mkFace=bare=>([sk,hs,hc,bd,hat,cl,ex],i)=>{
  const[c,g]=mk(24,24);(bare?fhd:fcv).push(c);const r=(a,b,w,h,col)=>{g.fillStyle=col;g.fillRect(a,b,w,h)};
  const[s,sh]=SK[sk],h=HC[hc],gold='#e0b030',red='#b3312a',dk='#1c1410',side=(y,n)=>{r(7,y,1,n,h);r(16,y,1,n,h)};
  if(!bare){[20,26,32,38,44].forEach((l,k)=>r(0,20-k*5,24,5,`hsl(${hue(i)},50%,${l}%)`));r(0,0,24,1,'rgba(255,255,255,.25)');r(0,0,3,24,'rgba(0,0,0,.18)');r(21,0,3,24,'rgba(0,0,0,.18)')}
  r(3,20,18,4,cl);r(5,19,14,1,cl);r(15,20,6,4,'rgba(0,0,0,.22)');r(3,20,3,4,'rgba(255,255,255,.14)');r(12,21,1,1,gold);r(12,23,1,1,gold);
  if(ex.includes('t')){r(9,19,6,5,'#eee');r(11,19,2,5,red)}
  if(ex.includes('c'))r(9,19,6,1,'#eee');
  if(ex.includes('r'))r(8,19,8,2,red);
  if(ex.includes('e')){r(3,19,4,2,gold);r(17,19,4,2,gold)}
  r(10,16,4,3,sh);r(7,6,10,10,s);r(8,5,8,1,s);r(8,16,8,1,s);r(16,7,1,8,sh);r(6,10,1,2,s);r(17,10,1,2,sh);
  r(8,7,3,5,'rgba(255,255,255,.16)');r(8,12,2,1,'rgba(220,70,50,.28)');r(14,12,2,1,'rgba(220,70,50,.28)');r(8,15,8,1,'rgba(0,0,0,.12)');r(11,12,2,1,'rgba(255,255,255,.2)');r(10,17,4,1,'rgba(0,0,0,.2)');
  if(hs!='bald'&&hs!='tonsure'){r(7,4,10,2,h);r(8,3,8,1,h);side(6,2)}
  if(hs=='long'){r(6,5,1,13,h);r(17,5,1,13,h);r(5,9,1,10,h);r(18,9,1,10,h)}
  if(hs=='bun')r(10,1,4,2,h);
  if(hs=='curly'){r(6,3,12,2,h);r(8,2,2,1,h);r(12,2,3,1,h);r(6,5,1,4,h);r(17,5,1,4,h)}
  if(hs=='wig'){r(6,4,12,2,h);r(6,6,1,7,h);r(17,6,1,7,h);r(5,10,2,4,h);r(17,10,2,4,h)}
  if(hs=='bald')side(7,3);
  if(hs=='tonsure'){r(7,5,10,1,h);side(6,3)}
  if(hs!='bald'&&hs!='tonsure')r(9,4,4,1,'rgba(255,255,255,.22)');if(hat)r(7,6,10,1,'rgba(0,0,0,.2)');
  const brow=hc=='w'||hc=='g'?'#8a8a8a':h,fem=ex.includes('f');
  r(9,9,2,1,brow);r(13,9,2,1,brow);r(9,10,2,1,'#fff');r(10,10,1,1,dk);r(13,10,2,1,'#fff');r(14,10,1,1,dk);
  r(12,11,1,2,sh);r(fem?11:10,14,fem?2:4,1,fem?red:'#7a2e24');
  if(bd.includes('s'))side(8,6);
  if(/b/i.test(bd)){side(12,4);r(8,15,8,2,h);r(10,13,4,1,h);r(11,14,2,1,'#3a1a14')}
  if(bd=='B'){r(8,17,8,3,h);r(9,20,6,1,h)}
  if(bd.includes('m'))r(9,13,6,1,h);
  const hatc={kepi:cl,shako:cl,tricorn:dk,wide:'#5a3a1c',straw:'#d9b95a',plume:'#3d3226'}[hat];
  if(hat=='kepi'||hat=='shako'){const t=hat=='shako'?0:2;r(7,t,10,5-t,hatc);r(6,5,12,1,dk);r(11,3,2,1,gold);if(t==0)r(15,0,2,3,red)}
  if(hat=='tricorn'){r(8,2,8,2,hatc);r(4,4,16,2,hatc);r(4,5,16,1,gold)}
  if(hat=='wide'||hat=='straw'||hat=='plume'){r(7,2,10,3,hatc);r(3,5,18,1,hatc);r(7,4,10,1,hat=='straw'?'#a8862f':dk);if(hat=='plume')r(16,0,2,4,red)}
  if(hat=='cocar'){for(let k=0;k<10;k++)r(7+k,1+(Math.abs(k-4.5)/2|0),1,4,[red,gold,'#2f8a4a','#2a5fb0'][k%4]);r(7,5,10,1,red)}
  if(hat=='wrap'){r(7,3,10,3,'#eee');r(6,5,12,1,'#ddd');r(16,1,2,2,'#eee')}
  if(hat=='band')r(7,6,10,1,red);
  if(ex.includes('g')){r(8,10,1,1,dk);r(11,10,2,1,dk);r(15,10,1,1,dk);r(8,11,3,1,dk);r(13,11,3,1,dk)}
  return c.toDataURL()};
const face=L.map(mkFace(false));L.forEach(mkFace(true));
const img=(f,alt='')=>`<img src="${face[f]}" alt="${alt}">`;

