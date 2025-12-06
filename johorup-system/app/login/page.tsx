'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - guna demo123 sebagai password
    if (password === 'demo123') {
      localStorage.setItem('user', JSON.stringify({ email }));
      
      // Redirect based on role
      if (email.includes('sekolah')) {
        router.push('/dashboard/school');
      } else if (email.includes('perancangan')) {
        router.push('/dashboard/coordinator');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('Email atau password tidak sah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">JohorUP</h1>
          <p className="text-gray-600 mt-2">Sistem Pemantauan Program SPM 2026</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="nama@moe.gov.my"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Log Masuk
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">Demo Accounts:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>🏫 Sekolah: sekolah1@moe.gov.my</p>
            <p>🏢 PPD: ppd.jb@moe.gov.my</p>
            <p>📚 Sektor Pembelajaran: pembelajaran@jpnj.gov.my</p>
            <p>⭐ Koordinator: koordinator@jpnj.gov.my</p>
            <p className="mt-2 font-semibold text-blue-600">Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
