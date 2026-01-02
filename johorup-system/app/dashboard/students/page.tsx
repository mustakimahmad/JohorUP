'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentsData, getUserPermissions, getRoleDisplayName, getScopeDescription } from '@/lib/useHierarchicalData';
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
  class_level?: string;
  class_name?: string;
  school_name: string;
  ppd_name?: string;
  district?: string;
}

interface ExamGrade {
  student_id: number;
  exam_type: string;
  grade: string;
  marks?: number;
  percentage?: number;
}

export default function StudentsPage() {
  const { data, user, loading, error } = useStudentsData();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState('');
  const [examGrades, setExamGrades] = useState<ExamGrade[]>([]);

  const students = data?.students || [];
  const permissions = user ? getUserPermissions(user.role) : null;

  // Transfer period status
  const transferStatus = getTransferPeriodStatus();
  const canMakeTransfers = user ? canUserMakeTransfers(user.role) : false;
  const isTransferAllowed = isStudentTransferAllowed() && canMakeTransfers;

  const getPageTitle = () => {
    if (!user) return 'Murid';
    if (user.role === 'operational_teacher') return 'Murid Saya';
    if (user.role === 'operational_school') return 'Murid Sekolah';
    if (user.role === 'coaching_sisc') return 'Murid Daerah';
    if (user.role === 'tactical_ppd') return 'Murid PPD';
    return 'Senarai Murid';
  };

  const getPageDescription = () => {
    if (!user) return 'Pengurusan data murid';
    const scope = getScopeDescription(user.role, user);
    if (user.role === 'operational_teacher') return `Pengurusan data peperiksaan murid - ${getTeacherSubject()} (${scope})`;
    if (user.role === 'operational_school') return `Pengurusan data peperiksaan murid sekolah (${scope})`;
    if (user.role === 'coaching_sisc') return `Pencerapan murid subjek ${user.subject || 'khusus'} (${scope})`;
    if (user.role === 'tactical_ppd') return `Pemantauan murid daerah (${scope})`;
    return `Pengurusan data murid (${scope})`;
  };

  const getUserRole = () => {
    if (!user) return 'Pengguna';
    return getRoleDisplayName(user.role);
  };

  const getTeacherSubject = () => {
    if (!user) return 'Subjek';
    return user.subject || 'Bahasa Melayu'; // Default
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && error.includes('User not logged in')) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Murid</h1>
          <p className="text-gray-600 mt-1">Sila log masuk untuk mengakses data murid</p>
        </div>

        {/* Login Required Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Log Masuk Diperlukan</h3>
          <p className="text-blue-800 mb-4">
            Anda perlu log masuk untuk mengakses data murid. Sila log masuk dengan akaun yang sah.
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.href = '/login'} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Pergi ke Halaman Log Masuk
            </button>
            <button 
              onClick={() => {
                // Create a demo session for testing
                const demoUser = {
                  email: 'demo@johorup.gov.my',
                  role: 'operational_teacher',
                  name: 'Demo User',
                  school_name: 'SMK Demo',
                  ppd_name: 'PPD Demo',
                  subject: 'Bahasa Melayu'
                };
                sessionStorage.setItem('currentUser', JSON.stringify(demoUser));
                window.location.reload();
              }} 
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Gunakan Demo Mode
            </button>
          </div>
        </div>

        {/* Demo Users List */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Demo Users untuk Testing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Super Admin:</strong> admin@s4pd.gov.my / admin123
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Admin SPB:</strong> admin@spb.gov.my / admin123
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>PPD User:</strong> ppd@kluang.gov.my / ppd123
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>SISC+:</strong> sisc@bahasamelayu.gov.my / sisc123
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>School Admin:</strong> admin@smktjj.edu.my / school123
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Teacher:</strong> teacher@bahasamelayu.edu.my / teacher123
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    // Fallback mode with sample data for demonstration
    const fallbackStudents = [
      {
        id: 1,
        name: "Ahmad Bin Ali",
        ic_number: "051234567890",
        class_level: "Tingkatan 4",
        class_name: "4 Bestari",
        school_name: "SMK Taman Johor Jaya",
        ppd_name: "PPD Johor Bahru",
        district: "Johor Bahru"
      },
      {
        id: 2,
        name: "Siti Nurhaliza Binti Hassan",
        ic_number: "051234567891",
        class_level: "Tingkatan 4",
        class_name: "4 Cemerlang",
        school_name: "SMK Bandar Baru Uda",
        ppd_name: "PPD Johor Bahru",
        district: "Johor Bahru"
      },
      {
        id: 3,
        name: "Raj Kumar A/L Subramaniam",
        ic_number: "051234567892",
        class_level: "Tingkatan 4",
        class_name: "4 Bijak",
        school_name: "SMK Taman Sentosa",
        ppd_name: "PPD Johor Bahru",
        district: "Johor Bahru"
      }
    ];

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Murid (Demo Mode)</h1>
          <p className="text-gray-600 mt-1">Sistem sedang dalam mod demo kerana API tidak dapat diakses</p>
        </div>

        {/* Error Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-2">API Connection Error</h3>
              <p className="text-sm text-red-700 mb-3">
                {error}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Retry Connection
                </button>
                <button 
                  onClick={() => console.log('Debug info:', { error, timestamp: new Date().toISOString() })} 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Log Debug Info
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Data Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Demo Data - Senarai Murid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Data di bawah adalah contoh sahaja. Sistem sedang menggunakan mod demo kerana API tidak dapat diakses.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Nama Murid</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">No. IC</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Kelas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Sekolah</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">PPD</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fallbackStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{student.ic_number}</td>
                      <td className="py-3 px-4 text-gray-700">{student.class_level} {student.class_name}</td>
                      <td className="py-3 px-4 text-gray-700">{student.school_name}</td>
                      <td className="py-3 px-4 text-gray-700">{student.ppd_name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">
                          Demo Mode
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Panduan Penyelesaian Masalah</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Sistem sedang dalam mod demo kerana API tidak dapat diakses</li>
              <li>• Sila hubungi pentadbir sistem untuk menyelesaikan masalah sambungan API</li>
              <li>• Klik "Retry Connection" untuk cuba sambung semula</li>
              <li>• Klik "Log Debug Info" untuk melihat maklumat debug di console browser</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !permissions?.canEditStudents) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Access denied. This page is only available for authorized users.
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
              <p className="text-xs text-gray-500">Skop: {getScopeDescription(user.role, user)}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-medium text-gray-900">Jumlah Murid</div>
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
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
              {user.role === 'operational_teacher' ? `Senarai Murid - ${getTeacherSubject()}` : 
               user.role === 'operational_school' ? 'Senarai Murid Sekolah' :
               user.role === 'coaching_sisc' ? `Senarai Murid - ${user.subject || 'Subjek Khusus'}` :
               'Senarai Murid'}
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Sekolah</th>
                    {(user.role === 'tactical_ppd' || user.role === 'coaching_sisc' || permissions?.canViewAll) && (
                      <th className="text-left py-3 px-4 font-medium text-gray-600">PPD</th>
                    )}
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
                        {student.district && (
                          <div className="text-xs text-gray-500">{student.district}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{student.ic_number}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {student.class_level && student.class_name 
                          ? `${student.class_level} ${student.class_name}`
                          : 'N/A'
                        }
                      </td>
                      <td className="py-3 px-4 text-gray-700">{student.school_name}</td>
                      {(user.role === 'tactical_ppd' || user.role === 'coaching_sisc' || permissions?.canViewAll) && (
                        <td className="py-3 px-4 text-gray-700">{student.ppd_name || 'N/A'}</td>
                      )}
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
                : user.role === 'operational_school'
                ? 'Belum ada murid yang didaftarkan di sekolah ini. Sila hubungi pentadbir sistem untuk mendapatkan senarai murid.'
                : user.role === 'coaching_sisc'
                ? `Belum ada murid dalam PPD ${user.ppd_name || 'ini'} untuk subjek ${user.subject || 'khusus'}. Data murid akan dipaparkan setelah sekolah mendaftar murid.`
                : user.role === 'tactical_ppd'
                ? `Belum ada murid dalam PPD ${user.ppd_name || 'ini'}. Data murid akan dipaparkan setelah sekolah mendaftar murid.`
                : 'Belum ada data murid tersedia untuk skop akses anda.'
              }
            </p>
            {permissions?.canViewAll && (
              <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <strong>Nota untuk Admin:</strong> Sila pastikan data murid telah diimport ke dalam sistem melalui fungsi import data atau hubungi pentadbir teknikal.
              </div>
            )}
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