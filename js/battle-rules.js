// batalha tática: grade, unidades, elite, alcance e dano
// ---------- batalha tática: grade 14x9, atacante à esquerda ----------
let GW=16,GH=10; /* tamanho do campo: muda a cada batalha, conforme os exércitos */
const CS=48,OX=0,OY=0,SPD=[1.8,1,.45];let VX=21,VY=112,VW=768,VH=480,MAXR=14; /* VX..VH: janela da câmera; MAXR cresce com o campo */ // OX/OY: o campo é desenhado em coordenadas de mundo; VX..VH: janela da câmera no canvas
const A0=()=>Math.max(1,Math.round((GW-16)/2)); /* coluna onde o atacante se posiciona; o defensor fica no espelho */
let bFast=1;try{bFast=+localStorage.getItem('tb-fast')||1}catch{} // velocidade do turno inimigo: 1, 2 ou 4
const UT={inf:['Infantaria',3,1,1],cav:['Cavalaria',5,1,1.1],ati:['Atiradores',3,3,.7],art:['Artilharia',2,4,.9],can:['Canoeiros',4,2,.8],lan:['Lanceiros',5,1,1.25],jag:['Jagunços',4,3,.75]}; // artilharia não atira em casa vizinha nem revida // nome, passos, alcance, dano
const BEATS={inf:'cav',cav:'ati',ati:'inf'},CL=t=>({can:'ati',lan:'cav',jag:'ati'})[t]||t,beats=(a,t)=>BEATS[CL(a.type)]==CL(t.type),strong=t=>BEATS[CL(t)]?UT[BEATS[CL(t)]][0]:'ninguém em especial';
const RU={ama:[2,'can'],pampa:[4,'lan'],sul:[4,'lan'],ser:[2,'jag']}; // tropa regional: canoeiros na Amazônia (andam na água), lanceiros no Pampa, jagunços no Sertão
// tropa de elite de cada estado: nome, tipo que ela substitui, bônus
const ELITE=TH.ELITE||{};
const elTxt=e=>e[2].rng?'+1 alcance':e[2].mov?'+1 movimento':e[2].dmg?`+${Math.round(e[2].dmg*100-100)}% dano`:`+${Math.round(e[2].def*100-100)}% defesa`;
const stOf=u=>u.side?B.to:B.from, nmOf=u=>u.el?u.el[0]:UT[u.type][0]; // stOf: estado cujo general comanda a unidade
const mvOf=u=>Math.max(1,UT[u.type][1]+(u.el?.[2].mov||0)+(gs(stOf(u))[1]>80?1:0)-(B.wx=='dry'&&u.type=='inf'?1:0)+(B.chg==B.round&&u.side==B.ps?2:0)+(pwOn(u.side,'atk')?2:0)+(hasP(u,'mov')?1:0)+(CL(u.type)=='cav'?(fxOn('pampa')||fxOn('cerrado')?1:0)-(fxOn('selva')||fxOn('pantanal')?1:0):0)-(u.type=='inf'&&fxOn('caatinga')?1:0)); /* o terreno do estado mexe no passo */
const rgOf=u=>Math.max(1,UT[u.type][2]+(u.el?.[2].rng||0)-(B.wx=='rain'&&UT[u.type][2]>1?1:0)+(B.T[u.y]?.[u.x]=='h'&&UT[u.type][2]>1?1:0)+(B.T[u.y]?.[u.x]=='K'?2:0)+(B.T[u.y]?.[u.x]=='T'&&UT[u.type][2]>1?1:0)); // morro, torre e bateria: tiro mais longe
const inR=(a,t)=>dist(a,t)<=rgOf(a)&&(a.type!='art'||dist(a,t)>1);
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y), alive=s=>B.units.filter(u=>u.side==s&&u.hp>0);
const total=s=>alive(s).reduce((a,u)=>a+u.hp,0), ld=s=>B.units.find(u=>u.side==s&&u.ld).hp>0;
const rout=s=>{const t0=B.units.filter(u=>u.side==s&&u.j>=0).reduce((a,u)=>a+u.hp0,0);return t0>0&&total(s)<=t0*.3}; // perdeu 70% das tropas: o exército debanda
const bOver=()=>!ld(0)||!ld(1)||B.round>MAXR||!!B.taken||rout(0)||rout(1); // B.taken: praça tomada no cerco // comandante caiu = exército debanda
const cover=t=>tdef(B.T[t.y]?.[t.x])>1;
const est=(a,t,back)=>a.hp*.5*UT[a.type][3]*(back?.5:1)*(beats(a,t)?1.5:1)*(a.side?1:1+trait(B.from,'atk'))*(a.side==B.ps?1+.1*(hq.tech[CL(a.type)]||0):1)
  /(t.side?1+defOf(B.to):1)/tdef(B.T[t.y]?.[t.x])/(t.el?.[2].def||1)*(a.el?.[2].dmg||1)*(1+(gs(stOf(a))[0]-40)/400)*(1+.08*a.lv)
  *(B.rl[a.side]==B.round?1.4:1)*(B.amb==B.round&&a.side==B.ps&&cover(a)?1.4:1)*(a.side!=B.ps?1+.1*Math.min(3,turn/8|0):1)*(pwOn(a.side,'atk')?1.3:1)/(pwOn(t.side,'def')?1.3:1)/(B.T[t.y]?.[t.x]=='h'?1.2:1)/(hasP(t,'def')?1.2:1)*(back&&hasP(a,'rev')?1.3:1)*(back?1:ANG[angleOf(a,t)])*morMul(a)*(t.flee?1.3:1); // ângulo do golpe, moral, inimigo em fuga; elite, general, nível do regimento, brado, treino da IA
const TN={g:'Campo aberto',r:'Estrada',w:'Água',b:'Ponte: pode ser queimada',f:'Mata: +30% defesa',m:'Serra: bloqueia',v:'Vila: +30% defesa, cura 2 por rodada',
  h:'Morro baixo: custa 2 passos, +20% defesa, tiro +1',a:'Vau ou alagado: custa 2 passos',W:'Muralha: canhões derrubam; a infantaria sobe com escada',D:'Portão: arrombe para entrar',P:'Praça: o atacante vence se ficar nela',
  T:'Torre: só o defensor sobe; +40% defesa e tiro +1',L:'Escada: passa por cima da muralha, custa 2 passos',R:'Brecha: escombros, custa 2 passos',
  c:'Canavial: +20% defesa',K:'Bateria costeira: tiro +2 de alcance, +20% defesa',
  Q:'Quartel: +30% defesa; quem toma recruta 1 regimento a cada 2 rodadas'};
const OBJ={vilas:['Duas vilas','tome as duas vilas marcadas com estrela e segure por duas rodadas','defenda as duas vilas marcadas com estrela','As vilas foram tomadas!'],
  saida:['Fuga','leve o seu comandante até a saída, à direita','impeça o comandante inimigo de chegar à saída','O comandante chegou à saída!'],
  ponte:['Ponte','tome a ponte marcada e segure por duas rodadas','não deixe o inimigo ficar na ponte marcada','A ponte foi tomada!']}; // nome, objetivo do atacante, do defensor, aviso de vitória
const PERKS=[['mov','Marcha forçada','+1 de movimento'],['def','Entrincheirar','+20% de defesa'],['rev','Revide feroz','+30% de dano no revide']];
const hasP=(u,k)=>u.j>=0&&!!perk[stOf(u)+'-'+u.j]?.includes(k); /* melhoria escolhida ao subir de nível */
const inZone=c=>{const a=A0();return B.ps?(B.kind=='cerco'?c[0]>B.wc:c[0]>=GW-2-a&&c[0]<=GW-a+1):c[0]>=a-2&&c[0]<=a+1}; /* onde o jogador pode posicionar as tropas na preparação */
const pass=(px_,py,u)=>{const t=B.T[py][px_];if(t=='w'&&u?.type=='can')return true;return!'mwWD'.includes(t)&&!(t=='T'&&u?.side!==1)}; // casa transitável; torre só para quem defende
const stepCost=t=>'haLR'.includes(t)?2:1; // morro, vau, escada e escombros custam 2
const pwOn=(sd,k)=>!!B.pw?.[sd]&&B.pw[sd].k==k&&B.round<=B.pw[sd].until; // poder do líder ativo
const POW={atk:['Carga','+2 de movimento e +30% de dano por 2 rodadas'],def:['Resistência','+3 de vida e +30% de defesa por 2 rodadas'],
  gold:['Reorganizar','todas as unidades agem de novo'],rec:['Reforços','2 regimentos novos entram no campo']};
const KIND={campo:['Batalha campal','Campo aberto: derrube o comandante inimigo.'],
  cerco:['Cerco','Cidade murada com torres e dois portões. Canhões derrubam trechos da muralha, a infantaria encosta escadas e qualquer tropa arromba um portão. O defensor sobe nas torres e derruba escadas.'],
  travessia:['Travessia','Um rio corta o campo: pontes e um vau lento. Uma unidade ao lado de uma ponte pode queimá-la.'],
  emboscada:['Emboscada','Mata fechada: você só enxerga inimigos a até 3 casas das suas unidades.']};
const sight=()=>B.kind=='emboscada'?3:B.night?4:0; // alcance da vista: neblina da emboscada ou noite
const seen=u=>!sight()||u.side==B.ps||B.units.some(v=>v.side==B.ps&&v.hp>0&&dist(u,v)<=sight());
// ---------- câmera: o campo é maior que a janela; arrasta, aproxima e segue as ações ----------
const bPt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]};
const inView=(px,py)=>px>=VX&&py>=VY&&px<VX+VW&&py<VY+VH;
const toScreen=(wx,wy)=>{const c=B.cam;return[VX+(wx-c.x)*c.z,VY+(wy-c.y)*c.z]};
const bCell=e=>{const[px,py]=bPt(e),c=B.cam;if(!inView(px,py))return[-1,-1];return[Math.floor(((px-VX)/c.z+c.x)/CS),Math.floor(((py-VY)/c.z+c.y)/CS)]};
const zMin=()=>Math.min(1,VW/(GW*CS),VH/(GH*CS)); // afastado ao máximo: o campo inteiro cabe
function camClamp(c){const z=c.tz=Math.max(zMin(),Math.min(1.6,c.tz)),w=VW/z,h=VH/z,WW=GW*CS,WH=GH*CS;
  const[L,T,R,Bt]=typeof bSafe=='function'?bSafe():[VX,VY,VX+VW,VY+VH]; // campo menor que a tela: centraliza na área que os painéis não cobrem
  c.tx=w>=WW?WW/2-((L+R)/2-VX)/z:Math.max(0,Math.min(WW-w,c.tx));c.ty=h>=WH?WH/2-((T+Bt)/2-VY)/z:Math.max(0,Math.min(WH-h,c.ty))}
const bSafe=()=>VX?[VX,VY,VX+VW,VY+VH]:phoneUI()?[0,118,VW,VH-(innerHeight*.42+12)*RS]:[16,118,VW-(compactUI()?340:420),VH-30]; // tela cheia: área que o placar e a ficha não cobrem
function camTo(gx,gy,z){const c=B.cam,[L,T,R,Bt]=bSafe();if(z)c.tz=z;c.tz=Math.max(zMin(),Math.min(1.6,c.tz));c.tx=(gx+.5)*CS-((L+R)/2-VX)/c.tz;c.ty=(gy+.5)*CS-((T+Bt)/2-VY)/c.tz;camClamp(c)}
function camZoom(f,px=VX+VW/2,py=VY+VH/2){const c=B.cam,wx=(px-VX)/c.tz+c.tx,wy=(py-VY)/c.tz+c.ty;c.tz*=f;camClamp(c);c.tx=wx-(px-VX)/c.tz;c.ty=wy-(py-VY)/c.tz;camClamp(c)}
function camFrame(...us){const c=B.cam,[L,T,R,Bt]=bSafe(),M=CS*1.4*c.tz,sc=u=>[VX+((u.x+.5)*CS-c.tx)*c.tz,VY+((u.y+.5)*CS-c.ty)*c.tz]; /* só move se alguma casa sair da área livre; devolve true se moveu */
  if(us.every(u=>{const[px,py]=sc(u);return px>L+M&&px<R-M&&py>T+M&&py<Bt-M}))return false;
  camTo(us.reduce((s,u)=>s+u.x,0)/us.length,us.reduce((s,u)=>s+u.y,0)/us.length);return true}
function camStep(now){const c=B.cam,k=Math.min(1,(now-(c.t||now))/110);c.t=now;c.x+=(c.tx-c.x)*k;c.y+=(c.ty-c.y)*k;c.z+=(c.tz-c.z)*k;
  if(Math.abs(c.tz-c.z)<.002)c.z=c.tz}
const freeAt=(a,b)=>a>=0&&b>=0&&a<GW&&b<GH&&pass(a,b)&&!'DQ'.includes(B.T[b][a])&&!B.units.some(v=>v.hp>0&&v.x==a&&v.y==b);
function freeNear(x0,y0,self){for(let r=self?0:1;r<9;r++)for(let dx=-r;dx<=r;dx++)for(const dy of new Set([r-Math.abs(dx),Math.abs(dx)-r])){const a=x0+dx,b=y0+dy;if(freeAt(a,b))return[a,b]}return null}


// ---------- zona de controle, flanco, retaguarda e moral ----------
const zoc=(x_,y_,u)=>B.units.some(v=>v.hp>0&&v.side!=u.side&&!v.flee&&Math.abs(v.x-x_)+Math.abs(v.y-y_)==1&&(u.side==B.ps||seen(v))); // casa colada num inimigo: a marcha para ali
const facing=u=>u.fdir||(u.side?-1:1); // para onde a unidade olha: o lado do inimigo, ou o último passo
function angleOf(a,t){const dx=a.x-t.x,dy=a.y-t.y;if(Math.abs(dy)>Math.abs(dx))return'flanco';return Math.sign(dx)==-facing(t)?'retaguarda':'frente'} // de onde vem o golpe
const ANG={frente:1,flanco:1.15,retaguarda:1.3};
const morMul=u=>.7+.3*Math.max(0,u.mor??100)/100; // regimento abalado bate menos
const surrounded=u=>B.units.filter(v=>v.hp>0&&v.side!=u.side&&!v.flee&&dist(u,v)==1).length;
