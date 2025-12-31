'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage-auth';
import { AuditService } from '@/lib/auditService';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function StudentProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'academic' | 'behavioral' | 'cocurricular'>('overview');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
      
      // Only allow SPB and SPM access
      if (user.role !== 'admin_spb' && user.role !== 'admin_spm') {
        router.push('/dashboard');
        return;
      }

      // Log access to student progress
      AuditService.logAction({
        user_id: user.id,
        user_email: user.email,
        user_name: user.name,
        user_role: user.role,
        action: 'VIEW',
        table_name: 'student_progress',
        additional_info: {
          page: 'student_progress',
          user_role: user.role,
          view_type: selectedView
        }
      });

      setLoading(false);
    }
  }, [router, selectedView]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!user || (user.role !== 'admin_spb' && user.role !== 'admin_spm')) return null;

  const viewOptions = [
    { key: 'overview', label: 'Gambaran Keseluruhan', icon: '📊' },
    { key: 'academic', label: 'Prestasi Akademik', icon: '📚' },
    { key: 'behavioral', label: 'Perkembangan Tingkah Laku', icon: '🌟' },
    { key: 'cocurricular', label: 'Aktiviti Kokurikulum', icon: '🏆' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Perkembangan Murid"
        subtitle={`Monitoring holistik perkembangan murid - ${user.role}`}
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Selector */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Aspek Perkembangan</h2>
            <p className="text-sm text-gray-600">Pilih aspek perkembangan murid untuk dianalisis</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {viewOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSelectedView(option.key as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedView === option.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-sm">{option.label}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Jumlah Murid Dipantau
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">📈</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Prestasi Meningkat
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">⚠️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Perlu Perhatian
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🎯</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Skor Keseluruhan
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0/100
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Based on Selected View */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Progress Chart */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Trend Perkembangan Keseluruhan</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Tiada Data Perkembangan</h4>
                  <p className="text-gray-600">
                    Belum ada data perkembangan murid untuk dipaparkan.
                  </p>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Murid Berprestasi Tinggi</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Tiada Data Prestasi</h4>
                  <p className="text-gray-600">
                    Senarai murid berprestasi tinggi akan dipaparkan di sini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'academic' && (
          <div className="space-y-8">
            {/* Academic Performance Overview */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Prestasi Akademik Mengikut Subjek</h3>
                <p className="text-sm text-gray-600">Analisis prestasi murid dalam setiap subjek</p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Analisis Akademik</h4>
                  <p className="text-gray-600 mb-6">
                    Data prestasi akademik murid akan dipaparkan selepas peperiksaan dijalankan.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900">Bahasa Melayu</h5>
                      <p className="text-2xl font-bold text-blue-600">0%</p>
                      <p className="text-sm text-blue-700">Kadar Lulus</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-900">Matematik</h5>
                      <p className="text-2xl font-bold text-green-600">0%</p>
                      <p className="text-sm text-green-700">Kadar Lulus</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-900">Sejarah</h5>
                      <p className="text-2xl font-bold text-purple-600">0%</p>
                      <p className="text-sm text-purple-700">Kadar Lulus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Readiness 2026 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Kesediaan Peperiksaan 2026</h3>
                <p className="text-sm text-gray-600">Penilaian kesediaan murid untuk menghadapi peperiksaan 2026</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 text-xl">📝</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Pertengahan Tahun 2026</h4>
                    <p className="text-sm text-gray-600 mb-2">Jun 2026</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">0% Siap</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-yellow-600 text-xl">🎯</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Percubaan SPM 2026</h4>
                    <p className="text-sm text-gray-600 mb-2">Ogos 2026</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">0% Siap</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 text-xl">🏆</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">SPM 2026</h4>
                    <p className="text-sm text-gray-600 mb-2">Oktober 2026</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">0% Siap</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'behavioral' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Perkembangan Tingkah Laku dan Disiplin</h3>
              <p className="text-sm text-gray-600">Monitoring aspek tingkah laku, disiplin, dan kemahiran sosial murid</p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Penilaian Tingkah Laku</h4>
                <p className="text-gray-600 mb-6">
                  Data perkembangan tingkah laku dan disiplin murid akan direkodkan dan dianalisis di sini.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-semibold text-green-900">Kehadiran</h5>
                    <p className="text-2xl font-bold text-green-600">0%</p>
                    <p className="text-sm text-green-700">Purata</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-900">Disiplin</h5>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-blue-700">Kes Disiplin</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h5 className="font-semibold text-purple-900">Kepimpinan</h5>
                    <p className="text-2xl font-bold text-purple-600">0/10</p>
                    <p className="text-sm text-purple-700">Skor</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h5 className="font-semibold text-yellow-900">Kerjasama</h5>
                    <p className="text-2xl font-bold text-yellow-600">0/10</p>
                    <p className="text-sm text-yellow-700">Skor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'cocurricular' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Aktiviti Kokurikulum dan Pencapaian</h3>
              <p className="text-sm text-gray-600">Penyertaan dan pencapaian murid dalam aktiviti kokurikulum</p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Aktiviti Kokurikulum</h4>
                <p className="text-gray-600 mb-6">
                  Rekod penyertaan dan pencapaian murid dalam aktiviti kokurikulum akan dipaparkan di sini.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h5 className="font-semibold text-orange-900">Sukan</h5>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-orange-700">Penyertaan</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h5 className="font-semibold text-indigo-900">Kelab & Persatuan</h5>
                    <p className="text-2xl font-bold text-indigo-600">0</p>
                    <p className="text-sm text-indigo-700">Penyertaan</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <h5 className="font-semibold text-pink-900">Pencapaian</h5>
                    <p className="text-2xl font-bold text-pink-600">0</p>
                    <p className="text-sm text-pink-700">Anugerah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}