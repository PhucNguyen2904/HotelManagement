import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jost)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        azure: {
          500: '#0077B6',
          600: '#005B8E',
        },
        manor: {
          primary: '#1B3A4B',
          'primary-container': '#274E63',
          secondary: '#C9A96E',
          'secondary-container': '#E0C794',
          surface: '#F2EFE9',
          'surface-low': '#EAE6DF',
          'surface-lowest': '#FFFFFF',
          'surface-high': '#DDD7CF',
          outline: '#B8AB97',
          muted: '#5E5E5E',
        },
      },
    },
  },
  plugins: [],
};

export default config;
