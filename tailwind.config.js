/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Noto Sans Arabic', 'Cairo', 'Tajawal', 'sans-serif'],
        'sans': ['Noto Sans Arabic', 'Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
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
        // Dark mode colors
        dark: {
          bg: '#1a202c',
          card: '#2d3748',
          text: '#e2e8f0',
          subtext: '#a0aec0',
          border: '#4a5568',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
};
