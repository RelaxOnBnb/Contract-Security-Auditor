/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-base': '#0D6EFD',
        'secondary-base': '#0A58CA',
        'light-blue': '#E7F1FF',
        gray: {
          DEFAULT: '#6C757D',
          dark: '#343A40',
          medium: '#6C757D',
          light: '#F8F9FA',
          border: '#DEE2E6',
        },
        primary: {
          100: '#e6f0ff',
          200: '#b3d1ff',
          300: '#80b3ff',
          400: '#4d94ff',
          500: '#1a75ff',
          600: '#0066ff',
          700: '#0052cc',
          800: '#003d99',
          900: '#002966',
        },
        secondary: {
          100: '#f0f4f8',
          200: '#d9e2ec',
          300: '#bcccdc',
          400: '#9fb3c8',
          500: '#829ab1',
          600: '#627d98',
          700: '#486581',
          800: '#334e68',
          900: '#243b53',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};