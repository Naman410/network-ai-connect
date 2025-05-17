
import React, { useState } from "react";
import ChatWizard from "@/components/ChatWizard";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import DisclaimerModal from "@/components/DisclaimerModal";
import PageWrapper from "@/components/PageWrapper";

const Index = () => {
  const [modal, setModal] = useState(false);

  return (
    <PageWrapper>
      <ThemeToggleButton />
      <div className="pt-12 pb-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold gradient-accent-text mb-4 mt-4 text-center">SuperNetworkAI</h1>
        <div className="text-lg md:text-xl text-slate-700 dark:text-slate-200 mb-8 text-center max-w-xl">
          Let AI introduce you to the collaborators you’ve been looking for.
        </div>
        <ChatWizard />
      </div>
      <footer className="mt-12 mb-5 text-center text-sm text-gray-500 dark:text-slate-400">
        © 2024 SuperNetworkAI — Built with ✨ in 6 hours ·{" "}
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
