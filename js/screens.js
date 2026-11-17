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
  if(CFG.shake){$('stage').classList.remove('shake');void $('stage').offsetWidth;$('stage').classList.add('shake')}
  $('vsa').src=face[a];$('vsd').src=face[d];$('vsan').textContent=S[a][4];$('vsdn').textContent=S[d][4];
  $('vsr').textContent=`${S[st][1].toUpperCase()}: `+(a==me?(won?'VITÓRIA!':'DERROTA'):(won?'TERRITÓRIO PERDIDO':'DEFESA HEROICA!'));
  $('vs').hidden=false;clearTimeout(vsT);setTimeout(()=>{$('vsa').src=faceOf(a);$('vsd').src=faceOf(d)},500);vsT=setTimeout(()=>$('vs').hidden=true,1700)};
$('vs').addEventListener('click',()=>$('vs').hidden=true);

// ---------- menu de pausa ----------
const OPT={tac:['Batalhas',['Sempre táticas','Só nos ataques','Automáticas']],speed:['Ritmo da IA',['Lento','Normal','Rápido']],
  diff:['Dificuldade',['Fácil','Normal','Difícil']],clash:['Cenas de combate',['Desligadas','Ligadas']],shake:['Tremor de tela',['Desligado','Ligado']]};
let confirmNew=false;
function drawMenu(focus){
  $('menuBox').innerHTML=`<h2>◆ PAUSA ◆</h2>
    <label class="opt" for="mus"><span>Música</span><input type="range" id="mus" min="0" max="1" step="0.1" value="${CFG.mus}"></label>
    <label class="opt" for="vol"><span>Efeitos</span><input type="range" id="vol" min="0" max="1" step="0.1" value="${CFG.vol}"></label>`+
    Object.entries(OPT).map(([k,[nome,vals]])=>`<div class="opt"><span>${nome}</span><button data-c="${k}">‹ ${vals[CFG[k]]} ›</button></div>`).join('')+
    `<button data-c="close" class="end">Continuar</button><button data-c="title">Salvar e sair ao título</button>
     <button data-c="new" class="danger">${confirmNew?'Confirmar: apagar partida':'Nova partida'}</button>`;
  $('menuBox').querySelector(`[data-c="${focus||'close'}"]`)?.focus()}
function menu(open){confirmNew=false;$('menu').hidden=!open;if(open)drawMenu()}
$('menuBtn').addEventListener('click',()=>menu(true));
document.addEventListener('keydown',e=>{if(e.key=='Escape')menu($('menu').hidden)});
$('menu').addEventListener('click',e=>{if(e.target.id=='menu')return menu(false);
  const k=e.target.closest('button')?.dataset.c;if(!k)return;sfx.sel();
  if(k=='close')return menu(false);
  if((k=='title'||(k=='new'&&confirmNew))&&HQ)closeHQ();
  if(k=='title'){B=null;raids=[];menu(false);if(me>=0)load();ui();return showTitle()} // batalha em curso é abandonada; volta ao último salvamento
  if(k=='new'){if(!confirmNew){confirmNew=true;return drawMenu('new')}B=null;wipe();reset();menu(false);ui();return showSetup()}
  CFG[k]=(CFG[k]+1)%OPT[k][1].length;saveCfg();drawMenu(k)});
$('menu').addEventListener('input',e=>{if(e.target.id=='mus'){CFG.mus=+e.target.value;saveCfg()}if(e.target.id=='vol'){CFG.vol=+e.target.value;saveCfg();sfx.sel()}});

// ---------- salvar ----------
const SAVE='tb-save'+(TKEY=='brasil'?'':'-'+TKEY),saveOf=k=>{try{return JSON.parse(localStorage.getItem('tb-save'+(k=='brasil'?'':'-'+k)))}catch{return null}};
function save(){if(me<0||B||raids.length)return;try{over?localStorage.removeItem(SAVE):
  localStorage.setItem(SAVE,JSON.stringify({scn,owner,troops,gold,me,turn,logs,fort,stats,hq,xp,port,pact,ally,trib,angry,betray,moved:[...moved]}))}catch{}}
function load(){try{const d=JSON.parse(localStorage.getItem(SAVE));if(!d||d.owner.length!=N)return false;
  reset(d.scn||0);({owner,troops,gold,me,turn,logs,fort,stats}=d);setGoal();moved=new Set(d.moved);sel=me;if(d.hq)hq=d.hq;hq.tech.art??=0;if(d.xp)xp=d.xp;if(d.port)port=d.port;pact=d.pact||{};ally=d.ally||{};trib=d.trib||{};angry=d.angry||{};betray=d.betray||0;linkPorts();return true}catch{return false}}
const wipe=()=>{try{localStorage.removeItem(SAVE)}catch{}};
const savedInfo=()=>{try{const d=JSON.parse(localStorage.getItem(SAVE));return d&&`${SCN[d.scn||0].n} · ${S[d.me][4]} · turno ${d.turn} · ${d.owner.filter(o=>o==d.me).length}/${N} ${TW}`}catch{return''}};

// ---------- telas: título, nova campanha, campanha, ajuda, evento, fim ----------
// tutorial do primeiro jogo: cada passo avança quando o jogador faz a ação dele
const TUT=[['rec',`Bem-vindo! Seu ${TW1} está no painel. Recrute tropas com +1, +5 ou Máx; cada tropa custa ouro.`],
  ['march','Clique em Marchar / Atacar. As setas vermelhas mostram os vizinhos que você pode atacar.'],
  ['battle',`Clique num ${TW1} com seta vermelha. Passe o mouse antes: o balão diz se o ataque é favorável.`],
  ['bmove','Na batalha, clique numa unidade sua e depois numa casa hachurada para mover. Clique num inimigo para ver até onde ele vai.'],
  ['bdone','Derrube o comandante inimigo (retrato dourado). Quando todas agirem, a rodada passa sozinha. Automático resolve rápido.'],
  ['end','Clique em Fim do turno: a IA joga e você recebe ouro.'],
  ['hq','Abra o Quartel-General para treinar tropas, adotar doutrinas e fazer diplomacia. Bom jogo!']];
let tut=-1;
const tutStart=()=>{let seen=false;try{seen=localStorage.getItem('tb-tut')}catch{}if(!seen)tut=0};
function tutEv(ev){if(tut<0)return;const k=TUT.findIndex((s,i)=>i>=tut&&s[0]==ev);if(k<0)return;tut=k+1;
  if(tut>=TUT.length){tut=-1;try{localStorage.setItem('tb-tut','1')}catch{}}}
function tutBox(){const el=$('tut');el.hidden=tut<0||!!HQ;if(tut>=0)el.innerHTML=`<b>Tutorial ${tut+1}/${TUT.length}</b><p>${TUT[tut][1]}</p><button data-a="tutskip">Pular tutorial</button>`}
function dipHTML(f,where){ // cartão de diplomacia com um líder rival; where='hq' para os botões da Chancelaria
  const st=pact[f]>turn?(ally[f]>turn?`Aliado até o turno ${ally[f]}`:`Pacto até o turno ${pact[f]}`):angry[f]>turn?'Hostil: recusou tributo':betray>turn?'Desconfia de você: traidor':border(f).length?'Vizinho sem acordo':'Sem fronteira com você';
  const bt=(k,label)=>{const why=dipState(k,f);return`<button ${where=='hq'?'data-s="hq-dip"':'data-a="dip"'} data-k="${k}" data-f="${f}" ${why?'disabled':''} title="${why}">${why&&why!='Ouro insuficiente'?why:label}</button>`};
  return`<div class="own">${img(f)}<span><b>${S[f][4]}</b> · ${nOwn(f)} ${TW}<br>${st}</span></div>`+
    bt('pact','Pacto de não agressão (6 ouro, 5 turnos)')+bt('ally','Aliança (12 ouro, 8 turnos)')+bt('trib','Exigir tributo')+
    (pact[f]>turn?'<p><i>Atacar agora é traição: rompe todos os pactos e enfurece os vizinhos.</i></p>':'')}
const traitTxt=i=>({atk:`+${S[i][6]*100}% ataque`,def:`+${S[i][6]*100}% defesa`,gold:`+${S[i][6]} ouro por turno`,rec:'recrutamento pela metade'})[S[i][5]];
const scr=h=>{$('screen').hidden=!h;if(h){$('card').innerHTML=h;$('card').scrollTop=0;$('card').querySelector('button.end,button')?.focus()}};
let pickI=ix.RJ,scnI=0,EVT=null;
const goalTxt=(sc,f)=>{const g=SCN[sc].play?.[f];return g?`Domine ${g.map(i=>S[i][0]).join(', ')}`:'Unifique os ${N} ${TW}'};
function showTitle(){const sv=savedInfo(),camp=TKEY!='brasil';
  scr(`<h2 class="big">TERRA BRASILIS</h2>${camp?`<h2>${TH.nome} · ${TH.ano}</h2>`:''}<p class="c">${TH.title}</p>
    ${sv?`<button data-s="cont" class="end">Continuar</button><p class="c">${sv}</p>`:''}
    <button data-s="setup" ${sv?'':'class="end"'}>${camp?'Nova partida desta campanha':'Dominação do Brasil: nova partida'}</button>
    <button data-s="camps">${camp?'Outras campanhas históricas':'Campanhas históricas'}</button>
    ${camp?'<button data-s="th-brasil">Voltar à Dominação do Brasil</button>':''}<button data-s="help">Como jogar</button>`)}
function showCamps(){ // cada campanha abre num mapa próprio, só da região daquela guerra
  scr(`<h2>Campanhas históricas</h2><p class="c">Cada guerra tem mapa próprio, líderes da época e um objetivo para cada lado.</p>`+
    Object.entries(THEATERS).filter(([k])=>k!='brasil').map(([k,t])=>{const sv=saveOf(k),sc=t.SCN[0],sides=Object.keys(sc.play).map(c=>t.S.find(s=>s[0]==c)[4]).join(' ou ');
      return`<div class="ucard" style="flex-direction:column;align-items:stretch"><b>${t.nome} · ${t.ano}</b><p>${sc.d}</p>
        <div class="chips"><span>${t.S.length} ${t.word}</span><span>Jogue com ${sides}</span>${sv?`<span>Partida salva: turno ${sv.turn}</span>`:''}</div>
        <button data-s="th-${k}" class="${k==TKEY?'':'end'}">${k==TKEY?'Campanha aberta':'Abrir campanha'}</button></div>`}).join('')+
    `<button data-s="title">Voltar</button>`)}
addEventListener('hashchange',()=>location.reload()); // trocar de teatro recarrega o jogo com o mapa novo
function showSetup(){const SC=SCN[scnI],pl=SC.play&&Object.keys(SC.play).map(Number);if(pl&&!pl.includes(pickI))pickI=pl[0];
  reset(scnI);sel=pickI;const i=pickI,s=S[i],reg=REG.find(r=>r[1].includes(i)),own=owner.filter(o=>o==i).length;
  scr(`<h2>${TKEY=='brasil'?'Dominação do Brasil':TH.nome}</h2>
    ${SCN.length>1?`<div class="opt"><span>Cenário</span><button data-s="scn">‹ ${SC.n} (${SC.y}) ›</button></div>`:''}<p class="c">${SC.d}</p>
    <div class="row c"><button data-s="prev" aria-label="Líder anterior">‹</button><img class="hero" src="${face[i]}" alt="${s[4]}"><button data-s="next" aria-label="Próximo líder">›</button></div>
    <p class="c"><b>${s[4]}</b><br>${s[1]} · ${reg[0]}${own>1?` · começa com ${own} ${TW}`:''}</p>
    <p class="c"><b>Objetivo:</b> ${goalTxt(scnI,i)}</p>
    <p>${s[7]}: ${traitTxt(i)}<br>Terreno de batalha: ${BIO[BOF[i]].nome}<br>Fronteiras: ${adj[i].map(j=>S[j][0]).join(', ')}<br>Região completa rende +${reg[2]} ouro por turno</p>
    <div class="opt"><span>Dificuldade</span><button data-s="diff">‹ ${OPT.diff[1][CFG.diff]} ›</button></div>
    <button data-s="go" class="end">Iniciar</button><button data-s="rand">Sortear líder</button><button data-s="title">Voltar</button>`);
  ui()}
function showHelp(){scr(`<h2>Como jogar</h2>
  <p><b>Dominação do Brasil:</b> conquiste os 27 estados. <b>Campanhas históricas:</b> cada guerra tem mapa próprio e um objetivo para cada lado.</p>
  <p><b>Turno:</b> clique num ${TW1} seu, recrute com ouro, escolha quantas tropas enviar e marche para um vizinho. Cada ${TW1} marcha uma vez por turno.</p>
  <p><b>Ouro:</b> cada estado rende por turno; dominar uma região inteira dá bônus. Fortes custam 3 de ouro e dão +20% de defesa (até 2).</p>
  <p><b>Batalha:</b> derrube o comandante inimigo. Infantaria vence Cavalaria, Cavalaria vence Atiradores, Atiradores vencem Infantaria. Mata e vila protegem.</p>
  <p><b>Atalhos:</b> <kbd>E</kbd> fim do turno ou da rodada · <kbd>M</kbd> marchar · <kbd>R</kbd> recrutar · <kbd>F</kbd> fortificar · <kbd>N</kbd> próximo estado · <kbd>C</kbd> campanha · <kbd>Z</kbd> desfazer · <kbd>W</kbd> esperar · <kbd>A</kbd> automático · <kbd>Esc</kbd> menu</p>
  <p>O jogo salva sozinho a cada ação, neste navegador.</p>
  ${me>=0?'<button data-s="tut">Rever tutorial</button>':''}
  <button data-s="${me<0?'title':'close'}" class="end">Voltar</button>`)}
function showCampaign(){
  const mine=owner.filter(o=>o==me).length,pw=[...new Set(owner)].map(f=>[f,owner.filter(o=>o==f).length,owner.reduce((a,o,i)=>a+(o==f?troops[i]:0),0)]).sort((a,b)=>b[1]-a[1]||b[2]-a[2]);
  scr(`<h2>Campanha de ${S[me][4]}</h2>
    <p class="c">${SCN[scn].n} (${SCN[scn].y}) · ${goalTxt(scn,me)}</p>${goal?`<div class="rk"><span>Objetivo</span><div class="pb"><i style="width:${goal.filter(i=>owner[i]==me).length/goal.length*100}%"></i></div><span>${goal.filter(i=>owner[i]==me).length}/${goal.length}</span></div>`:''}
    <div class="rk"><span>Brasil unificado</span><div class="pb"><i style="width:${mine/N*100}%"></i></div><span>${mine}/${N}</span></div>
    <h3>REGIÕES</h3>`+REG.map(([n,st,b])=>{const k=st.filter(i=>owner[i]==me).length;
      return`<div class="rk"><span>${n}</span><div class="pb"><i style="width:${k/st.length*100}%"></i></div><span>${k}/${st.length} ${k==st.length?'✔':''} +${b}</span></div>`}).join('')+
    `<h3>POTÊNCIAS</h3>`+pw.slice(0,5).map(([f,n,t])=>`<div class="rk">${img(f)}<span>${f==me?'<b>Você</b>':S[f][4]}</span><span>${n} ${TW} · ${t} tropas</span></div>`).join('')+
    `<h3>CRÔNICA</h3><p>Turno ${turn} · ${stats.won} vitórias · ${stats.lost} derrotas · ${stats.taken} ${TW} tomados · renda ${income(me)} por turno</p>
    <button data-s="close" class="end">Voltar ao mapa</button><button data-s="help">Como jogar</button>`)}
function showEnd(){const win=victory;win?sfx.fanfare():sfx.lose();if(win){cele={i:me,start:Date.now(),dur:6000,n:180};mood[me]={m:'smile',until:Date.now()+6e4}}
  scr(`<h2 class="big">${win?(goal&&!owner.every(o=>o==me)?'OBJETIVO CUMPRIDO':'BRASIL UNIFICADO'):'FIM DA CAMPANHA'}</h2><div class="row c"><img class="hero" src="${face[me]}" alt=""></div>
    <p class="c">${win?(goal&&!owner.every(o=>o==me)?`${S[me][4]} vence a ${SCN[scn].n}.`:`${S[me][4]} reúne ${TKEY=='brasil'?'as 27 províncias':'todos os '+TW} sob uma só bandeira.`):`O domínio de ${S[me][4]} caiu.`}</p>
    <p class="c">${turn} turnos · ${stats.won} vitórias · ${stats.lost} derrotas · ${stats.taken} ${TW} tomados</p>
    <button data-s="setup" class="end">Nova partida</button><button data-s="camps">Campanhas históricas</button><button data-s="close">Ver o mapa</button>`)}
function showEvent(){ // escolha de início de turno: [título, texto, [[opção, custo em ouro, efeito]]]
  const own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0),st=own[Math.random()*own.length|0],n=S[st][1],no=()=>{};
  const E=[['Safra de café',`Colheita farta em ${n}.`,[['Vender a safra (+6 ouro)',0,()=>gold[me]+=6],['Alimentar as tropas (+3 tropas)',0,()=>troops[st]+=3]]],
    ['Voluntários da pátria',`Homens de ${n} querem se alistar.`,[['Aceitar (+4 tropas)',0,()=>troops[st]+=4],['Cobrar dispensa (+5 ouro)',0,()=>gold[me]+=5]]],
    ['Revolta local',`Motim nas ruas de ${n}.`,[['Negociar (−4 ouro)',4,no],['Reprimir (−2 tropas)',0,()=>troops[st]=Math.max(1,troops[st]-2)]]],
    ['Febre amarela',`Um surto atinge os quartéis de ${n}.`,[['Quarentena (−3 ouro)',3,no],['Seguir marcha (perde um terço das tropas)',0,()=>troops[st]=Math.max(1,Math.round(troops[st]*.67))]]],
    ['Engenheiros militares',`Oferecem erguer um forte em ${n}.`,[['Construir (−3 ouro, +20% defesa)',3,()=>fort[st]=Math.min(2,fort[st]+1)],['Recusar',0,no]]],
    ['Contrabando de armas',`Um navio sem bandeira ancora perto de ${n}.`,[['Comprar (−5 ouro, +5 tropas)',5,()=>troops[st]+=5],['Denunciar (+2 ouro)',0,()=>gold[me]+=2]]]];
  EVT=E[Math.random()*E.length|0];sel=st;
  scr(`<h2>${EVT[0]}</h2><div class="row c"><img class="hero" src="${face[me]}" alt=""></div><p class="c">${EVT[1]}</p>`+
    EVT[2].map(([l,c],k)=>`<button data-s="ev${k}" ${gold[me]<c?'disabled':''}>${l}</button>`).join(''))}
onTurn=()=>{if(Math.random()<.35){if(aiShow)evtDue=true;else showEvent()}}; // durante a reencenação da IA, o evento espera
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
  else if(k=='go'){reset(scnI);startAs(pickI);sel=me;regionCheck(true);say(`${SCN[scnI].y}: ${S[me][4]} ergue a bandeira em ${S[me][1]}`);scr();tutStart();ui()}
  else if(k=='close')scr();
  else if(k=='tut'){tut=0;scr();ui()}
  else if(k=='hq-dip'){const b=e.target.closest('button');dipAct(b.dataset.k,+b.dataset.f)?sfx.win():sfx.lose();save();showRoom(HQ.room);ui()}
  else if(k.startsWith('hq-')){const[,a,id]=k.split('-');
    if(a=='close'){$('room').hidden=true;const z=HQ.zoom={room:HQ.room,start:Date.now(),dir:-1};setTimeout(()=>{if(HQ&&HQ.zoom===z)HQ.zoom=null},340);return ui()}
    if(a=='doc'){gold[me]-=DOC.find(d=>d[0]==id)[3];hq.doc[id]=1;note('Doutrina adotada: '+DOC.find(d=>d[0]==id)[1])}
    if(a=='tech'){gold[me]-=6+4*hq.tech[id];hq.tech[id]++;note(`${UT[id][0]} treinada: nível ${hq.tech[id]}`)}
    if(a=='tax'){gold[me]+=Math.ceil(income(me)/2);hq.tax=turn;note(`Imposto de guerra: +${Math.ceil(income(me)/2)} ouro`)}
    sfx.win();save();showRoom(HQ.room);ui()}
  else if(k.startsWith('ev')){const[l,c,fn]=EVT[2][+k[2]];gold[me]-=c;fn();note(`${EVT[0]}: ${l.split(' (')[0].toLowerCase()}`);scr();ui()}};
$('screen').addEventListener('click',onScr);$('room').addEventListener('click',onScr);
document.addEventListener('keydown',e=>{ // atalhos: clicam o botão correspondente do painel, se existir e estiver ativo
  if(!$('screen').hidden||!$('menu').hidden||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();
  if(k=='c')return $('campBtn').click();
  if(k=='q')return HQ?$('panel').querySelector('[data-a=hqexit]').click():openHQ();
  if(k=='n'&&me>=0&&!B){const own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0);sel=own[(own.indexOf(sel)+1)%own.length];marching=false;return ui()}
  const a=B?{e:'bend',a:'bauto',z:'bundo',w:'bwait'}[k]:{e:'end',m:'march',r:'rec',f:'fort'}[k];
  if(a)$('panel').querySelector(`[data-a="${a}"]:not(:disabled)`)?.click()});

