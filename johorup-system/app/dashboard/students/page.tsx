'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  isStudentTransferAllowed, 
  getTransferPeriodStatus, 
  canUserMakeTransfers, 
  getTransferRestrictionMessage,
  getFormattedTransferPeriod 
} from '@/lib/studentTransferUtils';

interface Student {
  id: number;
  name: string;
  ic_number: string;
  class: string;
  school_name: string;
}

interface ExamGrade {
  student_id: number;
  exam_type: string;
  grade: string;
  marks?: number;
  percentage?: number;
}

export default function StudentsPage() {
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState('');
  const [examGrades, setExamGrades] = useState<ExamGrade[]>([]);

  // Transfer period status
  const transferStatus = getTransferPeriodStatus();
  const canMakeTransfers = user ? canUserMakeTransfers(user.role) : false;
  const isTransferAllowed = isStudentTransferAllowed() && canMakeTransfers;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      // Load sample students for the teacher's subject
      loadStudents();
    }
  }, []);

  const loadStudents = () => {
    // Sample students - in production this would come from API
    const sampleStudents: Student[] = [];
    setStudents(sampleStudents);
  };

  const getPageTitle = () => {
    if (user.role === 'operational_teacher') return 'Murid Saya';
    if (user.role === 'operational_school') return 'Murid';
    return 'Murid';
  };

  const getPageDescription = () => {
    if (user.role === 'operational_teacher') return `Pengurusan data peperiksaan murid - ${getTeacherSubject()}`;
    if (user.role === 'operational_school') return 'Pengurusan data peperiksaan murid sekolah';
    return 'Pengurusan data peperiksaan murid';
  };

  const getUserRole = () => {
    if (user.role === 'operational_teacher') return `Guru ${getTeacherSubject()}`;
    if (user.role === 'operational_school') return 'Pentadbir Sekolah';
    return 'Pengguna';
  };

  const getTeacherSubject = () => {
    if (!user) return 'Subjek';
    // Determine subject from user email or role
    if (user.email?.includes('bahasamelayu') || user.name?.toLowerCase().includes('bahasa')) return 'Bahasa Melayu';
    if (user.email?.includes('sejarah') || user.name?.toLowerCase().includes('sejarah')) return 'Sejarah';
    if (user.email?.includes('matematik') || user.name?.toLowerCase().includes('matematik')) return 'Matematik';
    return 'Bahasa Melayu'; // Default
  };

  const examTypes = [
    { value: 'akhir_tahun_2025_tingkatan_4', label: 'Peperiksaan Akhir Tahun 2025 Tingkatan 4' },
    { value: 'pertengahan_tahun_2026', label: 'Peperiksaan Pertengahan Tahun 2026' },
    { value: 'percubaan_spm_2026', label: 'Peperiksaan Percubaan SPM 2026' }
  ];

  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E', 'G', 'TH'];

  const handleAddGrade = (studentId: number, examType: string, grade: string, marks: number) => {
    const percentage = marks ? Math.round((marks / 100) * 100) : 0;
    const newGrade: ExamGrade = {
      student_id: studentId,
      exam_type: examType,
      grade,
      marks,
      percentage
    };
    
    // Remove existing grade for same student and exam type
    const updatedGrades = examGrades.filter(g => 
      !(g.student_id === studentId && g.exam_type === examType)
    );
    
    setExamGrades([...updatedGrades, newGrade]);
    setShowGradeForm(false);
    setSelectedStudent(null);
  };

  const getStudentGrade = (studentId: number, examType: string) => {
    return examGrades.find(g => g.student_id === studentId && g.exam_type === examType);
  };

  if (!user || (user.role !== 'operational_teacher' && user.role !== 'operational_school')) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Access denied. This page is only available for teachers and school administrators.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-gray-600 mt-1">{getPageDescription()}</p>
      </div>

      {/* User Info */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{getUserRole()}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Period Status Banner */}
      {canMakeTransfers && (
        <Card className={`border-l-4 ${
          transferStatus.status === 'active' 
            ? 'border-l-green-500 bg-green-50' 
            : transferStatus.status === 'before'
            ? 'border-l-yellow-500 bg-yellow-50'
            : 'border-l-red-500 bg-red-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                transferStatus.status === 'active' 
                  ? 'bg-green-100' 
                  : transferStatus.status === 'before'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
              }`}>
                {transferStatus.status === 'active' ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : transferStatus.status === 'before' ? (
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  transferStatus.status === 'active' 
                    ? 'text-green-900' 
                    : transferStatus.status === 'before'
                    ? 'text-yellow-900'
                    : 'text-red-900'
                }`}>
                  {transferStatus.status === 'active' 
                    ? 'Tempoh Pertukaran Murid Aktif' 
                    : transferStatus.status === 'before'
                    ? 'Tempoh Pertukaran Murid Belum Bermula'
                    : 'Tempoh Pertukaran Murid Telah Tamat'
                  }
                </h4>
                <p className={`text-sm mt-1 ${
                  transferStatus.status === 'active' 
                    ? 'text-green-800' 
                    : transferStatus.status === 'before'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {getTransferRestrictionMessage(user.role)}
                </p>
                {transferStatus.status === 'active' && (
                  <div className="mt-2 text-xs text-green-700">
                    <strong>Tempoh:</strong> {getFormattedTransferPeriod().startDate} - {getFormattedTransferPeriod().endDate}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exam Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {examTypes.map((exam) => (
          <Card key={exam.value} className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-green-600">
                {examGrades.filter(g => g.exam_type === exam.value).length}
              </div>
              <div className="text-sm text-gray-600">{exam.label}</div>
              <div className="text-xs text-gray-500 mt-1">Data dimasukkan</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Students List */}
      {students.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {user.role === 'operational_teacher' ? `Senarai Murid - ${getTeacherSubject()}` : 'Senarai Murid Sekolah'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Nama Murid</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">No. IC</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Kelas</th>
                    {user.role === 'operational_school' && (
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Subjek</th>
                    )}
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Akhir Tahun 2025</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Pertengahan 2026</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Percubaan SPM 2026</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.school_name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{student.ic_number}</td>
                      <td className="py-3 px-4 text-gray-700">{student.class}</td>
                      {user.role === 'operational_school' && (
                        <td className="py-3 px-4 text-gray-700">Semua Subjek</td>
                      )}
                      {examTypes.map((exam) => {
                        const grade = getStudentGrade(student.id, exam.value);
                        return (
                          <td key={exam.value} className="py-3 px-4">
                            {grade ? (
                              <div className="text-center">
                                <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                  ['A+', 'A', 'A-'].includes(grade.grade) ? 'bg-green-100 text-green-800' :
                                  ['B+', 'B', 'C+', 'C'].includes(grade.grade) ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {grade.grade}
                                </span>
                                {grade.marks && (
                                  <div className="text-xs text-gray-500 mt-1">{grade.marks}%</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">Belum diisi</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowGradeForm(true);
                          }}
                          disabled={!isTransferAllowed}
                          className={`text-sm font-medium ${
                            isTransferAllowed 
                              ? 'text-blue-600 hover:text-blue-800 cursor-pointer' 
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title={!isTransferAllowed ? getTransferRestrictionMessage(user.role) : 'Masukkan gred untuk murid ini'}
                        >
                          {isTransferAllowed ? 'Masukkan Gred' : 'Tidak Dibenarkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tiada Murid Ditemui</h3>
            <p className="text-gray-600 mb-4">
              {user.role === 'operational_teacher' 
                ? `Belum ada murid yang ditugaskan untuk subjek ${getTeacherSubject()}. Sila hubungi pentadbir sekolah untuk mendapatkan senarai murid.`
                : 'Belum ada murid yang didaftarkan di sekolah ini. Sila hubungi pentadbir sistem untuk mendapatkan senarai murid.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grade Entry Modal */}
      {showGradeForm && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Masukkan Gred - {selectedStudent.name}
            </h3>

            {/* Transfer Period Warning */}
            {!isTransferAllowed && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Pertukaran Data Tidak Dibenarkan</p>
                    <p className="text-xs text-red-700 mt-1">{getTransferRestrictionMessage(user.role)}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!isTransferAllowed) {
                alert('Pertukaran data murid tidak dibenarkan pada masa ini.');
                return;
              }
              
              const formData = new FormData(e.target as HTMLFormElement);
              const examType = formData.get('examType') as string;
              const grade = formData.get('grade') as string;
              const marks = parseInt(formData.get('marks') as string) || 0;
              
              if (examType && grade) {
                handleAddGrade(selectedStudent.id, examType, grade, marks);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Peperiksaan
                  </label>
                  <select
                    name="examType"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                  >
                    <option value="">Pilih Peperiksaan</option>
                    {examTypes.map((exam) => (
                      <option key={exam.value} value={exam.value}>
                        {exam.label}
                      </option>
                    ))}
                  </select>
                </div>

                {user.role === 'operational_school' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjek
                    </label>
                    <select
                      name="subject"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Subjek</option>
                      <option value="Bahasa Melayu">Bahasa Melayu</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Matematik">Matematik</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gred
                  </label>
                  <select
                    name="grade"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Gred</option>
                    {gradeOptions.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Markah (%)
                  </label>
                  <input
                    type="number"
                    name="marks"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: 85"
                  />
                </div>

                {user.role === 'operational_teacher' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjek
                    </label>
                    <input
                      type="text"
                      value={getTeacherSubject()}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={!isTransferAllowed}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    isTransferAllowed 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  {isTransferAllowed ? 'Simpan Gred' : 'Tidak Dibenarkan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowGradeForm(false);
                    setSelectedStudent(null);
                    setSelectedExamType('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">Panduan Penggunaan</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Klik "Masukkan Gred" untuk memasukkan keputusan peperiksaan murid</li>
            <li>• Pilih jenis peperiksaan yang sesuai (Akhir Tahun 2025, Pertengahan 2026, atau Percubaan SPM 2026)</li>
            {user.role === 'operational_school' && (
              <li>• Pilih subjek yang sesuai untuk gred yang dimasukkan</li>
            )}
            <li>• Masukkan gred dan markah untuk {user.role === 'operational_teacher' ? `subjek ${getTeacherSubject()}` : 'subjek yang dipilih'}</li>
            <li>• Data akan disimpan dan boleh dilihat dalam laporan</li>
          </ul>
          
          {canMakeTransfers && (
            <div className="mt-4 pt-3 border-t border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Tempoh Pertukaran Murid</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pertukaran data murid hanya dibenarkan dari <strong>{getFormattedTransferPeriod().startDate}</strong> hingga <strong>{getFormattedTransferPeriod().endDate}</strong></li>
                <li>• Tiada pertukaran dibenarkan selepas tempoh tersebut sehingga analisis keputusan peperiksaan pertengahan tahun selesai</li>
                <li>• Status semasa: <strong>{transferStatus.message}</strong></li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}