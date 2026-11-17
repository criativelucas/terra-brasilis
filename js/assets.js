// folhas de sprite opcionais: se existir assets/sprites.json, troca retratos e unidades pela arte dele (formato no README)
fetch('assets/sprites.json').then(r=>r.ok?r.json():null).then(m=>{if(!m)return;
  const load=src=>new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src=src});
  return Promise.all([
    ...Object.entries(m.portraits||{}).map(async([uf,src])=>{const i=ix[uf],im=await load(src);if(!im||i==null)return;
      const c=fcv[i];c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,0,0);face[i]=c.toDataURL()}),
    ...Object.entries(m.units||{}).map(async([t,o])=>{const im=await load(o.src||o);if(im)CUSTOM.units[t]={im,frames:o.frames||2}})
  ]).then(()=>{SPR.clear();ICON.clear();if(HQ)renderHQ();ui()})}).catch(()=>{});
