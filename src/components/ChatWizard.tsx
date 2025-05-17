
import React, { useRef, useState } from "react";
import { useMatchContext } from "@/contexts/MatchContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const QUESTIONS = [
  "What motivates you right now?",
  "What skills do you love using?",
  "Who are you hoping to meet?",
];

export default function ChatWizard() {
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [shown, setShown] = useState<number[]>([]); // For step-bubble animation
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMatches } = useMatchContext();
  const navigate = useNavigate();

  // On mount & step, animate chat bubble appearance
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
      // POST answers, set loading
      setSubmitting(true);
      try {
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        if (!res.ok) throw new Error("Match API failed");
        const data = await res.json();
        setMatches(data.matches);
        navigate("/results");
      } catch (err) {
        toast({ title: "Something went wrong. Try again?", description: "", variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col mt-8">
      {QUESTIONS.map((q, idx) => (
        <div
          key={q}
          className={`flex flex-col items-${idx % 2 === 0 ? "end" : "start"} mb-4`}
        >
          {shown.includes(idx) && (
            <div
              className={`fade-slide inline-block px-5 py-3 mb-1 max-w-[90%] font-medium rounded-2xl shadow card-radius glass ${
                idx % 2 === 0
                  ? "rounded-br-none self-end bg-grayui dark:bg-slate-800 text-foreground"
                  : "rounded-bl-none self-start bg-[rgb(124,58,237)/0.15] dark:bg-[rgb(4,185,113)/.12] text-accent1"
              }`}
            >
              {q}
            </div>
          )}
          {step === idx && (
            <form
              onSubmit={handleSubmit}
              className={`w-full flex gap-2 mt-1`}
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
                className="flex-1 px-3 py-2 glass rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition shadow-sm text-base bg-white dark:bg-slate-900"
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
                className="gradient-accent text-white px-4 py-2 rounded-lg font-semibold shadow transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[#7C3AED] hover:brightness-105"
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
            <div
              className={`fade-slide mt-1 ml-auto mr-1 px-4 py-2 rounded-md bg-gradient-accent text-white w-fit font-semibold shadow`}
            >
              {answers[idx]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
