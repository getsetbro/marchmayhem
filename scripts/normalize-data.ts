/**
 * Normalization Script for NCAA Tournament Data
 * 
 * This script transforms raw NCAA tournament data files into a consistent format
 * that works identically across all years.
 * 
 * Usage: npx tsx scripts/normalize-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ===========================================
// NORMALIZED DATA STRUCTURE
// ===========================================

interface NormalizedTeam {
  seed: number;
  name: string;       // Short name (e.g., "Duke")
  seo: string;        // SEO slug (e.g., "duke")
  fullName?: string;  // Full name (e.g., "Duke University")
}

interface NormalizedMatchup {
  matchup: number;    // 1-64 (our consistent numbering)
  round: number;      // 1=R64, 2=R32, 3=Sweet16, 4=Elite8, 5=F4, 6=Championship
  region: number;     // 1=South, 2=East, 3=Midwest, 4=West, 5=FinalFour, 6=Champion
  teamTop: NormalizedTeam | null;
  teamBottom: NormalizedTeam | null;
  winner: 'top' | 'bottom' | null;
  gameUrl?: string;
}

interface NormalizedTournament {
  year: number;
  matchups: NormalizedMatchup[];
}

// ===========================================
// REGION AND ROUND MAPPING
// ===========================================

const regionMap: Record<string, number> = {
  'south': 1,
  'southeast': 1,  // 2011 used Southeast
  'east': 2,
  'midwest': 3,
  'southwest': 3,  // 2011 used Southwest
  'west': 4,
};

// Seed pairs for Round 1: matchup position -> [higher seed, lower seed]
const seedPairs: [number, number][] = [
  [1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getRegion(bracketRegion: string): number {
  return regionMap[bracketRegion.toLowerCase()] || 0;
}

function getRoundFromBracketId(bracketId: number): number {
  // NCAA uses different ID ranges per region, but the round can be inferred from the hundreds digit
  const hundreds = Math.floor(bracketId / 100);
  if (hundreds === 2) return 1;  // 2xx = Round of 64
  if (hundreds === 3) return 2;  // 3xx = Round of 32
  if (hundreds === 4) return 3;  // 4xx = Sweet 16
  if (hundreds === 5) return 4;  // 5xx = Elite 8
  if (hundreds === 6) return 5;  // 6xx = Final Four
  if (hundreds === 7) return 6;  // 7xx = Championship
  return 0;
}

// Get matchup number for Round 1 games using seeds
function getR1MatchupFromSeeds(homeSeed: number, awaySeed: number, region: number): number {
  // Seed pairs for Round 1 in order: 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15
  const seedPairs: [number, number][] = [
    [1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]
  ];

  for (let i = 0; i < seedPairs.length; i++) {
    const [s1, s2] = seedPairs[i];
    if ((homeSeed === s1 && awaySeed === s2) || (homeSeed === s2 && awaySeed === s1)) {
      return (region - 1) * 8 + i + 1;
    }
  }
  return 0;
}

// Get matchup number for later rounds using bracketId patterns
function getMatchupNumber(bracketId: number, bracketRegion: string, homeSeed: number, awaySeed: number): number {
  const region = getRegion(bracketRegion);
  if (region === 0) return 0;

  const round = getRoundFromBracketId(bracketId);

  if (round === 1) {
    // Use seeds to determine R1 matchup
    return getR1MatchupFromSeeds(homeSeed, awaySeed, region);
  } else if (round === 2) {
    // Round 2: 33-48 (4 per region)
    // Need to determine position within region
    const idOffset = bracketId % 100;
    const posInRegion = ((idOffset - 1) % 8) + 1;  // 1-4 for R2
    if (posInRegion >= 1 && posInRegion <= 4) {
      return 32 + (region - 1) * 4 + posInRegion;
    }
  } else if (round === 3) {
    // Sweet 16: 49-56 (2 per region)
    const idOffset = bracketId % 100;
    const posInRegion = ((idOffset - 1) % 8) + 1;  // 1-2 for Sweet 16
    if (posInRegion >= 1 && posInRegion <= 2) {
      return 48 + (region - 1) * 2 + posInRegion;
    }
  } else if (round === 4) {
    // Elite 8: 57-60 (1 per region)
    return 56 + region;
  } else if (round === 5) {
    // Final Four: 61-62
    const idOffset = bracketId % 100;
    if (idOffset === 1) return 61;
    if (idOffset === 2) return 62;
  } else if (round === 6) {
    // Championship: 63
    return 63;
  }

  return 0;
}

function normalizeTeam(teamData: any): NormalizedTeam | null {
  if (!teamData) return null;
  return {
    seed: parseInt(teamData.seed, 10) || 0,
    name: teamData.names?.short || '',
    seo: teamData.names?.seo || '',
    fullName: teamData.names?.full,
  };
}

// ===========================================
// MAIN TRANSFORMATION
// ===========================================

function normalizeYear(rawData: any[], year: number): NormalizedTournament {
  // Initialize all 64 matchups
  const matchups: NormalizedMatchup[] = [];

  // Create all matchup slots
  for (let i = 1; i <= 64; i++) {
    let round = 0;
    let region = 0;

    if (i <= 32) {
      round = 1;
      region = Math.ceil(i / 8);
    } else if (i <= 48) {
      round = 2;
      region = Math.ceil((i - 32) / 4);
    } else if (i <= 56) {
      round = 3;
      region = Math.ceil((i - 48) / 2);
    } else if (i <= 60) {
      round = 4;
      region = i - 56;
    } else if (i <= 62) {
      round = 5;
      region = 5;
    } else if (i === 63) {
      round = 6;
      region = 5;
    } else {
      round = 6;
      region = 6; // Champion slot
    }

    matchups.push({
      matchup: i,
      round,
      region,
      teamTop: null,
      teamBottom: null,
      winner: null,
    });
  }

  // Process each game from raw data
  for (const item of rawData) {
    const game = item.game;
    if (!game) continue;

    const bracketId = parseInt(game.bracketId, 10);
    if (isNaN(bracketId)) continue;

    const homeTeam = normalizeTeam(game.home);
    const awayTeam = normalizeTeam(game.away);
    const homeSeed = homeTeam?.seed || 0;
    const awaySeed = awayTeam?.seed || 0;

    const matchupNum = getMatchupNumber(bracketId, game.bracketRegion || '', homeSeed, awaySeed);
    if (matchupNum <= 0 || matchupNum > 63) continue;

    const matchup = matchups.find(m => m.matchup === matchupNum);
    if (!matchup) continue;

    // Top is always the higher seed (lower number)
    if (homeSeed < awaySeed) {
      matchup.teamTop = homeTeam;
      matchup.teamBottom = awayTeam;
      matchup.winner = game.home?.winner ? 'top' : game.away?.winner ? 'bottom' : null;
    } else {
      matchup.teamTop = awayTeam;
      matchup.teamBottom = homeTeam;
      matchup.winner = game.away?.winner ? 'top' : game.home?.winner ? 'bottom' : null;
    }

    matchup.gameUrl = game.url;
  }

  return { year, matchups };
}

// ===========================================
// FILE PROCESSING
// ===========================================

async function processAllYears() {
  const historyDir = path.join(process.cwd(), 'app', 'data', 'history');
  const normalizedDir = path.join(process.cwd(), 'app', 'data', 'normalized');

  // Create normalized directory if it doesn't exist
  if (!fs.existsSync(normalizedDir)) {
    fs.mkdirSync(normalizedDir, { recursive: true });
  }

  // Get all year files
  const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const year = parseInt(file.replace('.json', ''), 10);
    if (isNaN(year)) continue;

    console.log(`Processing ${year}...`);

    const rawPath = path.join(historyDir, file);
    const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

    const normalized = normalizeYear(rawData, year);

    const normalizedPath = path.join(normalizedDir, file);
    fs.writeFileSync(normalizedPath, JSON.stringify(normalized, null, 2));

    console.log(`  ✓ Created ${normalizedPath}`);
    console.log(`  Games processed: ${normalized.matchups.filter(m => m.teamTop).length}`);
  }

  console.log('\nDone!');
}

processAllYears().catch(console.error);
