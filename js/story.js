// cenas de diálogo entre líderes, enciclopédia histórica, finais por líder e o ponteiro do tutorial
const LN=i=>LORE[S[i]?.[4]]||{};

// ---------- diálogo: caixa de pergaminho com o retrato de quem fala ----------
let talkQ=[],talkCur=null;
function talk(lines,then){ /* lines: [[índice do líder ou -1 para narrador, texto]] */
  if(talkCur){talkQ.push([lines,then]);return}
  talkCur={lines,k:0,then,c:0,full:''};$('talk').hidden=false;closeCmd();talkShow()}
function talkShow(){const T=talkCur,[f,txt]=T.lines[T.k],el=$('talk'),side=f<0?'nar':T.k%2?'r':'l';
  el.innerHTML=`<div class="tbox ${side}">${f>=0?`<img class="tp" src="${face[f]}" alt=""><b class="tn">${S[f][4]}</b>`:''}<p class="tt"></p><i class="tc">▼</i></div><small class="tskip">Clique ou Enter para seguir · Esc pula</small>`;
  const p=el.querySelector('.tt');T.full=txt;T.c=0;clearInterval(T.iv);sfx.page();
  if(CFG.calm){T.c=txt.length;p.textContent=txt;return}
  T.iv=setInterval(()=>{T.c+=2;p.textContent=txt.slice(0,T.c);if(T.c>=txt.length)clearInterval(T.iv)},18)}
function talkNext(skip){const T=talkCur;if(!T)return;
  if(!skip&&T.c<T.full.length){T.c=T.full.length;clearInterval(T.iv);$('talk').querySelector('.tt').textContent=T.full;return}
  if(!skip&&++T.k<T.lines.length)return talkShow();
  clearInterval(T.iv);talkCur=null;$('talk').hidden=true;sfx.tick();T.then?.();const q=talkQ.shift();if(q)talk(...q)}
$('talk').addEventListener('click',()=>talkNext());
document.addEventListener('keydown',e=>{if(!talkCur)return;
  if(e.key=='Enter'||e.key==' '){e.preventDefault();e.stopImmediatePropagation();talkNext()}
  else if(e.key=='Escape'){e.preventDefault();e.stopImmediatePropagation();talkNext(true)}},true);
const fill=(t,i)=>t.replace('{terra}',S[i][1]);

// ataque a uma capital: o atacante provoca, o defensor responde (uma vez por par de líderes)
const TALKED=new Set;
function capTalk(from,to,go){const a=owner[from],d=owner[to];
  if(to!=d||(a!=me&&d!=me)||TALKED.has(a+'-'+d))return go();TALKED.add(a+'-'+d);
  talk([[a,LN(a).a||`${S[to][1]} será minha!`],[d,LN(d).r||`${S[to][1]} não cai sem luta!`]],go)}
function storyIntro(){const L=INTRO[TKEY];if(L)talk(L.map(([w,t])=>[w=='me'?me:w,fill(t,me)]))}
function storyAlly(f){talk([[me,`${S[f][4]}, juntos ninguém nos para.`],[f,`Aliança firmada. Que ela dure mais que esta guerra.`]])}
onStory=(k,f)=>{if(k=='betray')talk([[f,`Traição! ${S[me][4]} rompeu o nosso pacto. ${S[f][1]} não vai esquecer.`],[me,'Acordos valem enquanto servem à causa.']])};

// ---------- enciclopédia ----------
function showEnc(i){i=(i%N+N)%N;const L=LN(i),E=ELITE[S[i][0]];
  scr(`<h2>Enciclopédia</h2><div class="enc"><img class="hero" src="${face[i]}" alt=""><div><h3>${S[i][4]}</h3><p><b>${L.d||'—'}</b> · ${S[i][1]}</p><p>${L.b||`Líder de ${S[i][1]} nesta campanha.`}</p></div></div>
    <p><b>No jogo:</b> ${S[i][7]}: ${traitTxt(i)}${E?`. Tropa de elite: ${E[0]}`:''}. Terreno de batalha: ${BIO[BOF[i]].nome}.</p>
    ${L.a?`<p class="quote"><i>Fala no jogo:</i> ${L.a}</p>`:''}
    <div class="encg">${S.map((s,j)=>`<button data-s="enc-${j}" class="${j==i?'on':''}" title="${s[4]} · ${s[1]}" data-help="${s[4]} · ${s[1]}">${img(j,s[4])}</button>`).join('')}</div>
    <div class="row c"><button data-s="enc-${i-1}">‹ Anterior</button><button data-s="enc-${i+1}">Próximo ›</button></div><button data-s="close" class="end">Fechar</button>`)}

// ---------- final por líder ----------
function endText(){const L=LN(me),full=owner.every(o=>o==me);
  if(L.f&&TKEY=='brasil'&&full)return L.f;
  return `Sob ${S[me][4]}, ${TKEY=='brasil'?'o Brasil':'a região'} entra numa nova era: ${TRAIT_END[S[me][5]]||'a paz volta às províncias'}.`}
function endCard(){const[c,g]=mk(480,210);g.textBaseline='top';
  try{g.filter='sepia(.7) saturate(1.2)'}catch{}g.drawImage(cv,0,0,cv.width,cv.height,0,-40,480,361);g.filter='none';
  const gr=g.createLinearGradient(0,0,480,0);gr.addColorStop(0,'rgba(30,18,12,.88)');gr.addColorStop(.65,'rgba(30,18,12,.25)');g.fillStyle=gr;g.fillRect(0,0,480,210);
  g.fillStyle='#1a1220';g.fillRect(16,20,170,170);g.fillStyle='#d8b878';g.fillRect(18,22,166,166);g.imageSmoothingEnabled=false;g.drawImage(fcv[me],21,25,160,160);
  g.fillStyle=`hsl(${hue(me)},65%,45%)`;g.fillRect(202,152,256,8);emblem(g,202,170,me,'#f3e7cf');
  scriptT(g,S[me][4],202,30,30,'left',260);g.font=FONT(10);g.fillStyle='#f3e7cf';g.textAlign='left';
  g.fillText(`${LN(me).d?LN(me).d+' · ':''}${S[me][1]}`,204,80,256);g.fillText(`${turn} turnos · ${stats.taken} ${TW} tomados`,204,108,256);return c.toDataURL()}

// ---------- ponteiro do tutorial: a luva aponta onde clicar ----------
const CEN={};
function cenOf(i){if(CEN[i])return CEN[i];let sx=0,sy=0,n=0;for(let k=0;k<cell.length;k++)if(cell[k]==i){sx+=k%W;sy+=k/W|0;n++}return CEN[i]=n?proj((sx/n+.5)*C,(sy/n+.5)*C):proj(...px(i))}
setInterval(()=>{const p=$('tutPtr');if(!p)return;const st=tut>=0&&!HQ&&$('screen').hidden&&$('menu').hidden&&!talkCur?TUT[tut]?.[2]:null;let r=null;
  if(typeof st=='function'){const pt=st();if(pt){const cr=cv.getBoundingClientRect(),k=cr.width/cv.width;r={x:cr.left+pt[0]*k,y:cr.top+pt[1]*k}}}
  else if(st){const el=[...document.querySelectorAll(st)].find(e=>e.offsetParent);if(el){const b=el.getBoundingClientRect();r={x:b.left,y:b.top+b.height/2}}}
  p.hidden=!r;if(r){p.style.left=(r.x-40)+'px';p.style.top=(r.y-13)+'px'}},250);
