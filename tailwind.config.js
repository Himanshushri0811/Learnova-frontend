/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          surface: '#F8FAFC',
          navy: '#0B1F4D',
          blue: '#2563EB',
          cyan: '#06B6D4',
          gold: '#F59E0B',
          text: '#334155',
          navyLight: '#142C66',
          navyDark: '#071536',
          blueHover: '#1D4ED8',
        },
      },
    },
  },
  plugins: [],
};

