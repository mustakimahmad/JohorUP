'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - guna demo123 sebagai password
    if (password === 'demo123') {
      // Determine user role and other info based on email
      let userData: any = { email };
      
      if (email.includes('sekolah')) {
        userData = {
          email,
          role: 'school',
          name: 'Guru Besar SMK TJJ',
          school_id: 1
        };
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard/school');
      } else if (email.includes('ppd')) {
        userData = {
          email,
          role: 'ppd',
          name: 'Pegawai PPD JB',
          ppd_id: 1
        };
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else if (email.includes('pembelajaran')) {
        userData = {
          email,
          role: 'sektor_pembelajaran',
          name: 'Ketua Sektor Pembelajaran'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else if (email.includes('koordinator') || email.includes('perancangan')) {
        userData = {
          email,
          role: 'sektor_perancangan',
          name: 'Koordinator Program JohorUP'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard/coordinator');
      } else if (email.includes('yayasan') || email.includes('jcorp')) {
        userData = {
          email,
          role: 'yayasan_jcorp',
          name: 'Pegawai Yayasan JCorp'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else {
        userData = {
          email,
          role: 'sektor_pembelajaran',
          name: 'Pengguna Sistem'
        };
        localStorage.setItem('user', JSON.stringify(userData));
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
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-gray-600 mt-2">Sistem Pemantauan Program SPM 2026</p>
          <p className="text-sm text-gray-500 mt-1">Jabatan Pendidikan Negeri Johor</p>
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
            <p>🏛️ Yayasan JCorp: yayasan@jcorp.com.my</p>
            <p className="mt-2 font-semibold text-blue-600">Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
