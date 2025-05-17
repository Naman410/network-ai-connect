
import React, { createContext, useState, useContext } from "react";

type Match = {
  name: string;
  discord: string;
  title?: string;
  location?: string;
  interests?: string[];
  why: string;
};

interface MatchContextType {
  matches: Match[] | null;
  setMatches: (m: Match[]) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<Match[] | null>(null);

  return (
    <MatchContext.Provider value={{ matches, setMatches }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatchContext() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatchContext must be used in MatchProvider.");
  return ctx;
}
