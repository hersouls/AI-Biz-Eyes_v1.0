/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎯 브랜드 중심 강조 (Primary)
        primary: 'var(--primary)',
        
        // 🧭 정보 밀도 높은 배경 (Dark Background)
        navy: 'var(--navy)',
        
        // 🌤 긍정·전환 유도 배경 (Light Accent)
        sky: 'var(--sky)',
        
        // 📰 문서성, 보조 정보 전달용 (Sub Text / Border)
        gray: 'var(--gray)',
        
        // 📢 주의/긴급/제휴 강조 태그 (Alert / Badge)
        red: 'var(--red)',
        
        // 🧪 관리자/개발자 전용 UI 태그
        purple: 'var(--purple)',
        
        // ⬛ 진중한 선택 유도 버튼 (Secondary CTA)
        black: 'var(--black)',
        
        // 🧾 가독성 중심 텍스트 및 배경
        white: 'var(--white)',
        
        // 기존 호환성을 위한 별칭
        secondary: 'var(--sky)',
        state: {
          red: 'var(--red)',
          violet: 'var(--purple)',
        },
        background: {
          light: 'var(--gray)',
        }
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