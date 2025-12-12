'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockStudents, mockGrades, mockSchools, mockSubjects } from '@/lib/mockData';
import { exportProgressToExcel } from '@/lib/excelExport';

export default function SchoolProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect if not school role
      if (!parsedUser.email.includes('sekolah')) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  if (!user) return null;

  // Mock school_id based on email
  const schoolId = 1;
  const school = mockSchools.find(s => s.id === schoolId);
  const schoolStudents = mockStudents.filter(s => s.school_id === schoolId);

  // Calculate progress for each student
  const calculateProgress = (studentId: number) => {
    const studentGrades = mockGrades.filter(g => g.student_id === studentId);
    
    const gradeValues: { [key: string]: number } = {
      'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
    };
    
    const tingkatan4Avg = studentGrades.reduce((sum, g) => sum + (gradeValues[g.grade] || 0), 0) / studentGrades.length;
    
    // Simulate improvement for demo
    const midYearAvg = tingkatan4Avg + Math.random() * 15 + 5; // +5 to +20
    const trialAvg = midYearAvg + Math.random() * 10 + 3; // +3 to +13 more
    
    return {
      tingkatan4: tingkatan4Avg,
      midYear: Math.min(midYearAvg, 100),
      trial: Math.min(trialAvg, 100),
      improvement: ((Math.min(trialAvg, 100) - tingkatan4Avg) / tingkatan4Avg * 100)
    };
  };

  // Calculate subject-specific progress
  const calculateSubjectProgress = (subjectId: number) => {
    const subjectGrades = mockGrades.filter(g => g.subject_id === subjectId);
    const gradeValues: { [key: string]: number } = {
      'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
    };
    
    const tingkatan4Avg = subjectGrades.reduce((sum, g) => sum + (gradeValues[g.grade] || 0), 0) / subjectGrades.length;
    const midYearAvg = tingkatan4Avg + Math.random() * 12 + 8;
    const trialAvg = midYearAvg + Math.random() * 8 + 5;
    
    return {
      tingkatan4: tingkatan4Avg,
      midYear: Math.min(midYearAvg, 100),
      trial: Math.min(trialAvg, 100),
      improvement: ((Math.min(trialAvg, 100) - tingkatan4Avg) / tingkatan4Avg * 100)
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Get top and bottom performers
  const studentsWithProgress = schoolStudents.map(student => ({
    ...student,
    progress: calculateProgress(student.id)
  }));

  const topPerformers = studentsWithProgress
    .sort((a, b) => b.progress.improvement - a.progress.improvement)
    .slice(0, 10);

  const needsAttention = studentsWithProgress
    .filter(s => s.progress.trial < 50)
    .sort((a, b) => a.progress.trial - b.progress.trial)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analisis Perkembangan - {school?.name}</h1>
            <p className="text-sm text-gray-600">Pemantauan prestasi murid dari Tingkatan 4 hingga Percubaan SPM</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Log Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/dashboard/school" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="/dashboard/school/students" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Senarai Murid
            </a>
            <a href="/dashboard/school/progress" className="border-b-2 border-blue-600 px-3 py-4 text-sm font-medium text-blue-600">
              Analisis Perkembangan
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subject Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Analisis mengikut subjek:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Subjek (Purata)</option>
                {mockSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => exportProgressToExcel(schoolId)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Excel
            </button>
          </div>
        </div>

        {/* Overall Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Graf Perkembangan Keseluruhan Sekolah
            {selectedSubject !== 'all' && ` - ${mockSubjects.find(s => s.id === parseInt(selectedSubject))?.name}`}
          </h3>
          
          {selectedSubject === 'all' ? (
            // Overall progress
            <div className="space-y-6">
              {mockSubjects.map(subject => {
                const progress = calculateSubjectProgress(subject.id);
                return (
                  <div key={subject.id}>
                    <h4 className="text-md font-medium text-gray-800 mb-3">{subject.name}</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Tingkatan 4 (Nov 2025)</span>
                          <span className="text-sm font-semibold text-gray-900">{progress.tingkatan4.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-orange-500 h-4 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${progress.tingkatan4}%` }}
                          >
                            <span className="text-xs font-semibold text-white">{progress.tingkatan4.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Pertengahan Tahun (Mei 2026)</span>
                          <span className="text-sm font-semibold text-gray-900">{progress.midYear.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-yellow-500 h-4 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${progress.midYear}%` }}
                          >
                            <span className="text-xs font-semibold text-white">{progress.midYear.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Percubaan SPM (Sep 2026)</span>
                          <span className="text-sm font-semibold text-gray-900">{progress.trial.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-green-500 h-4 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${progress.trial}%` }}
                          >
                            <span className="text-xs font-semibold text-white">{progress.trial.toFixed(0)}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          ↑ +{progress.improvement.toFixed(1)}% dari Tingkatan 4
                        </p>
                      </div>
                    </div>
                    <hr className="my-6" />
                  </div>
                );
              })}
            </div>
          ) : (
            // Single subject progress
            (() => {
              const progress = calculateSubjectProgress(parseInt(selectedSubject));
              return (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tingkatan 4 (Nov 2025)</span>
                      <span className="text-sm font-semibold text-gray-900">{progress.tingkatan4.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-orange-500 h-8 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${progress.tingkatan4}%` }}
                      >
                        <span className="text-xs font-semibold text-white">{progress.tingkatan4.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pertengahan Tahun (Mei 2026)</span>
                      <span className="text-sm font-semibold text-gray-900">{progress.midYear.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-yellow-500 h-8 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${progress.midYear}%` }}
                      >
                        <span className="text-xs font-semibold text-white">{progress.midYear.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Percubaan SPM (Sep 2026)</span>
                      <span className="text-sm font-semibold text-gray-900">{progress.trial.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${progress.trial}%` }}
                      >
                        <span className="text-xs font-semibold text-white">{progress.trial.toFixed(0)}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                      ↑ Peningkatan sebanyak {progress.improvement.toFixed(1)}% dari Tingkatan 4
                    </p>
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* Performance Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Murid Berpencapaian Terbaik</h3>
              <p className="text-sm text-gray-600">Berdasarkan peningkatan markah</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">T4</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percubaan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">+/-</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topPerformers.slice(0, 8).map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.class}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.progress.tingkatan4.toFixed(0)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{student.progress.trial.toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          +{student.progress.improvement.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Students Needing Attention */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Murid Perlu Perhatian</h3>
              <p className="text-sm text-gray-600">Markah percubaan &lt; 50</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">T4</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percubaan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {needsAttention.length > 0 ? needsAttention.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.class}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.progress.tingkatan4.toFixed(0)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">{student.progress.trial.toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Perlu Bantuan
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-medium text-green-600">Bagus!</p>
                          <p className="text-xs text-gray-500">Semua murid mencapai markah ≥ 50</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cadangan Tindakan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-green-900 mb-2">Murid Cemerlang</h4>
              <p className="text-sm text-green-800">
                {topPerformers.slice(0, 5).length} murid menunjukkan peningkatan terbaik. 
                Teruskan motivasi dan berikan cabaran tambahan.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Murid Sederhana</h4>
              <p className="text-sm text-yellow-800">
                Fokus kepada teknik menjawab dan latihan tambahan. 
                Adakan sesi bimbingan berkumpulan.
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Murid Perlu Perhatian</h4>
              <p className="text-sm text-red-800">
                {needsAttention.length} murid perlu bimbingan intensif. 
                Cadangkan program khas dan bimbingan 1-ke-1.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}