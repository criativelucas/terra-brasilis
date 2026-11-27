// Auditoria de interface: node tools/auditoria.mjs
// Abre cada tela do jogo em vários tamanhos de janela e mede o que um revisor de UI procuraria à mão:
// texto vazando da caixa, texto cortado por quem o contém, reticências, rótulo de botão quebrando linha,
// botões encavalados, coisas fora da tela, letra pequena demais e janelas que precisam rolar.
// TAM="1280x720,1440x900,1920x1080" escolhe os tamanhos; EN=1 audita em inglês; FOTOS=pasta salva uma foto de cada tela.
import {createServer} from 'node:http';import {spawn} from 'node:child_process';import {readFileSync,writeFileSync,existsSync,mkdtempSync,mkdirSync} from 'node:fs';
import {join,extname,dirname} from 'node:path';import {tmpdir} from 'node:os';import {fileURLToPath} from 'node:url';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..'),MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json'};
const srv=createServer((q,r)=>{const f=join(ROOT,decodeURIComponent(new URL(q.url,'http://x').pathname).replace(/\/$/,'/index.html'));
  if(!f.startsWith(ROOT)||!existsSync(f)){r.writeHead(404);return r.end()}r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(readFileSync(f))});
await new Promise(r=>srv.listen(0,'127.0.0.1',r));const URL_=`http://127.0.0.1:${srv.address().port}/?auditoria`;
const CH=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',PORT=9400+Math.random()*400|0;
const chrome=spawn(CH,['--headless=new',`--remote-debugging-port=${PORT}`,'--window-size=1440,900',...(process.env.CI?['--no-sandbox']:[]),`--user-data-dir=${mkdtempSync(join(tmpdir(),'tb-'))}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ws;
for(let i=0;i<60&&!ws;i++){try{const p=(await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find(t=>t.type=='page');if(p){ws=new WebSocket(p.webSocketDebuggerUrl);break}}catch{}await sleep(250)}
await new Promise(r=>ws.onopen=r);let id=0;const pend={};ws.onmessage=e=>{const m=JSON.parse(e.data);pend[m.id]?.(m)};
const cmd=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}))});
const ev=async code=>{const r=await cmd('Runtime.evaluate',{expression:`(async()=>{${code}})()`,awaitPromise:true,returnByValue:true});
  if(r.result?.exceptionDetails)throw new Error(r.result.exceptionDetails.exception?.description?.split('\n')[0]||'exceção');return r.result?.result?.value};

// medição feita dentro da página
const AUD=`window.AUD=()=>{const out=[],vw=innerWidth,vh=innerHeight,seen=new Set;
  const vis=el=>{const cs=getComputedStyle(el);if(cs.display=='none'||cs.visibility=='hidden'||+cs.opacity<.05)return false;const r=el.getBoundingClientRect();return r.width>1&&r.height>1};
  const shown=el=>{for(let a=el;a&&a!=document.documentElement;a=a.parentElement){const cs=getComputedStyle(a);if(cs.display=='none'||cs.visibility=='hidden'||+cs.opacity<.05||a.hidden)return false}return true};
  const nm=el=>{const one=e=>e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.classList.length?'.'+[...e.classList].slice(0,2).join('.'):'');let s=one(el),p=el.parentElement;for(let k=0;k<2&&p&&p!=document.body;k++,p=p.parentElement)s=one(p)+' > '+s;return s};
  const tx=el=>(el.innerText||el.textContent||'').replace(/\\s+/g,' ').trim().slice(0,46);
  const add=(t,el,i)=>{const k=t+'|'+nm(el)+'|'+tx(el);if(seen.has(k))return;seen.add(k);out.push({t,el:nm(el),tx:tx(el),i})};
  const scrollAnc=el=>{for(let a=el.parentElement;a&&a!=document.body;a=a.parentElement){const cs=getComputedStyle(a);if(/auto|scroll/.test(cs.overflowX+cs.overflowY))return a}return null};
  const clipAnc=el=>{for(let a=el.parentElement;a&&a!=document.body;a=a.parentElement){const cs=getComputedStyle(a);if(/auto|scroll/.test(cs.overflowX+cs.overflowY))return null;if(/hidden|clip/.test(cs.overflowX+cs.overflowY))return a}return null};
  const DECO='.badge,.stamp,.xclose,.cc,.clv,.rar,.dif,#tutPtr,.coinf,.seal,.fita,.tc,.gl,.pn';
  for(const el of document.querySelectorAll('body *')){if(el.closest('#dbg,script,style,svg,canvas'))continue;if(!vis(el)||!shown(el))continue;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    for(const n of el.childNodes){if(n.nodeType!=3||!n.data.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);const tr=rg.getBoundingClientRect();if(!tr.width)continue;
      const L=r.left+parseFloat(cs.borderLeftWidth),R=r.right-parseFloat(cs.borderRightWidth),T=r.top+parseFloat(cs.borderTopWidth),Bt=r.bottom-parseFloat(cs.borderBottomWidth);
      if(cs.display!='inline'&&(tr.left<L-1.5||tr.right>R+1.5))add('texto vaza na largura',el,Math.round(tr.width)+'px de texto em '+Math.round(R-L)+'px');
      if(cs.display!='inline'&&(tr.bottom>Bt+3||tr.top<T-3))add('texto vaza na altura',el,Math.round(tr.height)+'px de texto em '+Math.round(Bt-T)+'px');
      const ca=clipAnc(el);if(ca){const cr=ca.getBoundingClientRect();if(tr.right>cr.right+1||tr.left<cr.left-1||tr.bottom>cr.bottom+1||tr.top<cr.top-1)add('texto cortado pela caixa',el,'cortado por '+nm(ca))}
      if(!scrollAnc(el)&&(tr.right>vw+1||tr.left<-1||tr.bottom>vh+1||tr.top<-1))add('texto fora da tela',el,Math.round(tr.left)+','+Math.round(tr.top)+' em '+vw+'x'+vh);
      const fs=parseFloat(cs.fontSize);if(fs>=1&&fs<11.5&&!el.closest(DECO))add('letra pequena',el,fs+'px');
      if(el.closest('button,.chips>span,.kpi span,.tst span')&&!el.closest('small,.why,.endr,.card')&&n.data.trim().length<=22&&!/\\n/.test(n.data)){const ls=new Set([...rg.getClientRects()].map(q=>Math.round(q.top)));if(ls.size>1)add('rótulo quebra linha',el,ls.size+' linhas')}}
    if(cs.textOverflow=='ellipsis'&&el.scrollWidth>el.clientWidth+1)add('reticências cortam o texto',el,el.scrollWidth+'px em '+el.clientWidth+'px');
    if(/^(BUTTON|IMG)$/.test(el.tagName)&&!el.closest(DECO)){const ca=clipAnc(el);if(ca){const cr=ca.getBoundingClientRect();if(r.right>cr.right+2||r.left<cr.left-2||r.bottom>cr.bottom+2||r.top<cr.top-2)add('elemento cortado pela caixa',el,'cortado por '+nm(ca))}
      if(!scrollAnc(el)&&!el.closest('#hand,#bmk')&&(r.right>vw+1||r.left<-1||r.bottom>vh+1||r.top<-1))add('elemento fora da tela',el,Math.round(r.left)+','+Math.round(r.top)+' '+Math.round(r.width)+'x'+Math.round(r.height))}
    if(el.tagName=='BUTTON'&&!el.closest(DECO)&&cs.position!='absolute'){for(const s of el.parentElement.children){if(s==el||s.tagName!='BUTTON'||s.closest(DECO)||!vis(s)||getComputedStyle(s).position=='absolute')continue;const q=s.getBoundingClientRect();
      const ix=Math.min(r.right,q.right)-Math.max(r.left,q.left),iy=Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top);if(ix>3&&iy>3&&el.compareDocumentPosition(s)&4)add('botões encavalados',el,'com '+tx(s))}}}
  for(const w of document.querySelectorAll('#card:not(.book),#menuBox')){if(!vis(w)||!shown(w))continue;if(w.scrollHeight>w.clientHeight+4)add('janela precisa rolar',w,(w.scrollHeight-w.clientHeight)+'px a mais')}
  for(const w of document.querySelectorAll('#card.book')){if(!vis(w))continue;const r=w.getBoundingClientRect();if(r.bottom>vh+1||r.top<-1)add('livro maior que a tela',w,Math.round(r.height)+'px em '+vh+'px')}
  return out}`;

const PRE=`for(let i=0;i<40&&typeof ui!='function';i++)await W_(250);tut=-1;CFG.speed=2;CFG.clash=0;CFG.calm=1;`;
const S=[ // [nome, código que monta a tela]
  ['título','scr();showTitle();await W_(400)'],
  ['escolha de líder','pickI=ix.RS;showSetup();await W_(400)'],
  ['campanhas históricas','showCamps();await W_(300)'],
  ['como jogar','showHelp();await W_(300)'],
  ['mapa: estado seu','reset();startAs(ix.BA);scr();owner[ix.SE]=me;owner[ix.AL]=me;gold[me]=30;stats.won=3;turn=4;for(let k=0;k<12;k++)say("Batalha em Sergipe vencida pelos voluntários da Bahia "+k);sel=ix.BA;ui();await W_(700)'],
  ['mapa: estado rival','sel=ix.PE;ui();await W_(500)'],
  ['mapa: império','sel=-1;ui();await W_(500)'],
  ['mapa: marchar','sel=ix.BA;marching=true;ui();await W_(400);marching=false'],
  ['mapa: menu de comandos','sel=ix.BA;ui();mapCmd(ix.BA);await W_(400)'],
  ['mapa: menu do rival','closeCmd();mapCmd(ix.PE);await W_(400);closeCmd()'],
  ['mapa: cartas abertas','hand=["grito","polvora","bandeira","missa","levas","alforria"];handOpen=true;ui();await W_(500)'],
  ['mapa: placa do turno','handOpen=false;ui();summ={turn,inc:15,lost:[ix.AL],atk:2,danger:1,ev:[[owner[ix.PE],ix.PE,ix.AL,1,1],[owner[ix.MG],ix.MG,ix.GO,0,0]]};plaque("me");await W_(500)'],
  ['mercado','$("plaque").hidden=true;showMarket();await W_(300)'],
  ['diário: campanha','showCampaign();await W_(500)'],
  ['diário: exército','showArmy();await W_(300)'],
  ['diário: conselho','showCouncil();await W_(300)'],
  ['diário: diplomacia','window.dipTab="rel";showDip(owner[ix.PE]);await W_(300)'],
  ['diário: tratados','window.dipTab="tra";showDip(owner[ix.PE]);await W_(300)'],
  ['diário: tributo','window.dipTab="tri";showDip(owner[ix.PE]);await W_(300)'],
  ['diário: crônica','showLog();await W_(300)'],
  ['diário: enciclopédia','showEnc(ix.RS);await W_(300)'],
  ['diário: cartas','showCards("bandeira");await W_(300)'],
  ['diário: conquistas','showAchs();await W_(300)'],
  ['pausa: jogo','scr();menuTab="jogo";menu(true);await W_(300)'],
  ['pausa: som','menuTab="som";drawMenu();await W_(200)'],
  ['pausa: tela','menuTab="tela";drawMenu();await W_(200)'],
  ['pausa: acessibilidade','menuTab="acess";drawMenu();await W_(200);menu(false)'],
  ['salvamentos','showSaves("close");await W_(300)'],
  ['atalhos','showKeys();await W_(300)'],
  ['acontecimento','showEvent();await W_(300)'],
  ['acontecimento histórico','showHist("Independência da Bahia","2 de julho de 1823. As tropas portuguesas deixam Salvador depois de mais de um ano de guerra.",ix.BA,histOpts(ix.BA,"Independência da Bahia",3,true));await W_(300)'],
  ['mensageiro rival','rivalOffer();await W_(300)'],
  ['diálogo','scr();talk([[me,"Soldados da Bahia! Hoje o Recôncavo decide a independência. Ninguém recua, ninguém se rende."]],()=>{});await W_(1500)'],
  ['carta nova','while(talkCur)talkNext(true);await W_(200);giveCard("lanceiros","Revolução Farroupilha");await W_(900)'],
  ['quartel: visão','await W_(2600);openHQ();await W_(1200)'],
  ['quartel: tropas','showRoom("bar");await W_(300)'],
  ['quartel: tesouraria','showRoom("tes");await W_(300)'],
  ['quartel: sala de guerra','showRoom("war");await W_(300)'],
  ['quartel: generais','showRoom("gen");await W_(300)'],
  ['quartel: chancelaria','showRoom("dip");await W_(300)'],
  ['batalha: antes','closeHQ();await W_(400);const t=ix.RJ,f=adj[t][0];reset();startAs(f);owner[t]=t;troops[f]=30;troops[t]=26;startBattle(f,t,29,0);await W_(1500)'],
  ['batalha: preparação','document.querySelector("#card [data-s=bgo]")?.click();await W_(500);scr();ui();await W_(500)'],
  ['batalha: em curso','document.querySelector("[data-a=bstart]")?.click();await W_(1600);const u=alive(B.ps).find(v=>v.type=="inf"&&!v.ld);B.selU=u;ui();await W_(300)'],
  ['batalha: menu da unidade','const u=B.selU;battleCmd(u);await W_(400)'],
  ['batalha: regras','closeCmd();bHelp=true;ui();await W_(300);bHelp=false'],
  ['batalha: resultado','B=null;scr();ui();xp[me][0]=4;showBRes({perks:[{st:me,j:0,n:"Voluntários da Bahia",type:"inf"},{st:me,j:2,n:"Atiradores",type:"ati"}],to:ix.SP,kind:Object.keys(KIND)[0],e:owner[ix.SP],win:true,l0:3,l1:9,vg:4,lv:["Atiradores nível 1"],best:"Atiradores, 3 golpes",stars:2,card:"polvora",cap:1,seen:1});await W_(500)'],
  ['jogo a dois: vez','scr();duoPick=1;reset();pickI=ix.BA;showSetup();document.querySelector("#card [data-s=go]").click();await W_(200);pickI=ix.PE;showSetup();document.querySelector("#card [data-s=go]").click();await W_(300);CFG.confirm=0;document.querySelector("[data-a=end]").click();await W_(600)'],
  ['desafio do dia: fim','scr();startDaily();await W_(300);turn=16;onTurn();await W_(500)'],
  ['fim de campanha','scr();reset();startAs(ix.BA);owner=owner.map(()=>me);stats.won=12;stats.stars=20;victory=true;over="x";showEnd();await W_(800)'],
];
const TAM=(process.env.TAM||'1280x720,1440x900,1920x1080').split(',').map(s=>s.split('x').map(Number));
const FOTOS=process.env.FOTOS;if(FOTOS)mkdirSync(FOTOS,{recursive:true});
const res={};
for(const [w,h] of TAM){
  await cmd('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
  await cmd('Page.navigate',{url:URL_});await sleep(2500);
  if(process.env.EN){await ev(`localStorage.setItem('tb-cfg','{"lang":"en"}');location.reload()`).catch(()=>{});await sleep(2800)}
  await ev(`window.W_=ms=>new Promise(r=>setTimeout(r,ms));localStorage.setItem('tb-tut','1');localStorage.setItem('tb-ft','{"prep":1,"hq":1,"camp":1,"dip":1,"cards":1,"rival":1,"duo":1,"daily":1,"march":1,"mkt":1,"bmoral":1,"bflank":1,"bgrp":1}');${PRE}${AUD}`);
  for(const [n,code] of S){let o;try{await ev(code);o=await ev('return AUD()')}catch(e){o=[{t:'erro ao montar a tela',el:'',tx:e.message,i:''}]}
    for(const q of o){const k=n+'|'+q.t+'|'+q.el+'|'+q.tx;(res[k]=res[k]||{n,...q,tam:[]}).tam.push(w+'x'+h)}
    if(FOTOS){const sh=await cmd('Page.captureScreenshot',{format:'png'});writeFileSync(join(FOTOS,`${w}-${n.replace(/[^a-zà-ú0-9]+/gi,'_')}.png`),Buffer.from(sh.result.data,'base64'))}}}
const L=Object.values(res);const by={};L.forEach(q=>(by[q.n]=by[q.n]||[]).push(q));
for(const [n] of S){const q=by[n];if(!q)continue;console.log(`\n■ ${n}`);q.forEach(x=>console.log(`  ${x.t} · ${x.el} · "${x.tx}" · ${x.i} · [${x.tam.join(' ')}]`))}
const tipos={};L.forEach(q=>tipos[q.t]=(tipos[q.t]||0)+1);console.log('\nTotal:',L.length,JSON.stringify(tipos));
chrome.kill();srv.close();process.exit(L.length?1:0); // falha se achar qualquer problema
