
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
      hover:border-accent1/90 hover:shadow-xl transition-all flex flex-col ${isTitleExpanded ? 'min-h-[320px]' : 'h-[320px]'} justify-between p-4
      after:absolute after:-z-0 after:inset-0 after:bg-gradient-to-br after:from-[#f1f0fb]/0 after:to-[#7C3AED]/10 after:pointer-events-none`}>
      <div>
        {/* Name with fixed height */}
        <div className="mb-2">
          <h3 className="font-bold text-lg line-clamp-1" title={name}>{name}</h3>
        </div>

        {/* Title - expandable */}
        <div className={`mb-2 ${!isTitleExpanded ? 'h-[22px]' : ''}`}>
          {title && (
            <div className="flex items-start">
              <div className={`text-gray-900 dark:text-gray-100 ${isTitleExpanded ? '' : 'line-clamp-1'}`}>
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

        {/* Location with fixed height */}
        <div className="h-[20px] mb-2">
          {location && (
            <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1" title={location}>
              {location}
            </div>
          )}
        </div>

        {/* Interests - show all */}
        <div className="mb-3 min-h-[32px]">
          {interests && interests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {interests.map((tag) =>
                <span key={tag} className="bg-gradient-to-r from-accent1/15 to-accent2/15 text-xs font-semibold px-2 py-1 rounded-full border border-accent1/20 text-accent1 dark:text-accent2 line-clamp-1">
                  {truncate(tag, 15)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Why matched with fixed height */}
        <div className="h-[60px] italic text-slate-800 dark:text-slate-200 text-sm">
          <p className="line-clamp-3" title={`Why you matched: ${why}`}>
            🤝 <span className="font-medium">Why you matched:</span> {why}
          </p>
        </div>
      </div>

      {/* Button for copying Discord ID */}
      <div className="flex mt-auto z-10">
        <button
          className="flex items-center justify-center gap-1 gradient-accent text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-transform w-full"
          onClick={handleCopyUsername}
        >
          <Copy size={16} className="inline-block" />
          Copy Discord ID
        </button>
      </div>
    </div>
  );
}
