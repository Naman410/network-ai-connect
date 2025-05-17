
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "960px",
      },
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        accent1: "#7C3AED",
        accent2: "#04B971",
        grayui: "#F1F5F9",
        border: "#E2E8F0",
      },
      backgroundColor: {
        background: "var(--background)",
      },
      textColor: {
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(45deg,#7C3AED,#04B971)",
      },
      boxShadow: {
        card: "0 8px 32px 0 rgba(60,72,121,.08)",
      },
      transitionProperty: {
        theme: "background-color, color, border-color",
      },
      borderRadius: {
        xl: "1.25rem",
        lg: "0.75rem",
      },
      keyframes: {
        "fade-slide": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "fade-slide": "fade-slide 0.15s cubic-bezier(.47,1.64,.41,.8) forwards",
        "pulse-skel": "pulse 1s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
