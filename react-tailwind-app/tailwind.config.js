/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎯 Primary 컬러
        primary: '#031B4B',
        
        // 🌊 Secondary 컬러
        secondary: '#119891',
        
        // 📊 State 컬러
        state: {
          red: '#EC193A',
          violet: '#6d8be1',
        },
        
        // 🎨 Grayscale/Border/BG 컬러
        grayscale: {
          light: '#edeff5',
          border: '#e5e7eb',
          bg: '#f9fafb',
        },
        
        // 기존 호환성을 위한 별칭
        navy: '#031B4B',
        sky: '#119891',
        red: '#EC193A',
        purple: '#6d8be1',
        gray: '#edeff5',
        black: '#000000',
        white: '#ffffff',
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'sans-serif'],
        'sans': ['Pretendard', 'sans-serif'],
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
      },
      maxWidth: {
        'screen-xl': '1920px',
        'screen-lg': '1025px',
      },
      minWidth: {
        'screen-lg': '1025px',
      }
    },
  },
  plugins: [],
}