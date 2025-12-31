'use client';

import { mockSchools, mockStudents, mockGrades } from '@/lib/mockData';
import NavigationBar from '@/components/NavigationBar';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan & Analisis</h1>
            <p className="text-sm text-gray-600">Laporan pencapaian dan analisis program</p>
          </div>
          <button 
            className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed text-sm font-medium"
            disabled
          >
            Export PDF (Tiada Data)
          </button>
        </div>
      </header>

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v14a4 4 0 01-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiada Data Laporan</h3>
            <p className="text-gray-600 mb-6">
              Belum ada data untuk menjana laporan dan analisis. Sila import data murid dan gred terlebih dahulu.
            </p>
          </div>
        </div>

        {/* Summary Stats - Empty State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Kadar Kelulusan Keseluruhan</p>
            <p className="text-4xl font-bold">0%</p>
            <p className="text-xs opacity-75 mt-2">Tiada data tersedia</p>
          </div>

          <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Target Peningkatan</p>
            <p className="text-4xl font-bold">0%</p>
            <p className="text-xs opacity-75 mt-2">Sasaran SPM 2026</p>
          </div>

          <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Murid Berisiko Tinggi</p>
            <p className="text-4xl font-bold">0</p>
            <p className="text-xs opacity-75 mt-2">Tiada data murid</p>
          </div>
        </div>

        {/* Performance by Subject - Empty State */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pencapaian Mengikut Subjek</h3>
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">Tiada data pencapaian subjek untuk dipaparkan</p>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Bahasa Melayu</span>
                  <span className="text-sm font-semibold text-gray-400">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gray-300 h-4 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-gray-400">A</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">B</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">C</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">D</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">E/G</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Sejarah</span>
                  <span className="text-sm font-semibold text-gray-400">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gray-300 h-4 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-gray-400">A</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">B</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">C</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">D</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">E/G</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Matematik</span>
                  <span className="text-sm font-semibold text-gray-400">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gray-300 h-4 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-gray-400">A</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">B</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">C</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">D</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">E/G</p>
                    <p className="font-semibold text-gray-400">0%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Performance Comparison - Empty State */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Perbandingan Pencapaian Sekolah</h3>
          </div>
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Tiada Data Sekolah</h4>
            <p className="text-gray-600 mb-6">Belum ada data sekolah untuk dibandingkan.</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bil. Murid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kadar Lulus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prestasi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Tiada data sekolah untuk dipaparkan
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recommendations - Updated for empty state */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Langkah Seterusnya</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Import data murid dan gred untuk menjana laporan</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Pastikan data sekolah telah dikemas kini</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Hubungi pentadbir sistem untuk bantuan import data</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Semak template Excel untuk format data yang betul</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
