import { TEAM_METADATA } from "../data/team-metadata";

export interface Team {
  seed: number;
  name: string;
  seo?: string;
  colors?: string[];
  logo?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  // Additional properties expected by TeamInfoModal
  full_name?: string;
  masc?: string;
  record?: string;
  conference?: string;
  team_url?: string;
  ncaa_url?: string;
}

export interface Matchup {
  matchup: number;
  region: number;
  tt: Team | null;
  tb: Team | null;
  updates?: [number, "tt" | "tb"] | null;
}

// Region mapping: 1=South, 2=East, 3=Midwest, 4=West, 5=Final Four, 6=Champion
const REGION_NAMES = ["", "South", "East", "Midwest", "West", "Final Four", "Champion"];

// Standard NCAA bracket structure
// Each region has 16 matchups in rounds 1-4, then Final Four (region 5), then Championship (region 6)
// Matchups 1-8: Round 1 (8 games per region = 32 total)
// Matchups 9-12: Round 2 (4 games per region = 16 total - Sweet 16)
// etc.

function getTeamFromMetadata(seo: string, seed: number, teamData?: any): Team {
  const meta = TEAM_METADATA[seo];
  const name = teamData?.names?.short || seo;
  // Use the full official name from NCAA data (e.g., "University of Maryland, College Park")
  const fullName = teamData?.names?.full || (meta?.city ? `${meta.city} ${meta?.mascot || ''}`.trim() : name);

  // Extract conference from team data if available
  const conference = teamData?.conferences?.[0]?.conferenceName || undefined;

  // Extract record from description (e.g., "(25-7)" -> "25-7")
  const recordMatch = teamData?.description?.match(/\(([^)]+)\)/);
  const record = recordMatch ? recordMatch[1] : undefined;

  return {
    seed,
    name,
    seo,
    colors: meta?.colors,
    logo: meta?.logo || `https://a.espncdn.com/i/teamlogos/ncaa/500/${seo}.png`,
    city: meta?.city,
    state: meta?.state,
    lat: meta?.lat,
    lng: meta?.lng,
    full_name: fullName,
    masc: meta?.mascot,
    record,
    conference,
    team_url: seo ? `https://www.ncaa.com/schools/${seo}` : undefined,
    ncaa_url: teamData?.url ? `https://www.ncaa.com${teamData.url}` : undefined,
  };
}

// Map bracketId from NCAA data to our matchup structure
// NCAA uses bracketIds like 201, 202, etc. We need to map these to our 1-64 structure
function bracketIdToMatchup(bracketId: number, bracketRegion: string): { matchup: number; region: number } {
  // NCAA bracketIds:
  // 201-208: South R1, 209-212: South R2, 213-214: South Sweet16, 215: South Elite8
  // Similar pattern for East (starts at different offset), etc.

  const regionMap: Record<string, number> = {
    "south": 1,
    "southeast": 1,  // 2011 used Southeast instead of South
    "east": 2,
    "midwest": 3,
    "southwest": 3,  // 2011 used Southwest instead of Midwest
    "west": 4,
  };

  const region = regionMap[bracketRegion.toLowerCase()] || 1;

  // Simplified mapping - the bracketId structure varies by year
  // We'll compute based on the last two digits
  const idOffset = bracketId % 100;

  // Round 1: ids 1-8 per region (matchups 1-32)
  // Round 2: ids 9-12 per region (matchups 33-48)
  // Sweet 16: ids 13-14 per region (matchups 49-56)
  // Elite 8: ids 15 per region (matchups 57-60)
  // Final Four: ids 61-62
  // Championship: id 63
  // Winner: id 64

  if (idOffset <= 8) {
    // Round 1
    return { matchup: (region - 1) * 8 + idOffset, region };
  } else if (idOffset <= 12) {
    // Round 2
    return { matchup: 32 + (region - 1) * 4 + (idOffset - 8), region };
  } else if (idOffset <= 14) {
    // Sweet 16
    return { matchup: 48 + (region - 1) * 2 + (idOffset - 12), region };
  } else if (idOffset === 15) {
    // Elite 8
    return { matchup: 56 + region, region };
  } else if (idOffset <= 17) {
    // Final Four
    return { matchup: 60 + (idOffset - 15), region: 5 };
  } else if (idOffset === 18) {
    // Championship
    return { matchup: 63, region: 5 };
  }

  return { matchup: idOffset, region };
}

/**
 * Generate an empty bracket structure with all 64 matchups
 * The structure follows the standard NCAA tournament bracket
 */
export function generateEmptyBracket(): Matchup[] {
  const matchups: Matchup[] = [];

  // Round 1: 32 games (matchups 1-32), 8 per region
  // Seed matchups: 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15
  const seedPairs = [
    [1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]
  ];

  for (let region = 1; region <= 4; region++) {
    for (let i = 0; i < 8; i++) {
      const matchupNum = (region - 1) * 8 + i + 1;
      const [topSeed, bottomSeed] = seedPairs[i];

      // Determine which Round 2 matchup this feeds into
      const r2MatchupIndex = Math.floor(i / 2);
      const r2Matchup = 32 + (region - 1) * 4 + r2MatchupIndex + 1;
      const slot: "tt" | "tb" = i % 2 === 0 ? "tt" : "tb";

      matchups.push({
        matchup: matchupNum,
        region,
        tt: { seed: topSeed, name: "" },
        tb: { seed: bottomSeed, name: "" },
        updates: [r2Matchup, slot],
      });
    }
  }

  // Round 2 (Sweet 16 qualifying): 16 games (matchups 33-48), 4 per region
  for (let region = 1; region <= 4; region++) {
    for (let i = 0; i < 4; i++) {
      const matchupNum = 32 + (region - 1) * 4 + i + 1;

      // Feeds into Sweet 16
      const s16MatchupIndex = Math.floor(i / 2);
      const s16Matchup = 48 + (region - 1) * 2 + s16MatchupIndex + 1;
      const slot: "tt" | "tb" = i % 2 === 0 ? "tt" : "tb";

      matchups.push({
        matchup: matchupNum,
        region,
        tt: null,
        tb: null,
        updates: [s16Matchup, slot],
      });
    }
  }

  // Sweet 16: 8 games (matchups 49-56), 2 per region
  for (let region = 1; region <= 4; region++) {
    for (let i = 0; i < 2; i++) {
      const matchupNum = 48 + (region - 1) * 2 + i + 1;

      // Feeds into Elite 8
      const e8Matchup = 56 + region;
      const slot: "tt" | "tb" = i === 0 ? "tt" : "tb";

      matchups.push({
        matchup: matchupNum,
        region,
        tt: null,
        tb: null,
        updates: [e8Matchup, slot],
      });
    }
  }

  // Elite 8: 4 games (matchups 57-60), 1 per region
  for (let region = 1; region <= 4; region++) {
    const matchupNum = 56 + region;

    // Feeds into Final Four
    // Regions 1 & 2 go to matchup 61, regions 3 & 4 go to matchup 62
    const f4Matchup = region <= 2 ? 61 : 62;
    const slot: "tt" | "tb" = (region === 1 || region === 3) ? "tt" : "tb";

    matchups.push({
      matchup: matchupNum,
      region,
      tt: null,
      tb: null,
      updates: [f4Matchup, slot],
    });
  }

  // Final Four: 2 games (matchups 61-62)
  matchups.push({
    matchup: 61,
    region: 5,
    tt: null,
    tb: null,
    updates: [63, "tt"],
  });

  matchups.push({
    matchup: 62,
    region: 5,
    tt: null,
    tb: null,
    updates: [63, "tb"],
  });

  // Championship: 1 game (matchup 63)
  matchups.push({
    matchup: 63,
    region: 5,
    tt: null,
    tb: null,
    updates: [64, "tt"],
  });

  // Winner display (matchup 64)
  matchups.push({
    matchup: 64,
    region: 6,
    tt: null,
    tb: null,
    updates: null,
  });

  return matchups;
}

/**
 * Parse NCAA tournament game data and populate the bracket
 */
export function parseBracketFromHistory(historyData: any[]): Matchup[] {
  const matchups = generateEmptyBracket();

  // Group games by bracketId
  const gamesByBracketId = new Map<number, any>();

  for (const item of historyData) {
    const game = item.game;
    if (!game) continue;

    const bracketId = parseInt(game.bracketId, 10);
    gamesByBracketId.set(bracketId, game);
  }

  // Process Round 1 games to populate initial bracket
  // Note: NCAA naming varied over the years:
  // - 2021+: "First Round" or "FIRST ROUND"
  // - 2011-2015: "Second Round" (because "First Round" meant the play-in "First Four" games)
  const firstRoundNames = ["first round", "second round"];

  for (const item of historyData) {
    const game = item.game;
    if (!game || !firstRoundNames.includes(game.bracketRound?.toLowerCase())) continue;

    const bracketId = parseInt(game.bracketId, 10);
    const bracketRegion = game.bracketRegion;

    // Map the bracketId to our matchup structure
    // NCAA bracketIds for 2025: South=201-215, East=216-230, Midwest=225-239, West=209-223
    // The pattern varies, so we need to find the matchup based on seeds

    const homeSeed = parseInt(game.home.seed, 10);
    const awaySeed = parseInt(game.away.seed, 10);
    const homeTeam = getTeamFromMetadata(game.home.names.seo, homeSeed, game.home);
    const awayTeam = getTeamFromMetadata(game.away.names.seo, awaySeed, game.away);

    // Find the correct matchup based on seeds and region
    const regionMap: Record<string, number> = {
      "south": 1,
      "southeast": 1,  // 2011 used Southeast instead of South
      "east": 2,
      "midwest": 3,
      "southwest": 3,  // 2011 used Southwest instead of Midwest
      "west": 4,
    };
    const region = regionMap[bracketRegion.toLowerCase()] || 1;

    // Seed pairs in order: 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15
    const seedPairs = [
      [1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]
    ];

    let matchIndex = -1;
    for (let i = 0; i < seedPairs.length; i++) {
      const [s1, s2] = seedPairs[i];
      if ((homeSeed === s1 && awaySeed === s2) || (homeSeed === s2 && awaySeed === s1)) {
        matchIndex = i;
        break;
      }
    }

    if (matchIndex === -1) continue;

    const matchupNum = (region - 1) * 8 + matchIndex + 1;
    const matchup = matchups.find(m => m.matchup === matchupNum);

    if (matchup) {
      // Top team is always the higher seed (lower number)
      if (homeSeed < awaySeed) {
        matchup.tt = homeTeam;
        matchup.tb = awayTeam;
      } else {
        matchup.tt = awayTeam;
        matchup.tb = homeTeam;
      }
    }
  }

  return matchups;
}

/**
 * Get the history record for checking bracket results
 * Returns a map of matchup number to winning team name
 */
export function getHistoryRecord(historyData: any[]): Record<number, string> {
  const history: Record<number, string> = {};

  for (const item of historyData) {
    const game = item.game;
    if (!game || game.gameState !== "final") continue;

    // Get winner
    const winner = game.home?.winner ? game.home : game.away?.winner ? game.away : null;
    if (!winner) continue;
    const winnerName = winner.names?.short || "";

    // Use bracketId and region to determine matchup number
    const bracketId = parseInt(game.bracketId, 10);
    const bracketRegion = game.bracketRegion || "";

    if (isNaN(bracketId)) continue;

    const { matchup } = bracketIdToMatchup(bracketId, bracketRegion);

    if (matchup > 0 && matchup <= 63) {
      history[matchup] = winnerName;
    }
  }

  return history;
}

export { REGION_NAMES };
