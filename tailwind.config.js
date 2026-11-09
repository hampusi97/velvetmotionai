/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#09090D",
        surface: "#12101C",
        neonPink: "#FF007F",
        neonPurple: "#8B5CF6",
        neonFuchsia: "#D946EF",
      },
    },
  },
  plugins: [],
};
