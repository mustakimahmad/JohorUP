'use client';

import { useState } from 'react';
import { mockTeachers, mockTeacherKPIs, mockSchools, mockSubjects, mockPPDs } from '@/lib/mockData';
import NavigationBar from '@/components/NavigationBar';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPPD, setSelectedPPD] = useState('all');

  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.ic_number.includes(searchTerm) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = selectedSchool === 'all' || teacher.school_id === parseInt(selectedSchool);
    const matchesSubject = selectedSubject === 'all' || teacher.subject_id === parseInt(selectedSubject);
    
    let matchesPPD = true;
    if (selectedPPD !== 'all') {
      const school = mockSchools.find(s => s.id === teacher.school_id);
      matchesPPD = school?.ppd_id === parseInt(selectedPPD);
    }
    
    return matchesSearch && matchesSchool && matchesSubject && matchesPPD;
  });

  const getTeacherKPI = (teacherId: number) => {
    const kpis = mockTeacherKPIs.filter(k => k.teacher_id === teacherId);
    const latestKPI = kpis.sort((a, b) => new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime())[0];
    return latestKPI;
  };

  const getSchoolName = (schoolId: number) => {
    return mockSchools.find(s => s.id === schoolId)?.name || 'Unknown';
  };

  const getSubjectName = (subjectId: number) => {
    return mockSubjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  const getPPDName = (schoolId: number) => {
    const school = mockSchools.find(s => s.id === schoolId);
    return mockPPDs.find(p => p.id === school?.ppd_id)?.name || 'Unknown';
  };

  const getKPIColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getKPIStatus = (score: number) => {
    if (score >= 85) return 'Cemerlang';
    if (score >= 70) return 'Baik';
    return 'Perlu Diperbaiki';
  };

  // Statistics
  const totalTeachers = mockTeachers.length;
  const averageKPI = mockTeacherKPIs.reduce((sum, kpi) => sum + kpi.pdp_score, 0) / mockTeacherKPIs.length;
  const excellentTeachers = mockTeacherKPIs.filter(kpi => kpi.pdp_score >= 85).length / 2; // Divide by 2 karena ada 2 semester
  const needImprovementTeachers = mockTeacherKPIs.filter(kpi => kpi.pdp_score < 70).length / 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengurusan Guru</h1>
            <p className="text-sm text-gray-600">120 guru sasaran program JohorUP dengan KPI Pencerapan PdP</p>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export KPI
          </button>
        </div>
      </header>

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jumlah Guru</p>
                <p className="text-3xl font-bold text-gray-900">{totalTeachers}</p>
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
                <p className="text-sm text-gray-600">Purata KPI PdP</p>
                <p className="text-3xl font-bold text-blue-600">{averageKPI.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">Skor 0-100</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Guru Cemerlang</p>
                <p className="text-3xl font-bold text-green-600">{excellentTeachers}</p>
                <p className="text-xs text-gray-500 mt-1">KPI &ge; 85</p>
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
                <p className="text-sm text-gray-600">Perlu Diperbaiki</p>
                <p className="text-3xl font-bold text-red-600">{needImprovementTeachers}</p>
                <p className="text-xs text-gray-500 mt-1">KPI &lt; 70</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Guru</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nama, IC, atau email..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PPD</label>
              <select
                value={selectedPPD}
                onChange={(e) => setSelectedPPD(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua PPD</option>
                {mockPPDs.map(ppd => (
                  <option key={ppd.id} value={ppd.id}>{ppd.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sekolah</label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Sekolah</option>
                {mockSchools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Subjek</option>
                {mockSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PPD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjek</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengalaman</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KPI PdP Terkini</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeachers.slice(0, 50).map((teacher) => {
                  const kpi = getTeacherKPI(teacher.id);
                  return (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-sm text-gray-500">{teacher.ic_number}</div>
                          <div className="text-sm text-gray-500">{teacher.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getSchoolName(teacher.school_id)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getPPDName(teacher.school_id)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getSubjectName(teacher.subject_id)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {teacher.years_experience} tahun
                      </td>
                      <td className="px-6 py-4">
                        {kpi ? (
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-900">{kpi.pdp_score}</span>
                            <span className="text-sm text-gray-500 ml-1">/100</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Belum dinilai</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {kpi ? (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getKPIColor(kpi.pdp_score)}`}>
                            {getKPIStatus(kpi.pdp_score)}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Lihat KPI
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm">
                            Nilai
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredTeachers.length > 50 && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600">
                Menunjukkan 50 daripada {filteredTeachers.length} guru. Gunakan filter untuk menyaring hasil.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}