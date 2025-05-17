
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateSystemPrompt() {
  return `
You are "SuperNetworkAI", an elite collaboration matchmaker for a global Discord tech community. Your job is to pick the 10 best matches for a given user based on their introduction, motivation, desired collaborators, interests, and tech stack. We want diverse, meaningful connections—look for people who inspire, share key passions, or creatively complement each other.

The user has answered three questions:
1. "What motivates you right now?" - This shows their current goals and interests
2. "What skills do you love using?" - This shows their technical abilities and preferences
3. "Who are you hoping to meet?" - This is the MOST IMPORTANT question that should heavily influence your matching

Rules:
- Give the HIGHEST priority to matching based on the third question ("Who are you hoping to meet?")
- For each suggested match, return:
  1. their name
  2. their main role/title, location (if possible), interests
  3. a 1–2 line "why you matched" summary (be specific!)
  4. their Discord username (to connect)
- Always rank by *fit*, not popularity or seniority.
- Maximize diversity and mutual value—don't just pick clones.
- Your answer must be valid JSON:
[
  {
    "name": "string",
    "discord": "string",
    "title": "string",
    "location": "string (optional)",
    "interests": [array of strings],
    "why": "string"
  },
  ...
]
(10 items max)
- Respond only with the JSON array—no explanations.
`;
}

async function fetchGeminiMatches(payload: any) {
  const { answers, profiles } = payload || {};
  if (!GEMINI_API_KEY) throw new Error("Gemini API key missing.");

  // Compose strong prompt for the LLM
  const prompt = `
User's Answers/Intro: ${JSON.stringify(answers)}

Full List of Candidate Profiles:
${JSON.stringify(profiles)}

${generateSystemPrompt()}
`;

  // Gemini API endpoint (ver 1.5 models)
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    }),
  });

  if (!res.ok) {
    throw new Error("Gemini API Error " + res.status);
  }

  const resp = await res.json();
  // See: https://ai.google.dev/api/rest/v1beta
  // Extracting text (handle newer Gemini response)
  const text = resp.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!text) throw new Error("No Gemini response text");
  // Ensure it's a valid JSON array
  try {
    const result = JSON.parse(text.trim());
    if (Array.isArray(result)) return result;
    throw new Error("Parsed Gemini result is not array");
  } catch (err) {
    throw new Error("Gemini output is not valid JSON.\nRaw: " + text);
  }
}

// Fallback: simple keyword/interest match, pick top 10
function fallbackMatch(answers: string[], profiles: any[]) {
  if (!answers || answers.length < 3) return profiles.slice(0, 10);

  // q1 = "What motivates you right now?"
  // q2 = "What skills do you love using?"
  // q3 = "Who are you hoping to meet?" - This should have the highest weight
  const [q1, q2, q3] = answers.map((s: string) => s.toLowerCase());

  const scores = profiles.map((profile) => {
    let score = 0;

    // Give highest weight to matching the "who you want to meet" question (q3)
    for (const interest of profile.interests || []) {
      const interestLower = interest.toLowerCase();
      // "Who are you hoping to meet?" - highest weight
      if (q3.includes(interestLower)) score += 4;
      // "What motivates you right now?" - medium weight
      if (q1.includes(interestLower)) score += 2;
      // "What skills do you love using?" - medium weight
      if (q2.includes(interestLower)) score += 2;
    }

    // Additional matching on title and other fields
    if ((profile.title || "").toLowerCase().includes(q3)) score += 3; // Higher weight for title matching q3
    if ((profile.title || "").toLowerCase().includes(q2)) score += 1;
    if ((profile.why || "").toLowerCase().includes(q1)) score += 1;

    return { ...profile, _score: score };
  });
  // Sort and pick best 10, fallback why
  return scores
    .sort((a, b) => b._score - a._score)
    .slice(0, 10)
    .map((p) => ({
      ...p,
      why: p.why || "Matched based on similar interests and background."
    }));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { answers, profiles } = await req.json();

    // Try Gemini API, else fallback
    let matches, usedFallback = false;
    try {
      matches = await fetchGeminiMatches({ answers, profiles });
    } catch (e) {
      matches = fallbackMatch(answers, profiles);
      usedFallback = true;
    }

    return new Response(
      JSON.stringify({ matches, fallbackUsed: usedFallback }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
