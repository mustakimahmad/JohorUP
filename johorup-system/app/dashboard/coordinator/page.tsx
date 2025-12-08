'use client';

import { useState } from 'react';
import { mockPrograms, mockSubjects, mockBudget } from '@/lib/mockData';

export default function CoordinatorPage() {
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [targetStudents, setTargetStudents] = useState<{ [key: number]: number }>({});

  const handleSaveTargetStudents = (programId: number) => {
    // Dalam production, ini akan save ke database
    alert(`Bilangan murid disasarkan untuk program ${programId}: ${targetStudents[programId] || 0} murid`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Panel Sektor Pembelajaran</h1>
          <p className="text-sm text-gray-600">Semakan dan kelulusan program</p>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/dashboard" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="/dashboard/coordinator" className="border-b-2 border-blue-600 px-3 py-4 text-sm font-medium text-blue-600">
              Semakan Program
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Arahan untuk Sektor Pembelajaran</h3>
              <p className="text-sm text-blue-800 mt-1">
                Sila semak setiap program dan masukkan bilangan murid yang disasarkan untuk program tersebut. 
                Maklumat ini akan digunakan untuk tracking dan laporan keberkesanan program.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {mockPrograms.map((program) => {
            const subject = mockSubjects.find(s => s.id === program.target_subject_id);
            const budget = mockBudget.find(b => b.program_id === program.id);
            const isExpanded = selectedProgram === program.id;
            
            return (
              <div key={program.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {program.program_type}
                        </span>
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {subject?.name}
                        </span>
                        {budget && (
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            RM {budget.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProgram(isExpanded ? null : program.id)}
                      className="ml-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {isExpanded ? 'Tutup' : 'Semak'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tarikh Mula</p>
                      <p className="font-medium text-gray-900">{new Date(program.start_date).toLocaleDateString('ms-MY')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tarikh Tamat</p>
                      <p className="font-medium text-gray-900">{new Date(program.end_date).toLocaleDateString('ms-MY')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Anggaran Kos</p>
                      <p className="font-medium text-gray-900">RM {budget?.amount.toLocaleString() || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Murid Disasarkan</p>
                      <p className="font-medium text-green-600">
                        {program.target_students ? `${program.target_students} murid` : 'Belum ditetapkan'}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Tetapkan Bilangan Murid Disasarkan</h4>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bilangan Murid yang Disasarkan untuk Program Ini
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="Contoh: 50"
                            value={targetStudents[program.id] || program.target_students || ''}
                            onChange={(e) => setTargetStudents({
                              ...targetStudents,
                              [program.id]: parseInt(e.target.value) || 0
                            })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleSaveTargetStudents(program.id)}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                          >
                            Simpan
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          * Masukkan anggaran bilangan murid yang akan menyertai atau mendapat manfaat dari program ini
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="text-sm font-semibold text-blue-900 mb-2">Maklumat Program</h5>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Subjek: {subject?.name}</li>
                            <li>• Jenis: {program.program_type}</li>
                            <li>• Tempoh: {Math.ceil((new Date(program.end_date).getTime() - new Date(program.start_date).getTime()) / (1000 * 60 * 60 * 24))} hari</li>
                          </ul>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h5 className="text-sm font-semibold text-green-900 mb-2">Status Kelulusan</h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-800">Bajet:</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                budget?.status === 'approved' 
                                  ? 'bg-green-200 text-green-900' 
                                  : 'bg-yellow-200 text-yellow-900'
                              }`}>
                                {budget?.status === 'approved' ? 'Diluluskan' : 'Menunggu'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                          ✓ Luluskan Program
                        </button>
                        <button className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium">
                          ⚠ Minta Semakan Semula
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                          ✗ Tolak
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{mockPrograms.length}</p>
              <p className="text-sm text-gray-600 mt-1">Jumlah Program</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {mockPrograms.reduce((sum, p) => sum + (p.target_students || 0), 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Jumlah Murid Disasarkan</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                RM {mockBudget.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Jumlah Bajet</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
