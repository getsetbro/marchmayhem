const fs = require('fs');
const data = JSON.parse(fs.readFileSync('app/data/history/2021.json', 'utf-8'));

// Find all unique bracketRound values
const rounds = new Set();
data.forEach(g => rounds.add(g.game.bracketRound));
console.log('All bracketRound values:', [...rounds]);

// Find games with no bracketRegion (likely Final Four)
const noRegion = data.filter(g => !g.game.bracketRegion);
console.log('Games with no bracketRegion:', noRegion.length);
noRegion.slice(0, 5).forEach(g => {
  console.log('-', g.game.home.names.short, 'vs', g.game.away.names.short);
});

// Check for Baylor and Gonzaga games (2021 finalists)
const finalists = data.filter(g =>
  (g.game.home.names.short === 'Baylor' || g.game.away.names.short === 'Baylor') ||
  (g.game.home.names.short === 'Gonzaga' || g.game.away.names.short === 'Gonzaga')
);
console.log('\nBaylor/Gonzaga games:', finalists.length);
finalists.forEach(g => {
  console.log('-', g.game.home.names.short, 'vs', g.game.away.names.short, '| Region:', g.game.bracketRegion, '| Round:', g.game.bracketRound);
});
