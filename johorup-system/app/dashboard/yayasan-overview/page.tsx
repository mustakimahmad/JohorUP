'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function YayasanOverviewPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to main dashboard since yayasan role is disabled
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Halaman Tidak Tersedia</h1>
        <p className="text-gray-600 mb-4">Halaman ini telah dinonaktifkan.</p>
        <p className="text-sm text-gray-500">Mengalihkan ke dashboard utama...</p>
      </div>
    </div>
  );
}