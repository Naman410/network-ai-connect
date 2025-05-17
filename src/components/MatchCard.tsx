
import React from "react";
import { toast } from "@/hooks/use-toast";

type Props = {
  name: string;
  discord: string;
  title?: string;
  location?: string;
  interests?: string[];
  why: string;
};

function truncate(str: string, n: number) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

// Prefer opening Discord in browser for most interoperability
function discordUrl(user: string) {
  // If user is numeric snowflake, use /users/**, else try user? (fallback /users/)
  return user.match(/^\d{15,}$/)
    ? `https://discordapp.com/users/${user}`
    : `https://discordapp.com/users/${user}`;
}

export default function MatchCard({
  name,
  discord,
  title,
  location,
  interests,
  why,
}: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(discord);
    toast({ title: "Username copied 🎉", description: discord });
  };

  return (
    <div className="glass card-radius group p-5 shadow-card transition-all hover:ring-2 hover:ring-accent1/30 hover:scale-[1.02] relative bg-white dark:bg-slate-900">
      <div className="mb-1">
        <span className="font-bold text-lg">{name}</span>
      </div>
      {title && (
        <div className="text-gray-800 dark:text-gray-200 truncate max-w-full mb-1" title={title}>
          {truncate(title, 80)}
        </div>
      )}
      {interests && interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1 mt-1">
          {interests.slice(0, 3).map((tag) =>
            <span key={tag} className="bg-slate-100 dark:bg-slate-700 text-xs font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          )}
        </div>
      )}
      {location && (
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          {location}
        </div>
      )}
      <div className="italic text-slate-700 dark:text-slate-300 text-sm mt-2 mb-3">
        🤝 Why we matched you: <span className="font-medium">{why}</span>
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          className="gradient-accent text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-transform"
          onClick={handleCopy}
        >
          Copy Discord
        </button>
        <a
          href={discordUrl(discord)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg font-semibold border border-accent1 text-accent1 bg-transparent hover:bg-accent1/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition"
          tabIndex={0}
        >
          Message on Discord
        </a>
      </div>
    </div>
  );
}
