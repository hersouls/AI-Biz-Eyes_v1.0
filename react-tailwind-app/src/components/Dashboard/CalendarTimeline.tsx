import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import clsx from 'clsx';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'presentation' | 'opening' | 'urgent';
  time?: string;
  institution?: string;
}

const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'IoT 시스템 구축 마감',
    date: '2024-01-25',
    type: 'deadline',
    time: '18:00',
    institution: '중소벤처기업부'
  },
  {
    id: '2',
    title: 'AI 플랫폼 개발 설명회',
    date: '2024-01-28',
    type: 'presentation',
    time: '14:00',
    institution: '과학기술정보통신부'
  },
  {
    id: '3',
    title: '보안 솔루션 개찰',
    date: '2024-01-30',
    type: 'opening',
    time: '10:00',
    institution: '국가정보원'
  },
  {
    id: '4',
    title: '스마트시티 긴급공고',
    date: '2024-01-26',
    type: 'urgent',
    time: '09:00',
    institution: '국토교통부'
  }
];

const todayEvents = events.filter(event => {
  const today = new Date();
  const eventDate = parseISO(event.date);
  return eventDate.toDateString() === today.toDateString();
});

const upcomingEvents = events
  .filter(event => {
    const today = new Date();
    const eventDate = parseISO(event.date);
    return eventDate > today;
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 5);

const getEventTypeStyle = (type: string) => {
  switch (type) {
    case 'deadline':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'presentation':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'opening':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'urgent':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'deadline':
      return <AlertTriangle className="h-4 w-4" />;
          case 'presentation':
      case 'opening':
        return <CalendarDays className="h-4 w-4" />;
      case 'urgent':
        return <Clock className="h-4 w-4" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
  }
};

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hasEvent = (date: Date) => {
    return events.some(event => {
      const eventDate = parseISO(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventCount = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return eventDate.toDateString() === date.toDateString();
    }).length;
  };

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1 rounded hover:bg-gray-100"
          >
                            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1 rounded hover:bg-gray-100"
          >
                            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={clsx(
              'aspect-square flex items-center justify-center text-sm relative',
              !isSameMonth(day, currentDate) && 'text-gray-300',
              isToday(day) && 'bg-blue-600 text-white rounded-full',
              hasEvent(day) && !isToday(day) && 'bg-blue-50 rounded-full'
            )}
          >
            {format(day, 'd')}
            {hasEvent(day) && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                {getEventCount(day) > 1 && (
                  <div className="text-xs text-red-600 font-medium">
                    +{getEventCount(day) - 1}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CalendarTimeline() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mini Calendar */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
            일정 캘린더
          </h3>
        </div>
        <MiniCalendar />
        <div className="px-6 py-3 bg-gray-50">
          <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
            일정 추가
          </button>
        </div>
      </div>

      {/* Today's Events and Upcoming */}
      <div className="space-y-6">
        {/* Today's Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              오늘의 일정
            </h3>
          </div>
          <div className="p-6">
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div key={event.id} className={`p-3 rounded-lg border ${getEventTypeStyle(event.type)}`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        {event.institution && (
                          <p className="text-xs opacity-75 mt-1">{event.institution}</p>
                        )}
                        {event.time && (
                          <p className="text-xs opacity-75 mt-1">{event.time}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">
                오늘 예정된 일정이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-purple-600" />
              다가오는 일정
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getEventTypeStyle(event.type)}`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      {event.institution && (
                        <p className="text-xs text-gray-500">{event.institution}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {format(parseISO(event.date), 'M월 d일', { locale: ko })}
                    </p>
                    {event.time && (
                      <p className="text-xs text-gray-500">{event.time}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              전체 일정 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}