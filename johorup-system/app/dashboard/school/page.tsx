'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStats, useStudentsData, getScopeDescription } from '@/lib/useHierarchicalData';
import { mockProgramReports, mockStudentAttendance, mockProgramPhotos, mockPrograms, mockSchools } from '@/lib/mockData';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function SchoolDashboardPage() {
  const router = useRouter();
  const { data: statsData, user, loading } = useDashboardStats();
  const { data: studentsData } = useStudentsData();

  const stats = statsData?.dashboard_stats || {};
  const schoolStudents = studentsData?.students || [];

  useEffect(() => {
    // Get current user from session
    const userSession = sessionStorage.getItem('currentUser');
    if (!userSession) {
      router.push('/login');
      return;
    }

    const currentUser = JSON.parse(userSession);
    
    // Redirect non-school users
    if (currentUser.role !== 'operational_school') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'operational_school') return null;

  // Get school data
  const school = user.school_name ? { name: user.school_name } : null;
  const schoolReports = mockProgramReports.filter(r => r.school_id === user.school_id);
  
  // Calculate statistics
  const totalReports = schoolReports.length;
  const submittedReports = schoolReports.filter(r => r.status === 'submitted' || r.status === 'approved').length;
  const draftReports = schoolReports.filter(r => r.status === 'draft').length;
  const approvedReports = schoolReports.filter(r => r.status === 'approved').length;

  // Calculate attendance statistics
  const totalAttendanceRecords = mockStudentAttendance.filter(a => 
    schoolReports.some(r => r.id === a.program_report_id)
  );
  const presentCount = totalAttendanceRecords.filter(a => a.present).length;
  const attendanceRate = totalAttendanceRecords.length > 0 ? (presentCount / totalAttendanceRecords.length * 100) : 0;

  // Calculate photo statistics
  const totalPhotos = mockProgramPhotos.filter(p => 
    schoolReports.some(r => r.id === p.program_report_id)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title={`Dashboard ${school?.name || user.school_name || 'Sekolah'}`}
        subtitle={`Pengurusan Murid Terlibat dan Laporan Program - ${getScopeDescription(user.role, user)}`}
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tindakan Pantas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/dashboard/students')}
              className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div className="text-left">
                <div className="font-semibold">Senarai Nama Murid</div>
                <div className="text-sm opacity-90">Lihat data murid sekolah</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/school/progress')}
              className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="text-left">
                <div className="font-semibold">Analisis Perkembangan Murid</div>
                <div className="text-sm opacity-90">Prestasi & kemajuan murid</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/school/tuition-report')}
              className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <div className="font-semibold">Laporan</div>
                <div className="text-sm opacity-90">Laporan tuisyen & bukti</div>
              </div>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jumlah Murid</p>
                <p className="text-3xl font-bold text-gray-900">{schoolStudents.length}</p>
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
                <p className="text-sm text-gray-600">Pengisian Program</p>
                <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
                <p className="text-xs text-gray-500 mt-1">{submittedReports} dihantar</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kadar Kehadiran</p>
                <p className="text-3xl font-bold text-gray-900">{attendanceRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">{presentCount}/{totalAttendanceRecords.length} hadir</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gambar Diupload</p>
                <p className="text-3xl font-bold text-gray-900">{totalPhotos}</p>
                <p className="text-xs text-gray-500 mt-1">Dokumentasi program</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Report Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Pengisian Program</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Draf</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{ width: totalReports > 0 ? `${(draftReports / totalReports) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{draftReports}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dihantar</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: totalReports > 0 ? `${((submittedReports - approvedReports) / totalReports) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{submittedReports - approvedReports}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Diluluskan</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: totalReports > 0 ? `${(approvedReports / totalReports) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{approvedReports}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Aktif</h3>
            <div className="space-y-3">
              {mockPrograms.slice(0, 3).map(program => (
                <div key={program.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{program.title}</p>
                    <p className="text-xs text-gray-500">{program.program_type}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Pengisian Program Terkini</h3>
              <button
                onClick={() => router.push('/dashboard/school/tuition-report')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Lihat Semua
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarikh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tajuk Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru Pelaksana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schoolReports.slice(0, 5).map((report) => {
                  const getStatusBadge = (status: string) => {
                    const statusConfig = {
                      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draf' },
                      submitted: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Dihantar' },
                      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Diluluskan' },
                    };
                    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
                    return (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    );
                  };

                  return (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(report.report_date).toLocaleDateString('ms-MY')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{report.session_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{report.teacher_name}</td>
                      <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}