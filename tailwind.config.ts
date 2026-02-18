import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1152d4",
        "primary-dark": "#0a3a9e",
        "accent-gold": "#C5A059",
        "accent-emerald": "#10B981",
        "neutral-slate": "#64748B",
        "background-light": "#FFFFFF",
        "background-off": "#F9FAFB",
        "background-dark": "#101622",
      },
      fontFamily: {
        display: '"Inter", sans-serif',
        body: '"Inter", sans-serif',
      },
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "6px",
        xl: "8px",
        "2xl": "12px",
      },
      boxShadow: {
        premium:
          "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -1px rgb(0 0 0 / 0.03)",
        "premium-hover":
          "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -2px rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};

export default config;
