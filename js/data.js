// teatros de guerra: o Brasil inteiro (modo Dominação) e um mapa próprio para cada campanha histórica.
// Cada teatro: territórios S [sigla, nome, lon, lat, líder, traço, valor, característica], retratos L, biomas BOF,
// contorno P (lon,lat), lagoas, rios, regiões, rotas marítimas, costa, tropas de elite e cenário.
// O teatro vem do endereço: #equador, #farrapos, #cabanagem, #balaiada, #sabinada, #males; sem nada, é a Dominação do Brasil.
const THEATERS={
  brasil:{nome:'Dominação do Brasil',ano:1822,word:'estados',
    title:'1822. Vinte e sete províncias, vinte e sete líderes, um só Brasil a unificar.',
    S:[
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
['RS','Rio Grande do Sul',-53.5,-29.8,'Bento Gonçalves','atk',.4,'Cavalaria farroupilha']],
    L:[
['L','short','k','m','kepi','#56602f','e'],['I','long','k','','cocar','#8c2f1f',''],['L','wig','w','','tricorn','#22386e','c'],
['T','short','g','m','kepi','#8a7a45','e'],['T','short','k','','','#e8e0cc','r'],['T','short','k','b','wide','#3d3226',''],
['L','wig','w','','','#17131c','c'],['D','curly','k','b','','#e8e0cc',''],['D','short','k','','wrap','#7a5a8a','f'],
['B','short','k','m','straw','#e8e0cc',''],['I','long','k','','plume','#5a2a2a','c'],['L','bald','w','','','#d8cfb4',''],
['L','tonsure','b','','','#6b4a2a',''],['D','short','k','b','band','#8c2f1f',''],['B','curly','k','m','','#17131c','c'],
['T','short','k','','shako','#22386e','ef'],['T','long','b','B','wide','#6b4a2a',''],['L','bun','w','','','#3a3550','gcf'],
['L','short','k','','','#2a2f45','t'],['T','short','g','b','wide','#7a4a2f','r'],['L','long','b','B','','#e8e0cc',''],
['L','long','b','','','#8c2f1f','fc'],['L','short','w','B','','#17131c','c'],['L','short','w','s','','#2a2f45','c'],
['L','short','b','b','','#3d3226','t'],['T','bun','k','','','#b3312a','f'],['L','short','k','ms','','#22386e','er']],
    BOF:'ama ama ama ama ama ama cer cer ser ser ser ser ser ser ser ser cer cer cer cer sud sud sud sud sul sul sul',ADJ:'AC:AM,RO;AM:RO,RR,PA,MT;RR:PA;RO:MT;PA:AP,MA,TO,MT;TO:MA,PI,BA,GO,MT;MA:PI;PI:BA,PE,CE;CE:RN,PB,PE;RN:PB;PB:PE;PE:BA,AL;AL:SE,BA;SE:BA;BA:GO,MG,ES;MT:GO,MS;GO:MG,MS,DF;DF:MG;MS:MG,SP,PR;MG:SP,RJ,ES;ES:RJ;RJ:SP;SP:PR;PR:SC;SC:RS',
    P:[[-60.2,5.2],[-59.8,4.4],[-58.9,1.2],[-56.5,1.9],[-54,2.2],[-52.5,2.6],[-51.6,4.4],[-50,1.8],[-50,0],[-48.4,-.7],
[-46,-1],[-44.3,-2.4],[-41.5,-2.9],[-38.5,-3.7],[-35.3,-5.2],[-34.8,-7.2],[-35,-9],[-37,-11],[-38.5,-13],[-39,-15.5],
[-39.2,-18],[-40.3,-20.3],[-41,-22],[-42,-23],[-44.5,-23.3],[-46.3,-24],[-48.5,-25.8],[-48.6,-27.6],[-49.8,-29.3],
[-52.1,-32.1],[-53.4,-33.7],[-55.6,-30.9],[-57.6,-30.2],[-55.9,-28.4],[-53.8,-27.2],[-54.6,-25.6],[-54.3,-24],
[-55.6,-22.3],[-57.9,-22.1],[-57.8,-19],[-58.2,-16.3],[-60.2,-16.3],[-60.5,-13.8],[-63,-12.6],[-65.3,-11.5],[-65.3,-9.8],
[-68.7,-11],[-70.6,-11],[-70.6,-9.5],[-73.2,-9.4],[-74,-7.5],[-72.9,-5.1],[-70,-4.3],[-69.4,-1.1],[-69.9,1.7],[-67.1,1.7],
[-66.9,1.2],[-65.5,.8],[-63.4,2.2],[-64.2,4.1],[-61.5,4.3]],
    RIOS:[[[-70,-4.3],[-65,-3.3],[-60,-3.1],[-55,-2.2],[-51,-.8],[-49.6,-.2]],           // Amazonas
  [[-45.5,-19.5],[-44.5,-15],[-43,-11],[-40.5,-9.3],[-36.8,-10.3]],                          // São Francisco
  [[-50.5,-20],[-52.5,-22.5],[-54.4,-25.4]],[[-48.6,-12.5],[-48.2,-8],[-49.2,-5.3],[-49.3,-1.5]]],
    REG:[['Norte','AC AM RR RO PA AP TO',4],['Nordeste','MA PI CE RN PB PE AL SE BA',6],['Centro-Oeste','MT GO DF MS',3],
  ['Sudeste','MG ES RJ SP',5],['Sul','PR SC RS',3]],SEA:[['RS','RJ'],['RJ','PE'],['PE','PA']],COAST:'AP PA MA PI CE RN PB PE AL SE BA ES RJ SP PR SC RS',
    grid:[-74.5,5.5,.25],
    // contorno real dos estados: malha de UFs do IBGE (qualidade mínima) rasterizada na grade; uma letra por estado na ordem de S, ponto é mar
    CELLS:'.217c3.159c3.158c4.156c7.32f.109c2.7c.c9.32f2.109c5.2c13.31f3.109c18.31f4.109c18.30f5.109c17.31f5.110c16.30f6.110c16.30f7.112c14.15e5.8f8.95b.15b2c13.15e5f16.92b4.13b5c12.9e11f17.85b11.12b5c13.6e15f17.83b11.10b8c13.3e19f15.83b12.7b10c14e22f14.85b11.2b2.b11c14e23f13.83b29c14e23f11e2.82b30c14e23f11e.2e.80b30c10b4e24f9e4.81b31c8b6e23f7e7.81b30c8b6e24f5e12.78b29c3b3c2b6e25f4e12.2e.e.73b29c3b3cb8e24f3e13.e6.71b30c2b13e24f2e23h.67b30c2b14e48h2.66b48e45h6.63b50e43h7.62b51e42h7.62b52e40h8.4h.56b53e40h8.2h5.54b53e39h8.h11i.2j4.43b52e40h19i3j7.41b52e39h19i4j9.39b51e40h17i6j10.38b51e40h17i6j12.35b51e40h17i7j13.30b55e39h18i7j14.25b58e39h19i7j15.22b60e37h21i7j15k.20b60e37h23i7j13k9.12b61e36g4h19i8j13k10.11b61e38g3h18i8j12k11.10b61e39g3h18i8j11k12.10b61e39g3h18i9j9k4lk9.9b60e39g4h19i8j9k2l2k4lk5.8b60e39g5h18i9j8l5k4l6.7b61e37g7h13i15j7l8kl6.7b62e36g6h13i16j7l16.6a3b59qe35g7h11i17m3j5l4m2l9.5a8b55qe35g7h8i19m6j2l4m2l7m3.6a15b47q2e34g8h7i20m13l3m7.7a15b24d4b18q2e34g11h4i19m14l2m7.8a16b22d6b17q2e34g10h4i20m23.9a16b21d7b15q4e32g10h5i18m7pm17.10a17b18d11q17e30g11h4i18p2m4p5m12n2.11a18b14d14q18e28g12h4i17p4m2p8mn3m4n4.10a21b10dbd14q20e26g13h4i8p2i4p6mp9n11.15a6.a13b3d20q32e13g15h3i8p23on8.16a5.2a15d.5d15q45g15h3i8p23o3n5.24a14.7d15q45g15h2ipi7p24o3n4.24a13.7d16q44g19pi6p25o5n.25a11.9d16q44g17p3i4p27o4.27a9.12d15q44g17p5ip26o5.35a.13d21q37g17p34o3.50d21q37g17p34o3.50d21q37g18p35.52d20q37g18p35.53d19q37g18p34.55d19q36g18p34.60d13q37grg16p33.62d12q38rg4r2g10p32.65d9q39r3g2r3g6r3p30.69d6q39r18p29.75q40r18p29.76q39r18p29.76q39r18p29.76q38r20p6u3p19.77q37r20p4u4p20.77q37r18urp2u11p15.76q36r18u4pu15p12.77q34r20u21p10.77q34r14s4ru23p9.77q33r15s4r2u26p6.76q31r21u30p3.85q22r21u30p4.84q23r22u28p5.84q22r23u28p5.84q22r23u27p5.86q6t5q6tq2r23u28p5.88q3t7q2t4q2r24u28p4.88t15q3r24u28p4.89t17r23u27v3p2.90t19r15u3r2u26v6.90t19r13uru33v5.90t22r7u37v6.90t24r5u38v5.89t28ru39v5.89t28u40v5.89t28ux3u35v5.90t28x7u4x4u23v5.91t27x9ux6u22v6.91t26x18u21v5.92t25x18u21wv4.94t24x19u19w2v3.94t24x20u19w5.94t24x22u17w5.94t23x22u16w7.96t4.t15x24u10w11.104t12x24u8w12.106t11y5x21u5x4w9.107t9y11x18ux6w5.w4.108t7y16x20.119t7y16x19.120t6y18x16.122t3.t2y18x13.3x.126y20x10.132y20x9.133y20x8.133y24x3.135y25x.136y25.139y22.141y21.141y12z4y2z3.141z4y6z11.141z9yz10.142z20.142zAz19.139A9z14.137A13z12.135A17z10.134A19z8.134A20z8.133A25z4.132A25z3.133A26z2.133A28.133A28.133A29.132A2.A26.137A21.3A.138A20.2A.140A18.2A2.143A15.A2.145A12.3A.148A10.2A.150A8.A.154A7.155A6.158A.161A.A.159A2.159A2.160A.239',LEFT:['PE','SE','GO'],
    ELITE:{CE:['Jangadeiros','ati',{rng:1}],RS:['Farroupilhas','cav',{dmg:1.25}],AL:['Guerreiros de Palmares','inf',{def:1.3}],SP:['Bandeirantes','inf',{mov:1}],PA:['Cabanos','inf',{dmg:1.2}],
  AM:['Arqueiros Manaó','ati',{dmg:1.25}],BA:['Voluntários da Bahia','inf',{def:1.2}],MG:['Dragões de Minas','cav',{def:1.3}],PE:['Terço dos Henriques','inf',{dmg:1.2}],RJ:['Guarda Imperial','inf',{def:1.25}],
  SC:['Lanceiros de Anita','cav',{mov:1}],MT:['Monçoeiros','ati',{mov:1}],MA:['Balaios','inf',{dmg:1.15}],RN:['Flecheiros Potiguares','ati',{rng:1}],PI:['Vaqueiros','cav',{dmg:1.15}],GO:['Tropeiros','cav',{mov:1}]},
    SCN:[{n:'Independência',y:1822,d:'Vinte e sete províncias livres, cada uma com seu líder. Unifique o Brasil.'}]},

  // ---- Confederação do Equador (1824): Pernambuco, Paraíba, Rio Grande do Norte, Ceará, Alagoas e leste do Piauí ----
  equador:{nome:'Confederação do Equador',ano:1824,word:'territórios',
    title:'1824. Recife rompe com a Corte e chama o Nordeste para uma república. O Império responde com tropas e esquadra.',
    S:[['REC','Recife',-34.95,-8.05,'Frei Caneca','atk',.25,'Typhis Pernambucano'],
      ['GOI','Goiana',-35.1,-7.55,'Paes de Andrade','gold',3,'Presidente da Confederação'],
      ['PAR','Paraíba',-35.2,-7.0,'Natividade Saldanha','gold',2,'Secretário da República'],
      ['CAR','Agreste',-36.3,-8.3,'Agostinho Bezerra','def',.3,'Batalhão dos Henriques'],
      ['NAT','Natal',-35.6,-5.9,'Lorde Cochrane','atk',.3,'Esquadra imperial'],
      ['FOR','Fortaleza',-38.6,-3.9,'Tristão de Alencar','atk',.2,'Presidente do Ceará'],
      ['SOB','Sobral',-40.4,-3.8,'Padre Mororó','gold',2,'Imprensa do Ceará'],
      ['ICO','Icó',-38.85,-6.4,'José Filgueiras','atk',.3,'Comandante das armas'],
      ['CRA','Crato',-39.4,-7.3,'Bárbara de Alencar','def',.4,'Heroína do Cariri'],
      ['MAC','Maceió',-36.0,-9.6,'Lima e Silva','def',.35,'Brigada imperial'],
      ['OEI','Oeiras',-42.0,-7.2,'Sousa Martins','gold',3,'Governo do Piauí'],
      ['PAJ','Pajeú',-38.0,-7.95,'Pedro da Silva Pedroso','rec',0,'Milícias do sertão']],
    L:[['L','tonsure','b','','','#6b4a2a',''],['L','short','k','s','','#17131c','c'],['B','curly','k','','','#2a2f45','t'],['D','short','k','m','band','#8c2f1f',''],
      ['L','wig','b','s','tricorn','#22386e','e'],['L','short','k','B','','#22386e','e'],['T','tonsure','k','','','#17131c',''],['T','short','k','m','wide','#5a2a2a','r'],
      ['L','bun','g','','','#3a3550','cf'],['L','short','g','ms','kepi','#22386e','e'],['L','short','w','s','','#22386e','c'],['B','short','k','b','wide','#7a4a2f','r']],
    BOF:'mata mata mata ser mata ser ser ser ser mata ser ser',
    P:[[-41.9,-2.85],[-40.5,-2.8],[-39.1,-3.3],[-38.0,-4.3],[-37.2,-4.85],[-36.0,-5.05],[-35.25,-5.2],[-35.0,-6.0],[-34.8,-7.2],[-34.85,-8.0],
      [-35.1,-8.8],[-35.6,-9.55],[-36.3,-10.25],[-36.9,-10.6],[-37.8,-9.95],[-38.5,-9.35],[-39.5,-9.2],[-40.5,-9.4],[-41.4,-9.3],[-42.2,-8.8],
      [-42.7,-7.8],[-42.85,-6.0],[-42.6,-4.4]],
    RIOS:[[[-39.6,-7.0],[-38.9,-6.2],[-38.2,-5.2],[-37.75,-4.6]],[[-41.2,-9.35],[-39.5,-9.2],[-38.2,-9.4],[-37.1,-10.1],[-36.5,-10.45]],
      [[-36.4,-7.9],[-35.6,-8.0],[-34.95,-8.05]]],
    REG:[['Pernambuco','REC GOI CAR PAJ',4],['Paraíba e Rio Grande','PAR NAT',3],['Ceará','FOR SOB ICO CRA',4],['Alagoas e Piauí','MAC OEI',3]],
    SEA:[['FOR','REC'],['NAT','MAC']],COAST:'SOB FOR NAT PAR GOI REC MAC',
    NB:[[-47,-1.0],[-44.3,-2.4],[-42.5,-2.8],[-41.9,-2.85],[-40.5,-2.8],[-39.1,-3.3],[-38.0,-4.3],[-37.2,-4.85],[-36.0,-5.05],[-35.25,-5.2],[-35.0,-6.0],[-34.8,-7.2],[-34.85,-8.0],
      [-35.1,-8.8],[-35.6,-9.55],[-36.3,-10.25],[-36.9,-10.6],[-37.4,-11.3],[-37.9,-12.4],[-47,-12.4]],
    NBL:[['MARANHÃO',-43.1,-4.2],['BAHIA',-40.3,-10.3],['OCEANO ATLÂNTICO',-36.4,-3.4]],
    ELITE:{REC:['Voluntários de Caneca','inf',{def:1.2}],CAR:['Batalhão dos Henriques','inf',{dmg:1.2}],FOR:['Jangadeiros','ati',{rng:1}],
      ICO:['Vaqueiros do Jaguaribe','cav',{dmg:1.15}],MAC:['Fuzileiros Imperiais','inf',{def:1.25}],NAT:['Marinheiros de Cochrane','ati',{rng:1}]},
    SCN:[{n:'Confederação do Equador',y:1824,d:'Recife proclama a Confederação; o Ceará adere. O Império marcha de Alagoas pelo Agreste e pelo Pajeú; Natal e Oeiras ficam com a Corte, mas cuidam de si.',
      own:{REC:'REC GOI PAR FOR SOB ICO CRA',MAC:'MAC CAR PAJ'},bonus:{MAC:12},sub:{MAC:16},
      play:{REC:'REC MAC CAR PAJ',MAC:'REC GOI PAR'}}]},

  // ---- Guerra dos Farrapos (1835–1845): Rio Grande do Sul e Santa Catarina ----
  farrapos:{nome:'Guerra dos Farrapos',ano:1835,word:'territórios',
    title:'1835. Os estancieiros do Rio Grande se rebelam, proclamam a República Rio-Grandense e levam a guerra até Laguna.',
    S:[['POA','Porto Alegre',-51.2,-30.05,'Duque de Caxias','def',.3,'O Pacificador'],
      ['RGR','Rio Grande',-52.2,-32.05,'Marechal Andréa','gold',3,'Porto do Rio Grande'],
      ['PEL','Pelotas',-52.4,-31.7,'Domingos de Almeida','gold',3,'Charqueadas'],
      ['PIR','Piratini',-53.1,-31.45,'Bento Gonçalves','atk',.4,'Capital farroupilha'],
      ['BAG','Bagé',-54.1,-31.3,'Antônio de Sousa Neto','atk',.3,'Proclamação do Seival'],
      ['ALE','Alegrete',-55.8,-29.8,'Bento Manuel Ribeiro','rec',0,'Muda de lado'],
      ['CAC','Cachoeira',-52.9,-29.95,'Vicente da Fontoura','gold',2,'Tesouro republicano'],
      ['CCP','Caçapava',-53.5,-30.55,'José Mariano de Mattos','def',.3,'Ministério da Guerra'],
      ['MIS','Missões',-55.8,-28.5,'Davi Canabarro','atk',.3,'Fronteira oeste'],
      ['PFU','Passo Fundo',-52.4,-28.3,'Moringue','def',.4,'Emboscadas na serra'],
      ['VAC','Vacaria',-50.9,-28.55,'Teixeira Nunes','atk',.3,'Lanceiros Negros'],
      ['CAM','Camaquã',-51.85,-30.85,'Giuseppe Garibaldi','rec',0,'Estaleiro do Camaquã'],
      ['LAG','Laguna',-48.95,-28.45,'Anita Garibaldi','atk',.3,'República Juliana'],
      ['DES','Desterro',-48.7,-27.0,'Frederico Mariath','def',.3,'Esquadra imperial'],
      ['LGS','Lages',-50.6,-27.3,'Onofre Pires','gold',2,'Planalto catarinense']],
    L:[['L','short','k','m','kepi','#22386e','e'],['L','short','g','s','shako','#22386e','ec'],['L','short','b','s','','#2a2f45','t'],['L','short','k','ms','','#22386e','er'],
      ['L','short','k','B','wide','#6b4a2a','r'],['T','short','g','m','wide','#3d3226',''],['L','short','b','b','','#17131c','c'],['L','short','k','m','','#2a2f45','c'],
      ['T','short','k','B','wide','#7a4a2f','r'],['T','long','k','m','wide','#56602f',''],['D','short','k','m','kepi','#8c2f1f','e'],['L','long','b','B','','#b3312a',''],
      ['T','bun','k','','','#b3312a','f'],['L','short','w','s','shako','#22386e','e'],['L','short','b','b','','#6b4a2a','r']],
    BOF:'pampa pampa pampa pampa pampa pampa pampa pampa pampa sul sul pampa mata mata sul',
    P:[[-48.6,-26.0],[-50.5,-26.1],[-52.5,-26.25],[-53.8,-26.3],[-53.85,-27.15],[-55.0,-27.75],[-55.9,-28.25],[-56.8,-29.15],[-57.6,-30.2],
      [-56.0,-30.8],[-55.2,-31.0],[-54.5,-31.6],[-53.5,-32.5],[-53.2,-33.0],[-53.4,-33.7],[-52.5,-33.0],[-51.6,-32.0],[-50.7,-31.0],
      [-50.1,-30.0],[-49.7,-29.3],[-48.8,-28.6],[-48.6,-27.8],[-48.45,-27.2],[-48.6,-26.5]],
    LAKES:[[[-51.15,-30.1],[-50.75,-30.55],[-51.0,-31.1],[-51.6,-31.6],[-52.0,-32.0],[-52.15,-31.75],[-51.85,-31.25],[-51.45,-30.6]], // Lagoa dos Patos
      [[-52.6,-32.25],[-52.9,-32.4],[-53.5,-33.2],[-53.25,-33.35],[-52.75,-32.7]]], // Lagoa Mirim
    RIOS:[[[-53.9,-29.6],[-52.9,-30.0],[-51.9,-30.0],[-51.3,-30.05]],[[-53.6,-30.9],[-52.6,-30.85],[-51.9,-30.95]],
      [[-55.0,-29.65],[-56.6,-29.45]],[[-50.3,-27.4],[-51.2,-27.7],[-52.3,-27.5]]],
    REG:[['Campanha','BAG ALE MIS CCP',3],['Litoral e Lagoa','POA RGR PEL CAM PIR',4],['Serra','PFU VAC CAC',2],['Santa Catarina','LAG DES LGS',3]],
    SEA:[['RGR','LAG'],['RGR','DES']],COAST:'DES LAG POA CAM PEL RGR',LEFT:['PEL'],
    NB:[[-62,-22],[-47.5,-22],[-48.3,-25.3],[-48.6,-26.0],[-48.6,-26.5],[-48.45,-27.2],[-48.6,-27.8],[-48.8,-28.6],[-49.7,-29.3],[-50.1,-30.0],[-50.7,-31.0],
      [-51.6,-32.0],[-52.5,-33.0],[-53.4,-33.7],[-53.8,-34.2],[-54.9,-34.95],[-56.2,-34.9],[-57.8,-34.4],[-58.5,-34.6],[-62,-36]],
    NBL:[['ARGENTINA',-56.4,-27.4],['URUGUAI',-55.4,-32.4],['PARANÁ',-51.2,-25.2],['OCEANO ATLÂNTICO',-49.4,-31.6]],
    ELITE:{PIR:['Farroupilhas','cav',{dmg:1.25}],VAC:['Lanceiros Negros','cav',{dmg:1.3}],LAG:['Lanceiros de Anita','cav',{mov:1}],
      POA:['Guarda Nacional','inf',{def:1.25}],CAM:['Marinheiros de Garibaldi','ati',{rng:1}],PFU:['Guerrilheiros de Moringue','inf',{mov:1}],BAG:['Cavalaria do Seival','cav',{def:1.2}]},
    SCN:[{n:'Guerra dos Farrapos',y:1835,d:'Bento Gonçalves domina a Campanha e funda a República em Piratini. O Império segura Porto Alegre, os portos e a Serra.',
      own:{PIR:'PIR BAG CCP CAC MIS VAC CAM ALE',POA:'POA RGR PEL PFU DES'},bonus:{POA:9},sub:{POA:5},
      play:{PIR:'POA RGR PEL LAG',POA:'PIR CCP BAG CAC'}}]},

  // ---- Cabanagem (1835–1840): Grão-Pará, do Amapá ao Rio Negro ----
  cabanagem:{nome:'Cabanagem',ano:1835,word:'territórios',
    title:'1835. Ribeirinhos, indígenas e negros tomam Belém. A revolta sobe o Amazonas enquanto o Império reúne tropas em Cametá.',
    S:[['BEL','Belém',-48.5,-1.5,'Eduardo Angelim','atk',.3,'Presidente cabano'],
      ['VIG','Vigia',-47.9,-0.9,'Francisco Vinagre','gold',2,'Canoeiros do Guajará'],
      ['BRA','Bragança',-46.8,-1.3,'Antônio Vinagre','atk',.25,'Levante do leste'],
      ['ACA','Acará',-48.2,-2.3,'Félix Malcher','gold',2,'Engenhos do Acará'],
      ['MAR','Marajó',-49.4,-0.65,'Batista Campos','def',.3,'O Cônego da Revolta'],
      ['CAM','Cametá',-49.5,-2.4,'Marechal Andréa','def',.35,'Base imperial'],
      ['MAC','Macapá',-51.3,1.3,'Lobo de Souza','def',.4,'Fortaleza de São José'],
      ['SAN','Santarém',-54.7,-2.6,'Tuxaua do Tapajós','atk',.2,'Guerreiros do Tapajós'],
      ['MAU','Maués',-57.6,-3.5,'Tuxaua Mawé','def',.3,'Povo Mawé'],
      ['MAN','Barra do Rio Negro',-60.0,-3.1,'Comandante da Barra','gold',3,'Comércio do Rio Negro'],
      ['XIN','Xingu',-52.3,-3.9,'Vicente Papagaio','rec',0,'Cabanos do Xingu']],
    L:[['T','short','k','','','#e8e0cc','r'],['T','short','k','m','straw','#e8e0cc',''],['T','curly','k','b','','#5a3a1c','r'],['L','short','k','s','wide','#3d3226','c'],
      ['L','tonsure','g','','','#17131c','c'],['L','short','g','s','kepi','#22386e','e'],['L','short','k','m','','#22386e','e'],['I','long','k','','plume','#8c2f1f',''],
      ['I','long','k','','cocar','#8c2f1f',''],['L','short','b','m','shako','#22386e','e'],['B','short','k','b','straw','#e8e0cc','']],
    BOF:'ama ama ama ama ama ama ama ama ama ama ama',
    P:[[-61.0,-0.3],[-58.5,0.7],[-56.5,1.6],[-54.5,2.3],[-52.5,2.6],[-51.6,4.2],[-51.0,3.0],[-50.3,1.8],[-50.0,0.6],[-49.6,0.0],[-48.4,-0.3],
      [-47.6,-0.6],[-46.9,-0.8],[-46.1,-1.1],[-46.3,-2.6],[-47.2,-4.4],[-48.6,-5.4],[-50.6,-5.6],[-54.0,-5.6],[-57.5,-5.0],[-61.0,-4.6]],
    LAKES:[[[-51.4,0.45],[-50.3,0.25],[-49.45,-0.05],[-49.6,-0.25],[-50.6,-0.05],[-51.5,0.15]], // canal norte do Amazonas
      [[-50.7,-1.25],[-49.3,-1.1],[-48.75,-1.0],[-48.8,-1.25],[-49.5,-1.45],[-50.5,-1.6]]], // baía do Marajó
    RIOS:[[[-61,-3.3],[-59,-3.2],[-57,-2.6],[-55,-2.1],[-53,-1.7],[-51.5,-1.2],[-50.8,-0.7]],[[-55.9,-5.4],[-55.2,-3.6],[-54.8,-2.5]],
      [[-49.3,-5.4],[-49.5,-3.5],[-49.6,-1.8]],[[-52.6,-5.5],[-52.1,-3.6],[-52.1,-1.8]]],
    REG:[['Guajará','BEL VIG ACA BRA',4],['Marajó e Amapá','MAR MAC',2],['Baixo Amazonas','CAM SAN XIN',3],['Rio Negro','MAU MAN',3]],
    SEA:[['BEL','MAC'],['BRA','MAR']],COAST:'MAC MAR VIG BRA',
    NB:[[-63,9],[-60,8.5],[-58.6,6.9],[-57.2,6.0],[-55,5.95],[-53.9,5.75],[-52.5,5.2],[-51.7,4.6],[-51.6,4.2],[-51.0,3.0],[-50.3,1.8],[-50.0,0.6],[-49.6,0.0],
      [-48.4,-0.3],[-47.6,-0.6],[-46.9,-0.8],[-46.1,-1.1],[-44.5,-1.6],[-44,-2.4],[-43,-9.5],[-63,-9.5]],
    NBL:[['SURINAME',-55.8,3.9],['GUIANA FRANCESA',-53.1,3.7],['RORAIMA',-60.3,1.9],['AMAZONAS',-59.8,-6.2],['MATO GROSSO',-54.5,-7.2],['MARANHÃO',-45.4,-4.6],['OCEANO ATLÂNTICO',-48.6,2.6]],
    ELITE:{BEL:['Cabanos','inf',{dmg:1.2}],VIG:['Canoeiros do Guajará','ati',{rng:1}],MAU:['Arqueiros Mawé','ati',{dmg:1.25}],SAN:['Guerreiros do Tapajós','inf',{mov:1}],
      CAM:['Fuzileiros Imperiais','inf',{def:1.25}],MAN:['Guarda da Barra','inf',{def:1.2}]},
    SCN:[{n:'Cabanagem',y:1835,d:'Os cabanos tomam Belém e o Guajará. O Império resiste em Cametá, Macapá e na Barra do Rio Negro e espera reforços.',
      own:{BEL:'BEL VIG ACA BRA XIN',CAM:'CAM MAC MAN'},bonus:{CAM:10},sub:{CAM:6},
      play:{BEL:'CAM MAC SAN MAN',CAM:'BEL VIG ACA BRA'}}]},
  balaiada:{nome:'Balaiada',ano:1838,word:'territórios',
    title:'1838. Vaqueiros, artesãos e escravizados fugidos se levantam no Maranhão contra os mandões e o recrutamento forçado.',
    S:[['SLZ','São Luís',-44.3,-2.6,'Luís Alves de Lima','def',.35,'Capital da província'],
      ['ITA','Itapecuru',-44.36,-3.39,'Manuel Balaio','rec',0,'Vingança do Balaio'],
      ['CAX','Caxias',-43.36,-4.86,'Raimundo Gomes','atk',.3,'Vaqueiros em armas'],
      ['QUI','Lagoa Amarela',-42.9,-3.5,'Negro Cosme','def',.3,'Quilombo da Lagoa Amarela'],
      ['VIA','Viana',-45.0,-3.25,'Juiz de Viana','gold',2,'Baixada maranhense'],
      ['PIR','Piracuruca',-41.71,-3.95,'Lívio Castelo Branco','atk',.2,'Balaios do Piauí'],
      ['OEI','Oeiras',-42.13,-6.9,'Barão da Parnaíba','def',.35,'Governo do Piauí'],
      ['PRN','Parnaíba',-41.85,-3.15,'Comandante de Parnaíba','gold',2,'Porto do Delta'],
      ['PSB','Pastos Bons',-44.08,-6.6,'Vaqueiro de Pastos Bons','rec',0,'Sertão de Pastos Bons']],
    L:[['L','short','k','m','kepi','#22386e','e'],['T','short','k','b','straw','#e8e0cc',''],['T','curly','k','m','wide','#8a6a3a','r'],['D','short','k','b','','#e8e0cc','r'],
      ['L','short','g','s','','#17131c','c'],['L','short','b','m','wide','#5a3a1c',''],['L','bald','g','s','','#22386e','e'],['L','short','k','m','shako','#22386e','e'],['T','short','k','','wide','#8a5a2a','']],
    BOF:'mata cer cer mata mata ser ser mata cer',
    P:[[-46.0,-1.1],[-45.2,-1.5],[-44.5,-2.2],[-43.5,-2.5],[-42.2,-2.7],[-41.3,-2.9],[-40.9,-4.5],[-41.3,-6.0],[-41.6,-7.5],[-43.5,-7.6],[-45.5,-7.0],[-46.6,-5.5],[-46.4,-3.0]],
    RIOS:[[[-44.6,-7.4],[-44.4,-5.6],[-44.3,-4.2],[-44.35,-3.2],[-44.4,-2.6]],[[-43.0,-7.5],[-42.6,-5.8],[-42.4,-4.5],[-42.1,-3.6],[-41.9,-3.0]]],
    REG:[['Baixada e capital','SLZ VIA ITA',3],['Leste maranhense','CAX QUI PSB',3],['Piauí','PIR OEI PRN',3]],
    SEA:[['SLZ','PRN']],COAST:'VIA SLZ QUI PRN',
    NB:[[-48.5,-1.0],[-46.0,-1.1],[-45.2,-1.5],[-44.5,-2.2],[-43.5,-2.5],[-42.2,-2.7],[-41.3,-2.9],[-39.5,-2.8],[-38.5,-3.6],[-38.5,-9.5],[-48.5,-9.5]],
    NBL:[['CEARÁ',-40.0,-5.2],['GOIÁS',-46.9,-7.9],['GRÃO-PARÁ',-47.4,-3.2],['OCEANO ATLÂNTICO',-43.4,-1.6]],
    ELITE:{CAX:['Balaios','inf',{dmg:1.2}],QUI:['Quilombolas de Cosme','inf',{def:1.25}],SLZ:['Guarda Nacional','inf',{def:1.2}],PSB:['Vaqueiros','cav',{mov:1}]},
    SCN:[{n:'Balaiada',y:1838,d:'Os balaios tomam o Itapecuru e marcham sobre Caxias. São Luís resiste e espera Lima e Silva; o Piauí do Barão da Parnaíba fica com o Império.',
      own:{CAX:'CAX ITA PSB',SLZ:'SLZ VIA',OEI:'OEI PIR PRN'},bonus:{SLZ:14,CAX:4},sub:{SLZ:7},
      play:{CAX:'SLZ VIA CAX ITA OEI',SLZ:'CAX ITA QUI PSB'}}]},
  sabinada:{nome:'Sabinada',ano:1837,word:'territórios',
    title:'1837. O médico Francisco Sabino proclama a República Bahiense em Salvador. O Recôncavo dos senhores de engenho fica com o Império.',
    S:[['SSA','Salvador',-38.5,-12.97,'Francisco Sabino','atk',.3,'República Bahiense'],
      ['ITP','Itaparica',-38.68,-12.9,'Daniel Gomes de Freitas','def',.3,'Fortes da ilha'],
      ['CMC','Abrantes',-38.3,-12.72,'João Carneiro','gold',2,'Vice-presidente rebelde'],
      ['MSJ','Mata de São João',-38.3,-12.5,'Lavrador da Mata','rec',0,'Lavradores do norte'],
      ['CAC','Cachoeira',-38.96,-12.6,'Brigadeiro Callado','def',.35,'Exército do Recôncavo'],
      ['SFC','São Francisco do Conde',-38.62,-12.62,'Visconde de Pirajá','gold',3,'Engenhos do Recôncavo'],
      ['SAM','Santo Amaro',-38.72,-12.5,'Senhor de Santo Amaro','gold',2,'Açúcar de Santo Amaro'],
      ['FEI','Feira de Santana',-38.97,-12.27,'Vaqueiro da Feira','rec',0,'Feira do gado'],
      ['NAZ','Nazaré',-39.0,-13.05,'Capitão de Nazaré','def',.25,'Farinha de Nazaré']],
    L:[['L','short','k','m','','#17131c','c'],['T','short','k','m','kepi','#5a3a1c','e'],['L','short','b','s','','#17131c','c'],['T','short','k','','straw','#e8e0cc',''],
      ['L','short','g','m','shako','#22386e','e'],['L','wig','w','','tricorn','#22386e','e'],['L','short','k','m','wide','#3d3226','c'],['T','short','k','b','wide','#8a5a2a',''],['T','short','k','m','kepi','#22386e','e']],
    BOF:'mata mata mata mata mata mata mata ser mata',
    P:[[-39.3,-12.1],[-38.6,-12.1],[-38.1,-12.4],[-38.2,-12.75],[-38.45,-13.02],[-38.75,-13.05],[-38.9,-13.25],[-39.3,-13.2],[-39.4,-12.6]],
    LAKES:[[[-38.53,-12.93],[-38.55,-12.79],[-38.65,-12.69],[-38.79,-12.69],[-38.84,-12.78],[-38.75,-12.85],[-38.62,-12.86],[-38.59,-12.95]]], // baía de Todos os Santos
    RIOS:[[[-39.3,-12.45],[-39.05,-12.55],[-38.92,-12.62],[-38.84,-12.7]]],
    REG:[['Salvador e a ilha','SSA ITP CMC',3],['Recôncavo','CAC SFC SAM',4],['Sertão e sul','FEI NAZ MSJ',2]],
    SEA:[['SSA','ITP'],['ITP','NAZ'],['SSA','SFC']],COAST:'MSJ CMC SSA ITP NAZ',
    NB:[[-39.8,-11.7],[-37.6,-11.7],[-37.6,-12.2],[-38.1,-12.4],[-38.2,-12.75],[-38.45,-13.02],[-38.75,-13.05],[-38.9,-13.25],[-39.0,-13.6],[-39.8,-13.6]],
    NBL:[['SERTÃO',-39.55,-11.95],['OCEANO ATLÂNTICO',-38.0,-13.0]],
    ELITE:{SSA:['Voluntários da República','inf',{dmg:1.2}],ITP:['Artilheiros da ilha','art',{rng:1}],CAC:['Batalhão do Recôncavo','inf',{def:1.25}],FEI:['Vaqueiros','cav',{mov:1}]},
    SCN:[{n:'Sabinada',y:1837,d:'Os rebeldes dominam Salvador, a ilha e o litoral norte. O Império reúne o Recôncavo em Cachoeira e fecha o cerco por terra e mar.',
      own:{SSA:'SSA ITP CMC',CAC:'CAC SFC SAM FEI'},bonus:{CAC:8,SSA:5},sub:{CAC:5},
      play:{SSA:'SSA CAC SFC SAM',CAC:'SSA ITP CMC'}}]},
  males:{nome:'Revolta dos Malês',ano:1835,word:'territórios',
    title:'Noite de 24 para 25 de janeiro de 1835. Africanos muçulmanos, os malês, se levantam em Salvador. A cidade inteira vira campo de batalha.',
    S:[['LAD','Ladeira da Praça',-38.503,-12.968,'Manoel Calafate','atk',.3,'Casa de Calafate'],
      ['PAL','Palácio',-38.511,-12.974,'Gonçalves Martins','def',.35,'Chefia de polícia'],
      ['VIT','Vitória',-38.522,-12.999,'Ahuna','atk',.25,'Mestre dos malês'],
      ['CPG','Campo Grande',-38.517,-12.986,'Luís Sanim','gold',2,'Rede dos ganhadores'],
      ['AGM','Água de Meninos',-38.503,-12.951,'Comandante da Cavalaria','def',.4,'Quartel da cavalaria'],
      ['BBL','Barbalho',-38.494,-12.962,'Guarnição do Barbalho','def',.3,'Forte do Barbalho'],
      ['CLC','Calçada',-38.499,-12.938,'Elesbão do Carmo','atk',.2,'Dandará'],
      ['ITG','Itapagipe',-38.505,-12.92,'Pacífico Licutan','rec',0,'Mestre preso'],
      ['RVE','Rio Vermelho',-38.488,-13.006,'Pescador do Rio Vermelho','rec',0,'Pescadores'],
      ['CBR','Cabula',-38.47,-12.935,'Quilombola do Cabula','def',.25,'Quilombos da mata']],
    L:[['D','short','k','b','wrap','#e8e0cc','r'],['L','short','k','m','','#17131c','c'],['D','bald','k','b','wrap','#e8e0cc',''],['D','short','k','m','band','#e8e0cc','r'],['L','short','k','m','shako','#22386e','e'],
      ['T','short','k','m','kepi','#22386e','e'],['D','short','k','','wrap','#e8e0cc','r'],['D','bald','g','b','wrap','#e8e0cc',''],['B','short','k','','straw','#8a5a2a',''],['D','curly','k','','','#5a3a1c','']],
    BOF:'mata mata mata mata mata mata mata mata mata mata',
    P:[[-38.535,-13.012],[-38.528,-12.99],[-38.515,-12.975],[-38.509,-12.955],[-38.512,-12.935],[-38.516,-12.915],[-38.497,-12.903],[-38.47,-12.905],[-38.45,-12.93],[-38.458,-12.97],[-38.47,-13.01],[-38.5,-13.022]],
    RIOS:[],
    REG:[['Cidade Alta','PAL LAD CPG',3],['Cidade Baixa','AGM CLC ITG',3],['Arredores','VIT RVE CBR BBL',3]],
    SEA:[['VIT','AGM']],COAST:'VIT PAL AGM CLC ITG RVE',
    NB:[[-38.6,-12.85],[-38.3,-12.85],[-38.3,-13.05],[-38.47,-13.01],[-38.458,-12.97],[-38.45,-12.93],[-38.47,-12.905],[-38.497,-12.903],[-38.516,-12.915],[-38.56,-12.88]],
    NBL:[['BAÍA DE TODOS OS SANTOS',-38.56,-12.96],['OCEANO ATLÂNTICO',-38.43,-13.03]],
    ELITE:{LAD:['Malês','inf',{dmg:1.25}],AGM:['Cavalaria da polícia','cav',{dmg:1.2}],PAL:['Permanentes','inf',{def:1.25}]},
    SCN:[{n:'Revolta dos Malês',y:1835,d:'A revolta estoura antes da hora, na Ladeira da Praça. Os malês precisam tomar a cidade antes do amanhecer; a polícia e a cavalaria guardam o Palácio e Água de Meninos.',
      own:{LAD:'LAD VIT CLC ITG',PAL:'PAL AGM BBL'},bonus:{PAL:12,LAD:3},sub:{PAL:6},
      play:{LAD:'PAL AGM BBL LAD',PAL:'LAD VIT CLC ITG'}}]}
};
const TKEY=(typeof location!='undefined'&&THEATERS[location.hash.slice(1)])?location.hash.slice(1):(globalThis.TB_THEATER||'brasil');
const TH=THEATERS[TKEY],TW=TH.word,TW1=TW=='estados'?'estado':'território'; // palavra usada nos textos
const S=TH.S,L=TH.L,BOF=TH.BOF.split(' ');
const BIO={ // g: chão (xadrez), gd/gl: tufos, f: matas, m: morros, mc: cores do morro [claro,escuro,topo]
  ama:{nome:'Selva amazônica',g:['#36a43c','#2f9c37'],gd:'#237d2e',gl:'#6fcf52',tree:'jungle',f:24,m:4,river:1,mesa:1,mc:['#7a7f78','#555a55','#4f9a45']},
  ser:{nome:'Sertão',g:['#eac25e','#e3b955'],gd:'#c4953c',gl:'#f8e09a',tree:'cactus',f:12,m:9,river:0,mesa:1,mc:['#c9824f','#9a5a36','#e0a56f']},
  cer:{nome:'Cerrado',g:['#b9c23c','#b0ba36'],gd:'#8f9a28',gl:'#dbe060',tree:'twist',f:14,m:6,river:0,mesa:1,mc:['#b9895a','#8a6240','#a3ad4c']},
  sud:{nome:'Serras do Sudeste',g:['#5cb83e','#54af39'],gd:'#3b8f2c',gl:'#8cdc5c',tree:'round',f:15,m:10,river:0,mesa:0,mc:['#9a9488','#69645c','#c9c4b8']},
  sul:{nome:'Campos do Sul',g:['#98cc44','#90c43f'],gd:'#6ea52e',gl:'#c0e868',tree:'pine',f:14,m:5,river:1,mesa:0,mc:['#8f958a','#60665e','#bfc5b8']},
  mata:{nome:'Zona da Mata',g:['#4cae3e','#45a539'],gd:'#2f8a2c',gl:'#7fd45a',tree:'round',f:20,m:4,river:1,mesa:0,mc:['#9a9488','#69645c','#6fbf52']},
  pampa:{nome:'Pampa',g:['#a8d24c','#a0ca46'],gd:'#7fae34',gl:'#d0ec74',tree:'round',f:7,m:3,river:1,mesa:0,mc:['#8f958a','#60665e','#a8d24c']}};
const CFG={mus:.4,vol:.5,tac:0,speed:1,diff:1,shake:1,clash:1,uiz:1}; // tac: 0 sempre tática, 1 só nos ataques, 2 automática
const N=S.length, ix=Object.fromEntries(S.map((s,i)=>[s[0],i]));
const P=TH.P,RIOS=TH.RIOS,LAKES=TH.LAKES||[];
// grade fixa de 81x79 casas; o enquadramento se ajusta ao contorno de cada teatro
const W=162,H=158,C=5,[X0,Y0,D]=TH.grid||(()=>{const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),mx=Math.min(...xs),Mx=Math.max(...xs),my=Math.min(...ys),My=Math.max(...ys),
  d=Math.max((Mx-mx)/(W-16),(My-my)/(H-24));return[(mx+Mx)/2-W*d/2,(my+My)/2+H*d/2+d*6,d]})();
const inPoly=(x,y,Q=P)=>{let c=false;for(let i=0,j=Q.length-1;i<Q.length;j=i++){const[xi,yi]=Q[i],[xj,yj]=Q[j];
  if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const cell=new Int8Array(W*H).fill(-1); // -1 mar ou lagoa, -2 terra vizinha (fora do jogo), >=0 território
if(TH.CELLS){let k=0;for(const m of TH.CELLS.matchAll(/([.a-zA])(\d*)/g)){const n=+m[2]||1;cell.fill(m[1]=='.'?-1:m[1]=='A'?26:m[1].charCodeAt(0)-97,k,k+n);
  k+=n} /* estados com o formato real */
  if(LAKES.length)for(let q=0;q<W*H;q++){const lon=X0+(q%W+.5)*D,lat=Y0-((q/W|0)+.5)*D;if(LAKES.some(L=>inPoly(lon,lat,L)))cell[q]=-1}
  S.forEach((s,i)=>{let sx=0,sy=0,n=0;for(let q=0;q<W*H;q++)if(cell[q]==i){sx+=q%W;sy+=q/W|0;n++} /* bandeira no miolo do estado: casa interna mais perto do centro */
    const mx=sx/n,my=sy/n,own=q=>cell[q]==i,inn=q=>own(q-1)&&own(q+1)&&own(q-W)&&own(q+W);let best=-1,bd=1e9;
    for(const strict of[true,false]){for(let q=0;q<W*H;q++)if(own(q)&&(!strict||inn(q))){const d=Math.hypot(q%W-mx,(q/W|0)-my);if(d<bd){bd=d;best=q}}if(best>=0)break}
    s[2]=X0+(best%W+.5)*D;s[3]=Y0-((best/W|0)+.5)*D})}
else for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
  const lon=X0+(cx+.5)*D,lat=Y0-(cy+.5)*D;
  if(!inPoly(lon,lat)||LAKES.some(q=>inPoly(lon,lat,q))){if(TH.NB&&!inPoly(lon,lat)&&inPoly(lon,lat,TH.NB))cell[cy*W+cx]=-2;
    continue}
  let best=-1,bd=1e9;
  S.forEach((s,i)=>{const d=Math.hypot(lon-s[2],lat-s[3]);
    if(s[0]=='DF'&&d>.75)return; // DF é um enclave pequeno, não uma região de Voronoi
    if(d<bd){best=i;bd=d}});
  cell[cy*W+cx]=best}
// vizinhança: lista escrita à mão no Brasil; nas campanhas, calculada pelas fronteiras do próprio mapa
const adj=S.map(()=>[]),link=(a,b)=>{if(a!=b&&!adj[a].includes(b)){adj[a].push(b);adj[b].push(a)}};
if(TH.ADJ)TH.ADJ.split(';').forEach(l=>{const[a,b]=l.split(':');b.split(',').forEach(c=>link(ix[a],ix[c]))});
else for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const s=cell[cy*W+cx];if(s<0)continue;
  if(cx+1<W&&cell[cy*W+cx+1]>=0)link(s,cell[cy*W+cx+1]);if(cy+1<H&&cell[(cy+1)*W+cx]>=0)link(s,cell[(cy+1)*W+cx])}
// dominar uma região inteira rende ouro extra por turno
const REG=TH.REG.map(([n,u,b])=>[n,u.split(' ').map(k=>ix[k]),b]);
// rotas marítimas: portos distantes contam como vizinhos
const SEA=TH.SEA.map(q=>q.map(k=>ix[k]));SEA.forEach(([a,b])=>link(a,b));
// territórios litorâneos na ordem da costa; um porto liga o território a outros litorâneos a até 4 posições
const COAST=TH.COAST.split(' ').map(k=>ix[k]);
const ADJ0=adj.map(a=>[...a]);let portLinks=[];
// cenário: dono inicial (líder: territórios), bônus de tropas, quem pode jogar e o objetivo de cada lado
const codes=v=>v.split(' ').map(u=>ix[u]);
const SCN=TH.SCN.map(s=>({...s,sub:s.sub&&Object.fromEntries(Object.entries(s.sub).map(([k,v])=>[ix[k],v])),bonus:s.bonus&&Object.fromEntries(Object.entries(s.bonus).map(([k,v])=>[ix[k],v])),
  own:s.own&&Object.fromEntries(Object.entries(s.own).map(([k,v])=>[ix[k],codes(v)])),play:s.play&&Object.fromEntries(Object.entries(s.play).map(([k,v])=>[ix[k],codes(v)]))}));

// câmera: o mapa plano (810x790) vira um tabuleiro visto de cima e de frente
const SW=W*C,SH=H*C,K=.35,HS=520,YB=578,F1=1/(1+K);
const proj0=(sx,sy)=>{const t=1-sy/SH,sc=1/(1+K*t);return[SW/2+(sx-SW/2)*sc,YB-HS*t*sc/F1,sc]};
const unproj0=(x,y)=>{const g=(YB-y)/HS*F1;if(g<0||g>F1)return null;const t=g/(1-K*g),sc=1/(1+K*t);return[SW/2+(x-SW/2)/sc,(1-t)*SH,sc]};
// câmera do mapa: a cena acima (810x610) é ampliada e deslocada para a tela; proj/unproj já incluem a câmera
const MC={cx:405,cy:330,z:1,tx:405,ty:330,tz:1,fz:1,t:0,ok:0};let RS=1; // RS: pixels de canvas por pixel de tela
const proj=(sx,sy)=>{const p=proj0(sx,sy);return[cv.width/2+(p[0]-MC.cx)*MC.z,cv.height/2+(p[1]-MC.cy)*MC.z,p[2]*MC.z]};
const unproj=(x,y)=>unproj0(MC.cx+(x-cv.width/2)/MC.z,MC.cy+(y-cv.height/2)/MC.z);
const toScr=(x,y)=>[cv.width/2+(x-MC.cx)*MC.z,cv.height/2+(y-MC.cy)*MC.z]; // ponto da cena na tela
