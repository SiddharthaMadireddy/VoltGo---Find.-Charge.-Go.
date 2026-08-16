/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b0b8c8',
          400: '#8590a8',
          500: '#67718b',
          600: '#525a70',
          700: '#43495c',
          800: '#3a3f4e',
          900: '#0f1320',
          950: '#080b14',
        },
        volt: {
          50: '#ecfff5',
          100: '#d2ffe8',
          200: '#a7ffd3',
          300: '#5bf9b0',
          400: '#1de888',
          500: '#06c96a',
          600: '#02a555',
          700: '#038346',
          800: '#0a673a',
          900: '#0b5431',
          950: '#04301c',
        },
        spark: {
          50: '#eefaff',
          100: '#d8f1ff',
          200: '#b9e6ff',
          300: '#86d4ff',
          400: '#3fb8ff',
          500: '#1199f7',
          600: '#0478d8',
          700: '#0660b0',
          800: '#0a528e',
          900: '#0d4874',
          950: '#0a2e4b',
        },
        amberx: {
          400: '#ffb43d',
          500: '#ff9d11',
          600: '#f08200',
        },
        rosex: {
          400: '#ff6b6b',
          500: '#f5424f',
          600: '#d81f30',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,19,32,0.04), 0 8px 24px -8px rgba(15,19,32,0.10)',
        glow: '0 0 0 1px rgba(6,201,106,0.18), 0 12px 40px -12px rgba(6,201,106,0.45)',
        map: '0 10px 40px -10px rgba(15,19,32,0.30)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '70%': { transform: 'scale(2.2)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        'charge-flow': {
          '0%': { strokeDashoffset: '40' },
          '100%': { strokeDashoffset: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.02)' },
        },
        'spring-up': {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          '60%': { opacity: '1', transform: 'translateY(-4px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(6,201,106,0.3))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 30px rgba(6,201,106,0.7))' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'charge-flow': 'charge-flow 1.2s linear infinite',
        marquee: 'marquee 28s linear infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'spring-up': 'spring-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
