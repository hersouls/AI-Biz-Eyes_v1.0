/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#031B4B',
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a3b8ff',
          400: '#7b91ff',
          500: '#5b6bff',
          600: '#3d4bff',
          700: '#2d3bff',
          800: '#031B4B',
          900: '#1a1a4b',
        },
        secondary: {
          DEFAULT: '#119891',
          50: '#f0fdfc',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#119891',
          700: '#0d7a6b',
          800: '#0f5f5b',
          900: '#134e4a',
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
        state: {
          red: '#EC193A',
          violet: '#6d8be1',
        },
        background: {
          light: '#edeff5',
        }
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'sans-serif'],
      },
      fontSize: {
        'heading0': ['38px', { lineHeight: '150%', fontWeight: '700' }],
        'heading1': ['30px', { lineHeight: '150%', fontWeight: '700' }],
        'heading2': ['26px', { lineHeight: '150%', fontWeight: '700' }],
        'heading3': ['24px', { lineHeight: '150%', fontWeight: '700' }],
        'subtitle1': ['20px', { lineHeight: '150%', fontWeight: '700' }],
        'subtitle2': ['18px', { lineHeight: '150%', fontWeight: '700' }],
        'body1': ['16px', { lineHeight: '150%' }],
        'body2': ['15px', { lineHeight: '150%' }],
        'body3': ['14px', { lineHeight: '150%' }],
        'detail1': ['13px', { lineHeight: '150%' }],
        'detail2': ['12px', { lineHeight: '150%' }],
      },
      borderRadius: {
        '3': '3px',
        '5': '5px',
        '12': '12px',
      },
      spacing: {
        '240': '240px',
        '260': '260px',
      }
    },
  },
  plugins: [],
}