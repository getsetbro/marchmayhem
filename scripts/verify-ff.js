const fs = require('fs');
const data = JSON.parse(fs.readFileSync('app/data/history/2021.json', 'utf-8'));

// Check for Final Four games
const ffGames = data.filter(g => {
  const round = (g.game.bracketRound || '').toUpperCase();
  return round.includes('FINAL') || round.includes('SEMIFINAL') || round.includes('CHAMPIONSHIP');
});

console.log('Final Four / Championship games found:', ffGames.length);
ffGames.forEach(g => {
  const winner = g.game.home.winner === 'true' ? g.game.home.names.short : g.game.away.names.short;
  console.log('-', g.game.home.names.short, 'vs', g.game.away.names.short, '| Winner:', winner, '| Round:', g.game.bracketRound);
});
