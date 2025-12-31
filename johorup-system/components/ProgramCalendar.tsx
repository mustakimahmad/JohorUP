'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProgramEvents, ProgramEvent } from '@/lib/programService';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3';
  sector: string;
  color: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  type: 'milestone' | 'program';
}

const milestoneEvents: CalendarEvent[] = [
  // PHASE 1 - January to April 2026
  {
    id: '0',
    title: 'SLU Johor Academic Talent & Integrity Plus 2026 (GM)',
    description: 'Sektor Perancangan dan Pengurusan PPD - Program Academic Talent & Integrity Plus',
    startDate: '2026-01-15',
    endDate: '2026-01-15',
    phase: 'Phase 1',
    sector: 'SEKTOR PERANCANGAN DAN PENGURUSAN PPD',
    color: 'bg-yellow-200 border-yellow-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '1',
    title: 'Rekrut Koordinator Negeri & Koordinator Daerah',
    description: 'Recruitment of State and District Coordinators',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    phase: 'Phase 1',
    sector: 'SEKTOR PERANCANGAN',
    color: 'bg-yellow-200 border-yellow-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '2',
    title: 'Rekrut Penyelaras PPD, SISC+ & Guru',
    description: 'Recruitment of PPD Coordinators, SISC+ and Teachers',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    phase: 'Phase 1',
    sector: 'SEKTOR PERANCANGAN',
    color: 'bg-yellow-200 border-yellow-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '3',
    title: 'Latihan Koordinator Negeri & Daerah',
    description: 'Training for State and District Coordinators',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    phase: 'Phase 1',
    sector: 'SEKTOR PEMBELAJARAN',
    color: 'bg-green-200 border-green-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '4',
    title: 'Latihan Penyelaras PPD & SISC+',
    description: 'Training for PPD Coordinators and SISC+',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    phase: 'Phase 1',
    sector: 'SEKTOR PEMBELAJARAN',
    color: 'bg-green-200 border-green-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '5',
    title: 'Pengenalan Program & Modul PdP',
    description: 'Program Introduction and Teaching & Learning Modules',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    phase: 'Phase 1',
    sector: 'SEKTOR PEMBELAJARAN',
    color: 'bg-green-200 border-green-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '6',
    title: 'Latihan Guru dan Modul PdP',
    description: 'Teacher Training and Teaching & Learning Modules',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    phase: 'Phase 1',
    sector: 'SEKTOR PEMBELAJARAN',
    color: 'bg-green-200 border-green-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '7',
    title: 'Penetapan Program Kelas Tambahan',
    description: 'Establishment of Additional Class Programs',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    phase: 'Phase 1',
    sector: 'SEKTOR PEMBANGUNAN MURID',
    color: 'bg-orange-200 border-orange-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '8',
    title: 'Latihan Modul PdP, Kelas Tambahan & Motivasi',
    description: 'Training on Teaching Modules, Additional Classes & Motivation',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    phase: 'Phase 1',
    sector: 'SEKTOR PEMBANGUNAN MURID',
    color: 'bg-orange-200 border-orange-400',
    status: 'upcoming',
    type: 'milestone'
  },

  // PHASE 2 - May to September 2026
  {
    id: '9',
    title: 'Pelaksanaan Program Kelas Tambahan',
    description: 'Implementation of Additional Class Programs',
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    phase: 'Phase 2',
    sector: 'SEKTOR PEMBANGUNAN MURID',
    color: 'bg-blue-200 border-blue-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '10',
    title: 'Pelaksanaan Program Motivasi',
    description: 'Implementation of Motivation Programs',
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    phase: 'Phase 2',
    sector: 'SEKTOR PEMBANGUNAN MURID',
    color: 'bg-blue-200 border-blue-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '11',
    title: 'Modul Sertai Program Kerjaya',
    description: 'Career Program Participation Modules',
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    phase: 'Phase 2',
    sector: 'SEKTOR PEMBANGUNAN MURID',
    color: 'bg-blue-200 border-blue-400',
    status: 'upcoming',
    type: 'milestone'
  },

  // PHASE 3 - October 2026 to April 2027
  {
    id: '12',
    title: 'Peperiksaan Murid Disasarkan',
    description: 'Targeted Student Examinations',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    phase: 'Phase 3',
    sector: 'PENILAIAN',
    color: 'bg-purple-200 border-purple-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '13',
    title: 'Analisis Keputusan Peperiksaan',
    description: 'Analysis of Examination Results',
    startDate: '2026-12-01',
    endDate: '2027-01-31',
    phase: 'Phase 3',
    sector: 'PENILAIAN',
    color: 'bg-purple-200 border-purple-400',
    status: 'upcoming',
    type: 'milestone'
  },
  {
    id: '14',
    title: 'Penyediaan Laporan Akhir',
    description: 'Preparation of Final Report',
    startDate: '2027-02-01',
    endDate: '2027-04-30',
    phase: 'Phase 3',
    sector: 'PELAPORAN',
    color: 'bg-red-200 border-red-400',
    status: 'upcoming',
    type: 'milestone'
  }
];

export default function ProgramCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'month' | 'timeline'>('month');
  const [showType, setShowType] = useState<'all' | 'milestones' | 'programs'>('all');
  const [user, setUser] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Combine milestone events and program events
    const programEvents = getProgramEvents();
    const combinedEvents: CalendarEvent[] = [
      ...milestoneEvents,
      ...programEvents.map(event => ({
        ...event,
        type: 'program' as const
      }))
    ];
    setAllEvents(combinedEvents);
  }, []);

  const getFilteredEvents = () => {
    if (showType === 'milestones') {
      return allEvents.filter(event => event.type === 'milestone');
    }
    if (showType === 'programs') {
      return allEvents.filter(event => event.type === 'program');
    }
    return allEvents;
  };

  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ];

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const filteredEvents = getFilteredEvents();
    return filteredEvents.filter(event => {
      return dateStr >= event.startDate && dateStr <= event.endDate;
    });
  };

  const getEventsForMonth = (month: number, year: number) => {
    const filteredEvents = getFilteredEvents();
    return filteredEvents.filter(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      return (startDate <= monthEnd && endDate >= monthStart);
    });
  };

  const renderCalendarGrid = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayEvents = getEventsForDate(current);
      const isCurrentMonth = current.getMonth() === selectedMonth;
      const isToday = current.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={current.toISOString()}
          className={`min-h-[100px] p-2 border border-gray-200 ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
          } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
          } ${isToday ? 'text-blue-600' : ''}`}>
            {current.getDate()}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border-l-2 ${event.color} truncate relative`}
                title={`${event.type === 'program' ? '📋 Program' : '🎯 Milestone'}: ${event.description}`}
              >
                <span className="text-xs opacity-75 mr-1">
                  {event.type === 'program' ? '📋' : '🎯'}
                </span>
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} lagi
              </div>
            )}
          </div>
        </div>
      );
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const renderTimelineView = () => {
    const phases = ['Phase 1', 'Phase 2', 'Phase 3'];
    const filteredEvents = getFilteredEvents();
    
    return (
      <div className="space-y-6">
        {phases.map(phase => {
          const phaseEvents = filteredEvents.filter(event => event.phase === phase);
          return (
            <Card key={phase}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {phase === 'Phase 1' && '📋 Phase 1: Persiapan & Latihan (Jan - Apr 2026)'}
                  {phase === 'Phase 2' && '🚀 Phase 2: Pelaksanaan Program (Mei - Sep 2026)'}
                  {phase === 'Phase 3' && '📊 Phase 3: Penilaian & Pelaporan (Okt 2026 - Apr 2027)'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phaseEvents.map(event => (
                    <div key={event.id} className={`p-4 rounded-lg border-l-4 ${event.color}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">
                              {event.type === 'program' ? '📋 Program' : '🎯 Milestone'}
                            </span>
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>📅 {new Date(event.startDate).toLocaleDateString('ms-MY')} - {new Date(event.endDate).toLocaleDateString('ms-MY')}</span>
                            <span>🏢 {event.sector}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                          event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {event.status === 'upcoming' ? 'Akan Datang' :
                           event.status === 'ongoing' ? 'Sedang Berjalan' : 'Selesai'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kalendar Program</h1>
          <p className="text-gray-600 mt-1">Carta Perbatuan & Milestone Program 3 Fasa</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 Kalendar
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Timeline
          </button>
          <div className="border-l border-gray-300 mx-2"></div>
          <button
            onClick={() => setShowType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              showType === 'all' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔄 Semua
          </button>
          <button
            onClick={() => setShowType('milestones')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              showType === 'milestones' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎯 Milestone
          </button>
          <button
            onClick={() => setShowType('programs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              showType === 'programs' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Program
          </button>
        </div>
      </div>

      {/* Program Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">Phase 1</div>
            <div className="text-sm text-gray-600">Jan - Apr 2026</div>
            <div className="text-xs text-gray-500 mt-1">Persiapan & Latihan</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">Phase 2</div>
            <div className="text-sm text-gray-600">Mei - Sep 2026</div>
            <div className="text-xs text-gray-500 mt-1">Pelaksanaan Program</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">Phase 3</div>
            <div className="text-sm text-gray-600">Okt 2026 - Apr 2027</div>
            <div className="text-xs text-gray-500 mt-1">Penilaian & Pelaporan</div>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'month' ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">
                {months[selectedMonth]} {selectedYear}
              </CardTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    setSelectedMonth(new Date().getMonth());
                    setSelectedYear(new Date().getFullYear());
                  }}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm"
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  →
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 border border-gray-200">
              {renderCalendarGrid()}
            </div>
          </CardContent>
        </Card>
      ) : (
        renderTimelineView()
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Legenda Sektor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
              <span className="text-sm">Sektor Perancangan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
              <span className="text-sm">Sektor Pembelajaran</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-200 border border-orange-400 rounded"></div>
              <span className="text-sm">Sektor Pembangunan Murid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
              <span className="text-sm">Penilaian</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}