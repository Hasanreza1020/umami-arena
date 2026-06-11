/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D0D',
        surface: '#1A1A1A',
        'surface-2': '#222222',
        border: '#2A2A2A',
        'red-arena': '#E8332A',
        amber: '#F5A623',
        'text-primary': '#F0EDE6',
        'text-muted': '#9A9A8A',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(232, 51, 42, 0.4)',
        'red-glow-sm': '0 0 10px rgba(232, 51, 42, 0.3)',
      },
    },
  },
  plugins: [],
};
