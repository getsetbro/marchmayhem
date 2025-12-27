"use client";

import { useState, useEffect } from "react";
import TeamInfoModal from "./TeamInfoModal";
import MatchupInfoButton from "./MatchupInfoButton";

interface BracketProps {
  initialMatches?: any[];
  history?: Record<number, string>;
  showResults?: boolean;
}

const DEFAULT_MATCHES: any[] = [];

export default function Bracket({ initialMatches = DEFAULT_MATCHES, history, showResults = false }: BracketProps) {
  const [matchings, setMatchings] = useState(initialMatches);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  useEffect(() => {
    setMatchings(initialMatches);
  }, [JSON.stringify(initialMatches)]);

  const handleChoice = (match: any, team: any) => {
    if (!match.updates) return;

    const [nextMatchId, slot] = match.updates;
    if (!nextMatchId) return;

    // Find what was previously picked for this matchup's slot
    const nextMatch = matchings.find((m) => m.matchup === nextMatchId);
    const oldPick = nextMatch?.[slot];

    // If we're picking the same team, do nothing
    if (oldPick?.name === team?.name) return;

    // Build list of teams to clear from downstream matchups
    // If we're changing a pick, we need to clear the old pick from all future rounds
    const teamsToClear: string[] = [];
    if (oldPick?.name) {
      teamsToClear.push(oldPick.name);
    }

    let update = matchings.map((matching) => {
      // Update the immediate next matchup
      if (matching.matchup === nextMatchId) {
        return { ...matching, [slot]: team };
      }
      return matching;
    });

    // If there's a team to clear, cascade through all downstream matchups
    if (teamsToClear.length > 0) {
      // Repeatedly scan for matchups containing teams to clear
      let changed = true;
      while (changed) {
        changed = false;
        update = update.map((matching) => {
          let newMatching = { ...matching };
          // Check if tt or tb contains a team we need to clear
          if (matching.tt && teamsToClear.includes(matching.tt.name)) {
            newMatching.tt = null;
            changed = true;
          }
          if (matching.tb && teamsToClear.includes(matching.tb.name)) {
            newMatching.tb = null;
            changed = true;
          }
          return newMatching;
        });
      }
    }

    setMatchings(update);
  };

  const getMatchStatus = (match: any) => {
    if (!showResults) return "";

    // The match.winner field tells us who actually won ('top' or 'bottom')
    if (!match.winner) return "";  // Game not played yet

    // Get the user's pick from the next matchup
    if (!match.updates) return "";
    const [nextMatchId, slot] = match.updates;
    if (!nextMatchId) return "";

    const nextMatch = matchings.find((m) => m.matchup === nextMatchId);
    if (!nextMatch) return "";

    const userPick = nextMatch[slot];
    if (!userPick) return "";  // User hasn't picked yet

    // Determine who actually won
    const actualWinner = match.winner === 'top' ? match.tt : match.tb;
    if (!actualWinner) return "";

    // Compare user pick with actual winner
    if (userPick.name === actualWinner.name) {
      return "border-2 border-green-500 rounded";
    }
    return "border-2 border-red-500 rounded";
  };

  return (
    <>

      <div className={`bracket ${showResults ? "showing-results" : ""}`}>
        <div className="region-1 region">
          {matchings
            .filter((r) => r.region === 1)
            .map((match) => {
              const status = getMatchStatus(match);
              return (
                <div
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup} relative flex items-center pr-1 ${status}`}
                >
                  <ul className="flex-1 min-w-0">
                    <li className="team team-top">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        {match.tt?.seed} {match.tt?.name}
                      </button>
                    </li>
                    <li className="team team-bottom">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        {match.tb?.seed} {match.tb?.name}
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} onInfoClick={setSelectedMatch} />
                </div>
              );
            })}
        </div>
        <div className="region-2 region">
          {matchings
            .filter((r) => r.region === 2)
            .map((match) => {
              const status = getMatchStatus(match);
              return (
                <div
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup} relative flex items-center pr-1 ${status}`}
                >
                  <ul className="flex-1 min-w-0">
                    <li className="team team-top">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        {match.tt?.seed} {match.tt?.name}
                      </button>
                    </li>
                    <li className="team team-bottom">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        {match.tb?.seed} {match.tb?.name}
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} onInfoClick={setSelectedMatch} />
                </div>
              );
            })}
        </div>
        <div className="region-3 region">
          {matchings
            .filter((r) => r.region === 3)
            .map((match) => {
              const status = getMatchStatus(match);
              return (
                <div
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup} relative flex items-center pr-1 ${status}`}
                >
                  <ul className="flex-1 min-w-0">
                    <li className="team team-top">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        {match.tt?.seed} {match.tt?.name}
                      </button>
                    </li>
                    <li className="team team-bottom">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        {match.tb?.seed} {match.tb?.name}
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} onInfoClick={setSelectedMatch} />
                </div>
              );
            })}
        </div>
        <div className="region-4 region">
          {matchings
            .filter((r) => r.region === 4)
            .map((match) => {
              const status = getMatchStatus(match);
              return (
                <div
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup} relative flex items-center pr-1 ${status}`}
                >
                  <ul className="flex-1 min-w-0">
                    <li className="team team-top">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        {match.tt?.seed} {match.tt?.name}
                      </button>
                    </li>
                    <li className="team team-bottom">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        {match.tb?.seed} {match.tb?.name}
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} onInfoClick={setSelectedMatch} />
                </div>
              );
            })}
        </div>
        <div className="final-four">
          {matchings
            .filter((r) => r.region === 5)
            .map((match) => {
              const status = getMatchStatus(match);
              return (
                <div
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup} relative flex items-center pr-1 ${status}`}
                >
                  <ul className="flex-1 min-w-0">
                    <li className="team team-top">
                      <button
                        type="button"
                        onClick={() => { handleChoice(match, match.tt); }}
                      >
                        {match.tt?.seed} {match.tt?.name}
                      </button>
                    </li>
                    <li className="team team-bottom">
                      <button
                        type="button"
                        onClick={() => { handleChoice(match, match.tb); }}
                      >
                        {match.tb?.seed} {match.tb?.name}
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} onInfoClick={setSelectedMatch} />
                </div>
              );
            })}

          {matchings
            .filter((r) => r.region === 6)
            .map((match) => {
              // Final Winner check
              // For M64 (the winner display slot), we check if the user has filled it (it doesn't have a 'next match')
              // But 'match' here is the Winner box.
              // Logic: The winner of M63 (Championship) propagates to M64 'tt'?
              // ncaa.ts says: { region: 6, matchup: 64, tt: null }
              // And M63 updates [64, 'tt'].
              // So 'match.tt' IS the user's champion pick.
              // We compare match.tt.name vs history[63] (winner of match 63). 
              // Wait, history[63] is the winner of the championship game.
              let status = "";
              if (showResults && history && history[63] && match.tt) {
                if (match.tt.name === history[63]) status = "border-2 border-green-500 rounded";
                else status = "border-2 border-red-500 rounded";
              }

              return (
                <ul className={`matchup matchup-64 ${status}`} key={match.matchup}>
                  <li className="team winner border-2 border-gray-800 justify-center">
                    {match.tt?.seed} {match.tt?.name}
                  </li>
                </ul>
              );
            })}
        </div>
      </div>

      {selectedMatch && selectedMatch.tt && selectedMatch.tb && (
        <TeamInfoModal
          team1={selectedMatch.tt}
          team2={selectedMatch.tb}
          onClose={() => setSelectedMatch(null)}
          onTeamSelect={(team) => {
            handleChoice(selectedMatch, team);
            setSelectedMatch(null);
          }}
        />
      )}
    </>
  );
}
