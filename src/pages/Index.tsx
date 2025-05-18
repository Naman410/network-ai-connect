import React, { useState } from "react";
import ChatWizard from "@/components/ChatWizard";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import DisclaimerModal from "@/components/DisclaimerModal";
import PageWrapper from "@/components/PageWrapper";

const InterestingBackground = () => (
  <div className="pointer-events-none absolute inset-0 z-0">
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#f9f7ff] via-[#e6ffe6]/60 to-[#d3e4fd]/70 dark:from-[#251857] dark:via-[#052c26]/90 dark:to-[#162023]/80 transition-colors duration-300" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_70%,rgba(124,58,237,0.08)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_60%_30%,rgba(4,185,113,0.12)_0%,transparent_70%)]"/>
  </div>
);

const Index = () => {
  const [modal, setModal] = useState(false);

  return (
    <PageWrapper>
      <InterestingBackground />
      <ThemeToggleButton />
      <div className="relative z-10 pt-12 pb-8 flex flex-col items-center min-h-[70vh]">
        <h1 className="text-4xl font-extrabold gradient-accent-text mb-4 mt-4 text-center drop-shadow-lg">SuperNetworkAI</h1>
        <div className="text-lg md:text-xl text-slate-700 dark:text-slate-200 mb-8 text-center max-w-xl">
          Let AI introduce you to the collaborators you’ve been looking for.
        </div>
        <ChatWizard />
      </div>
      <footer className="mt-12 mb-5 text-center text-sm text-gray-500 dark:text-slate-400 relative z-10">
        © 2025 SuperNetworkAI — Vibed in 6 hours ·{" "}
        <button
          className="underline text-accent1 hover:text-accent2"
          onClick={() => setModal(true)}
        >
          About & Data Disclaimer
        </button>
      </footer>
      <DisclaimerModal open={modal} setOpen={setModal} />
    </PageWrapper>
  );
};

export default Index;
