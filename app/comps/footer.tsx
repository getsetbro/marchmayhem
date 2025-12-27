"use client";

import { useState } from "react";

interface FooterProps {
  year?: string | number;
  history?: Record<number, string>;
  onToggleResults?: (showResults: boolean) => void;
}

const YEARS = [2025, 2024, 2023, 2022, 2021, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2011];

export default function Footer({ year = 2025, history, onToggleResults }: FooterProps) {
  const [showResults, setShowResults] = useState(false);
  const hasHistory = history && Object.keys(history).length > 0;
  const currentYear = year.toString();

  const handleToggle = () => {
    const newValue = !showResults;
    setShowResults(newValue);
    onToggleResults?.(newValue);
  };

  return (
    <footer className="flex justify-between items-center p-2 bg-[#1a1a1a] border-t border-[#333] mt-1">
      <button
        onClick={handleToggle}
        disabled={!hasHistory}
        className={`px-6 py-2 text-sm font-bold rounded border-none cursor-pointer transition-colors ${!hasHistory
          ? 'bg-[#333] text-[#666] cursor-not-allowed'
          : showResults
            ? 'bg-[#444] text-white hover:bg-[#555]'
            : 'bg-[#0070f3] text-white hover:bg-[#005bb5]'
          }`}
      >
        {showResults ? "Hide Results" : "Check Bracket"}
      </button>

      <nav className="flex justify-center gap-2 flex-wrap">
        {YEARS.map((y) => (
          <a
            key={y}
            href={y === 2025 ? "/" : `/bracket/${y}`}
            className={`px-2 py-1 text-white rounded no-underline text-xs font-bold ${y.toString() === currentYear ? "bg-[#666]" : "bg-[#333]"}`}
          >
            {y}
          </a>
        ))}
      </nav>
    </footer>
  );
}
