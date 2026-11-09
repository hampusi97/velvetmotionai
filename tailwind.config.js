/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        candyDark: "#07060A",
        candySurface: "#120E1C",
        candyBorder: "rgba(255, 255, 255, 0.08)",
        candyPink: "#FF007F",
        candyViolet: "#8B5CF6",
        candyPurple: "#6D28D9",
        neonPink: "#FF007F",
        neonPurple: "#8B5CF6",
        neonFuchsia: "#D946EF",
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
