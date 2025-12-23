'use client';

import { createDatabaseTemplates } from '@/lib/createExcelTemplates';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function AdminPage() {
  const handleDownloadTemplate = () => {
    createDatabaseTemplates();
    alert('Template Excel telah di-download! Sila check folder Downloads anda.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Admin Panel"
        subtitle="Database Template Generator"
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 sm:h-16 w-12 sm:w-16 rounded-full bg-blue-100 mb-4 sm:mb-6">
              <svg className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Download Template Database Excel
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Template Excel ini mengandungi semua table yang diperlukan untuk sistem JohorUP. 
              Isi data sebenar dalam template ini dan hantar kembali untuk diimport ke dalam sistem.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-left">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">Template mengandungi 10 sheets:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">PPD</div>
                  <div className="text-gray-600 text-xs">Pejabat Pendidikan Daerah</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">Schools</div>
                  <div className="text-gray-600 text-xs">Senarai Sekolah</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">Students</div>
                  <div className="text-gray-600 text-xs">Data Murid</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">Subjects</div>
                  <div className="text-gray-600 text-xs">Subjek (Fixed)</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">StudentGrades</div>
                  <div className="text-gray-600 text-xs">Markah Murid</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">Teachers</div>
                  <div className="text-gray-600 text-xs">Profil Guru</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">TeacherKPIs</div>
                  <div className="text-gray-600 text-xs">KPI Pencerapan PdP</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">Users</div>
                  <div className="text-gray-600 text-xs">Pengguna Sistem</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">Programs</div>
                  <div className="text-gray-600 text-xs">Program Bimbingan</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <div className="font-medium text-blue-800">Budget</div>
                  <div className="text-gray-600 text-xs">Peruntukan Kewangan</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-sm sm:text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Template Excel
            </button>

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
              <h4 className="text-base sm:text-lg font-semibold text-yellow-900 mb-3">📋 Panduan Penggunaan:</h4>
              <ol className="text-xs sm:text-sm text-yellow-800 space-y-2 max-w-2xl mx-auto">
                <li><strong>1.</strong> Download template Excel di atas</li>
                <li><strong>2.</strong> Buka file dan isi data sebenar dalam setiap sheet</li>
                <li><strong>3.</strong> Pastikan format data mengikut contoh yang disediakan</li>
                <li><strong>4.</strong> Jangan ubah nama column atau struktur sheet</li>
                <li><strong>5.</strong> Hantar file Excel yang lengkap untuk diimport</li>
              </ol>
            </div>

            <div className="mt-6 text-xs sm:text-sm text-gray-500">
              <p>📄 Rujuk fail <code className="bg-gray-100 px-2 py-1 rounded">DATABASE_TEMPLATE_EXCEL.md</code> untuk panduan lengkap</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}