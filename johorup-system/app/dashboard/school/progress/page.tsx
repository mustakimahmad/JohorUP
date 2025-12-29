'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage-auth';
import { mockStudents, mockGrades, mockSubjects, mockSchools } from '@/lib/mockData';
import { Student, StudentGrade } from '@/lib/types';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function SchoolProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<number>(0); // 0 = all subjects

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
      
      // Redirect non-school users
      if (user.role !== 'school') {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user || user.role !== 'school') return null;

  // Get school data
  const school = mockSchools.find(s => s.id === user.school_id);
  const schoolStudents = mockStudents.filter(s => s.school_id === user.school_id);
  
  // Get grades for school students
  const schoolGrades = mockGrades.filter(grade => 
    schoolStudents.some(student => student.id === grade.student_id)
  );

  // Calculate statistics
  const getGradeStats = (subjectId?: number) => {
    const relevantGrades = subjectId 
      ? schoolGrades.filter(g => g.subject_id === subjectId)
      : schoolGrades;

    const gradeDistribution = {
      'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 
      'C+': 0, 'C': 0, 'D': 0, 'E': 0, 'G': 0, 'TH': 0
    };

    relevantGrades.forEach(grade => {
      if (grade.grade in gradeDistribution) {
        gradeDistribution[grade.grade as keyof typeof gradeDistribution]++;
      }
    });

    const totalStudents = relevantGrades.length;
    const passingGrades = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C'] as const;
    const passingCount = passingGrades.reduce((sum, grade) => sum + gradeDistribution[grade], 0);
    const passingRate = totalStudents > 0 ? (passingCount / totalStudents * 100) : 0;

    return { gradeDistribution, totalStudents, passingCount, passingRate };
  };

  const overallStats = getGradeStats();
  const subjectStats = mockSubjects.map(subject => ({
    ...subject,
    ...getGradeStats(subject.id)
  }));

  // Get student performance data
  const getStudentPerformance = () => {
    return schoolStudents.map(student => {
      const studentGrades = schoolGrades.filter(g => g.student_id === student.id);
      const subjects = studentGrades.map(grade => {
        const subject = mockSubjects.find(s => s.id === grade.subject_id);
        return {
          subject: subject?.name || 'Unknown',
          grade: grade.grade,
          isPassing: ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C'].includes(grade.grade)
        };
      });
      
      const passingSubjects = subjects.filter(s => s.isPassing).length;
      const totalSubjects = subjects.length;
      
      return {
        ...student,
        subjects,
        passingSubjects,
        totalSubjects,
        overallStatus: passingSubjects === totalSubjects ? 'Lulus Semua' : 
                      passingSubjects > 0 ? 'Lulus Sebahagian' : 'Tidak Lulus'
      };
    });
  };

  const studentPerformance = getStudentPerformance();

  // Filter students by performance
  const excellentStudents = studentPerformance.filter(s => s.passingSubjects === s.totalSubjects);
  const needsImprovementStudents = studentPerformance.filter(s => s.passingSubjects < s.totalSubjects);

  const getGradeColor = (grade: string) => {
    const colors: {[key: string]: string} = {
      'A+': 'text-green-600', 'A': 'text-green-600', 'A-': 'text-green-500',
      'B+': 'text-blue-600', 'B': 'text-blue-500',
      'C+': 'text-yellow-600', 'C': 'text-yellow-500',
      'D': 'text-orange-500', 'E': 'text-red-500', 'G': 'text-red-600', 'TH': 'text-gray-500'
    };
    return colors[grade] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title={`Analisis Perkembangan - ${school?.name || 'Sekolah'}`}
        subtitle="Analisis prestasi murid mengikut subjek"
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm text-gray-600">Kadar Kelulusan</p>
                <p className="text-3xl font-bold text-green-600">{overallStats.passingRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">{overallStats.passingCount}/{overallStats.totalStudents} lulus</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cemerlang</p>
                <p className="text-3xl font-bold text-purple-600">{excellentStudents.length}</p>
                <p className="text-xs text-gray-500 mt-1">Lulus semua subjek</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perlu Bimbingan</p>
                <p className="text-3xl font-bold text-orange-600">{needsImprovementStudents.length}</p>
                <p className="text-xs text-gray-500 mt-1">Tidak lulus semua</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prestasi Mengikut Subjek</h3>
            <div className="space-y-4">
              {subjectStats.map(subject => (
                <div key={subject.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{subject.passingRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${subject.passingRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {subject.passingCount}/{subject.totalStudents} murid lulus
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Taburan Gred Keseluruhan</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(overallStats.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center p-2 bg-gray-50 rounded">
                  <div className={`text-lg font-bold ${getGradeColor(grade)}`}>{grade}</div>
                  <div className="text-sm text-gray-600">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Performance Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Prestasi Individu Murid</h3>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Semua Subjek</option>
                {mockSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Murid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bahasa Melayu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sejarah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matematik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {studentPerformance.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.class}</td>
                    {mockSubjects.map(subject => {
                      const subjectGrade = student.subjects.find(s => s.subject === subject.name);
                      return (
                        <td key={subject.id} className="px-6 py-4 text-sm">
                          <span className={`font-semibold ${getGradeColor(subjectGrade?.grade || 'TH')}`}>
                            {subjectGrade?.grade || 'TH'}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.overallStatus === 'Lulus Semua' 
                          ? 'bg-green-100 text-green-800'
                          : student.overallStatus === 'Lulus Sebahagian'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.overallStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Cadangan Tindakan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Murid Cemerlang ({excellentStudents.length} murid)</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Berikan pengayaan dan cabaran tambahan</li>
                <li>• Jadikan mentor untuk rakan sebaya</li>
                <li>• Sertai pertandingan akademik</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Murid Perlu Bimbingan ({needsImprovementStudents.length} murid)</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sertakan dalam program tuisyen intensif</li>
                <li>• Bimbingan khas untuk subjek lemah</li>
                <li>• Pantau kemajuan secara berkala</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}