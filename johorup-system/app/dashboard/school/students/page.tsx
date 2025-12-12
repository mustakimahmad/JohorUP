'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockStudents, mockGrades, mockSchools, mockSubjects } from '@/lib/mockData';
import { exportStudentsToExcel } from '@/lib/excelExport';

export default function SchoolStudentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStudents = schoolStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.ic_number.includes(searchTerm)
  );

  const getStudentGrades = (studentId: number) => {
    return mockGrades.filter(g => g.student_id === studentId);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Senarai Murid - {school?.name}</h1>
            <p className="text-sm text-gray-600">Murid sasaran program JohorUP</p>
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
            <a href="/dashboard/school/students" className="border-b-2 border-blue-600 px-3 py-4 text-sm font-medium text-blue-600">
              Senarai Murid
            </a>
            <a href="/dashboard/school/progress" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Analisis Perkembangan
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Murid</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nama atau No. IC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end gap-3">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Cari
              </button>
              <button 
                onClick={() => exportStudentsToExcel(schoolId)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-600">{schoolStudents.length}</p>
            <p className="text-sm text-gray-600">Jumlah Murid</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-green-600">
              {schoolStudents.filter(s => {
                const grades = getStudentGrades(s.id);
                const avgGrade = grades.reduce((sum, g) => {
                  const gradeValues: { [key: string]: number } = {
                    'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
                  };
                  return sum + (gradeValues[g.grade] || 0);
                }, 0) / grades.length;
                return avgGrade >= 65;
              }).length}
            </p>
            <p className="text-sm text-gray-600">Lulus (≥65)</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {schoolStudents.filter(s => {
                const grades = getStudentGrades(s.id);
                const avgGrade = grades.reduce((sum, g) => {
                  const gradeValues: { [key: string]: number } = {
                    'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
                  };
                  return sum + (gradeValues[g.grade] || 0);
                }, 0) / grades.length;
                return avgGrade >= 50 && avgGrade < 65;
              }).length}
            </p>
            <p className="text-sm text-gray-600">Sederhana (50-64)</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-red-600">
              {schoolStudents.filter(s => {
                const grades = getStudentGrades(s.id);
                const avgGrade = grades.reduce((sum, g) => {
                  const gradeValues: { [key: string]: number } = {
                    'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
                  };
                  return sum + (gradeValues[g.grade] || 0);
                }, 0) / grades.length;
                return avgGrade < 50;
              }).length}
            </p>
            <p className="text-sm text-gray-600">Perlu Perhatian (&lt;50)</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Senarai Murid {school?.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Menunjukkan {filteredStudents.length} daripada {schoolStudents.length} murid
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. IC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sejarah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matematik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purata</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student, index) => {
                  const grades = getStudentGrades(student.id);
                  const bmGrade = grades.find(g => g.subject_id === 1);
                  const sejGrade = grades.find(g => g.subject_id === 2);
                  const matGrade = grades.find(g => g.subject_id === 3);

                  const gradeValues: { [key: string]: number } = {
                    'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
                  };

                  const avgGrade = grades.reduce((sum, g) => sum + (gradeValues[g.grade] || 0), 0) / grades.length;
                  
                  const getStatusColor = (avg: number) => {
                    if (avg >= 80) return 'bg-green-100 text-green-800';
                    if (avg >= 65) return 'bg-blue-100 text-blue-800';
                    if (avg >= 50) return 'bg-yellow-100 text-yellow-800';
                    return 'bg-red-100 text-red-800';
                  };

                  const getStatusText = (avg: number) => {
                    if (avg >= 80) return 'Cemerlang';
                    if (avg >= 65) return 'Baik';
                    if (avg >= 50) return 'Sederhana';
                    return 'Perlu Perhatian';
                  };

                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.ic_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.class}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          bmGrade?.grade === 'C+' || bmGrade?.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bmGrade?.grade || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          sejGrade?.grade === 'C+' || sejGrade?.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {sejGrade?.grade || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          matGrade?.grade === 'C+' || matGrade?.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {matGrade?.grade || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {avgGrade.toFixed(0)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(avgGrade)}`}>
                          {getStatusText(avgGrade)}
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