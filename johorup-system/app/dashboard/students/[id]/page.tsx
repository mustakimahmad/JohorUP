'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockStudents, mockGrades, mockSchools, mockSubjects } from '@/lib/mockData';
import DashboardHeader from '@/components/DashboardHeader';

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = parseInt(params.id as string);
  
  const [student, setStudent] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [school, setSchool] = useState<any>(null);

  useEffect(() => {
    // Find student data
    const foundStudent = mockStudents.find(s => s.id === studentId);
    if (!foundStudent) {
      router.push('/dashboard/students');
      return;
    }

    const studentGrades = mockGrades.filter(g => g.student_id === studentId);
    const studentSchool = mockSchools.find(s => s.id === foundStudent.school_id);

    setStudent(foundStudent);
    setGrades(studentGrades);
    setSchool(studentSchool);
  }, [studentId, router]);

  if (!student) {
    return <div>Loading...</div>;
  }

  // Calculate progress simulation
  const calculateProgress = () => {
    const gradeValues: { [key: string]: number } = {
      'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20, 'TH': 0
    };
    
    const tingkatan4Avg = grades.reduce((sum, g) => sum + (gradeValues[g.grade] || 0), 0) / grades.length;
    const midYearAvg = Math.min(tingkatan4Avg + Math.random() * 15 + 5, 100);
    const trialAvg = Math.min(midYearAvg + Math.random() * 10 + 3, 100);
    
    return {
      tingkatan4: tingkatan4Avg,
      midYear: midYearAvg,
      trial: trialAvg,
      improvement: ((trialAvg - tingkatan4Avg) / tingkatan4Avg * 100)
    };
  };

  const progress = calculateProgress();

  const getSubjectGrade = (subjectId: number) => {
    return grades.find(g => g.subject_id === subjectId);
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'bg-green-100 text-green-800';
    if (['B+', 'B'].includes(grade)) return 'bg-blue-100 text-blue-800';
    if (['C+', 'C'].includes(grade)) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title={`Profil Murid: ${student.name}`}
        subtitle={`${school?.name} - Kelas ${student.class}`}
      >
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>
      </DashboardHeader>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {student.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                  <p className="text-gray-600">No. IC: {student.ic_number}</p>
                  <p className="text-gray-600">{school?.name} - Kelas {student.class}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(progress.trial)}`}>
                  {getStatusText(progress.trial)}
                </span>
                <p className="text-sm text-gray-500 mt-1">Status Semasa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-3xl font-bold text-orange-600">{progress.tingkatan4.toFixed(0)}</p>
            <p className="text-sm text-gray-600 mt-1">Tingkatan 4</p>
            <p className="text-xs text-gray-500">Nov 2025</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-3xl font-bold text-yellow-600">{progress.midYear.toFixed(0)}</p>
            <p className="text-sm text-gray-600 mt-1">Pertengahan Tahun</p>
            <p className="text-xs text-gray-500">Mei 2026</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-3xl font-bold text-green-600">{progress.trial.toFixed(0)}</p>
            <p className="text-sm text-gray-600 mt-1">Percubaan SPM</p>
            <p className="text-xs text-gray-500">Sep 2026</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-3xl font-bold text-blue-600">+{progress.improvement.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-1">Peningkatan</p>
            <p className="text-xs text-gray-500">Dari T4</p>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Prestasi Mengikut Subjek</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockSubjects.map(subject => {
                  const grade = getSubjectGrade(subject.id);
                  return (
                    <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{subject.name}</p>
                        <p className="text-sm text-gray-600">Tingkatan 4 (2025)</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 text-sm font-medium rounded ${getGradeColor(grade?.grade || 'TH')}`}>
                          {grade?.grade || 'TH'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Graf Perkembangan</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Tingkatan 4</span>
                    <span className="text-sm font-semibold">{progress.tingkatan4.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full"
                      style={{ width: `${progress.tingkatan4}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Pertengahan Tahun</span>
                    <span className="text-sm font-semibold">{progress.midYear.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{ width: `${progress.midYear}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Percubaan SPM</span>
                    <span className="text-sm font-semibold">{progress.trial.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${progress.trial}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Analisis:</span> Murid menunjukkan 
                  {progress.improvement > 15 ? ' peningkatan yang sangat baik' : 
                   progress.improvement > 5 ? ' peningkatan yang baik' : 
                   ' peningkatan yang perlahan'} 
                  dengan peningkatan {progress.improvement.toFixed(1)}% dari Tingkatan 4.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Cadangan Tindakan</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {progress.trial >= 65 ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Prestasi Baik</h4>
                  <p className="text-sm text-green-800">
                    Teruskan momentum yang baik. Fokus kepada subjek yang masih lemah dan 
                    berikan cabaran tambahan untuk subjek yang kuat.
                  </p>
                </div>
              ) : progress.trial >= 50 ? (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Perlu Peningkatan</h4>
                  <p className="text-sm text-yellow-800">
                    Sertai program bimbingan tambahan. Fokus kepada teknik menjawab 
                    dan latihan soalan past year.
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">🚨 Perlu Perhatian Segera</h4>
                  <p className="text-sm text-red-800">
                    Perlukan bimbingan intensif dan program khas. Cadangkan tuisyen 
                    atau kelas tambahan segera.
                  </p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📚 Program Disyorkan</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Program Intensif BM</li>
                  <li>• Kem Motivasi Sejarah</li>
                  <li>• Kelas Tambahan Matematik</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">🎯 Target SPM 2026</h4>
                <p className="text-sm text-purple-800">
                  Sasaran: Mencapai sekurang-kurangnya gred C dalam semua subjek wajib 
                  untuk layak ke tingkatan 6 atau kolej.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}