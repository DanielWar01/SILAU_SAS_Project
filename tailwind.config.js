/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#ee8317',
        'brand-gray': '#2e2d2b',
        'brand-red': '#e31c21',
        'yellow-intense': '#ec7c12',
      }
    },
  },
  plugins: [],
}