'use client';

import { useState } from 'react';
import { mockPrograms, mockSubjects } from '@/lib/mockData';
import NavigationBar from '@/components/NavigationBar';
import Calendar from '@/components/Calendar';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Get upcoming programs (next 30 days)
  const getUpcomingPrograms = () => {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    return mockPrograms.filter(program => {
      const startDate = new Date(program.start_date);
      const endDate = new Date(program.end_date);
      return (startDate >= today && startDate <= next30Days) || 
             (endDate >= today && startDate <= today);
    }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  };

  // Get program statistics
  const getProgramStats = () => {
    const today = new Date();
    const activePrograms = mockPrograms.filter(program => {
      const startDate = new Date(program.start_date);
      const endDate = new Date(program.end_date);
      return startDate <= today && endDate >= today;
    });

    const upcomingPrograms = mockPrograms.filter(program => {
      const startDate = new Date(program.start_date);
      return startDate > today;
    });

    const completedPrograms = mockPrograms.filter(program => {
      const endDate = new Date(program.end_date);
      return endDate < today;
    });

    return {
      active: activePrograms.length,
      upcoming: upcomingPrograms.length,
      completed: completedPrograms.length,
      total: mockPrograms.length,
    };
  };

  const upcomingPrograms = getUpcomingPrograms();
  const stats = getProgramStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kalendar Program</h1>
            <p className="text-sm text-gray-600">Jadual dan timeline program JohorUP</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 text-sm rounded ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📅 Kalendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm rounded ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Senarai
              </button>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Program
            </button>
          </div>
        </div>
      </header>

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Program Aktif</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Program Akan Datang</p>
                <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Program Selesai</p>
                <p className="text-3xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jumlah Program</p>
                <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar/List View */}
          <div className="lg:col-span-2">
            {viewMode === 'calendar' ? (
              <Calendar />
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Senarai Program</h3>
                  <p className="text-sm text-gray-600">Semua program mengikut tarikh</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockPrograms.map((program) => {
                    const subject = mockSubjects.find(s => s.id === program.target_subject_id);
                    const startDate = new Date(program.start_date);
                    const endDate = new Date(program.end_date);
                    const today = new Date();
                    
                    let status = 'upcoming';
                    let statusColor = 'bg-blue-100 text-blue-800';
                    let statusText = 'Akan Datang';
                    
                    if (startDate <= today && endDate >= today) {
                      status = 'active';
                      statusColor = 'bg-green-100 text-green-800';
                      statusText = 'Aktif';
                    } else if (endDate < today) {
                      status = 'completed';
                      statusColor = 'bg-gray-100 text-gray-800';
                      statusText = 'Selesai';
                    }

                    return (
                      <div key={program.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-medium text-gray-900">{program.title}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                                {statusText}
                              </span>
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {program.program_type}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{program.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {subject?.name}
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {startDate.toLocaleDateString('ms-MY')} - {endDate.toLocaleDateString('ms-MY')}
                              </div>
                              {program.target_students && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                  {program.target_students} murid
                                </div>
                              )}
                            </div>
                          </div>
                          <button className="ml-4 px-3 py-2 text-sm text-blue-600 hover:text-blue-800">
                            Lihat Detail
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Upcoming Programs */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Program Akan Datang</h3>
                <p className="text-sm text-gray-600">30 hari akan datang</p>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingPrograms.slice(0, 5).map((program) => {
                  const subject = mockSubjects.find(s => s.id === program.target_subject_id);
                  const startDate = new Date(program.start_date);
                  const daysUntil = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={program.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{program.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{subject?.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-blue-600 font-medium">
                              {daysUntil > 0 ? `${daysUntil} hari lagi` : 'Bermula hari ini'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {startDate.toLocaleDateString('ms-MY')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {upcomingPrograms.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Tiada program akan datang</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Program</div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Program Aktif</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Program Akan Datang</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Program Selesai</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">▶</span>
                  <span className="text-sm text-gray-600">Tarikh Mula</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">⏹</span>
                  <span className="text-sm text-gray-600">Tarikh Tamat</span>
                </div>
                
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 mt-4">Cuti & Hari Kelepasan</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">🏛️</span>
                  <span className="text-sm text-gray-600">Cuti Umum</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">🏴</span>
                  <span className="text-sm text-gray-600">Cuti Negeri Johor</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">🏫</span>
                  <span className="text-sm text-gray-600">Cuti Sekolah</span>
                </div>
                
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 mt-4">Warna Latar</div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-3 bg-red-50 border border-red-200 rounded"></div>
                  <span className="text-sm text-gray-600">Cuti Umum</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                  <span className="text-sm text-gray-600">Cuti Johor</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-3 bg-orange-50 border border-orange-200 rounded"></div>
                  <span className="text-sm text-gray-600">Cuti Sekolah</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}