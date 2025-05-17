
import React, { useRef, useState } from "react";
import { useMatchContext } from "@/contexts/MatchContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase, callEdgeFunction } from "@/lib/supabase";

const QUESTIONS = [
  "What motivates you right now?",
  "What skills do you love using?",
  "Who are you hoping to meet?",
];

const chatBubbles = {
  ai: "bg-gradient-to-r from-[#E5DEFF] to-[#D3E4FD] dark:from-[#241350]/90 dark:to-[#194844]/90 text-accent1 dark:text-accent2",
  user: "bg-gradient-to-r from-white/90 to-[#F2FCE2]/80 dark:from-[#042C26]/90 dark:to-[#1A1F2C]/80 text-slate-800 dark:text-white font-semibold",
};

// Helper function to generate a mock match reason based on user answers and profile
function generateMockMatchReason(answers: string[], profile: any): string {
  // q1 = "What motivates you right now?"
  // q2 = "What skills do you love using?"
  // q3 = "Who are you hoping to meet?" - This should have the highest weight
  const [q1, q2, q3] = answers.map(a => a.toLowerCase());

  const reasons = [
    "You both share interests in technology and innovation.",
    "Your skills complement each other well for collaboration.",
    "You have similar motivations and career goals.",
    "Your backgrounds suggest a strong potential partnership.",
    "You both value similar approaches to problem-solving.",
  ];

  // First priority: Check if any of their interests match who the user wants to meet (q3)
  if (profile.interests && profile.interests.length > 0) {
    for (const interest of profile.interests) {
      const interestLower = interest.toLowerCase();
      // Check against "Who are you hoping to meet?" first (highest priority)
      if (q3.includes(interestLower)) {
        return `They match who you're looking to meet: someone with expertise in ${interest}.`;
      }
    }
  }

  // Second priority: Check if their title matches who the user wants to meet
  if (profile.title && q3.includes(profile.title.toLowerCase())) {
    return `Their role as a ${profile.title} matches exactly who you're hoping to meet.`;
  }

  // Third priority: Check other interests against other questions
  if (profile.interests && profile.interests.length > 0) {
    const interest = profile.interests[Math.floor(Math.random() * profile.interests.length)];
    // Check against skills (q2)
    if (q2.includes(interest.toLowerCase())) {
      return `You both share an interest in ${interest} as part of your skillset.`;
    }
    // Check against motivation (q1)
    if (q1.includes(interest.toLowerCase())) {
      return `Their expertise in ${interest} aligns with what motivates you.`;
    }
  }

  // Default to random reason
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// Helper function to generate random locations for mock profiles
function getRandomLocation(): string {
  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Chicago, IL",
    "Los Angeles, CA",
    "Denver, CO",
    "Portland, OR",
    "Atlanta, GA"
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

// Check if we're in Lovable environment
const isLovableEnvironment = () => {
  return typeof window !== 'undefined' &&
    (window.location.hostname.includes('lovable.dev') ||
     document.referrer.includes('lovable.dev'));
};

async function fetchProfilesFromDB() {
  try {
    // If we're in Lovable environment, use mock data from public folder
    if (isLovableEnvironment()) {
      console.log('Lovable environment detected, using mock data');
      try {
        // Try to fetch the mock data from the public folder
        const response = await fetch('/api/match/index.json');
        if (response.ok) {
          const data = await response.json();
          console.log('Mock data loaded from public folder:', data);
          if (data.matches && Array.isArray(data.matches)) {
            return data.matches;
          }
        }
      } catch (mockError) {
        console.error('Error loading mock data:', mockError);
      }
    }

    console.log('Fetching profiles from Supabase...');

    // Try to fetch from Supabase using the client
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        actual_name,
        discord_username,
        profile_experience_job_titles(experience_job_title),
        profile_interests(interest)
      `);

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log('Profiles data from Supabase:', data);

    if (!data || data.length === 0) {
      console.warn('No profiles found in Supabase');
      throw new Error("No profiles found");
    }

    // Format the data
    const formattedProfiles = data.map((p: any) => ({
      name: p.actual_name,
      discord: p.discord_username,
      title: (p.profile_experience_job_titles?.[0]?.experience_job_title) || "",
      interests: (p.profile_interests || []).map((i: any) => i.interest).filter(Boolean),
      why: "", // Will be filled by Gemini API
    }));

    console.log('Formatted profiles:', formattedProfiles);
    return formattedProfiles;
  } catch (error) {
    console.log("Error fetching profiles, using mock data:", error);
    // Return mock profiles for local development
    return [
      {
        name: "Alex Chen",
        discord: "alexchen#1234",
        title: "Full-stack Developer",
        interests: ["Machine Learning", "React", "Hiking"],
        why: "",
      },
      {
        name: "Jordan Taylor",
        discord: "jtaylor#5678",
        title: "UX Designer",
        interests: ["UI/UX", "Design Systems", "Photography"],
        why: "",
      },
      {
        name: "Sam Rodriguez",
        discord: "samrod#9012",
        title: "Data Scientist",
        interests: ["NLP", "Computer Vision", "Cycling"],
        why: "",
      },
      {
        name: "Jamie Wilson",
        discord: "jwilson#3456",
        title: "DevOps Engineer",
        interests: ["Kubernetes", "Docker", "Cloud Architecture"],
        why: "",
      },
      {
        name: "Morgan Lee",
        discord: "mlee#7890",
        title: "Mobile Developer",
        interests: ["React Native", "Flutter", "UI Animation"],
        why: "",
      }
    ];
  }
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

        // If we're in Lovable environment, try to use the mock data directly
        if (isLovableEnvironment()) {
          console.log('Lovable environment detected, using mock data for matches');
          try {
            // Try to fetch the mock data from the public folder
            const response = await fetch('/api/match');
            if (response.ok) {
              const data = await response.json();
              console.log('Mock matches loaded from public folder:', data);
              if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
                setMatches(data.matches);
                navigate("/results");
                return;
              }
            }
          } catch (mockError) {
            console.error('Error loading mock matches:', mockError);
          }
        }

        try {
          console.log("Attempting to call edge function with profiles:", allProfiles.length);

          // 2. Try to send to edge function for best matches using Supabase client
          const result = await callEdgeFunction('match-gemini', {
            answers,
            profiles: allProfiles
          });

          console.log("Edge function result:", result);

          if (!result || !result.matches) {
            console.warn("No matches found in result, using fallback");
            throw new Error("No matches found");
          }

          setMatches(result.matches);

          // Only show the LLM unavailable toast if fallbackUsed is explicitly true
          // and we're not in the Lovable environment (where we expect to use mock data)
          if (result.fallbackUsed === true && !isLovableEnvironment()) {
            console.log("Showing LLM unavailable toast because fallbackUsed is true");
            toast({
              title: "LLM Unavailable",
              description: "Couldn't reach Gemini, but here are some manual matches.",
              variant: "destructive"
            });
          }
          navigate("/results");
        } catch (apiError) {
          console.log("Edge function error, using mock matches:", apiError);

          // Generate mock matches with "why" explanations based on user answers
          const mockMatches = allProfiles.slice(0, 10).map(profile => ({
            ...profile,
            why: generateMockMatchReason(answers, profile),
            location: getRandomLocation()
          }));

          console.log("Generated mock matches:", mockMatches.length);

          // Make sure we have valid matches before setting state
          if (mockMatches.length > 0) {
            setMatches(mockMatches);
            navigate("/results");
          } else {
            throw new Error("Failed to generate matches");
          }

          // Only show the demo mode toast if we're not in Lovable environment
          // In Lovable, we expect to use mock data, so no need for a notification
          if (!isLovableEnvironment()) {
            toast({
              title: "Using Demo Mode",
              description: "Showing mock matches since the AI matching service is unavailable.",
              variant: "default"
            });
          }
        }
      } catch (err) {
        console.error("Fatal error in matchmaking:", err);
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
