import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F5F6F2",
        "ivory-dim": "#ECEEE8",
        teal: {
          50: "#E7EEEC",
          100: "#CFE0DC",
          300: "#5E8E89",
          600: "#0F4E4E",
          800: "#0A3F3F",
          900: "#073A3B",
          950: "#052B2C",
        },
        ink: "#10201F",
        gate: {
          verde: "#3F8F5C",
          "verde-bg": "#E5F0E6",
          giallo: "#B8862E",
          "giallo-bg": "#FBF0DC",
          rosso: "#B14A3C",
          "rosso-bg": "#F6E4E0",
          neutro: "#6B7876",
          "neutro-bg": "#E9EBE7",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(7, 58, 59, 0.06), 0 1px 8px rgba(7, 58, 59, 0.05)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
};
export default config;
