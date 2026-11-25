// cenas de diálogo entre líderes, enciclopédia histórica, finais por líder e o ponteiro do tutorial
const LN=i=>LORE[S[i]?.[4]]||{};

// ---------- diálogo: caixa de pergaminho com o retrato de quem fala ----------
let talkQ=[],talkCur=null;
function talk(lines,then){ /* lines: [[índice do líder ou -1 para narrador, texto]] */
  if(talkCur){talkQ.push([lines,then]);return}
  talkCur={lines,k:0,then,c:0,full:''};$('talk').hidden=false;document.body.classList.add('talking'); /* a ficha some durante a fala */$('tut').hidden=true;$('tutPtr').hidden=true;closeCmd();talkShow()}
function talkShow(){const T=talkCur,[f,txt]=T.lines[T.k],el=$('talk'),side=f<0?'nar':T.k%2?'r':'l';
  el.innerHTML=`<div class="tbox ${side}">${f>=0?`<img class="tp" src="${face[f]}" alt=""><b class="tn">${S[f][4]}</b>`:''}<p class="tt"></p><i class="tc">▼</i></div><small class="tskip">Clique ou Enter para seguir · Esc pula</small>`;
  const p=el.querySelector('.tt');T.full=txt;T.c=0;clearInterval(T.iv);sfx.page();
  if(CFG.calm){T.c=txt.length;p.textContent=txt;return}
  T.iv=setInterval(()=>{T.c+=2;p.textContent=txt.slice(0,T.c);if(T.c>=txt.length)clearInterval(T.iv)},18)}
function talkNext(skip){const T=talkCur;if(!T)return;
  if(!skip&&T.c<T.full.length){T.c=T.full.length;clearInterval(T.iv);$('talk').querySelector('.tt').textContent=T.full;return}
  if(!skip&&++T.k<T.lines.length)return talkShow();
  clearInterval(T.iv);talkCur=null;$('talk').hidden=true;document.body.classList.remove('talking');sfx.tick();T.then?.();const q=talkQ.shift();if(q)talk(...q)}
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
function storyIntro(){const L=INTRO[TKEY];if(L)talk(L.map(([w,t])=>[w=='me'?me:w,fill(t,me)]),ui)}
function storyAlly(f){talk([[me,`${S[f][4]}, juntos ninguém nos para.`],[f,`Aliança firmada. Que ela dure mais que esta guerra.`]])}
onStory=(k,f)=>{if(k=='betray')talk([[f,`Traição! ${S[me][4]} rompeu o nosso pacto. ${S[f][1]} não vai esquecer.`],[me,'Acordos valem enquanto servem à causa.']])};

// ---------- enciclopédia ----------
function showEnc(i){i=(i%N+N)%N;const L=LN(i),E=ELITE[S[i][0]]; /* enciclopédia como livro: índice à esquerda, ficha do líder à direita */
  scr(`<h2>Enciclopédia</h2>${bookTabs('enc')}<div class="pages"><div class="pg"><h3>Índice dos líderes</h3><div class="encg">${S.map((s,j)=>`<button data-s="enc-${j}" class="${j==i?'on':''}" title="${s[4]} · ${s[1]}" data-help="${s[4]} · ${s[1]}">${img(j,s[4])}</button>`).join('')}</div><span class="pn">${2*i+1}</span></div>
    <div class="pg"><div class="enc"><img class="hero" src="${face[i]}" alt=""><div><h3>${S[i][4]}</h3><p><b>${L.d||'—'}</b> · ${S[i][1]}</p></div></div><p>${L.b||`Líder de ${S[i][1]} nesta campanha.`}</p>
      <p><b>No jogo:</b> ${S[i][7]}: ${traitTxt(i)}${E?`. Tropa de elite: ${E[0]}`:''}. Terreno de batalha: ${BIO[BOF[i]].nome}.</p>${L.a?`<p class="quote"><i>Fala no jogo:</i> ${L.a}</p>`:''}<span class="pn">${2*i+2}</span></div></div>
    <div class="pnav"><button data-s="enc-${i-1}" aria-label="Líder anterior">${I('back')}</button><span>${i+1} de ${N}</span><button data-s="enc-${i+1}" aria-label="Próximo líder">${I('fwd')}</button></div>
    ${me<0?'<button data-s="setup" class="end">Voltar à escolha</button>':'<button data-s="close" class="end">Fechar o livro</button>'}`);$('card').classList.add('book','wide')}

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
function cenOf(i){if(!CEN[i]){let sx=0,sy=0,n=0;for(let k=0;k<cell.length;k++)if(cell[k]==i){sx+=k%W;sy+=k/W|0;n++}CEN[i]=n?[(sx/n+.5)*C,(sy/n+.5)*C]:px(i)}return proj(...CEN[i])} // guarda o centro no mapa plano; a câmera entra na hora
setInterval(()=>{const p=$('tutPtr');if(!p)return;const st=tut>=0&&!HQ&&$('screen').hidden&&$('menu').hidden&&!talkCur?TUT[tut]?.[2]:null;let r=null;
  if(typeof st=='function'){const pt=st();if(pt){const cr=cv.getBoundingClientRect(),k=cr.width/cv.width;r={x:cr.left+pt[0]*k,y:cr.top+pt[1]*k}}}
  else if(st){const el=[...document.querySelectorAll(st)].find(e=>e.getClientRects().length&&getComputedStyle(e).visibility!='hidden');if(el){const b=el.getBoundingClientRect();r={x:b.left,y:b.top+b.height/2,R:b.right}}}
  p.hidden=!r;if(r){const fl=r.R!=null&&r.x<60;p.classList.toggle('flip',fl);p.style.left=(fl?r.R+4:r.x-40)+'px';p.style.top=(r.y-13)+'px'}},250); // perto da borda esquerda, a luva aponta do outro lado

// ---------- linha do tempo: acontecimentos reais em turnos marcados [turno, território, título, texto, tropas] ----------
const TIMELINE={
  brasil:[[3,'RJ','Coroação de Dom Pedro I','1º de dezembro de 1822. Dom Pedro I é coroado imperador no Rio de Janeiro.',4],
    [5,'BA','Independência da Bahia','2 de julho de 1823. As tropas portuguesas deixam Salvador depois de mais de um ano de guerra.',3],
    [8,'PE','Confederação do Equador','1824. Pernambuco se rebela contra o fechamento da Constituinte e chama o Nordeste para a luta.',3],
    [11,'PA','Cabanagem','Janeiro de 1835. A população pobre do Grão-Pará toma Belém.',4],
    [13,'RS','Revolução Farroupilha','Setembro de 1835. Os estancieiros gaúchos pegam em armas contra o Império.',4],
    [16,'MA','Balaiada','1838. Vaqueiros, quilombolas e lavradores se levantam no Maranhão.',3]],
  equador:[[3,'REC','Proclamação da Confederação','2 de julho de 1824. Paes de Andrade proclama a Confederação do Equador em Recife.',3],
    [5,'NAT','Bloqueio de Cochrane','Agosto de 1824. A esquadra de Lorde Cochrane bloqueia o porto de Recife.',3],
    [7,'MAC','Avanço imperial','Setembro de 1824. As tropas de Lima e Silva marcham sobre Recife.',4],
    [10,'FOR','Resistência no Ceará','Fim de 1824. Tristão de Alencar resiste no Ceará depois da queda de Recife.',2]],
  farrapos:[[3,'BAG','Batalha do Seival','Setembro de 1836. Sousa Neto vence no Seival e proclama a República Rio-Grandense.',4],
    [6,'LAG','Tomada de Laguna','Julho de 1839. Garibaldi e Canabarro tomam Laguna e proclamam a República Juliana.',3],
    [9,'DES','Retomada de Laguna','Novembro de 1839. A Marinha Imperial retoma Laguna.',3],
    [12,'PFU','Surpresa de Porongos','Novembro de 1844. Moringue ataca de surpresa o acampamento farroupilha em Porongos.',3],
    [14,'POA','Paz de Ponche Verde','Março de 1845. Caxias e os farrapos assinam a paz de Ponche Verde.',2]],
  cabanagem:[[2,'BEL','Os cabanos tomam Belém','7 de janeiro de 1835. Os cabanos tomam Belém, e o presidente Lobo de Souza é morto.',3],
    [5,'BEL','Belém de novo cabana','Agosto de 1835. Depois de perder a capital, os cabanos voltam a tomar Belém, e Angelim assume o governo.',3],
    [8,'CAM','Chegada de Andréa','1836. O marechal Andréa chega com reforços do Império.',5],
    [11,'XIN','Resistência no interior','1837. Expulsos de Belém, os cabanos resistem nos rios do interior.',3]]};
function storyTurn(){const L=(TIMELINE[TKEY]||[]).find(e=>e[0]==turn&&!tld.includes(e[2]));if(!L||me<0||over)return false;
  const[,code,title,txt,n]=L,i=ix[code];if(i==null)return false;tld.push(title);
  const mine=owner[i]==me,nb=!mine&&adj[i].some(j=>owner[j]==me),ch=(mine||nb)?histOpts(i,title,n,mine):null; /* acontecimento perto de você: você decide */
  if(!ch){troops[i]+=n;note(`${title}: +${n} tropas em ${S[i][1]}`)}
  const lines=[[-1,`${title}. ${txt}`]];if(owner[i]==i)lines.push([i,LN(i).a||`${S[i][1]} se levanta!`]);
  setTimeout(()=>talk(lines,()=>{ui();if(ch)showHist(title,txt,i,ch)}),600);return true}
const REVOLTA=/Confedera|Cabanagem|cabano|Farroupilha|Balaiada|Seival|Laguna|Resist|Porongos/; // levantes contra quem governa
function histOpts(i,title,n,mine){const f=owner[i],X=S[i][1],rev=REVOLTA.test(title);
  if(mine&&rev)return[['Negociar com os revoltosos',`−5 ouro, +${n} tropas em ${X}`,5,()=>troops[i]+=n],
    ['Reprimir o levante',`−2 tropas em ${X}, +2 de experiência nos regimentos de ${X}`,0,()=>{troops[i]=Math.max(1,troops[i]-2);xp[i]=xp[i].map(v=>v+2)}]];
  if(mine)return[['Grande celebração',`−4 ouro, +${n+2} tropas em ${X}`,4,()=>troops[i]+=n+2],['Celebração simples',`+${n} tropas em ${X}, +3 ouro`,0,()=>{troops[i]+=n;gold[me]+=3}]];
  if(rev)return[['Apoiar os revoltosos',`−4 ouro, ${X} perde ${n} tropas, ${S[f][4]} fica hostil`,4,()=>{troops[i]=Math.max(1,troops[i]-n);angry[f]=turn+4}],
    ['Ficar de fora',`${X} ganha +${n} tropas`,0,()=>troops[i]+=n]];
  return[['Mandar uma embaixada',`−3 ouro, pacto de 4 turnos com ${S[f][4]}`,3,()=>{troops[i]+=n;pact[f]=Math.max(pact[f]||0,turn+4)}],['Ficar de fora',`${X} ganha +${n} tropas`,0,()=>troops[i]+=n]]}
function showHist(title,txt,i,ch){window.HEV={ch,title,i};const fx=t=>t.split(/,\s*/).map(q=>`<span class="${/[−-]|perde|hostil/.test(q)?'bad':'good'}">${q}</span>`).join('');
  scr(`<h2>${title}</h2><div class="evh"><span class="medal1">${I('scroll')}</span><div><p>${txt}</p><small>${S[i][1]}, ${owner[i]==me?'sob o seu governo':'sob '+S[owner[i]][4]}. Ouro em caixa: ${gold[me]}</small></div></div><div class="evo">`+
    ch.map(([nm,ef,c],k)=>`<button data-s="hev-${k}" class="${gold[me]<c?'off':''}" ${gold[me]<c?'disabled':''}><b>${nm}</b><span class="fx">${fx(ef)}</span>${gold[me]<c?`<small>faltam ${c-gold[me]} ouro</small>`:''}</button>`).join('')+'</div>');$('card').classList.add('scroll')}
