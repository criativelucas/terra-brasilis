// combate no mapa, menu de pausa, salvamento, telas de campanha, atalhos
let vsT;
let regDone=new Set;
function regionCheck(silent){REG.forEach(([n,st,b],k)=>{const full=st.every(i=>owner[i]==me); // domínio de região: fanfarra e aviso
  if(full&&!regDone.has(k)){regDone.add(k);if(!silent){note(`Região ${n} dominada! +${b} ouro por turno`);sfx.fanfare()}}if(!full)regDone.delete(k)})}
onNote=toast;
onFight=(a,d,st,won)=>{
  fx={s:st,until:Date.now()+700};const wf=won?a:d,lf=won?d:a,until=Date.now()+9000;mood[wf]={m:'smile',until};mood[lf]={m:'angry',until};
  if((a==me)==won){sfx.win();stats.won++;if(a==me){stats.taken++;cele={i:st,start:Date.now(),dur:1900,n:70};note(`${S[st][1]} conquistado!`)}}
  else{sfx.lose();stats.lost++;if(d==me&&won)note(`${S[a][4]} tomou ${S[st][1]}!`)}
  regionCheck();
  if(CFG.shake&&!CFG.calm){$('stage').classList.remove('shake');void $('stage').offsetWidth;$('stage').classList.add('shake')}
  $('vsa').src=face[a];$('vsd').src=face[d];$('vsan').textContent=S[a][4];$('vsdn').textContent=S[d][4];
  $('vsr').textContent=`${S[st][1].toUpperCase()}: `+(a==me?(won?'VITÓRIA!':'DERROTA'):(won?'TERRITÓRIO PERDIDO':'DEFESA HEROICA!'));
  $('vs').hidden=false;clearTimeout(vsT);setTimeout(()=>{$('vsa').src=faceOf(a);$('vsd').src=faceOf(d)},500);vsT=setTimeout(()=>$('vs').hidden=true,1700)};
$('vs').addEventListener('click',()=>$('vs').hidden=true);

// ---------- menu de pausa ----------
const OPT={tac:['Batalhas',['Sempre táticas','Só nos ataques','Automáticas']],speed:['Ritmo da IA',['Lento','Normal','Rápido']],
  diff:['Dificuldade',['Fácil','Normal','Difícil']],clash:['Cenas de combate',['Desligadas','Ligadas']],shake:['Tremor de tela',['Desligado','Ligado']],
  q:['Qualidade dos efeitos',['Baixa','Média','Alta']],calm:['Efeitos fortes (clarão, confete)',['Ligados','Reduzidos']],big:['Texto grande',['Não','Sim']],
  cb:['Modo daltônico',['Desligado','Ligado']],uiz:['Tamanho da interface',['90%','100%','115%','130%']],confirm:['Confirmar fim do turno',['Não','Sim']]};
let confirmNew=false,menuTab='jogo';
const MTABS={jogo:['Jogo',['tac','speed','diff','confirm']],som:['Som',[]],tela:['Tela',['clash','shake','q','calm']],acess:['Acessibilidade',['uiz','big','cb']]};
function drawMenu(focus){
  const opt=k=>`<div class="opt"><span>${OPT[k][0]}</span><button data-c="${k}">‹ ${OPT[k][1][CFG[k]]} ›</button></div>`;
  $('menuBox').innerHTML=`<h2>Pausa</h2><div class="tabs" role="tablist">${Object.entries(MTABS).map(([k,[n]])=>`<button role="tab" aria-selected="${menuTab==k}" data-c="tab-${k}" class="${menuTab==k?'on':''}">${n}</button>`).join('')}</div><div class="mtab">`+
    (menuTab=='som'?`<label class="opt" for="mus"><span>Música</span><input type="range" id="mus" min="0" max="1" step="0.1" value="${CFG.mus}"></label>
      <label class="opt" for="vol"><span>Efeitos sonoros</span><input type="range" id="vol" min="0" max="1" step="0.1" value="${CFG.vol}"></label>`:'')+
    MTABS[menuTab][1].map(opt).join('')+
    (menuTab=='acess'?`<button data-c="keys">${I('menu')}Todos os atalhos do teclado (?)</button><p class="keys"><b>Teclado</b><br><kbd>E</kbd> fim do turno · <kbd>M</kbd> marchar · <kbd>R</kbd> recrutar · <kbd>F</kbd> fortificar · <kbd>Q</kbd> quartel · <kbd>Z</kbd> desfazer · <kbd>N</kbd> próximo · <kbd>Esc</kbd> pausa ou cancelar · setas e <kbd>Enter</kbd> no mapa e nos menus de comando</p>`:'')+
    (menuTab=='jogo'?`${me>=0?'<button data-c="saves">Salvamentos</button>':''}<button data-c="enc">Enciclopédia</button><button data-c="title">Salvar e sair ao título</button><button data-c="new" class="danger">${confirmNew?'Confirmar: apagar partida':'Nova partida'}</button>`:'')+
    `</div><button data-c="close" class="end">Continuar</button>`;
  $('menuBox').querySelector(`[data-c="${focus||'close'}"]`)?.focus()}
function menu(open){confirmNew=false;if(open&&$('menu').hidden)sfx.page();$('menu').hidden=!open;if(open)drawMenu()}
$('menuBtn').addEventListener('click',()=>menu(true));
document.addEventListener('keydown',e=>{if(e.key!='Escape')return;if(marching&&$('menu').hidden&&$('screen').hidden){marching=false;return ui()}menu($('menu').hidden)});
$('menu').addEventListener('click',e=>{if(e.target.id=='menu')return menu(false);
  const k=e.target.closest('button')?.dataset.c;if(!k)return;sfx.sel();
  if(k=='close')return menu(false);
  if(k.startsWith('tab-')){menuTab=k.slice(4);return drawMenu(k)}
  if(k=='enc'){menu(false);return showEnc(me>=0?me:0)}
  if(k=='keys'){menu(false);return showKeys()}
  if(k=='saves'){menu(false);return showSaves('close')}
  if((k=='title'||(k=='new'&&confirmNew))&&HQ)closeHQ();
  if(k=='title'){B=null;raids=[];menu(false);if(me>=0)load();ui();return showTitle()} // batalha em curso é abandonada; volta ao último salvamento
  if(k=='new'){if(!confirmNew){confirmNew=true;return drawMenu('new')}B=null;wipe();reset();menu(false);ui();return showSetup()}
  CFG[k]=(CFG[k]+1)%OPT[k][1].length;saveCfg();applyCfg();rKey='';drawMenu(k);if(!B&&!HQ)ui()});
$('menu').addEventListener('input',e=>{if(e.target.id=='mus'){CFG.mus=+e.target.value;saveCfg()}if(e.target.id=='vol'){CFG.vol=+e.target.value;saveCfg();sfx.sel()}});

// ---------- salvar ----------
const SAVE='tb-save'+(TKEY=='brasil'?'':'-'+TKEY),saveOf=k=>{try{return JSON.parse(localStorage.getItem('tb-save'+(k=='brasil'?'':'-'+k)))}catch{return null}};
const snap=()=>({price,priceOld,perk,tld,hand,cmd,posts,boost,scn,owner,troops,gold,me,turn,logs,fort,stats,hq,xp,port,pact,ally,trib,angry,betray,moved:[...moved]});
function save(){if(me<0||B||raids.length)return;try{over?localStorage.removeItem(SAVE):localStorage.setItem(SAVE,JSON.stringify(snap()))}catch{}}
// salvamentos com nome: 3 espaços por modo de jogo, além do salvamento automático
const mapThumb=()=>{if(B||HQ)return null;const[c,g]=mk(176,132);g.drawImage(cv,0,0,cv.width,cv.height,0,0,176,132);return c.toDataURL('image/jpeg',.72)};
const SLOT=k=>SAVE+'-slot'+k,slotOf=k=>{try{return JSON.parse(localStorage.getItem(SLOT(k)))}catch{return null}};
function showSaves(back){const can=me>=0&&!B&&!raids.length&&!over;
  scr(`<h2>Salvamentos</h2><p class="c">O jogo também salva sozinho a cada ação. Aqui você guarda partidas com nome.</p>`+
    (can?`<label class="opt" for="svname"><span>Nome</span><input id="svname" maxlength="30" value="${esc(S[me][4]+' · turno '+turn)}"></label>`:'')+
    [1,2,3].map(k=>{const d=slotOf(k);return`<div class="slot">${d?.thumb?`<img class="th" src="${d.thumb}" alt="">`:`<div class="th">${d?'Sem imagem':'Vazio'}</div>`}<div class="si"><b>Espaço ${k}${d?': '+esc(d.nome):''}</b>
      ${d?`<p>${img(d.me)}<span>${S[d.me][4]}<br>Turno ${d.turn} · ${d.owner.filter(o=>o==d.me).length}/${N} ${TW}<br><small>${new Date(d.quando).toLocaleString('pt-BR')}</small></span></p>`:''}
      <div class="row">${can?`<button data-s="sv-${k}">Salvar aqui</button>`:''}${d?`<button data-s="ld-${k}">Carregar</button>`:''}</div></div></div>`}).join('')+
    `<button data-s="${back}" class="end">Voltar</button>`)}
// visão geral do império: todos os seus territórios numa lista; clicar leva até ele
function showArmy(){const own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0).sort((a,b)=>danger(b)-danger(a)||troops[b]-troops[a]),can=own.filter(i=>!moved.has(i)&&troops[i]>1).length,dg=own.filter(danger).length;
  scr(`<h2>Exército</h2><div class="kpis k4"><div class="kpi"><b>${own.length}</b><span>${TW}</span></div><div class="kpi"><b>${own.reduce((a,i)=>a+troops[i],0)}</b><span>tropas</span></div><div class="kpi"><b>${can}</b><span>podem marchar</span></div><div class="kpi ${dg?'hot':''}"><b>${dg}</b><span>em perigo</span></div></div>
    <div class="sgrid">${own.map(i=>{const st=danger(i)?['no','Em perigo']:moved.has(i)?['','Já marchou']:troops[i]>1?['ok','Pode marchar']:['','Guarnição mínima'];
      return`<button class="scard ${danger(i)?'hot':''}" data-s="go-${i}" data-help="Vai até ${esc(S[i][1])} no mapa">${img(i,S[i][4])}<span class="tb"><b>${S[i][1]}</b><small>${S[i][4]}</small><span class="tst">${fort[i]?`<span>Forte ${fort[i]}</span>`:''}${port[i]?'<span>Porto</span>':''}${resOf(i)?`<span>${RESN[resOf(i)][0]}</span>`:''}</span></span><span class="sn"><b>${troops[i]}</b><small>tropas</small></span><em class="st ${st[0]}">${st[1]}</em></button>`}).join('')}</div>
    <button data-s="close" class="end">Voltar ao mapa</button>`);$('card').classList.add('wide')}
// conselho (como o "Seek Advice" de Samurai Warriors Empires): a cada turno, até 3 generais propõem uma ação; você segue uma
let council=null;
function makeCouncil(){const own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0).sort((a,b)=>hash(a,turn)%97-hash(b,turn)%97).slice(0,3),
    picks=own.map(i=>{const[l,a,p]=gs(i);return[i,l>=a&&l>=p?'l':a>=p?'a':'p']}); // cada general propõe pelo seu atributo mais forte
  for(const t of['l','a','p'])if(picks.length<3&&!picks.some(q=>q[1]==t))picks.push([me,t]); // com poucos generais, o próprio líder completa as três propostas
  return{turn,done:false,list:picks.map(([i,top])=>{const v=hash(i,turn)%2;const[l,a,p]=gs(i);
    const O={l:[['Treino de milícia',`+${3+(l/25|0)} tropas em ${S[i][1]}`,0,()=>troops[i]+=3+(l/25|0)],['Exercícios de campanha',`+2 de experiência nos regimentos de ${S[i][1]}`,4,()=>xp[i]=xp[i].map(x_=>x_+2)]],
      a:[['Rede de espiões','Compre 2 cartas de estratégia',0,()=>drawCards(2)],['Plano de campanha','+2 de Comando neste turno',0,()=>cmd+=2]],
      p:[['Feira de comércio',`+${4+(p/15|0)} ouro agora`,0,()=>gold[me]+=4+(p/15|0)],['Reforma de impostos',`+1 de renda por turno em ${S[i][1]}, para sempre`,6,()=>boost[i]++]]}[top][v];
    return{i,attr:{l:'liderança',a:'astúcia',p:'política'}[top],nome:O[0],txt:O[1],custo:O[2],fn:O[3]}})}}
const councilNow=()=>{if(me<0)return null;if(!council||council.turn!=turn)council=makeCouncil();return council};
function followCouncil(k){const c=councilNow(),o=c.list[k];if(c.done||gold[me]<o.custo)return;gold[me]-=o.custo;o.fn();c.done=true;
  mood[owner[o.i]==me?o.i:me]={m:'smile',until:Date.now()+6000};note(`Conselho de ${S[o.i][4]}: ${o.nome.toLowerCase()}`);sfx.win()}
function showCouncil(){const c=councilNow(),postOf=i=>Object.keys(posts).find(k=>posts[k]==i);
  scr(`<h2>Conselho · turno ${turn}</h2><p class="c">${c.done?'Você já seguiu um conselho neste turno.':'Seus generais trazem propostas. Siga uma por turno.'}</p><div class="cgrid">`+
    c.list.map((o,k)=>{const G=gs(o.i),po=postOf(o.i);return`<div class="gcard ccard ${c.done?'dim':''}">${img(o.i,S[o.i][4])}<div class="tb"><b>${S[o.i][4]}</b><small>${po?'Cargo: '+POSTS[po][0]+' · ':''}proposta pela ${o.attr}</small>
      <div class="attrs">${[['Liderança',G[0]],['Astúcia',G[1]],['Política',G[2]]].map(([n,v])=>`<div class="at ${n.toLowerCase().startsWith(o.attr.slice(0,3))?'hi':''}"><span>${n}</span><i><u style="width:${v}%"></u></i><em>${v}</em></div>`).join('')}</div>
      <div class="prop"><b>${o.nome}</b><small>${o.txt}</small></div>${c.done?'<span class="st">Conselho já seguido</span>':gold[me]<o.custo?`<span class="st no">Faltam ${o.custo-gold[me]} ouro<small>custa ${o.custo}</small></span>`:`<button data-s="cs-${k}" class="buy wide">Seguir<small>${o.custo?o.custo+' ouro':'grátis'}</small></button>`}</div></div>`}).join('')+
    `</div><div class="opt"><span>Delegar ao conselho</span><button data-s="deleg">‹ ${CFG.deleg?'Sim: escolhe sozinho':'Não'} ›</button></div><button data-s="close" class="end">Voltar ao mapa</button>`);$('card').classList.add('wide')}
function showLog(){const nw=Math.max(0,logs.length-logSeen);logSeen=logs.length; /* crônica como linha do tempo; o que é novo vem marcado */
  scr(`<h2>Crônica</h2><p class="c">${logs.length} registro${logs.length==1?'':'s'}${nw?` · ${nw} novo${nw>1?'s':''}`:''}</p><div class="tline">${logs.map((l,k)=>`<p class="${k<nw?'nw':''}"><i></i><span>${esc(l)}</span>${k<nw?'<em>novo</em>':''}</p>`).join('')||'<p><span>Nada aconteceu ainda.</span></p>'}</div><button data-s="close" class="end">Voltar</button>`)}
function load(){try{const d=JSON.parse(localStorage.getItem(SAVE));undoS=[];summ=null;if(!d||d.owner.length!=N)return false;
  reset(d.scn||0);({owner,troops,gold,me,turn,logs,fort,stats}=d);setGoal();moved=new Set(d.moved);sel=me;if(d.hq)hq=d.hq;hq.tech.art??=0;if(d.xp)xp=d.xp;if(d.hand){hand=d.hand;cmd=d.cmd;posts=d.posts;boost=d.boost}council=null;if(d.port)port=d.port;pact=d.pact||{};ally=d.ally||{};trib=d.trib||{};angry=d.angry||{};betray=d.betray||0;perk=d.perk||{};tld=d.tld||[];if(d.price){price=d.price;priceOld=d.priceOld||{...price}}linkPorts();return true}catch{return false}}
const wipe=()=>{try{localStorage.removeItem(SAVE)}catch{}};
const savedInfo=()=>{try{const d=JSON.parse(localStorage.getItem(SAVE));return d&&`${SCN[d.scn||0].n} · ${S[d.me][4]} · turno ${d.turn} · ${d.owner.filter(o=>o==d.me).length}/${N} ${TW}`}catch{return''}};

// ---------- telas: título, nova campanha, campanha, ajuda, evento, fim ----------
// tutorial do primeiro jogo: cada passo avança quando o jogador faz a ação dele
const TUT=[['menu',`Bem-vindo! Clique no seu ${TW1} no mapa (plaquinha escura) para abrir o menu de comandos.`,()=>cenOf(me)],
  ['rec','No menu, escolha Recrutar: cada tropa custa ouro. Passe o mouse sobre qualquer botão para ver o que ele faz.','#cmd [data-a=rec]'],
  ['march',`Abra o menu de novo e escolha Marchar / Atacar. As rotas mostram a chance de vitória contra cada vizinho.`,()=>cenOf(me)],
  ['battle',`Clique num ${TW1} vizinho inimigo para atacar.`,null],
  ['bmove','Na batalha, clique numa unidade sua e depois numa casa hachurada para andar. Arraste o campo para mover a câmera.',()=>{const u=B&&!B.prep&&alive(B.ps).find(v=>!v.done);return u&&inView(...toScreen(u.x*CS+CS/2,u.y*CS+CS/2))?toScreen(u.x*CS+CS/2,u.y*CS+CS/2):null}],
  ['bcmd','Depois de andar, o menu ao lado da unidade pede a ação: Atacar, Esperar ou o poder do líder.','#cmd button:not(.off)'],
  ['bdone','Derrube o comandante inimigo (retrato dourado). Quando todas as suas unidades agirem, a rodada passa sozinha.','[data-a=bend]'],
  ['end','Clique em Fim do turno, o botão dourado: a IA joga e você recebe ouro. Arraste o mapa e use a roda do mouse para aproximar.','[data-a=end]'],
  ['hq','Abra o Quartel-General (botão da casinha) para doutrinas, generais e diplomacia. A Ficha histórica de cada líder conta quem ele foi. Bom jogo!','[data-a=hq]']];
let tut=-1;
const tutStart=()=>{let seen=false;try{seen=localStorage.getItem('tb-tut')}catch{}if(!seen)tut=0};
function tutEv(ev){if(tut<0)return;const k=TUT.findIndex((s,i)=>i>=tut&&s[0]==ev);if(k<0)return;tut=k+1;
  if(tut>=TUT.length){tut=-1;try{localStorage.setItem('tb-tut','1')}catch{}}}
function tutBox(){const el=$('tut');el.hidden=tut<0||!!HQ||(typeof talkCur!='undefined'&&!!talkCur); /* a fala de abertura vem sozinha */if(tut>=0)el.innerHTML=`<b>Tutorial ${tut+1}/${TUT.length}</b><p>${TUT[tut][1]}</p><button data-a="tutskip">Pular tutorial</button>`}
function dipHTML(f,where){ // cartão de diplomacia com um líder rival; where='hq' para os botões da Chancelaria
  const st=pact[f]>turn?(ally[f]>turn?`Aliado até o turno ${ally[f]}`:`Pacto até o turno ${pact[f]}`):angry[f]>turn?'Hostil: recusou tributo':betray>turn?'Desconfia de você: traidor':border(f).length?'Vizinho sem acordo':'Sem fronteira com você';
  const bt=(k,label)=>{const why=dipState(k,f);return`<button ${where=='hq'?'data-s="hq-dip"':where=='scr'?'data-s="dipx"':'data-a="dip"'} data-k="${k}" data-f="${f}" ${why?'disabled':''} title="${why}">${why&&why!='Ouro insuficiente'?why:label}</button>`};
  return`<div class="own">${img(f)}<span><b>${S[f][4]}</b> · ${nOwn(f)} ${TW}<br>${st}</span></div><button ${where=='hq'||where=='scr'?`data-s="enc-${f}"`:`data-a="enc" data-i="${f}"`} class="mini">Ficha histórica</button>`+
    bt('pact',`Pacto de não agressão (${dipCost('pact')} ouro, 5 turnos)`)+bt('ally',`Aliança (${dipCost('ally')} ouro, 8 turnos)`)+bt('trib','Exigir tributo')+
    (pact[f]>turn?'<p><i>Atacar agora é traição: rompe todos os pactos e enfurece os vizinhos.</i></p>':'')}
const traitTxt=i=>({atk:`+${S[i][6]*100}% ataque`,def:`+${S[i][6]*100}% defesa`,gold:`+${S[i][6]} ouro por turno`,rec:'recrutamento pela metade'})[S[i][5]];
const scr=h=>{if(h&&$('screen').hidden)sfx.page();$('screen').hidden=!h;$('screen').classList.remove('title');$('card').classList.remove('wide');if(h){$('card').innerHTML=h;$('card').scrollTop=0;$('card').querySelector('button.end,button')?.focus()}};
let pickI=ix.RJ,scnI=0,EVT=null;
const goalTxt=(sc,f)=>{const g=SCN[sc].play?.[f];return g?`Domine ${g.map(i=>S[i][0]).join(', ')}`:`Unifique os ${N} ${TW}`};
function showTitle(){const sv=savedInfo(),camp=TKEY!='brasil';
  scr(`<img class="logo" src="assets/logo.png" alt="Terra Brasilis" width="880" height="579">${camp?`<h2>${TH.nome} · ${TH.ano}</h2>`:''}<p class="c">${TH.title}</p>
    ${sv?`<button data-s="cont" class="end">Continuar</button><p class="c">${sv}</p>`:''}
    <button data-s="setup" ${sv?'':'class="end"'}>${camp?'Nova partida desta campanha':'Dominação do Brasil: nova partida'}</button>
    <button data-s="camps">${camp?'Outras campanhas históricas':'Campanhas históricas'}</button>${[1,2,3].some(k=>slotOf(k))?'<button data-s="saves">Carregar partida salva</button>':''}
    ${camp?'<button data-s="th-brasil">Voltar à Dominação do Brasil</button>':''}<button data-s="help">Como jogar</button>`);$('screen').classList.add('title')}
function showCamps(){ // cada campanha abre num mapa próprio, só da região daquela guerra
  scr(`<h2>Campanhas históricas</h2><p class="c">Cada guerra tem mapa próprio, líderes da época e um objetivo para cada lado.</p>`+
    Object.entries(THEATERS).filter(([k])=>k!='brasil').map(([k,t])=>{const sv=saveOf(k),sc=t.SCN[0],sides=Object.keys(sc.play).map(c=>t.S.find(s=>s[0]==c)[4]).join(' ou ');
      return`<div class="ucard" style="flex-direction:column;align-items:stretch"><b>${t.nome} · ${t.ano}</b><p>${sc.d}</p>
        <div class="chips"><span>${t.S.length} ${t.word}</span><span>Jogue com ${sides}</span>${sv?`<span>Partida salva: turno ${sv.turn}</span>`:''}</div>
        <button data-s="th-${k}" class="${k==TKEY?'':'end'}">${k==TKEY?'Campanha aberta':'Abrir campanha'}</button></div>`}).join('')+
    `<button data-s="title">Voltar</button>`)}
$('armyBtn').addEventListener('click',()=>{if(me>=0&&!B&&!HQ)showArmy()});
$('councilBtn').addEventListener('click',()=>{if(me>=0&&!B&&!HQ&&!over)showCouncil()});
addEventListener('hashchange',()=>location.reload()); // trocar de teatro recarrega o jogo com o mapa novo
function showSetup(){const SC=SCN[scnI],pl=SC.play?Object.keys(SC.play).map(Number):S.map((_,j)=>j);if(!pl.includes(pickI))pickI=pl[0];
  reset(scnI);sel=pickI;const i=pickI,s=S[i],reg=REG.find(r=>r[1].includes(i)),own=owner.filter(o=>o==i).length;
  scr(`<h2>${TKEY=='brasil'?'Escolha seu líder':TH.nome}</h2><p class="c">${SC.d}</p>
    <div class="pick"><div class="pgrid" role="listbox" aria-label="Líderes">${pl.map(j=>`<button data-s="pick-${j}" class="${j==i?'on':''}" role="option" aria-selected="${j==i}" data-help="${esc(S[j][4]+' · '+S[j][1])}">${img(j,S[j][4])}<span>${S[j][0]}</span></button>`).join('')}</div>
    <div class="pinfo"><div class="phead"><img class="hero" src="${face[i]}" alt="${s[4]}"><div><h3>${s[4]}</h3><p>${s[1]}${reg?' · '+reg[0]:''}${own>1?` · começa com ${own} ${TW}`:''}</p><button data-s="enc-${i}" class="mini">Ficha histórica</button></div></div>
      <img class="rmap" src="${regionMap(i)}" alt="Mapa com ${s[1]} em destaque">
      <p><b>Objetivo:</b> ${goalTxt(scnI,i)}</p>
      <p>${s[7]}: ${traitTxt(i)}<br>Terreno de batalha: ${BIO[BOF[i]].nome}${resOf(i)?' · Recurso: '+RESN[resOf(i)][0]:''}<br>Fronteiras: ${adj[i].map(j=>S[j][0]).join(', ')}${reg?`<br>Região completa rende +${reg[2]} ouro por turno`:''}</p>
      ${SCN.length>1?`<div class="opt"><span>Cenário</span><button data-s="scn">‹ ${SC.n} (${SC.y}) ›</button></div>`:''}
      <div class="opt"><span>Dificuldade</span><button data-s="diff">‹ ${OPT.diff[1][CFG.diff]} ›</button></div>
      <div class="row"><button data-s="go" class="end">Iniciar</button><button data-s="rand">Sortear</button><button data-s="title">Voltar</button></div></div></div>`);
  $('card').classList.add('wide');$('card').querySelector('.pgrid .on')?.scrollIntoView({block:'nearest'});ui()}
const RMAP={};
function regionMap(i){const k=TKEY+i+'-'+scnI;if(RMAP[k])return RMAP[k]; /* mapa plano: o líder em destaque, vizinhos em tom claro */
  const[c,g]=mk(W,H),im=g.createImageData(W,H),d=im.data,own=new Set(owner.map((o,j)=>o==i?j:-1).filter(j=>j>=0)),nb=new Set([...own].flatMap(j=>adj[j]));
  const mine=hsl2rgb(hue(i)/360,.72,.5),edge=hsl2rgb(hue(i)/360,.8,.28);
  for(let q=0;q<W*H;q++){const v=cell[q];let col=v<0?(v==-2?[118,108,88]:[38,66,104]):own.has(v)?mine:nb.has(v)?[214,198,160]:[168,156,130];
    if(v>=0&&own.has(v)&&[q-1,q+1,q-W,q+W].some(z=>!own.has(cell[z])))col=edge;
    d[q*4]=col[0];d[q*4+1]=col[1];d[q*4+2]=col[2];d[q*4+3]=255}
  g.putImageData(im,0,0);return RMAP[k]=c.toDataURL()}
function showHelp(){scr(`<h2>Como jogar</h2>
  <p><b>Dominação do Brasil:</b> conquiste os 27 estados. <b>Campanhas históricas:</b> cada guerra tem mapa próprio e um objetivo para cada lado.</p>
  <p><b>Turno:</b> clique num ${TW1} seu, recrute com ouro, escolha quantas tropas enviar e marche para um vizinho. Cada ${TW1} marcha uma vez por turno.</p>
  <p><b>Ouro:</b> cada estado rende por turno; dominar uma região inteira dá bônus. Fortes custam 3 de ouro e dão +20% de defesa (até 2).</p>
  <p><b>Batalha:</b> derrube o comandante inimigo. Infantaria vence Cavalaria, Cavalaria vence Atiradores, Atiradores vencem Infantaria. Mata e vila protegem.</p>
  <p><b>Atalhos:</b> <kbd>E</kbd> fim do turno ou da rodada · <kbd>M</kbd> marchar · <kbd>R</kbd> recrutar · <kbd>F</kbd> fortificar · <kbd>N</kbd> próximo ${TW1} que pode agir · <kbd>Z</kbd> desfazer · <kbd>X</kbd> exército · <kbd>C</kbd> campanha · <kbd>Q</kbd> quartel · <kbd>W</kbd> esperar · <kbd>A</kbd> automático · <kbd>Setas</kbd> e <kbd>Enter</kbd> escolhem no mapa · <kbd>Esc</kbd> cancela a marcha ou abre o menu</p>
  <p>O jogo salva sozinho a cada ação, neste navegador.</p>
  ${me>=0?'<button data-s="tut">Rever tutorial</button>':''}
  <button data-s="${me<0?'title':'close'}" class="end">Voltar</button>`)}
function showCampaign(){coach('camp','Cada medalha sobe de bronze a ouro; a glória soma os níveis.'); /* campanha: metas como medalhas, glória somada, potências */
  const mine=owner.filter(o=>o==me).length,pw=[...new Set(owner)].map(f=>[f,owner.filter(o=>o==f).length,owner.reduce((a,o,i)=>a+(o==f?troops[i]:0),0)]).sort((a,b)=>b[1]-a[1]||b[2]-a[2]),
    tier=(v,T)=>T.filter(t=>v>=t).length,M=[]; // [ícone, título, valor, alvo, recompensa, nível 0..3]
  if(goal){const g=goal.filter(i=>owner[i]==me).length;M.push(['flag','Objetivo da campanha',g,goal.length,'vitória',g>=goal.length?3:g/goal.length>=.5?2:g?1:0])}
  M.push(['flag','Brasil unificado',mine,N,'vitória',mine>=N?3:mine/N>=.5?2:mine/N>=.25?1:0]);
  REG.forEach(([n,st,b])=>{const k=st.filter(i=>owner[i]==me).length;M.push(['house',`Região ${n}`,k,st.length,`+${b} ouro/turno`,k>=st.length?3:k/st.length>=.5?2:k?1:0])});
  [['swords','Vitórias em batalha',stats.won,[3,10,25]],['star',`${TW[0].toUpperCase()+TW.slice(1)} conquistados`,stats.taken,[3,8,15]],['coin','Renda por turno',income(me),[10,20,35]]].forEach(([ic,t,v,T])=>{const lv=tier(v,T);M.push([ic,t,v,T[Math.min(2,lv)],lv>2?'nível máximo':`próximo: ${T[lv]}`,lv])});
  const glory=M.reduce((a,m)=>a+m[5],0),TN=['','bronze','prata','ouro'];
  scr(`<div class="camp"><div class="cl"><img src="${face[me]}" alt=""><b>${S[me][4]}</b><small>${SCN[scn].n} · ${SCN[scn].y}</small>
      <div class="glory" data-help="Glória: soma dos níveis das medalhas">★ ${glory}<span>glória</span></div><p class="hint">${goalTxt(scn,me)}</p>
      <p class="hint">Turno ${turn} · ${stats.won} vitórias · ${stats.lost} derrotas</p></div>
    <div class="cr"><h2>Campanha</h2><div class="medals">${M.map(([ic,t,v,mx,rw,lv])=>`<div class="medal t${lv}" data-help="${esc(`${t}: ${v}/${mx}${lv?` · ${TN[lv]}`:''}`)}"><div class="hx">${I(ic)}${lv?`<i>${'★'.repeat(lv)}</i>`:''}</div><b>${t}</b>
        <div class="pb"><i style="width:${Math.min(100,v/Math.max(1,mx)*100)}%"></i></div><small>${v}/${mx} · ${rw}</small></div>`).join('')}</div>
      <h3>Potências</h3><div class="pows">${pw.slice(0,6).map(([f,n,t],k)=>`<div class="${f==me?'me':''}"><em>${k+1}º</em>${img(f)}<span><b>${f==me?'Você':S[f][4]}</b><small>${n} ${n==1?TW1:TW} · ${t} tropas</small></span></div>`).join('')}</div>
      <div class="row c"><button data-s="close" class="end">Voltar ao mapa</button><button data-s="help">Como jogar</button></div></div></div>`);$('card').classList.add('wide')}
function showEnd(){const win=victory;win?sfx.fanfare():sfx.lose();if(win){cele={i:me,start:Date.now(),dur:6000,n:180};mood[me]={m:'smile',until:Date.now()+6e4}}
  scr(`<h2 class="big">${win?(goal&&!owner.every(o=>o==me)?'OBJETIVO CUMPRIDO':'BRASIL UNIFICADO'):'FIM DA CAMPANHA'}</h2>${win?`<img class="ending" src="${endCard()}" alt="">`:`<div class="row c"><img class="hero" src="${face[me]}" alt=""></div>`}
    <p class="c">${win?(goal&&!owner.every(o=>o==me)?`${S[me][4]} vence a ${SCN[scn].n}.`:`${S[me][4]} reúne ${TKEY=='brasil'?'as 27 províncias':'todos os '+TW} sob uma só bandeira.`):`O domínio de ${S[me][4]} caiu.`}</p>
    ${win?`<p class="c endtxt">${endText()}</p>`:''}<p class="c">${turn} turnos · ${stats.won} vitórias · ${stats.lost} derrotas · ${stats.taken} ${TW} tomados</p>
    <button data-s="setup" class="end">Nova partida</button><button data-s="camps">Campanhas históricas</button><button data-s="enc-${me}">Ficha de ${S[me][4]}</button><button data-s="close">Ver o mapa</button>`)}
function showEvent(){ // escolha de início de turno: [título, texto, [[opção, custo em ouro, efeito]]]
  const own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0),st=own[Math.random()*own.length|0],n=S[st][1],no=()=>{};
  const E=[['Safra de café',`Colheita farta em ${n}.`,[['Vender a safra (+6 ouro)',0,()=>gold[me]+=6],['Alimentar as tropas (+3 tropas)',0,()=>troops[st]+=3]]],
    ['Voluntários da pátria',`Homens de ${n} querem se alistar.`,[['Aceitar (+4 tropas)',0,()=>troops[st]+=4],['Cobrar dispensa (+5 ouro)',0,()=>gold[me]+=5]]],
    ['Revolta local',`Motim nas ruas de ${n}.`,[['Negociar (−4 ouro)',4,no],['Reprimir (−2 tropas)',0,()=>troops[st]=Math.max(1,troops[st]-2)]]],
    ['Febre amarela',`Um surto atinge os quartéis de ${n}.`,[['Quarentena (−3 ouro)',3,no],['Seguir marcha (perde um terço das tropas)',0,()=>troops[st]=Math.max(1,Math.round(troops[st]*.67))]]],
    ['Engenheiros militares',`Oferecem erguer um forte em ${n}.`,[['Construir (−3 ouro, +20% defesa)',3,()=>fort[st]=Math.min(2,fort[st]+1)],['Recusar',0,no]]],
    ['Contrabando de armas',`Um navio sem bandeira ancora perto de ${n}.`,[['Comprar (−5 ouro, +5 tropas)',5,()=>troops[st]+=5],['Denunciar (+2 ouro)',0,()=>gold[me]+=2]]]];
  EVT=E[Math.random()*E.length|0];sel=st;const EIC={'Safra de café':'r_caf','Voluntários da pátria':'swords','Revolta local':'warn','Febre amarela':'warn','Engenheiros militares':'shield','Contrabando de armas':'anchor'}; /* evento: medalhão do tema e opções com ganho e perda */
  const fx=t=>t.split(/,\s*/).map(q=>`<span class="${/[−-]|perde/.test(q)?'bad':'good'}">${q}</span>`).join('');
  scr(`<h2>${EVT[0]}</h2><div class="evh"><span class="medal1">${I(EIC[EVT[0]]||'scroll')}</span><div><p>${EVT[1]}</p><small>${S[st][1]} · ${troops[st]} tropas · ouro em caixa ${gold[me]}</small></div></div><div class="evo">`+
    EVT[2].map(([l,c],k)=>{const m=l.match(/^(.*?)\s*\((.*)\)$/),nm=m?m[1]:l,ef=m?m[2]:'';
      return`<button data-s="ev${k}" class="${gold[me]<c?'off':''}" ${gold[me]<c?'disabled':''}><b>${nm}</b><span class="fx">${ef?fx(ef):'<span>nada muda</span>'}</span>${gold[me]<c?`<small>faltam ${c-gold[me]} ouro</small>`:''}</button>`}).join('')+'</div>')}
onTurn=()=>{if(storyTurn())return;if(Math.random()<.35){if(aiShow)evtDue=true;else showEvent()}}; // durante a reencenação da IA, o evento espera
$('campBtn').addEventListener('click',()=>{if(me>=0&&!B)showCampaign()});
const onScr=e=>{const k=e.target.closest('button')?.dataset.s;if(!k)return;sfx.sel();
  if(k=='cont'){if(load()){regionCheck(true);scr();ui()}else showSetup()}
  else if(k=='setup'){reset();showSetup()}
  else if(k=='help')showHelp();
  else if(k=='camps')showCamps();
  else if(k.startsWith('th-')){const t=k.slice(3);if(t==TKEY)showTitle();else location.hash=t=='brasil'?'':t}
  else if(k=='title'){sel=-1;ui();showTitle()}
  else if(k=='prev'||k=='next'){const pl=SCN[scnI].play?Object.keys(SCN[scnI].play).map(Number):S.map((_,j)=>j),p=pl.indexOf(pickI);pickI=pl[(p+(k=='next'?1:pl.length-1))%pl.length];showSetup()}
  else if(k=='rand'){const pl=SCN[scnI].play?Object.keys(SCN[scnI].play).map(Number):S.map((_,j)=>j);pickI=pl[Math.random()*pl.length|0];showSetup()}
  else if(k=='scn'){scnI=(scnI+1)%SCN.length;showSetup()}
  else if(k=='diff'){CFG.diff=(CFG.diff+1)%3;saveCfg();showSetup()}
  else if(k=='go'){reset(scnI);startAs(pickI);sel=me;regionCheck(true);setTimeout(storyIntro,400);say(`${SCN[scnI].y}: ${S[me][4]} ergue a bandeira em ${S[me][1]}`);scr();tutStart();ui()}
  else if(k=='close')scr();
  else if(k.startsWith('enc-'))showEnc(+k.slice(4));
  else if(k.startsWith('pick-')){pickI=+k.slice(5);showSetup()}
  else if(k=='bgo'){scr();ui()}
  else if(k=='bauto2'){scr();if(B){B.prep=false;bEnd(true)}}
  else if(k=='bback'){if(B&&!B.ps){const f=B.from,t=B.to;B=null;moved.add(f);note(`Ataque a ${S[t][1]} cancelado: as tropas ficam em ${S[f][1]}`);scr();ui()}}
  else if(k.startsWith('dipf-'))showDip(+k.slice(5));
  else if(k.startsWith('dipt-')){window.dipTab=k.slice(5);showDip(window.dipF)}
  else if(k=='dipx'){const b=e.target.closest('button'),ok=dipAct(b.dataset.k,+b.dataset.f);ok?sfx.win():sfx.lose();if(ok&&b.dataset.k=='ally')storyAlly(+b.dataset.f);showDip(window.dipF);ui()}
  else if(k.startsWith('perk-')){const[,kk,id]=k.split('-'),p=lastRes.perks[+kk];(perk[p.st+'-'+p.j]=perk[p.st+'-'+p.j]||[]).push(id);note(`${p.n}: ${PERKS.find(q=>q[0]==id)[1]}`);lastRes.perks.splice(+kk,1);showBRes(lastRes)}
  else if(k=='bfree'){if(bCap!=null&&gold[me]>=10){gold[me]-=10;pact[bCap]=Math.max(pact[bCap]||0,turn+4);note(`${S[bCap][4]} libertado: pacto até o turno ${turn+4}`)}bCap=null;scr();ui()}
  else if(k.startsWith('sv-')){try{localStorage.setItem(SLOT(k.slice(3)),JSON.stringify({...snap(),nome:$('svname').value.trim()||`Turno ${turn}`,quando:Date.now(),thumb:mapThumb()}));note('Partida salva')}catch{note('Não foi possível salvar: armazenamento do navegador cheio ou bloqueado')}showSaves('close')}
  else if(k.startsWith('ld-')){const d=localStorage.getItem(SLOT(k.slice(3)));if(d){localStorage.setItem(SAVE,d);if(load()){regionCheck(true);scr();note('Partida carregada');ui()}}}
  else if(k.startsWith('cs-')){followCouncil(+k.slice(3));showCouncil();ui()}
  else if(k=='deleg'){CFG.deleg=CFG.deleg?0:1;saveCfg();showCouncil()}
  else if(k.startsWith('go-')){sel=+k.slice(3);marching=false;mapSee(sel,true,1.8);scr();ui()}
  else if(k=='saves')showSaves('title');
  else if(k=='tut'){tut=0;scr();ui()}
  else if(k=='hq-dip'){const b=e.target.closest('button');dipAct(b.dataset.k,+b.dataset.f)?sfx.win():sfx.lose();save();showRoom(HQ.room);ui()}
  else if(k.startsWith('hq-')){const[,a,id]=k.split('-');
    if(a=='map')return closeHQ();
    if(a=='go'){if(id=='cam'){$('room').hidden=true;HQ.zoom=null;return showCampaign()}HQ.zoom={room:id,start:Date.now()-500,dir:1};return showRoom(id)} // aba: troca de sala sem voltar
    if(a=='ghelp'){HQ.ghelp=!HQ.ghelp;return showRoom('gen')}
    if(a=='close'){$('room').hidden=true;const z=HQ.zoom={room:HQ.room,start:Date.now(),dir:-1};setTimeout(()=>{if(HQ&&HQ.zoom===z)HQ.zoom=null},340);return ui()}
    if(a=='doc'){gold[me]-=DOC.find(d=>d[0]==id)[3];hq.doc[id]=1;note('Doutrina adotada: '+DOC.find(d=>d[0]==id)[1])}
    if(a=='tech'){if(!(id in hq.tech))return;gold[me]-=6+4*hq.tech[id];hq.tech[id]++;note(`${UT[id][0]} treinada: nível ${hq.tech[id]}`)}
    if(a=='tax'){gold[me]+=Math.ceil(income(me)/2);hq.tax=turn;note(`Imposto de guerra: +${Math.ceil(income(me)/2)} ouro`)}
    sfx.win();save();renderHQ();showRoom(HQ.room);ui()} // a cena reflete a compra: estandarte, soldado novo
  else if(k.startsWith('ev')){const[l,c,fn]=EVT[2][+k[2]];gold[me]-=c;fn();note(`${EVT[0]}: ${l.split(' (')[0].toLowerCase()}`);scr();ui()}};
$('screen').addEventListener('click',onScr);$('room').addEventListener('click',onScr);
document.addEventListener('keydown',e=>{ // atalhos: clicam o botão correspondente do painel, se existir e estiver ativo
  if(e.key=='?'&&$('menu').hidden&&!e.target.closest?.('input,select,textarea')){e.preventDefault();return $('screen').hidden?showKeys():scr()}
  if(!$('screen').hidden||!$('menu').hidden||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();
  if(k=='c')return $('campBtn').click();
  if(k=='x')return $('armyBtn').click();
  if(k=='v')return $('councilBtn').click();
  if(k=='escape'&&(aim||B?.aim)){aim=null;if(B)B.aim=null;return ui()}
  if(me>=0&&!B&&!HQ&&!aiShow&&!cam){const dv={arrowup:[0,-1],arrowdown:[0,1],arrowleft:[-1,0],arrowright:[1,0]}[k]; // teclado no mapa
    if(dv){e.preventDefault();const from=marching&&hov>=0?hov:sel,cand=marching?adj[sel]:S.map((_,j)=>j),[fx_,fy]=from>=0?proj(...px(from)):[405,305];
      let best=-1,bs=1e9;cand.forEach(j=>{if(j==from)return;const[jx,jy]=proj(...px(j)),dx=jx-fx_,dy=jy-fy,al=dx*dv[0]+dy*dv[1];if(al<=0)return;const sc=Math.hypot(dx,dy)+Math.abs(dx*dv[1]-dy*dv[0])*1.5;if(sc<bs){bs=sc;best=j}});
      if(best>=0){if(marching)hov=best;else sel=best;sfx.sel();ui()}return}
    if(k=='enter'&&marching&&adj[sel].includes(hov)){e.preventDefault();if(tryAct(hov))hov=-1;return ui()}}
  if(HQ&&/^[1-6]$/.test(k)){const tk=HQTABS[+k-1][0];if(tk=='cam')return showCampaign();HQ.zoom={room:tk,start:Date.now()-500,dir:1};return showRoom(tk)} // atalhos das salas
  if(k=='q')return HQ?closeHQ():openHQ();
  const a=B?{e:'bend',a:'bauto',z:'bcancel',w:'bwait'}[k]:{e:'end',m:'march',r:'rec',f:'fort',z:'undo',n:'next'}[k];
  if(a)document.querySelector(`#cmd:not([hidden]) [data-a="${a}"]:not(:disabled), aside [data-a="${a}"]:not(:disabled), #hud [data-a="${a}"]:not(.off)`)?.click()});


function showKeys(){const K=(k,t)=>`<div class="kr"><span>${k.split(' ').map(q=>`<kbd>${q}</kbd>`).join(' ')}</span><em>${t}</em></div>`; /* todos os atalhos numa tela, a tecla ? abre e fecha */
  scr(`<h2>Atalhos do teclado</h2><div class="keyg">
    <div class="box"><b>${I('flag')}Mapa</b>${K('E','Fim do turno')}${K('M','Marchar')}${K('R','Recrutar')}${K('F','Fortificar')}${K('N','Próximo estado')}${K('Z','Desfazer')}${K('Q','Quartel-general')}${K('Setas Enter','Escolher estado e confirmar marcha')}</div>
    <div class="box"><b>${I('swords')}Batalha</b>${K('E','Encerrar rodada')}${K('W','Esperar')}${K('Z','Desfazer movimento')}${K('A','Automático (confirma)')}${K('F','Velocidade do turno inimigo')}${K('Espaço','Pular animações do inimigo')}${K('M','Minimapa')}</div>
    <div class="box"><b>${I('eye')}Câmera</b>${K('+ -','Aproximar e afastar')}${K('0','Mapa inteiro')}${K('Setas','Mover na batalha')}<p class="hint">Arraste para mover, roda ou pinça para aproximar, duplo clique centraliza.</p></div>
    <div class="box"><b>${I('menu')}Geral</b>${K('C','Campanha')}${K('X','Exército')}${K('V','Conselho')}${K('Esc','Pausa ou cancelar')}${K('?','Esta tela')}</div></div>
    <button data-s="close" class="end">Fechar</button>`);$('card').classList.add('wide')}
