/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
      colors: {
        // Original bright blue theme
        primary: '#150DF7', // Bright blue
        secondary: '#000000', // Pure black
        accent: '#FFFFFF', // Pure white
        bg: '#FAFAFA', // Light gray background
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      animation: {
        'block-fade': 'blockFade 0.8s ease-out',
        'stagger-fade': 'blockFade 0.8s ease-out',
      },
      keyframes: {
        blockFade: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px) scale(0.95)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
          },
        }
      },
      boxShadow: {
        'block': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'block-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}