interface MatchupInfoButtonProps {
  match: any;
  onInfoClick: (match: any) => void;
}

export default function MatchupInfoButton({ match, onInfoClick }: MatchupInfoButtonProps) {
  if (!match.tt || !match.tb) return null; // Only show if both teams exist

  return (
    <button
      className="bg-[#444] text-white border border-[#777] rounded-full w-[18px] h-[18px] text-[11px] leading-[16px] text-center cursor-pointer z-10 flex items-center justify-center p-0 ml-1 shrink-0 hover:bg-[#0070f3] hover:border-[#0070f3]"
      onClick={(e) => {
        e.stopPropagation();
        onInfoClick(match);
      }}
      aria-label="Matchup Info"
    >
      i
    </button>
  );
}
