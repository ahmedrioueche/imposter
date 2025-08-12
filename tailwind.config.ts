import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#f8fafc',
          foreground: '#0f172a',
          primary: '#06b6d4',
          secondary: '#f59e0b',
          accent: '#10b981',
          muted: '#64748b',
          border: '#e2e8f0',
          card: '#ffffff',
          danger: '#dc2626',
          text: {
            primary: '#0f172a',
            secondary: '#64748b',
            muted: '#94a3b8',
          },
        },
        dark: {
          background: '#0f172a',
          foreground: '#f1f5f9',
          primary: '#22d3ee',
          secondary: '#fbbf24',
          accent: '#2E3D55',
          muted: '#64748b',
          border: '#334155',
          card: '#1e293b',
          danger: '#ef4444',
          text: {
            primary: '#f1f5f9',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
          },
        },
      
      },
      fontFamily: {
        dancing: ['Dancing Script', 'serif'],
        stix: ['STIX Two Text', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
        'sport-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
    },
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0', transform: 'translateY(-10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'inplace-fade': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      'slide-up': {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'bounce-in': {
        '0%': { opacity: '0', transform: 'scale(0.3)' },
        '50%': { opacity: '1', transform: 'scale(1.05)' },
        '70%': { transform: 'scale(0.9)' },
        '100%': { opacity: '1', transform: 'scale(1)' },
      },
      spin: {
        to: { transform: 'rotate(360deg)' },
      },
      pulse: {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.5' },
      },
    },
    animation: {
      'bounce-slow': 'bounce 1s ease-in-out infinite',
      'bounce-in': 'bounce-in 0.6s ease-out',
      spin: 'spin 1s linear infinite',
      'fade-in': 'fade-in 0.5s ease-out',
      'inplace-fade': 'inplace-fade 300ms ease-out',
      'slide-up': 'slide-up 0.4s ease-out',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
  darkMode: 'class',
};

export default config;
