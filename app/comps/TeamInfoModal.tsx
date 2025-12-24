import React, { useEffect, useState } from 'react';
import { CONFERENCE_INSIGHTS, DEFAULT_INSIGHT } from '../data/conference-insights';

interface Team {
  logo: string;
  masc: string;
  full_name?: string;
  name: string;
  seed: number;
  record?: string;
  conference?: string;
  ncaa_url?: string;
  team_url?: string;
  city?: string;
  state?: string;
  colors?: string[];
  lat?: number;
  lng?: number;
}

interface TeamInfoModalProps {
  team1: Team;
  team2: Team;
  onClose: () => void;
  onTeamSelect?: (team: Team) => void;
}

function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 3958.8; // Radius of Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const TeamCard = ({ team, userLoc, onSelect }: { team: Team, userLoc: { lat: number, lng: number } | null, onSelect?: (team: Team) => void }) => {
  let dist = null;
  if (userLoc && team.lat && team.lng) {
    dist = calcDistance(userLoc.lat, userLoc.lng, team.lat, team.lng);
  }

  return (
    <div
      className="flex-1 min-w-[250px] bg-[#2a2a2a] p-4 rounded-lg flex flex-col items-center w-full max-sm:mb-4 cursor-pointer hover:bg-[#3a3a3a] transition-colors"
      onClick={() => onSelect?.(team)}
    >
      <div className="text-center flex flex-col items-center">
        <img src={team.logo} alt={team.name} className="w-[300px] h-[300px] object-contain mb-2 bg-white rounded-lg p-2" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <h3 className="text-xl font-bold mt-2 mb-1">{team.full_name || team.name}</h3>
        {team.masc && <div className="text-[#aaa] text-[0.95rem] mb-1 italic">{team.masc}</div>}
        {(team.city || team.state) && (
          <div className="text-[#888] text-[0.85rem] mb-2 flex flex-col gap-0.5">
            <span>{[team.city, team.state].filter(Boolean).join(", ")}</span>
            {dist !== null && (
              <span className="text-blue-400 font-bold text-xs">{dist} miles away</span>
            )}
          </div>
        )}
        <div className="flex gap-2 mt-1.5">
          <span className="inline-block px-1.5 py-0.5 rounded text-[0.8rem] font-bold bg-[#444] text-[#ddd]">Seed #{team.seed}</span>
        </div>
      </div>
      <div className="w-full mt-4 flex flex-col gap-2">
        {team.colors && team.colors.length > 0 && (
          <div className="flex justify-between border-b border-[#333] pb-1 text-[0.9rem]">
            <span className="text-[#888]">Colors</span>
            <div className="flex gap-1.5">
              {team.colors.map((c, i) => (
                <span key={i} className="w-8 h-8 rounded-full border-2 border-[#555] inline-block shadow-[0_2px_4px_rgba(0,0,0,0.3)]" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between border-b border-[#333] pb-1 text-[0.9rem]">
          <span className="text-[#888]">Record</span>
          <span className="font-bold">{team.record || "N/A"}</span>
        </div>
        <div className="flex flex-col border-b-0 pb-1 text-[0.9rem]">
          <div className="flex justify-between w-full">
            <span className="text-[#888]">Conference</span>
            <span className="font-bold">{team.conference || "N/A"}</span>
          </div>
          {team.conference && (
            <p className="text-[#666] text-xs mt-1.5 leading-relaxed text-left italic">
              {(() => {
                const conf = team.conference;
                const key = Object.keys(CONFERENCE_INSIGHTS).find(k =>
                  conf.toLowerCase().includes(k.toLowerCase()) ||
                  (k === "Big Ten" && conf.includes("B1G")) ||
                  (k === "SEC" && conf.includes("Southeastern"))
                );
                return key ? `${key}: ${CONFERENCE_INSIGHTS[key]}` : DEFAULT_INSIGHT;
              })()}
            </p>
          )}
        </div>
        <div className="mt-4 text-center">
          {team.team_url && (
            <a
              href={team.team_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#0070f3] text-white px-3 py-1.5 no-underline rounded-md text-[0.85rem] transition-colors hover:bg-[#005bb5]"
              onClick={(e) => e.stopPropagation()}
            >
              View Team
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TeamInfoModal({ team1, team2, onClose, onTeamSelect }: TeamInfoModalProps) {
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    const loc = localStorage.getItem('user_location');
    if (loc) {
      try {
        setUserLoc(JSON.parse(loc));
      } catch (e) { }
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] backdrop-blur-[5px]" onClick={onClose}>
      <div className="bg-[#222] text-white p-8 rounded-xl w-[95%] max-w-[800px] relative shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-center border border-[#444]" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2.5 right-4 bg-transparent border-none text-[#aaa] text-2xl cursor-pointer hover:text-white" onClick={onClose}>&times;</button>

        <h2 className="mt-0 mb-6 text-2xl font-bold">Matchup Details</h2>
        <p className="text-sm text-[#888] -mt-4 mb-4">Click a team to select them as the winner</p>

        <div className="flex items-start justify-between gap-4 flex-wrap max-sm:flex-col">
          <TeamCard team={team1} userLoc={userLoc} onSelect={onTeamSelect} />
          <div className="self-center text-2xl font-bold text-[#666] my-4 max-sm:hidden">VS</div>
          <TeamCard team={team2} userLoc={userLoc} onSelect={onTeamSelect} />
        </div>

        {team1.ncaa_url && (
          <div className="mt-6 text-center">
            <a href={team1.ncaa_url} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#333] text-white px-4 py-2 no-underline rounded-md text-[0.9rem] transition-colors hover:bg-[#555] border border-[#555]">
              View Matchup on NCAA.com
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
