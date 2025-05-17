
import React, { useEffect, useState } from "react";
import { useMatchContext } from "@/contexts/MatchContext";
import MatchCard from "@/components/MatchCard";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import ConfettiBurst from "@/components/ConfettiBurst";
import PageWrapper from "@/components/PageWrapper";
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

  // Limit to 6 visible cards for better layout
  const GRID_TOTAL = 6;
  const visibleMatches = matches?.slice(0, GRID_TOTAL) || [];
  const skeletonFill = Math.max(0, GRID_TOTAL - (visibleMatches?.length ?? 0));

  return (
    <PageWrapper>
      <InterestingBackground />
      <ConfettiBurst run={showConfetti} />
      <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-accent-text text-center drop-shadow-lg">Your Matches</h2>
      <p className="text-lg text-gray-600 dark:text-gray-200 mb-7 text-center">Connect with standout collaborators on Discord!</p>
      {!matches && <ResultsSkeleton />}
      {matches && (
        <div className="container mx-auto max-w-6xl">
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12 px-4 sm:px-6 fade-slide">
            {visibleMatches.map((m) => (
              <MatchCard key={m.discord} {...m} />
            ))}
            {Array.from({ length: skeletonFill }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="h-[320px] glass card-radius shadow-card animate-pulse-skel bg-gray-100 dark:bg-slate-800 flex flex-col p-4">
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

          {matches.length > GRID_TOTAL && (
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {matches.length - GRID_TOTAL} more matches available
              </p>
              <button
                className="px-4 py-2 text-sm font-medium text-accent1 border border-accent1 rounded-md hover:bg-accent1/10 transition-colors"
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
