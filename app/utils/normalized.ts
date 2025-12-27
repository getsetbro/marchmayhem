/**
 * Utility functions for working with normalized tournament data
 */

export interface NormalizedTeam {
  seed: number;
  name: string;
  seo: string;
  fullName?: string;
}

export interface NormalizedMatchup {
  matchup: number;
  round: number;
  region: number;
  teamTop: NormalizedTeam | null;
  teamBottom: NormalizedTeam | null;
  winner: 'top' | 'bottom' | null;
  gameUrl?: string;
}

export interface NormalizedTournament {
  year: number;
  matchups: NormalizedMatchup[];
}

/**
 * Convert normalized matchups to the format expected by the Bracket component
 */
export function normalizedToMatchings(tournament: NormalizedTournament): any[] {
  // Standard bracket flow: which matchup does each winner go to?
  const updateMap: Record<number, [number, 'tt' | 'tb']> = {};

  // Round 1 -> Round 2
  for (let i = 1; i <= 32; i++) {
    const r2Matchup = 32 + Math.ceil(i / 2);
    updateMap[i] = [r2Matchup, i % 2 === 1 ? 'tt' : 'tb'];
  }
  // Round 2 -> Sweet 16
  for (let i = 33; i <= 48; i++) {
    const s16Matchup = 48 + Math.ceil((i - 32) / 2);
    updateMap[i] = [s16Matchup, (i - 32) % 2 === 1 ? 'tt' : 'tb'];
  }
  // Sweet 16 -> Elite 8
  for (let i = 49; i <= 56; i++) {
    const e8Matchup = 56 + Math.ceil((i - 48) / 2);
    updateMap[i] = [e8Matchup, (i - 48) % 2 === 1 ? 'tt' : 'tb'];
  }
  // Elite 8 -> Final Four
  updateMap[57] = [61, 'tt'];
  updateMap[58] = [61, 'tb'];
  updateMap[59] = [62, 'tt'];
  updateMap[60] = [62, 'tb'];
  // Final Four -> Championship
  updateMap[61] = [63, 'tt'];
  updateMap[62] = [63, 'tb'];
  // Championship -> Champion
  updateMap[63] = [64, 'tt'];

  return tournament.matchups.map(m => {
    // Only populate teams for Round 1 (matchups 1-32)
    // Later rounds start empty for user picks
    const isRound1 = m.matchup <= 32;

    return {
      matchup: m.matchup,
      region: m.region,
      tt: isRound1 ? m.teamTop : null,
      tb: isRound1 ? m.teamBottom : null,
      winner: m.winner,  // Keep winner for checking
      updates: updateMap[m.matchup] || null,
      gameUrl: m.gameUrl,
    };
  });
}

/**
 * Build history record from normalized tournament data
 * Returns matchup number -> winning team name
 */
export function buildHistoryFromNormalized(tournament: NormalizedTournament): Record<number, string> {
  const history: Record<number, string> = {};

  for (const matchup of tournament.matchups) {
    if (!matchup.winner) continue;

    const winningTeam = matchup.winner === 'top' ? matchup.teamTop : matchup.teamBottom;
    if (winningTeam?.name) {
      history[matchup.matchup] = winningTeam.name;
    }
  }

  return history;
}
