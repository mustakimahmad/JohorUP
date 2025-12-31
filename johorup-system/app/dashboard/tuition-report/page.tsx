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

interface TuitionSession {
  id: number;
  date: string;
  program: string;
  subject: string;
  time_start: string;
  time_end: string;
  topics_covered: string;
  teaching_methods: string;
  student_response: string;
  challenges: string;
  recommendations: string;
  students_attended: number;
  total_students: number;
  notes: string;
  status: 'draft' | 'submitted' | 'approved';
  has_report_file: boolean;
  has_photos: boolean;
  photo_count: number;
}

export default function TuitionReportPage() {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<TuitionSession[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    program: '',
    date: '',
    time_start: '',
    time_end: '',
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

  // Transfer period status
  const transferStatus = getTransferPeriodStatus();
  const canMakeTransfers = user ? canUserMakeTransfers(user.role) : false;
  const isTransferAllowed = isStudentTransferAllowed() && canMakeTransfers;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      loadSessions();
    }
  }, []);

  const loadSessions = () => {
    // Sample sessions - in production this would come from API
    const sampleSessions: TuitionSession[] = [];
    setSessions(sampleSessions);
  };

  const getTeacherSubject = () => {
    if (!user) return 'Subjek';
    if (user.email?.includes('bahasamelayu') || user.name?.toLowerCase().includes('bahasa')) return 'Bahasa Melayu';
    if (user.email?.includes('sejarah') || user.name?.toLowerCase().includes('sejarah')) return 'Sejarah';
    if (user.email?.includes('matematik') || user.name?.toLowerCase().includes('matematik')) return 'Matematik';
    return 'Bahasa Melayu'; // Default
  };

  // Sample students for the teacher's subject
  const getStudentsForSubject = () => {
    // In production, this would come from API based on teacher's subject and school
    return [];
  };

  const students = getStudentsForSubject();

  // Absence reasons
  const absenceReasons = [
    'Cuti sakit',
    'Terlibat program sekolah',
    'Mewakili sekolah ke pertandingan',
    'Tidak hadir tanpa kenyataan'
  ];

  const addSession = () => {
    // Check transfer restrictions first
    if (!isTransferAllowed) {
      alert('Laporan tuisyen tidak dapat dihantar pada masa ini. ' + getTransferRestrictionMessage(user.role));
      return;
    }

    // Validate required fields
    const studentsPresent = Object.values(selectedStudents).filter(Boolean).length;
    
    if (!formData.program || !formData.date || !formData.topics_covered || 
        reportFiles.length === 0 || tuitionPhotos.length < 3 || studentsPresent === 0) {
      alert('Sila lengkapkan semua maklumat yang diperlukan termasuk fail laporan, 3 gambar tuisyen, dan pilih sekurang-kurangnya seorang murid yang hadir.');
      return;
    }

    const newSession: TuitionSession = {
      id: sessions.length + 1,
      date: formData.date,
      program: formData.program,
      subject: getTeacherSubject(),
      time_start: formData.time_start,
      time_end: formData.time_end,
      topics_covered: formData.topics_covered,
      teaching_methods: formData.teaching_methods,
      student_response: formData.student_response,
      challenges: formData.challenges,
      recommendations: formData.recommendations,
      students_attended: studentsPresent,
      total_students: students.length,
      notes: formData.notes,
      status: 'submitted',
      has_report_file: true,
      has_photos: true,
      photo_count: tuitionPhotos.length
    };
    
    setSessions([newSession, ...sessions]);
    setShowAddForm(false);
    
    // Reset form
    setFormData({
      program: '',
      date: '',
      time_start: '',
      time_end: '',
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

  const getSessionStats = () => {
    const totalSessions = sessions.length;
    const submittedSessions = sessions.filter(s => s.status === 'submitted').length;
    const withReportFile = sessions.filter(s => s.has_report_file).length;
    const withPhotos = sessions.filter(s => s.has_photos).length;
    
    return { totalSessions, submittedSessions, withReportFile, withPhotos };
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

  const stats = getSessionStats();

  if (!user || user.role !== 'operational_teacher') {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Access denied. This page is only available for teachers.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Tuisyen</h1>
            <p className="text-gray-600 mt-1">Laporan pelaksanaan tuisyen dengan bukti dan gambar - {getTeacherSubject()}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={!isTransferAllowed}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              isTransferAllowed 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            title={!isTransferAllowed ? getTransferRestrictionMessage(user.role) : 'Buat laporan tuisyen baru'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isTransferAllowed ? 'Laporan Baru' : 'Tidak Dibenarkan'}
          </button>
        </div>
      </div>

      {/* Teacher Info */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">Guru {getTeacherSubject()}</p>
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
                    ? 'Tempoh Laporan Tuisyen Aktif' 
                    : transferStatus.status === 'before'
                    ? 'Tempoh Laporan Tuisyen Belum Bermula'
                    : 'Tempoh Laporan Tuisyen Telah Tamat'
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
            <div className="text-sm text-gray-600">Jumlah Laporan</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.submittedSessions}</div>
            <div className="text-sm text-gray-600">Dihantar</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.withReportFile}</div>
            <div className="text-sm text-gray-600">Dengan Bukti</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.withPhotos}</div>
            <div className="text-sm text-gray-600">Dengan Gambar</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      {sessions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Senarai Laporan Tuisyen - {getTeacherSubject()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarikh</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Masa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kehadiran</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bukti</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(session.date).toLocaleDateString('ms-MY')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{session.program}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {session.time_start} - {session.time_end}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {session.students_attended}/{session.total_students}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {session.has_report_file && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Laporan
                            </span>
                          )}
                          {session.has_photos && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {session.photo_count} Gambar
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(session.status)}</td>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tiada Laporan Tuisyen</h3>
            <p className="text-gray-600 mb-6">
              Belum ada laporan tuisyen yang direkodkan untuk subjek {getTeacherSubject()}. 
              Klik butang "Laporan Baru" untuk merekod laporan tuisyen pertama.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              disabled={!isTransferAllowed}
              className={`px-6 py-3 rounded-lg font-medium ${
                isTransferAllowed 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              title={!isTransferAllowed ? getTransferRestrictionMessage(user.role) : 'Buat laporan tuisyen pertama'}
            >
              {isTransferAllowed ? 'Laporan Pertama' : 'Tidak Dibenarkan'}
            </button>
          </CardContent>
        </Card>
      )}

      {/* Report Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Laporan Tuisyen Baru</h2>
              <button
                onClick={() => setShowAddForm(false)}
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
                <li>• Tandakan murid yang hadir (sekurang-kurangnya 1 murid)</li>
                <li>• Pilih alasan untuk murid yang tidak hadir</li>
                <li>• Fail laporan (PDF/Word) - WAJIB</li>
                <li>• 3 gambar tuisyen yang dilaksanakan - WAJIB</li>
                <li>• Keterangan untuk setiap gambar</li>
              </ul>
            </div>

            {/* Transfer Period Warning */}
            {!isTransferAllowed && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Laporan Tidak Dapat Dihantar</p>
                    <p className="text-xs text-red-700 mt-1">{getTransferRestrictionMessage(user.role)}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); addSession(); }} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                  <input
                    type="text"
                    value={formData.program}
                    onChange={(e) => setFormData({...formData, program: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama program tuisyen"
                    required
                  />
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                  <input
                    type="text"
                    value={getTeacherSubject()}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
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
                
                {students.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Senarai Murid {getTeacherSubject()}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const allSelected: {[key: number]: boolean} = {};
                            students.forEach((student: any) => {
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
                      {students.map((student: any) => (
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
                ) : (
                  <div className="p-6 text-center border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-600">Tiada murid ditemui untuk subjek {getTeacherSubject()}.</p>
                    <p className="text-sm text-gray-500 mt-1">Sila hubungi pentadbir sekolah untuk mendapatkan senarai murid.</p>
                  </div>
                )}
                
                {students.length > 0 && (
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
                          {students.length - Object.values(selectedStudents).filter(Boolean).length} murid
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Jumlah:</span>
                        <span className="ml-2 text-gray-900 font-semibold">
                          {students.length} murid
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
                )}
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
                  disabled={!isTransferAllowed}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    isTransferAllowed 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  {isTransferAllowed ? 'Hantar Laporan' : 'Tidak Dibenarkan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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
          <h4 className="font-medium text-blue-900 mb-2">Panduan Laporan Tuisyen</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Klik "Laporan Baru" untuk merekod laporan tuisyen yang telah dijalankan</li>
            <li>• Masukkan maklumat lengkap termasuk tarikh, masa, dan topik yang diajar</li>
            <li>• Tandakan kehadiran murid dan pilih alasan untuk yang tidak hadir</li>
            <li>• Muat naik fail laporan (PDF/Word) dan 3 gambar tuisyen - WAJIB</li>
            <li>• Tambahkan keterangan untuk setiap gambar yang dimuat naik</li>
            <li>• Laporan ini akan digunakan untuk pemantauan dan penilaian program tuisyen</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}