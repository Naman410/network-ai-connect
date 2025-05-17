
import React from "react";
import { toast } from "@/hooks/use-toast";
import { Copy, MessageSquare } from "lucide-react";

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

// Discord deep link – direct message (note: Discord web can't prefill messages, but we guide the user)
function discordUrl(user: string) {
  if (!user) return "#";
  // If snowflake ID, use /users/ route, else normal username doesn't have direct deep link
  return user.match(/^\d{15,}$/)
    ? `https://discordapp.com/users/${user}`
    : "https://discord.com/channels/@me";
}

// Prefilled friendly intro (for clipboard)
const FRIENDLY_INTRO = (name: string) =>
  `Hey ${name}, just got matched on SuperNetworkAI – would love to connect and chat!`;

export default function MatchCard({
  name,
  discord,
  title,
  location,
  interests,
  why,
}: Props) {
  const handleCopyUsername = () => {
    navigator.clipboard.writeText(discord);
    toast({ title: "Discord username copied", description: discord });
  };

  const handleFriendlyIntro = () => {
    navigator.clipboard.writeText(FRIENDLY_INTRO(name));
    toast({
      title: "Intro Message Copied!",
      description: "Paste this in your first message on Discord.",
    });
    // Open user profile (best Discord can do)
    window.open(discordUrl(discord), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="glass card-radius group shadow-card relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800
      hover:border-accent1/90 hover:shadow-xl transition-all flex flex-col h-[340px] md:h-[372px] max-h-[410px] justify-between p-5 md:p-6
      after:absolute after:-z-0 after:inset-0 after:bg-gradient-to-br after:from-[#f1f0fb]/0 after:to-[#7C3AED]/10 after:pointer-events-none">
      <div>
        <div className="mb-1 flex items-center gap-2 flex-wrap">
          <span className="font-bold text-lg">{name}</span>
        </div>
        {title && (
          <div className="text-gray-880 dark:text-gray-200 truncate max-w-full mb-1" title={title}>
            {truncate(title, 70)}
          </div>
        )}
        {interests && interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1 mt-1">
            {interests.slice(0, 3).map((tag) =>
              <span key={tag} className="bg-gradient-to-r from-accent1/10 to-accent2/10 text-xs font-medium px-3 py-1 rounded-full border border-accent1/15 text-accent1 dark:text-accent2">
                {tag}
              </span>
            )}
          </div>
        )}
        {location && (
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{location}</div>
        )}
        <div className="italic text-slate-700 dark:text-slate-300 text-sm mt-2 mb-3">
          🤝 Why you matched: <span className="font-medium">{why}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-auto z-10 mb-0">
        <button
          className="flex items-center gap-1 gradient-accent text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-transform"
          onClick={handleCopyUsername}
        >
          <Copy size={18} className="inline-block" />
          Copy Discord
        </button>
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold border border-accent1 text-accent1 bg-transparent hover:bg-accent1/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition hover:scale-105"
          onClick={handleFriendlyIntro}
        >
          <MessageSquare size={18} className="inline-block" />
          Message on Discord
        </button>
      </div>
    </div>
  );
}
