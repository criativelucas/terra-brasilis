// Simula campanhas sem tela para medir o equilíbrio: node tools/sim.js [partidas]
// Carrega só js/data.js e js/rules.js; batalhas resolvem nos dados (fight), como no modo "Automáticas".
const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = vm.createContext({ Math, console, Object, Array, Set, Map, JSON, Number, Int8Array, Float32Array });
for (const f of ['data', 'rules'])
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx);
const run = code => vm.runInContext(code, ctx);
run('CFG.tac=2'); // sem batalha tática: não há tela

// Joga uma campanha. Estratégias do jogador: 'parado' só passa o turno; 'ia' joga como a IA.
function play(sc, diff, who, policy, max = 120) {
  run(`CFG.diff=${diff};reset(${sc});startAs(${who})`);
  for (let t = 0; t < max; t++) {
    if (policy == 'ia') run('ai(me);gold[me]-=income(me)'); // ai() soma a renda; closeTurn soma de novo
    run('endTurn()');
    const over = run('over'), victory = run('victory');
    if (over) return { turns: t + 1, win: victory };
  }
  return { turns: max, win: false, stall: true };
}
const med = a => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] };
const report = (label, games) => {
  const r = games, wins = r.filter(g => g.win).length, lost = r.filter(g => !g.win && !g.stall);
  console.log(label.padEnd(44), `vitórias ${String(Math.round(wins / r.length * 100)).padStart(3)}%`,
    `| cai no turno (mediana) ${lost.length ? med(lost.map(g => g.turns)) : '-'}`.padEnd(32),
    `| empata em ${max ? '' : ''}${Math.round(r.filter(g => g.stall).length / r.length * 100)}%`);
};
const max = 120, n = +process.argv[2] || 200;
const DIFF = ['Fácil', 'Normal', 'Difícil'], SCN = run('SCN');
for (let d = 0; d < 3; d++) {
  console.log(`\n== ${DIFF[d]} ==`);
  for (const policy of ['parado', 'ia']) {
    // Independência: líder sorteado
    report(`Independência · ${policy}`, Array.from({ length: n }, () => play(0, d, Math.random() * 27 | 0, policy, max)));
    for (let sc = 1; sc < SCN.length; sc++) for (const f of Object.keys(SCN[sc].play))
      report(`${SCN[sc].n} · ${run(`S[${f}][4]`)} · ${policy}`, Array.from({ length: n / 2 | 0 }, () => play(sc, d, +f, policy, max)));
  }
}
