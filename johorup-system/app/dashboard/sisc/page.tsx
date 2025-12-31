'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SISCDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getSISCSubject = () => {
    if (user?.email?.includes('bahasamelayu')) return 'Bahasa Melayu';
    if (user?.email?.includes('sejarah')) return 'Sejarah';
    if (user?.email?.includes('matematik')) return 'Matematik';
    return 'Subjek Khusus';
  };

  const getSubjectColor = () => {
    const subject = getSISCSubject();
    if (subject === 'Bahasa Melayu') return 'bg-blue-50 border-blue-200 text-blue-800';
    if (subject === 'Sejarah') return 'bg-green-50 border-green-200 text-green-800';
    if (subject === 'Matematik') return 'bg-purple-50 border-purple-200 text-purple-800';
    return 'bg-gray-50 border-gray-200 text-gray-800';
  };

  if (!user || user.role !== 'coaching_sisc') {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Access denied. This page is only available for SISC+ users.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">SISC+ Dashboard</h1>
        <p className="text-gray-600 mt-1">School Improvement Specialist Coach Plus</p>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 border-2 ${getSubjectColor()}`}>
          Subjek: {getSISCSubject()}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Guru Daerah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              0
            </div>
            <p className="text-xs text-gray-500 mt-1">Guru subjek {getSISCSubject()}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sekolah Daerah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              0
            </div>
            <p className="text-xs text-gray-500 mt-1">Sekolah dalam daerah</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Murid Daerah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              0
            </div>
            <p className="text-xs text-gray-500 mt-1">Murid dari sekolah daerah</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Progress Pencerapan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              0%
            </div>
            <p className="text-xs text-gray-500 mt-1">Pencerapan selesai</p>
          </CardContent>
        </Card>
      </div>

      {/* SISC+ Role & Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            🎯 Peranan SISC+ dalam Program 3 Fasa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-3">📋 Tanggungjawab Utama</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Bimbingan kepada guru subjek {getSISCSubject()} di daerah</li>
                <li>• Pencerapan pelaksanaan modul program di sekolah daerah</li>
                <li>• Pemantauan kualiti pengajaran dan pembelajaran</li>
                <li>• Sokongan teknikal dalam pelaksanaan kurikulum</li>
                <li>• Pelaporan kemajuan guru kepada PPD dan sektor</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-3">🎯 KPI SISC+ (3 Fasa)</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Phase 1:</strong> Kehadiran guru dalam latihan</li>
                <li>• <strong>Phase 2:</strong> Pelaksanaan modul subjek di sekolah</li>
                <li>• <strong>Phase 3:</strong> Peningkatan prestasi murid SPM</li>
                <li>• Laporan bulanan kemajuan bimbingan guru</li>
                <li>• Dokumentasi best practices pengajaran</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-Specific Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            📚 Fokus Subjek: {getSISCSubject()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-800 mb-2">Phase 1: Latihan Guru</h3>
              <p className="text-sm text-gray-600 mb-2">
                Jan - Apr 2026
              </p>
              <p className="text-xs text-gray-500">
                Bimbingan guru {getSISCSubject()} dalam modul program dan teknik pengajaran
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-800 mb-2">Phase 2: Pelaksanaan</h3>
              <p className="text-sm text-gray-600 mb-2">
                May - Sep 2026
              </p>
              <p className="text-xs text-gray-500">
                Pencerapan pelaksanaan program dan sokongan berterusan kepada guru
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Phase 3: Penilaian</h3>
              <p className="text-sm text-gray-600 mb-2">
                Oct 2026 - Apr 2027
              </p>
              <p className="text-xs text-gray-500">
                Analisis prestasi murid dan keberkesanan program subjek
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Guidance Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              👨‍🏫 Progress Bimbingan Guru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Guru Telah Dibimbing</span>
                  <span>0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Sesi Coaching Selesai</span>
                  <span>0 sesi</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Laporan Pencerapan</span>
                  <span>0 laporan</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📈 Target KPI SISC+
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0%</div>
                <div className="text-sm text-gray-600 mt-1">Kehadiran Latihan</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0%</div>
                <div className="text-sm text-gray-600 mt-1">Pelaksanaan Modul</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Guru Bimbingan</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Sekolah Daerah</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SISC+ Network */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            🤝 Rangkaian SISC+ (3 Subjek)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">22</div>
                <div className="text-sm text-gray-600 mt-1">SISC+ Bahasa Melayu</div>
                <div className="text-xs text-gray-500 mt-2">Seluruh negeri</div>
              </div>
            </div>
            <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">22</div>
                <div className="text-sm text-gray-600 mt-1">SISC+ Sejarah</div>
                <div className="text-xs text-gray-500 mt-2">Seluruh negeri</div>
              </div>
            </div>
            <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">22</div>
                <div className="text-sm text-gray-600 mt-1">SISC+ Matematik</div>
                <div className="text-xs text-gray-500 mt-2">Seluruh negeri</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              <strong>Total: 66 SISC+</strong> melakukan bimbingan dan pencerapan guru 
              merangkumi 3 subjek utama dalam program 3 fasa (Jan 2026 - Apr 2027)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}