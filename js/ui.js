// painel lateral, botões e cliques do mapa
function ui(){
  fit();tutBox();document.body.classList.toggle('battle',!!B);
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
    else if(B.goals&&!B.taken){const held=B.goals.filter(([gx,gy])=>B.obj=='vilas'?B.vil.get(gx+','+gy)===0:B.units.some(u=>u.side==0&&u.hp>0&&u.x==gx&&u.y==gy)).length, /* objetivo extra do mapa */
      ld0=B.units.find(u=>u.side==0&&u.ld),dg=B.obj=='saida'?Math.abs(ld0.x-B.goals[0][0])+Math.abs(ld0.y-B.goals[0][1]):0;
      obj=OBJ[B.obj][B.ps?2:1]+(B.ps?', até a última rodada':', ou derrube o comandante');prog=B.obj=='saida'?1-dg/GW:held/B.goals.length;if(B.ps)prog=1-prog;
      ptxt=B.obj=='saida'?`Comandante a ${dg} casas da saída · rodada ${Math.min(B.round,MAXR)}/${MAXR}`:`${B.obj=='vilas'?'Vilas':'Ponte'} ${held}/${B.goals.length} com o atacante · rodada ${Math.min(B.round,MAXR)}/${MAXR}`}
    else if(B.ps){obj='resista até a última rodada';prog=Math.min(1,(B.round-1)/MAXR);ptxt=`Rodada ${Math.min(B.round,MAXR)}/${MAXR} · seu comandante ${myld.hp}/${myld.max}`}
    else{obj=`derrube o comandante de ${S[ef][4]}`;prog=1-Math.max(0,eld.hp)/eld.max;ptxt=`Comandante inimigo ${Math.max(0,eld.hp)}/${eld.max} · rodada ${Math.min(B.round,MAXR)}/${MAXR}`}
    const ctx=B.prep?'<div class="summ prep"><b>Preparação</b><p>Posicione suas tropas nas casas azuis antes da primeira rodada. O inimigo já está em posição.</p><button data-a="bstart" class="end">Começar batalha ▶</button></div>'
      :s?statCard(s)+`<div class="row"><button data-a="bwait" ${s.done||B.busy?'disabled':''} data-help="Encerra a vez desta unidade">Esperar</button><button data-a="bcancel" ${B.busy?'disabled':''} data-help="${s.moved&&B.undo?'Volta a unidade para onde estava':'Solta a unidade'}">${s.moved&&B.undo?'Desfazer movimento':'Soltar'}</button></div>`
      :pk?statCard(pk)+'<p class="hint">Laranja: até onde ele anda. Tracejado: onde ele ataca. Escolha uma unidade sua para ver a prévia do seu ataque.</p>'
      :`<div class="forces"><div><span>Suas tropas</span><b>${total(B.ps)}</b></div><div class="fb"><i style="width:${Math.round(total(B.ps)/Math.max(1,total(0)+total(1))*100)}%"></i></div><div><span>Inimigo</span><b>${B.kind=='emboscada'?'?':total(1-B.ps)}</b></div></div>`;
    $('panel').innerHTML=`<h2>${B.ps?'Defesa':'Batalha'} de ${S[B.to][1]}</h2>
      <div class="objbar"><p><b>Objetivo:</b> ${obj}.</p><div class="prog"><i style="width:${Math.round(prog*100)}%"></i></div><small>${ptxt}</small></div>
      <div class="chips"><span data-help="${esc(KIND[B.kind][1])}">${KIND[B.kind][0]}</span><span>${B.bio.nome}</span>${B.obj?`<span data-help="${esc(OBJ[B.obj][B.ps?2:1])}">★ ${OBJ[B.obj][0]}</span>`:''}${[...B.vil.values()].some(v=>v==B.ps)?`<span data-help="Cada vila sua no fim da batalha rende 2 ouro">${I('coin')}Vilas +${2*[...B.vil.values()].filter(v=>v==B.ps).length}</span>`:''}${[...B.qt.values()].some(v=>v==B.ps)?'<span data-help="Seu quartel recruta 1 regimento a cada 2 rodadas">Quartel</span>':''}${B.wx=='rain'?'<span data-help="Chuva: tiro com 1 casa a menos de alcance">Chuva</span>':B.wx=='dry'?'<span data-help="Seca: infantaria anda 1 casa a menos">Seca</span>':''}${pwOn(B.ps,B.pw[B.ps]?.k)?`<span>${POW[B.pw[B.ps].k][0]} ativo</span>`:''}${B.rl[B.ps]==B.round?'<span>Brado ativo</span>':''}${B.amb==B.round?'<span>Emboscada</span>':''}${B.chg==B.round?'<span>Carga</span>':''}</div>
      ${B.aim?'<p class="warn">Ataque de fogo: clique numa unidade inimiga.</p>':''}
      <div class="ctx">${ctx}</div>
      <div id="tcard">${terrCard()}</div>
      <div class="grp"><span class="lbl">Comandos</span><div class="row"><button data-a="bnext" ${left&&!B.busy&&!B.prep?'':'disabled'} data-help="Escolhe a próxima unidade que ainda pode agir">Próxima (${left})</button><button data-a="brally" ${B.rl[B.ps]||B.busy?'disabled':''} data-help="Brado do comandante: +40% de dano em todas as suas unidades nesta rodada. Uma vez por batalha.">Brado</button><button data-a="bpow" ${B.pw[B.ps]||B.busy?'disabled':''} data-help="${esc(`Poder de ${S[pf][4]}, uma vez por batalha: ${POW[pkey][1]}`)}">${I('star')}${POW[pkey][0]}</button></div></div>
      <button data-a="bend" class="end${armed?' danger':''}" ${dis}>${armed?`Encerrar mesmo assim? ${left} ainda pode${left>1?'m':''} agir`:'Encerrar rodada ▶'}</button>
      <div class="minor"><button data-a="bauto" class="mini" ${dis} data-help="A IA joga por você até o fim da batalha">Automático</button><button data-a="bhelp" class="mini ${bHelp?'on':''}" data-help="Vantagens, terreno e o que cada tipo de batalha muda">? Regras</button></div>
      ${bHelp?`<div class="helpbox"><p>${KIND[B.kind][1]}</p><div class="tri">${ic('inf')}▶${ic('cav')}▶${ic('ati')}▶${ic('inf')}</div><p class="c">A seta aponta quem leva +50% de dano.</p><p>Mata e vila: +30% de defesa; vila cura 2 por rodada e rende 2 ouro. Morro baixo: +20% de defesa e tiro +1. Serra, água e muralha bloqueiam.</p>${B.rl[1-B.ps]?'<p><i>O inimigo já usou o brado.</i></p>':''}${B.pw[1-B.ps]?`<p><i>O inimigo usou ${POW[B.pw[1-B.ps].k][0]}.</i></p>`:''}</div>`:''}`;
    $('roster').hidden=true;handUI();help();return}
  let h='',act='';
  if(over)h+=`<h2>${over}</h2><button data-a="new">Novo jogo</button>`;
  else if(me<0)h+=`<p>Escolha no mapa ou na galeria o líder da sua partida. Cada ${TW1} tem vantagem própria.</p>`;
  const kpi=(n,t,hlp,cls='')=>`<div class="kpi ${cls}" data-help="${esc(hlp)}"><b>${n}</b><span>${t}</span></div>`;
  if(sel<0&&me>=0&&!over){const mine=owner.map((o,j)=>o==me?j:-1).filter(j=>j>=0),dg=mine.filter(danger), /* nada escolhido: visão geral do império */
      front=[...new Set(mine.flatMap(j=>adj[j].filter(k=>owner[k]!=me)))].sort((p,q)=>troops[q]-troops[p]).slice(0,6),
      res=Object.entries(mine.reduce((m,j)=>{const r=resOf(j);if(r)m[r]=(m[r]||0)+1;return m},{})).sort((a,b)=>b[1]-a[1]);
    h+=`<div class="who sm">${img(me,S[me][4])}<div><h2>Império de ${S[me][4]}</h2><p>${S[me][7]}: ${traitTxt(me)}</p></div></div>
      <div class="kpis">${kpi(mine.length+'/'+N,TW,`${TW[0].toUpperCase()+TW.slice(1)} sob o seu domínio`)}${kpi(mine.reduce((a,j)=>a+troops[j],0),'tropas','Soma das tropas em todos os seus territórios')}${kpi('+'+income(me),'renda','Ouro que entra por turno')}</div>
      ${dg.length?`<div class="box threat"><b>${I('warn')}Em perigo (${dg.length})</b><p class="hint">Um vizinho tem tropas para tomar estes ${TW}. Clique para ver.</p><p class="foes">${dg.map(j=>`<button class="thr hot" data-a="pick" data-j="${j}">${S[j][0]} <b>${troops[j]}</b></button>`).join('')}</p></div>`:''}
      ${front.length?`<div class="box"><b>Fronteiras mais fortes</b><p class="foes">${front.map(j=>`<button class="thr" data-a="thr" data-j="${j}" data-help="${esc(`${S[j][1]} · ${S[owner[j]][4]} · ${relTxt(owner[j])}`)}">${S[j][0]} <b>${troops[j]}</b></button>`).join('')}</p></div>`:''}
      ${res.length?`<div class="box"><b>Economia</b><div class="chips">${res.map(([r,n])=>`<span data-help="${esc(`${RESN[r][0]}: preço ${price[r].toFixed(2)}${n>=3?' · monopólio: +1 ouro em cada':''}`)}">${I('r_'+r)}${RESN[r][0]} ×${n}${n>=3?' ★':''}</span>`).join('')}</div></div>`:''}
      <p class="hint">Clique num ${TW1} no mapa para gerenciá-lo.</p>`}
  if(sel>=0){const i=sel,f=owner[i],mine=f==me&&!over,E=ELITE[S[i][0]],vet=xp[i].filter(v=>lvl(v)).length,r=resOf(i);
    h+=`${me>=0&&!over?'<button data-a="emp" class="mini back" data-help="Volta para a visão geral do império">◂ Império</button>':''}
      <div class="who sm">${img(i,S[i][4])}<div><h2>${S[i][1]}</h2><p><b>${S[i][4]}</b> · ${f==me?'seu domínio':me<0?S[i][0]:'de '+S[f][4]}</p><p>${S[i][7]}: ${traitTxt(i)}</p><button data-a="enc" data-i="${i}" class="mini" data-help="Quem foi ${esc(S[i][4])} de verdade, e por que tem essa vantagem">Ficha histórica</button></div></div>
      <div class="kpis">${kpi(cnt('t'+i,troops[i]),'tropas','Tropas paradas neste '+TW1)}${kpi('+'+inc(i),'renda','Ouro por turno vindo daqui, já com o recurso')}${kpi('+'+Math.round(defOf(i)*100)+'%','defesa','Bônus de defesa: líder, forte e terreno',danger(i)?'hot':'')}</div>
      <div class="chips tchips"><span>${BIO[BOF[i]].nome}</span>${r?`<span data-help="${esc(`${RESN[r][0]}: preço ${price[r].toFixed(2)}${mono(owner[i],r)?' · monopólio +1':''}${port[i]?' · porto +25%':''}`)}">${I('r_'+r)}${RESN[r][0]} +${resInc(i)}</span>`:''}<span>${gl('recruta','Recruta '+cost(i)+' ouro')}</span>${port[i]?`<span>${gl('porto',I('anchor')+'Porto')}</span>`:''}${fort[i]?`<span>${gl('forte','Forte nível '+fort[i])}</span>`:''}</div>
      ${E||vet?`<div class="box spec"><b>Especiais</b>${E?`<p data-help="${esc(`Tropa de elite de ${S[i][1]}: substitui ${UT[E[1]][0]} na batalha`)}">★ <b>${E[0]}</b> · ${elTxt(E)}</p>`:''}${vet?`<p data-help="Regimentos sobem de nível com experiência em batalha: +8% de dano por nível">${gl('xp','Veteranos')}: ${vet} regimento${vet>1?'s':''} com nível</p>`:''}</div>`:''}`;
    if(me<0)h+=`<button data-a="start">Começar com ${S[i][0]}</button>`;
    else if(mine&&marching)h+=`<div class="box"><b>Marchar de ${S[i][1]}</b><div class="row"><label for="n">Enviar</label><input type="range" id="n" min="1" max="${Math.max(1,troops[i]-1)}" value="${Math.min(+($('n')?.value||troops[i]-1),troops[i]-1)}"><b id="nv">${Math.min(+($('n')?.value||troops[i]-1),troops[i]-1)}</b></div><p class="hint">Clique num vizinho. O número em cada rota é a chance de vitória. Esc cancela.</p></div>`;
    if(me>=0&&!over){const foes=adj[i].filter(j=>owner[j]!=f).sort((p,q)=>troops[q]-troops[p]).slice(0,6),hotJ=j=>f==me&&!(pact[owner[j]]>turn)&&troops[j]-1>troops[i]*(1+defOf(i))*1.2+1; /* mesmo critério de "em perigo" */
      if(foes.length)h+=`<div class="box${foes.some(hotJ)?' threat':''}"><b>${f==me?'Ameaças na fronteira':'Vizinhos'}</b>${f==me?`<p class="hint">${foes.some(hotJ)?`Vermelho: tem tropas para tomar ${S[i][1]}. Por isso o ${TW1} conta como em perigo.`:'Nenhum vizinho consegue tomar este '+TW1+' agora.'} Clique para ver no mapa.</p>`:''}
        <p class="foes">${foes.map(j=>`<button class="thr${hotJ(j)?' hot':''}" data-a="thr" data-j="${j}" data-help="${esc(`${S[j][1]} · ${S[owner[j]][4]}${owner[j]!=me?' · '+relTxt(owner[j]):''}`)}">${S[j][0]} <b>${troops[j]}</b></button>`).join('')}</p></div>`;
      if(f!=me)h+=`<p class="hint">Relação com ${S[f][4]}: ${relTxt(f)}. Clique no ${TW1} para ver as opções.</p>`;
      else if(!marching){const c=cost(i),g=gold[me],can=!moved.has(i)&&troops[i]>1; /* ações do estado: as mesmas do menu no mapa */
        h+=`<div class="grp"><span class="lbl">Ações do ${TW1}</span><div class="acts4"><button data-a="rec" data-n="1" ${g<c?'disabled':''} data-help="+1 tropa por ${c} ouro (R)">Recrutar</button><button data-a="fort" ${g<fcost()||fort[i]>1?'disabled':''} data-help="+20% de defesa por nível, ${fcost()} ouro (F)">Fortificar</button><button data-a="march" ${can?'':'disabled'} data-help="${can?'Escolha um vizinho para marchar (M)':'Já marcharam daqui, ou só resta a guarnição'}">Marchar</button><button data-a="mdip" data-help="Pactos, alianças e tributos">Diplomacia</button></div></div>`}}}
  if(me>=0&&!over){const idle=owner.reduce((a,o,j)=>a+(o==me&&!moved.has(j)&&troops[j]>1),0),armed=endArm>Date.now();
    act+=`<div class="row"><button data-a="next" ${idle?'':'disabled'} data-help="Próximo ${TW1} que ainda pode marchar (N)">▶ Próximo ${TW1} (${idle})</button><button data-a="undo" class="${undoS.length?'':'off'}" aria-disabled="${!undoS.length}" data-help="${undoS.length?'Desfaz a última ação (Z)':'Nada para desfazer: recrutar, fortificar e mover entre seus '+TW+' podem ser desfeitos; ataques não'}">↶ Desfazer</button><button data-a="hq" data-help="Quartel-General: doutrinas, generais, tesouro e diplomacia (Q)">${I('house')}Quartel</button></div>
      <button data-a="end" class="end${armed?' danger':''}">${armed?`Encerrar mesmo assim? ${idle} ${idle>1?TW:TW1} ainda pode${idle>1?'m':''} marchar`:'Fim do turno ▶'}</button>`}
  if(aim)h=`<div class="summ"><b>${CARDS[aim][0]}</b><p>${CARDS[aim][4]}</p><p><i>Clique num ${TW1} válido (destacado no mapa). Esc cancela.</i></p><button data-a="aimx">Cancelar carta</button></div>`+h;
  $('panel').innerHTML=h;$('act').innerHTML=act;$('act').hidden=!act;
  $('bar').innerHTML=me<0?`<span>${TH.nome} · ${TH.ano}</span>`:`<span>${I(turn%4==3?'moon':'sun')}Turno ${turn} · ${TOD[turn%4][0]}</span><span data-help="Ouro em caixa e a renda por turno">${I('coin')}Ouro ${cnt('gold',gold[me])} (+${income(me)})</span><span data-help="Comando: gasto para jogar cartas; volta todo turno">${I('star')}Comando ${cmd}/${cmdMax()}</span>${SCN[scn].sub?.[me]?`<span>${gl('sub','Corte +'+SCN[scn].sub[me])}</span>`:''}<span>${I('flag')}${TW[0].toUpperCase()+TW.slice(1)} ${cnt('terr',owner.filter(o=>o==me).length)}/${N}</span><button data-a="market" class="mini mkt" data-help="Preços dos recursos e o que seus territórios produzem">${I('r_caf')}Mercado</button>`;
  {const nw=Math.max(0,logs.length-logSeen);$('log').innerHTML=logs.length?`<button data-a="log" class="mini" data-help="${esc('Último: '+logs[0])}">${I('scroll')}Crônica${nw?` <i class="badge">${nw}</i>`:''}</button>`:''} // crônica num botão; o número mostra o que é novo
  $('roster').innerHTML=S.map((s,i)=>{const n=owner.filter(o=>o==i).length;
    return`<button data-i="${i}" class="${i==me?'me ':''}${i==sel?'sel ':''}${n?'':'dead'}" title="${s[4]} (${s[1]})">${img(i,s[4])}<span>${s[0]} ${n}</span></button>`}).join('');
  if(marching&&sel>=0){const n=+($('n')?.value||troops[sel]-1);oddsC={};adj[sel].forEach(j=>{if(owner[j]!=me)oddsC[j]=odds(sel,j,n)})}else oddsC={};
  $('roster').hidden=true;handUI();draw();save();help();
  if(over&&!endShown){endShown=true;showEnd()}}
function handUI(){ // mão de cartas: abaixo do mapa; cartas de mapa no mapa; na batalha, só as de batalha, em leque sobre o campo
  const el=$('hand'),st=$('stage');el.hidden=me<0||!!HQ||!!over||(turn<2&&tut>=0); /* no primeiro turno do tutorial, sem cartas */
  if(B&&el.parentNode!==st)st.appendChild(el);else if(!B&&el.parentNode===st)$('help').after(el);el.classList.toggle('fan',!!B);
  if(B){const bc=hand.map((id,k)=>[id,k]).filter(([id])=>CARDS[id][1]=='batalha');el.hidden=el.hidden||!bc.length||B.prep;if(el.hidden)return;
    el.innerHTML='<div class="cards">'+bc.map(([id,k],i)=>{const c=CARDS[id],ok=!B.busy&&cmd>=c[2],r=(i-(bc.length-1)/2);
      return`<button class="card bat${B.aim==id?' on':''}" data-card="${k}" ${ok?'':'disabled'} style="--r:${r*7}deg;--y:${Math.abs(r)*8}px" data-help="${esc(c[0]+': '+c[4]+(c[3]=='foe'?' Arraste até a unidade inimiga.':' Arraste até o campo ou clique.'))}">
        <span class="cc">${c[2]}</span><img src="${cardArt(id)}" alt=""><b>${c[0]}</b><small>${esc(c[4])}</small></button>`}).join('')+'</div>';return}
  if(el.hidden)return;
  const cn=councilNow();$('councilBtn').classList.toggle('new',!!cn&&!cn.done);
  el.classList.toggle('open',handOpen);el.innerHTML=`<div class="hhead" role="button" tabindex="0" aria-expanded="${handOpen}" data-help="Abre ou fecha a gaveta de cartas"><b>Cartas de estratégia</b><span>${I('star')}Comando ${cmd}/${cmdMax()}</span><span>${hand.length}/6 na mão · +1 por turno</span><em>${handOpen?'▼ fechar':'▲ abrir'}</em></div><div class="cards">`+
    (hand.length?hand.map((id,k)=>{const c=CARDS[id],bat=c[1]=='batalha',ok=B?bat&&!B.busy&&cmd>=c[2]:!bat&&!aiShow&&cmd>=c[2]&&(c[3]!='none'||cardOk(id,-1));
      return`<button class="card ${bat?'bat':'map'}${aim==id||B?.aim==id?' on':''}" data-card="${k}" ${ok?'':'disabled'} title="${esc(c[4])}">
        <span class="cc">${c[2]}</span><img src="${cardArt(id)}" alt=""><b>${c[0]}</b><small>${bat?'Batalha':'Mapa'} · ${esc(c[4])}</small></button>`}).join(''):'<p><i>Sem cartas. Você recebe uma por turno; o conselho e o Correio a cavalo dão mais.</i></p>')+'</div>'}
$('hand').addEventListener('click',e=>{if(e.target.closest('.hhead')){handOpen=!handOpen;sfx.sel();return handUI()}const b=e.target.closest('[data-card]');if(b&&!handOpen&&!B){handOpen=true;sfx.sel();return handUI()}if(!b||b.disabled||cam||aiShow)return;const id=hand[+b.dataset.card],c=CARDS[id];sfx.sel();
  if(B&&cardEat>Date.now())return;handOpen=false;if(B){if(c[3]=='foe'){B.aim=id;note('Escolha a unidade inimiga para incendiar');return ui()}playBattleCard(id);return ui()}
  if(c[3]=='none'){playCard(id);regionCheck();return ui()}
  aim=aim==id?null:id;marching=false;rKey='';ui()});
let logSeen=0,aim=null,tab='army',undoS=[],summ=null,endArm=0,handOpen=false,bHelp=false; // tab: aba do painel; undoS: pilha para desfazer; summ: resumo do turno; endArm: confirmação do fim do turno
const pushU=()=>{undoS.push(JSON.stringify({troops,g:gold[me],fort,port,moved:[...moved],sel}));if(undoS.length>12)undoS.shift()};
function undo(){const d=JSON.parse(undoS.pop());troops=d.troops;gold[me]=d.g;fort=d.fort;port=d.port;moved=new Set(d.moved);sel=d.sel;linkPorts();note('Ação desfeita')}
$('panel').addEventListener('input',e=>{if(e.target.id=='n'){$('nv').textContent=e.target.value;if(marching){oddsC={};adj[sel].forEach(j=>{if(owner[j]!=me)oddsC[j]=odds(sel,j,+e.target.value)})}}});
const onPanel=e=>{const b=e.target.closest('button');if(!b||cam||aiShow)return;const a=b.dataset.a;sfx.sel();if(b.closest('#cmd'))closeCmd();
  if(a=='batk'||a=='mclose')return ui();
  if(a=='mtgt'){const t=sel,src=adj[t].filter(j=>owner[j]==me&&!moved.has(j)&&troops[j]>1).sort((p,q)=>troops[q]-troops[p])[0];if(src!=null){sel=src;marching=true;hov=t;tutEv('march')}return ui()}
  if(a=='mdip')return showDip(b.dataset.f!=null?+b.dataset.f:-1);
  if(a=='bhelp'){bHelp=!bHelp;return ui()}
  if(a=='tab'){tab=b.dataset.t;return ui()}
  if(a=='aimx'){aim=null;rKey='';return ui()}
  if(a=='summx'){summ=null;return ui()}
  if(a=='log')return showLog();
  if(a=='undo'){if(undoS.length){undo();return ui()}return note('Nada para desfazer neste turno')}
  if(a=='emp'){sel=-1;marching=false;return ui()}
  if(a=='pick'){sel=+b.dataset.j;marching=false;return ui()}
  if(a=='thr'){const j=+b.dataset.j;hov=j;draw();help(`<b>${S[j][1]}</b> · ${S[owner[j]][4]} · ${troops[j]} tropas`);clearTimeout(onPanel.ht);onPanel.ht=setTimeout(()=>{if(hov==j){hov=-1;draw()}},2600);return} // destaca o vizinho no mapa
  if(a=='next'){const own=owner.map((o,j)=>o==me&&!moved.has(j)&&troops[j]>1?j:-1).filter(j=>j>=0);if(own.length){sel=own[(own.indexOf(sel)+1)%own.length];marching=false;tab='army'}return ui()}
  if(a=='tutskip'){tut=-1;try{localStorage.setItem('tb-tut','1')}catch{}return ui()}
  if(a=='hq'){tutEv('hq');return openHQ()}
  if(a=='room')return enterRoom(b.dataset.r);
  if(a=='hqexit')return closeHQ();
  if(b.dataset.u){const u=B.units[+b.dataset.u];if(!B.busy&&!u.done)B.selU=u;return ui()}
  if(a=='bnext'&&B){const L=alive(B.ps).filter(v=>!v.done);if(L.length){B.selU=L[(L.indexOf(B.selU)+1)%L.length];B.peek=null;sfx.sel();camFrame(B.selU)}return ui()}
  if(a=='bend'&&B&&!B.prep&&!B.busy){const n=alive(B.ps).filter(v=>!v.done).length;if(n&&CFG.confirm&&!(B.endArm>Date.now())){B.endArm=Date.now()+3500;setTimeout(()=>B&&ui(),3600);return ui()}B.endArm=0;return bEnd()}
  if(B&&B.prep&&(a=='bstart'||a=='bend'||a=='bauto')){B.prep=false;B.selU=null;if(a=='bauto')return bEnd(true);phase('Sua fase',`Rodada 1 de ${MAXR}`,true);tutEv('bstart');return ui()}
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
cv.addEventListener('click',e=>{if(cam||aiShow||B&&dragEat>Date.now())return;if(HQ){const k=hqSpot(e);return k&&enterRoom(k)}if(B)return bClick(e);closeCmd();const i=pick(e);
  if(i<0){if(me>=0&&!marching&&!aim&&sel>=0){sel=-1;ui()}return}sfx.sel(); // clique fora do mapa: volta à visão do império
  if(aim){if(cardOk(aim,i)){pushU();undoS=[];playCard(aim,i);regionCheck()}else note('Esse '+TW1+' não serve para esta carta');aim=null;rKey='';return ui()}
  if(marching&&adj[sel].includes(i)){if(owner[i]==me)pushU();else undoS=[];act(i)}else{if(sel!=i)tab='army';sel=i;marching=false;if(me>=0&&!over){ui();return owner[i]==me?mapCmd(i):otherCmd(i)}}
  ui()});
cv.addEventListener('mousemove',e=>{const tip=$('tip');if(!owner)return;if(HQ){tip.hidden=true;HQ.hov=hqSpot(e);return}if(B){const hh=hudAt(e);cv.style.cursor=hh?'pointer':'';const c=hh?[-1,-1]:bCell(e),k=c.join();if(k!=B.hovK){B.hovK=k;B.hov=c;const tc=$('tcard');if(tc)tc.innerHTML=terrCard();help(cellHelp());
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
    ['Cancelar','bcancel','',false,s.moved&&B.undo?'Volta a unidade para onde estava':'Fecha o menu']],...toScreen((s.x+1)*CS,(s.y+.5)*CS),tg?'batk':'bwait');tutEv('bcmd')}
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
  if(me<0)return'Escolha um líder na tela de seleção.';if(over)return'Partida encerrada.';
  if(aim)return`Carta ${CARDS[aim][0]}: clique num ${TW1} destacado. Esc cancela.`;
  if(marching)return'Clique num vizinho para marchar. O número em cada rota é a chance de vitória. Esc cancela.';
  return`Clique num ${TW1} seu para abrir os comandos. Quando terminar, Fim do turno.`}
function help(t){if(helpEl)helpEl.innerHTML=t||helpDefault()}
document.addEventListener('mouseover',e=>{const el=e.target.closest?.('[data-help]');if(el&&el.dataset.help){helpHover=el;help(esc(el.dataset.help))}});
document.addEventListener('mouseout',e=>{if(helpHover&&!helpHover.contains(e.relatedTarget)){helpHover=null;help()}});
document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-help]');if(el&&el.dataset.help)help(esc(el.dataset.help))});

// ---------- placa de turno ----------
function plaque(kind){const el=$('plaque');if(!el||me<0)return; /* placa de turno; com resumo, vira um aviso que some sozinho ou com um clique */
  const sm=kind=='me'&&summ;el.className=kind+(sm?' sum':'');
  el.innerHTML=kind=='ai'?'<div class="pl"><em>Vez do inimigo</em></div>':`<div class="pl"><em>Turno</em><b>${turn}</b><span>${I(turn%4==3?'moon':'sun')}${TOD[turn%4][0]}</span></div>`+
    (sm?`<div class="sumk"><div><b>+${summ.inc}</b><span>ouro</span></div><div class="${summ.lost.length?'hot':''}"><b>${summ.lost.length}</b><span>${summ.lost.length==1?TW1+' perdido':TW+' perdidos'}</span></div><div class="${summ.danger?'hot':''}"><b>${summ.danger}</b><span>em perigo</span></div></div>
      <p>${summ.lost.length?'Perdeu '+summ.lost.map(i=>S[i][0]).join(', ')+'. ':''}${summ.atk?`${summ.atk} ataque${summ.atk>1?'s':''} contra você. `:''}${summ.danger?`Em perigo: um vizinho tem tropas para tomar o ${TW1}. `:''}<small>Clique para continuar</small></p>`:'');
  el.hidden=false;el.style.animation='none';void el.offsetWidth;el.style.animation='';clearTimeout(plaque.t);plaque.t=setTimeout(()=>el.hidden=true,kind=='ai'?1300:sm?7000:2300)}
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

// ---------- tela que cabe na janela: o mapa cresce até o espaço livre ----------
const relTxt=f=>pact[f]>turn?(ally[f]>turn?'aliado':`pacto até o turno ${pact[f]}`):angry[f]>turn?'hostil':'sem acordo';
function fit(){const view=$('view');if(!view)return;
  if(HQ){const s=Math.min(innerWidth/810,innerHeight/610);cv.style.width=810*s+'px';cv.style.height=610*s+'px';return}
  if(matchMedia('(max-width:900px)').matches){cv.style.width='100%';cv.style.height='auto';return}
  const s=Math.max(.5,Math.min((view.clientWidth-12)/810,(view.clientHeight-12)/610));cv.style.width=Math.floor(810*s)+'px';cv.style.height=Math.floor(610*s)+'px'}
addEventListener('resize',fit);try{new ResizeObserver(fit).observe($('view'))}catch{}
function otherCmd(i){const f=owner[i],nb=adj[i].some(j=>owner[j]==me),[px0,py0]=proj(...px(i));
  openCmd([['Diplomacia','mdip',`data-f="${f}"`,!nb,nb?`Pactos, alianças e tributos com ${S[f][4]}`:'Só dá para negociar com quem faz fronteira com você'],
    ['Marchar até aqui','mtgt','',!adj[i].some(j=>owner[j]==me&&!moved.has(j)&&troops[j]>1),'Escolhe um território seu vizinho e prepara a marcha'],
    ['Ficha histórica','enc',`data-i="${f}"`,false,`Quem foi ${S[f][4]}`],['Fechar','mclose','',false,'']],px0,py0)}
function showDip(f){const fs=f>=0?[f]:[...new Set(owner.filter((o,j)=>o!=me&&adj[j].some(k=>owner[k]==me)))];window.dipF=f;
  scr(`<h2>Diplomacia</h2>`+(fs.length?fs.map(o=>`<div class="box">${dipHTML(o,'scr')}</div>`).join(''):'<p class="c">Nenhum rival faz fronteira com você.</p>')+'<button data-s="close" class="end">Fechar</button>')}

// ---------- batalha: arrastar a câmera, zoom pela roda ou com dois dedos, setas do teclado ----------
let drag=null,dragEat=0,pinch=null,cardEat=0;const ptrs=new Map;
cv.addEventListener('pointerdown',e=>{if(!B||e.button>0)return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size==2){const[a,b]=[...ptrs.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),z:B.cam.tz};drag=null;return}
  const[px,py]=bPt(e);if(inView(px,py)&&!hudAt(e))drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,cx:B.cam.tx,cy:B.cam.ty,moved:false}});
cv.addEventListener('pointermove',e=>{if(!B)return;if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(pinch&&ptrs.size==2){const[a,b]=[...ptrs.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),[mx,my]=bPt({clientX:(a[0]+b[0])/2,clientY:(a[1]+b[1])/2});camZoom(pinch.z*d/pinch.d/B.cam.tz,mx,my);dragEat=Date.now()+300;return}
  if(!drag||drag.id!=e.pointerId)return;const k=cv.width/cv.getBoundingClientRect().width,dx=(e.clientX-drag.sx)*k,dy=(e.clientY-drag.sy)*k;
  if(!drag.moved&&Math.hypot(dx,dy)<9)return;drag.moved=true;$('tip').hidden=true;const c=B.cam;c.tx=drag.cx-dx/c.z;c.ty=drag.cy-dy/c.z;camClamp(c);c.x=c.tx;c.y=c.ty});
const ptrEnd=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;if(drag&&drag.id==e.pointerId){if(drag.moved)dragEat=Date.now()+80;drag=null}};
addEventListener('pointerup',ptrEnd);addEventListener('pointercancel',ptrEnd);
cv.addEventListener('wheel',e=>{if(!B)return;e.preventDefault();const[px,py]=bPt(e); /* roda do mouse: zoom; trackpad: desliza (pinça no trackpad também dá zoom) */
  if(e.ctrlKey)camZoom(Math.exp(-e.deltaY*.01),px,py);else if(Math.abs(e.deltaY)>=50&&!e.deltaX)camZoom(e.deltaY<0?1.15:1/1.15,px,py);
  else{const c=B.cam;c.tx+=e.deltaX/c.z;c.ty+=e.deltaY/c.z;camClamp(c)}},{passive:false});
document.addEventListener('keydown',e=>{if(!B||!$('screen').hidden||!$('menu').hidden||!cmdEl.hidden||e.ctrlKey||e.metaKey||talkCur)return;const k=e.key.toLowerCase(),c=B.cam,
  dv={arrowup:[0,-1],arrowdown:[0,1],arrowleft:[-1,0],arrowright:[1,0]}[k];
  if(dv){e.preventDefault();c.tx+=dv[0]*CS*3;c.ty+=dv[1]*CS*3;camClamp(c)}
  else if(k=='+'||k=='=')camZoom(1.2);else if(k=='-')camZoom(1/1.2);
  else if(k=='f'){bFast=bFast>=4?1:bFast*2;try{localStorage.setItem('tb-fast',bFast)}catch{};note(`Velocidade do turno inimigo: ×${bFast}`)}
  else if(k==' '&&B.busy){e.preventDefault();B.skip=true;B.clash=null}else if(k=='m')miniOn=!miniOn});
// cartas de batalha: arrastar até o alvo
$('hand').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-card]');if(!B||!b||b.disabled||B.busy)return;
  const id=hand[+b.dataset.card],sx=e.clientX,sy=e.clientY;let gh=null;
  const mv=ev=>{if(!gh&&Math.hypot(ev.clientX-sx,ev.clientY-sy)<12)return;
    if(!gh){gh=b.cloneNode(true);gh.className='card bat ghost';document.body.appendChild(gh);B.cardDrag={id}}
    gh.style.left=ev.clientX+'px';gh.style.top=ev.clientY+'px';B.cardDrag.cell=bCell(ev)};
  const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);if(!gh)return;gh.remove();B.cardDrag=null;cardEat=Date.now()+300;
    const c=CARDS[id],[gx,gy]=bCell(ev);if(gx<0)return ui();
    if(c[3]=='foe'){const u=B.units.find(v=>v.hp>0&&v.side!=B.ps&&v.x==gx&&v.y==gy&&seen(v));if(u)playBattleCard(id,u);else note('Solte a carta sobre uma unidade inimiga')}
    else playBattleCard(id);ui()};
  addEventListener('pointermove',mv);addEventListener('pointerup',up)});
