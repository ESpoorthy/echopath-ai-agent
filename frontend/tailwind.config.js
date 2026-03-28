/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact colors from requirements
        beige: {
          50: '#fefcf9',
          100: '#fdf7f0', 
          200: '#faeee1',
          300: '#f6e2cc',
          400: '#F5F5DC', // Main beige
          500: '#e8be8f',
          600: '#dda66e',
          700: '#cd8d52',
          800: '#b87543',
          900: '#9a6139',
        },
        cream: {
          50: '#fefdfb',
          100: '#FFFDD0', // Main cream
          200: '#faf2e7',
          300: '#f6e8d7',
          400: '#f0d9c4',
          500: '#e8c7a6',
          600: '#ddb185',
          700: '#cd9a6a',
          800: '#b8834f',
          900: '#9a6d3f',
        },
        brown: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#ebe2d4',
          300: '#D2B48C', // Light brown
          400: '#c4a373',
          500: '#b8935a',
          600: '#a67c47',
          700: '#8a653b',
          800: '#715233',
          900: '#5d442c',
        },
        yellow: {
          50: '#fefce8',
          100: '#FFF3B0', // Soft yellow
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        orange: {
          50: '#fff7ed',
          100: '#FFD8A8', // Light orange
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d2c7',
          300: '#a3b5a3',
          400: '#7d947d',
          500: '#5f7a5f',
          600: '#4a614a',
          700: '#3d4f3d',
          800: '#334133',
          900: '#2b362b',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}