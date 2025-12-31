'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage-auth';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function MaintenanceControlPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceReason, setMaintenanceReason] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'enable' | 'disable' | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
      
      // Only allow admin (Super Admin or Admin roles)
      if (!['super_admin_s4pd', 'admin_spb', 'admin_spm'].includes(user.role)) {
        router.push('/dashboard');
      }
    }

    // Check current maintenance status
    const maintenanceStatus = localStorage.getItem('maintenanceMode');
    if (maintenanceStatus === 'true') {
      setIsMaintenanceMode(true);
      const reason = localStorage.getItem('maintenanceReason') || '';
      const duration = localStorage.getItem('maintenanceDuration') || '';
      setMaintenanceReason(reason);
      setEstimatedDuration(duration);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleMaintenanceToggle = (action: 'enable' | 'disable') => {
    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const confirmMaintenanceAction = () => {
    if (pendingAction === 'enable') {
      // Enable maintenance mode
      localStorage.setItem('maintenanceMode', 'true');
      localStorage.setItem('maintenanceReason', maintenanceReason);
      localStorage.setItem('maintenanceDuration', estimatedDuration);
      localStorage.setItem('maintenanceStartTime', new Date().toISOString());
      setIsMaintenanceMode(true);
    } else if (pendingAction === 'disable') {
      // Disable maintenance mode
      localStorage.removeItem('maintenanceMode');
      localStorage.removeItem('maintenanceReason');
      localStorage.removeItem('maintenanceDuration');
      localStorage.removeItem('maintenanceStartTime');
      setIsMaintenanceMode(false);
      setMaintenanceReason('');
      setEstimatedDuration('');
    }
    
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const cancelMaintenanceAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  if (!user || !['super_admin_s4pd', 'admin_spb', 'admin_spm'].includes(user.role)) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Kawalan Penyelenggaraan Sistem"
        subtitle="Pengurusan mod penyelenggaraan untuk sistem JohorUP"
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status */}
        <div className={`p-6 rounded-lg shadow-lg mb-8 ${
          isMaintenanceMode 
            ? 'bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200' 
            : 'bg-gradient-to-r from-green-100 to-blue-100 border border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${
                isMaintenanceMode ? 'text-orange-800' : 'text-green-800'
              }`}>
                Status Sistem: {isMaintenanceMode ? 'MOD PENYELENGGARAAN' : 'BEROPERASI NORMAL'}
              </h2>
              <p className={`text-sm ${
                isMaintenanceMode ? 'text-orange-700' : 'text-green-700'
              }`}>
                {isMaintenanceMode 
                  ? 'Sistem sedang dalam mod penyelenggaraan. Kemaskini data oleh sekolah ditangguhkan.'
                  : 'Sistem beroperasi dengan normal. Semua fungsi tersedia.'
                }
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isMaintenanceMode ? 'bg-orange-200' : 'bg-green-200'
            }`}>
              {isMaintenanceMode ? (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Maintenance Control Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Kawalan Mod Penyelenggaraan</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sebab Penyelenggaraan
              </label>
              <textarea
                value={maintenanceReason}
                onChange={(e) => setMaintenanceReason(e.target.value)}
                disabled={isMaintenanceMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={3}
                placeholder="Contoh: Kemaskini sistem, penambahbaikan keselamatan, pembaikan bug..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anggaran Tempoh Penyelenggaraan
              </label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                disabled={isMaintenanceMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Contoh: 2 jam, 30 minit, 1 hari..."
              />
            </div>

            <div className="flex space-x-4">
              {!isMaintenanceMode ? (
                <button
                  onClick={() => handleMaintenanceToggle('enable')}
                  disabled={!maintenanceReason.trim() || !estimatedDuration.trim()}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Aktifkan Mod Penyelenggaraan
                </button>
              ) : (
                <button
                  onClick={() => handleMaintenanceToggle('disable')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Tamatkan Mod Penyelenggaraan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Impact Information */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">Kesan Mod Penyelenggaraan:</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Semua pengguna sekolah tidak dapat mengemaskini data (laporan, kehadiran, dll.)
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Akses untuk melihat data masih dibenarkan dalam mod baca sahaja
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Pengguna akan diarahkan ke halaman penyelenggaraan jika cuba mengakses fungsi kemaskini
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Admin masih boleh mengakses sistem seperti biasa
            </li>
          </ul>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pengesahan Tindakan
            </h3>
            <p className="text-gray-600 mb-6">
              {pendingAction === 'enable' 
                ? 'Adakah anda pasti untuk mengaktifkan mod penyelenggaraan? Semua kemaskini data oleh sekolah akan ditangguhkan.'
                : 'Adakah anda pasti untuk menamatkan mod penyelenggaraan? Sistem akan kembali beroperasi seperti biasa.'
              }
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmMaintenanceAction}
                className={`px-4 py-2 rounded-lg font-medium ${
                  pendingAction === 'enable'
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Ya, Teruskan
              </button>
              <button
                onClick={cancelMaintenanceAction}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}