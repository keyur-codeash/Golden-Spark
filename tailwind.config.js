/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",    // if you're using App Router
    "./pages/**/*.{js,ts,jsx,tsx}",  // if using Pages Router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown1: "#bb947b",
        yellow: "#f9f4ee",
        blue: "#1e40af",
      },
    },
  },
  plugins: [],
};
