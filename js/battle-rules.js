// batalha tática: grade, unidades, elite, alcance e dano
// ---------- batalha tática: grade 14x9, atacante à esquerda ----------
const GW=16,GH=10,CS=48,OX=21,OY=112,MAXR=14,SPD=[1.8,1,.45];
const UT={inf:['Infantaria',3,1,1],cav:['Cavalaria',5,1,1.1],ati:['Atiradores',3,3,.7],art:['Artilharia',2,4,.9],can:['Canoeiros',4,2,.8],lan:['Lanceiros',5,1,1.25],jag:['Jagunços',4,3,.75]}; // artilharia não atira em casa vizinha nem revida // nome, passos, alcance, dano
const BEATS={inf:'cav',cav:'ati',ati:'inf'},CL=t=>({can:'ati',lan:'cav',jag:'ati'})[t]||t,beats=(a,t)=>BEATS[CL(a.type)]==CL(t.type),strong=t=>BEATS[CL(t)]?UT[BEATS[CL(t)]][0]:'ninguém em especial';
const RU={ama:[2,'can'],pampa:[4,'lan'],sul:[4,'lan'],ser:[2,'jag']}; // tropa regional: canoeiros na Amazônia (andam na água), lanceiros no Pampa, jagunços no Sertão
// tropa de elite de cada estado: nome, tipo que ela substitui, bônus
const ELITE=TH.ELITE||{};
const elTxt=e=>e[2].rng?'+1 alcance':e[2].mov?'+1 movimento':e[2].dmg?`+${Math.round(e[2].dmg*100-100)}% dano`:`+${Math.round(e[2].def*100-100)}% defesa`;
const stOf=u=>u.side?B.to:B.from, nmOf=u=>u.el?u.el[0]:UT[u.type][0]; // stOf: estado cujo general comanda a unidade
const mvOf=u=>Math.max(1,UT[u.type][1]+(u.el?.[2].mov||0)+(gs(stOf(u))[1]>80?1:0)-(B.wx=='dry'&&u.type=='inf'?1:0)+(B.chg==B.round&&u.side==B.ps?2:0)+(pwOn(u.side,'atk')?2:0)+(hasP(u,'mov')?1:0));
const rgOf=u=>Math.max(1,UT[u.type][2]+(u.el?.[2].rng||0)-(B.wx=='rain'&&UT[u.type][2]>1?1:0)+(B.T[u.y]?.[u.x]=='h'&&UT[u.type][2]>1?1:0)); // morro baixo: atirador e canhão alcançam mais
const inR=(a,t)=>dist(a,t)<=rgOf(a)&&(a.type!='art'||dist(a,t)>1);
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y), alive=s=>B.units.filter(u=>u.side==s&&u.hp>0);
const total=s=>alive(s).reduce((a,u)=>a+u.hp,0), ld=s=>B.units.find(u=>u.side==s&&u.ld).hp>0;
const bOver=()=>!ld(0)||!ld(1)||B.round>MAXR||!!B.taken; // B.taken: praça tomada no cerco // comandante caiu = exército debanda
const cover=t=>'fv'.includes(B.T[t.y][t.x]);
const est=(a,t,back)=>a.hp*.5*UT[a.type][3]*(back?.5:1)*(beats(a,t)?1.5:1)*(a.side?1:1+trait(B.from,'atk'))*(a.side==B.ps?1+.1*hq.tech[a.type]:1)
  /(t.side?1+defOf(B.to):1)/(cover(t)?1.3:1)/(t.el?.[2].def||1)*(a.el?.[2].dmg||1)*(1+(gs(stOf(a))[0]-40)/400)*(1+.08*a.lv)
  *(B.rl[a.side]==B.round?1.4:1)*(B.amb==B.round&&a.side==B.ps&&cover(a)?1.4:1)*(a.side!=B.ps?1+.1*Math.min(3,turn/8|0):1)*(pwOn(a.side,'atk')?1.3:1)/(pwOn(t.side,'def')?1.3:1)/(B.T[t.y]?.[t.x]=='h'?1.2:1)/(hasP(t,'def')?1.2:1)*(back&&hasP(a,'rev')?1.3:1); // elite, general, nível do regimento, brado, treino da IA
const TN={g:'Campo aberto',r:'Estrada',w:'Água',b:'Ponte: pode ser queimada',f:'Mata: +30% defesa',m:'Serra: bloqueia',v:'Vila: +30% defesa, cura 2 por rodada',
  h:'Morro baixo: custa 2 passos, +20% defesa, tiro +1',a:'Vau: custa 2 passos',W:'Muralha',D:'Portão',P:'Praça: o atacante vence se ficar nela'};
const PERKS=[['mov','Marcha forçada','+1 de movimento'],['def','Entrincheirar','+20% de defesa'],['rev','Revide feroz','+30% de dano no revide']];
const hasP=(u,k)=>u.j>=0&&!!perk[stOf(u)+'-'+u.j]?.includes(k); /* melhoria escolhida ao subir de nível */
const inZone=c=>B.ps?(B.kind=='cerco'?c[0]>GW-5:c[0]>=GW-2):c[0]<=1; /* onde o jogador pode posicionar as tropas na preparação */
const pass=(px_,py,u)=>{const t=B.T[py][px_];if(t=='w'&&u?.type=='can')return true;return!'mwW'.includes(t)&&!(t=='D'&&B.gate?.hp>0)}; // casa transitável
const pwOn=(sd,k)=>!!B.pw?.[sd]&&B.pw[sd].k==k&&B.round<=B.pw[sd].until; // poder do líder ativo
const POW={atk:['Carga','+2 de movimento e +30% de dano por 2 rodadas'],def:['Resistência','+3 de vida e +30% de defesa por 2 rodadas'],
  gold:['Reorganizar','todas as unidades agem de novo'],rec:['Reforços','2 regimentos novos entram no campo']};
const KIND={campo:['Batalha campal','Campo aberto: derrube o comandante inimigo.'],
  cerco:['Cerco','Muralha com portão. A artilharia arromba o portão mais rápido; atiradores e canhões atiram por cima do muro.'],
  travessia:['Travessia','Um rio corta o campo: pontes e um vau lento. Uma unidade ao lado de uma ponte pode queimá-la.'],
  emboscada:['Emboscada','Mata fechada: você só enxerga inimigos a até 3 casas das suas unidades.']};
const seen=u=>B.kind!='emboscada'||u.side==B.ps||B.units.some(v=>v.side==B.ps&&v.hp>0&&dist(u,v)<=3); // neblina da emboscada
const bCell=e=>{const r=cv.getBoundingClientRect();return[Math.floor(((e.clientX-r.left)*cv.width/r.width-OX)/CS),Math.floor(((e.clientY-r.top)*cv.height/r.height-OY)/CS)]};

