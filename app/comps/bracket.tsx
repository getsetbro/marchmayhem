"use client";

import { useState } from "react";
import matches from "../data/matches";

export default function Bracket() {
  const [matchings, setMatchings] = useState(matches);

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
  return (
    <>
      <div className="bracket">
        <div className="region-1 region">
          {matchings
            .filter((r) => r.region === 1)
            .map((match) => {
              return (
                <ul
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup}`}
                >
                  <li className="team team-top winner">
                    <button
                      type="button"
                      onClick={() => {
                        handleChoice(match, match.tt);
                      }}
                    >
                      {match.tt.seed} {match.tt.name}
                    </button>
                  </li>
                  <li className="team team-bottom">
                    <button
                      type="button"
                      onClick={() => {
                        handleChoice(match, match.tb);
                      }}
                    >
                      {match.tb.seed} {match.tb.name}
                    </button>
                  </li>
                </ul>
              );
            })}
        </div>
        <div className="region-2 region">
          {matchings
            .filter((r) => r.region === 2)
            .map((match) => {
              return (
                <ul
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup}`}
                >
                  <li className="team team-top winner">
                    <button
                      type="button"
                      onClick={() => {
                        handleChoice(match, match.tt);
                      }}
                    >
                      {match.tt.seed} {match.tt.name}
                    </button>
                  </li>
                  <li className="team team-bottom">
                    <button
                      type="button"
                      onClick={() => {
                        handleChoice(match, match.tb);
                      }}
                    >
                      {match.tb.seed} {match.tb.name}
                    </button>
                  </li>
                </ul>
              );
            })}
        </div>
        <div className="region-3 region">
          {matchings
            .filter((r) => r.region === 3)
            .map((match) => {
              return (
                <ul
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup}`}
                >
                  <li className="team team-top winner">
                    <button
                      type="button"
                      onClick={() => {
                        handleChoice(match, match.tt);
                      }}
                    >
                      {match.tt.seed} {match.tt.name}
                    </button>
                  </li>
                  <li className="team team-bottom">
                    <button
                      type="button"
                      onClick={() => {
                        handleChoice(match, match.tb);
                      }}
                    >
                      {match.tb.seed} {match.tb.name}
                    </button>
                  </li>
                </ul>
              );
            })}
        </div>
        <div className="region-4 region">
          {matchings
            .filter((r) => r.region === 4)
            .map((match) => {
              return (
                <ul
                  key={match.matchup}
                  className={`matchup matchup-${match.matchup}`}
                >
                  <li className="team team-top winner">
                    <button
                      type="button"
                      onClick={() => {
                        handleChoice(match, match.tt);
                      }}
                    >
                      {match.tt.seed} {match.tt.name}
                    </button>
                  </li>
                  <li className="team team-bottom">
                    <button
                      type="button"
                      onClick={() => {
                        handleChoice(match, match.tb);
                      }}
                    >
                      {match.tb.seed} {match.tb.name}
                    </button>
                  </li>
                </ul>
              );
            })}
        </div>
        <div className="final-four">
          <ul className="matchup matchup-61">
            <li className="team team-top">_?_?_</li>
            <li className="team team-bottom">_?_?_</li>
          </ul>
          <ul className="matchup matchup-62">
            <li className="team team-top">_?_?_</li>
            <li className="team team-bottom ">_?_?_</li>
          </ul>
          <ul className="matchup championship">
            <li className="team team-top">_?_?_</li>
            <li className="team team-bottom">_?_?_</li>
          </ul>
        </div>
      </div>
    </>
  );
}
