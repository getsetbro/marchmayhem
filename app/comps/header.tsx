import { TOURNAMENT_DATES } from "../data/tournament-dates";

interface HeaderProps {
  year?: string | number;
}

export default function Header({ year = 2025 }: HeaderProps) {
  const currentYear = year.toString();
  const startDateStr = TOURNAMENT_DATES[currentYear]?.[0] || TOURNAMENT_DATES["2025"][0];
  const startDate = new Date(startDateStr);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const r1Start = startDate;
  const r1End = addDays(startDate, 1);
  const r2Start = addDays(startDate, 2);
  const r2End = addDays(startDate, 3);
  const r3Start = addDays(startDate, 7);
  const r3End = addDays(startDate, 8);
  const r4Start = addDays(startDate, 9);
  const r4End = addDays(startDate, 10);
  const r5Start = addDays(startDate, 16); // Final 4 (Saturday)
  const r5End = addDays(startDate, 18); // Championship (Monday) - Header says "Mar 31/Apr 2" in original, suggesting Sat/Mon spread.

  const r1Str = `${formatDate(r1Start)}/${r1End.getDate()}`;
  const r2Str = `${formatDate(r2Start)}/${r2End.getDate()}`;
  const r3Str = `${formatDate(r3Start)}/${r3End.getDate()}`;
  const r4Str = `${formatDate(r4Start)}/${r4End.getDate()}`;
  const r5Str = `${formatDate(r5Start)}/${formatDate(r5End)}`;

  return (
    <header>
      <ol>
        {[
          { name: "Round 1", date: r1Str },
          { name: "Round 2", date: r2Str },
          { name: "Sweet 16", date: r3Str },
          { name: "Elite 8", date: r4Str },
          { name: "Final 4", date: r5Str },
          { name: "Elite 8", date: r4Str },
          { name: "Sweet 16", date: r3Str },
          { name: "Round 2", date: r2Str },
          { name: "Round 1", date: r1Str },
        ].map((round, index) => (
          <li key={index} className="bg-[#04314c]">
            {round.name}
            <br />
            <span>{round.date}</span>
          </li>
        ))}
      </ol>
    </header>
  );
}
