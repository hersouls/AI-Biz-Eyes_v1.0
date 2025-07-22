/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // B2G 프로젝트 커스텀 색상
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          DEFAULT: '#031B4B', // Primary color from design guide
        },
        secondary: {
          50: '#f0fdfb',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          DEFAULT: '#119891', // Secondary color from design guide
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // State colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#EC193A', // Error color from design guide
        },
        info: {
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
      },
      fontFamily: {
        'sans': ['Pretendard', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        // Custom font sizes from design guide
        'xs': ['12px', { lineHeight: '150%' }],
        'sm': ['13px', { lineHeight: '150%' }],
        'base': ['14px', { lineHeight: '150%' }],
        'lg': ['15px', { lineHeight: '150%' }],
        'xl': ['16px', { lineHeight: '150%' }],
        '2xl': ['18px', { lineHeight: '150%' }],
        '3xl': ['20px', { lineHeight: '150%' }],
        '4xl': ['24px', { lineHeight: '150%' }],
        '5xl': ['26px', { lineHeight: '150%' }],
        '6xl': ['30px', { lineHeight: '150%' }],
        '7xl': ['38px', { lineHeight: '150%' }],
      },
      spacing: {
        // Custom spacing for consistent layout
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        // Custom border radius from design guide
        'none': '0px',
        'sm': '3px',
        'DEFAULT': '5px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '50%',
      },
      boxShadow: {
        // Custom shadows
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
      animation: {
        // Custom animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Custom plugins for B2G project
    function({ addUtilities }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.prose-custom': {
          '& h1': {
            fontSize: '2rem',
            fontWeight: '700',
            lineHeight: '150%',
            marginBottom: '1rem',
            color: '#1f2937',
          },
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: '600',
            lineHeight: '150%',
            marginTop: '2rem',
            marginBottom: '0.75rem',
            color: '#374151',
          },
          '& h3': {
            fontSize: '1.25rem',
            fontWeight: '600',
            lineHeight: '150%',
            marginTop: '1.5rem',
            marginBottom: '0.5rem',
            color: '#4b5563',
          },
          '& p': {
            marginBottom: '1rem',
            lineHeight: '150%',
            color: '#6b7280',
          },
          '& ul, & ol': {
            marginBottom: '1rem',
            paddingLeft: '1.5rem',
          },
          '& li': {
            marginBottom: '0.25rem',
            lineHeight: '150%',
          },
          '& strong': {
            fontWeight: '600',
            color: '#374151',
          },
          '& a': {
            color: '#3b82f6',
            textDecoration: 'underline',
            '&:hover': {
              color: '#2563eb',
            },
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
}