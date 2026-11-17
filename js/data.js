// teatros de guerra: o Brasil inteiro (modo Dominação) e um mapa próprio para cada campanha histórica.
// Cada teatro: territórios S [sigla, nome, lon, lat, líder, traço, valor, característica], retratos L, biomas BOF,
// contorno P (lon,lat), lagoas, rios, regiões, rotas marítimas, costa, tropas de elite e cenário.
// O teatro vem do endereço: #equador, #farrapos, #cabanagem; sem nada, é a Dominação do Brasil.
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
    grid:[-74.5,5.5,.5],LEFT:['PE','SE','GO'],
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
    ELITE:{BEL:['Cabanos','inf',{dmg:1.2}],VIG:['Canoeiros do Guajará','ati',{rng:1}],MAU:['Arqueiros Mawé','ati',{dmg:1.25}],SAN:['Guerreiros do Tapajós','inf',{mov:1}],
      CAM:['Fuzileiros Imperiais','inf',{def:1.25}],MAN:['Guarda da Barra','inf',{def:1.2}]},
    SCN:[{n:'Cabanagem',y:1835,d:'Os cabanos tomam Belém e o Guajará. O Império resiste em Cametá, Macapá e na Barra do Rio Negro e espera reforços.',
      own:{BEL:'BEL VIG ACA BRA XIN',CAM:'CAM MAC MAN'},bonus:{CAM:10},sub:{CAM:6},
      play:{BEL:'CAM MAC SAN MAN',CAM:'BEL VIG ACA BRA'}}]}
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
const CFG={mus:.4,vol:.5,tac:0,speed:1,diff:1,shake:1,clash:1}; // tac: 0 sempre tática, 1 só nos ataques, 2 automática
const N=S.length, ix=Object.fromEntries(S.map((s,i)=>[s[0],i]));
const P=TH.P,RIOS=TH.RIOS,LAKES=TH.LAKES||[];
// grade fixa de 81x79 casas; o enquadramento se ajusta ao contorno de cada teatro
const W=81,H=79,C=10,[X0,Y0,D]=TH.grid||(()=>{const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),mx=Math.min(...xs),Mx=Math.max(...xs),my=Math.min(...ys),My=Math.max(...ys),
  d=Math.max((Mx-mx)/(W-8),(My-my)/(H-12));return[(mx+Mx)/2-W*d/2,(my+My)/2+H*d/2+d*3,d]})();
const inPoly=(x,y,Q=P)=>{let c=false;for(let i=0,j=Q.length-1;i<Q.length;j=i++){const[xi,yi]=Q[i],[xj,yj]=Q[j];
  if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
const cell=new Int8Array(W*H).fill(-1); // -1 mar ou lagoa, >=0 território
for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
  const lon=X0+(cx+.5)*D,lat=Y0-(cy+.5)*D;
  if(!inPoly(lon,lat)||LAKES.some(q=>inPoly(lon,lat,q)))continue;
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
const proj=(sx,sy)=>{const t=1-sy/SH,sc=1/(1+K*t);return[SW/2+(sx-SW/2)*sc,YB-HS*t*sc/F1,sc]};
const unproj=(x,y)=>{const g=(YB-y)/HS*F1;if(g<0||g>F1)return null;const t=g/(1-K*g),sc=1/(1+K*t);return[SW/2+(x-SW/2)/sc,(1-t)*SH,sc]};
