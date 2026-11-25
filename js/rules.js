// regras da campanha e IA estratégica; sem DOM, roda também no simulador (tools/sim.js)
// regras
const hash=(a,b)=>(a*73856093^b*19349663)>>>0;
const gs=i=>{const v=hash(i+3,7);return[40+v%60,40+(v>>6)%60,40+(v>>12)%60]}; // general do estado: liderança, astúcia, política
const trait=(i,t)=>S[i][5]==t?S[i][6]:0;
const nOwn=f=>owner.reduce((a,o)=>a+(o==f),0);
// a IA ganha doutrinas conforme cresce: Guerrilha com 4 estados, Logística com 7
let duo=null; // jogo a dois no mesmo computador: {p:[jogador 1, jogador 2], ctx:{facção: estado guardado de quem não está jogando agora}}
const isHum=f=>f==me||!!duo&&duo.p.includes(f),hctx=f=>f==me?{pact,angry,betray,hq}:duo?.ctx?.[f]||null; // relações e quartel vistos por um jogador humano
const docOn=(f,id)=>{const h=isHum(f)?hctx(f)?.hq:null;return h?!!h.doc[id]:id=='gue'?nOwn(f)>=4:id=='log'?nOwn(f)>=7:false};
const inc=i=>3+trait(i,'gold')+(gs(i)[2]>70?1:0)+(port[i]?1:0)+(boost[i]||0)+resInc(i), cost=i=>S[i][5]=='rec'||docOn(owner[i],'log')?1:2, fcost=()=>hq.doc.eng?2:3;
// doutrinas do quartel-general: id, nome, efeito, custo
const DOC=[['log','Logística','Recrutar custa 1 de ouro em todos os seus estados',12],['eng','Engenharia','Fortes custam 2 de ouro',8],['gue','Guerrilha','+15% de defesa em todos os seus estados',10]];
const roll=()=>.7+Math.random()*.6;
const AGG=[[1.6,.45],[1.3,.6],[1.1,.8]],TRUCE=[8,6,4]; // por dificuldade: vantagem exigida, chance de atacar, turnos de trégua com o jogador
let owner,troops,gold,me,sel,moved,turn,over,marching,logs,onStory=()=>{},onFight=()=>{},onMarch=()=>{},tactical=null,raids=[]; // raids: ataques da IA ao jogador, à espera da defesa tática
// cartas de estratégia: id -> [nome, tipo, custo em Comando, alvo, descrição, ícone]
const CARDS={marcha:['Marcha forçada','mapa',1,'own','Um território seu que já marchou pode marchar de novo neste turno.','horse'],
  requis:['Requisição','mapa',1,'none','Ouro de guerra: +4, mais 1 por território seu.','coin'],
  levas:['Leva de voluntários','mapa',2,'own','+5 tropas num território seu.','flag'],
  palic:['Paliçada','mapa',1,'own','Ergue um nível de forte de graça (até o nível 2).','wall'],
  sabot:['Sabotagem','mapa',2,'enemy','Agentes queimam paióis: o território inimigo perde um terço das tropas.','bomb'],
  panfl:['Panfletos','mapa',3,'enemyAdj','Território inimigo vizinho com até 4 tropas troca de lado e se junta a você.','scroll'],
  embax:['Embaixada','mapa',2,'enemy','Pacto de não agressão de graça por 4 turnos com o dono do território.','dove'],
  correio:['Correio a cavalo','mapa',1,'none','Compre 2 cartas.','letter'],
  embosc:['Emboscada','batalha',1,'none','Nesta rodada, suas unidades em mata ou vila causam +40% de dano.','tree'],
  fogo:['Ataque de fogo','batalha',2,'foe','Incendeia uma unidade inimiga: ela perde 40% das tropas.','fire'],
  reforco:['Reforços','batalha',2,'none','+2 tropas em cada unidade sua no campo.','plus'],
  carga:['Toque de carga','batalha',1,'none','Nesta rodada, suas unidades andam +2 casas.','horn']};
Object.assign(CARDS,{ // cartas da história do Brasil: vêm de acontecimentos, batalhas, conselho, regiões, rivais e do líder (como em Samurai Warriors Empires)
  grito:['Grito do Ipiranga','mapa',2,'none','+1 tropa em cada território seu e +1 de Comando.','crown'],
  tropeiros:['Rota de tropeiros','mapa',1,'own','O território passa a render +1 ouro por turno, para sempre.','horse'],
  quilombo:['Quilombo','mapa',2,'own','+4 tropas e um nível de forte num território seu.','tree'],
  bloqueio:['Bloqueio naval','mapa',2,'coast','Território inimigo no litoral perde 40% das tropas.','boat'],
  alforria:['Cartas de alforria','mapa',1,'none','+2 tropas nos 3 territórios seus de fronteira mais fracos.','letter'],
  bandeira:['Bandeirantes','mapa',3,'enemyAdj6','Território inimigo vizinho com até 6 tropas passa para você, sem luta.','flag'],
  engenho:['Safra do engenho','mapa',1,'none','+2 ouro por território seu com açúcar ou café (mínimo 3).','coin'],
  imprensa:['Imprensa livre','mapa',2,'none','+1 de Comando agora e compre 2 cartas.','scroll'],
  jangada:['Jangadeiros','mapa',1,'ownCoast','Porto de graça num território seu no litoral.','boat'],
  missa:['Missa campal','batalha',1,'none','+25 de moral em todas as suas unidades; quem fugia volta à luta.','cross'],
  polvora:['Pólvora de Ipanema','batalha',2,'none','Nesta rodada, atiradores, jagunços e artilharia causam +40% de dano.','bomb'],
  lanceiros:['Lanceiros Negros','batalha',2,'none','Nesta rodada, sua cavalaria anda +2 e causa +30% de dano.','spear'],
  barricada:['Barricadas','batalha',1,'none','Nesta rodada, suas unidades recebem 25% menos dano.','wall']});
const CRAR={sabot:'r',embax:'r',fogo:'r',reforco:'r',panfl:'r',tropeiros:'r',quilombo:'r',bloqueio:'r',imprensa:'r',jangada:'r',polvora:'r',grito:'l',bandeira:'l',lanceiros:'l'},
  rarOf=id=>CRAR[id]||'c',RARN={c:'Comum',r:'Rara',l:'Lendária'},cardsOf=r=>Object.keys(CARDS).filter(k=>rarOf(k)==r); // raridade: lendárias só por fontes especiais
const SIGC={SP:'bandeira',RJ:'grito',RS:'lanceiros',BA:'alforria',PE:'imprensa',MG:'tropeiros',GO:'tropeiros',SC:'barricada',AL:'quilombo',MA:'quilombo',CE:'jangada'},
  REGC=['quilombo','jangada','tropeiros','grito','lanceiros']; // carta do líder e carta de cada região (na ordem de REG)
const sigCard=f=>SIGC[S[f][0]]||REGC[REG.findIndex(([,st])=>st.includes(f))]||'missa';
const POSTS={com:['Comércio','política'],mil:['Guerra','liderança'],est:['Estratégia','astúcia'],dip:['Diplomacia','política']}; // cargos dos generais
let hand=[],cmd=0,posts={},boost=[]; // mão de cartas, pontos de Comando, cargos (cargo -> território do general), renda extra por território
const postOk=k=>posts[k]>=0&&owner[posts[k]]==me;
const cmdMax=()=>3+(postOk('est')?1:0);
const postGold=()=>postOk('com')?Math.floor(gs(posts.com)[2]/25):0, postTroops=()=>postOk('mil')?Math.floor(gs(posts.mil)[0]/30):0;
// temperamento: cada líder negocia e guerreia de um jeito, conforme a vocação
const TEMP={atk:['Belicoso','ataca mais cedo e com menos vantagem; só firma pacto com quem é forte'],def:['Cauteloso','ataca pouco; só aceita aliança depois de um pacto'],
  gold:['Negociante','tratados custam 30% menos; aceita tributo com mais facilidade'],rec:['Populista','recruta muito; nunca paga tributo']};
const tempOf=f=>TEMP[S[f][5]]||TEMP.def,tk=f=>S[f][5]||'def';
const strength=f=>owner.reduce((a,o,i)=>a+(o==f?troops[i]:0),0);
const dipCost=(k,f)=>Math.ceil(DIP[k][1]*(postOk('dip')?.5:1)*(f!=null&&tk(f)=='gold'?.7:1));
function drawCards(n){for(let k=0;k<n&&hand.length<6;k++){const p=cardsOf(Math.random()<.12?'r':'c');hand.push(p[Math.random()*p.length|0])}} // o sorteio do turno traz quase só comuns
function cardOk(id,t){const c=CARDS[id];if(!c||cmd<c[2]||c[1]!='mapa')return false;
  if(c[3]=='own')return t>=0&&owner[t]==me&&(id!='marcha'||moved.has(t))&&(id!='palic'||fort[t]<2);
  if(c[3]=='enemy')return t>=0&&owner[t]!=me&&(id!='embax'||!(pact[owner[t]]>turn));
  if(c[3]=='enemyAdj')return t>=0&&owner[t]!=me&&troops[t]<=4&&!(pact[owner[t]]>turn)&&adj[t].some(j=>owner[j]==me);
  if(c[3]=='enemyAdj6')return t>=0&&owner[t]!=me&&troops[t]<=6&&!(pact[owner[t]]>turn)&&adj[t].some(j=>owner[j]==me);
  if(c[3]=='coast')return t>=0&&owner[t]!=me&&COAST.includes(t)&&!(pact[owner[t]]>turn);
  if(c[3]=='ownCoast')return t>=0&&owner[t]==me&&COAST.includes(t)&&!port[t];
  return true}
function playCard(id,t){const c=CARDS[id];cmd-=c[2];hand.splice(hand.indexOf(id),1);
  if(id=='marcha'){moved.delete(t);note(`Marcha forçada em ${S[t][1]}`)}
  if(id=='requis'){const g=4+nOwn(me);gold[me]+=g;note(`Requisição: +${g} ouro`)}
  if(id=='levas'){troops[t]+=5;note(`Voluntários: +5 tropas em ${S[t][1]}`)}
  if(id=='palic'){fort[t]++;note(`Paliçada: forte nível ${fort[t]} em ${S[t][1]}`)}
  if(id=='sabot'){const k=Math.ceil(troops[t]/3);troops[t]=Math.max(1,troops[t]-k);burn[t]=turn;note(`Sabotagem em ${S[t][1]}: −${k} tropas`)}
  if(id=='panfl'){const was=owner[t];owner[t]=me;fort[t]=0;moved.add(t);note(`${S[t][1]} abandona ${S[was][4]} e se junta a você!`)}
  if(id=='embax'){pact[owner[t]]=Math.max(pact[owner[t]]||0,turn+4);note(`Embaixada: pacto com ${S[owner[t]][4]} até o turno ${turn+4}`)}
  if(id=='correio'){drawCards(2);note('Correio a cavalo: 2 cartas novas')}
  if(id=='grito'){owner.forEach((o,i)=>{if(o==me)troops[i]++});cmd++;note('Grito do Ipiranga: +1 tropa em cada território e +1 de Comando')}
  if(id=='tropeiros'){boost[t]=(boost[t]||0)+1;note(`Rota de tropeiros: ${S[t][1]} rende +1 ouro por turno`)}
  if(id=='quilombo'){troops[t]+=4;fort[t]=Math.min(2,fort[t]+1);note(`Quilombo em ${S[t][1]}: +4 tropas e forte nível ${fort[t]}`)}
  if(id=='bloqueio'){const k=Math.ceil(troops[t]*.4);troops[t]=Math.max(1,troops[t]-k);burn[t]=turn;note(`Bloqueio naval em ${S[t][1]}: −${k} tropas`)}
  if(id=='alforria'){const b=owner.map((o,i)=>o==me&&adj[i].some(j=>owner[j]!=me)?i:-1).filter(i=>i>=0).sort((p,q)=>troops[p]-troops[q]).slice(0,3);b.forEach(i=>troops[i]+=2);note(`Cartas de alforria: +2 tropas em ${b.map(i=>S[i][0]).join(', ')||'nenhum território'}`)}
  if(id=='bandeira'){const was=owner[t];owner[t]=me;fort[t]=0;moved.add(t);note(`Bandeirantes tomam ${S[t][1]} de ${S[was][4]}!`)}
  if(id=='engenho'){const k=owner.filter((o,i)=>o==me&&['acu','caf'].includes(resOf(i))).length,g=Math.max(3,2*k);gold[me]+=g;note(`Safra do engenho: +${g} ouro`)}
  if(id=='imprensa'){cmd++;drawCards(2);note('Imprensa livre: +1 de Comando e 2 cartas')}
  if(id=='jangada'){buildPort(t);note(`Jangadeiros: porto em ${S[t][1]}`)}
  stats.cards=(stats.cards||0)+1;
  check()}
let hist=[],evts=[],burn=[],lastLoss=-9,onNote=()=>{},scn=0,goal=null,victory=false,fort,stats,endShown,hq,xp,port,pact,ally,trib,angry,betray,perk={},tld=[],price={},priceOld={},onTurn=()=>{}; // xp: experiência dos 6 regimentos de cada estado; pact/ally/trib/angry: facção -> turno em que acaba // hq: treino por tipo de unidade, doutrinas, turno do último imposto // fort: nível do forte por estado (0-2), +20% defesa cada
let onDip=()=>{},onIncome=()=>{},onDuoUpkeep=null; // ganchos da interface: tratado firmado, renda do turno, troca de jogador
function reset(sc=0){scn=sc;duo=null;hist=[];hand=[];cmd=0;posts={com:-1,mil:-1,est:-1,dip:-1};boost=S.map(()=>0);evts=[];burn=S.map(()=>-9);lastLoss=-9;goal=null;victory=false;owner=S.map((_,i)=>i);troops=S.map(()=>4+Math.floor(Math.random()*5));gold=S.map(()=>6);
  const own=SCN[sc].own||{},bon=SCN[sc].bonus||{};for(const f in own)own[f].forEach(i=>{owner[i]=+f;troops[i]+=3+(bon[f]||0)});
  me=-1;sel=-1;moved=new Set;turn=1;over='';marching=false;logs=[];raids=[];fort=S.map(()=>0);stats={won:0,lost:0,taken:0};endShown=false;hq={tech:{inf:0,cav:0,ati:0,art:0},doc:{},tax:0};xp=S.map(()=>Array(12).fill(0));port=S.map(()=>0);pact={};ally={};trib={};angry={};betray=0;perk={};tld=[];price=Object.fromEntries(Object.keys(RESN).map(r=>[r,1]));priceOld={...price};linkPorts()}
const lvl=v=>Math.min(3,v/2|0); // nível do regimento: a cada 2 de experiência, até 3
function linkPorts(){portLinks=[];adj.forEach((a,i)=>{a.length=0;a.push(...ADJ0[i])});
  COAST.forEach((i,p)=>COAST.forEach((j,q)=>{if(q>p&&q-p<=4&&(port[i]||port[j])&&!adj[i].includes(j)){adj[i].push(j);adj[j].push(i);portLinks.push([i,j])}}))}
function buildPort(i){port[i]=1;linkPorts()}
// diplomacia: pacto (não agressão), aliança (pacto + reforço na fronteira), tributo (exigir ouro)
const DIP={pact:['Pacto de não agressão',6,5],ally:['Aliança',12,8]};
const border=f=>owner.map((o,i)=>o==me&&adj[i].some(j=>owner[j]==f)?i:-1).filter(i=>i>=0);
function dipState(k,f){ // devolve motivo de bloqueio, ou '' se pode
  if(duo&&duo.p.includes(f))return'Outro jogador: combinem na mesa';
  if(k=='trib')return trib[f]>turn?`Já cobrado; de novo no turno ${trib[f]}`:!border(f).length?'Sem fronteira com você':tk(f)=='rec'?'Populista: nunca paga tributo':'';
  return ally[f]>turn?(k=='pact'?'Incluso na aliança':'Aliança em vigor'):k=='pact'&&pact[f]>turn?'Pacto em vigor':betray>turn?'Não confiam em traidores':
    tk(f)=='atk'&&strength(me)<strength(f)*.8?'Belicoso: só trata com quem é forte':k=='ally'&&tk(f)=='def'&&!(pact[f]>turn)?'Cauteloso: quer um pacto antes':gold[me]<dipCost(k,f)?'Ouro insuficiente':''}
function dipAct(k,f){
  if(k=='trib'){trib[f]=turn+3;const mine=border(f).reduce((a,i)=>a+troops[i],0),theirs=owner.reduce((a,o,i)=>a+(o==f?troops[i]:0),0);
    if(mine>theirs*(tk(f)=='gold'?1.4:1.8)){const g=Math.ceil(income(f)*1.5);gold[f]-=g;gold[me]+=g;note(`${S[f][4]} paga tributo de ${g} ouro`);return true}
    angry[f]=turn+4;note(`${S[f][4]} recusa o tributo e jura vingança`);return false}
  const[n,,d]=DIP[k];gold[me]-=dipCost(k,f);pact[f]=Math.max(pact[f]||0,turn+d);if(k=='ally')ally[f]=turn+d;note(`${n} ${k=='ally'?'firmada':'firmado'} com ${S[f][4]}`);stats.dip=(stats.dip||0)+1;onDip(k,f);return true}
const income=f=>(f==me?postGold():0)+(SCN[scn].sub?.[f]&&owner.includes(f)?SCN[scn].sub[f]:0)+owner.reduce((a,o,i)=>a+(o==f?inc(i):0),0)+ // sub: reforços da Corte por turno
  REG.reduce((a,[,st,b])=>a+(st.every(i=>owner[i]==f)?b:0),0);
const defOf=i=>trait(i,'def')+.2*fort[i]+(docOn(owner[i],'gue')?.15:0);
function fight(a,b,n){ // n tropas de a atacam b; devolve true se conquistou
  if(me>=0&&(owner[a]==me||owner[b]==me)){const t=n+troops[b];if(!stats.bigB||t>stats.bigB.n)stats.bigB={n:t,st:b,turn}} // maior batalha da partida
  const pa=n*(1+trait(a,'atk'))*roll(), pd=troops[b]*(1+defOf(b))*roll()+1;
  troops[a]-=n;
  if(pa>pd){burn[b]=turn;if(owner[b]==me)lastLoss=turn;xp[a]=xp[a].map(v=>v+1);xp[b]=[...xp[a]];fort[b]=0;owner[b]=owner[a];troops[b]=Math.max(1,Math.round(n*(1-.7*pd/pa)));return true}
  xp[b]=xp[b].map(v=>v+1);troops[b]=Math.max(1,Math.round(troops[b]*(1-.7*pa/pd)));troops[a]+=Math.round(n*.3);return false}
function ai(f){
  gold[f]+=income(f);
  const mine=owner.map((o,i)=>o==f?i:-1).filter(i=>i>=0),[need0,chance0]=AGG[CFG.diff],T_=tk(f),need=need0*(T_=='atk'?.88:T_=='def'?1.15:1),chance=chance0*(T_=='atk'?1.3:T_=='def'?.7:T_=='gold'?.85:1); /* temperamento mexe na agressão */
  const foes=i=>adj[i].filter(j=>owner[j]!=f);
  const threat=i=>foes(i).reduce((a,j)=>a+troops[j],0);
  const border=mine.filter(i=>foes(i).length).sort((a,b)=>threat(b)-threat(a));
  if(border.length){const t=border[0];if(gold[f]>=8&&fort[t]<2&&Math.random()<.3){fort[t]++;gold[f]-=3} // a IA também ergue fortes na fronteira
    const n=Math.max(0,Math.floor(gold[f]/cost(t)));troops[t]+=n+(T_=='rec'&&turn%2?1:0);gold[f]-=n*cost(t)} /* populista ganha voluntários */
  if(gold[f]>=5&&Math.random()<.08){const c=mine.find(i=>COAST.includes(i)&&!port[i]);if(c!=null){buildPort(c);gold[f]-=5}} // a IA também constrói portos
  for(const i of mine){
    if(owner[i]!=f||troops[i]<2)continue;
    const fs=foes(i).sort((a,b)=>troops[a]-troops[b]);
    if(!fs.length){const to=adj[i].find(j=>foes(j).length)??adj[i][0];troops[to]+=troops[i]-1;troops[i]=1;continue}
    const j=fs[0],H=hctx(owner[j]); // H: o dono é um jogador humano (pactos e trégua valem para os dois no jogo a dois)
    if(troops[i]-1>troops[j]*(1+defOf(j))*need+1&&Math.random()<chance*Math.min(1,.3+turn/10)*(H&&(H.betray>turn||H.angry[f]>turn)?1.5:1) // agressão cresce com os turnos
      &&!(H&&(turn<(TKEY=='brasil'?TRUCE[CFG.diff]:2)||H.pact[f]>turn))){ // trégua inicial e pactos poupam o jogador
      if(isHum(owner[j])&&tactical&&!CFG.tac){raids.push({from:i,to:j,f,hum:owner[j]});continue} // no jogo a dois, quem espera a vez também defende na batalha tática
      const was=owner[j],won=fight(i,j,troops[i]-1);evts.push({f,a:i,b:j,won,was});
      if(won)(was==me?note:say)(`${S[f][4]} tomou ${was==me?S[j][1]+' de você!':S[j][0]}`);
      else if(was==me)say(`Você repeliu ${S[f][4]} em ${S[j][0]}`);
      if(was==me)onFight(f,was,j,won)}}}
function say(t){logs.unshift(t);logs.length=Math.min(logs.length,80)}
function note(t){say(t);onNote(t)} // vai para a crônica e aparece como aviso na tela
const setGoal=()=>{goal=SCN[scn].play?.[me]||null};
function freshHuman(){hand=[];cmd=0;posts={com:-1,mil:-1,est:-1,dip:-1};stats={won:0,lost:0,taken:0};hq={tech:{inf:0,cav:0,ati:0,art:0},doc:{},tax:0};pact={};ally={};trib={};angry={};betray=0;moved=new Set} // segundo jogador começa do zero
function startAs(f){me=f;setGoal();gold[me]+=6;troops[me]+=3;hand=[sigCard(f)];drawCards(2);cmd=cmdMax()} // começa com a carta do seu líder // pequena vantagem na capital de quem joga
function odds(a,b,n){ // chance de vencer e tropas que sobram, pelos mesmos dados do combate automático
  let w=0,left=0;const A=n*(1+trait(a,'atk')),Dd=troops[b]*(1+defOf(b));
  for(let k=0;k<300;k++){const pa=A*roll(),pd=Dd*roll()+1;if(pa>pd){w++;left+=Math.max(1,Math.round(n*(1-.7*pd/pa)))}}return[w/300,w?Math.round(left/w):0]}
const danger=i=>owner[i]==me&&adj[i].some(j=>owner[j]!=me&&!(pact[owner[j]]>turn)&&troops[j]-1>troops[i]*(1+defOf(i))*1.2+1); // vizinho capaz de tomar o território
function check(){const n=owner.filter(o=>o==me).length;
  if(n==N){over='O Brasil é seu!';victory=true}else if(goal&&goal.every(i=>owner[i]==me)){over='Objetivo cumprido!';victory=true}else if(!n)over='Seu domínio caiu.'}
function endTurn(){evts=[];
  for(let f=0;f<N;f++)if(!isHum(f)&&owner.includes(f))ai(f);
  if(!raids.length)closeTurn()} // com raids, a UI joga as defesas e depois fecha o turno
// recursos: cada território produz um; o preço muda a cada turno; três ou mais do mesmo dono formam monopólio
const RESN={caf:['Café',1.5,'do café'],acu:['Açúcar',1.5,'do açúcar'],bor:['Borracha',1.5,'da borracha'],our:['Ouro',2,'do ouro'],gad:['Gado e charque',1,'do charque'],alg:['Algodão',1,'do algodão'],erv:['Erva-mate',1,'da erva-mate'],cac:['Cacau',1.2,'do cacau']};
const RES_BY={AC:'bor',AM:'bor',RR:'gad',RO:'bor',PA:'cac',AP:'our',TO:'gad',MA:'alg',PI:'gad',CE:'alg',RN:'alg',PB:'alg',PE:'acu',AL:'acu',SE:'acu',BA:'cac',MT:'gad',GO:'our',DF:'',MS:'gad',MG:'our',ES:'caf',RJ:'caf',SP:'caf',PR:'erv',SC:'erv',RS:'gad'},
  BIO_RES={ama:'bor',ser:'gad',cer:'gad',sud:'caf',sul:'erv',mata:'acu',pampa:'gad'};
const resOf=i=>{const c=S[i][0];return c in RES_BY?RES_BY[c]:BIO_RES[BOF[i]]||''};
const mono=(f,r)=>owner.filter((o,j)=>o==f&&resOf(j)==r).length>=3;
const resInc=i=>{const r=resOf(i);if(!r||!price[r])return 0;return Math.round(RESN[r][1]*price[r]*(port[i]?1.25:1))+(mono(owner[i],r)?1:0)};
function updPrices(){priceOld={...price};for(const r in RESN){let p=price[r]||1;p+=(1-p)*.12+(Math.random()-.5)*.22;
  if(Math.random()<.06){const up=Math.random()<.5;p*=up?1.45:.65;if(me>=0&&owner.some((o,j)=>o==me&&resOf(j)==r))note(`${up?'Alta':'Queda'} no preço ${RESN[r][2]}`)}
  price[r]=Math.round(Math.max(.5,Math.min(2.2,p))*100)/100}}
function closeTurn(){updPrices();hist.push(owner.slice());if(hist.length>200)hist.shift(); /* histórico para o balanço */
  if(duo&&onDuoUpkeep)onDuoUpkeep();else upkeep();turn++;marching=false;check();if(!over)onTurn()}
function upkeep(){ /* começo do turno de quem joga: cargos, reforços, cartas, aliados e renda */
  for(const k in posts)if(posts[k]>=0&&owner[posts[k]]!=me){note(`${S[posts[k]][4]} deixou o cargo de ${POSTS[k][0]}: ${TW1} perdido`);posts[k]=-1} // cargo vago quando o território cai
  {const t=postTroops();if(t){const own=owner.map((o,i)=>o==me?i:-1).filter(i=>i>=0),b=own.find(danger)??own.find(i=>adj[i].some(j=>owner[j]!=me))??own[0];if(b!=null){troops[b]+=t;onNote(`Guerra: +${t} tropas em ${S[b][1]}`)}}}
  cmd=cmdMax();drawCards(1+(postOk('est')&&gs(posts.est)[1]>=60?1:0));
  const help=new Set;for(const f in ally)if(ally[f]>turn&&owner.includes(+f))border(+f).forEach(i=>help.add(i)); // aliados reforçam a fronteira comum
  [...help].slice(0,3).forEach(i=>troops[i]++);if(help.size)note(`Reforço aliado: +1 tropa em ${Math.min(3,help.size)} estado(s)`);
  {const g=income(me);gold[me]+=g;onNote(`${duo?S[me][4]+': ':''}Turno ${turn+1}: +${g} ouro`);onIncome(g)}moved.clear()}
function act(to){ // marcha de sel para to
  const n=+(document.getElementById('n')?.value||troops[sel]-1),from=sel;
  if(owner[to]!=me&&pact[owner[to]]>turn){const vf=owner[to];pact={};ally={};betray=turn+5;note('Traição! Pactos rompidos, vizinhos enfurecidos');onStory('betray',vf)}
  if(owner[to]==me){troops[from]-=n;troops[to]+=n;onMarch(from,to)}
  else if(tactical&&CFG.tac<2){marching=false;return tactical(from,to,n)}
  else{const was=owner[to],won=fight(from,to,n);
    say(won?`Você conquistou ${S[to][1]} de ${S[was][4]}`:`Derrota em ${S[to][1]}`);onFight(me,was,to,won)}
  moved.add(from).add(to);marching=false;sel=to;check()}

