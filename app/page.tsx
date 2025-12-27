import Header from "./comps/header";
import BracketWithFooter from "./comps/BracketWithFooter";
import { normalizedToMatchings, buildHistoryFromNormalized, NormalizedTournament } from "./utils/normalized";
import normalizedData from "./data/normalized/2025.json";

export default function Home() {
  const tournament = normalizedData as NormalizedTournament;
  const initialMatches = normalizedToMatchings(tournament);
  const history = buildHistoryFromNormalized(tournament);

  return (
    <>
      <Header year={2025} />
      <BracketWithFooter year={2025} initialMatches={initialMatches} history={history} />
    </>
  );
}
