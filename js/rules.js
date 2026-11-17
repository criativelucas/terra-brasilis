// regras da campanha e IA estratégica; sem DOM, roda também no simulador (tools/sim.js)
// regras
const hash=(a,b)=>(a*73856093^b*19349663)>>>0;
const gs=i=>{const v=hash(i+3,7);return[40+v%60,40+(v>>6)%60,40+(v>>12)%60]}; // general do estado: liderança, astúcia, política
const trait=(i,t)=>S[i][5]==t?S[i][6]:0;
const nOwn=f=>owner.reduce((a,o)=>a+(o==f),0);
// a IA ganha doutrinas conforme cresce: Guerrilha com 4 estados, Logística com 7
const docOn=(f,id)=>f==me?!!hq.doc[id]:id=='gue'?nOwn(f)>=4:id=='log'?nOwn(f)>=7:false;
const inc=i=>3+trait(i,'gold')+(gs(i)[2]>70?1:0)+(port[i]?1:0), cost=i=>S[i][5]=='rec'||docOn(owner[i],'log')?1:2, fcost=()=>hq.doc.eng?2:3;
// doutrinas do quartel-general: id, nome, efeito, custo
const DOC=[['log','Logística','Recrutar custa 1 de ouro em todos os seus estados',12],['eng','Engenharia','Fortes custam 2 de ouro',8],['gue','Guerrilha','+15% de defesa em todos os seus estados',10]];
const roll=()=>.7+Math.random()*.6;
const AGG=[[1.6,.45],[1.3,.6],[1.1,.8]],TRUCE=[8,6,4]; // por dificuldade: vantagem exigida, chance de atacar, turnos de trégua com o jogador
let owner,troops,gold,me,sel,moved,turn,over,marching,logs,onFight=()=>{},onMarch=()=>{},tactical=null,raids=[]; // raids: ataques da IA ao jogador, à espera da defesa tática
let evts=[],burn=[],lastLoss=-9,onNote=()=>{},scn=0,goal=null,victory=false,fort,stats,endShown,hq,xp,port,pact,ally,trib,angry,betray,onTurn=()=>{}; // xp: experiência dos 6 regimentos de cada estado; pact/ally/trib/angry: facção -> turno em que acaba // hq: treino por tipo de unidade, doutrinas, turno do último imposto // fort: nível do forte por estado (0-2), +20% defesa cada
function reset(sc=0){scn=sc;evts=[];burn=S.map(()=>-9);lastLoss=-9;goal=null;victory=false;owner=S.map((_,i)=>i);troops=S.map(()=>4+Math.floor(Math.random()*5));gold=S.map(()=>6);
  const own=SCN[sc].own||{},bon=SCN[sc].bonus||{};for(const f in own)own[f].forEach(i=>{owner[i]=+f;troops[i]+=3+(bon[f]||0)});
  me=-1;sel=-1;moved=new Set;turn=1;over='';marching=false;logs=[];raids=[];fort=S.map(()=>0);stats={won:0,lost:0,taken:0};endShown=false;hq={tech:{inf:0,cav:0,ati:0,art:0},doc:{},tax:0};xp=S.map(()=>[0,0,0,0,0,0]);port=S.map(()=>0);pact={};ally={};trib={};angry={};betray=0;linkPorts()}
const lvl=v=>Math.min(3,v/2|0); // nível do regimento: a cada 2 de experiência, até 3
function linkPorts(){portLinks=[];adj.forEach((a,i)=>{a.length=0;a.push(...ADJ0[i])});
  COAST.forEach((i,p)=>COAST.forEach((j,q)=>{if(q>p&&q-p<=4&&(port[i]||port[j])&&!adj[i].includes(j)){adj[i].push(j);adj[j].push(i);portLinks.push([i,j])}}))}
function buildPort(i){port[i]=1;linkPorts()}
// diplomacia: pacto (não agressão), aliança (pacto + reforço na fronteira), tributo (exigir ouro)
const DIP={pact:['Pacto de não agressão',6,5],ally:['Aliança',12,8]};
const border=f=>owner.map((o,i)=>o==me&&adj[i].some(j=>owner[j]==f)?i:-1).filter(i=>i>=0);
function dipState(k,f){ // devolve motivo de bloqueio, ou '' se pode
  if(k=='trib')return trib[f]>turn?`Já cobrado; de novo no turno ${trib[f]}`:!border(f).length?'Sem fronteira com você':'';
  return ally[f]>turn?(k=='pact'?'Incluso na aliança':'Aliança em vigor'):k=='pact'&&pact[f]>turn?'Pacto em vigor':betray>turn?'Não confiam em traidores':gold[me]<DIP[k][1]?'Ouro insuficiente':''}
function dipAct(k,f){
  if(k=='trib'){trib[f]=turn+3;const mine=border(f).reduce((a,i)=>a+troops[i],0),theirs=owner.reduce((a,o,i)=>a+(o==f?troops[i]:0),0);
    if(mine>theirs*1.8){const g=Math.ceil(income(f)*1.5);gold[f]-=g;gold[me]+=g;note(`${S[f][4]} paga tributo de ${g} ouro`);return true}
    angry[f]=turn+4;note(`${S[f][4]} recusa o tributo e jura vingança`);return false}
  const[n,c,d]=DIP[k];gold[me]-=c;pact[f]=Math.max(pact[f]||0,turn+d);if(k=='ally')ally[f]=turn+d;note(`${n} ${k=='ally'?'firmada':'firmado'} com ${S[f][4]}`);return true}
const income=f=>(SCN[scn].sub?.[f]&&owner.includes(f)?SCN[scn].sub[f]:0)+owner.reduce((a,o,i)=>a+(o==f?inc(i):0),0)+ // sub: reforços da Corte por turno
  REG.reduce((a,[,st,b])=>a+(st.every(i=>owner[i]==f)?b:0),0);
const defOf=i=>trait(i,'def')+.2*fort[i]+(docOn(owner[i],'gue')?.15:0);
function fight(a,b,n){ // n tropas de a atacam b; devolve true se conquistou
  const pa=n*(1+trait(a,'atk'))*roll(), pd=troops[b]*(1+defOf(b))*roll()+1;
  troops[a]-=n;
  if(pa>pd){burn[b]=turn;if(owner[b]==me)lastLoss=turn;xp[a]=xp[a].map(v=>v+1);xp[b]=[...xp[a]];fort[b]=0;owner[b]=owner[a];troops[b]=Math.max(1,Math.round(n*(1-.7*pd/pa)));return true}
  xp[b]=xp[b].map(v=>v+1);troops[b]=Math.max(1,Math.round(troops[b]*(1-.7*pa/pd)));troops[a]+=Math.round(n*.3);return false}
function ai(f){
  gold[f]+=income(f);
  const mine=owner.map((o,i)=>o==f?i:-1).filter(i=>i>=0),[need,chance]=AGG[CFG.diff];
  const foes=i=>adj[i].filter(j=>owner[j]!=f);
  const threat=i=>foes(i).reduce((a,j)=>a+troops[j],0);
  const border=mine.filter(i=>foes(i).length).sort((a,b)=>threat(b)-threat(a));
  if(border.length){const t=border[0];if(gold[f]>=8&&fort[t]<2&&Math.random()<.3){fort[t]++;gold[f]-=3} // a IA também ergue fortes na fronteira
    const n=Math.max(0,Math.floor(gold[f]/cost(t)));troops[t]+=n;gold[f]-=n*cost(t)}
  if(gold[f]>=5&&Math.random()<.08){const c=mine.find(i=>COAST.includes(i)&&!port[i]);if(c!=null){buildPort(c);gold[f]-=5}} // a IA também constrói portos
  for(const i of mine){
    if(owner[i]!=f||troops[i]<2)continue;
    const fs=foes(i).sort((a,b)=>troops[a]-troops[b]);
    if(!fs.length){const to=adj[i].find(j=>foes(j).length)??adj[i][0];troops[to]+=troops[i]-1;troops[i]=1;continue}
    const j=fs[0];
    if(troops[i]-1>troops[j]*(1+defOf(j))*need+1&&Math.random()<chance*Math.min(1,.3+turn/10)*(owner[j]==me&&(betray>turn||angry[f]>turn)?1.5:1) // agressão cresce com os turnos
      &&!(owner[j]==me&&(turn<(TKEY=='brasil'?TRUCE[CFG.diff]:2)||pact[f]>turn))){ // trégua inicial e pactos poupam o jogador
      if(owner[j]==me&&tactical&&!CFG.tac){raids.push({from:i,to:j,f});continue}
      const was=owner[j],won=fight(i,j,troops[i]-1);evts.push({f,a:i,b:j,won,was});
      if(won)(was==me?note:say)(`${S[f][4]} tomou ${was==me?S[j][1]+' de você!':S[j][0]}`);
      else if(was==me)say(`Você repeliu ${S[f][4]} em ${S[j][0]}`);
      if(was==me)onFight(f,was,j,won)}}}
function say(t){logs.unshift(t);logs.length=Math.min(logs.length,80)}
function note(t){say(t);onNote(t)} // vai para a crônica e aparece como aviso na tela
const setGoal=()=>{goal=SCN[scn].play?.[me]||null};
function startAs(f){me=f;setGoal();gold[me]+=6;troops[me]+=3} // pequena vantagem na capital de quem joga
function odds(a,b,n){ // chance de vencer e tropas que sobram, pelos mesmos dados do combate automático
  let w=0,left=0;const A=n*(1+trait(a,'atk')),Dd=troops[b]*(1+defOf(b));
  for(let k=0;k<300;k++){const pa=A*roll(),pd=Dd*roll()+1;if(pa>pd){w++;left+=Math.max(1,Math.round(n*(1-.7*pd/pa)))}}return[w/300,w?Math.round(left/w):0]}
const danger=i=>owner[i]==me&&adj[i].some(j=>owner[j]!=me&&!(pact[owner[j]]>turn)&&troops[j]-1>troops[i]*(1+defOf(i))*1.2+1); // vizinho capaz de tomar o território
function check(){const n=owner.filter(o=>o==me).length;
  if(n==N){over='O Brasil é seu!';victory=true}else if(goal&&goal.every(i=>owner[i]==me)){over='Objetivo cumprido!';victory=true}else if(!n)over='Seu domínio caiu.'}
function endTurn(){evts=[];
  for(let f=0;f<N;f++)if(f!=me&&owner.includes(f))ai(f);
  if(!raids.length)closeTurn()} // com raids, a UI joga as defesas e depois fecha o turno
function closeTurn(){
  const help=new Set;for(const f in ally)if(ally[f]>turn&&owner.includes(+f))border(+f).forEach(i=>help.add(i)); // aliados reforçam a fronteira comum
  [...help].slice(0,3).forEach(i=>troops[i]++);if(help.size)note(`Reforço aliado: +1 tropa em ${Math.min(3,help.size)} estado(s)`);
  {const g=income(me);gold[me]+=g;onNote(`Turno ${turn+1}: +${g} ouro`)}moved.clear();turn++;marching=false;check();if(!over)onTurn()}
function act(to){ // marcha de sel para to
  const n=+(document.getElementById('n')?.value||troops[sel]-1),from=sel;
  if(owner[to]!=me&&pact[owner[to]]>turn){pact={};ally={};betray=turn+5;note('Traição! Pactos rompidos, vizinhos enfurecidos')}
  if(owner[to]==me){troops[from]-=n;troops[to]+=n;onMarch(from,to)}
  else if(tactical&&CFG.tac<2){marching=false;return tactical(from,to,n)}
  else{const was=owner[to],won=fight(from,to,n);
    say(won?`Você conquistou ${S[to][1]} de ${S[was][4]}`:`Derrota em ${S[to][1]}`);onFight(me,was,to,won)}
  moved.add(from).add(to);marching=false;sel=to;check()}

