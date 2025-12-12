'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockDashboardStats, mockPrograms, mockBudget } from '@/lib/mockData';
import { exportStudentsToExcel, exportProgressToExcel, exportProgramSummaryToExcel } from '@/lib/excelExport';
import DashboardHeader from '@/components/DashboardHeader';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const stats = mockDashboardStats;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="JohorUP Dashboard"
        subtitle="Program Pemantauan SPM 2026"
        user={user}
        onLogout={handleLogout}
      >
        <div className="flex gap-2">
          <button 
            onClick={() => exportProgramSummaryToExcel()}
            className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
            title="Download Program Excel"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Program
          </button>
          <button 
            onClick={() => exportStudentsToExcel()}
            className="px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
            title="Download Murid Excel"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Murid
          </button>
          <button 
            onClick={() => exportProgressToExcel()}
            className="px-3 py-2 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1"
            title="Download Analisis Excel"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Analisis
          </button>
        </div>
      </DashboardHeader>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/dashboard" className="border-b-2 border-blue-600 px-3 py-4 text-sm font-medium text-blue-600">
              Dashboard
            </a>
            <a href="/dashboard/students" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Murid
            </a>
            <a href="/dashboard/programs" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Program
            </a>
            <a href="/dashboard/budget" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Kewangan
            </a>
            <a href="/dashboard/reports" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Laporan
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jumlah Murid</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_students}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Murid Disasarkan</p>
                <p className="text-3xl font-bold text-green-600">{mockPrograms.reduce((sum, p) => sum + (p.target_students || 0), 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Dalam program</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jumlah Sekolah</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_schools}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bajet Program</p>
                <p className="text-2xl font-bold text-gray-900">RM {stats.total_budget.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Digunakan: RM {stats.spent_budget.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Program Aktif</p>
                <p className="text-3xl font-bold text-gray-900">{stats.programs_count}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Perkembangan Murid</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Tingkatan 4 (Nov 2025)</span>
                  <span className="text-sm font-semibold text-gray-900">42.0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-orange-500 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: '42%' }}>
                    <span className="text-xs font-semibold text-white">42%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Pertengahan Tahun (Mei 2026)</span>
                  <span className="text-sm font-semibold text-gray-900">52.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-yellow-500 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: '52.5%' }}>
                    <span className="text-xs font-semibold text-white">52.5%</span>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-1">↑ +10.5% dari Tingkatan 4</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Percubaan SPM (Sep 2026)</span>
                  <span className="text-sm font-semibold text-gray-900">61.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: '61.8%' }}>
                    <span className="text-xs font-semibold text-white">61.8%</span>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-1">↑ +19.8% dari Tingkatan 4</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Target SPM 2026</span>
                  <span className="text-sm font-semibold text-blue-900">67.0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: '67%' }}>
                    <span className="text-xs font-semibold text-white">Target 67%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-800">
                <span className="font-semibold">Prestasi Baik!</span> Murid menunjukkan peningkatan konsisten. Teruskan program bimbingan.
              </p>
            </div>
          </div>

          {/* Passing Rate by Subject */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kadar Kelulusan Mengikut Subjek</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Bahasa Melayu</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.passing_rate.bahasa_melayu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${stats.passing_rate.bahasa_melayu}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Sejarah</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.passing_rate.sejarah}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: `${stats.passing_rate.sejarah}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Matematik</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.passing_rate.matematik}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${stats.passing_rate.matematik}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">* Berdasarkan peperiksaan akhir tingkatan 4 tahun 2025</p>
          </div>

          {/* Budget Allocation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peruntukan Bajet</h3>
            <div className="space-y-3">
              {mockBudget.map((budget) => {
                const program = mockPrograms.find(p => p.id === budget.program_id);
                return (
                  <div key={budget.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{program?.title}</p>
                      <p className="text-xs text-gray-500">{budget.status === 'approved' ? 'Diluluskan' : 'Dirancang'}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">RM {budget.amount.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Programs */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Program Terkini</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarikh Mula</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarikh Tamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{program.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{program.program_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(program.start_date).toLocaleDateString('ms-MY')}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(program.end_date).toLocaleDateString('ms-MY')}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
