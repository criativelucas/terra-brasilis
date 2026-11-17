// batalha tática: grade, unidades, elite, alcance e dano
// ---------- batalha tática: grade 14x9, atacante à esquerda ----------
const GW=16,GH=10,CS=48,OX=21,OY=112,MAXR=14,SPD=[1.8,1,.45];
const UT={inf:['Infantaria',3,1,1],cav:['Cavalaria',5,1,1.1],ati:['Atiradores',3,3,.7],art:['Artilharia',2,4,.9]}; // artilharia não atira em casa vizinha nem revida // nome, passos, alcance, dano
const BEATS={inf:'cav',cav:'ati',ati:'inf'},strong=t=>BEATS[t]?UT[BEATS[t]][0]:'ninguém em especial';
// tropa de elite de cada estado: nome, tipo que ela substitui, bônus
const ELITE=TH.ELITE||{};
const elTxt=e=>e[2].rng?'+1 alcance':e[2].mov?'+1 movimento':e[2].dmg?`+${Math.round(e[2].dmg*100-100)}% dano`:`+${Math.round(e[2].def*100-100)}% defesa`;
const stOf=u=>u.side?B.to:B.from, nmOf=u=>u.el?u.el[0]:UT[u.type][0]; // stOf: estado cujo general comanda a unidade
const mvOf=u=>Math.max(1,UT[u.type][1]+(u.el?.[2].mov||0)+(gs(stOf(u))[1]>80?1:0)-(B.wx=='dry'&&u.type=='inf'?1:0)+(B.chg==B.round&&u.side==B.ps?2:0));
const rgOf=u=>Math.max(1,UT[u.type][2]+(u.el?.[2].rng||0)-(B.wx=='rain'&&UT[u.type][2]>1?1:0));
const inR=(a,t)=>dist(a,t)<=rgOf(a)&&(a.type!='art'||dist(a,t)>1);
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y), alive=s=>B.units.filter(u=>u.side==s&&u.hp>0);
const total=s=>alive(s).reduce((a,u)=>a+u.hp,0), ld=s=>B.units.find(u=>u.side==s&&u.ld).hp>0;
const bOver=()=>!ld(0)||!ld(1)||B.round>MAXR; // comandante caiu = exército debanda
const cover=t=>'fv'.includes(B.T[t.y][t.x]);
const est=(a,t,back)=>a.hp*.5*UT[a.type][3]*(back?.5:1)*(BEATS[a.type]==t.type?1.5:1)*(a.side?1:1+trait(B.from,'atk'))*(a.side==B.ps?1+.1*hq.tech[a.type]:1)
  /(t.side?1+defOf(B.to):1)/(cover(t)?1.3:1)/(t.el?.[2].def||1)*(a.el?.[2].dmg||1)*(1+(gs(stOf(a))[0]-40)/400)*(1+.08*a.lv)
  *(B.rl[a.side]==B.round?1.4:1)*(B.amb==B.round&&a.side==B.ps&&cover(a)?1.4:1)*(a.side!=B.ps?1+.1*Math.min(3,turn/8|0):1); // elite, general, nível do regimento, brado, treino da IA
const TN={g:'Campo aberto',r:'Estrada',w:'Água',b:'Ponte',f:'Mata: +30% defesa',m:'Morro',v:'Vila: +30% defesa'};
const bCell=e=>{const r=cv.getBoundingClientRect();return[Math.floor(((e.clientX-r.left)*cv.width/r.width-OX)/CS),Math.floor(((e.clientY-r.top)*cv.height/r.height-OY)/CS)]};

