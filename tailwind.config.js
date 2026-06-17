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
          green: '#0CCF00',
          'green-dark': '#089300',
          'green-light': '#3DEB00',
          'green-muted': '#0D1A0D',
          gold: '#FF2D6B',
          'gold-light': '#FF6090',
          'gold-dark': '#CC1D53',
          void: '#080808',
          panel: '#111111',
          surface: '#1A1A1A',
        },
        sage: {
          DEFAULT: '#E8F0EC',
          dark: '#D0DDD4',
        },
      },
      backgroundImage: {
        'nacos-gradient': 'linear-gradient(135deg, #08910A 0%, #0CCF00 50%, #3DEB00 100%)',
        'gold-gradient': 'linear-gradient(135deg, #CC1D53 0%, #FF2D6B 50%, #FF6090 100%)',
        'void-gradient': 'linear-gradient(180deg, #020812 0%, #060F1E 100%)',
      },
      boxShadow: {
        'nacos': '0 4px 24px rgba(12, 207, 0, 0.3)',
        'gold': '0 4px 24px rgba(255, 45, 107, 0.3)',
        'void': '0 8px 32px rgba(0, 0, 0, 0.7)',
      },
      fontSize: {
        'hero': ['clamp(2.8rem, 7vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'count-up': 'countUp 2s ease-out forwards',
        'aurora': 'aurora 14s ease-in-out infinite alternate',
        'marquee': 'marquee-scroll 30s linear infinite',
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
        aurora: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'marquee-scroll': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
