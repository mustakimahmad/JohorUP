'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockPrograms, mockSubjects, mockSchools, mockStudents, mockTeachers } from '@/lib/mockData';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';
import MaintenanceCheck, { useMaintenanceMode } from '@/components/MaintenanceCheck';

export default function TuitionReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const { isMaintenanceMode, canUpdate, isReadOnlyMode } = useMaintenanceMode();

  // Form states
  const [formData, setFormData] = useState({
    program_id: '',
    date: '',
    time_start: '',
    time_end: '',
    subject_id: '',
    teacher_id: '',
    topics_covered: '',
    teaching_methods: '',
    student_response: '',
    challenges: '',
    recommendations: '',
    notes: '',
  });

  const [reportFiles, setReportFiles] = useState<File[]>([]);
  const [tuitionPhotos, setTuitionPhotos] = useState<File[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<string[]>(['', '', '']);
  const [selectedStudents, setSelectedStudents] = useState<{[key: number]: boolean}>({});
  const [studentAbsenceReasons, setStudentAbsenceReasons] = useState<{[key: number]: string}>({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (parsedUser.role !== 'school') {
        router.push('/dashboard');
      }

      // Load existing reports (mock data)
      setReports([
        {
          id: 1,
          date: '2026-01-15',
          program: 'Program Intensif Bahasa Melayu',
          teacher: 'Cikgu Ahmad bin Abdullah',
          subject: 'Bahasa Melayu',
          students_present: 18,
          total_students: 20,
          status: 'submitted',
          submitted_date: '2026-01-15',
          has_report_file: true,
          has_photos: true,
          photo_count: 3
        },
        {
          id: 2,
          date: '2026-01-17',
          program: 'Kelas Tambahan Matematik',
          teacher: 'Cikgu Siti Nurhaliza',
          subject: 'Matematik',
          students_present: 15,
          total_students: 16,
          status: 'draft',
          has_report_file: false,
          has_photos: false,
          photo_count: 0
        }
      ]);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user || user.role !== 'school') return null;

  const school = mockSchools.find(s => s.id === user.school_id);
  
  // Get teachers for this school
  const schoolTeachers = mockTeachers.filter(t => t.school_id === user.school_id);
  
  // Get students for this school (targeted students)
  const schoolStudents = mockStudents.filter(s => s.school_id === user.school_id);
  
  // Get selected teacher info
  const selectedTeacher = schoolTeachers.find(t => t.id === parseInt(formData.teacher_id));

  // Absence reasons
  const absenceReasons = [
    'Cuti sakit',
    'Terlibat program sekolah',
    'Mewakili sekolah ke pertandingan',
    'Tidak hadir tanpa kenyataan'
  ];

  const handleSubmitReport = () => {
    // Check if updates are allowed during maintenance
    if (!canUpdate(user?.role)) {
      alert('Sistem sedang dalam mod penyelenggaraan. Kemaskini data tidak dibenarkan buat masa ini.');
      return;
    }

    // Validate required fields
    const studentsPresent = Object.values(selectedStudents).filter(Boolean).length;
    
    if (!formData.program_id || !formData.date || !formData.teacher_id || 
        !formData.topics_covered || reportFiles.length === 0 || tuitionPhotos.length < 3 ||
        studentsPresent === 0) {
      alert('Sila lengkapkan semua maklumat yang diperlukan termasuk fail laporan, 3 gambar tuisyen, dan pilih sekurang-kurangnya seorang murid yang hadir.');
      return;
    }

    const newReport = {
      id: Date.now(),
      date: formData.date,
      program: mockPrograms.find(p => p.id === parseInt(formData.program_id))?.title || '',
      teacher: selectedTeacher?.name || '',
      subject: mockSubjects.find(s => s.id === parseInt(formData.subject_id))?.name || '',
      students_present: studentsPresent,
      total_students: schoolStudents.length,
      status: 'submitted',
      submitted_date: new Date().toISOString().split('T')[0],
      has_report_file: true,
      has_photos: true,
      photo_count: tuitionPhotos.length
    };

    setReports([newReport, ...reports]);
    setShowReportForm(false);
    
    // Reset form
    setFormData({
      program_id: '',
      date: '',
      time_start: '',
      time_end: '',
      subject_id: '',
      teacher_id: '',
      topics_covered: '',
      teaching_methods: '',
      student_response: '',
      challenges: '',
      recommendations: '',
      notes: '',
    });
    setReportFiles([]);
    setTuitionPhotos([]);
    setPhotoCaptions(['', '', '']);
    setSelectedStudents({});
    setStudentAbsenceReasons({});

    alert('Laporan tuisyen berjaya dihantar!');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draf' },
      submitted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Dihantar' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Diluluskan' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <MaintenanceCheck userRole={user?.role}>
      <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Laporan"
        subtitle="Laporan pelaksanaan tuisyen oleh guru dengan bukti dan gambar"
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Maintenance Mode Banner */}
        {isReadOnlyMode(user?.role) && (
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-orange-800 font-medium">Sistem Dalam Mod Penyelenggaraan</p>
                <p className="text-orange-700 text-sm">Kemaskini data tidak dibenarkan buat masa ini. Anda hanya boleh melihat data sedia ada.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan - {school?.name}</h1>
            <p className="text-sm text-gray-600 mt-1">Guru perlu muat naik bukti laporan dan gambar tuisyen yang dilaksanakan</p>
          </div>
          <button
            onClick={() => setShowReportForm(true)}
            disabled={!canUpdate(user?.role)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              canUpdate(user?.role) 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Laporan Baru
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jumlah Laporan</p>
                <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
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
                <p className="text-sm text-gray-600">Dihantar</p>
                <p className="text-3xl font-bold text-green-600">{reports.filter(r => r.status === 'submitted').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dengan Bukti</p>
                <p className="text-3xl font-bold text-purple-600">{reports.filter(r => r.has_report_file).length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dengan Gambar</p>
                <p className="text-3xl font-bold text-orange-600">{reports.filter(r => r.has_photos).length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Senarai Laporan Tuisyen</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarikh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjek</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kehadiran</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bukti</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(report.date).toLocaleDateString('ms-MY')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.program}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.teacher}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {report.students_present}/{report.total_students}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {report.has_report_file && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Laporan
                          </span>
                        )}
                        {report.has_photos && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {report.photo_count} Gambar
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Form Modal */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Laporan Tuisyen Baru</h2>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Keperluan Laporan:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Maklumat lengkap pelaksanaan tuisyen</li>
                  <li>• Pilih guru pelaksana dari dropdown</li>
                  <li>• Tandakan murid yang hadir (sekurang-kurangnya 1 murid)</li>
                  <li>• Pilih alasan untuk murid yang tidak hadir</li>
                  <li>• Fail laporan (PDF/Word) - WAJIB</li>
                  <li>• 3 gambar tuisyen yang dilaksanakan - WAJIB</li>
                  <li>• Keterangan untuk setiap gambar</li>
                </ul>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSubmitReport(); }} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                    <select
                      value={formData.program_id}
                      onChange={(e) => setFormData({...formData, program_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Pilih Program</option>
                      {mockPrograms.map(program => (
                        <option key={program.id} value={program.id}>{program.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh Pelaksanaan</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Masa Mula</label>
                    <input
                      type="time"
                      value={formData.time_start}
                      onChange={(e) => setFormData({...formData, time_start: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Masa Tamat</label>
                    <input
                      type="time"
                      value={formData.time_end}
                      onChange={(e) => setFormData({...formData, time_end: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                    <select
                      value={formData.subject_id}
                      onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Pilih Subjek</option>
                      {mockSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guru Pelaksana</label>
                    <select
                      value={formData.teacher_id}
                      onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Pilih Guru</option>
                      {schoolTeachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} - {mockSubjects.find(s => s.id === teacher.subject_id)?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Student Attendance Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kehadiran Murid</h3>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Arahan:</strong> Tandakan murid yang hadir dalam sesi tuisyen ini. Untuk murid yang tidak hadir, sila pilih alasan ketidakhadiran dari dropdown.
                    </p>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Senarai Murid Disasarkan</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const allSelected: {[key: number]: boolean} = {};
                            schoolStudents.forEach(student => {
                              allSelected[student.id] = true;
                            });
                            setSelectedStudents(allSelected);
                          }}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Pilih Semua
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedStudents({})}
                          className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Nyahpilih Semua
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {schoolStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border-b border-gray-100">
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="checkbox"
                              id={`student-${student.id}`}
                              checked={selectedStudents[student.id] || false}
                              onChange={(e) => {
                                setSelectedStudents({
                                  ...selectedStudents,
                                  [student.id]: e.target.checked
                                });
                                // Clear absence reason if student is marked present
                                if (e.target.checked) {
                                  const newReasons = {...studentAbsenceReasons};
                                  delete newReasons[student.id];
                                  setStudentAbsenceReasons(newReasons);
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`student-${student.id}`} className="cursor-pointer flex-1">
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">Kelas {student.class}</div>
                            </label>
                          </div>
                          
                          {/* Absence Reason Dropdown - only show if student is not selected (absent) */}
                          {!selectedStudents[student.id] && (
                            <div className="ml-4 w-48">
                              <select
                                value={studentAbsenceReasons[student.id] || ''}
                                onChange={(e) => setStudentAbsenceReasons({
                                  ...studentAbsenceReasons,
                                  [student.id]: e.target.value
                                })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Pilih alasan...</option>
                                {absenceReasons.map(reason => (
                                  <option key={reason} value={reason}>{reason}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          
                          {/* Status indicator */}
                          <div className="ml-2 w-16 text-right">
                            {selectedStudents[student.id] ? (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                Hadir
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                Tidak
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Kehadiran:</span>
                        <span className="ml-2 text-green-600 font-semibold">
                          {Object.values(selectedStudents).filter(Boolean).length} hadir
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Tidak Hadir:</span>
                        <span className="ml-2 text-red-600 font-semibold">
                          {schoolStudents.length - Object.values(selectedStudents).filter(Boolean).length} murid
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Jumlah:</span>
                        <span className="ml-2 text-gray-900 font-semibold">
                          {schoolStudents.length} murid
                        </span>
                      </div>
                    </div>
                    
                    {/* Show absence reasons summary */}
                    {Object.keys(studentAbsenceReasons).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-2">Alasan Ketidakhadiran:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {absenceReasons.map(reason => {
                            const count = Object.values(studentAbsenceReasons).filter(r => r === reason).length;
                            if (count > 0) {
                              return (
                                <div key={reason} className="flex justify-between">
                                  <span className="text-gray-600">{reason}:</span>
                                  <span className="font-semibold text-gray-900">{count} murid</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Report Content */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kandungan Laporan</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topik yang Diajar</label>
                    <textarea
                      value={formData.topics_covered}
                      onChange={(e) => setFormData({...formData, topics_covered: e.target.value})}
                      rows={3}
                      placeholder="Nyatakan topik-topik yang telah diajar dalam sesi tuisyen ini..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kaedah Pengajaran</label>
                    <textarea
                      value={formData.teaching_methods}
                      onChange={(e) => setFormData({...formData, teaching_methods: e.target.value})}
                      rows={2}
                      placeholder="Kaedah dan teknik pengajaran yang digunakan..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Respons Murid</label>
                    <textarea
                      value={formData.student_response}
                      onChange={(e) => setFormData({...formData, student_response: e.target.value})}
                      rows={2}
                      placeholder="Bagaimana respons dan penglibatan murid dalam sesi ini..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cabaran yang Dihadapi</label>
                    <textarea
                      value={formData.challenges}
                      onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                      rows={2}
                      placeholder="Cabaran atau masalah yang dihadapi semasa sesi..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cadangan Penambahbaikan</label>
                    <textarea
                      value={formData.recommendations}
                      onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                      rows={2}
                      placeholder="Cadangan untuk menambahbaik sesi akan datang..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Muat Naik Bukti</h3>
                  
                  {/* Report File Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fail Laporan (PDF/Word) <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files) {
                            setReportFiles(Array.from(e.target.files));
                          }
                        }}
                        className="w-full"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Muat naik fail laporan lengkap pelaksanaan tuisyen (PDF atau Word)
                      </p>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Tuisyen (3 gambar) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[0, 1, 2].map(index => (
                        <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gambar {index + 1}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const newPhotos = [...tuitionPhotos];
                                newPhotos[index] = e.target.files[0];
                                setTuitionPhotos(newPhotos);
                              }
                            }}
                            className="w-full mb-2"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Keterangan gambar"
                            value={photoCaptions[index]}
                            onChange={(e) => {
                              const newCaptions = [...photoCaptions];
                              newCaptions[index] = e.target.value;
                              setPhotoCaptions(newCaptions);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Hantar Laporan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
    </MaintenanceCheck>
  );
}