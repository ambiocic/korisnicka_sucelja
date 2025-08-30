import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
      flicker: "flicker 1.5s infinite alternate",
    },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
      flicker: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.7" },
      },
    },
  },
  },
  
  darkMode: "class", // Enables class-based dark mode
  plugins: [],
} satisfies Config;

