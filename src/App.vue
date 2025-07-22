<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <!-- Sidebar component -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                <div class="flex h-16 shrink-0 items-center">
                  <DocumentTextIcon class="h-8 w-8 text-indigo-500" />
                  <span class="ml-2 text-xl font-bold text-white">개발 문서</span>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a 
                            :href="item.href" 
                            @click.prevent="selectDocument(item)"
                            :class="[
                              item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer'
                            ]"
                          >
                            <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="text-xs/6 font-semibold text-gray-400">기술 문서</div>
                      <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <li v-for="doc in technicalDocs" :key="doc.name">
                          <a 
                            :href="doc.href" 
                            @click.prevent="selectDocument(doc)"
                            :class="[
                              doc.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer'
                            ]"
                          >
                            <DocumentIcon class="size-6 shrink-0" aria-hidden="true" />
                            <span class="truncate">{{ doc.name }}</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto">
                      <a href="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">
                        <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                        설정
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center">
          <DocumentTextIcon class="h-8 w-8 text-indigo-500" />
          <span class="ml-2 text-xl font-bold text-white">개발 문서</span>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a 
                    :href="item.href" 
                    @click.prevent="selectDocument(item)"
                    :class="[
                      item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer'
                    ]"
                  >
                    <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="text-xs/6 font-semibold text-gray-400">기술 문서</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="doc in technicalDocs" :key="doc.name">
                  <a 
                    :href="doc.href" 
                    @click.prevent="selectDocument(doc)"
                    :class="[
                      doc.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer'
                    ]"
                  >
                    <DocumentIcon class="size-6 shrink-0" aria-hidden="true" />
                    <span class="truncate">{{ doc.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <a href="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">
                <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                설정
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form class="grid flex-1 grid-cols-1" action="#" method="GET">
            <input 
              type="search" 
              name="search" 
              aria-label="Search" 
              class="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6" 
              placeholder="문서 검색..." 
              v-model="searchQuery"
              @input="filterDocuments"
            />
            <MagnifyingGlassIcon class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400" aria-hidden="true" />
          </form>
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span class="sr-only">View notifications</span>
              <BellIcon class="size-6" aria-hidden="true" />
            </button>

            <!-- Separator -->
            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="relative flex items-center">
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <img class="size-8 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm/6 font-semibold text-gray-900" aria-hidden="true">개발자</span>
                  <ChevronDownIcon class="ml-2 size-5 text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <a :href="item.href" :class="[active ? 'bg-gray-50 outline-hidden' : '', 'block px-3 py-1 text-sm/6 text-gray-900']">{{ item.name }}</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <!-- Document Content -->
          <div v-if="currentDocument" class="max-w-4xl mx-auto">
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ currentDocument.name }}</h1>
              <p class="text-gray-600">{{ currentDocument.description }}</p>
            </div>
            
            <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
              <div class="px-6 py-8">
                <div v-if="currentDocument.content" class="markdown-content" v-html="currentDocument.content"></div>
                <div v-else class="text-center py-12">
                  <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-semibold text-gray-900">문서 내용</h3>
                  <p class="mt-1 text-sm text-gray-500">선택된 문서의 내용이 여기에 표시됩니다.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Welcome Screen -->
          <div v-else class="max-w-4xl mx-auto text-center">
            <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h1 class="mt-2 text-3xl font-bold text-gray-900">개발 문서 사이트</h1>
            <p class="mt-1 text-sm text-gray-500">왼쪽 사이드바에서 문서를 선택하여 시작하세요.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
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
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

const sidebarOpen = ref(false)
const searchQuery = ref('')
const currentDocument = ref(null)

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
  currentDocument.value = doc
  
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
  console.log('Searching for:', searchQuery.value)
}

onMounted(async () => {
  // 초기 문서 선택 (대시보드)
  await selectDocument(navigation[0])
})
</script>