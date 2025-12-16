'use client';

import { useState } from 'react';
import { mockStudents, mockSchools, mockGrades, mockSubjects } from '@/lib/mockData';
import { exportStudentsToExcel } from '@/lib/excelExport';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.ic_number.includes(searchTerm);
    const matchesSchool = selectedSchool === 'all' || student.school_id === parseInt(selectedSchool);
    return matchesSearch && matchesSchool;
  }).slice(0, 50); // Show first 50 for demo

  const getStudentGrades = (studentId: number) => {
    return mockGrades.filter(g => g.student_id === studentId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Senarai Murid</h1>
            <p className="text-sm text-gray-600">Murid sasaran program JohorUP</p>
          </div>
          <button 
            onClick={() => exportStudentsToExcel()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Excel
          </button>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/dashboard" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="/dashboard/students" className="border-b-2 border-blue-600 px-3 py-4 text-sm font-medium text-blue-600">
              Murid
            </a>
            <a href="/dashboard/programs" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Program
            </a>
            <a href="/dashboard/budget" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Kewangan
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Murid</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nama atau No. IC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
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
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. IC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sejarah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matematik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const school = mockSchools.find(s => s.id === student.school_id);
                  const grades = getStudentGrades(student.id);
                  const bmGrade = grades.find(g => g.subject_id === 1);
                  const sejGrade = grades.find(g => g.subject_id === 2);
                  const matGrade = grades.find(g => g.subject_id === 3);

                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.ic_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{school?.name}</td>
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
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => window.location.href = `/dashboard/students/${student.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600">
              Menunjukkan {filteredStudents.length} daripada {mockStudents.length} murid
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
