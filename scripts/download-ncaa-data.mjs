import fs from 'fs';
import path from 'path';

const TOURNAMENT_DATES = {
  "2025": ["2025/03/20", "2025/03/21"],
  "2024": ["2024/03/21", "2024/03/22"],
  "2023": ["2023/03/16", "2023/03/17"],
  "2022": ["2022/03/17", "2022/03/18"],
  "2021": ["2021/03/19", "2021/03/20"],
  "2019": ["2019/03/21", "2019/03/22"],
  "2018": ["2018/03/15", "2018/03/16"],
  "2017": ["2017/03/16", "2017/03/17"],
  "2016": ["2016/03/17", "2016/03/18"],
  "2015": ["2015/03/19", "2015/03/20"],
  "2014": ["2014/03/20", "2014/03/21"],
  "2013": ["2013/03/21", "2013/03/22"],
  "2011": ["2011/03/17", "2011/03/18"],
};

const outputDir = path.join(process.cwd(), 'app', 'data', 'history');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadData() {
  for (const [year, dates] of Object.entries(TOURNAMENT_DATES)) {
    console.log(`Downloading data for ${year}...`);
    let allGames = [];

    // We also want to fetch subsequent rounds to get the FULL history for validation
    // The current dates only cover the first round (Thurs/Fri).
    // To validate the full bracket, we technically need all games from the tournament.
    // The API structure is by date.
    // Simplifying assumption: The API might just return all games for a year if we hit a certain endpoint? 
    // No, it's a daily scoreboard.
    // So to get the full tournament results for validation, we need to fetch ALL dates of the tournament.
    // Or, we can blindly fetch dates for ~3 weeks from the start date.

    // Calculate dates for the ensuing 3 weeks (covers R1, R2, S16, E8, F4, Champ)
    const startDate = new Date(dates[0]);
    const fetchDates = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      fetchDates.push(d.toISOString().split('T')[0].replace(/-/g, '/'));
    }

    // Optimization: Parallel fetch
    // But be nice to the API
    for (const date of fetchDates) {
      try {
        const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${date}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.games) {
            // Filter for NCAA Tournament games (has bracketRegion OR bracketRound)
            const tourneyGames = data.games.filter(g => g.game.bracketRegion || g.game.bracketRound);
            allGames.push(...tourneyGames);
          }
        }
      } catch (e) {
        console.error(`Error fetching ${date}:`, e.message);
      }
    }

    // Deduplicate games by gameID (if any overlap/redundancy)
    const uniqueGames = [];
    const seenIds = new Set();
    for (const g of allGames) {
      let uniqueKey = g.game.gameID;
      if (!uniqueKey) {
        // Fallback key: Date + Home Team + Away Team
        uniqueKey = `${g.game.startDate}-${g.game.home.names.short}-${g.game.away.names.short}`;
      }

      if (!seenIds.has(uniqueKey)) {
        seenIds.add(uniqueKey);
        uniqueGames.push(g);
      }
    }

    if (uniqueGames.length > 0) {
      fs.writeFileSync(path.join(outputDir, `${year}.json`), JSON.stringify(uniqueGames, null, 2));
      console.log(`Saved ${uniqueGames.length} games for ${year}`);
    } else {
      console.warn(`No games found for ${year}`);
    }
  }
}

downloadData();
