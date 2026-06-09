/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Outfit', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        nacos: {
          green: '#1A6B2F',
          'green-dark': '#0D3D1A',
          'green-light': '#2E8B45',
          'green-muted': '#E8F5EC',
          gold: '#D4A017',
          'gold-light': '#F0C040',
          'gold-dark': '#A87A0D',
        },
      },
      backgroundImage: {
        'nacos-gradient': 'linear-gradient(135deg, #0D3D1A 0%, #1A6B2F 50%, #2E8B45 100%)',
        'gold-gradient': 'linear-gradient(135deg, #A87A0D 0%, #D4A017 50%, #F0C040 100%)',
      },
      boxShadow: {
        'nacos': '0 4px 24px rgba(26, 107, 47, 0.25)',
        'gold': '0 4px 24px rgba(212, 160, 23, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'count-up': 'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
