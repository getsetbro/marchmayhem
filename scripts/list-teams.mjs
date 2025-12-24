
import fs from 'fs';
import path from 'path';

const historyDir = path.join(process.cwd(), 'app/data/history');
const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));

const teams = new Set();

files.forEach(file => {
  const content = JSON.parse(fs.readFileSync(path.join(historyDir, file), 'utf-8'));
  content.forEach(item => {
    const g = item.game;
    if (g.home?.names?.seo) teams.add(g.home.names.seo);
    if (g.away?.names?.seo) teams.add(g.away.names.seo);
  });
});

console.log(Array.from(teams).sort().join('\n'));
