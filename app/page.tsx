import Header from "./comps/header";
import Bracket from "./comps/bracket";
import { parseBracketFromHistory } from "./utils/ncaa";
import historyData from "./data/history/2025.json";

export default function Home() {
  const initialMatches = parseBracketFromHistory(historyData);

  return (
    <>
      <Header year={2025} />
      <Bracket initialMatches={initialMatches} />
    </>
  );
}
