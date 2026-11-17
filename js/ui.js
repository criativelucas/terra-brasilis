// painel lateral, botões e cliques do mapa
function ui(){
  tutBox();
  $('hqBar').hidden=!HQ;$('act').innerHTML='';$('act').hidden=true;
  if(HQ){$('hqBar').innerHTML=`<span>◉ Ouro ${gold[me]} (+${income(me)}) · Turno ${turn}</span><button data-a="hqexit" class="end">Voltar ao mapa ▶</button>`;
    $('panel').innerHTML=`<h2>Quartel-General</h2><div class="chips"><span>◉ Ouro ${gold[me]} (+${income(me)})</span><span>Turno ${turn}</span></div>
      <p>Clique numa sala da maquete ou escolha abaixo.</p>`+ROOMS.map(R=>`<button data-a="room" data-r="${R.k}">${R.n}: ${R.s}</button>`).join('')+
      '<button data-a="room" data-r="dip">Chancelaria: Diplomacia</button><button data-a="room" data-r="cam">Torre de Vigia: Campanha</button><button data-a="hqexit" class="end">Voltar ao mapa</button>';
    $('log').innerHTML=logs.map(l=>`<div>› ${l}</div>`).join('');return save()}
  if(B){const s=B.selU,dis=B.busy?'disabled':'',pf=B.ps?B.was:B.af,weak=t=>UT[Object.keys(BEATS).find(k=>BEATS[k]==t)]?.[0]||'ninguém em especial',
      ic=t=>`<img src="${icon(t,pf,true,false)}" alt="${UT[t][0]}" title="${UT[t][0]}">`;
    $('panel').innerHTML=`<h2>${B.ps?'Defesa':'Batalha'} de ${S[B.to][1]}</h2>
      <div class="chips"><span>Rodada ${Math.min(B.round,MAXR)}/${MAXR}</span><span>${B.bio.nome}</span>${B.wx=='rain'?'<span>Chuva: tiro −1 de alcance</span>':B.wx=='dry'?'<span>Seca: infantaria anda −1</span>':''}</div>
      <p><b>Objetivo:</b> ${B.ps?'manter seu comandante (retrato dourado) vivo até a última rodada, ou derrubar o invasor.':'derrubar o comandante inimigo (retrato dourado) antes da última rodada.'}</p>
      ${s?`<div class="ucard"><img src="${icon(s.type,pf,true,s.ld)}" alt=""><div><b>${nmOf(s)}${s.ld?' · Comandante':''}${s.lv?` · Nível ${s.lv}`:''}</b>
          <div class="chips"><span>♥ ${s.hp}/${s.max}</span><span>Anda ${mvOf(s)}</span><span>Alcance ${rgOf(s)}</span></div>
          <p>${s.el?`<b>${gl('elite','Elite')}:</b> ${elTxt(s.el)}<br>`:''}Forte contra ${strong(s.type)}<br>Fraca contra ${weak(s.type)}</p></div></div>
          <p><i>${s.moved?'Clique num alvo marcado em vermelho.':'Mova para uma casa hachurada ou ataque um alvo em vermelho.'}</i></p>`
        :B.peek&&B.peek.hp>0?`<div class="ucard"><img src="${icon(B.peek.type,B.ps?B.af:B.was,false,B.peek.ld)}" alt=""><div><b>Inimigo: ${nmOf(B.peek)}${B.peek.ld?' · Comandante':''}</b>
          <div class="chips"><span>♥ ${B.peek.hp}/${B.peek.max}</span><span>Anda ${mvOf(B.peek)}</span><span>Alcance ${rgOf(B.peek)}</span></div>
          <p>${B.peek.el?`<b>Elite:</b> ${elTxt(B.peek.el)}<br>`:''}Forte contra ${strong(B.peek.type)}<br>Fraca contra ${weak(B.peek.type)}</p></div></div>
          <p><i>Laranja: até onde ele anda. Tracejado: onde ele alcança atacar.</i></p>`
        :'<p><i>Escolha uma unidade sua, ou clique num inimigo para ver até onde ele vai.</i></p>'}
      <div class="ulist">${B.units.map((u,k)=>u.side==B.ps&&u.hp>0?`<button data-u="${k}" class="${u.done?'done ':''}${u==s?'cur':''}" title="${nmOf(u)}${u.done?' (já agiu)':''}"><img src="${icon(u.type,pf,true,u.ld)}" alt="${nmOf(u)}">♥${u.hp}</button>`:'').join('')}</div>
      <div class="tri">${ic('inf')}▶${ic('cav')}▶${ic('ati')}▶${ic('inf')}</div>
      <p class="c">${gl('tri','A seta aponta quem leva +50% de dano.')}<br>Mata e vila: +30% de defesa. Morro e água bloqueiam.</p>
      <button data-a="brally" ${B.rl[B.ps]||B.busy?'disabled':''}>${B.rl[B.ps]?'Brado já usado':'Brado do comandante: +40% de dano nesta rodada'}</button>${gl('brado','O que é o brado?')}${B.rl[1-B.ps]?'<p><i>O inimigo já usou o brado.</i></p>':''}
      <div class="row"><button data-a="bwait" ${s&&!B.busy?'':'disabled'}>Esperar</button><button data-a="bundo" ${B.undo&&!B.busy?'':'disabled'}>Desfazer</button></div>
      <div class="row"><button data-a="bend" class="end" ${dis}>Encerrar rodada ▶</button><button data-a="bauto" ${dis}>Automático</button></div>`;
    return}
  let h='',act='';
  if(summ&&me>=0&&!over)h+=`<div class="summ"><b>Turno ${summ.turn} · ${TOD[summ.turn%4][0]}</b><p>Renda +${summ.inc} ouro.${summ.lost.length?` Perdeu ${summ.lost.map(i=>S[i][1]).join(', ')}.`:' Nenhum '+TW1+' perdido.'}${summ.atk?` ${summ.atk} ataque${summ.atk>1?'s':''} contra você.`:''}${summ.danger?` <b>${summ.danger} em perigo.</b>`:''}</p><button data-a="summx">Entendi</button></div>`;
  if(over)h+=`<h2>${over}</h2><button data-a="new">Novo jogo</button>`;
  else if(me<0)h+=`<p>Escolha no mapa ou na galeria o líder da sua partida. Cada ${TW1} tem vantagem própria.</p>`;
  if(sel>=0){const i=sel,f=owner[i],mine=f==me&&!over;
    h+=`<div class="who">${img(i,S[i][4])}<div><h2>${S[i][1]}</h2><p><b>${S[i][4]}</b></p><p>${S[i][7]}: ${traitTxt(i)}</p></div></div>
      <div class="chips"><span>⚔ Tropas ${cnt('t'+i,troops[i])}</span><span>${gl('renda','◉ Renda '+inc(i))}</span><span>${gl('def','⛨ Defesa +'+Math.round(defOf(i)*100)+'%')}</span>
        <span>${gl('recruta','Recruta: '+cost(i)+' ouro')}</span><span>${BIO[BOF[i]].nome}</span>${xp[i].some(v=>lvl(v))?`<span>${gl('xp','Regimentos '+xp[i].map(lvl).join('·'))}</span>`:''}${port[i]?`<span>${gl('porto','⚓ Porto')}</span>`:''}${ELITE[S[i][0]]?`<span>${gl('elite','★ '+ELITE[S[i][0]][0])}</span>`:''}${fort[i]?`<span>${gl('forte','Forte nível '+fort[i])}</span>`:''}${danger(i)?`<span class="warn">${gl('perigo','⚠ Em perigo')}</span>`:''}</div>
      <div class="own">${img(f)}<span>Domínio: ${f==me?'você':S[f][4]+' ('+S[f][0]+')'}</span></div>`;
    if(me<0)h+=`<button data-a="start">Começar com ${S[i][0]}</button>`;
    else if(mine){const c=cost(i),g=gold[me],can=!moved.has(i)&&troops[i]>1,rivals=[...new Set(adj[i].map(j=>owner[j]))].filter(o=>o!=me);
      h+=`<div class="tabs" role="tablist">${[['army','Exército'],['build','Construir'],['dip','Diplomacia']].map(([k,n])=>`<button role="tab" aria-selected="${tab==k}" data-a="tab" data-t="${k}" class="${tab==k?'on':''}">${n}</button>`).join('')}</div>`;
      if(tab=='army'){h+=`<div class="row"><button data-a="rec" data-n="1" ${g<c?'disabled':''}>+1</button><button data-a="rec" data-n="5" ${g<c*5?'disabled':''}>+5</button>
          <button data-a="rec" data-n="${Math.floor(g/c)}" ${g<c?'disabled':''}>Máx</button><span>recrutar · ${c} ouro cada</span></div>`;
        h+=can?`<div class="row"><label for="n">Enviar</label><input type="range" id="n" min="1" max="${troops[i]-1}" value="${Math.min(+($('n')?.value||troops[i]-1),troops[i]-1)}"><b id="nv">${Math.min(+($('n')?.value||troops[i]-1),troops[i]-1)}</b></div>
          <p><i>${marching?'Clique num vizinho (ou use as setas e Enter). O número em cada rota é a chance de vitória.':'Marchar fica na barra abaixo.'}</i></p>`
          :`<p><i>${troops[i]>1?'Estas tropas já marcharam neste turno.':'Guarnição mínima: recrute para marchar.'}</i></p>`}
      if(tab=='build')h+=`${COAST.includes(i)?`<button data-a="port" ${port[i]||g<5?'disabled':''}>${port[i]?'⚓ Porto construído':'⚓ Construir porto (5 ouro): +1 renda e rotas marítimas'}</button>`:`<p><i>Sem litoral: não dá para construir porto aqui.</i></p>`}
        <button data-a="fort" ${g<fcost()||fort[i]>1?'disabled':''}>${fort[i]>1?'Forte no máximo':`Fortificar (${fcost()} ouro): +20% de defesa`}</button>`;
      if(tab=='dip')h+=rivals.length?rivals.map(o=>`<div class="ucard" style="flex-direction:column;align-items:stretch">${dipHTML(o)}</div>`).join(''):`<p><i>Nenhum rival faz fronteira com este ${TW1}.</i></p>`;
      if(can)act+=`<button data-a="march" class="${marching?'on':''}">${marching?'Escolha um vizinho… (Esc cancela)':'⚔ Marchar / Atacar'}</button>`}}
  if(me>=0&&!over&&sel>=0&&owner[sel]!=me)h+='<h2>Diplomacia</h2>'+dipHTML(owner[sel]);
  if(me>=0&&!over){const idle=owner.reduce((a,o,j)=>a+(o==me&&!moved.has(j)&&troops[j]>1),0),armed=endArm>Date.now();
    act+=`<div class="row"><button data-a="next" ${idle?'':'disabled'} title="Próximo ${TW1} que ainda pode marchar (N)">▶ Próximo (${idle})</button><button data-a="undo" ${undoS.length?'':'disabled'} title="Desfazer (Z)">↶ Desfazer</button><button data-a="hq" title="Quartel-General (Q)">⌂ Quartel</button></div>
      <button data-a="end" class="end${armed?' danger':''}">${armed?`Encerrar mesmo assim? ${idle} ${idle>1?TW:TW1} ainda pode${idle>1?'m':''} marchar`:'Fim do turno ▶'}</button>`}
  $('panel').innerHTML=h;$('act').innerHTML=act;$('act').hidden=!act;
  $('bar').innerHTML=me<0?`<span>${TH.nome} · ${TH.ano}</span>`:`<span>Turno ${turn} · ${TOD[turn%4][1]} ${TOD[turn%4][0]}</span><span>◉ Ouro ${cnt('gold',gold[me])} (+${income(me)})</span>${SCN[scn].sub?.[me]?`<span>${gl('sub','Corte +'+SCN[scn].sub[me])}</span>`:''}<span>⚑ ${TW[0].toUpperCase()+TW.slice(1)} ${cnt('terr',owner.filter(o=>o==me).length)}/${N}</span>`;
  $('log').innerHTML=logs.slice(0,2).map(l=>`<div>› ${esc(l)}</div>`).join('')+(logs.length?`<button data-a="log">📜 Crônica completa (${logs.length})</button>`:'');
  $('roster').innerHTML=S.map((s,i)=>{const n=owner.filter(o=>o==i).length;
    return`<button data-i="${i}" class="${i==me?'me ':''}${i==sel?'sel ':''}${n?'':'dead'}" title="${s[4]} (${s[1]})">${img(i,s[4])}<span>${s[0]} ${n}</span></button>`}).join('');
  if(marching&&sel>=0){const n=+($('n')?.value||troops[sel]-1);oddsC={};adj[sel].forEach(j=>{if(owner[j]!=me)oddsC[j]=odds(sel,j,n)})}else oddsC={};
  draw();save();
  if(over&&!endShown){endShown=true;showEnd()}}
let tab='army',undoS=[],summ=null,endArm=0; // tab: aba do painel; undoS: pilha para desfazer; summ: resumo do turno; endArm: confirmação do fim do turno
const pushU=()=>{undoS.push(JSON.stringify({troops,g:gold[me],fort,port,moved:[...moved],sel}));if(undoS.length>12)undoS.shift()};
function undo(){const d=JSON.parse(undoS.pop());troops=d.troops;gold[me]=d.g;fort=d.fort;port=d.port;moved=new Set(d.moved);sel=d.sel;linkPorts();note('Ação desfeita')}
$('panel').addEventListener('input',e=>{if(e.target.id=='n'){$('nv').textContent=e.target.value;if(marching){oddsC={};adj[sel].forEach(j=>{if(owner[j]!=me)oddsC[j]=odds(sel,j,+e.target.value)})}}});
const onPanel=e=>{const b=e.target.closest('button');if(!b||cam||aiShow)return;const a=b.dataset.a;sfx.sel();
  if(a=='tab'){tab=b.dataset.t;return ui()}
  if(a=='summx'){summ=null;return ui()}
  if(a=='log')return showLog();
  if(a=='undo'&&undoS.length){undo();return ui()}
  if(a=='next'){const own=owner.map((o,j)=>o==me&&!moved.has(j)&&troops[j]>1?j:-1).filter(j=>j>=0);if(own.length){sel=own[(own.indexOf(sel)+1)%own.length];marching=false;tab='army'}return ui()}
  if(a=='tutskip'){tut=-1;try{localStorage.setItem('tb-tut','1')}catch{}return ui()}
  if(a=='hq'){tutEv('hq');return openHQ()}
  if(a=='room')return enterRoom(b.dataset.r);
  if(a=='hqexit')return closeHQ();
  if(b.dataset.u){const u=B.units[+b.dataset.u];if(!B.busy&&!u.done)B.selU=u;return ui()}
  if(a=='bend')return bEnd();
  if(a=='bauto')return bEnd(true);
  if(a=='brally'){B.rl[B.ps]=B.round;sfx.win()}
  if(a=='bwait'&&B.selU){B.selU.done=true;B.selU=B.undo=null}
  if(a=='bundo'&&B.undo){const{u,x:ux,y:uy}=B.undo;u.x=ux;u.y=uy;u.moved=u.done=false;B.selU=u;B.undo=null}
  if(a=='start'){me=sel;say(`${S[me][4]} ergue a bandeira em ${S[me][1]}`);scr()}
  if(a=='rec'){tutEv('rec');pushU();const n=+b.dataset.n;troops[sel]+=n;gold[me]-=n*cost(sel)}
  if(a=='dip'){dipAct(b.dataset.k,+b.dataset.f)?sfx.win():sfx.lose()}
  if(a=='port'){pushU();gold[me]-=5;buildPort(sel);note(`Porto construído em ${S[sel][1]}`)}
  if(a=='fort'){pushU();gold[me]-=fcost();fort[sel]++;note(`Forte nível ${fort[sel]} em ${S[sel][1]}`)}
  if(a=='march'){marching=!marching;if(marching)tutEv('march')}
  if(a=='end'){const idle=owner.reduce((s,o,j)=>s+(o==me&&!moved.has(j)&&troops[j]>1),0);
    if(idle&&CFG.confirm&&!(endArm>Date.now())){endArm=Date.now()+4000;setTimeout(()=>{if(!(endArm>Date.now()))ui()},4100);return ui()} // segundo clique confirma
    endArm=0;tutEv('end');undoS=[];marching=false;const own0=owner.map(o=>o==me);endTurn();ui();
    return playAI(()=>{const done=()=>{summ={turn,inc:income(me),lost:owner.map((o,j)=>own0[j]&&o!=me?j:-1).filter(j=>j>=0),atk:evts.filter(e=>e.was==me).length,danger:owner.reduce((s,o,j)=>s+danger(j),0)}; // resumo do turno
      ui();if(evtDue){evtDue=false;showEvent()}};if(raids.length){nextRaid();summ=null}else done()})}
  if(a=='new'){reset();return showSetup()}
  ui()};
$('panel').addEventListener('click',onPanel);$('hqBar').addEventListener('click',onPanel);$('act').addEventListener('click',onPanel);$('log').addEventListener('click',onPanel);
$('roster').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||B||HQ||cam)return;sel=+b.dataset.i;marching=false;sfx.sel();
  if(me<0){pickI=sel;return showSetup()} // antes da campanha, a galeria escolhe o líder
  ui()});
cv.addEventListener('click',e=>{if(cam||aiShow)return;if(HQ){const k=hqSpot(e);return k&&enterRoom(k)}if(B)return bClick(e);const i=pick(e);if(i<0)return;sfx.sel();
  if(marching&&adj[sel].includes(i)){if(owner[i]==me)pushU();else undoS=[];act(i)}else{if(sel!=i)tab='army';sel=i;marching=false}
  ui()});
cv.addEventListener('mousemove',e=>{const tip=$('tip');if(!owner)return;if(HQ){tip.hidden=true;HQ.hov=hqSpot(e);return}if(B){tip.hidden=true;B.hov=bCell(e);return}const i=pick(e);
  if(i!=hov){hov=i;draw();
    if(i>=0){let oddT='';
      if(marching&&adj[sel].includes(i)&&owner[i]!=me){const n=+($('n')?.value||troops[sel]-1),a=n*(1+trait(sel,'atk')),d=troops[i]*(1+defOf(i))+1;
        const[p,l]=oddsC[i]||odds(sel,i,n);oddT=`<br><b>Chance ~${Math.round(p*100)}%</b> · sobram ~${l}<br><small>estimativa do combate automático</small>`}
      tip.innerHTML=`${img(owner[i])}<span><b>${S[i][1]}</b><br>${S[owner[i]][4]}<br>${troops[i]} tropas${fort[i]?' · forte '+fort[i]:''}${oddT}</span>`}}
  tip.hidden=i<0;
  if(i>=0){const r=$('stage').getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    tip.style.left=Math.min(mx+14,r.width-tip.offsetWidth-10)+'px';tip.style.top=Math.max(4,my-70)+'px'}});
cv.addEventListener('mouseleave',()=>{hov=-1;$('tip').hidden=true;if(B)B.hov=null;draw()});
