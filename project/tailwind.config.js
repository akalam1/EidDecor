/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#171717',
          lighter: '#262626',
          light: '#404040',
        },
      },
      backgroundColor: {
        dark: {
          DEFAULT: '#171717',
          lighter: '#262626',
          light: '#404040',
        },
      },
    },
  },
  plugins: [],
};