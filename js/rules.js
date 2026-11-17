// regras da campanha e IA estratégica; sem DOM, roda também no simulador (tools/sim.js)
// regras
const hash=(a,b)=>(a*73856093^b*19349663)>>>0;
const gs=i=>{const v=hash(i+3,7);return[40+v%60,40+(v>>6)%60,40+(v>>12)%60]}; // general do estado: liderança, astúcia, política
const trait=(i,t)=>S[i][5]==t?S[i][6]:0;
const inc=i=>3+trait(i,'gold')+(gs(i)[2]>70?1:0), cost=i=>S[i][5]=='rec'||(owner[i]==me&&hq.doc.log)?1:2, fcost=()=>hq.doc.eng?2:3;
// doutrinas do quartel-general: id, nome, efeito, custo
const DOC=[['log','Logística','Recrutar custa 1 de ouro em todos os seus estados',12],['eng','Engenharia','Fortes custam 2 de ouro',8],['gue','Guerrilha','+15% de defesa em todos os seus estados',10]];
const roll=()=>.7+Math.random()*.6;
const AGG=[[1.6,.45],[1.3,.6],[1.1,.8]]; // por dificuldade: vantagem exigida, chance de atacar
let owner,troops,gold,me,sel,moved,turn,over,marching,logs,onFight=()=>{},onMarch=()=>{},tactical=null,raids=[]; // raids: ataques da IA ao jogador, à espera da defesa tática
let fort,stats,endShown,hq,vet,pact,betray,onTurn=()=>{}; // vet: veteranice por estado; pact: facção -> turno em que o pacto acaba // hq: treino por tipo de unidade, doutrinas, turno do último imposto // fort: nível do forte por estado (0-2), +20% defesa cada
function reset(){owner=S.map((_,i)=>i);troops=S.map(()=>4+Math.floor(Math.random()*5));gold=S.map(()=>6);
  me=-1;sel=-1;moved=new Set;turn=1;over='';marching=false;logs=[];raids=[];fort=S.map(()=>0);stats={won:0,lost:0,taken:0};endShown=false;hq={tech:{inf:0,cav:0,ati:0,art:0},doc:{},tax:0};vet=S.map(()=>0);pact={};betray=0}
const income=f=>owner.reduce((a,o,i)=>a+(o==f?inc(i):0),0)+REG.reduce((a,[,st,b])=>a+(st.every(i=>owner[i]==f)?b:0),0);
const defOf=i=>trait(i,'def')+.2*fort[i]+(owner[i]==me&&hq.doc.gue?.15:0);
function fight(a,b,n){ // n tropas de a atacam b; devolve true se conquistou
  const pa=n*(1+trait(a,'atk'))*roll(), pd=troops[b]*(1+defOf(b))*roll()+1;
  troops[a]-=n;
  if(pa>pd){vet[a]=Math.min(3,vet[a]+1);fort[b]=0;owner[b]=owner[a];troops[b]=Math.max(1,Math.round(n*(1-.7*pd/pa)));return true}
  troops[b]=Math.max(1,Math.round(troops[b]*(1-.7*pa/pd)));troops[a]+=Math.round(n*.3);return false}
function ai(f){
  gold[f]+=income(f);
  const mine=owner.map((o,i)=>o==f?i:-1).filter(i=>i>=0),[need,chance]=AGG[CFG.diff];
  const foes=i=>adj[i].filter(j=>owner[j]!=f);
  const threat=i=>foes(i).reduce((a,j)=>a+troops[j],0);
  const border=mine.filter(i=>foes(i).length).sort((a,b)=>threat(b)-threat(a));
  if(border.length){const t=border[0];if(gold[f]>=8&&fort[t]<2&&Math.random()<.3){fort[t]++;gold[f]-=3} // a IA também ergue fortes na fronteira
    const n=Math.floor(gold[f]/cost(t));troops[t]+=n;gold[f]-=n*cost(t)}
  for(const i of mine){
    if(owner[i]!=f||troops[i]<2)continue;
    const fs=foes(i).sort((a,b)=>troops[a]-troops[b]);
    if(!fs.length){const to=adj[i].find(j=>foes(j).length)??adj[i][0];troops[to]+=troops[i]-1;troops[i]=1;continue}
    const j=fs[0];
    if(troops[i]-1>troops[j]*(1+defOf(j))*need+1&&Math.random()<chance*Math.min(1,.3+turn/10)*(owner[j]==me&&betray>turn?1.5:1) // agressão cresce com os turnos
      &&!(owner[j]==me&&(turn<4||pact[f]>turn))){ // trégua inicial e pactos poupam o jogador
      if(owner[j]==me&&tactical&&!CFG.tac){raids.push({from:i,to:j,f});continue}
      const was=owner[j],won=fight(i,j,troops[i]-1);
      if(won)say(`${S[f][4]} tomou ${S[j][0]}${was==me?' de você!':''}`);
      else if(was==me)say(`Você repeliu ${S[f][4]} em ${S[j][0]}`);
      if(was==me)onFight(f,was,j,won)}}}
function say(t){logs.unshift(t);logs.length=Math.min(logs.length,9)}
function check(){const n=owner.filter(o=>o==me).length;
  if(n==N)over='O Brasil é seu!';else if(!n)over='Seu domínio caiu.'}
function endTurn(){
  for(let f=0;f<N;f++)if(f!=me&&owner.includes(f))ai(f);
  if(!raids.length)closeTurn()} // com raids, a UI joga as defesas e depois fecha o turno
function closeTurn(){gold[me]+=income(me);moved.clear();turn++;marching=false;check();if(!over)onTurn()}
function act(to){ // marcha de sel para to
  const n=+(document.getElementById('n')?.value||troops[sel]-1),from=sel;
  if(owner[to]!=me&&pact[owner[to]]>turn){pact={};betray=turn+5;say('Traição! Pactos rompidos, vizinhos enfurecidos')}
  if(owner[to]==me){troops[from]-=n;troops[to]+=n;onMarch(from,to)}
  else if(tactical&&CFG.tac<2){marching=false;return tactical(from,to,n)}
  else{const was=owner[to],won=fight(from,to,n);
    say(won?`Você conquistou ${S[to][1]} de ${S[was][4]}`:`Derrota em ${S[to][1]}`);onFight(me,was,to,won)}
  moved.add(from).add(to);marching=false;sel=to;check()}

