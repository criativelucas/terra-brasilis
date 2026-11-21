// painel lateral, botões e cliques do mapa
function ui(){
  tutBox();
  $('hqBar').hidden=!HQ;$('act').innerHTML='';$('act').hidden=true;
  if(HQ){$('hqBar').innerHTML=`<span>${I('coin')}Ouro ${gold[me]} (+${income(me)}) · Turno ${turn}</span><button data-a="hqexit" class="end">Voltar ao mapa ▶</button>`;
    $('panel').innerHTML=`<h2>Quartel-General</h2><div class="chips"><span>${I('coin')}Ouro ${gold[me]} (+${income(me)})</span><span>Turno ${turn}</span></div>
      <p>Clique numa sala da maquete ou escolha abaixo.</p>`+ROOMS.map(R=>`<button data-a="room" data-r="${R.k}">${R.n}: ${R.s}</button>`).join('')+
      '<button data-a="room" data-r="dip">Chancelaria: Diplomacia</button><button data-a="room" data-r="cam">Torre de Vigia: Campanha</button><button data-a="hqexit" class="end">Voltar ao mapa</button>';
    $('log').innerHTML=logs.map(l=>`<div>› ${l}</div>`).join('');return save()}
  if(B){const s=B.selU,pk=B.peek&&B.peek.hp>0?B.peek:null,dis=B.busy?'disabled':'',pf=B.ps?B.was:B.af,pkey=S[pf][5],ef=B.ps?B.af:B.was,
      ic=t=>`<img src="${icon(t,pf,true,false)}" alt="${UT[t][0]}" title="${UT[t][0]}">`,eld=B.units.find(u=>u.side!=B.ps&&u.ld),myld=B.units.find(u=>u.side==B.ps&&u.ld),
      left=alive(B.ps).filter(v=>!v.done).length,armed=B.endArm>Date.now();
    let obj,prog,ptxt; /* objetivo numa frase e um indicador de progresso */
    if(B.kind=='cerco'&&!B.ps&&B.gate?.hp>0){obj='arrombe o portão';prog=1-B.gate.hp/B.gate.max;ptxt=`Portão ${B.gate.hp}/${B.gate.max}`}
    else if(B.kind=='cerco'&&!B.ps){obj='leve uma unidade até a praça (bandeira)';prog=B.taken?1:.5;ptxt='Portão aberto'}
    else if(B.ps){obj='resista até a última rodada';prog=Math.min(1,(B.round-1)/MAXR);ptxt=`Rodada ${Math.min(B.round,MAXR)}/${MAXR} · seu comandante ${myld.hp}/${myld.max}`}
    else{obj=`derrube o comandante de ${S[ef][4]}`;prog=1-Math.max(0,eld.hp)/eld.max;ptxt=`Comandante inimigo ${Math.max(0,eld.hp)}/${eld.max} · rodada ${Math.min(B.round,MAXR)}/${MAXR}`}
    const ctx=B.prep?'<div class="summ prep"><b>Preparação</b><p>Posicione suas tropas nas casas azuis antes da primeira rodada. O inimigo já está em posição.</p><button data-a="bstart" class="end">Começar batalha ▶</button></div>'
      :s?statCard(s)+`<div class="row"><button data-a="bwait" ${s.done||B.busy?'disabled':''} data-help="Encerra a vez desta unidade">Esperar</button><button data-a="bcancel" ${B.busy?'disabled':''} data-help="${s.moved&&B.undo?'Volta a unidade para onde estava':'Solta a unidade'}">${s.moved&&B.undo?'Desfazer movimento':'Soltar'}</button></div>`
      :pk?statCard(pk)+'<p class="hint">Laranja: até onde ele anda. Tracejado: onde ele ataca. Escolha uma unidade sua para ver a prévia do seu ataque.</p>'
      :`<div class="forces"><div><span>Suas tropas</span><b>${total(B.ps)}</b></div><div class="fb"><i style="width:${Math.round(total(B.ps)/Math.max(1,total(0)+total(1))*100)}%"></i></div><div><span>Inimigo</span><b>${B.kind=='emboscada'?'?':total(1-B.ps)}</b></div></div>`;
    $('panel').innerHTML=`<h2>${B.ps?'Defesa':'Batalha'} de ${S[B.to][1]}</h2>
      <div class="objbar"><p><b>Objetivo:</b> ${obj}.</p><div class="prog"><i style="width:${Math.round(prog*100)}%"></i></div><small>${ptxt}</small></div>
      <div class="chips"><span data-help="${esc(KIND[B.kind][1])}">${KIND[B.kind][0]}</span><span>${B.bio.nome}</span>${B.wx=='rain'?'<span data-help="Chuva: tiro com 1 casa a menos de alcance">Chuva</span>':B.wx=='dry'?'<span data-help="Seca: infantaria anda 1 casa a menos">Seca</span>':''}${pwOn(B.ps,B.pw[B.ps]?.k)?`<span>${POW[B.pw[B.ps].k][0]} ativo</span>`:''}${B.rl[B.ps]==B.round?'<span>Brado ativo</span>':''}${B.amb==B.round?'<span>Emboscada</span>':''}${B.chg==B.round?'<span>Carga</span>':''}</div>
      ${B.aim?'<p class="warn">Ataque de fogo: clique numa unidade inimiga.</p>':''}
      <div class="ctx">${ctx}</div>
      <div id="tcard">${terrCard()}</div>
      <div class="grp"><span class="lbl">Comandos</span><div class="row"><button data-a="bnext" ${left&&!B.busy&&!B.prep?'':'disabled'} data-help="Escolhe a próxima unidade que ainda pode agir">Próxima (${left})</button><button data-a="brally" ${B.rl[B.ps]||B.busy?'disabled':''} data-help="Brado do comandante: +40% de dano em todas as suas unidades nesta rodada. Uma vez por batalha.">Brado</button><button data-a="bpow" ${B.pw[B.ps]||B.busy?'disabled':''} data-help="${esc(`Poder de ${S[pf][4]}, uma vez por batalha: ${POW[pkey][1]}`)}">${I('star')}${POW[pkey][0]}</button></div></div>
      <button data-a="bend" class="end${armed?' danger':''}" ${dis}>${armed?`Encerrar mesmo assim? ${left} ainda pode${left>1?'m':''} agir`:'Encerrar rodada ▶'}</button>
      <div class="minor"><button data-a="bauto" class="mini" ${dis} data-help="A IA joga por você até o fim da batalha">Automático</button><button data-a="bhelp" class="mini ${bHelp?'on':''}" data-help="Vantagens, terreno e o que cada tipo de batalha muda">? Regras</button></div>
      ${bHelp?`<div class="helpbox"><p>${KIND[B.kind][1]}</p><div class="tri">${ic('inf')}▶${ic('cav')}▶${ic('ati')}▶${ic('inf')}</div><p class="c">A seta aponta quem leva +50% de dano.</p><p>Mata e vila: +30% de defesa; vila cura 2 por rodada e rende 2 ouro. Morro baixo: +20% de defesa e tiro +1. Serra, água e muralha bloqueiam.</p>${B.rl[1-B.ps]?'<p><i>O inimigo já usou o brado.</i></p>':''}${B.pw[1-B.ps]?`<p><i>O inimigo usou ${POW[B.pw[1-B.ps].k][0]}.</i></p>`:''}</div>`:''}`;
    $('roster').hidden=true;handUI();help();return}
  let h='',act='';
  if(summ&&me>=0&&!over)h+=`<div class="summ"><b>Turno ${summ.turn} · ${TOD[summ.turn%4][0]}</b><p>Renda +${summ.inc} ouro.${summ.lost.length?` Perdeu ${summ.lost.map(i=>S[i][1]).join(', ')}.`:' Nenhum '+TW1+' perdido.'}${summ.atk?` ${summ.atk} ataque${summ.atk>1?'s':''} contra você.`:''}${summ.danger?` <b>${summ.danger} em perigo.</b>`:''}</p><button data-a="summx">Entendi</button></div>`;
  if(over)h+=`<h2>${over}</h2><button data-a="new">Novo jogo</button>`;
  else if(me<0)h+=`<p>Escolha no mapa ou na galeria o líder da sua partida. Cada ${TW1} tem vantagem própria.</p>`;
  if(sel>=0){const i=sel,f=owner[i],mine=f==me&&!over;
    h+=`<div class="who">${img(i,S[i][4])}<div><h2>${S[i][1]}</h2><p><b>${S[i][4]}</b></p><p>${S[i][7]}: ${traitTxt(i)}</p><button data-a="enc" data-i="${i}" class="mini" data-help="Quem foi ${esc(S[i][4])} de verdade, e por que tem essa vantagem">Ficha histórica</button></div></div>
      <div class="chips"><span>${I('swords')}Tropas ${cnt('t'+i,troops[i])}</span><span>${gl('renda',I('coin')+'Renda '+inc(i))}</span><span>${gl('def',I('shield')+'Defesa +'+Math.round(defOf(i)*100)+'%')}</span>
        <span>${gl('recruta','Recruta: '+cost(i)+' ouro')}</span><span>${BIO[BOF[i]].nome}</span>${resOf(i)?`<span data-help="${esc(`${RESN[resOf(i)][0]}: preço ${price[resOf(i)].toFixed(2)}${mono(owner[i],resOf(i))?' · monopólio +1':''}${port[i]?' · porto +25%':''}`)}">${I('r_'+resOf(i))}${RESN[resOf(i)][0]} +${resInc(i)}</span>`:''}${xp[i].some(v=>lvl(v))?`<span>${gl('xp','Regimentos '+xp[i].map(lvl).join('·'))}</span>`:''}${port[i]?`<span>${gl('porto',I('anchor')+'Porto')}</span>`:''}${ELITE[S[i][0]]?`<span>${gl('elite','★ '+ELITE[S[i][0]][0])}</span>`:''}${fort[i]?`<span>${gl('forte','Forte nível '+fort[i])}</span>`:''}${danger(i)?`<span class="warn">${gl('perigo',I('warn')+'Em perigo')}</span>`:''}</div>
      <div class="own">${img(f)}<span>Domínio: ${f==me?'você':S[f][4]+' ('+S[f][0]+')'}</span></div>`;
    if(me<0)h+=`<button data-a="start">Começar com ${S[i][0]}</button>`;
    else if(mine){const c=cost(i),g=gold[me],can=!moved.has(i)&&troops[i]>1,rivals=[...new Set(adj[i].map(j=>owner[j]))].filter(o=>o!=me);
      h+=`<div class="tabs" role="tablist">${[['army','Exército'],['build','Construir'],['dip','Diplomacia']].map(([k,n])=>`<button role="tab" aria-selected="${tab==k}" data-a="tab" data-t="${k}" class="${tab==k?'on':''}">${n}</button>`).join('')}</div>`;
      if(tab=='army'){h+=`<div class="row"><button data-a="rec" data-n="1" ${g<c?'disabled':''}>+1</button><button data-a="rec" data-n="5" ${g<c*5?'disabled':''}>+5</button>
          <button data-a="rec" data-n="${Math.floor(g/c)}" ${g<c?'disabled':''}>Máx</button><span>recrutar · ${c} ouro cada</span></div>`;
        h+=can?`<div class="row"><label for="n">Enviar</label><input type="range" id="n" min="1" max="${troops[i]-1}" value="${Math.min(+($('n')?.value||troops[i]-1),troops[i]-1)}"><b id="nv">${Math.min(+($('n')?.value||troops[i]-1),troops[i]-1)}</b></div>
          `
          :`<p><i>${troops[i]>1?'Estas tropas já marcharam neste turno.':'Guarnição mínima: recrute para marchar.'}</i></p>`}
      if(tab=='build')h+=`${COAST.includes(i)?`<button data-a="port" ${port[i]||g<5?'disabled':''}>${I('anchor')}${port[i]?'Porto construído':'Construir porto (5 ouro): +1 renda e rotas marítimas'}</button>`:`<p><i>Sem litoral: não dá para construir porto aqui.</i></p>`}
        <button data-a="fort" ${g<fcost()||fort[i]>1?'disabled':''}>${fort[i]>1?'Forte no máximo':`Fortificar (${fcost()} ouro): +20% de defesa`}</button>`;
      if(tab=='dip')h+=rivals.length?rivals.map(o=>`<div class="ucard" style="flex-direction:column;align-items:stretch">${dipHTML(o)}</div>`).join(''):`<p><i>Nenhum rival faz fronteira com este ${TW1}.</i></p>`;
      if(can)act+=`<button data-a="march" class="${marching?'on':''}">${marching?'Escolha um vizinho… (Esc cancela)':I('swords')+'Marchar / Atacar'}</button>`}}
  if(me>=0&&!over&&sel>=0&&owner[sel]!=me)h+='<h2>Diplomacia</h2>'+dipHTML(owner[sel]);
  if(me>=0&&!over){const idle=owner.reduce((a,o,j)=>a+(o==me&&!moved.has(j)&&troops[j]>1),0),armed=endArm>Date.now();
    act+=`<div class="row"><button data-a="next" ${idle?'':'disabled'} title="Próximo ${TW1} que ainda pode marchar (N)">▶ Próximo (${idle})</button><button data-a="undo" ${undoS.length?'':'disabled'} title="Desfazer (Z)">↶ Desfazer</button><button data-a="hq" data-help="Quartel-General: doutrinas, generais, tesouro e diplomacia (Q)">${I('house')}Quartel</button></div>
      <button data-a="end" class="end${armed?' danger':''}">${armed?`Encerrar mesmo assim? ${idle} ${idle>1?TW:TW1} ainda pode${idle>1?'m':''} marchar`:'Fim do turno ▶'}</button>`}
  if(aim)h=`<div class="summ"><b>${CARDS[aim][0]}</b><p>${CARDS[aim][4]}</p><p><i>Clique num ${TW1} válido (destacado no mapa). Esc cancela.</i></p><button data-a="aimx">Cancelar carta</button></div>`+h;
  $('panel').innerHTML=h;$('act').innerHTML=act;$('act').hidden=!act;
  $('bar').innerHTML=me<0?`<span>${TH.nome} · ${TH.ano}</span>`:`<span>${I(turn%4==3?'moon':'sun')}Turno ${turn} · ${TOD[turn%4][0]}</span><span data-help="Ouro em caixa e a renda por turno">${I('coin')}Ouro ${cnt('gold',gold[me])} (+${income(me)})</span><span data-help="Comando: gasto para jogar cartas; volta todo turno">${I('star')}Comando ${cmd}/${cmdMax()}</span>${SCN[scn].sub?.[me]?`<span>${gl('sub','Corte +'+SCN[scn].sub[me])}</span>`:''}<span>${I('flag')}${TW[0].toUpperCase()+TW.slice(1)} ${cnt('terr',owner.filter(o=>o==me).length)}/${N}</span><button data-a="market" class="mini mkt" data-help="Preços dos recursos e o que seus territórios produzem">${I('r_caf')}Mercado</button>`;
  $('log').innerHTML=logs.slice(0,2).map(l=>`<div>› ${esc(l)}</div>`).join('')+(logs.length?`<button data-a="log">${I('scroll')}Crônica completa (${logs.length})</button>`:'');
  $('roster').innerHTML=S.map((s,i)=>{const n=owner.filter(o=>o==i).length;
    return`<button data-i="${i}" class="${i==me?'me ':''}${i==sel?'sel ':''}${n?'':'dead'}" title="${s[4]} (${s[1]})">${img(i,s[4])}<span>${s[0]} ${n}</span></button>`}).join('');
  if(marching&&sel>=0){const n=+($('n')?.value||troops[sel]-1);oddsC={};adj[sel].forEach(j=>{if(owner[j]!=me)oddsC[j]=odds(sel,j,n)})}else oddsC={};
  $('roster').hidden=me>=0;handUI();draw();save();help();
  if(over&&!endShown){endShown=true;showEnd()}}
function handUI(){ // mão de cartas: abaixo do mapa; cartas de mapa no mapa, cartas de batalha na batalha
  const el=$('hand');el.hidden=me<0||!!HQ||!!over;if(el.hidden)return;
  const cn=councilNow();$('councilBtn').classList.toggle('new',!!cn&&!cn.done);
  el.classList.toggle('open',handOpen);el.innerHTML=`<div class="hhead" role="button" tabindex="0" aria-expanded="${handOpen}" data-help="Abre ou fecha a gaveta de cartas"><b>Cartas de estratégia</b><span>${I('star')}Comando ${cmd}/${cmdMax()}</span><span>${hand.length}/6 na mão · +1 por turno</span><em>${handOpen?'▼ fechar':'▲ abrir'}</em></div><div class="cards">`+
    (hand.length?hand.map((id,k)=>{const c=CARDS[id],bat=c[1]=='batalha',ok=B?bat&&!B.busy&&cmd>=c[2]:!bat&&!aiShow&&cmd>=c[2]&&(c[3]!='none'||cardOk(id,-1));
      return`<button class="card ${bat?'bat':'map'}${aim==id||B?.aim==id?' on':''}" data-card="${k}" ${ok?'':'disabled'} title="${esc(c[4])}">
        <span class="cc">${c[2]}</span><img src="${cardArt(id)}" alt=""><b>${c[0]}</b><small>${bat?'Batalha':'Mapa'} · ${esc(c[4])}</small></button>`}).join(''):'<p><i>Sem cartas. Você recebe uma por turno; o conselho e o Correio a cavalo dão mais.</i></p>')+'</div>'}
$('hand').addEventListener('click',e=>{if(e.target.closest('.hhead')){handOpen=!handOpen;sfx.sel();return handUI()}const b=e.target.closest('[data-card]');if(b&&!handOpen){handOpen=true;sfx.sel();return handUI()}if(!b||b.disabled||cam||aiShow)return;const id=hand[+b.dataset.card],c=CARDS[id];sfx.sel();
  handOpen=false;if(B){if(c[3]=='foe'){B.aim=id;note('Escolha a unidade inimiga para incendiar');return ui()}playBattleCard(id);return ui()}
  if(c[3]=='none'){playCard(id);regionCheck();return ui()}
  aim=aim==id?null:id;marching=false;rKey='';ui()});
let aim=null,tab='army',undoS=[],summ=null,endArm=0,handOpen=false,bHelp=false; // tab: aba do painel; undoS: pilha para desfazer; summ: resumo do turno; endArm: confirmação do fim do turno
const pushU=()=>{undoS.push(JSON.stringify({troops,g:gold[me],fort,port,moved:[...moved],sel}));if(undoS.length>12)undoS.shift()};
function undo(){const d=JSON.parse(undoS.pop());troops=d.troops;gold[me]=d.g;fort=d.fort;port=d.port;moved=new Set(d.moved);sel=d.sel;linkPorts();note('Ação desfeita')}
$('panel').addEventListener('input',e=>{if(e.target.id=='n'){$('nv').textContent=e.target.value;if(marching){oddsC={};adj[sel].forEach(j=>{if(owner[j]!=me)oddsC[j]=odds(sel,j,+e.target.value)})}}});
const onPanel=e=>{const b=e.target.closest('button');if(!b||cam||aiShow)return;const a=b.dataset.a;sfx.sel();if(b.closest('#cmd'))closeCmd();
  if(a=='batk'||a=='mclose')return ui();
  if(a=='mdip'){tab='dip';return ui()}
  if(a=='bhelp'){bHelp=!bHelp;return ui()}
  if(a=='tab'){tab=b.dataset.t;return ui()}
  if(a=='aimx'){aim=null;rKey='';return ui()}
  if(a=='summx'){summ=null;return ui()}
  if(a=='log')return showLog();
  if(a=='undo'&&undoS.length){undo();return ui()}
  if(a=='next'){const own=owner.map((o,j)=>o==me&&!moved.has(j)&&troops[j]>1?j:-1).filter(j=>j>=0);if(own.length){sel=own[(own.indexOf(sel)+1)%own.length];marching=false;tab='army'}return ui()}
  if(a=='tutskip'){tut=-1;try{localStorage.setItem('tb-tut','1')}catch{}return ui()}
  if(a=='hq'){tutEv('hq');return openHQ()}
  if(a=='room')return enterRoom(b.dataset.r);
  if(a=='hqexit')return closeHQ();
  if(b.dataset.u){const u=B.units[+b.dataset.u];if(!B.busy&&!u.done)B.selU=u;return ui()}
  if(a=='bnext'&&B){const L=alive(B.ps).filter(v=>!v.done);if(L.length){B.selU=L[(L.indexOf(B.selU)+1)%L.length];B.peek=null;sfx.sel()}return ui()}
  if(a=='bend'&&B&&!B.prep&&!B.busy){const n=alive(B.ps).filter(v=>!v.done).length;if(n&&CFG.confirm&&!(B.endArm>Date.now())){B.endArm=Date.now()+3500;setTimeout(()=>B&&ui(),3600);return ui()}B.endArm=0;return bEnd()}
  if(B&&B.prep&&(a=='bstart'||a=='bend'||a=='bauto')){B.prep=false;B.selU=null;if(a=='bauto')return bEnd(true);banner('Rodada 1. É a sua vez.');tutEv('bstart');return ui()}
  if(a=='bend')return bEnd();
  if(a=='bauto')return bEnd(true);
  if(a=='brally'){B.rl[B.ps]=B.round;sfx.win()}
  if(a=='bpow'&&!B.pw[B.ps]&&!B.busy)usePower(B.ps);
  if(a=='bburn'&&B.selU){const br=bridgeNear(B.selU);if(br)burnBridge(B.selU,br);B.selU=B.undo=null}
  if(a=='bwait'&&B.selU){B.selU.done=true;B.selU=B.undo=null}
  if(a=='bcancel'){if(B.undo){const{u,x:ux,y:uy}=B.undo;u.x=ux;u.y=uy;u.moved=u.done=false;B.selU=u;B.undo=null}else B.selU=null}
  if((a=='bpow'||a=='brally')&&B.selU&&!B.selU.done){const su=B.selU;setTimeout(()=>{if(B&&B.selU===su&&!su.done&&!B.busy)battleCmd(su)},B.cut?1750:250)}
  if(B&&!B.busy&&(a=='bwait'||a=='bburn')&&alive(B.ps).every(v=>v.done))return bEnd();
  if(a=='bundo'&&B.undo){const{u,x:ux,y:uy}=B.undo;u.x=ux;u.y=uy;u.moved=u.done=false;B.selU=u;B.undo=null}
  if(a=='start'){me=sel;say(`${S[me][4]} ergue a bandeira em ${S[me][1]}`);scr()}
  if(a=='rec'){tutEv('rec');pushU();const n=+b.dataset.n;troops[sel]+=n;gold[me]-=n*cost(sel)}
  if(a=='dip'){const ok=dipAct(b.dataset.k,+b.dataset.f);ok?sfx.win():sfx.lose();if(ok&&b.dataset.k=='ally')storyAlly(+b.dataset.f)}
  if(a=='enc')return showEnc(+b.dataset.i);
  if(a=='port'){pushU();gold[me]-=5;buildPort(sel);note(`Porto construído em ${S[sel][1]}`)}
  if(a=='fort'){pushU();gold[me]-=fcost();fort[sel]++;note(`Forte nível ${fort[sel]} em ${S[sel][1]}`)}
  if(a=='march'){marching=!marching;if(marching)tutEv('march')}
  if(a=='end'){const idle=owner.reduce((s,o,j)=>s+(o==me&&!moved.has(j)&&troops[j]>1),0);
    if(idle&&CFG.confirm&&!(endArm>Date.now())){endArm=Date.now()+4000;setTimeout(()=>{if(!(endArm>Date.now()))ui()},4100);return ui()} // segundo clique confirma
    endArm=0;tutEv('end');undoS=[];marching=false;aim=null;const own0=owner.map(o=>o==me);endTurn();ui();plaque('ai');
    return playAI(()=>{const done=()=>{summ={turn,inc:income(me),lost:owner.map((o,j)=>own0[j]&&o!=me?j:-1).filter(j=>j>=0),atk:evts.filter(e=>e.was==me).length,danger:owner.reduce((s,o,j)=>s+danger(j),0)}; // resumo do turno
      if(CFG.deleg){const c=councilNow(),k=c.list.findIndex(o=>gold[me]>=o.custo);if(k>=0)followCouncil(k)} // conselho delegado
      ui();plaque('me');if(evtDue){evtDue=false;showEvent()}};if(raids.length){nextRaid();summ=null}else done()})}
  if(a=='new'){reset();return showSetup()}
  ui()};
$('panel').addEventListener('click',onPanel);$('hqBar').addEventListener('click',onPanel);$('act').addEventListener('click',onPanel);$('log').addEventListener('click',onPanel);
$('roster').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||B||HQ||cam)return;sel=+b.dataset.i;marching=false;sfx.sel();
  if(me<0){pickI=sel;return showSetup()} // antes da campanha, a galeria escolhe o líder
  ui()});
cv.addEventListener('click',e=>{if(cam||aiShow)return;if(HQ){const k=hqSpot(e);return k&&enterRoom(k)}if(B)return bClick(e);closeCmd();const i=pick(e);if(i<0)return;sfx.sel();
  if(aim){if(cardOk(aim,i)){pushU();undoS=[];playCard(aim,i);regionCheck()}else note('Esse '+TW1+' não serve para esta carta');aim=null;rKey='';return ui()}
  if(marching&&adj[sel].includes(i)){if(owner[i]==me)pushU();else undoS=[];act(i)}else{if(sel!=i)tab='army';sel=i;marching=false;if(me>=0&&!over&&owner[i]==me){ui();return mapCmd(i)}}
  ui()});
cv.addEventListener('mousemove',e=>{const tip=$('tip');if(!owner)return;if(HQ){tip.hidden=true;HQ.hov=hqSpot(e);return}if(B){const c=bCell(e),k=c.join();if(k!=B.hovK){B.hovK=k;B.hov=c;const tc=$('tcard');if(tc)tc.innerHTML=terrCard();help(cellHelp());
      const t=B.T[c[1]]?.[c[0]];if(t&&!B.busy&&!B.clash){const n=DEFS[t]||0,blk='mwW'.includes(t)||(t=='D'&&B.gate?.hp>0);tip.innerHTML=`<span><b>${TN[t].split(':')[0]}</b> <span class="stars">${'★'.repeat(n)}${'☆'.repeat(3-n)}</span><br><small>${blk?'intransponível':COSTS[t]?'custa 2 passos':'custa 1 passo'}${n?` · +${n==3?30:20}% defesa`:''}</small></span>`;tip.hidden=false}else tip.hidden=true}
    if(!tip.hidden){const r=$('stage').getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;tip.style.left=Math.min(mx+18,r.width-tip.offsetWidth-10)+'px';tip.style.top=Math.max(4,my+20)+'px'}return}const i=pick(e);
  if(i!=hov){hov=i;draw();
    if(i>=0){let oddT='';
      if(marching&&adj[sel].includes(i)&&owner[i]!=me){const n=+($('n')?.value||troops[sel]-1),a=n*(1+trait(sel,'atk')),d=troops[i]*(1+defOf(i))+1;
        const[p,l]=oddsC[i]||odds(sel,i,n);oddT=`<br><b>Chance ~${Math.round(p*100)}%</b> · sobram ~${l}<br><small>estimativa do combate automático</small>`}
      tip.innerHTML=`${img(owner[i])}<span><b>${S[i][1]}</b><br>${S[owner[i]][4]}<br>${troops[i]} tropas${fort[i]?' · forte '+fort[i]:''}${resOf(i)?' · '+RESN[resOf(i)][0]:''}${oddT}</span>`;
      help(`<b>${S[i][1]}</b> · ${owner[i]==me?'seu':S[owner[i]][4]} · ${troops[i]} tropas${marching&&adj[sel].includes(i)?' · clique para marchar':owner[i]==me?' · clique para os comandos':''}`)}else help()}
  tip.hidden=i<0;
  if(i>=0){const r=$('stage').getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    tip.style.left=Math.min(mx+14,r.width-tip.offsetWidth-10)+'px';tip.style.top=Math.max(4,my-70)+'px'}});
cv.addEventListener('mouseleave',()=>{hov=-1;$('tip').hidden=true;if(B){B.hov=null;B.hovK=null}draw();help()});

// ---------- menu de comando ao lado da unidade ou do estado, como nos táticos de console ----------
const cmdEl=$('cmd');
function openCmd(items,cx,cy,first){ /* items: [rótulo, ação, atributos, desabilitado, ajuda] */
  cmdEl.innerHTML=items.map(([l,a,ex='',dis,h=''])=>`<button data-a="${a}" ${ex} ${dis?'disabled':''} data-help="${esc(h)}">${l}</button>`).join('');
  cmdEl.hidden=false;const k=cv.clientWidth/cv.width,w=cmdEl.offsetWidth,h=cmdEl.offsetHeight;
  let L=cx*k+14,T=cy*k-h/2;if(L+w>cv.clientWidth-6)L=cx*k-w-14;
  cmdEl.style.left=Math.max(6,L)+'px';cmdEl.style.top=Math.max(6,Math.min(cv.clientHeight-h-6,T))+'px';
  (cmdEl.querySelector(`[data-a=${first}]:not(:disabled)`)||cmdEl.querySelector('button:not(:disabled)'))?.focus({preventScroll:true})}
function closeCmd(){cmdEl.hidden=true}
function battleCmd(s){if(!B||B.busy||B.prep||!s||s.done||s.hp<=0)return;const tg=alive(1-B.ps).some(f=>inR(s,f)&&seen(f))||gateFor(s),br=B.kind=='travessia'&&bridgeNear(s),pk=S[B.ps?B.was:B.af][5];
  openCmd([['Atacar','batk','',!tg,tg?'Escolha um alvo marcado em vermelho':'Nenhum inimigo ao alcance daqui'],
    ...(br?[['Queimar ponte','bburn','',false,'Destrói a ponte ao lado. Gasta a ação desta unidade']]:[]),
    ...(!B.pw[B.ps]?[[POW[pk][0],'bpow','',false,`Poder do líder, uma vez por batalha: ${POW[pk][1]}`]]:[]),
    ...(!B.rl[B.ps]?[['Brado','brally','',false,'+40% de dano em todas as suas unidades nesta rodada']]:[]),
    ['Esperar','bwait','',false,'Encerra a vez desta unidade'],
    ['Cancelar','bcancel','',false,s.moved&&B.undo?'Volta a unidade para onde estava':'Fecha o menu']],OX+s.x*CS+CS,OY+s.y*CS+CS/2,tg?'batk':'bwait');tutEv('bcmd')}
function mapCmd(i){tutEv('menu');const c=cost(i),g=gold[me],can=!moved.has(i)&&troops[i]>1,[px0,py0]=proj(...px(i));
  openCmd([['Marchar / Atacar','march','',!can,can?'Escolha um vizinho para onde as tropas vão':'Estas tropas já marcharam, ou só resta a guarnição'],
    [`Recrutar +1 · ${c} ouro`,'rec','data-n="1"',g<c,`Uma tropa a mais em ${S[i][1]}`],
    [`Recrutar máximo · +${Math.floor(g/c)}`,'rec',`data-n="${Math.floor(g/c)}"`,g<c,'Gasta todo o ouro em tropas aqui'],
    [`Fortificar · ${fcost()} ouro`,'fort','',g<fcost()||fort[i]>1,'+20% de defesa por nível, até o nível 2'],
    ...(COAST.includes(i)&&!port[i]?[['Porto · 5 ouro','port','',g<5,'+1 de renda e rotas pelo mar']]:[]),
    ['Diplomacia','mdip','',false,'Pactos, alianças e tributos com os vizinhos'],
    ['Fechar','mclose','',false,'']],px0,py0)}
cmdEl.addEventListener('click',onPanel);
document.addEventListener('keydown',e=>{if(cmdEl.hidden)return;const bs=[...cmdEl.querySelectorAll('button:not(:disabled)')],i=bs.indexOf(document.activeElement);
  if(e.key=='ArrowDown'||e.key=='ArrowUp'){e.preventDefault();e.stopImmediatePropagation();bs[(i+(e.key=='ArrowDown'?1:bs.length-1))%bs.length]?.focus();sfx.tick()}
  else if(e.key=='Escape'){e.preventDefault();e.stopImmediatePropagation();const c=cmdEl.querySelector('[data-a=bcancel],[data-a=mclose]');c?c.click():closeCmd()}
  else if(e.key=='Enter')e.stopImmediatePropagation()},true);

// ---------- painel de batalha: ficha da unidade e do terreno ----------
function statCard(u){const f=u.side?B.was:B.af,mine=u.side==B.ps,weakT=Object.keys(BEATS).find(k=>BEATS[k]==CL(u.type)),strT=BEATS[CL(u.type)];
  return`<div class="stat"><img class="sp" src="${icon(u.type,f,mine,u.ld)}" alt=""><div class="sd"><b>${nmOf(u)}${u.ld?' · Comandante':''}</b>
    <small>${mine?'Sua tropa':'Tropa inimiga'}${u.lv?` · nível ${u.lv}`:''}${u.done&&mine?' · já agiu':''}</small>${u.j>=0&&perk[stOf(u)+'-'+u.j]?.length?`<div class="chips">${perk[stOf(u)+'-'+u.j].map(id=>{const q=PERKS.find(z=>z[0]==id);return`<span data-help="${q[2]}">${q[1]}</span>`}).join('')}</div>`:''}
    <div class="hp ${mine?'me':'foe'}" data-help="Vida: cada ponto é uma tropa"><i style="width:${Math.round(u.hp/u.max*100)}%"></i><span>${u.hp}/${u.max}</span></div>
    <div class="par"><span data-help="Casas que anda por vez">${I('boot')}${mvOf(u)}</span><span data-help="Alcance do ataque, em casas">${I('aim')}${rgOf(u)}</span>${strT?`<span data-help="${esc(`Forte: causa +50% de dano em ${UT[strT][0]}`)}">▲<img src="${icon(strT,f,mine,false)}" alt="${UT[strT][0]}"></span>`:''}${weakT?`<span data-help="${esc(`Fraca: leva +50% de dano de ${UT[weakT][0]}`)}">▼<img src="${icon(weakT,f,mine,false)}" alt="${UT[weakT][0]}"></span>`:''}</div></div></div>${u.el?`<p class="elite">${I('star')}<b>${u.el[0]}</b> · ${elTxt(u.el)}</p>`:''}`}
const DEFS={f:3,v:3,h:2},COSTS={h:2,a:2};
function tileThumb(t,[cx,cy]){B.th=B.th||{};if(B.th[t])return B.th[t];const[c,g]=mk(CS,CS);g.drawImage(B.bg,cx*CS,cy*CS,CS,CS,0,0,CS,CS);
  if(t=='f'){const U=CS/18,q=(a,bb,w,hh,col)=>{g.fillStyle=col;g.fillRect(Math.round(a*U),Math.round(bb*U),Math.ceil(w*U),Math.ceil(hh*U))};[[1,0],[9,2],[4,8]].forEach(([a,bb],k)=>tree(q,B.bio.tree,a,bb,k))}
  return B.th[t]=c.toDataURL()}
function terrCard(){if(!B)return'';const c=B.hov&&B.T[B.hov[1]]?.[B.hov[0]]?B.hov:B.selU?[B.selU.x,B.selU.y]:null;if(!c)return'';
  const t=B.T[c[1]][c[0]],n=DEFS[t]||0,blk='mwW'.includes(t)||(t=='D'&&B.gate?.hp>0),nome=TN[t].split(':')[0];
  return`<div class="terr"><img src="${tileThumb(t,c)}" alt=""><div><b>${nome}</b><span class="stars" data-help="Defesa do terreno">${'★'.repeat(n)}${'☆'.repeat(3-n)}</span>
    <small>${blk?'Intransponível':COSTS[t]?'Custa 2 passos':'Custa 1 passo'}${n?` · +${n==3?30:20}% defesa`:''}${t=='h'?' · tiro +1':''}${t=='v'?' · cura 2 por rodada':''}${t=='b'?' · pode ser queimada':''}${t=='P'?' · o atacante vence se ficar nela':''}</small></div></div>`}
function cellHelp(){const[hx,hy]=B.hov||[];const t=B.T[hy]?.[hx];if(!t)return'';const u=B.units.find(v=>v.hp>0&&v.x==hx&&v.y==hy&&seen(v)),s=B.selU;
  let h=`<b>${TN[t].split(':')[0]}</b>${TN[t].includes(':')?':'+TN[t].split(':').slice(1).join(':'):''}`;
  if(u)h+=` · ${u.side==B.ps?'sua':'inimiga'}: ${nmOf(u)} ${u.hp}/${u.max}`;
  if(s&&u&&u.side!=B.ps&&inR(s,u))h+=` · seu ataque tira ~${Math.min(u.hp,Math.max(1,Math.round(est(s,u))))}`;
  else if(u&&u.side!=B.ps)h+=' · clique para ver até onde ele vai';
  return h}

// ---------- barra de ajuda no pé do palco ----------
const helpEl=$('helpT');let helpHover=null;
function helpDefault(){if(HQ)return'Clique numa sala do quartel.';
  if(B?.bad&&B.bad.until+2200>Date.now())return'<b>Não dá:</b> '+B.bad.why;
  if(B?.prep)return'Preparação: clique numa unidade sua e depois numa casa azul, ou em outra unidade para trocar. Depois, Começar batalha.';
  if(B){const s=B.selU;return B.busy?'Aguarde: o inimigo está agindo.':B.aim?'Clique numa unidade inimiga para o ataque de fogo. Esc cancela.':s?(s.moved?'Clique num alvo vermelho, ou na própria unidade para o menu.':'Mova para uma casa hachurada ou ataque um alvo vermelho. Clique de novo na unidade para o menu.'):'Escolha uma unidade sua. Clique num inimigo para ver até onde ele vai.'}
  if(me<0)return'Escolha um líder no mapa ou na galeria abaixo.';if(over)return'Partida encerrada.';
  if(aim)return`Carta ${CARDS[aim][0]}: clique num ${TW1} destacado. Esc cancela.`;
  if(marching)return'Clique num vizinho para marchar. O número em cada rota é a chance de vitória. Esc cancela.';
  return`Clique num ${TW1} seu para abrir os comandos. Quando terminar, Fim do turno.`}
function help(t){if(helpEl)helpEl.innerHTML=t||helpDefault()}
document.addEventListener('mouseover',e=>{const el=e.target.closest?.('[data-help]');if(el&&el.dataset.help){helpHover=el;help(esc(el.dataset.help))}});
document.addEventListener('mouseout',e=>{if(helpHover&&!helpHover.contains(e.relatedTarget)){helpHover=null;help()}});
document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-help]');if(el&&el.dataset.help)help(esc(el.dataset.help))});

// ---------- placa de turno ----------
function plaque(kind){const el=$('plaque');if(!el||me<0)return;
  el.className=kind;el.innerHTML=kind=='ai'?'<div class="pl"><em>Vez do inimigo</em></div>':`<div class="pl"><em>Turno</em><b>${turn}</b><span>${I(turn%4==3?'moon':'sun')}${TOD[turn%4][0]}</span></div>${summ?`<p>Renda +${summ.inc} ouro · ${summ.lost.length?'perdeu '+summ.lost.map(i=>S[i][0]).join(', '):'nenhum '+TW1+' perdido'}${summ.atk?` · ${summ.atk} ataque${summ.atk>1?'s':''} contra você`:''}</p>`:''}`;
  el.hidden=false;el.style.animation='none';void el.offsetWidth;el.style.animation='';clearTimeout(plaque.t);plaque.t=setTimeout(()=>el.hidden=true,kind=='ai'?1300:2300)}
$('plaque').addEventListener('click',()=>$('plaque').hidden=true);
[['councilBtn','scroll','Conselho','Conselho: conselheiros sugerem ações para este turno (V)'],['armyBtn','swords','Exército','Visão geral de todos os seus territórios (X)'],['campBtn','flag','Campanha','Objetivos e andamento da campanha (C)'],['menuBtn','menu','Menu','Pausa, opções e salvamentos (Esc)']]
  .forEach(([id,ic,t,h])=>{$(id).innerHTML=I(ic)+'<span>'+t+'</span>';$(id).dataset.help=h});
// toque: segurar o dedo mostra a informação (como passar o mouse) sem agir
let lpT=null,lpOn=false;
cv.addEventListener('touchstart',e=>{const t=e.touches[0];lpOn=false;clearTimeout(lpT);lpT=setTimeout(()=>{lpOn=true;cv.dispatchEvent(new MouseEvent('mousemove',{clientX:t.clientX,clientY:t.clientY}))},450)},{passive:true});
cv.addEventListener('touchmove',()=>clearTimeout(lpT),{passive:true});
cv.addEventListener('touchend',e=>{clearTimeout(lpT);if(lpOn){e.preventDefault();lpOn=false}},{passive:false});

// ---------- mercado: preço de cada recurso, tendência e o que você produz ----------
function showMarket(){scr(`<h2>Mercado</h2><p class="c">Cada ${TW1} produz um recurso. O preço muda a cada turno. Com três ou mais do mesmo recurso você tem monopólio (+1 ouro em cada); porto rende 25% a mais.</p>`+
  Object.entries(RESN).map(([k,[n]])=>{const mine=owner.filter((o,i)=>o==me&&resOf(i)==k).length,tot=S.filter((_,i)=>resOf(i)==k).length,tr=price[k]-(priceOld[k]??price[k]);if(!tot)return'';
    return`<div class="mk">${I('r_'+k)}<b>${n}</b><span class="pr ${tr>.005?'up':tr<-.005?'dn':''}">${price[k].toFixed(2)} ${tr>.005?'▲':tr<-.005?'▼':'·'}</span><span>${mine}/${tot} seus${mine>=3?' · monopólio':''}</span></div>`}).join('')+
  '<button data-s="close" class="end">Fechar</button>')}
$('bar').addEventListener('click',e=>{if(e.target.closest('[data-a=market]')){sfx.sel();showMarket()}});
