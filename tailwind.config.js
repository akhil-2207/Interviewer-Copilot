/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF8",
        surface: "#FFFFFF",
        subtle: "#F4F4F1",
        line: "#E7E5E4",
        ink: "#111111",
        secondary: "#525252",
        muted: "#737373",
        brand: { DEFAULT: "#7ED957", dark: "#5FC13A", soft: "#EAF8E3" },
        info: { DEFAULT: "#2563EB", soft: "#EAF2FF" },
        warning: { DEFAULT: "#D97706", soft: "#FEF3C7" },
        danger: { DEFAULT: "#DC2626", soft: "#FEE2E2" },
      },
      boxShadow: {
        card: "0 1px 2px rgba(17, 17, 17, 0.04), 0 8px 24px rgba(17, 17, 17, 0.035)",
        float: "0 14px 35px rgba(17, 17, 17, 0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
