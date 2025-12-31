'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TuitionReportsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Laporan Tuisyen</h1>
        <p className="text-gray-600 mt-1">Pemantauan Program Kelas Tambahan Daerah</p>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 border-2 ${getSubjectColor()}`}>
          Subjek: {getSISCSubject()}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kelas Tuisyen Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Kelas {getSISCSubject()}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kehadiran Purata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0%</div>
            <p className="text-xs text-gray-500 mt-1">Kehadiran murid</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Murid Terlibat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Murid dari 2 sekolah</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Peningkatan Prestasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0%</div>
            <p className="text-xs text-gray-500 mt-1">Peningkatan gred</p>
          </CardContent>
        </Card>
      </div>

      {/* Tuition Program Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            📚 Status Program Tuisyen - {getSISCSubject()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-3">🏫 Sekolah Daerah</h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                  Tiada maklumat sekolah tersedia. Sila hubungi PPD untuk senarai sekolah daerah.
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-3">📊 Program Tuisyen</h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                  Tiada program tuisyen aktif. Program akan dimulakan mengikut jadual 3 fasa.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3-Phase Tuition Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            🎯 Target Tuisyen 3 Fasa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-800 mb-2">Phase 1: Persiapan</h3>
              <p className="text-sm text-gray-600 mb-2">Jan - Apr 2026</p>
              <div className="space-y-2 text-xs text-gray-700">
                <div>• Latihan guru tuisyen</div>
                <div>• Penyediaan modul</div>
                <div>• Pengenalpastian murid</div>
                <div>• Penetapan jadual</div>
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-800 mb-2">Phase 2: Pelaksanaan</h3>
              <p className="text-sm text-gray-600 mb-2">May - Sep 2026</p>
              <div className="space-y-2 text-xs text-gray-700">
                <div>• 90% kehadiran murid</div>
                <div>• Pemantauan mingguan</div>
                <div>• Penilaian berkala</div>
                <div>• Laporan bulanan</div>
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Phase 3: Penilaian</h3>
              <p className="text-sm text-gray-600 mb-2">Oct 2026 - Apr 2027</p>
              <div className="space-y-2 text-xs text-gray-700">
                <div>• 80% peningkatan gred</div>
                <div>• Analisis keberkesanan</div>
                <div>• Dokumentasi best practice</div>
                <div>• Laporan akhir</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📊 Laporan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Januari 2026', 'Februari 2026', 'Mac 2026', 'April 2026'].map((month, index) => (
                <div key={month} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{month}</div>
                    <div className="text-sm text-gray-600">
                      Laporan Tuisyen {getSISCSubject()}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      Belum Tersedia
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📈 Metrik Prestasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Kehadiran Purata</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Kehadiran murid</div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Peningkatan Gred</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Peningkatan prestasi</div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Sesi Tuisyen Selesai</span>
                  <span>0 sesi</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Mingguan</div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Murid Mencapai Target</span>
                  <span>0 murid</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Dari murid daerah</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tuition Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            🎯 Kerangka Program Tuisyen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Pengenalpastian</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Murid lemah subjek</li>
                <li>• Analisis keputusan</li>
                <li>• Penetapan sasaran</li>
                <li>• Kumpulan tuisyen</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Pelaksanaan</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Modul khusus</li>
                <li>• Teknik pengajaran</li>
                <li>• Aktiviti interaktif</li>
                <li>• Penilaian berkala</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <h4 className="font-semibold text-purple-800 mb-2">Pemantauan</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Kehadiran murid</li>
                <li>• Progress pembelajaran</li>
                <li>• Maklum balas guru</li>
                <li>• Laporan SISC+</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
              <h4 className="font-semibold text-orange-800 mb-2">Penilaian</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ujian berkala</li>
                <li>• Peningkatan gred</li>
                <li>• Analisis keberkesanan</li>
                <li>• Cadangan penambahbaikan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}