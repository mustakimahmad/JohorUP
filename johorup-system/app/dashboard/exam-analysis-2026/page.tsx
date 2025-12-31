'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage-auth';
import { AuditService } from '@/lib/auditService';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function ExamAnalysis2026Page() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeExam, setActiveExam] = useState<'pertengahan_tahun_2026' | 'percubaan_spm_2026' | 'spm_2026'>('pertengahan_tahun_2026');

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

      // Log access to exam analysis
      AuditService.logAction({
        user_id: user.id,
        user_email: user.email,
        user_name: user.name,
        user_role: user.role,
        action: 'VIEW',
        table_name: 'exam_analysis_2026',
        additional_info: {
          page: 'exam_analysis_2026',
          user_role: user.role,
          exam_focus: activeExam
        }
      });

      setLoading(false);
    }
  }, [router, activeExam]);

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

  const examTypes = [
    {
      key: 'pertengahan_tahun_2026',
      label: 'Pertengahan Tahun 2026',
      date: 'Jun 2026',
      status: 'upcoming',
      icon: '📝'
    },
    {
      key: 'percubaan_spm_2026',
      label: 'Percubaan SPM 2026',
      date: 'Ogos 2026',
      status: 'upcoming',
      icon: '🎯'
    },
    {
      key: 'spm_2026',
      label: 'SPM 2026',
      date: 'Oktober 2026',
      status: 'upcoming',
      icon: '🏆'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Analisis Peperiksaan 2026"
        subtitle={`Monitoring dan analisis prestasi murid untuk peperiksaan 2026 - ${user.role}`}
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Exam Type Selector */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pilih Peperiksaan 2026</h2>
            <p className="text-sm text-gray-600">Analisis prestasi murid mengikut jenis peperiksaan</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {examTypes.map((exam) => (
                <button
                  key={exam.key}
                  onClick={() => setActiveExam(exam.key as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activeExam === exam.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{exam.icon}</div>
                    <h3 className="font-semibold text-gray-900">{exam.label}</h3>
                    <p className="text-sm text-gray-600">{exam.date}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(exam.status)}`}>
                      {exam.status === 'upcoming' ? 'Akan Datang' : 
                       exam.status === 'ongoing' ? 'Sedang Berlangsung' : 'Selesai'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
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
                      Jumlah Murid Sasaran
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
                      Kadar Kelulusan Dijangka
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
                      Murid Berisiko
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
                      Pencapaian Target
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Performance */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Prestasi Mengikut Subjek</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Tiada Data Peperiksaan</h4>
                <p className="text-gray-600 mb-4">
                  Belum ada data peperiksaan {examTypes.find(e => e.key === activeExam)?.label} untuk dianalisis.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Nota:</strong> Data akan tersedia selepas peperiksaan dijalankan dan keputusan dimasukkan ke dalam sistem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* School Comparison */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Perbandingan Sekolah</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Tiada Data Perbandingan</h4>
                <p className="text-gray-600 mb-4">
                  Perbandingan prestasi sekolah akan tersedia selepas peperiksaan selesai.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Trends */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Trend Peningkatan Murid</h3>
            <p className="text-sm text-gray-600">Analisis peningkatan prestasi murid dari peperiksaan sebelumnya</p>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Analisis Trend Belum Tersedia</h4>
              <p className="text-gray-600 mb-6">
                Trend peningkatan akan dikira berdasarkan perbandingan dengan peperiksaan sebelumnya.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-600 text-2xl mb-2">📈</div>
                  <h5 className="font-semibold text-green-900">Meningkat</h5>
                  <p className="text-sm text-green-700">0 murid</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-yellow-600 text-2xl mb-2">➡️</div>
                  <h5 className="font-semibold text-yellow-900">Stabil</h5>
                  <p className="text-sm text-yellow-700">0 murid</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-red-600 text-2xl mb-2">📉</div>
                  <h5 className="font-semibold text-red-900">Menurun</h5>
                  <p className="text-sm text-red-700">0 murid</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Tindakan Diperlukan</h3>
            <p className="text-sm text-gray-600">Cadangan tindakan berdasarkan analisis prestasi</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Persiapan Peperiksaan 2026</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Pastikan semua murid mendapat sokongan yang mencukupi untuk menghadapi peperiksaan {examTypes.find(e => e.key === activeExam)?.label}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Monitoring Berterusan</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Lakukan monitoring prestasi murid secara berterusan untuk mengenal pasti murid yang memerlukan sokongan tambahan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-green-400 bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-800">Program Sokongan</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Sediakan program kelas tambahan dan bimbingan khusus untuk murid yang memerlukan sokongan tambahan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}