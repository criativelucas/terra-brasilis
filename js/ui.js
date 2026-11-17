// painel lateral, botões e cliques do mapa
function ui(){
  $('hqBar').hidden=!HQ;
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
      ${s?`<div class="ucard"><img src="${icon(s.type,pf,true,s.ld)}" alt=""><div><b>${nmOf(s)}${s.ld?' · Comandante':''}</b>
          <div class="chips"><span>♥ ${s.hp}/${s.max}</span><span>Anda ${mvOf(s)}</span><span>Alcance ${rgOf(s)}</span></div>
          <p>${s.el?`<b>Elite:</b> ${elTxt(s.el)}<br>`:''}Forte contra ${strong(s.type)}<br>Fraca contra ${weak(s.type)}</p></div></div>
          <p><i>${s.moved?'Clique num alvo marcado em vermelho.':'Mova para uma casa hachurada ou ataque um alvo em vermelho.'}</i></p>`
        :B.peek&&B.peek.hp>0?`<div class="ucard"><img src="${icon(B.peek.type,B.ps?B.af:B.was,false,B.peek.ld)}" alt=""><div><b>Inimigo: ${nmOf(B.peek)}${B.peek.ld?' · Comandante':''}</b>
          <div class="chips"><span>♥ ${B.peek.hp}/${B.peek.max}</span><span>Anda ${mvOf(B.peek)}</span><span>Alcance ${rgOf(B.peek)}</span></div>
          <p>${B.peek.el?`<b>Elite:</b> ${elTxt(B.peek.el)}<br>`:''}Forte contra ${strong(B.peek.type)}<br>Fraca contra ${weak(B.peek.type)}</p></div></div>
          <p><i>Laranja: até onde ele anda. Tracejado: onde ele alcança atacar.</i></p>`
        :'<p><i>Escolha uma unidade sua, ou clique num inimigo para ver até onde ele vai.</i></p>'}
      <div class="ulist">${B.units.map((u,k)=>u.side==B.ps&&u.hp>0?`<button data-u="${k}" class="${u.done?'done ':''}${u==s?'cur':''}" title="${nmOf(u)}${u.done?' (já agiu)':''}"><img src="${icon(u.type,pf,true,u.ld)}" alt="${nmOf(u)}">♥${u.hp}</button>`:'').join('')}</div>
      <div class="tri">${ic('inf')}▶${ic('cav')}▶${ic('ati')}▶${ic('inf')}</div>
      <p class="c">A seta aponta quem leva +50% de dano.<br>Mata e vila: +30% de defesa. Morro e água bloqueiam.</p>
      <button data-a="brally" ${B.rally||B.busy?'disabled':''}>${B.rally?'Brado já usado':'Brado do comandante: +40% de dano nesta rodada'}</button>
      <div class="row"><button data-a="bwait" ${s&&!B.busy?'':'disabled'}>Esperar</button><button data-a="bundo" ${B.undo&&!B.busy?'':'disabled'}>Desfazer</button></div>
      <div class="row"><button data-a="bend" class="end" ${dis}>Encerrar rodada ▶</button><button data-a="bauto" ${dis}>Automático</button></div>`;
    return}
  let h='';
  if(over)h+=`<h2>${over}</h2><button data-a="new">Novo jogo</button>`;
  else if(me<0)h+='<p>Escolha no mapa ou na galeria o líder da sua campanha. Cada estado tem vantagem própria.</p>';
  if(sel>=0){const i=sel,f=owner[i],mine=f==me&&!over;
    h+=`<div class="who">${img(i,S[i][4])}<div><h2>${S[i][1]}</h2><p><b>${S[i][4]}</b></p><p>${S[i][7]}: ${traitTxt(i)}</p></div></div>
      <div class="chips"><span>⚔ Tropas ${troops[i]}</span><span>◉ Renda ${inc(i)}</span><span>⛨ Defesa +${Math.round(defOf(i)*100)}%</span>
        <span>Recruta: ${cost(i)} ouro</span><span>${BIO[BOF[i]].nome}</span>${vet[i]?`<span>Veteranos ${vet[i]} (+${vet[i]*5}% dano)</span>`:''}${ELITE[S[i][0]]?`<span>★ ${ELITE[S[i][0]][0]}</span>`:''}${fort[i]?`<span>Forte nível ${fort[i]}</span>`:''}</div>
      <div class="own">${img(f)}<span>Domínio: ${f==me?'você':S[f][4]+' ('+S[f][0]+')'}</span></div>`;
    if(me<0)h+=`<button data-a="start">Começar com ${S[i][0]}</button>`;
    else if(mine){const c=cost(i),g=gold[me],can=!moved.has(i)&&troops[i]>1;
      h+=`<div class="row"><button data-a="rec" data-n="1" ${g<c?'disabled':''}>+1</button>
        <button data-a="rec" data-n="5" ${g<c*5?'disabled':''}>+5</button>
        <button data-a="rec" data-n="${Math.floor(g/c)}" ${g<c?'disabled':''}>Máx</button><span>recrutar</span></div>
        <button data-a="fort" ${g<fcost()||fort[i]>1?'disabled':''}>${fort[i]>1?'Forte no máximo':`Fortificar (${fcost()} ouro)`}</button>`;
      if(can)h+=`<div class="row"><label for="n">Enviar</label><input type="range" id="n" min="1" max="${troops[i]-1}" value="${troops[i]-1}"><b id="nv">${troops[i]-1}</b></div>
        <button data-a="march" class="${marching?'on':''}">${marching?'Escolha um vizinho…':'Marchar / Atacar'}</button>`;
      else h+=`<p><i>${troops[i]>1?'Estas tropas já marcharam neste turno.':'Guarnição mínima: recrute para marchar.'}</i></p>`}}
  if(me>=0&&!over&&sel>=0&&owner[sel]!=me){const f=owner[sel],on=pact[f]>turn,near=adj[sel].some(j=>owner[j]==me);
    h+=`<h2>Diplomacia</h2><div class="own">${img(f)}<span><b>${S[f][4]}</b> · ${owner.filter(o=>o==f).length} estados<br>${on?`Pacto em vigor até o turno ${pact[f]}`:betray>turn?'Desconfia de você: traidor':near?'Vizinho sem acordo':'Sem fronteira com você'}</span></div>
      <button data-a="pact" data-f="${f}" ${on||gold[me]<6?'disabled':''}>${on?'Pacto em vigor':'Propor pacto de não agressão (6 ouro, 5 turnos)'}</button>
      ${on?'<p><i>Atacar agora é traição: rompe todos os pactos e enfurece os vizinhos.</i></p>':''}`}
  if(me>=0&&!over)h+='<button data-a="hq">⌂ Quartel-General</button><button data-a="end" class="end">Fim do turno ▶</button>';
  $('panel').innerHTML=h;
  $('bar').innerHTML=me<0?'<span>Ano de 1822</span>':`<span>Turno ${turn}</span><span>◉ Ouro ${gold[me]} (+${income(me)})</span><span>⚑ Estados ${owner.filter(o=>o==me).length}/${N}</span>`;
  $('log').innerHTML=logs.map(l=>`<div>› ${l}</div>`).join('');
  $('roster').innerHTML=S.map((s,i)=>{const n=owner.filter(o=>o==i).length;
    return`<button data-i="${i}" class="${i==me?'me ':''}${i==sel?'sel ':''}${n?'':'dead'}" title="${s[4]} (${s[1]})">${img(i,s[4])}<span>${s[0]} ${n}</span></button>`}).join('');
  draw();save();
  if(over&&!endShown){endShown=true;showEnd()}}
$('panel').addEventListener('input',e=>{if(e.target.id=='n')$('nv').textContent=e.target.value});
const onPanel=e=>{const b=e.target.closest('button');if(!b||cam)return;const a=b.dataset.a;sfx.sel();
  if(a=='hq')return openHQ();
  if(a=='room')return enterRoom(b.dataset.r);
  if(a=='hqexit')return closeHQ();
  if(b.dataset.u){const u=B.units[+b.dataset.u];if(!B.busy&&!u.done)B.selU=u;return ui()}
  if(a=='bend')return bEnd();
  if(a=='bauto')return bEnd(true);
  if(a=='brally'){B.rally=B.round;sfx.win()}
  if(a=='bwait'&&B.selU){B.selU.done=true;B.selU=B.undo=null}
  if(a=='bundo'&&B.undo){const{u,x:ux,y:uy}=B.undo;u.x=ux;u.y=uy;u.moved=u.done=false;B.selU=u;B.undo=null}
  if(a=='start'){me=sel;say(`${S[me][4]} ergue a bandeira em ${S[me][1]}`);scr()}
  if(a=='rec'){const n=+b.dataset.n;troops[sel]+=n;gold[me]-=n*cost(sel)}
  if(a=='pact'){const f=+b.dataset.f;gold[me]-=6;pact[f]=turn+5;say('Pacto firmado com '+S[f][4]);sfx.win()}
  if(a=='fort'){gold[me]-=fcost();fort[sel]++}
  if(a=='march')marching=!marching;
  if(a=='end'){endTurn();if(raids.length)return nextRaid()}
  if(a=='new'){reset();return showSetup()}
  ui()};
$('panel').addEventListener('click',onPanel);$('hqBar').addEventListener('click',onPanel);
$('roster').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||B||HQ||cam)return;sel=+b.dataset.i;marching=false;sfx.sel();
  if(me<0){pickI=sel;return showSetup()} // antes da campanha, a galeria escolhe o líder
  ui()});
cv.addEventListener('click',e=>{if(cam)return;if(HQ){const k=hqSpot(e);return k&&enterRoom(k)}if(B)return bClick(e);const i=pick(e);if(i<0)return;sfx.sel();
  if(marching&&adj[sel].includes(i))act(i);else{sel=i;marching=false}
  ui()});
cv.addEventListener('mousemove',e=>{const tip=$('tip');if(HQ){tip.hidden=true;HQ.hov=hqSpot(e);return}if(B){tip.hidden=true;B.hov=bCell(e);return}const i=pick(e);
  if(i!=hov){hov=i;draw();
    if(i>=0){let odds='';
      if(marching&&adj[sel].includes(i)&&owner[i]!=me){const n=+($('n')?.value||troops[sel]-1),a=n*(1+trait(sel,'atk')),d=troops[i]*(1+defOf(i))+1;
        odds=`<br><b>Ataque ${a>d*1.3?'favorável':a>d*.8?'arriscado':'temerário'}</b>`}
      tip.innerHTML=`${img(owner[i])}<span><b>${S[i][1]}</b><br>${S[owner[i]][4]}<br>${troops[i]} tropas${fort[i]?' · forte '+fort[i]:''}${odds}</span>`}}
  tip.hidden=i<0;
  if(i>=0){const r=$('stage').getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    tip.style.left=Math.min(mx+14,r.width-tip.offsetWidth-10)+'px';tip.style.top=Math.max(4,my-70)+'px'}});
cv.addEventListener('mouseleave',()=>{hov=-1;$('tip').hidden=true;if(B)B.hov=null;draw()});
