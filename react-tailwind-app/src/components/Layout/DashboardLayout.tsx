import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
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
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  BookOpenIcon,
  BellAlertIcon,
  ChartPieIcon as ChartPieIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const navigation = [
  { name: '대시보드', href: '/dashboard', icon: HomeIcon, current: true },
  { name: '공고 리스트', href: '/bid-list', icon: ClipboardDocumentListIcon, current: false },
  { name: '레퍼런스 관리', href: '/references', icon: BookOpenIcon, current: false },
  { name: '알림/리포트', href: '/notifications', icon: BellAlertIcon, current: false },
  { name: '통계/분석', href: '/statistics', icon: ChartPieIconSolid, current: false },
  { name: '통합 관리', href: '/integration', icon: Cog6ToothIconSolid, current: false },
  { name: '개인 설정', href: '/personal', icon: UsersIcon, current: false },
];

const teams = [
  { id: 1, name: '기획팀', href: '#', initial: '기', current: false },
  { id: 2, name: '사업팀', href: '#', initial: '사', current: false },
  { id: 3, name: '개발팀', href: '#', initial: '개', current: false },
];

const userNavigation = [
  { name: '내 정보', href: '#' },
  { name: '설정', href: '#' },
  { name: '로그아웃', href: '#' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // 현재 경로에 따라 네비게이션 상태 업데이트
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href
  }));

  return (
    <div className="h-full bg-background-light font-pretendard">
      <Dialog className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
        <>
          <Transition
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition>

          <div className="fixed inset-0 flex">
            <Transition
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                <>
                  <Transition
                    as={React.Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition>
                  {/* Sidebar component for mobile */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=white"
                        alt="Your Company"
                      />
                      <span className="ml-2 text-subtitle1 font-bold text-white">AI Biz Eyes</span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {updatedNavigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
                                  className={`
                                    group flex gap-x-3 rounded-5 px-2 py-2 text-body2 font-medium leading-6
                                    ${item.current
                                      ? 'bg-primary-700 text-white'
                                      : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                                    }
                                  `}
                                >
                                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-primary-200">팀</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={`
                                    group flex gap-x-3 rounded-5 px-2 py-2 text-body3 font-medium leading-6
                                    ${team.current
                                      ? 'bg-primary-700 text-white'
                                      : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                                    }
                                  `}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-body3 font-medium text-white">
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </>
              </DialogPanel>
            </Transition>
          </div>
        </>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-240 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=white"
              alt="Your Company"
            />
                            <span className="ml-2 text-subtitle1 font-bold text-white">AI Biz Eyes</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {updatedNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex gap-x-3 rounded-5 px-2 py-2 text-body2 font-medium leading-6
                          ${item.current
                            ? 'bg-primary-700 text-white'
                            : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                          }
                        `}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-primary-200">팀</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <a
                        href={team.href}
                        className={`
                          group flex gap-x-3 rounded-5 px-2 py-2 text-body3 font-medium leading-6
                          ${team.current
                            ? 'bg-primary-700 text-white'
                            : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                          }
                        `}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-body3 font-medium text-white">
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-240">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                검색
              </label>
              <MagnifyingGlassIcon
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-body2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="검색..."
                type="search"
                name="search"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">알림 보기</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">사용자 메뉴 열기</span>
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-body2 font-semibold leading-6 text-gray-900" aria-hidden="true">
                      홍길동
                    </span>
                    <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </MenuButton>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-5 bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={`
                              block px-3 py-1 text-body3 leading-6
                              ${active ? 'bg-gray-50' : ''}
                            `}
                          >
                            {item.name}
                          </a>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}