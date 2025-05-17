import React, { useState } from "react";
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

  // Clean up the username if it has a discriminator or @ symbol
  const cleanUser = user.replace(/^@/, '');

  // If snowflake ID, use /users/ route
  if (cleanUser.match(/^\d{15,}$/)) {
    return `https://discordapp.com/users/${cleanUser}`;
  }

  // For usernames, open Discord app to DMs
  return "https://discord.com/channels/@me";
}

// Format Discord username for display
function formatDiscordUsername(username: string): string {
  if (!username) return "";

  // If it already has a # or @ prefix, return as is
  if (username.includes('#') || username.startsWith('@')) {
    return username;
  }

  // Otherwise, add @ prefix for modern Discord usernames
  return `@${username}`;
}

// Prefilled friendly intro (for clipboard)
const FRIENDLY_INTRO = (name: string) =>
  `Hey, just matched on SuperNetwork AI! I'm ${name}. Would love to connect on Discord!`;

// Log Discord URL for debugging
console.log('Discord URL function loaded');

export default function MatchCard({
  name,
  discord,
  title,
  location,
  interests,
  why,
}: Props) {
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const handleCopyUsername = () => {
    navigator.clipboard.writeText(discord);
    toast({
      title: "Discord username copied",
      description: discord
    });
  };

  const handleFriendlyIntro = () => {
    const formattedUsername = formatDiscordUsername(discord);
    const intro = FRIENDLY_INTRO(name);
    // Try: copy intro, open Discord @me, notify
    navigator.clipboard.writeText(intro);
    window.open(discordUrl(formattedUsername), "_blank", "noopener,noreferrer");
    toast({
      title: "Discord intro copied!",
      description: "Friendly intro copied. Paste it in Discord to connect 🎉",
      duration: 5000,
    });
  };

  return (
    <div
      className={`glass card-radius shadow-card hover-scale group relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800
      hover:border-accent1/90 hover:shadow-xl transition-all flex flex-col min-w-[310px] max-w-[400px] w-full mx-auto justify-between p-6
      after:absolute after:-z-0 after:inset-0 after:bg-gradient-to-br after:from-[#f6f3ff]/0 after:to-[#7C3AED]/10 after:pointer-events-none
      animate-fade-in`}
      style={{ height: isTitleExpanded ? undefined : 370 }}
    >
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-black text-2xl text-accent1 dark:text-accent2 tracking-tight line-clamp-1" title={name}>
            {name}
          </h3>
          {discord &&
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-mono bg-accent2/10 text-accent2 ml-auto">
              {discord}
            </span>
          }
        </div>
        {/* Title - expandable */}
        <div className={`mb-2 ${!isTitleExpanded ? 'h-[26px]' : ''}`}>
          {title && (
            <div className="flex items-start">
              <div className={`text-gray-900 dark:text-gray-100 text-base font-semibold ${isTitleExpanded ? '' : 'line-clamp-1'}`}>
                {title}
              </div>
              {title.length > 50 && (
                <button
                  onClick={() => setIsTitleExpanded(!isTitleExpanded)}
                  className="ml-1 text-accent1 hover:text-accent2 transition-colors flex-shrink-0"
                  aria-label={isTitleExpanded ? "Show less" : "Show more"}
                >
                  {isTitleExpanded ?
                    <ChevronUp size={14} className="inline-block" /> :
                    <ChevronDown size={14} className="inline-block" />
                  }
                </button>
              )}
            </div>
          )}
        </div>
        <div className="h-[22px] mb-2">
          {location && (
            <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1" title={location}>
              {location}
            </div>
          )}
        </div>
        <div className="mb-3 min-h-[32px]">
          {interests && interests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {interests.map((tag) =>
                <span key={tag} className="bg-gradient-to-r from-accent1/15 to-accent2/15 text-xs font-bold px-2 py-1 rounded-full border border-accent1/20 text-accent1 dark:text-accent2 shadow-inner">
                  {truncate(tag, 15)}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="h-[60px] italic text-slate-800 dark:text-slate-200 text-base leading-relaxed">
          <p className="line-clamp-3" title={`Why you matched: ${why}`}>
            <span className="mr-1">🤝</span>
            <span className="font-bold">Why you matched:</span> {why}
          </p>
        </div>
      </div>

      <div className="flex mt-auto gap-3 z-10">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-accent1 text-white py-2 rounded-lg font-bold shadow hover:bg-accent2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-all text-base"
          onClick={handleCopyUsername}
        >
          <Copy size={18} className="inline-block" />
          Copy Discord
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-accent2 text-accent2 py-2 rounded-lg font-bold shadow hover:bg-accent2 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#04B971] transition-all text-base"
          onClick={handleFriendlyIntro}
        >
          <MessageSquare size={18} className="inline-block" />
          Message on Discord
        </button>
      </div>
    </div>
  );
}
