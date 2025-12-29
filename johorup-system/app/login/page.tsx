'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser, getCurrentUser } from '@/lib/localStorage-auth';
import Logo from '@/components/Logo';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showManualLogin, setShowManualLogin] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    // Check if already logged in
    const user = getCurrentUser();
    if (user) {
      router.push(callbackUrl);
    }
  }, [router, callbackUrl]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = loginUser(email, password);
      if (user) {
        router.push(callbackUrl);
      } else {
        setError('Email atau kata laluan tidak sah');
      }
    } catch (error) {
      console.error('Manual login error:', error);
      setError('Login gagal. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-gray-600 mt-2">Sistem Pemantauan Program SPM 2026</p>
          <p className="text-sm text-gray-500 mt-1">Jabatan Pendidikan Negeri Johor</p>
        </div>

        {!showManualLogin ? (
          <>
            {/* Manual Login Option */}
            <button
              onClick={() => setShowManualLogin(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium text-lg"
            >
              Log Masuk
            </button>
          </>
        ) : (
          <>
            {/* Manual Login Form */}
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="nama@jpnj.gov.my"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Kata Laluan
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan kata laluan"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sedang masuk...
                  </div>
                ) : (
                  'Log Masuk'
                )}
              </button>
            </form>

            {/* Back to Google Login */}
            <button
              onClick={() => setShowManualLogin(false)}
              className="w-full text-gray-600 hover:text-gray-800 text-sm underline mt-4"
            >
              ← Kembali ke Google Login
            </button>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">Login Information:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>📧 <strong>Manual Login:</strong> Demo mode - Gunakan akaun demo</p>
            <div className="mt-2 space-y-1 border-t pt-2">
              <p className="font-semibold text-blue-600">Demo Login Accounts:</p>
              <p>📧 admin@jpnj.gov.my - Admin JPNJ</p>
              <p>📧 koordinator@jpnj.gov.my - Koordinator</p>
              <p>📧 ppd.jb@moe.gov.my - PPD Johor Bahru</p>
              <p>📧 sekolah@moe-dl.edu.my - Sekolah Demo</p>
              <p>📧 yayasan@jcorp.com.my - Yayasan JCorp</p>
              <p className="font-semibold text-green-600 mt-2">🔑 Password: AdminPass123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}