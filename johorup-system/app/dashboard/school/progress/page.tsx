'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage-auth';
import { mockSchools } from '@/lib/mockData';
import DashboardHeader from '@/components/DashboardHeader';
import NavigationBar from '@/components/NavigationBar';

export default function SchoolProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
      
      // Redirect non-school users
      if (user.role !== 'operational_school') {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user || user.role !== 'operational_school') return null;

  // Get school data
  const school = mockSchools.find(s => s.id === user.school_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title={`Analisis Perkembangan - ${school?.name || 'Sekolah'}`}
        subtitle="Analisis prestasi murid mengikut subjek"
        user={user}
        onLogout={handleLogout}
      />

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiada Data Murid</h3>
            <p className="text-gray-600 mb-6">
              Belum ada data murid untuk dianalisis. Sila import data murid terlebih dahulu.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Jumlah Murid</p>
                  <p className="text-3xl font-bold text-gray-400">0</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Kadar Kelulusan</p>
                  <p className="text-3xl font-bold text-gray-400">0%</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Cemerlang</p>
                  <p className="text-3xl font-bold text-gray-400">0</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Perlu Bimbingan</p>
                  <p className="text-3xl font-bold text-gray-400">0</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">Langkah Seterusnya</h4>
              <p className="text-sm text-blue-700">
                Untuk melihat analisis perkembangan murid, sila import data murid dan gred mereka melalui sistem pengurusan data.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}