
import React, { useRef, useState } from "react";
import { useMatchContext } from "@/contexts/MatchContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const QUESTIONS = [
  "What motivates you right now?",
  "What skills do you love using?",
  "Who are you hoping to meet?",
];

const chatBubbles = {
  ai: "bg-gradient-to-r from-[#E5DEFF] to-[#D3E4FD] dark:from-[#241350]/90 dark:to-[#194844]/90 text-accent1 dark:text-accent2",
  user: "bg-gradient-to-r from-white/90 to-[#F2FCE2]/80 dark:from-[#042C26]/90 dark:to-[#1A1F2C]/80 text-slate-800 dark:text-white font-semibold",
};

async function fetchProfilesFromDB() {
  // Fetch all profiles with joined interests/job titles for Gemini (publicly readable)
  const raw = await fetch("/rest/v1/profiles?select=id,actual_name:actual_name,discord_username:discord_username,profile_experience_job_titles(experience_job_title),profile_interests(interest)", {
    headers: { "apikey": "" }, // Supabase does not require for open public
  });
  if (!raw.ok) throw new Error("Could not load candidate profiles");
  const data = await raw.json();
  // Format
  return data.map((p: any) => ({
    name: p.actual_name,
    discord: p.discord_username,
    title: (p.profile_experience_job_titles?.[0]?.experience_job_title) || "",
    interests: (p.profile_interests || []).map((i: any) => i.interest).filter(Boolean),
    why: "", // Will be filled by Gemini API
  }));
}

export default function ChatWizard() {
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [shown, setShown] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMatches } = useMatchContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => setShown((prev) => prev.includes(step) ? prev : [...prev, step]), 150);
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answers[step].trim()) return;
    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      setSubmitting(true);
      try {
        // 1. Fetch all profiles (~120, public readable) for Gemini
        const allProfiles = await fetchProfilesFromDB();
        // 2. Send to edge function for best matches
        const res = await fetch("/functions/v1/match-gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, profiles: allProfiles }),
        });
        const result = await res.json();
        if (!res.ok || !result.matches) throw new Error(result.error || "No matches found");
        setMatches(result.matches);
        if (result.fallbackUsed) {
          toast({
            title: "LLM Unavailable",
            description: "Couldn't reach Gemini, but here are some manual matches.",
            variant: "destructive"
          });
        }
        navigate("/results");
      } catch (err) {
        toast({
          title: "Matchmaking unavailable",
          description: "An error occurred finding matches. Please try again soon.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col mt-8 px-2 sm:px-0">
      {QUESTIONS.map((q, idx) => (
        <div key={q} className="flex flex-col gap-2 mb-6">
          {shown.includes(idx) && (
            <div className="flex animate-fade-in">
              <div className={`fade-slide inline-block px-5 py-3 mb-1 max-w-[80%] md:max-w-[65%] font-medium rounded-2xl shadow card-radius glass
              ${chatBubbles.ai} rounded-bl-none self-start border border-accent1/25`}>
                {q}
              </div>
            </div>
          )}
          {step === idx && (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-row gap-1 sm:gap-3 mt-1 justify-end"
              autoComplete="off"
            >
              <input
                ref={inputRef}
                type="text"
                autoFocus
                required
                disabled={submitting}
                maxLength={70}
                placeholder="Type your answer…"
                className="flex-1 px-3 py-2 card-radius glass border focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition shadow-sm text-base bg-white dark:bg-slate-900"
                value={answers[idx]}
                onChange={(e) => {
                  const arr = answers.slice();
                  arr[idx] = e.target.value;
                  setAnswers(arr);
                }}
              />
              <button
                aria-label="Next"
                type="submit"
                disabled={submitting || !answers[idx].trim()}
                className="gradient-accent text-white px-4 py-2 rounded-lg font-semibold shadow transition-transform duration-150 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-[#7C3AED] hover:brightness-105"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8" stroke="#04B971" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                ) : idx < 2 ? "Next" : "Match me"}
              </button>
            </form>
          )}
          {step > idx && answers[idx] && (
            <div className="flex justify-end animate-fade-in">
              <div className={`fade-slide mt-1 ml-auto mr-1 px-5 py-3 rounded-2xl ${chatBubbles.user} rounded-br-none self-end max-w-[80%] md:max-w-[65%] shadow card-radius border border-accent2/25`}>
                {answers[idx]}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
