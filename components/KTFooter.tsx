import { PlayIcon } from "@heroicons/react/24/outline";

const navigation = {
  main: [
    { name: 'About Us', href: 'https://share.google/lEVDGD1oPeaAjm4uX' },
    { name: '이용약관', href: 'https://share.google/A2FmU0Hq8QGHO0Bb0' },
    { name: '기업상품약관', href: 'https://share.google/q0Lvec3P6Gxr9Qsmf' },
    { name: '법적고지', href: 'https://share.google/MqyQqMEEW2CfATo9w' },
    { name: '개인정보방침', href: 'https://share.google/BbD6aKx9vJl4z3ZMC' },
    { name: '윤리경영', href: 'https://share.google/HDDjovRXkalYkY5as' },
  ],
  social: [
    {
      name: 'YouTube',
      href: 'https://youtube.com/@kt_enterprise?si=Gjq4KstBynpN3WaO',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
}

export default function KTFooter() {
  return (
    <footer className="bg-[#031B4B] text-[#edeff5]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {navigation.main.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-normal leading-[150%] text-[#edeff5] hover:text-white transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="mt-8 flex justify-center gap-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#edeff5] hover:text-white transition-colors duration-200"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="w-6 h-6" aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="mt-10 text-center leading-[150%]">
          <p className="text-[14px] font-bold text-[#A0AEC0]">
            <strong>기업 상담전화</strong> &nbsp; 1588-0114 (유료)
          </p>
          <p className="mt-1 text-[13px] font-normal text-[#edeff5]">
            (주)케이티 &nbsp; 대표이사 김영섭 &nbsp; 경기도 성남시 분당구 불정로 90 (정자동)
          </p>
          <p className="mt-1 text-[13px] font-normal text-[#edeff5]">
            사업자등록번호: 102-81-42945 &nbsp; | &nbsp; 통신판매업신고: 2002-경기성남-0048 &nbsp;
            <a href="#" className="underline hover:text-white transition-colors duration-200">사업자정보확인</a>
          </p>
          <p className="mt-2 text-[12px] font-normal text-[#9ca3af]">
            &copy; 2024 KT corp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}