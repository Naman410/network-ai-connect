
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
  `Hey, ${name} here, just matched with you on SuperNetworkAI – let's connect!`;

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
    // Copy the intro message to clipboard
    navigator.clipboard.writeText(FRIENDLY_INTRO(name));

    // Open Discord in a new tab
    window.open(discordUrl(discord), "_blank", "noopener,noreferrer");

    // Show toast with instructions
    toast({
      title: "Ready to connect!",
      description: "Discord opened and intro message copied to clipboard. Just paste to send!",
      duration: 5000,
    });
  };

  return (
    <div className="glass card-radius group shadow-card relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800
      hover:border-accent1/90 hover:shadow-xl transition-all flex flex-col h-[320px] justify-between p-4
      after:absolute after:-z-0 after:inset-0 after:bg-gradient-to-br after:from-[#f1f0fb]/0 after:to-[#7C3AED]/10 after:pointer-events-none">
      <div>
        {/* Name with fixed height */}
        <div className="mb-2">
          <h3 className="font-bold text-lg line-clamp-1" title={name}>{name}</h3>
        </div>

        {/* Title with fixed height */}
        <div className="h-[22px] mb-2">
          {title && (
            <div className="text-gray-800 dark:text-gray-200 line-clamp-1" title={title}>
              {truncate(title, 50)}
            </div>
          )}
        </div>

        {/* Location with fixed height */}
        <div className="h-[20px] mb-2">
          {location && (
            <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{location}</div>
          )}
        </div>

        {/* Interests with fixed height */}
        <div className="h-[32px] mb-3">
          {interests && interests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {interests.slice(0, 2).map((tag) =>
                <span key={tag} className="bg-gradient-to-r from-accent1/10 to-accent2/10 text-xs font-medium px-2 py-1 rounded-full border border-accent1/15 text-accent1 dark:text-accent2 line-clamp-1">
                  {truncate(tag, 15)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Why matched with fixed height */}
        <div className="h-[60px] italic text-slate-700 dark:text-slate-300 text-sm">
          <p className="line-clamp-3" title={`Why you matched: ${why}`}>
            🤝 <span className="font-medium">Why you matched:</span> {why}
          </p>
        </div>
      </div>

      {/* Buttons with consistent layout */}
      <div className="flex flex-col gap-2 mt-auto z-10">
        <button
          className="flex items-center justify-center gap-1 gradient-accent text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-transform w-full"
          onClick={handleFriendlyIntro}
        >
          <MessageSquare size={16} className="inline-block" />
          Message on Discord
        </button>
        <button
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold border border-accent1 text-accent1 bg-transparent hover:bg-accent1/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition hover:scale-[1.02] w-full"
          onClick={handleCopyUsername}
        >
          <Copy size={16} className="inline-block" />
          Copy Discord ID
        </button>
      </div>
    </div>
  );
}
