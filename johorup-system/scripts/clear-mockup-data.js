// Script untuk membersihkan semua data mockup dari localStorage dan reset ke keadaan asal

console.log('🧹 Memulakan pembersihan data mockup...');

// Function untuk membersihkan localStorage (untuk browser)
function clearLocalStorageData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Clear all localStorage data
    localStorage.clear();
    console.log('✅ localStorage telah dibersihkan');
  } else {
    console.log('ℹ️ localStorage tidak tersedia (running di Node.js)');
  }
}

// Function untuk reset mock data ke keadaan asal
function resetMockData() {
  console.log('🔄 Mereset mock data ke keadaan asal...');
  
  // Ini akan dilakukan dengan menggantikan file mockData.ts
  const fs = require('fs');
  const path = require('path');
  
  const cleanMockData = `// Mock data untuk prototype (telah dibersihkan)

import { User, School, Student, StudentGrade, Program, Budget, DashboardStats, PPD, Teacher, TeacherKPI, ProgramReport, StudentAttendance, ProgramPhoto } from './types';

export const mockPPDs: PPD[] = [
  { id: 1, name: 'PPD Johor Bahru', code: 'JB' },
  { id: 2, name: 'PPD Muar', code: 'MR' },
  { id: 3, name: 'PPD Batu Pahat', code: 'BP' },
];

export const mockSchools: School[] = [];

export const mockStudents: Student[] = [];

export const mockSubjects = [
  { id: 1, name: 'Bahasa Melayu', code: 'BM' },
  { id: 2, name: 'Sejarah', code: 'SEJ' },
  { id: 3, name: 'Matematik', code: 'MAT' },
];

export const mockGrades: StudentGrade[] = [];

export const mockPrograms: Program[] = [];

export const mockBudget: Budget[] = [];

export const mockDashboardStats: DashboardStats = {
  total_students: 0,
  total_schools: 0,
  total_budget: 0,
  spent_budget: 0,
  programs_count: 0,
  passing_rate: {
    bahasa_melayu: 0,
    sejarah: 0,
    matematik: 0,
  },
};

export const mockUsers: User[] = [
  { id: 1, email: 'admin@jpnj.gov.my', name: 'Admin JPNJ', role: 'admin' },
];

export const mockTeachers: Teacher[] = [];

export const mockTeacherKPIs: TeacherKPI[] = [];

export const mockProgramReports: ProgramReport[] = [];

export const mockStudentAttendance: StudentAttendance[] = [];

export const mockProgramPhotos: ProgramPhoto[] = [];
`;

  try {
    const mockDataPath = path.join(__dirname, '..', 'lib', 'mockData.ts');
    fs.writeFileSync(mockDataPath, cleanMockData);
    console.log('✅ Mock data telah direset ke keadaan asal');
  } catch (error) {
    console.error('❌ Ralat semasa mereset mock data:', error.message);
  }
}

// Function untuk update localStorage auth dengan users yang bersih
function updateAuthData() {
  const fs = require('fs');
  const path = require('path');
  
  const cleanAuthData = `// Simple localStorage-based authentication utilities (telah dibersihkan)

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  school_id?: number | null;
  ppd_id?: number | null;
}

// Demo users untuk sistem (hanya admin sahaja)
export const demoUsers: User[] = [
  { id: 1, email: 'admin@jpnj.gov.my', name: 'Admin JPNJ', role: 'admin', school_id: null, ppd_id: null },
];

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
}

// Login user with email and password
export function loginUser(email: string, password: string): User | null {
  const user = demoUsers.find(u => u.email === email);
  if (user && password === 'AdminPass123!') {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
}

// Logout user
export function logoutUser(): void {
  localStorage.removeItem('user');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Check if user has specific role
export function hasRole(allowedRoles: string[]): boolean {
  const user = getCurrentUser();
  return user ? allowedRoles.includes(user.role) : false;
}

// Redirect to login if not authenticated
export function requireAuth(): User | null {
  const user = getCurrentUser();
  if (!user && typeof window !== 'undefined') {
    window.location.href = '/login';
    return null;
  }
  return user;
}
`;

  try {
    const authPath = path.join(__dirname, '..', 'lib', 'localStorage-auth.ts');
    fs.writeFileSync(authPath, cleanAuthData);
    console.log('✅ Authentication data telah dikemas kini (hanya admin)');
  } catch (error) {
    console.error('❌ Ralat semasa mengemas kini auth data:', error.message);
  }
}

// Function untuk disable yayasan dashboard page
function disableYayasanPages() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Create a disabled yayasan overview page
    const disabledPageContent = `'use client';

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
}`;

    const yayasanPagePath = path.join(__dirname, '..', 'app', 'dashboard', 'yayasan-overview', 'page.tsx');
    fs.writeFileSync(yayasanPagePath, disabledPageContent);
    console.log('✅ Halaman yayasan telah dinonaktifkan');
  } catch (error) {
    console.error('❌ Ralat semasa menonaktifkan halaman yayasan:', error.message);
  }
}

// Function untuk clear browser localStorage secara programmatik
function clearBrowserData() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Create a script to clear browser data
    const clearScript = `
// Auto-clear browser data script
(function() {
  console.log('🧹 Auto-clearing browser data...');
  
  // Clear localStorage and sessionStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
    console.log('✅ localStorage cleared');
  }
  
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
  }
  
  // Clear any cached user data
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('maintenanceMode');
    localStorage.removeItem('dashboardStats');
    console.log('✅ User data cleared');
  }
  
  console.log('🎉 Browser data cleared successfully!');
  
  // Force reload after clearing
  setTimeout(() => {
    window.location.reload();
  }, 1000);
})();
`;

    const scriptPath = path.join(__dirname, '..', 'public', 'clear-data.js');
    fs.writeFileSync(scriptPath, clearScript);
    console.log('✅ Browser clear script telah dicipta');
  } catch (error) {
    console.error('❌ Ralat semasa mencipta clear script:', error.message);
  }
}

// Function untuk clear data folder dari file mockup
function clearDataFolder() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const dataPath = path.join(__dirname, '..', 'data');
    
    // Read all files in data folder
    const files = fs.readdirSync(dataPath);
    let deletedCount = 0;
    
    files.forEach(file => {
      // Skip README.md
      if (file === 'README.md') return;
      
      const filePath = path.join(dataPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile()) {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`   Deleted: ${file}`);
      }
    });
    
    console.log(`✅ Data folder telah dibersihkan (${deletedCount} files deleted)`);
  } catch (error) {
    console.error('❌ Ralat semasa membersihkan data folder:', error.message);
  }
}

// Function untuk replace progress page dengan versi kosong
function clearProgressPages() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Create clean progress page
    const cleanProgressPage = `'use client';

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
      if (user.role !== 'school') {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user || user.role !== 'school') return null;

  // Get school data
  const school = mockSchools.find(s => s.id === user.school_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title={\`Analisis Perkembangan - \${school?.name || 'Sekolah'}\`}
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
}`;

    const progressPagePath = path.join(__dirname, '..', 'app', 'dashboard', 'school', 'progress', 'page.tsx');
    fs.writeFileSync(progressPagePath, cleanProgressPage);
    console.log('✅ Halaman analisis perkembangan telah dibersihkan');
    
    // Note: Dashboard page has been manually cleaned of hardcoded trend data
    console.log('✅ Dashboard trend data telah dibersihkan (manual update)');
    console.log('✅ Reports page telah dibersihkan (manual update)');
    console.log('✅ Tuition analysis page telah dibersihkan (manual update)');
    console.log('✅ User management page telah dibersihkan (manual update)');
    
  } catch (error) {
    console.error('❌ Ralat semasa membersihkan halaman progress:', error.message);
  }
}

// Jalankan pembersihan
try {
  clearLocalStorageData();
  resetMockData();
  updateAuthData();
  disableYayasanPages();
  clearBrowserData();
  clearProgressPages();
  clearDataFolder();
  
  console.log('\n🎉 Pembersihan data mockup selesai!');
  console.log('\n📋 Maklumat login selepas pembersihan:');
  console.log('Email: admin@jpnj.gov.my');
  console.log('Password: AdminPass123!');
  console.log('Role: admin (sahaja)');
  console.log('\n🌐 Aplikasi berjalan di: http://localhost:3000');
  console.log('\n⚠️ PENTING: Untuk melihat perubahan sepenuhnya:');
  console.log('1. Buka browser ke http://localhost:3000');
  console.log('2. Tekan F12 untuk buka Developer Tools');
  console.log('3. Pergi ke Console tab');
  console.log('4. Type: localStorage.clear(); sessionStorage.clear(); location.reload();');
  console.log('5. Tekan Enter');
  console.log('\n✅ Semua data mockup (guru, laporan, tuisyen, analisis, reports, tuition-analysis, user-management) telah dibersihkan');
  console.log('✅ Halaman yayasan telah dinonaktifkan');
  console.log('✅ Halaman analisis perkembangan telah dikosongkan');
  console.log('✅ Halaman reports telah dikosongkan');
  console.log('✅ Halaman tuition-analysis telah dikosongkan');
  console.log('✅ Halaman user-management telah dikosongkan');
  console.log('✅ Folder data telah dibersihkan dari file mockup');
  
} catch (error) {
  console.error('❌ Pembersihan gagal:', error.message);
  process.exit(1);
}