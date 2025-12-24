import Header from "../../comps/header";
import Bracket from "../../comps/bracket";
import { parseBracketFromHistory } from "../../utils/ncaa";
import fs from "fs";
import path from "path";

interface BracketPageProps {
  params: Promise<{ year: string }>;
}

async function loadBracketData(year: string) {
  try {
    const filePath = path.join(process.cwd(), "app", "data", "history", `${year}.json`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const historyData = JSON.parse(fileContents);
    return parseBracketFromHistory(historyData);
  } catch (error) {
    console.error(`Failed to load bracket data for year ${year}:`, error);
    return [];
  }
}

export default async function BracketPage({ params }: BracketPageProps) {
  const { year } = await params;
  const initialMatches = await loadBracketData(year);

  return (
    <>
      <Header year={year} />
      <Bracket initialMatches={initialMatches} />
    </>
  );
}
