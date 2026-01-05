/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7ec8ff',
        dark: '#000000',
        light: '#ffffff',
      },
    },
  },
  plugins: [],
}