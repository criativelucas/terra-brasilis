// Testes de fumaça no navegador: node tools/test.mjs
// Sobe um servidor local, abre o jogo no Chrome sem janela e passa por todas as telas, cartas, quartel,
// desafio do dia, jogo a dois e batalhas automáticas. Falha se aparecer erro de JavaScript, NaN ou undefined na tela.
// EN=1 roda tudo em inglês. Chrome: caminho padrão do macOS, ou defina CHROME=/caminho/do/chrome. Regras sem tela: node tools/sim.js
import {createServer} from 'node:http';import {spawn} from 'node:child_process';import {readFileSync,existsSync,mkdtempSync} from 'node:fs';
import {join,extname,dirname} from 'node:path';import {tmpdir} from 'node:os';import {fileURLToPath} from 'node:url';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..'),MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json'};
const srv=createServer((q,r)=>{const f=join(ROOT,decodeURIComponent(new URL(q.url,'http://x').pathname).replace(/\/$/,'/index.html'));
  if(!f.startsWith(ROOT)||!existsSync(f)){r.writeHead(404);return r.end()}r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(readFileSync(f))});
await new Promise(r=>srv.listen(0,'127.0.0.1',r));const URL_=`http://127.0.0.1:${srv.address().port}/?teste`;
const CH=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',PORT=9400+Math.random()*400|0;
const chrome=spawn(CH,['--headless=new',`--remote-debugging-port=${PORT}`,'--window-size=1440,900',...(process.env.CI?['--no-sandbox']:[]),`--user-data-dir=${mkdtempSync(join(tmpdir(),'tb-'))}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ws;
for(let i=0;i<60&&!ws;i++){try{const p=(await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find(t=>t.type=='page');if(p){ws=new WebSocket(p.webSocketDebuggerUrl);break}}catch{}await sleep(250)}
if(!ws){console.log('Chrome não abriu. Defina CHROME=/caminho/do/chrome');process.exit(2)}
await new Promise(r=>ws.onopen=r);let id=0;const pend={};ws.onmessage=e=>{const m=JSON.parse(e.data);pend[m.id]?.(m)};
const cmd=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}))});
const ev=async code=>{const r=await cmd('Runtime.evaluate',{expression:`(async()=>{${code}})()`,awaitPromise:true,returnByValue:true});
  if(r.result?.exceptionDetails)throw new Error(r.result.exceptionDetails.exception?.description||'exceção');return r.result?.result?.value};
await cmd('Page.navigate',{url:URL_});await sleep(3000);
if(process.env.EN){await cmd('Runtime.evaluate',{expression:`localStorage.setItem('tb-cfg','{"lang":"en"}');location.reload()`});await sleep(3000)} // EN=1 node tools/test.mjs: testa a versão em inglês
await ev(`for(let i=0;i<40&&typeof ui!='function';i++)await new Promise(r=>setTimeout(r,250));window.errs=[];addEventListener('error',e=>errs.push(e.message+' '+(e.filename||'').split('/').pop()+':'+e.lineno));
  localStorage.setItem('tb-tut','1');localStorage.setItem('tb-ft','{"prep":1,"hq":1,"camp":1,"dip":1,"cards":1,"rival":1,"duo":1,"daily":1,"march":1}');tut=-1;CFG.speed=2;CFG.clash=0;CFG.calm=1;window.W_=ms=>new Promise(r=>setTimeout(r,ms))`);
const bad=`const t=document.body.innerText;return [...errs,...(/\\bNaN\\b|\\bundefined\\b/.test(t)?['NaN ou undefined na tela: '+(t.match(/.{0,40}(NaN|undefined).{0,40}/)||[''])[0]]:[])]`;
const T=[ // [nome, código que monta a situação]
  ['título','showTitle();await W_(300)'],
  ['mapa e ficha','reset();startAs(ix.BA);scr();sel=ix.BA;ui();await W_(500)'],
  ['exército','showArmy();await W_(200)'],['conselho','showCouncil();await W_(200)'],['crônica','showLog();await W_(200)'],
  ['mercado','scr();showMarket();await W_(200)'],['campanha','showCampaign();await W_(300)'],['enciclopédia','showEnc(me);await W_(200)'],
  ['coleção de cartas','showCards();await W_(200)'],['diplomacia','scr();showDip(owner[adj[me][0]]);await W_(200)'],['pausa','scr();menu(true);await W_(200);menu(false)'],
  ['acontecimento','showEvent();await W_(200);scr()'],['mensageiro rival','rivalOffer();await W_(200);document.querySelector("#card [data-s^=rv-]")?.click();await W_(200);scr()'],
  ['todas as cartas de mapa','gold[me]=99;for(const id of Object.keys(CARDS).filter(k=>CARDS[k][1]=="mapa")){cmd=9;hand=[id];const t=S.map((_,j)=>j).find(j=>cardOk(id,j))??-1;if(cardOk(id,t))playCard(id,t)}ui();await W_(300)'],
  ['quartel e salas','openHQ();await W_(800);for(const r of ["bar","tes","war","gen","dip"]){showRoom(r);await W_(150)}closeHQ();await W_(300)'],
  ['desafio do dia','startDaily();await W_(300);turn=16;onTurn();await W_(300);scr()'],
  ['jogo a dois','duoPick=1;reset();showSetup();pickI=ix.BA;document.querySelector("#card [data-s=go]").click();await W_(200);pickI=ix.PE;showSetup();document.querySelector("#card [data-s=go]").click();await W_(300);CFG.confirm=0;document.querySelector("[data-a=end]").click();await W_(400);if(me!=duo.p[1])throw new Error("não passou a vez");document.querySelector("#card [data-s=duogo]").click();await W_(200)'],
  ['oficiais e lealdade','reset();startAs(ix.BA);scr();owner[ix.SE]=me;loy[ix.SE]=15;gold[me]=60;const a=aidePool()[0];if(!hireAide(a[0]))throw new Error("não contratou");openHQ();await W_(700);showRoom("gen");await W_(300);document.querySelector("[data-s^=hq-hon-]")?.click();await W_(200);if(loyOf(ix.SE)<30)throw new Error("honrar não subiu a lealdade");closeHQ();await W_(300)'],
  ['cartas com nível e combo','gold[me]=50;cardUse={};for(let k=0;k<5;k++){cmd=9;hand=["requis"];playCard("requis",-1)}if(cardLv("requis")!=3)throw new Error("carta não subiu de nível");const c0=cmd;cmb={turn:0,th:{}};cmd=9;hand=["levas","alforria"];playCard("levas",me);playCard("alforria",-1);if(cmb.th.povo!=2)throw new Error("combo não contou");ui();await W_(300)'],
  ['calendário','if(!/de 18\\d\\d/.test(calTxt(1))||calTxt(3)!="dezembro de 1822")throw new Error("data errada: "+calTxt(3))'],
  ['batalhas automáticas','for(const [st,ps] of [["RJ",0],["RS",1],["MG",0]]){reset();startAs(ix[st]);scr();const n=adj[me][0];troops[me]=26;troops[n]=20;ps?startBattle(n,me,19,1):startBattle(me,n,25,0);const b=B;await bEnd(true);for(let i=0;i<600&&B===b;i++)await W_(100);if(B===b)throw new Error("batalha não terminou")}await W_(1500);scr()'],
];
let fail=0;
for(const [n,code] of T){let p;try{await ev(code);p=await ev(bad)}catch(e){p=[e.message.split('\n')[0]]}
  await ev('errs.length=0');console.log(p.length?'FALHOU':'ok    ',n,p.length?'· '+p.slice(0,3).join(' | '):'');if(p.length)fail++}
for(const th of ['balaiada','sabinada','males']){ // campanhas históricas: abrem, jogam dois turnos e uma batalha automática
  await cmd('Page.navigate',{url:URL_+'#'+th});await sleep(2500);let p;
  try{await ev(`for(let i=0;i<40&&typeof ui!='function';i++)await new Promise(r=>setTimeout(r,250));window.errs=[];addEventListener('error',e=>errs.push(e.message+' '+(e.filename||'').split('/').pop()+':'+e.lineno));tut=-1;CFG.speed=2;CFG.clash=0;CFG.calm=1;
    const pl=Object.keys(SCN[0].play).map(Number);reset();startAs(pl[0]);scr();ui();for(let k=0;k<2;k++){endTurn();if(raids.length){raids=[];closeTurn()}}scr();ui();
    const n=adj[me].find(j=>owner[j]!=me)??adj[me][0];troops[me]=24;troops[n]=14;startBattle(me,n,23,0);const b=B;await bEnd(true);for(let i=0;i<600&&B===b;i++)await new Promise(r=>setTimeout(r,100));if(B===b)throw new Error('batalha não terminou');
    await new Promise(r=>setTimeout(r,1500));scr();showEnc(me);await new Promise(r=>setTimeout(r,200))`);p=await ev(bad)}catch(e){p=[e.message.split('\n')[0]]}
  console.log(p.length?'FALHOU':'ok    ','campanha '+th,p.length?'· '+p.slice(0,3).join(' | '):'');if(p.length)fail++}
console.log(fail?`\n${fail} testes falharam`:`\nTodos os ${T.length+3} testes passaram`);
chrome.kill();srv.close();process.exit(fail?1:0);
