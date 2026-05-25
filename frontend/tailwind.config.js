/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sarc-navy': '#0d1b2a',
        'sarc-navy-mid': '#1a2d44',
        'sarc-navy-light': '#243b55',
        'sarc-teal': '#2dd4bf',
        'sarc-teal-dark': '#14b8a6',
        'sarc-blue': '#3b82f6',
        primary: '#1f2937',
        secondary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
