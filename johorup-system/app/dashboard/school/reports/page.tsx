'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockPrograms, mockProgramReports, mockStudentAttendance, mockProgramPhotos, mockStudents, mockSubjects } from '@/lib/mockData';
import { ProgramReport, StudentAttendance, ProgramPhoto } from '@/lib/types';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function SchoolReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ProgramReport | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    program_id: '',
    session_title: '',
    subject_id: '',
    teacher_name: '',
    duration_hours: '',
    topics_covered: '',
    notes: '',
  });

  const [attendanceData, setAttendanceData] = useState<{[key: number]: {present: boolean, notes: string}}>({});
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<string[]>(['', '', '']);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Initialize attendance data for school students
      if (parsedUser.school_id) {
        const schoolStudents = mockStudents.filter(s => s.school_id === parsedUser.school_id);
        const initialAttendance: {[key: number]: {present: boolean, notes: string}} = {};
        schoolStudents.forEach(student => {
          initialAttendance[student.id] = { present: true, notes: '' };
        });
        setAttendanceData(initialAttendance);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  // Filter reports for current school
  const schoolReports = mockProgramReports.filter(report => report.school_id === user.school_id);
  const schoolStudents = mockStudents.filter(s => s.school_id === user.school_id);

  const handleCreateReport = () => {
    // Simulate creating new report
    const newReport: ProgramReport = {
      id: Date.now(),
      program_id: parseInt(formData.program_id),
      school_id: user.school_id,
      report_date: new Date().toISOString().split('T')[0],
      session_title: formData.session_title,
      subject_id: parseInt(formData.subject_id),
      teacher_name: formData.teacher_name,
      duration_hours: parseFloat(formData.duration_hours),
      topics_covered: formData.topics_covered,
      notes: formData.notes,
      status: 'draft',
      submitted_by: user.id,
    };

    console.log('New report created:', newReport);
    setShowCreateForm(false);
    setFormData({
      program_id: '',
      session_title: '',
      subject_id: '',
      teacher_name: '',
      duration_hours: '',
      topics_covered: '',
      notes: '',
    });
  };

  const handleSubmitAttendance = () => {
    if (!selectedReport) return;

    const attendanceRecords = Object.entries(attendanceData).map(([studentId, data]) => ({
      id: Date.now() + parseInt(studentId),
      program_report_id: selectedReport.id,
      student_id: parseInt(studentId),
      present: data.present,
      notes: data.notes,
    }));

    console.log('Attendance submitted:', attendanceRecords);
    setShowAttendanceModal(false);
  };

  const handlePhotoUpload = () => {
    if (!selectedReport) return;

    const photoRecords = photoFiles.map((file, index) => ({
      id: Date.now() + index,
      program_report_id: selectedReport.id,
      photo_url: URL.createObjectURL(file),
      caption: photoCaptions[index],
      uploaded_date: new Date().toISOString(),
    }));

    console.log('Photos uploaded:', photoRecords);
    setShowPhotoModal(false);
    setPhotoFiles([]);
    setPhotoCaptions(['', '', '']);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draf' },
      submitted: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Dihantar' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Diluluskan' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Laporan Program"
        subtitle="Pengisian program oleh guru dan muat naik gambar pelaksanaan"
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan Program</h1>
            <p className="text-sm text-gray-600 mt-1">Guru mengisi pengisian program yang dilaksanakan dan muat naik gambar</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Pengisian Baru
          </button>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarikh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tajuk Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjek</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru Pelaksana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tempoh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schoolReports.map((report) => {
                  const subject = mockSubjects.find(s => s.id === report.subject_id);
                  const reportAttendance = mockStudentAttendance.filter(a => a.program_report_id === report.id);
                  const reportPhotos = mockProgramPhotos.filter(p => p.program_report_id === report.id);
                  
                  return (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(report.report_date).toLocaleDateString('ms-MY')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{report.session_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{subject?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{report.teacher_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{report.duration_hours} jam</td>
                      <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setShowAttendanceModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            title="Kehadiran"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setShowPhotoModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 text-sm"
                            title="Gambar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <span className="text-xs text-gray-500">
                            {reportAttendance.length > 0 && `${reportAttendance.filter(a => a.present).length}/${reportAttendance.length}`}
                          </span>
                          <span className="text-xs text-gray-500">
                            {reportPhotos.length > 0 && `${reportPhotos.length} foto`}
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

        {/* Create Report Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pengisian Program Baru</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Arahan:</strong> Sila isi maklumat program yang telah dilaksanakan. Pastikan semua maklumat adalah tepat dan lengkap.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateReport(); }} className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tajuk Sesi</label>
                  <input
                    type="text"
                    value={formData.session_title}
                    onChange={(e) => setFormData({...formData, session_title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempoh (jam)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({...formData, duration_hours: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Guru</label>
                  <input
                    type="text"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({...formData, teacher_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pengisian Program yang Dilaksanakan</label>
                  <textarea
                    value={formData.topics_covered}
                    onChange={(e) => setFormData({...formData, topics_covered: e.target.value})}
                    rows={4}
                    placeholder="Nyatakan secara terperinci aktiviti, topik, dan kaedah pengajaran yang telah dilaksanakan..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    placeholder="Catatan mengenai pencapaian murid, cabaran yang dihadapi, atau cadangan penambahbaikan..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Simpan Pengisian
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Attendance Modal */}
        {showAttendanceModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Kehadiran Murid</h2>
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Sesi:</strong> {selectedReport.session_title}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Tarikh:</strong> {new Date(selectedReport.report_date).toLocaleDateString('ms-MY')}
                </p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schoolStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">Kelas {student.class}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={attendanceData[student.id]?.present || false}
                          onChange={(e) => setAttendanceData({
                            ...attendanceData,
                            [student.id]: {
                              ...attendanceData[student.id],
                              present: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Hadir</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Catatan (jika tidak hadir)"
                        value={attendanceData[student.id]?.notes || ''}
                        onChange={(e) => setAttendanceData({
                          ...attendanceData,
                          [student.id]: {
                            ...attendanceData[student.id],
                            notes: e.target.value
                          }
                        })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded w-48"
                        disabled={attendanceData[student.id]?.present}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 mt-4 border-t">
                <button
                  onClick={handleSubmitAttendance}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Simpan Kehadiran
                </button>
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Upload Modal */}
        {showPhotoModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Upload Gambar</h2>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Muat Naik Gambar:</strong> Sila muat naik 3 gambar yang menunjukkan pelaksanaan program. Gambar hendaklah jelas dan menunjukkan aktiviti pembelajaran.
                </p>
              </div>

              <div className="space-y-4">
                {[0, 1, 2].map(index => (
                  <div key={index} className="border rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar {index + 1}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = [...photoFiles];
                        if (e.target.files?.[0]) {
                          files[index] = e.target.files[0];
                          setPhotoFiles(files);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Keterangan gambar"
                      value={photoCaptions[index]}
                      onChange={(e) => {
                        const captions = [...photoCaptions];
                        captions[index] = e.target.value;
                        setPhotoCaptions(captions);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 mt-4 border-t">
                <button
                  onClick={handlePhotoUpload}
                  disabled={photoFiles.length < 3}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Upload Gambar
                </button>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}