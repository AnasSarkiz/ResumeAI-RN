/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './app/**/*.{js,ts,tsx}'],
  // Use class-based dark mode so manual theme toggling via NativeWind works
  darkMode: 'class',

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#25439A',
          50: '#eef2fc',
          100: '#dfe7fa',
          200: '#bfcef5',
          300: '#9db5ef',
          400: '#6e8de4',
          500: '#4a6ad4',
          600: '#3553b8',
          700: '#2c489f',
          800: '#25439A',
          900: '#1d367a',
        },
        accent: '#3D92C4',
      },
    },
  },
  plugins: [],
};
