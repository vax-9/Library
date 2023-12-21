/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        firaCode: "'Fira Code', monospace",
        bitFont: "'Silkscreen', cursive",
        japanFont: "'Noto Sans JP', sans-serif",
        rubikFont: "'Rubik Mono One', sans-serif",
      },
    },
  },
  plugins: [],
};
