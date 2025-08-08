/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        korean: {
          red: '#CD2E3A',
          blue: '#0047A0',
        }
      },
      fontFamily: {
        korean: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}