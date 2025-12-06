'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockStudents, mockGrades, mockSchools } from '@/lib/mockData';

export default function SchoolDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
    
    // Simulate different exam grades for demo
    const gradeValues: { [key: string]: number } = {
      'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
    };
    
    const tingkatan4Avg = studentGrades.reduce((sum, g) => sum + (gradeValues[g.grade] || 0), 0) / studentGrades.length;
    
    // Simulate improvement for demo
    const midYearAvg = tingkatan4Avg + Math.random() * 10;
    const trialAvg = midYearAvg + Math.random() * 8;
    
    return {
      tingkatan4: tingkatan4Avg,
      midYear: midYearAvg,
      trial: trialAvg,
      improvement: ((trialAvg - tingkatan4Avg) / tingkatan4Avg * 100).toFixed(1)
    };
  };

  // Calculate overall school statistics
  const calculateSchoolStats = () => {
    let totalT4 = 0, totalMid = 0, totalTrial = 0;
    
    schoolStudents.forEach(student => {
      const progress = calculateProgress(student.id);
      totalT4 += progress.tingkatan4;
      totalMid += progress.midYear;
      totalTrial += progress.trial;
    });
    
    const count = schoolStudents.length;
    return {
      tingkatan4: (totalT4 / count).toFixed(1),
      midYear: (totalMid / count).toFixed(1),
      trial: (totalTrial / count).toFixed(1),
      improvement: (((totalTrial - totalT4) / totalT4) * 100).toFixed(1)
    };
  };

  const schoolStats = calculateSchoolStats();

  // Count students by performance category
  const categorizeStudents = () => {
    const categories = { excellent: 0, good: 0, moderate: 0, needsAttention: 0 };
    
    schoolStudents.forEach(student => {
      const progress = calculateProgress(student.id);
      if (progress.trial >= 80) categories.excellent++;
      else if (progress.trial >= 65) categories.good++;
      else if (progress.trial >= 50) categories.moderate++;
      else categories.needsAttention++;
    });
    
    return categories;
  };

  const categories = categorizeStudents();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{school?.name}</h1>
            <p className="text-sm text-gray-600">Dashboard Pemantauan Murid</p>
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
            <a href="/dashboard/school" className="border-b-2 border-blue-600 px-3 py-4 text-sm font-medium text-blue-600">
              Dashboard
            </a>
            <a href="/dashboard/school/students" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Senarai Murid
            </a>
            <a href="/dashboard/school/progress" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Analisis Perkembangan
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Jumlah Murid</p>
            <p className="text-3xl font-bold text-gray-900">{schoolStudents.length}</p>
            <p className="text-xs text-gray-500 mt-1">Murid sasaran program</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Purata Tingkatan 4</p>
            <p className="text-3xl font-bold text-orange-600">{schoolStats.tingkatan4}</p>
            <p className="text-xs text-gray-500 mt-1">Markah purata</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Purata Percubaan</p>
            <p className="text-3xl font-bold text-green-600">{schoolStats.trial}</p>
            <p className="text-xs text-gray-500 mt-1">Markah purata</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Peningkatan</p>
            <p className="text-3xl font-bold text-blue-600">+{schoolStats.improvement}%</p>
            <p className="text-xs text-gray-500 mt-1">Dari Tingkatan 4</p>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Graf Perkembangan Purata Sekolah</h3>
          
          {/* Simple Bar Chart */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tingkatan 4 (Nov 2025)</span>
                <span className="text-sm font-semibold text-gray-900">{schoolStats.tingkatan4}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-orange-500 h-8 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${schoolStats.tingkatan4}%` }}
                >
                  <span className="text-xs font-semibold text-white">{schoolStats.tingkatan4}%</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Pertengahan Tahun (Mei 2026)</span>
                <span className="text-sm font-semibold text-gray-900">{schoolStats.midYear}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-yellow-500 h-8 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${schoolStats.midYear}%` }}
                >
                  <span className="text-xs font-semibold text-white">{schoolStats.midYear}%</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Percubaan SPM (Sep 2026)</span>
                <span className="text-sm font-semibold text-gray-900">{schoolStats.trial}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${schoolStats.trial}%` }}
                >
                  <span className="text-xs font-semibold text-white">{schoolStats.trial}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Pencapaian Baik!</span> Sekolah menunjukkan peningkatan sebanyak {schoolStats.improvement}% dari peperiksaan awal hingga percubaan SPM.
            </p>
          </div>
        </div>

        {/* Student Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Pencapaian Murid</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Cemerlang (80-100)</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{categories.excellent} murid</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Baik (65-79)</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{categories.good} murid</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Sederhana (50-64)</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{categories.moderate} murid</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Perlu Perhatian (&lt;50)</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{categories.needsAttention} murid</span>
              </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="mt-6">
              <div className="flex h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(categories.excellent / schoolStudents.length) * 100}%` }}
                ></div>
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${(categories.good / schoolStudents.length) * 100}%` }}
                ></div>
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${(categories.moderate / schoolStudents.length) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(categories.needsAttention / schoolStudents.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pencapaian Mengikut Subjek</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Bahasa Melayu</span>
                  <span className="text-sm font-semibold text-gray-900">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <p className="text-xs text-green-600 mt-1">↑ +12% dari Tingkatan 4</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Sejarah</span>
                  <span className="text-sm font-semibold text-gray-900">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: '62%' }}></div>
                </div>
                <p className="text-xs text-green-600 mt-1">↑ +15% dari Tingkatan 4</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Matematik</span>
                  <span className="text-sm font-semibold text-gray-900">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-green-600 mt-1">↑ +10% dari Tingkatan 4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Murid Berpencapaian Tertinggi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tingkatan 4</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percubaan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peningkatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schoolStudents.slice(0, 10).map((student) => {
                  const progress = calculateProgress(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.class}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{progress.tingkatan4.toFixed(0)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{progress.trial.toFixed(0)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          +{progress.improvement}%
                        </span>
                      </td>
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
