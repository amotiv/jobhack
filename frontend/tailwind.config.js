export default {
  darkMode: "class",
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: { "2xl": "16px" },
      boxShadow: { "soft": "0 10px 30px rgba(0,0,0,.06)" }
    }
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp")],
}
