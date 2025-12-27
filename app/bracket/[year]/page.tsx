import Header from "../../comps/header";
import BracketWithFooter from "../../comps/BracketWithFooter";
import { normalizedToMatchings, buildHistoryFromNormalized, NormalizedTournament } from "../../utils/normalized";
import fs from "fs";
import path from "path";

interface BracketPageProps {
  params: Promise<{ year: string }>;
}

async function loadBracketData(year: string) {
  try {
    const filePath = path.join(process.cwd(), "app", "data", "normalized", `${year}.json`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const tournament = JSON.parse(fileContents) as NormalizedTournament;
    return {
      initialMatches: normalizedToMatchings(tournament),
      history: buildHistoryFromNormalized(tournament),
    };
  } catch (error) {
    console.error(`Failed to load bracket data for year ${year}:`, error);
    return { initialMatches: [], history: {} };
  }
}

export default async function BracketPage({ params }: BracketPageProps) {
  const { year } = await params;
  const { initialMatches, history } = await loadBracketData(year);

  return (
    <>
      <Header year={year} />
      <BracketWithFooter year={year} initialMatches={initialMatches} history={history} />
    </>
  );
}
