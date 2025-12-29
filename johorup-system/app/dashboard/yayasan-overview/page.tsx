'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage-auth';
import { mockDashboardStats } from '@/lib/mockData';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function YayasanOverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Enhanced statistics for Yayasan JCorp
  const [yayasanStats] = useState({
    ...mockDashboardStats,
    totalInvestment: 450000, // RM 450,000 investment
    programROI: 85.7, // Return on Investment percentage
    beneficiarySchools: 20,
    totalTeachers: 120,
    programDuration: 18, // months
    successRate: 67.3, // percentage of students who improved
    partnershipSince: '2024',
    impactMetrics: {
      studentsImproved: 589,
      teachersUpskilled: 120,
      schoolsTransformed: 20,
      communityReach: 15000
    },
    financialBreakdown: {
      teacherTraining: 150000,
      studentPrograms: 200000,
      infrastructure: 60000,
      monitoring: 40000
    },
    regionalImpact: [
      { ppd: 'PPD Johor Bahru', schools: 8, students: 352, improvement: 72.1 },
      { ppd: 'PPD Muar', schools: 6, students: 264, improvement: 65.8 },
      { ppd: 'PPD Batu Pahat', schools: 6, students: 264, improvement: 63.9 }
    ],
    phaseProgress: [
      { 
        phase: 'Fasa 1', 
        period: 'Jan 2026 - Apr 2026',
        endDate: '30 April 2026',
        target: 30, 
        achieved: 28.5, 
        budget: 150000,
        status: 'Dalam Pelaksanaan',
        milestones: [
          'Latihan guru peringkat awal',
          'Penyediaan bahan pembelajaran',
          'Pelaksanaan program tuisyen'
        ]
      },
      { 
        phase: 'Fasa 2', 
        period: 'Mei 2026 - Sep 2026',
        endDate: '30 September 2026',
        target: 60, 
        achieved: 0, 
        budget: 200000,
        status: 'Belum Bermula',
        milestones: [
          'Pemantauan dan penilaian',
          'Penambahbaikan program',
          'Latihan lanjutan guru'
        ]
      },
      { 
        phase: 'Fasa 3', 
        period: 'Okt 2026 - Apr 2027',
        endDate: '30 April 2027',
        target: 100, 
        achieved: 0, 
        budget: 100000,
        status: 'Belum Bermula',
        milestones: [
          'Penilaian akhir program',
          'Laporan impak keseluruhan',
          'Cadangan kesinambungan'
        ]
      }
    ]
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
      
      // Only allow Yayasan JCorp role
      if (user.role !== 'yayasan_jcorp') {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user || user.role !== 'yayasan_jcorp') return null;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `RM ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `RM ${(amount / 1000).toFixed(0)}K`;
    } else {
      return `RM ${amount.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Yayasan JCorp - Gambaran Keseluruhan Program"
        subtitle="Pemantauan strategik dan impak program JohorUP"
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{formatCurrency(yayasanStats.totalInvestment)}</p>
              <p className="text-sm opacity-90">Jumlah Pelaburan</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{yayasanStats.beneficiarySchools}</p>
              <p className="text-sm opacity-90">Sekolah Benefisiari</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{yayasanStats.total_students.toLocaleString()}</p>
              <p className="text-sm opacity-90">Murid Terlibat</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{yayasanStats.successRate}%</p>
              <p className="text-sm opacity-90">Kadar Kejayaan</p>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROI Program</p>
                <p className="text-3xl font-bold text-green-600">{yayasanStats.programROI}%</p>
                <p className="text-xs text-gray-500 mt-1">Return on Investment</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Murid Diperbaiki</p>
                <p className="text-3xl font-bold text-blue-600">{yayasanStats.impactMetrics.studentsImproved}</p>
                <p className="text-xs text-gray-500 mt-1">Prestasi meningkat</p>
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
                <p className="text-sm text-gray-600">Guru Dilatih</p>
                <p className="text-3xl font-bold text-purple-600">{yayasanStats.impactMetrics.teachersUpskilled}</p>
                <p className="text-xs text-gray-500 mt-1">Kemahiran ditingkat</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jangkauan Komuniti</p>
                <p className="text-3xl font-bold text-orange-600">{yayasanStats.impactMetrics.communityReach.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Ahli keluarga terlibat</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v2c0 .656.126 1.283.356 1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown and Regional Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Financial Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pecahan Pelaburan</h3>
            <div className="space-y-4">
              {Object.entries(yayasanStats.financialBreakdown).map(([category, amount]) => {
                const percentage = (amount / yayasanStats.totalInvestment * 100).toFixed(1);
                const categoryNames: {[key: string]: string} = {
                  teacherTraining: 'Latihan Guru',
                  studentPrograms: 'Program Murid',
                  infrastructure: 'Infrastruktur',
                  monitoring: 'Pemantauan'
                };
                
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{categoryNames[category]}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(amount)} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regional Impact */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Impak Mengikut Wilayah</h3>
            <div className="space-y-4">
              {yayasanStats.regionalImpact.map((region, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{region.ppd}</p>
                      <p className="text-sm text-gray-600">{region.schools} sekolah | {region.students} murid</p>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{region.improvement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${region.improvement}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Progress Tracking */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Penjejakan Kemajuan Mengikut Fasa</h3>
          <div className="space-y-6">
            {yayasanStats.phaseProgress.map((phase, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{phase.phase}</h4>
                    <p className="text-sm text-gray-600">{phase.period}</p>
                    <p className="text-xs text-gray-500">Tamat: {phase.endDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{phase.achieved}%</p>
                    <p className="text-sm text-gray-600">daripada {phase.target}%</p>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      phase.status === 'Dalam Pelaksanaan' 
                        ? 'bg-blue-100 text-blue-800' 
                        : phase.status === 'Selesai'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Kemajuan</span>
                    <span>{formatCurrency(phase.budget)} diperuntukkan</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        phase.status === 'Dalam Pelaksanaan' 
                          ? 'bg-blue-600' 
                          : phase.status === 'Selesai'
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${(phase.achieved / phase.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Pencapaian Utama:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {phase.milestones.map((milestone, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className={`mr-2 ${
                          phase.status === 'Dalam Pelaksanaan' 
                            ? 'text-blue-500' 
                            : phase.status === 'Selesai'
                            ? 'text-green-500'
                            : 'text-gray-400'
                        }`}>
                          {phase.status === 'Selesai' ? '✓' : phase.status === 'Dalam Pelaksanaan' ? '→' : '○'}
                        </span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Cadangan Strategik</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">Kekuatan Program</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  ROI program mencapai 85.7% - melebihi jangkaan
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  589 murid menunjukkan peningkatan prestasi
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Semua 120 guru telah menerima latihan
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Jangkauan komuniti mencapai 15,000 ahli keluarga
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-3">Peluang Penambahbaikan</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  Fokus tambahan untuk PPD Batu Pahat (63.9%)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  Perluas program ke sekolah luar bandar
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  Tingkatkan penggunaan teknologi dalam pembelajaran
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  Kembangkan program mentor sebaya
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}