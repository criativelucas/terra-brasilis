// Versão em inglês: o jogo é escrito em português; com o idioma em inglês, esta camada troca as frases conhecidas
// (dicionário EN, em js/en.js) em tudo que aparece: textos da página, dicas e o que é desenhado no canvas.
// Nomes de pessoas e lugares ficam como estão. Frases montadas com números e nomes são trocadas pedaço a pedaço.
const LANG=(()=>{try{return JSON.parse(localStorage.getItem('tb-cfg')||'{}').lang||'pt'}catch{return'pt'}})();
const I18N={on:LANG=='en',re:null,map:null,cache:new Map,out:new Set};
function i18nBuild(){const m=new Map(Object.entries(EN));
  for(const t of Object.values(THEATERS))for(const s of t.S)for(const n of[s[1],s[4]])if(n&&!m.has(n))m.set(n,n); // nomes protegidos: "Rio de Janeiro" não vira "Rio of Janeiro"
  const esc=k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),L=/\p{L}/u;
  const alt=[...m.keys()].filter(k=>k.length>1).sort((a,b)=>b.length-a.length).map(k=>(L.test(k[0])?'(?<!\\p{L})':'')+esc(k)+(L.test(k.at(-1))?'(?!\\p{L})':''));
  I18N.re=new RegExp(alt.join('|'),'gu');I18N.map=m}
function tr(t){if(!I18N.on||typeof t!='string'||!/[A-Za-zÀ-ÿ]/.test(t)||I18N.out.has(t))return t;let c=I18N.cache.get(t);if(c!=null)return c;
  if(!I18N.re)i18nBuild();c=t.replace(I18N.re,w=>I18N.map.get(w)??w);if(I18N.cache.size>8000){I18N.cache.clear();I18N.out.clear()}I18N.cache.set(t,c);I18N.out.add(c);return c}
if(I18N.on){document.documentElement.lang='en';
  const P=CanvasRenderingContext2D.prototype; // canvas: placares, plaquinhas, cenas
  for(const f of['fillText','strokeText','measureText']){const o=P[f];P[f]=function(t,...a){return o.call(this,tr(String(t)),...a)}}
  const AT=['data-help','data-tip','aria-label','title','placeholder','alt'];
  const fixEl=el=>{for(const a of AT){const v=el.getAttribute?.(a);if(v){const t=tr(v);if(t!==v)el.setAttribute(a,t)}}};
  const fix=n=>{if(n.nodeType==3){const t=tr(n.data);if(t!==n.data)n.data=t;return}if(n.nodeType!=1||n.tagName=='SCRIPT'||n.tagName=='STYLE')return;fixEl(n);
    const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let x;while(x=w.nextNode()){if(x.nodeType==3){const t=tr(x.data);if(t!==x.data)x.data=t}else fixEl(x)}};
  const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type=='childList')m.addedNodes.forEach(fix);else if(m.type=='characterData')fix(m.target);else fixEl(m.target)}});
  const start=()=>{fix(document.body);mo.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:AT})};
  document.body?start():addEventListener('DOMContentLoaded',start)}
