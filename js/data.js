// dados do Brasil: estados, líderes, biomas, regiões, geografia do mapa e câmera
// uf, nome, lon, lat, líder, tipo de traço, valor, característica
const S=[
['AC','Acre',-70.5,-9.2,'Plácido de Castro','atk',.3,'Revolução Acreana'],
['AM','Amazonas',-64.5,-4.2,'Ajuricaba','def',.5,'Selva impenetrável'],
['RR','Roraima',-61.4,2,"Lobo d'Almada",'def',.3,'Fortes do Rio Branco'],
['RO','Rondônia',-63,-10.8,'Marechal Rondon','rec',0,'Linhas telegráficas'],
['PA','Pará',-52.5,-4.5,'Eduardo Angelim','atk',.3,'Cabanagem'],
['AP','Amapá',-51.8,1.5,'Cabralzinho','def',.4,'Defesa do Amapá'],
['TO','Tocantins',-48.3,-10.2,'Teotônio Segurado','rec',0,'Autonomia do Norte'],
['MA','Maranhão',-45.2,-5,'Negro Cosme','atk',.2,'Balaiada'],
['PI','Piauí',-42.8,-7.5,'Esperança Garcia','def',.2,'Resistência do sertão'],
['CE','Ceará',-39.5,-5.2,'Dragão do Mar','gold',2,'Jangadeiros'],
['RN','Rio Grande do Norte',-36.6,-5.8,'Felipe Camarão','atk',.3,'Guerreiros potiguares'],
['PB','Paraíba',-36.6,-7.2,'Ariano Suassuna','gold',2,'Movimento Armorial'],
['PE','Pernambuco',-37.8,-8.4,'Frei Caneca','atk',.2,'Confederação do Equador'],
['AL','Alagoas',-36.5,-9.6,'Zumbi dos Palmares','def',.5,'Quilombo dos Palmares'],
['SE','Sergipe',-37.4,-10.6,'Tobias Barreto','rec',0,'Pequeno e aguerrido'],
['BA','Bahia',-41.8,-12.5,'Maria Quitéria','atk',.3,'Independência da Bahia'],
['MT','Mato Grosso',-55.8,-13,'Pascoal Moreira Cabral','gold',2,'Ouro de Cuiabá'],
['GO','Goiás',-50.1,-16,'Cora Coralina','gold',2,'Celeiro do cerrado'],
['DF','Distrito Federal',-47.8,-15.8,'Juscelino Kubitschek','gold',4,'50 anos em 5'],
['MS','Mato Grosso do Sul',-54.8,-20.5,'Guia Lopes','def',.3,'Pantanal'],
['MG','Minas Gerais',-44.5,-18.5,'Tiradentes','gold',4,'Minas de ouro'],
['ES','Espírito Santo',-40.5,-19.6,'Maria Ortiz','def',.4,'Defesa de Vitória'],
['RJ','Rio de Janeiro',-42.8,-22.3,'Dom Pedro II','gold',4,'Corte imperial'],
['SP','São Paulo',-48.8,-22.2,'José Bonifácio','gold',5,'Locomotiva do café'],
['PR','Paraná',-51.6,-24.8,'Barão do Serro Azul','gold',2,'Erva-mate'],
['SC','Santa Catarina',-50.5,-27.2,'Anita Garibaldi','atk',.3,'Heroína de dois mundos'],
['RS','Rio Grande do Sul',-53.5,-29.8,'Bento Gonçalves','atk',.4,'Cavalaria farroupilha']];
// retrato de cada líder: pele, cabelo, cor do cabelo, barba, chapéu, roupa, extras
const L=[
['L','short','k','m','kepi','#56602f','e'],['I','long','k','','cocar','#8c2f1f',''],['L','wig','w','','tricorn','#22386e','c'],
['T','short','g','m','kepi','#8a7a45','e'],['T','short','k','','','#e8e0cc','r'],['T','short','k','b','wide','#3d3226',''],
['L','wig','w','','','#17131c','c'],['D','curly','k','b','','#e8e0cc',''],['D','short','k','','wrap','#7a5a8a','f'],
['B','short','k','m','straw','#e8e0cc',''],['I','long','k','','plume','#5a2a2a','c'],['L','bald','w','','','#d8cfb4',''],
['L','tonsure','b','','','#6b4a2a',''],['D','short','k','b','band','#8c2f1f',''],['B','curly','k','m','','#17131c','c'],
['T','short','k','','shako','#22386e','ef'],['T','long','b','B','wide','#6b4a2a',''],['L','bun','w','','','#3a3550','gcf'],
['L','short','k','','','#2a2f45','t'],['T','short','g','b','wide','#7a4a2f','r'],['L','long','b','B','','#e8e0cc',''],
['L','long','b','','','#8c2f1f','fc'],['L','short','w','B','','#17131c','c'],['L','short','w','s','','#2a2f45','c'],
['L','short','b','b','','#3d3226','t'],['T','bun','k','','','#b3312a','f'],['L','short','k','ms','','#22386e','er']];
// bioma de cada estado (mesma ordem de S): define o campo de batalha e a decoração do mapa
const BOF='ama ama ama ama ama ama cer cer ser ser ser ser ser ser ser ser cer cer cer cer sud sud sud sud sul sul sul'.split(' ');
const BIO={ // g: chão (xadrez), gd/gl: tufos, f: matas, m: morros, mc: cores do morro [claro,escuro,topo]
  ama:{nome:'Selva amazônica',g:['#36a43c','#2f9c37'],gd:'#237d2e',gl:'#6fcf52',tree:'jungle',f:24,m:4,river:1,mesa:1,mc:['#7a7f78','#555a55','#4f9a45']},
  ser:{nome:'Sertão',g:['#eac25e','#e3b955'],gd:'#c4953c',gl:'#f8e09a',tree:'cactus',f:12,m:9,river:0,mesa:1,mc:['#c9824f','#9a5a36','#e0a56f']},
  cer:{nome:'Cerrado',g:['#b9c23c','#b0ba36'],gd:'#8f9a28',gl:'#dbe060',tree:'twist',f:14,m:6,river:0,mesa:1,mc:['#b9895a','#8a6240','#a3ad4c']},
  sud:{nome:'Serras do Sudeste',g:['#5cb83e','#54af39'],gd:'#3b8f2c',gl:'#8cdc5c',tree:'round',f:15,m:10,river:0,mesa:0,mc:['#9a9488','#69645c','#c9c4b8']},
  sul:{nome:'Campos do Sul',g:['#98cc44','#90c43f'],gd:'#6ea52e',gl:'#c0e868',tree:'pine',f:14,m:5,river:1,mesa:0,mc:['#8f958a','#60665e','#bfc5b8']}};
const CFG={mus:.4,vol:.5,tac:0,speed:1,diff:1,shake:1,clash:1}; // tac: 0 sempre tática, 1 só nos ataques, 2 automática
const N=S.length, ix=Object.fromEntries(S.map((s,i)=>[s[0],i]));
const adj=S.map(()=>[]);
('AC:AM,RO;AM:RO,RR,PA,MT;RR:PA;RO:MT;PA:AP,MA,TO,MT;TO:MA,PI,BA,GO,MT;MA:PI;PI:BA,PE,CE;CE:RN,PB,PE;RN:PB;PB:PE;'+
 'PE:BA,AL;AL:SE,BA;SE:BA;BA:GO,MG,ES;MT:GO,MS;GO:MG,MS,DF;DF:MG;MS:MG,SP,PR;MG:SP,RJ,ES;ES:RJ;RJ:SP;SP:PR;PR:SC;SC:RS')
 .split(';').forEach(l=>{const[a,b]=l.split(':');b.split(',').forEach(c=>{adj[ix[a]].push(ix[c]);adj[ix[c]].push(ix[a])})});
// dominar uma região inteira rende ouro extra por turno
const REG=[['Norte','AC AM RR RO PA AP TO',4],['Nordeste','MA PI CE RN PB PE AL SE BA',6],['Centro-Oeste','MT GO DF MS',3],
  ['Sudeste','MG ES RJ SP',5],['Sul','PR SC RS',3]].map(([n,u,b])=>[n,u.split(' ').map(k=>ix[k]),b]);
// rotas marítimas: portos distantes contam como vizinhos
const SEA=[['RS','RJ'],['RJ','PE'],['PE','PA']].map(q=>q.map(k=>ix[k]));SEA.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a)});

// contorno grosseiro do Brasil (lon,lat); estados = Voronoi dos centros dentro dele
const P=[[-60.2,5.2],[-59.8,4.4],[-58.9,1.2],[-56.5,1.9],[-54,2.2],[-52.5,2.6],[-51.6,4.4],[-50,1.8],[-50,0],[-48.4,-.7],
[-46,-1],[-44.3,-2.4],[-41.5,-2.9],[-38.5,-3.7],[-35.3,-5.2],[-34.8,-7.2],[-35,-9],[-37,-11],[-38.5,-13],[-39,-15.5],
[-39.2,-18],[-40.3,-20.3],[-41,-22],[-42,-23],[-44.5,-23.3],[-46.3,-24],[-48.5,-25.8],[-48.6,-27.6],[-49.8,-29.3],
[-52.1,-32.1],[-53.4,-33.7],[-55.6,-30.9],[-57.6,-30.2],[-55.9,-28.4],[-53.8,-27.2],[-54.6,-25.6],[-54.3,-24],
[-55.6,-22.3],[-57.9,-22.1],[-57.8,-19],[-58.2,-16.3],[-60.2,-16.3],[-60.5,-13.8],[-63,-12.6],[-65.3,-11.5],[-65.3,-9.8],
[-68.7,-11],[-70.6,-11],[-70.6,-9.5],[-73.2,-9.4],[-74,-7.5],[-72.9,-5.1],[-70,-4.3],[-69.4,-1.1],[-69.9,1.7],[-67.1,1.7],
[-66.9,1.2],[-65.5,.8],[-63.4,2.2],[-64.2,4.1],[-61.5,4.3]];
// terra dos vizinhos: costa norte e sul reais; o lado leste corta por dentro do Brasil, que é pintado por cima
const PW=[[-80,12],[-62,10.7],[-60,8.5],[-57.2,6],[-54,5.8],[-51.7,4.6],[-50,-5],[-45,-15],[-50,-28],[-53.5,-33.6],[-54.5,-34.9],[-58,-34.5],[-58,-40],[-80,-40]];
const RIOS=[[[-70,-4.3],[-65,-3.3],[-60,-3.1],[-55,-2.2],[-51,-.8],[-49.6,-.2]],           // Amazonas
  [[-45.5,-19.5],[-44.5,-15],[-43,-11],[-40.5,-9.3],[-36.8,-10.3]],                          // São Francisco
  [[-50.5,-20],[-52.5,-22.5],[-54.4,-25.4]],[[-48.6,-12.5],[-48.2,-8],[-49.2,-5.3],[-49.3,-1.5]]]; // Paraná, Tocantins
const W=81,H=79,X0=-74.5,Y0=5.5,D=.5,C=10;
const inPoly=(x,y,Q=P)=>{let c=false;for(let i=0,j=Q.length-1;i<Q.length;j=i++){const[xi,yi]=Q[i],[xj,yj]=Q[j];
  if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const cell=new Int8Array(W*H).fill(-1); // -1 mar, -2 terra vizinha, >=0 estado
for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
  const lon=X0+(cx+.5)*D,lat=Y0-(cy+.5)*D;
  if(!inPoly(lon,lat))continue;
  let best=-1,bd=1e9;
  S.forEach((s,i)=>{const d=Math.hypot(lon-s[2],lat-s[3]);
    if(s[0]=='DF'&&d>.75)return; // DF é um enclave pequeno, não uma região de Voronoi
    if(d<bd){bd=d;best=i}});
  cell[cy*W+cx]=best}

// câmera: o mapa plano (810x790) vira um tabuleiro visto de cima e de frente
const SW=W*C,SH=H*C,K=.35,HS=520,YB=578,F1=1/(1+K);
const proj=(sx,sy)=>{const t=1-sy/SH,sc=1/(1+K*t);return[SW/2+(sx-SW/2)*sc,YB-HS*t*sc/F1,sc]};
const unproj=(x,y)=>{const g=(YB-y)/HS*F1;if(g<0||g>F1)return null;const t=g/(1-K*g),sc=1/(1+K*t);return[SW/2+(x-SW/2)/sc,(1-t)*SH,sc]};

