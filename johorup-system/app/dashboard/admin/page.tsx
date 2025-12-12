'use client';

import { createDatabaseTemplates } from '@/lib/createExcelTemplates';
import DashboardHeader from '@/components/DashboardHeader';

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Download Template Database Excel
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Template Excel ini mengandungi semua table yang diperlukan untuk sistem JohorUP. 
              Isi data sebenar dalam template ini dan hantar kembali untuk diimport ke dalam sistem.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Template mengandungi 8 sheets:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-blue-800">PPD</div>
                  <div className="text-gray-600">Pejabat Pendidikan Daerah</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-blue-800">Schools</div>
                  <div className="text-gray-600">Senarai Sekolah</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-blue-800">Students</div>
                  <div className="text-gray-600">Data Murid</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-blue-800">Subjects</div>
                  <div className="text-gray-600">Subjek (Fixed)</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-blue-800">StudentGrades</div>
                  <div className="text-gray-600">Markah Murid</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-blue-800">Users</div>
                  <div className="text-gray-600">Pengguna Sistem</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-blue-800">Programs</div>
                  <div className="text-gray-600">Program Bimbingan</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-blue-800">Budget</div>
                  <div className="text-gray-600">Peruntukan Kewangan</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Template Excel
            </button>

            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-lg font-semibold text-yellow-900 mb-3">📋 Panduan Penggunaan:</h4>
              <ol className="text-left text-sm text-yellow-800 space-y-2 max-w-2xl mx-auto">
                <li><strong>1.</strong> Download template Excel di atas</li>
                <li><strong>2.</strong> Buka file dan isi data sebenar dalam setiap sheet</li>
                <li><strong>3.</strong> Pastikan format data mengikut contoh yang disediakan</li>
                <li><strong>4.</strong> Jangan ubah nama column atau struktur sheet</li>
                <li><strong>5.</strong> Hantar file Excel yang lengkap untuk diimport</li>
              </ol>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>📄 Rujuk fail <code>DATABASE_TEMPLATE_EXCEL.md</code> untuk panduan lengkap</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}