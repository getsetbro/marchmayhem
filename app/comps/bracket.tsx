"use client";

import { useState, useEffect } from "react";
import TeamInfoModal from "./TeamInfoModal";

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
    const update = matchings.map((matching) => {
      if (matching.matchup === match.updates[0]) {
        return { ...matching, [match.updates[1]]: team };
      } else {
        return matching;
      }
    });
    setMatchings(update);
  };

  const getMatchStatus = (match: any) => {
    if (!showResults || !history || !history[match.matchup]) return "";

    // To know if the user picked correctly, we need to know who they picked.
    // The pick is stored in the *next* match's slot.
    // match.updates = [nextMatchId, slot] (e.g. [33, 'tt'])
    if (!match.updates) return "";
    const [nextMatchId, slot] = match.updates;
    if (!nextMatchId) return ""; // Final/Winner slot might handle differently

    const nextMatch = matchings.find((m) => m.matchup === nextMatchId);
    if (!nextMatch) return "";

    const userPick = nextMatch[slot]; // This is a Team object or null
    if (!userPick) return ""; // User hasn't picked yet

    const actualWinnerName = history[match.matchup];
    if (userPick.name === actualWinnerName) return "border-2 border-green-500 rounded";
    return "border-2 border-red-500 rounded";
  };

  /* Refactored Info Button for Matchup */
  const MatchupInfoButton = ({ match }: { match: any }) => {
    if (!match.tt || !match.tb) return null; // Only show if both teams exist

    return (
      <button
        className="bg-[#444] text-white border border-[#777] rounded-full w-[18px] h-[18px] text-[11px] leading-[16px] text-center cursor-pointer z-10 flex items-center justify-center p-0 ml-1 shrink-0 hover:bg-[#0070f3] hover:border-[#0070f3]"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedMatch(match);
        }}
        aria-label="Matchup Info"
      >
        i
      </button>
    );
  };

  return (
    <>

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
                    <li className="team team-top bg-[#04314c]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        <span>{match.tt?.seed} {match.tt?.name}</span>
                      </button>
                    </li>
                    <li className="team team-bottom bg-[#333]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        <span>{match.tb?.seed} {match.tb?.name}</span>
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} />
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
                    <li className="team team-top bg-[#04314c]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        <span>{match.tt?.seed} {match.tt?.name}</span>
                      </button>
                    </li>
                    <li className="team team-bottom bg-[#333]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        <span>{match.tb?.seed} {match.tb?.name}</span>
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} />
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
                    <li className="team team-top bg-[#04314c]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        <span>{match.tt?.seed} {match.tt?.name}</span>
                      </button>
                    </li>
                    <li className="team team-bottom bg-[#333]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        <span>{match.tb?.seed} {match.tb?.name}</span>
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} />
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
                    <li className="team team-top bg-[#04314c]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        <span>{match.tt?.seed} {match.tt?.name}</span>
                      </button>
                    </li>
                    <li className="team team-bottom bg-[#333]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        <span>{match.tb?.seed} {match.tb?.name}</span>
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} />
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
                    <li className="team team-top bg-[#04314c]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tt);
                        }}
                      >
                        <span>{match.tt?.seed} {match.tt?.name}</span>
                      </button>
                    </li>
                    <li className="team team-bottom bg-[#333]">
                      <button
                        type="button"
                        onClick={() => {
                          handleChoice(match, match.tb);
                        }}
                      >
                        <span>{match.tb?.seed} {match.tb?.name}</span>
                      </button>
                    </li>
                  </ul>
                  <MatchupInfoButton match={match} />
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
                  <li className="team winner bg-[#0a6fac]">
                    {match.tt?.seed} {match.tt?.name}
                  </li>
                </ul>
              );
            })}
        </div>
      </div>
    </>
  );
}
