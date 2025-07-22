import React, { useState, useEffect } from 'react'
import { marked } from 'marked'
import {
  Dialog,
  Menu,
  Transition,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  DocumentTextIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentDocument, setCurrentDocument] = useState(null)

  const navigation = [
    { name: '대시보드', href: '#', icon: HomeIcon, current: true, description: '프로젝트 개요 및 요약 정보', content: `
      <h1>개발 문서 사이트 대시보드</h1>
      <p>B2G 공모사업 자동화 관리 웹서비스의 개발 문서를 관리하는 사이트입니다.</p>
      
      <h2>프로젝트 개요</h2>
      <p>이 프로젝트는 정부/공공기관의 공모·입찰·사업 공고를 자동 수집·구조화·분석·알림까지 한 번에 처리하는 올인원 자동화 웹서비스입니다.</p>
      
      <h2>주요 기능</h2>
      <ul>
        <li><strong>공고 관리:</strong> 나라장터 OpenAPI 연동을 통한 실시간 공고 수집</li>
        <li><strong>레퍼런스 관리:</strong> 내부 참여 이력/사업성과 관리</li>
        <li><strong>알림 시스템:</strong> 실시간 알림 및 이메일, 웹, 푸시 알림</li>
        <li><strong>대시보드:</strong> 전체 공고 현황 및 KPI 실시간 모니터링</li>
      </ul>
      
      <h2>기술 스택</h2>
      <h3>프론트엔드</h3>
      <ul>
        <li>React 18.x + TypeScript 5.x</li>
        <li>Tailwind CSS 3.x</li>
        <li>Zustand (상태 관리)</li>
        <li>React Router v6</li>
      </ul>
      
      <h3>백엔드</h3>
      <ul>
        <li>Node.js 18.x + Express.js 4.x</li>
        <li>PostgreSQL 15.x + Redis 7.x</li>
        <li>Prisma 5.x (ORM)</li>
        <li>JWT + bcrypt (인증)</li>
      </ul>
      
      <h2>개발 일정</h2>
      <p>총 16주 개발 일정으로 진행되며, 3단계로 나누어 개발됩니다:</p>
      <ol>
        <li><strong>1단계 (4주):</strong> 프로토타입 개발</li>
        <li><strong>2단계 (8주):</strong> 정식 버전 개발</li>
        <li><strong>3단계 (4주):</strong> 고도화 및 최적화</li>
      </ol>
      
      <h2>문서 구조</h2>
      <p>왼쪽 사이드바에서 다음 문서들을 확인할 수 있습니다:</p>
      <ul>
        <li><strong>기술 문서:</strong> API 명세서, 개발 기술 명세서, 데이터베이스 설계서</li>
        <li><strong>설계 문서:</strong> 화면 정의서, PRD, 디자인 가이드</li>
        <li><strong>관리 문서:</strong> 개발 일정표</li>
      </ul>
    ` },
    { name: '팀', href: '#', icon: UsersIcon, current: false, description: '개발 팀 정보 및 구성원' },
    { name: '프로젝트', href: '#', icon: FolderIcon, current: false, description: '프로젝트 관리 및 진행 상황' },
    { name: '일정', href: '#', icon: CalendarIcon, current: false, description: '개발 일정 및 마일스톤' },
    { name: '문서', href: '#', icon: DocumentDuplicateIcon, current: false, description: '프로젝트 관련 문서들' },
    { name: '보고서', href: '#', icon: ChartPieIcon, current: false, description: '프로젝트 통계 및 분석' },
  ]

  const technicalDocs = [
    { 
      name: 'API 명세서', 
      href: '#', 
      current: false, 
      description: 'REST API 엔드포인트 및 사용법',
      filePath: '/docs/API명세서.md'
    },
    { 
      name: '개발 기술 명세서', 
      href: '#', 
      current: false, 
      description: '사용된 기술 스택 및 아키텍처',
      filePath: '/docs/개발기술명세서.md'
    },
    { 
      name: '데이터베이스 설계서', 
      href: '#', 
      current: false, 
      description: '데이터베이스 스키마 및 관계',
      filePath: '/docs/데이터베이스설계서.md'
    },
    { 
      name: '화면 정의서', 
      href: '#', 
      current: false, 
      description: 'UI/UX 화면 설계 및 기능 정의',
      filePath: '/docs/화면정의서'
    },
    { 
      name: '개발 일정표', 
      href: '#', 
      current: false, 
      description: '개발 단계별 일정 및 마일스톤',
      filePath: '/docs/개발일정표.md'
    },
    { 
      name: 'PRD (Product Requirements Document)', 
      href: '#', 
      current: false, 
      description: '제품 요구사항 및 기능 명세',
      filePath: '/docs/PRD'
    },
    { 
      name: '디자인 가이드', 
      href: '#', 
      current: false, 
      description: 'UI/UX 디자인 시스템 및 가이드라인',
      filePath: '/docs/디자인가이드'
    }
  ]

  const userNavigation = [
    { name: '프로필', href: '#' },
    { name: '로그아웃', href: '#' },
  ]

  const selectDocument = async (doc) => {
    // 모든 문서의 current 상태를 false로 설정
    navigation.forEach(item => item.current = false)
    technicalDocs.forEach(item => item.current = false)
    
    // 선택된 문서의 current 상태를 true로 설정
    doc.current = true
    
    // 현재 문서 설정
    setCurrentDocument(doc)
    
    // 마크다운 파일이 있는 경우 로드
    if (doc.filePath) {
      try {
        const response = await fetch(doc.filePath)
        if (response.ok) {
          const markdownContent = await response.text()
          doc.content = marked(markdownContent)
        } else {
          doc.content = '<p>문서를 로드할 수 없습니다.</p>'
        }
      } catch (error) {
        console.error('문서 로드 오류:', error)
        doc.content = '<p>문서를 로드하는 중 오류가 발생했습니다.</p>'
      }
    }
  }

  const filterDocuments = () => {
    // 검색 기능 구현 (필요시)
    console.log('Searching for:', searchQuery)
  }

  useEffect(() => {
    // 초기 문서 선택 (대시보드)
    selectDocument(navigation[0])
  }, [])

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="size-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                {/* Sidebar component */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <DocumentTextIcon className="h-8 w-8 text-indigo-500" />
                    <span className="ml-2 text-xl font-bold text-white">개발 문서</span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <button
                                onClick={() => selectDocument(item)}
                                className={classNames(
                                  item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer w-full text-left'
                                )}
                              >
                                <item.icon className="size-6 shrink-0" aria-hidden="true" />
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs/6 font-semibold text-gray-400">기술 문서</div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {technicalDocs.map((doc) => (
                            <li key={doc.name}>
                              <button
                                onClick={() => selectDocument(doc)}
                                className={classNames(
                                  doc.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer w-full text-left'
                                )}
                              >
                                <DocumentIcon className="size-6 shrink-0" aria-hidden="true" />
                                <span className="truncate">{doc.name}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <a href="#" className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">
                          <Cog6ToothIcon className="size-6 shrink-0" aria-hidden="true" />
                          설정
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <DocumentTextIcon className="h-8 w-8 text-indigo-500" />
            <span className="ml-2 text-xl font-bold text-white">개발 문서</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => selectDocument(item)}
                        className={classNames(
                          item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer w-full text-left'
                        )}
                      >
                        <item.icon className="size-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs/6 font-semibold text-gray-400">기술 문서</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {technicalDocs.map((doc) => (
                    <li key={doc.name}>
                      <button
                        onClick={() => selectDocument(doc)}
                        className={classNames(
                          doc.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer w-full text-left'
                        )}
                      >
                        <DocumentIcon className="size-6 shrink-0" aria-hidden="true" />
                        <span className="truncate">{doc.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <a href="#" className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">
                  <Cog6ToothIcon className="size-6 shrink-0" aria-hidden="true" />
                  설정
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="size-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="grid flex-1 grid-cols-1" action="#" method="GET">
              <input 
                type="search" 
                name="search" 
                aria-label="Search" 
                className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6" 
                placeholder="문서 검색..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  filterDocuments()
                }}
              />
              <MagnifyingGlassIcon className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400" aria-hidden="true" />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">View notifications</span>
                <BellIcon className="size-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="relative flex items-center">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img className="size-8 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm/6 font-semibold text-gray-900" aria-hidden="true">개발자</span>
                    <ChevronDownIcon className="ml-2 size-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Menu.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? 'bg-gray-50 outline-hidden' : '',
                              'block px-3 py-1 text-sm/6 text-gray-900'
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Document Content */}
            {currentDocument ? (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentDocument.name}</h1>
                  <p className="text-gray-600">{currentDocument.description}</p>
                </div>
                
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                  <div className="px-6 py-8">
                    {currentDocument.content ? (
                      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: currentDocument.content }} />
                    ) : (
                      <div className="text-center py-12">
                        <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">문서 내용</h3>
                        <p className="mt-1 text-sm text-gray-500">선택된 문서의 내용이 여기에 표시됩니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Welcome Screen */
              <div className="max-w-4xl mx-auto text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h1 className="mt-2 text-3xl font-bold text-gray-900">개발 문서 사이트</h1>
                <p className="mt-1 text-sm text-gray-500">왼쪽 사이드바에서 문서를 선택하여 시작하세요.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App