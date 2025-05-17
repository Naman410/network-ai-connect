
import React, { useEffect, useState } from "react";
import { useMatchContext } from "@/contexts/MatchContext";
import MatchCard from "@/components/MatchCard";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import ConfettiBurst from "@/components/ConfettiBurst";
import PageWrapper from "@/components/PageWrapper";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const { matches } = useMatchContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // Animate confetti on entry
  useEffect(() => {
    if (matches && matches.length) setShowConfetti(true);
  }, [matches]);

  // If no matches (page reload), bounce user.
  useEffect(() => {
    if (matches === null) navigate("/");
  }, [matches, navigate]);

  return (
    <PageWrapper>
      <ConfettiBurst run={showConfetti} />
      <h2 className="text-3xl font-bold mb-3 gradient-accent-text text-center">Your Matches</h2>
      <p className="text-lg text-gray-600 dark:text-gray-200 mb-6 text-center">Connect with Discord friends who share your vibes.</p>
      {!matches && <ResultsSkeleton />}
      {matches && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 fade-slide">
          {matches.map((m) => (
            <MatchCard key={m.discord} {...m} />
          ))}
        </div>
      )}
      <div className="text-sm text-center text-gray-400 mt-10">
        Not what you’re looking for? Refresh for new matches or try again!
      </div>
    </PageWrapper>
  );
};

export default Results;
