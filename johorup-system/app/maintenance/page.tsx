'use client';

import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function MaintenancePage() {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo and System Name */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistem JohorUP</h1>
          <p className="text-gray-600">Sistem Pemantauan Program SPM 2026</p>
        </div>

        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Maintenance Message */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-200 mb-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-4">
            Sistem Sedang Diselenggara
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Sistem JohorUP sedang menjalani penyelenggaraan berjadual untuk meningkatkan prestasi dan keselamatan.
          </p>
          
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">Maklumat Penyelenggaraan:</h3>
            <ul className="text-sm text-orange-700 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Semua kemaskini data oleh pengguna sekolah telah ditangguhkan sementara
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Akses untuk melihat data masih dibenarkan dalam mod baca sahaja
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Penyelenggaraan dijalankan untuk memastikan integriti dan keselamatan data
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Sistem akan kembali beroperasi sepenuhnya selepas penyelenggaraan selesai
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Jika anda mempunyai sebarang pertanyaan mengenai penyelenggaraan ini, 
              sila hubungi pentadbir sistem.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleBackToLogin}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Kembali ke Halaman Log Masuk
          </button>
          
          <div className="text-sm text-gray-500">
            Atau cuba akses semula dalam beberapa minit
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Peneraju Program</h4>
              <p>Yayasan JCorp</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Pembiaya</h4>
              <p>Yayasan Hasanah</p>
            </div>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            © 2026 Program JohorUP - Jabatan Pendidikan Negeri Johor
          </div>
        </div>
      </div>
    </div>
  );
}