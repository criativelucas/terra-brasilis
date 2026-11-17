// Simula partidas sem tela para medir o equilíbrio: node tools/sim.js [partidas]
// Carrega só js/data.js e js/rules.js de cada teatro; batalhas resolvem nos dados (fight), como no modo "Automáticas".
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8');
function theater(key) {
  const ctx = vm.createContext({ Math, console, Object, Array, Set, Map, JSON, Number, Int8Array, Float32Array, TB_THEATER: key });
  for (const f of ['data', 'rules']) vm.runInContext(src(f), ctx);
  const run = code => vm.runInContext(code, ctx);
  run('CFG.tac=2'); // sem batalha tática: não há tela
  return run;
}
// Estratégias do jogador: 'parado' só passa o turno; 'ia' joga como a IA.
function play(run, diff, who, policy, max) {
  run(`CFG.diff=${diff};reset(0);startAs(${who})`);
  for (let t = 0; t < max; t++) {
    if (policy == 'ia') run('ai(me);gold[me]-=income(me)'); // ai() soma a renda; closeTurn soma de novo
    run('endTurn()');
    if (run('over')) return { turns: t + 1, win: run('victory') };
  }
  return { turns: max, win: false, stall: true };
}
const med = a => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] };
function report(label, r) {
  const wins = r.filter(g => g.win).length, lost = r.filter(g => !g.win && !g.stall);
  console.log(label.padEnd(46), `vitórias ${String(Math.round(wins / r.length * 100)).padStart(3)}%`,
    `| cai no turno (mediana) ${lost.length ? med(lost.map(g => g.turns)) : '-'}`.padEnd(30),
    `| sem fim ${Math.round(r.filter(g => g.stall).length / r.length * 100)}%`);
}
const n = +process.argv[2] || 200, max = 120, DIFF = ['Fácil', 'Normal', 'Difícil'];
const keys = Object.keys(theater('brasil')('THEATERS'));
for (let d = 0; d < 3; d++) {
  console.log(`\n== ${DIFF[d]} ==`);
  for (const key of keys) {
    const run = theater(key), sides = key == 'brasil' ? null : Object.keys(run('SCN[0].play')).map(Number);
    for (const policy of ['parado', 'ia']) {
      if (!sides) report(`Dominação · líder sorteado · ${policy}`, Array.from({ length: n }, () => play(run, d, Math.random() * 27 | 0, policy, max)));
      else for (const f of sides) report(`${run('TH.nome')} · ${run(`S[${f}][4]`)} · ${policy}`, Array.from({ length: n / 2 | 0 }, () => play(run, d, f, policy, max)));
    }
  }
}
