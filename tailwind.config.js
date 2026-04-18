/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          800: '#1e293b',
          900: '#0f172a',
        },
        orange: {
          500: '#f97316',
          600: '#ea580c',
        },
        cream: '#fefce8'
      }
    },
  },
  plugins: [],
}
