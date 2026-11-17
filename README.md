# Terra Brasilis

Jogo de estratégia por turnos em pixel art: unifique os 27 estados do Brasil com líderes históricos.

**Jogar:** https://criativelucas.github.io/terra-brasilis/

## Modos de jogo

- **Dominação do Brasil**: os 27 estados, cada um com seu líder; vence quem unificar o país.
- **Campanhas históricas**: cada guerra tem mapa próprio, só da região dela, dividido em territórios da época, com os líderes daquela guerra e um objetivo para cada lado.
  - Confederação do Equador (1824): `#equador`
  - Guerra dos Farrapos (1835): `#farrapos`
  - Cabanagem (1835): `#cabanagem`

O modo vem do endereço (por exemplo `.../terra-brasilis/#farrapos`). Cada modo tem seu próprio salvamento.

Para criar uma campanha nova, acrescente um teatro em `THEATERS` (`js/data.js`): territórios com coordenadas, retratos, biomas, contorno do mapa em lon/lat, lagoas, rios, regiões, costa, tropas de elite e o cenário (donos iniciais, bônus, subsídio da Corte e objetivo de cada lado). A vizinhança é calculada sozinha pelas fronteiras do mapa.

## Rodar localmente

Os scripts são carregados por arquivo, então abra por um servidor (não por `file://`):

```bash
python3 -m http.server 8765
```

Depois acesse http://localhost:8765.

## Estrutura

| Arquivo | O que tem |
|---|---|
| `js/data.js` | teatros de guerra (Brasil e campanhas): territórios, líderes, biomas, regiões, cenário, geografia do mapa |
| `js/rules.js` | regras da campanha, IA estratégica, diplomacia, portos (sem DOM) |
| `js/base.js` | utilidades de tela, configurações, efeitos sonoros |
| `js/portraits.js` | retratos 24x24 gerados por código |
| `js/map.js` | mapa em perspectiva, rotas, zoom |
| `js/battle-rules.js` | grade tática, unidades, elite, alcance e dano |
| `js/battle-art.js` | terrenos e sprites das unidades |
| `js/battle.js` | rodadas, IA de campo, cena de combate |
| `js/hq.js` | quartel-general isométrico |
| `js/screens.js` | menu, salvamento, telas, tutorial, diplomacia |
| `js/ui.js` | painel lateral e cliques |
| `js/music.js` | trilha chiptune |
| `js/assets.js` | carrega folhas de sprite opcionais |

Os scripts compartilham o escopo global e precisam ser carregados na ordem de `index.html`.

## Equilíbrio

`tools/sim.js` joga partidas sem tela em todos os teatros (batalhas resolvidas nos dados) e mostra a taxa de vitória e o turno em que o jogador cai, por lado e dificuldade:

```bash
node tools/sim.js 200
```

## Arte própria (folhas de sprite)

Edite `assets/sprites.json` para trocar a arte gerada por imagens suas. Coloque as imagens em `assets/`:

```json
{
  "portraits": { "RJ": "assets/portraits/RJ.png", "RS": "assets/portraits/RS.png" },
  "units": {
    "inf": { "src": "assets/units/inf.png", "frames": 2 },
    "cav": { "src": "assets/units/cav.png", "frames": 2 },
    "ati": { "src": "assets/units/ati.png", "frames": 2 },
    "art": { "src": "assets/units/art.png", "frames": 2 },
    "ld":  { "src": "assets/units/comandante.png", "frames": 2 }
  }
}
```

- **Retratos**: chave é a sigla do estado. Imagem quadrada, qualquer tamanho; é desenhada sem suavização.
- **Unidades**: tipos `inf`, `cav`, `ati`, `art` e `ld` (comandante). Cada imagem tem os quadros lado a lado, todos do mesmo tamanho, virados para a direita. A proporção ideal é 26x24 por quadro (ou múltiplos, como 52x48). O jogo pinta uma faixa de 2 px na base com a cor da facção.
- Qualquer item ausente continua com a arte gerada por código.
