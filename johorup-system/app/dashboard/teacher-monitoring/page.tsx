'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherMonitoringPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Pencerapan Guru</h1>
        <p className="text-gray-600 mt-1">Pemantauan dan Bimbingan Guru Daerah</p>
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
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Guru subjek {getSISCSubject()}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sesi Pencerapan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Sesi selesai bulan ini</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Laporan Pencerapan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Laporan diserahkan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Progress Keseluruhan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0%</div>
            <p className="text-xs text-gray-500 mt-1">Pencerapan selesai</p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            👨‍🏫 Senarai Guru Daerah - {getSISCSubject()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Nama Guru</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Sekolah</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Pengalaman</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status Pencerapan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Skor PdP</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Tiada data guru tersedia. Sila hubungi PPD untuk maklumat guru daerah.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📅 Jadual Pencerapan Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'].map((day, index) => (
                <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{day}</div>
                    <div className="text-sm text-gray-600">
                      Tiada jadual ditetapkan
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    -
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📊 Metrik Pencerapan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Guru Telah Dicerap</span>
                  <span>0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Sesi Pencerapan Selesai</span>
                  <span>0 sesi</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Laporan Diserahkan</span>
                  <span>0 laporan</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Purata Skor PdP</span>
                  <span>-</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observation Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            🎯 Kerangka Pencerapan PdP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Perancangan</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Rancangan pengajaran</li>
                <li>• Objektif pembelajaran</li>
                <li>• Bahan bantu mengajar</li>
                <li>• Penilaian formatif</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Pelaksanaan</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Teknik pengajaran</li>
                <li>• Penglibatan murid</li>
                <li>• Pengurusan masa</li>
                <li>• Penggunaan teknologi</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <h4 className="font-semibold text-purple-800 mb-2">Penilaian</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Kaedah penilaian</li>
                <li>• Maklum balas</li>
                <li>• Pencapaian objektif</li>
                <li>• Refleksi pembelajaran</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
              <h4 className="font-semibold text-orange-800 mb-2">Penambahbaikan</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Cadangan SISC+</li>
                <li>• Tindakan susulan</li>
                <li>• Latihan lanjutan</li>
                <li>• Pemantauan berterusan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}