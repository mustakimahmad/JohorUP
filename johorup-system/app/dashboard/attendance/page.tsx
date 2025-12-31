'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Student {
  id: number;
  name: string;
  ic_number: string;
  class: string;
}

interface AttendanceRecord {
  student_id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export default function AttendancePage() {
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      loadStudents();
    }
  }, []);

  const loadStudents = () => {
    // Sample students - in production this would come from API
    const sampleStudents: Student[] = [];
    setStudents(sampleStudents);
  };

  const getTeacherSubject = () => {
    if (!user) return 'Subjek';
    if (user.email?.includes('bahasamelayu') || user.name?.toLowerCase().includes('bahasa')) return 'Bahasa Melayu';
    if (user.email?.includes('sejarah') || user.name?.toLowerCase().includes('sejarah')) return 'Sejarah';
    if (user.email?.includes('matematik') || user.name?.toLowerCase().includes('matematik')) return 'Matematik';
    return 'Bahasa Melayu'; // Default
  };

  const getAttendanceForStudent = (studentId: number, date: string) => {
    return attendanceRecords.find(record => 
      record.student_id === studentId && record.date === date
    );
  };

  const updateAttendance = (studentId: number, status: 'present' | 'absent' | 'late', notes?: string) => {
    const existingIndex = attendanceRecords.findIndex(record => 
      record.student_id === studentId && record.date === selectedDate
    );

    const newRecord: AttendanceRecord = {
      student_id: studentId,
      date: selectedDate,
      status,
      notes
    };

    if (existingIndex >= 0) {
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingIndex] = newRecord;
      setAttendanceRecords(updatedRecords);
    } else {
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  const getAttendanceStats = () => {
    const todayRecords = attendanceRecords.filter(record => record.date === selectedDate);
    const present = todayRecords.filter(record => record.status === 'present').length;
    const absent = todayRecords.filter(record => record.status === 'absent').length;
    const late = todayRecords.filter(record => record.status === 'late').length;
    const total = students.length;

    return { present, absent, late, total };
  };

  const stats = getAttendanceStats();

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
        <h1 className="text-3xl font-bold text-gray-900">Kehadiran</h1>
        <p className="text-gray-600 mt-1">Pengurusan kehadiran murid - {getTeacherSubject()}</p>
      </div>

      {/* Date Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarikh Kehadiran
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">
                Subjek: <span className="font-medium text-gray-900">{getTeacherSubject()}</span>
              </div>
              <div className="text-sm text-gray-600">
                Guru: <span className="font-medium text-gray-900">{user.name}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Jumlah Murid</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-600">Hadir</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            <div className="text-sm text-gray-600">Lewat</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-600">Tidak Hadir</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance List */}
      {students.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Senarai Kehadiran - {new Date(selectedDate).toLocaleDateString('ms-MY')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => {
                const attendance = getAttendanceForStudent(student.id, selectedDate);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.class} • {student.ic_number}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateAttendance(student.id, 'present')}
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          attendance?.status === 'present'
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                        }`}
                      >
                        Hadir
                      </button>
                      <button
                        onClick={() => updateAttendance(student.id, 'late')}
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          attendance?.status === 'late'
                            ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                        }`}
                      >
                        Lewat
                      </button>
                      <button
                        onClick={() => updateAttendance(student.id, 'absent')}
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          attendance?.status === 'absent'
                            ? 'bg-red-100 text-red-800 border-2 border-red-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                        }`}
                      >
                        Tidak Hadir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {students.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Kehadiran: {stats.present}/{stats.total} murid ({stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%)
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    Simpan Kehadiran
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tiada Murid Ditemui</h3>
            <p className="text-gray-600 mb-4">
              Belum ada murid yang ditugaskan untuk subjek {getTeacherSubject()}. 
              Sila hubungi pentadbir sekolah untuk mendapatkan senarai murid.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {students.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Tindakan Pantas</h4>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  students.forEach(student => updateAttendance(student.id, 'present'));
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Tandakan Semua Hadir
              </button>
              <button
                onClick={() => {
                  students.forEach(student => updateAttendance(student.id, 'absent'));
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Tandakan Semua Tidak Hadir
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">Panduan Kehadiran</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Pilih tarikh untuk merekod kehadiran murid</li>
            <li>• Klik butang "Hadir", "Lewat", atau "Tidak Hadir" untuk setiap murid</li>
            <li>• Gunakan "Tindakan Pantas" untuk menandakan semua murid sekaligus</li>
            <li>• Klik "Simpan Kehadiran" untuk menyimpan rekod kehadiran</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}