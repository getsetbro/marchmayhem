"use client";

import { useState, useEffect } from "react";
import Bracket from "./bracket";
import Footer from "./footer";

interface BracketWithFooterProps {
  year: string | number;
  initialMatches: any[];
  history?: Record<number, string>;
}

export default function BracketWithFooter({ year, initialMatches, history }: BracketWithFooterProps) {
  const [showResults, setShowResults] = useState(false);

  // Reset showResults when year changes
  useEffect(() => {
    setShowResults(false);
  }, [year]);

  return (
    <>
      <Bracket
        initialMatches={initialMatches}
        history={history}
        showResults={showResults}
      />
      <Footer
        year={year}
        history={history}
        onToggleResults={setShowResults}
      />
    </>
  );
}
