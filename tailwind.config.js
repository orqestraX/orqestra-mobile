/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        orq: {
          bg: '#070D09', surface: '#0E1A11', elevated: '#162019',
          green: '#22C55E', gold: '#F59E0B', text: '#F0FDF4', muted: '#6B7280'
        }
      }
    }
  }
};