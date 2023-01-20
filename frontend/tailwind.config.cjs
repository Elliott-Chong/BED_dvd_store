/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        spacemono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [require("daisyui")],
};
