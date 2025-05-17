
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
    if (matches && matches.length) setShowConfetti(true);
  }, [matches]);
  useEffect(() => {
    if (matches === null) navigate("/");
  }, [matches, navigate]);

  // 10 visible cards; always fill-out grid to even rows
  const GRID_TOTAL = 10;
  const skeletonFill = Math.max(0, GRID_TOTAL - (matches?.length ?? 0));

  return (
    <PageWrapper>
      <InterestingBackground />
      <ConfettiBurst run={showConfetti} />
      <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-accent-text text-center drop-shadow-lg">Your Matches</h2>
      <p className="text-lg text-gray-600 dark:text-gray-200 mb-7 text-center">Connect with standout collaborators on Discord!</p>
      {!matches && <ResultsSkeleton />}
      {matches && (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12 px-2 sm:px-0 fade-slide min-h-[520px]">
          {matches.map((m) => (
            <MatchCard key={m.discord} {...m} />
          ))}
          {Array.from({ length: skeletonFill }).map((_, idx) => (
            <div key={`skeleton-${idx}`} className="h-[340px] md:h-[372px] glass card-radius shadow-card animate-pulse-skel bg-gray-100 dark:bg-slate-800 flex flex-col">
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
      <div className="text-xs sm:text-sm text-center text-gray-400 mt-10 mb-7">
        Not the fit you were hoping? Refresh or try again!
      </div>
    </PageWrapper>
  );
};
export default Results;
