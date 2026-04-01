/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#04040f',
          secondary: '#080818',
          card: '#0d1b2e',
          'card-alt': '#0a1628',
        },
        accent: {
          cyan:   '#00e5ff',
          blue:   '#0066ff',
          purple: '#7c4dff',
          green:  '#00e676',
          yellow: '#ffd600',
          pink:   '#ff4081',
        },
        border: { DEFAULT: '#1e3a5f' },
        brand: {
          50:  '#e0fffe',
          100: '#b3fffe',
          200: '#80fffd',
          300: '#4dfffc',
          400: '#26fffa',
          500: '#00e5ff',
          600: '#00b8d4',
          700: '#0088a3',
          800: '#005f75',
          900: '#003847',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'glow-cyan':    'glowCyan 2s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'float-slow':   'float 5s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'spin-slow':    'spin 8s linear infinite',
        'marquee':      'marquee 30s linear infinite',
        'gradient-x':   'gradientX 4s ease infinite',
        'bounce-slow':  'bounce 2s infinite',
        'ping-slow':    'ping 2.5s cubic-bezier(0,0,0.2,1) infinite',
        'draw-line':    'drawLine 1.5s ease forwards',
        'count-up':     'countUp 0.5s ease-out forwards',
      },
      keyframes: {
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 10px #00e5ff, 0 0 20px #00e5ff40' },
          '50%':     { boxShadow: '0 0 25px #00e5ff, 0 0 50px #00e5ff60, 0 0 80px #00e5ff20' },
        },
        glowCyan: {
          '0%,100%': { textShadow: '0 0 10px #00e5ff80' },
          '50%':     { textShadow: '0 0 20px #00e5ff, 0 0 40px #00e5ff80' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        drawLine: {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      backgroundSize: { '200': '200% auto', '300': '300% 300%' },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
