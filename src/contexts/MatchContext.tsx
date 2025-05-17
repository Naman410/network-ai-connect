
import React, { createContext, useState, useContext, useEffect } from "react";

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

// For debugging - check if we're in Lovable environment
const isLovableEnvironment = () => {
  return typeof window !== 'undefined' &&
    (window.location.hostname.includes('lovable.dev') ||
     document.referrer.includes('lovable.dev'));
};

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatchesState] = useState<Match[] | null>(null);

  // Log environment info on mount
  useEffect(() => {
    console.log('MatchContext initialized');
    console.log('Environment:', import.meta.env.MODE);
    console.log('Is Lovable environment:', isLovableEnvironment());
  }, []);

  // Wrapper for setMatches that adds validation and logging
  const setMatches = (newMatches: Match[]) => {
    console.log('Setting matches:', newMatches?.length || 0);

    // Ensure we have valid matches
    if (!newMatches || !Array.isArray(newMatches) || newMatches.length === 0) {
      console.warn('Attempted to set empty or invalid matches');
      return;
    }

    // Validate each match has required fields
    const validMatches = newMatches.filter(m =>
      m && typeof m === 'object' &&
      m.name && typeof m.name === 'string' &&
      m.discord && typeof m.discord === 'string'
    );

    if (validMatches.length === 0) {
      console.warn('No valid matches found in data');
      return;
    }

    if (validMatches.length !== newMatches.length) {
      console.warn(`Filtered out ${newMatches.length - validMatches.length} invalid matches`);
    }

    setMatchesState(validMatches);
  };

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
