import React, { useEffect, useState } from "react";
import { useMatchContext } from "@/contexts/MatchContext";
import MatchCard from "@/components/MatchCard";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import ConfettiBurst from "@/components/ConfettiBurst";
import PageWrapper from "@/components/PageWrapper";
import { useNavigate } from "react-router-dom";

const InterestingBackground = () => (
  <div className="pointer-events-none absolute inset-0 z-0">
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#f9f7ff] via-[#e6ffe6]/40 to-[#d3e4fd]/30 dark:from-[#1b1939] dark:to-[#0d1d1c]/90 dark:via-[#2a3749] transition-colors duration-300" />
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(124,58,237,0.07)_0%,transparent_90%)] dark:bg-[radial-gradient(circle,rgba(4,185,113,0.10)_0%,transparent_65%)]"/>
  </div>
);

const Results = () => {
  const { matches } = useMatchContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (matches && matches.length) setShowConfetti(true);
  }, [matches]);

  useEffect(() => {
    if (matches === null) navigate("/");
  }, [matches, navigate]);

  // Force at least 10 cards (fill with skeletons)
  const GRID_TOTAL = 10;
  const skeletonFill = Math.max(0, GRID_TOTAL - (matches?.length ?? 0));

  return (
    <PageWrapper>
      <InterestingBackground />
      <ConfettiBurst run={showConfetti} />
      <h2 className="text-3xl font-bold mb-3 gradient-accent-text text-center drop-shadow-lg">Your Matches</h2>
      <p className="text-lg text-gray-600 dark:text-gray-200 mb-6 text-center">Connect with Discord friends who share your vibes.</p>
      {!matches && <ResultsSkeleton />}
      {matches && (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10 fade-slide min-h-[500px]">
          {matches.map((m) => (
            <MatchCard key={m.discord} {...m} />
          ))}
          {Array.from({ length: skeletonFill }).map((_, idx) => (
            <div key={`skeleton-${idx}`} className="h-[340px] glass card-radius shadow-card animate-pulse-skel bg-gray-100 dark:bg-slate-800 flex flex-col">
              <div className="h-8 w-1/2 mx-auto my-4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-2/3 mx-auto mb-2 bg-slate-300 dark:bg-slate-800 rounded" />
              <div className="h-6 w-1/3 mx-auto mb-1 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-1/4 mx-auto mb-2 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="flex gap-2 mt-auto mb-6 justify-center">
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-6 w-20 bg-slate-300 dark:bg-slate-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-sm text-center text-gray-400 mt-10 mb-6">
        Not what you’re looking for? Refresh for new matches or try again!
      </div>
    </PageWrapper>
  );
};

export default Results;
