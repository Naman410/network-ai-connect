
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";

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
  `Hey, ${name} here, just matched with you on SuperNetworkAI – let's connect!`;

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
    const formattedUsername = formatDiscordUsername(discord);
    navigator.clipboard.writeText(formattedUsername);
    toast({
      title: "Discord username copied",
      description: formattedUsername
    });
  };

  const handleFriendlyIntro = () => {
    try {
      // Copy the intro message to clipboard
      navigator.clipboard.writeText(FRIENDLY_INTRO(name));

      // Format the Discord username
      const formattedUsername = formatDiscordUsername(discord);

      // Log for debugging
      console.log('Opening Discord URL for:', formattedUsername);
      const url = discordUrl(formattedUsername);
      console.log('Discord URL:', url);

      // Open Discord in a new tab
      window.open(url, "_blank", "noopener,noreferrer");

      // Show toast with instructions
      toast({
        title: "Ready to connect!",
        description: "Discord opened and intro message copied to clipboard. Just paste to send!",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error in handleFriendlyIntro:', error);

      // Format the username for the fallback toast
      const formattedUsername = formatDiscordUsername(discord);

      // Fallback toast if there's an error
      toast({
        title: "Discord username copied",
        description: `Add ${formattedUsername} on Discord to connect!`,
        duration: 5000,
      });
    }
  };

  return (
    <div className={`glass card-radius group shadow-card relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800
      hover:border-accent1/90 hover:shadow-xl transition-all flex flex-col ${isTitleExpanded ? 'min-h-[340px]' : 'h-[340px]'} justify-between p-6
      min-w-[280px] w-full max-w-full transform hover:scale-[1.01] transition-transform duration-200 overflow-hidden
      after:absolute after:-z-0 after:inset-0 after:bg-gradient-to-br after:from-[#f1f0fb]/0 after:to-[#7C3AED]/10 dark:after:to-[#7C3AED]/30 after:pointer-events-none`}>
      <div>
        {/* Name with fixed height */}
        <div className="mb-3">
          <h3 className="font-bold text-xl line-clamp-1 tracking-tight dark:text-white text-slate-900" title={name}>{name}</h3>
        </div>

        {/* Title - expandable */}
        <div className={`mb-2 ${!isTitleExpanded ? 'h-[22px]' : ''}`}>
          {title && (
            <div className="flex items-start">
              <div className={`text-gray-800 dark:text-gray-50 font-medium pr-5 ${isTitleExpanded ? '' : 'line-clamp-1'}`} style={{ wordBreak: 'break-word' }}>
                {title}
              </div>
              {title.length > 50 && (
                <button
                  onClick={() => setIsTitleExpanded(!isTitleExpanded)}
                  className="ml-1 text-accent1 hover:text-accent2 transition-colors flex-shrink-0 absolute right-6"
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

        {/* Location with fixed height */}
        <div className="h-[20px] mb-2">
          {location && (
            <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1 flex items-center" title={location}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 mr-1 text-slate-500 dark:text-slate-400">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              {location}
            </div>
          )}
        </div>

        {/* Interests - show all */}
        <div className="mb-3 min-h-[32px]">
          {interests && interests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {interests.map((tag) =>
                <span key={tag} className="bg-gradient-to-r from-accent1/15 to-accent2/15 dark:from-accent1/25 dark:to-accent2/25 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-accent1/20 dark:border-accent1/30 text-accent1 dark:text-accent2 shadow-sm max-w-full overflow-hidden">
                  <span className="block truncate" title={tag}>{truncate(tag, 12)}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Why matched with fixed height */}
        <div className="h-[60px] text-slate-800 dark:text-slate-200 text-sm bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-inner">
          <p className="line-clamp-3" title={`Why you matched: ${why}`}>
            <span className="font-semibold text-accent1 dark:text-accent2">Why you matched:</span> <span className="italic">{why}</span>
          </p>
        </div>
      </div>

      {/* Button for copying Discord ID */}
      <div className="flex mt-auto z-10">
        <button
          className="flex items-center justify-center gap-2 bg-white dark:bg-indigo-600 text-slate-800 dark:text-white px-4 py-3 rounded-lg font-semibold shadow-md border border-slate-200 dark:border-indigo-500 hover:bg-slate-50 dark:hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-all w-full transform hover:translate-y-[-2px]"
          onClick={handleCopyUsername}
        >
          <Copy size={18} className="inline-block text-slate-600 dark:text-white" />
          Copy Discord ID
        </button>
      </div>
    </div>
  );
}
