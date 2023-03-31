/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Helvetica', 'Arial', 'sans-serif'],
      'serif': ['Georgia', 'Cambria'],
      'mono': ['SFMono-Regular', 'Menlo'],
      'display': ['Oswald'],
      'body': ['Open Sans'],
    },
    extend: {},
  },
  plugins: [],
}
