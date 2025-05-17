import React, { useEffect, useState } from "react";
import { useMatchContext } from "@/contexts/MatchContext";
import MatchCard from "@/components/MatchCard";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import ConfettiBurst from "@/components/ConfettiBurst";
import PageWrapper from "@/components/PageWrapper";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { useNavigate } from "react-router-dom";

const InterestingBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0">
    {/* Soft gradient, subtle texture */}
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#E5DEFF] via-[#F2FCE2]/65 to-[#D3E4FD]/65 dark:from-[#1A1F2C] dark:via-[#2e2953]/80 dark:to-[#042C26]/80 transition-colors duration-300" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(124,58,237,0.09)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(4,185,113,0.10)_0%,transparent_65%)]" />
  </div>
);

const Results = () => {
  const { matches } = useMatchContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show confetti only if we have matches
    if (matches && matches.length) {
      console.log("Showing confetti for matches:", matches.length);
      setShowConfetti(true);
    }
  }, [matches]);

  useEffect(() => {
    // Redirect to home if matches is null or empty
    console.log("Checking matches in Results page:", matches);
    if (matches === null || matches.length === 0) {
      console.log("No matches found, redirecting to home");
      navigate("/");
    }
  }, [matches, navigate]);

  // Card/grid layout: wider cards, adjust responsive columns & min widths
  const visibleMatches = matches || [];
  // Add skeleton placeholders if needed for a minimum of 6 cards
  const MIN_CARDS = 6;
  const skeletonFill = matches ? Math.max(0, MIN_CARDS - matches.length) : 0;

  return (
    <PageWrapper>
      <InterestingBackground />
      <ThemeToggleButton />
      <ConfettiBurst run={showConfetti} />
      <div className="absolute left-5 top-5 z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-md border border-slate-200 dark:border-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </button>
      </div>
      <h2 className="text-3xl md:text-5xl font-black mb-3 gradient-accent-text text-center drop-shadow-lg tracking-tight">Your Matches</h2>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-200 mb-9 text-center">Connect with standout collaborators on Discord!</p>
      {!matches && <ResultsSkeleton />}
      {matches && (
        <div className="mx-auto w-full max-w-[1440px] px-2 sm:px-6">
          <div className="relative grid gap-10
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-3
            2xl:grid-cols-4
            mb-12 fade-slide">
            {visibleMatches.map((m) => (
              <MatchCard key={m.discord} {...m} />
            ))}
            {Array.from({ length: skeletonFill }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="h-[370px] min-w-[310px] max-w-[400px] mx-auto glass card-radius shadow-card animate-pulse-skel bg-gray-100 dark:bg-slate-800 flex flex-col p-6"
              >
                <div className="h-6 w-1/2 mb-4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-2/3 mb-4 bg-slate-300 dark:bg-slate-800 rounded" />
                <div className="h-4 w-1/3 mb-4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="flex gap-1 mb-4">
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-6 w-20 bg-slate-300 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-auto" />
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="h-10 bg-slate-300 dark:bg-slate-800 rounded" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
          {matches.length > 6 && (
            <div className="text-center mb-8 mt-4">
              <button
                className="px-4 py-2 text-base font-bold text-white bg-accent1 rounded-xl shadow-md hover:bg-accent2 transition-all"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Scroll to top
              </button>
            </div>
          )}
        </div>
      )}
      <div className="text-xs sm:text-sm text-center text-gray-400 mt-10 mb-7">
        Not the fit you were hoping? Refresh or try again!
      </div>
    </PageWrapper>
  );
};
export default Results;
