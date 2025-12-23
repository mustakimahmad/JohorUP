'use client';

import { useState } from 'react';
import { mockPrograms, mockSubjects } from '@/lib/mockData';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'start' | 'end' | 'ongoing' | 'holiday' | 'school_holiday';
  program?: any;
  color: string;
}

interface SchoolHoliday {
  date: string;
  title: string;
  type: 'public' | 'school' | 'johor';
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Kalendar Persekolahan Malaysia & Johor 2025/2026
  const schoolHolidays: SchoolHoliday[] = [
    // 2025 Public Holidays
    { date: '2025-01-01', title: 'Tahun Baru', type: 'public' },
    { date: '2025-01-29', title: 'Tahun Baru Cina', type: 'public' },
    { date: '2025-01-30', title: 'Tahun Baru Cina (Hari Kedua)', type: 'public' },
    { date: '2025-02-01', title: 'Wilayah Persekutuan', type: 'public' },
    { date: '2025-03-31', title: 'Hari Raya Puasa', type: 'public' },
    { date: '2025-04-01', title: 'Hari Raya Puasa (Hari Kedua)', type: 'public' },
    { date: '2025-05-01', title: 'Hari Pekerja', type: 'public' },
    { date: '2025-05-12', title: 'Hari Wesak', type: 'public' },
    { date: '2025-06-02', title: 'Hari Keputeraan YDPA', type: 'public' },
    { date: '2025-06-07', title: 'Hari Raya Haji', type: 'public' },
    { date: '2025-08-31', title: 'Hari Kebangsaan', type: 'public' },
    { date: '2025-09-16', title: 'Hari Malaysia', type: 'public' },
    { date: '2025-10-20', title: 'Deepavali', type: 'public' },
    { date: '2025-12-25', title: 'Hari Krismas', type: 'public' },

    // Johor State Holidays
    { date: '2025-03-23', title: 'Hari Keputeraan Sultan Johor', type: 'johor' },
    { date: '2025-07-30', title: 'Hari Hol Almarhum Sultan Iskandar', type: 'johor' },

    // 2026 Public Holidays
    { date: '2026-01-01', title: 'Tahun Baru', type: 'public' },
    { date: '2026-01-17', title: 'Tahun Baru Cina', type: 'public' },
    { date: '2026-02-01', title: 'Wilayah Persekutuan', type: 'public' },
    { date: '2026-03-20', title: 'Hari Raya Puasa (Anggaran)', type: 'public' },
    { date: '2026-03-21', title: 'Hari Raya Puasa (Hari Kedua)', type: 'public' },
    { date: '2026-05-01', title: 'Hari Pekerja', type: 'public' },
    { date: '2026-05-26', title: 'Hari Raya Haji (Anggaran)', type: 'public' },
    { date: '2026-06-01', title: 'Hari Keputeraan YDPA', type: 'public' },
    { date: '2026-08-31', title: 'Hari Kebangsaan', type: 'public' },
    { date: '2026-09-16', title: 'Hari Malaysia', type: 'public' },
    { date: '2026-12-25', title: 'Hari Krismas', type: 'public' },

    // Johor 2026
    { date: '2026-03-23', title: 'Hari Keputeraan Sultan Johor', type: 'johor' },
    { date: '2026-07-30', title: 'Hari Hol Almarhum Sultan Iskandar', type: 'johor' },

    // Cuti Sekolah 2025
    { date: '2025-03-15', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2025-03-16', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2025-03-17', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2025-03-18', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2025-03-19', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2025-03-20', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2025-03-21', title: 'Cuti Pertengahan Penggal 1', type: 'school' },

    { date: '2025-05-26', title: 'Cuti Pertengahan Tahun', type: 'school' },
    { date: '2025-05-27', title: 'Cuti Pertengahan Tahun', type: 'school' },
    { date: '2025-05-28', title: 'Cuti Pertengahan Tahun', type: 'school' },
    { date: '2025-05-29', title: 'Cuti Pertengahan Tahun', type: 'school' },
    { date: '2025-05-30', title: 'Cuti Pertengahan Tahun', type: 'school' },

    { date: '2025-08-18', title: 'Cuti Pertengahan Penggal 2', type: 'school' },
    { date: '2025-08-19', title: 'Cuti Pertengahan Penggal 2', type: 'school' },
    { date: '2025-08-20', title: 'Cuti Pertengahan Penggal 2', type: 'school' },
    { date: '2025-08-21', title: 'Cuti Pertengahan Penggal 2', type: 'school' },
    { date: '2025-08-22', title: 'Cuti Pertengahan Penggal 2', type: 'school' },

    { date: '2025-11-22', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-11-23', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-11-24', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-11-25', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-11-26', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-11-27', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-11-28', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-11-29', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-11-30', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-01', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-02', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-03', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-04', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-05', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-06', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-07', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-08', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-09', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-10', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-11', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-12', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-13', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-14', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-15', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-16', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-17', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-18', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-19', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-20', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-21', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-22', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-23', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-24', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-26', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-27', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-28', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-29', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-30', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2025-12-31', title: 'Cuti Akhir Tahun', type: 'school' },

    // Cuti Sekolah 2026
    { date: '2026-01-02', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2026-01-03', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2026-01-04', title: 'Cuti Akhir Tahun', type: 'school' },
    { date: '2026-01-05', title: 'Cuti Akhir Tahun', type: 'school' },

    { date: '2026-03-09', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2026-03-10', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2026-03-11', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2026-03-12', title: 'Cuti Pertengahan Penggal 1', type: 'school' },
    { date: '2026-03-13', title: 'Cuti Pertengahan Penggal 1', type: 'school' },

    { date: '2026-05-25', title: 'Cuti Pertengahan Tahun', type: 'school' },
    { date: '2026-05-26', title: 'Cuti Pertengahan Tahun', type: 'school' },
    { date: '2026-05-27', title: 'Cuti Pertengahan Tahun', type: 'school' },
    { date: '2026-05-28', title: 'Cuti Pertengahan Tahun', type: 'school' },
    { date: '2026-05-29', title: 'Cuti Pertengahan Tahun', type: 'school' },

    { date: '2026-08-17', title: 'Cuti Pertengahan Penggal 2', type: 'school' },
    { date: '2026-08-18', title: 'Cuti Pertengahan Penggal 2', type: 'school' },
    { date: '2026-08-19', title: 'Cuti Pertengahan Penggal 2', type: 'school' },
    { date: '2026-08-20', title: 'Cuti Pertengahan Penggal 2', type: 'school' },
    { date: '2026-08-21', title: 'Cuti Pertengahan Penggal 2', type: 'school' },

    // SPM 2026 Period (Oktober - November)
    { date: '2026-10-05', title: 'Peperiksaan SPM Bermula', type: 'school' },
    { date: '2026-11-26', title: 'Peperiksaan SPM Tamat', type: 'school' },
  ];

  // Get holiday for a specific date
  const getHolidayForDate = (date: Date): SchoolHoliday | null => {
    const dateStr = date.toISOString().split('T')[0];
    return schoolHolidays.find(holiday => holiday.date === dateStr) || null;
  };

  // Generate calendar events from programs
  const generateEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];

    // Add program events
    mockPrograms.forEach((program, index) => {
      const startDate = new Date(program.start_date);
      const endDate = new Date(program.end_date);
      const color = colors[index % colors.length];

      // Start event
      events.push({
        id: program.id * 10 + 1,
        title: `Mula: ${program.title}`,
        date: program.start_date,
        type: 'start',
        program,
        color,
      });

      // End event
      events.push({
        id: program.id * 10 + 2,
        title: `Tamat: ${program.title}`,
        date: program.end_date,
        type: 'end',
        program,
        color,
      });
    });

    // Add holiday events
    schoolHolidays.forEach((holiday, index) => {
      let color = 'bg-red-400';
      if (holiday.type === 'school') color = 'bg-orange-400';
      if (holiday.type === 'johor') color = 'bg-blue-400';

      events.push({
        id: 10000 + index,
        title: holiday.title,
        date: holiday.date,
        type: 'holiday',
        color,
      });
    });

    return events;
  };

  const events = generateEvents();

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Check if a program is ongoing on a specific date
  const isProgramOngoing = (date: Date, program: any): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr >= program.start_date && dateStr <= program.end_date;
  };

  // Get ongoing programs for a date
  const getOngoingPrograms = (date: Date) => {
    return mockPrograms.filter(program => isProgramOngoing(date, program));
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const dayEvents = getEventsForDate(date);
      const ongoingPrograms = getOngoingPrograms(date);
      const holiday = getHolidayForDate(date);

      days.push({
        date,
        isCurrentMonth,
        isToday,
        events: dayEvents,
        ongoingPrograms,
        holiday,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ];

  const dayNames = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <p className="text-sm text-gray-600">Kalendar Program JohorUP</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Hari Ini
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            let dayBgClass = '';
            let dayTextClass = '';
            
            // Holiday styling
            if (day.holiday) {
              if (day.holiday.type === 'public') {
                dayBgClass = 'bg-red-50 border-red-200';
                dayTextClass = 'text-red-700';
              } else if (day.holiday.type === 'johor') {
                dayBgClass = 'bg-blue-50 border-blue-200';
                dayTextClass = 'text-blue-700';
              } else if (day.holiday.type === 'school') {
                dayBgClass = 'bg-orange-50 border-orange-200';
                dayTextClass = 'text-orange-700';
              }
            }
            
            // Override for today
            if (day.isToday) {
              dayBgClass = 'bg-blue-100 border-blue-300';
              dayTextClass = 'text-blue-800';
            }
            
            // Override for non-current month
            if (!day.isCurrentMonth) {
              dayBgClass = 'bg-gray-50';
              dayTextClass = 'text-gray-400';
            }

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border rounded cursor-pointer hover:bg-gray-100 transition-colors ${dayBgClass} ${
                  !dayBgClass ? 'border-gray-200' : ''
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className={`text-sm font-medium mb-1 ${dayTextClass || (day.isToday ? 'text-blue-600' : '')}`}>
                  {day.date.getDate()}
                  {day.holiday && (
                    <span className="ml-1">
                      {day.holiday.type === 'public' ? '🏛️' : 
                       day.holiday.type === 'johor' ? '🏴' : 
                       day.holiday.type === 'school' ? '🏫' : ''}
                    </span>
                  )}
                </div>
                
                {/* Holiday indicator */}
                {day.holiday && (
                  <div className={`text-xs px-1 py-0.5 rounded mb-1 truncate ${
                    day.holiday.type === 'public' ? 'bg-red-100 text-red-700' :
                    day.holiday.type === 'johor' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`} title={day.holiday.title}>
                    {day.holiday.title}
                  </div>
                )}
                
                {/* Program Events */}
                <div className="space-y-1">
                  {day.events.filter(e => e.type !== 'holiday').slice(0, day.holiday ? 1 : 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded text-white truncate ${event.color}`}
                      title={event.title}
                    >
                      {event.type === 'start' ? '▶' : event.type === 'end' ? '⏹' : ''} {event.program?.title}
                    </div>
                  ))}
                  
                  {/* Ongoing programs indicator */}
                  {day.ongoingPrograms.length > 0 && day.events.filter(e => e.type !== 'holiday').length === 0 && !day.holiday && (
                    <div className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded truncate">
                      {day.ongoingPrograms.length} program aktif
                    </div>
                  )}
                  
                  {/* More events indicator */}
                  {(day.events.filter(e => e.type !== 'holiday').length + day.ongoingPrograms.length) > (day.holiday ? 1 : 2) && (
                    <div className="text-xs text-gray-500">
                      +{(day.events.filter(e => e.type !== 'holiday').length + day.ongoingPrograms.length) - (day.holiday ? 1 : 2)} lagi
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString('ms-MY', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          <div className="space-y-4">
            {/* Events for selected date */}
            {getEventsForDate(selectedDate).map((event) => {
              const subject = mockSubjects.find(s => s.id === event.program.target_subject_id);
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-white rounded border">
                  <div className={`w-3 h-3 rounded-full ${event.color} mt-1`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {event.type === 'start' ? '🚀 Bermula' : '🏁 Tamat'}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {event.program.program_type}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900">{event.program.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.program.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>📚 {subject?.name}</span>
                      <span>📅 {new Date(event.program.start_date).toLocaleDateString('ms-MY')} - {new Date(event.program.end_date).toLocaleDateString('ms-MY')}</span>
                      {event.program.target_students && (
                        <span>👥 {event.program.target_students} murid</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Ongoing programs */}
            {getOngoingPrograms(selectedDate).filter(program => 
              !getEventsForDate(selectedDate).some(event => event.program.id === program.id)
            ).map((program) => {
              const subject = mockSubjects.find(s => s.id === program.target_subject_id);
              return (
                <div key={program.id} className="flex items-start gap-3 p-3 bg-white rounded border">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">⚡ Sedang Berlangsung</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        {program.program_type}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900">{program.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>📚 {subject?.name}</span>
                      <span>📅 {new Date(program.start_date).toLocaleDateString('ms-MY')} - {new Date(program.end_date).toLocaleDateString('ms-MY')}</span>
                      {program.target_students && (
                        <span>👥 {program.target_students} murid</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* No events */}
            {getEventsForDate(selectedDate).length === 0 && getOngoingPrograms(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Tiada program pada tarikh ini</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}