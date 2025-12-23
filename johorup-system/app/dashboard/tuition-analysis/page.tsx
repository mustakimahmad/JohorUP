'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockSchools, mockTeachers, mockSubjects, mockPPDs } from '@/lib/mockData';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function TuitionAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedPPD, setSelectedPPD] = useState<number>(0);
  const [selectedSchool, setSelectedSchool] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  // Mock data for analysis
  const [analysisData] = useState({
    totalReports: 156,
    totalSessions: 324,
    totalStudentsParticipated: 2847,
    averageAttendanceRate: 87.3,
    reportsByMonth: [
      { month: 'Jan 2026', reports: 28, sessions: 65, attendance: 89.2 },
      { month: 'Feb 2026', reports: 32, sessions: 78, attendance: 85.7 },
      { month: 'Mar 2026', reports: 29, sessions: 71, attendance: 88.1 },
      { month: 'Apr 2026', reports: 35, sessions: 82, attendance: 86.9 },
      { month: 'Mei 2026', reports: 32, sessions: 28, attendance: 89.5 },
    ],
    schoolPerformance: mockSchools.map(school => ({
      ...school,
      totalReports: Math.floor(Math.random() * 20) + 5,
      totalSessions: Math.floor(Math.random() * 40) + 15,
      averageAttendance: Math.floor(Math.random() * 20) + 75,
      activeTeachers: mockTeachers.filter(t => t.school_id === school.id).length,
      lastReportDate: '2026-05-15'
    })),
    teacherPerformance: mockTeachers.map(teacher => ({
      ...teacher,
      totalReports: Math.floor(Math.random() * 8) + 2,
      totalSessions: Math.floor(Math.random() * 15) + 5,
      averageAttendance: Math.floor(Math.random() * 25) + 70,
      lastReportDate: '2026-05-12',
      school: mockSchools.find(s => s.id === teacher.school_id),
      subject: mockSubjects.find(s => s.id === teacher.subject_id)
    })),
    subjectAnalysis: mockSubjects.map(subject => ({
      ...subject,
      totalReports: Math.floor(Math.random() * 60) + 40,
      totalSessions: Math.floor(Math.random() * 120) + 80,
      averageAttendance: Math.floor(Math.random() * 20) + 75,
      participatingSchools: Math.floor(Math.random() * 8) + 15,
      activeTeachers: mockTeachers.filter(t => t.subject_id === subject.id).length
    })),
    attendanceReasons: [
      { reason: 'Cuti sakit', count: 145, percentage: 32.1 },
      { reason: 'Terlibat program sekolah', count: 98, percentage: 21.7 },
      { reason: 'Mewakili sekolah ke pertandingan', count: 67, percentage: 14.8 },
      { reason: 'Tidak hadir tanpa kenyataan', count: 142, percentage: 31.4 }
    ]
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Only allow PPD and Jabatan roles
      if (parsedUser.role === 'school') {
        router.push('/dashboard/school');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  // Filter data based on selections
  const filteredSchools = selectedPPD > 0 
    ? analysisData.schoolPerformance.filter(s => s.ppd_id === selectedPPD)
    : analysisData.schoolPerformance;

  const filteredTeachers = analysisData.teacherPerformance.filter(t => {
    if (selectedPPD > 0 && t.school?.ppd_id !== selectedPPD) return false;
    if (selectedSchool > 0 && t.school_id !== selectedSchool) return false;
    if (selectedSubject > 0 && t.subject_id !== selectedSubject) return false;
    return true;
  });

  const getPerformanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 bg-green-100';
    if (rate >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceLabel = (rate: number) => {
    if (rate >= 90) return 'Cemerlang';
    if (rate >= 80) return 'Baik';
    return 'Perlu Perhatian';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Analisis Laporan Kelas Tambahan"
        subtitle="Analisis prestasi dan laporan tuisyen mengikut sekolah dan guru"
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Penapis Analisis</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PPD</label>
              <select
                value={selectedPPD}
                onChange={(e) => setSelectedPPD(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Semua PPD</option>
                {mockPPDs.map(ppd => (
                  <option key={ppd.id} value={ppd.id}>{ppd.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sekolah</label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Semua Sekolah</option>
                {filteredSchools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Semua Subjek</option>
                {mockSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempoh</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Tempoh</option>
                <option value="current_month">Bulan Ini</option>
                <option value="last_3_months">3 Bulan Lepas</option>
                <option value="current_year">Tahun Ini</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jumlah Laporan</p>
                <p className="text-3xl font-bold text-blue-600">{analysisData.totalReports}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jumlah Sesi</p>
                <p className="text-3xl font-bold text-green-600">{analysisData.totalSessions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Murid Terlibat</p>
                <p className="text-3xl font-bold text-purple-600">{analysisData.totalStudentsParticipated.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v2c0 .656.126 1.283.356 1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Purata Kehadiran</p>
                <p className="text-3xl font-bold text-orange-600">{analysisData.averageAttendanceRate}%</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Bulanan</h3>
            <div className="space-y-4">
              {analysisData.reportsByMonth.map((month, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{month.month}</span>
                    <span className="text-sm text-gray-600">{month.reports} laporan | {month.attendance}% kehadiran</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${(month.reports / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Analysis */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analisis Mengikut Subjek</h3>
            <div className="space-y-4">
              {analysisData.subjectAnalysis.map(subject => (
                <div key={subject.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{subject.name}</p>
                    <p className="text-sm text-gray-500">{subject.totalReports} laporan | {subject.activeTeachers} guru</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{subject.averageAttendance}%</p>
                    <p className="text-xs text-gray-500">{subject.participatingSchools} sekolah</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* School Performance Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Prestasi Sekolah</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PPD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Laporan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sesi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru Aktif</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kehadiran</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchools.map((school) => {
                  const ppd = mockPPDs.find(p => p.id === school.ppd_id);
                  return (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{school.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ppd?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{school.totalReports}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{school.totalSessions}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{school.activeTeachers}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{school.averageAttendance}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(school.averageAttendance)}`}>
                          {getPerformanceLabel(school.averageAttendance)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher Performance Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Prestasi Guru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Guru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjek</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Laporan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sesi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kehadiran</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeachers.slice(0, 20).map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.school?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.subject?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{teacher.totalReports}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{teacher.totalSessions}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{teacher.averageAttendance}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(teacher.averageAttendance)}`}>
                        {getPerformanceLabel(teacher.averageAttendance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Absence Reasons Analysis */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Analisis Alasan Ketidakhadiran</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisData.attendanceReasons.map((reason, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">{reason.reason}</p>
                  <p className="text-2xl font-bold text-gray-900">{reason.count}</p>
                  <p className="text-sm text-gray-500">{reason.percentage}%</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${reason.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}