
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className="group p-2 rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] absolute right-5 top-5 z-20 bg-grayui dark:bg-slate-800"
      onClick={toggleTheme}
      type="button"
      tabIndex={0}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`block transition-transform duration-300 ${
          theme === "dark" ? "rotate-180" : ""
        }`}
      >
        {theme === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="w-6 h-6 text-yellow-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-8.66l-.7.7m-13.92 0-.7-.7m15.56 6.96-.7-.7M7.05 6.34l-.7-.7m6.36 12.42-.7.7m5.18-14.77l.7.7M3 12H2m20 0h-1" />
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={2}/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="w-6 h-6 text-indigo-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 0111.21 3c0 .12 0 .24.01.36a9 9 0 009.78 9.43Z" />
          </svg>
        )}
      </span>
    </button>
  );
}
