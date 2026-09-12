import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midnight: "#060913",
        obsidian: "#0a0f1d",
        navy: {
          950: "#040814",
          900: "#0b1226",
          850: "#0f172a",
          800: "#142042",
          700: "#1e2f5d",
          600: "#2a4282",
        },
        brand: {
          blue: "#2563eb",
          electric: "#3b82f6",
          sky: "#60a5fa",
          cyan: "#38bdf8",
          glow: "#1d4ed8",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "blue-grid": "linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        "blue-glow": "0 0 25px -5px rgba(59, 130, 246, 0.4)",
        "blue-glow-lg": "0 0 50px -10px rgba(37, 99, 235, 0.5)",
        "blue-border": "inset 0 0 0 1px rgba(59, 130, 246, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
