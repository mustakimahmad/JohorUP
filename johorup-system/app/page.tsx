'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Force redirect to login immediately
    window.location.href = '/login';
  }, []);

  // Immediate redirect with meta refresh as backup
  return (
    <>
      <head>
        <meta httpEquiv="refresh" content="0; url=/login" />
      </head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <div className="mb-6">
            <div className="text-4xl mb-4">🎓</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">JohorUP System</h1>
            <p className="text-gray-600">Sistem Pengurusan Program Tuisyen Johor</p>
          </div>
          
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Mengalihkan ke sistem...</p>
          </div>

          <div className="space-y-2">
            <a 
              href="/login" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔐 Login ke Sistem
            </a>
            <br />
            <a 
              href="/dashboard" 
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📊 Import Data
            </a>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <p className="text-sm font-semibold text-gray-700 mb-2">Demo Accounts:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>admin@s4pd.gov.my | admin123</p>
              <p>spb.admin@jpnj.gov.my | spb123</p>
              <p>strategic@jcorp.com.my | jcorp123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
