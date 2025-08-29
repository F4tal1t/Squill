/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'brutal': ['Space Grotesk', 'Arial Black', 'sans-serif'],
        'mono-brutal': ['JetBrains Mono', 'Courier New', 'monospace'],
        'sans': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        // System Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Primary Sea Green
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        // Neobrutalist Colors
        'brutal-black': "hsl(var(--brutal-black))",
        'brutal-white': "hsl(var(--brutal-white))",
        'brutal-gray': "hsl(var(--brutal-gray))",
        'brutal-light-gray': "hsl(var(--brutal-light-gray))",
        
        // Accent Colors
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        info: "hsl(var(--info))",
        
        // Card Colors
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Legacy Support
        secondary: {
          DEFAULT: "hsl(var(--brutal-gray))",
          foreground: "hsl(var(--brutal-white))",
        },
        destructive: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--brutal-white))",
        },
        muted: {
          DEFAULT: "hsl(var(--brutal-gray))",
          foreground: "hsl(var(--brutal-light-gray))",
        },
        accent: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--brutal-black))",
        },
        popover: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "0px",  // No border radius for neobrutalist style
        md: "0px",
        sm: "0px",
        none: "0px",
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px hsl(var(--brutal-black))',
        'brutal-sm': '4px 4px 0px 0px hsl(var(--brutal-black))',
        'brutal-lg': '12px 12px 0px 0px hsl(var(--brutal-black))',
        'brutal-inset': 'inset 4px 4px 0px 0px hsl(var(--brutal-gray))',
      },
      animation: {
        'brutal-pop': 'brutalPop 0.3s ease',
        'brutal-slide-in': 'slideInBrutal 0.5s ease-out',
      },
    },
  },
  plugins: [],
}