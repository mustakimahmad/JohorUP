'use client';

import { mockSchools, mockStudents, mockGrades } from '@/lib/mockData';
import NavigationBar from '@/components/NavigationBar';

export default function ReportsPage() {
  const calculateSchoolStats = (schoolId: number) => {
    const students = mockStudents.filter(s => s.school_id === schoolId);
    const grades = mockGrades.filter(g => 
      students.some(s => s.id === g.student_id)
    );
    
    const passingGrades = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C'];
    const passing = grades.filter(g => passingGrades.includes(g.grade));
    
    return {
      totalStudents: students.length,
      passingRate: grades.length > 0 ? parseFloat((passing.length / grades.length * 100).toFixed(1)) : 0
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan & Analisis</h1>
            <p className="text-sm text-gray-600">Laporan pencapaian dan analisis program</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            Export PDF
          </button>
        </div>
      </header>

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Kadar Kelulusan Keseluruhan</p>
            <p className="text-4xl font-bold">42.0%</p>
            <p className="text-xs opacity-75 mt-2">Purata 3 subjek (Tingkatan 4)</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Target Peningkatan</p>
            <p className="text-4xl font-bold">+25%</p>
            <p className="text-xs opacity-75 mt-2">Sasaran SPM 2026</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Murid Berisiko Tinggi</p>
            <p className="text-4xl font-bold">487</p>
            <p className="text-xs opacity-75 mt-2">Perlu intervensi segera</p>
          </div>
        </div>

        {/* Performance by Subject */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pencapaian Mengikut Subjek</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Bahasa Melayu</span>
                <span className="text-sm font-semibold text-gray-900">45.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-600 h-4 rounded-full" style={{ width: '45.2%' }}></div>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-gray-500">A</p>
                  <p className="font-semibold">12%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">B</p>
                  <p className="font-semibold">18%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">C</p>
                  <p className="font-semibold">15.2%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">D</p>
                  <p className="font-semibold">28%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">E/G</p>
                  <p className="font-semibold">26.8%</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Sejarah</span>
                <span className="text-sm font-semibold text-gray-900">38.7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-600 h-4 rounded-full" style={{ width: '38.7%' }}></div>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-gray-500">A</p>
                  <p className="font-semibold">8%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">B</p>
                  <p className="font-semibold">14%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">C</p>
                  <p className="font-semibold">16.7%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">D</p>
                  <p className="font-semibold">32%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">E/G</p>
                  <p className="font-semibold">29.3%</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Matematik</span>
                <span className="text-sm font-semibold text-gray-900">42.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-purple-600 h-4 rounded-full" style={{ width: '42.1%' }}></div>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-gray-500">A</p>
                  <p className="font-semibold">10%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">B</p>
                  <p className="font-semibold">16%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">C</p>
                  <p className="font-semibold">16.1%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">D</p>
                  <p className="font-semibold">30%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">E/G</p>
                  <p className="font-semibold">27.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Performance Comparison */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Perbandingan Pencapaian Sekolah</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bil. Murid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kadar Lulus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prestasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockSchools.map((school) => {
                  const stats = calculateSchoolStats(school.id);
                  
                  return (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {school.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {stats.totalStudents}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {stats.passingRate}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                stats.passingRate >= 50 ? 'bg-green-500' :
                                stats.passingRate >= 40 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${stats.passingRate}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium ${
                            stats.passingRate >= 50 ? 'text-green-600' :
                            stats.passingRate >= 40 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {stats.passingRate >= 50 ? 'Baik' :
                             stats.passingRate >= 40 ? 'Sederhana' :
                             'Perlu Perhatian'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Cadangan Tindakan</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Fokus program intensif untuk subjek Sejarah (kadar lulus paling rendah)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Tambah kelas tambahan untuk 487 murid berisiko tinggi</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Peruntukkan lebih banyak sumber untuk sekolah dengan prestasi rendah</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Adakan program motivasi dan bimbingan kerjaya</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
