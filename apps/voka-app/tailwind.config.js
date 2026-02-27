/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A6B4A",
        secondary: "#E8A020",
        accent: "#C0392B",
        background: "#05080F", // Darker background to match the reference
        surface: "#161B22",
        "surface-light": "#21262D",
        "text-primary": "#F0F6FC",
        "text-secondary": "#8B949E",
        success: "#3FB950",
        warning: "#D29922",
        error: "#F85149",
        "neon-cyan": "#00E5FF",
        "neon-dark": "#0B1221",
        "neon-border": "#1A2B4C",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
