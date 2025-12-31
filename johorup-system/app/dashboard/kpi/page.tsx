'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, LanguageToggle, shouldShowLanguageToggle } from '@/lib/languageUtils';

interface KPIData {
  year: string;
  budget: number;
  actualSpent: number;
  percentage: number;
  reportingPeriod: string;
  achievements: string[];
  challenges: string[];
}

export default function KPIDashboard() {
  const [user, setUser] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState('Phase 1');
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // KPI data based on 3-phase implementation plan with specific targets
  const getKPIData = (): KPIData[] => {
    if (user?.role === 'strategic_jcorp') {
      return [
        {
          year: language === 'ms' ? 'Fasa 1' : 'Phase 1',
          budget: 0,
          actualSpent: 0,
          percentage: 0,
          reportingPeriod: '1 Jan 2026 - 30 Apr 2026',
          achievements: language === 'ms' ? [
            'Sasaran: Sekurang-kurangnya 830 murid Tingkatan 5 dari sekurang-kurangnya 20 sekolah di Johor direkrut',
            'Sasaran: 80% (104 daripada 132) kehadiran bengkel latihan guru',
            'Sasaran: Modul program untuk 3 subjek (Bahasa Melayu, Sejarah, Matematik)',
            'Sasaran: 2 kakitangan program Yayasan JCorp meningkatkan pengetahuan'
          ] : [
            'Target: At least 830 Form 5 students at least 20 schools in Johor recruited',
            'Target: 80% (104 out of 132) teachers training workshop attendance',
            'Target: Programme modules for 3 subjects (Bahasa Melayu, Sejarah, Mathematics)',
            'Target: 2 Yayasan JCorp programme staff knowledge increase'
          ],
          challenges: language === 'ms' ? [
            'Pengambilan murid dan penubuhan perkongsian sekolah',
            'Penyelarasan bengkel latihan guru',
            'Pembangunan dan penyampaian modul program'
          ] : [
            'Student recruitment and school partnerships establishment',
            'Teacher training workshop coordination',
            'Programme module development and delivery'
          ]
        },
        {
          year: language === 'ms' ? 'Fasa 2' : 'Phase 2', 
          budget: 0,
          actualSpent: 0,
          percentage: 0,
          reportingPeriod: '1 May 2026 - 30 Sep 2026',
          achievements: language === 'ms' ? [
            'Sasaran: Sekurang-kurangnya 90% (792 daripada 880) murid menghadiri sekurang-kurangnya 10 kelas tuisyen fizikal',
            'Sasaran: Sekurang-kurangnya 80% (704 daripada 880) murid menghadiri Ceramah Kerjaya dan Lawatan Pendidikan',
            'Sasaran: Sekurang-kurangnya 80% (704 daripada 880) murid menghadiri bengkel Komunikasi',
            'Sasaran: Sekurang-kurangnya 80% (704 daripada 880) murid mencapai sekurang-kurangnya satu gred naik dalam penilaian pertengahan tahun sekolah'
          ] : [
            'Target: At least 90% (792 out of 880) students attend at least 10 physical tuition classes',
            'Target: At least 80% (704 out of 880) students attend Career Talk and Educational Visit',
            'Target: At least 80% (704 out of 880) students attend Communications workshop',
            'Target: At least 80% (704 out of 880) students achieve at least one grade up in mid-year school assessment'
          ],
          challenges: language === 'ms' ? [
            'Pengurusan kehadiran kelas tuisyen fizikal',
            'Penyelarasan bimbingan kerjaya dan lawatan pendidikan',
            'Penjejakan peningkatan prestasi murid'
          ] : [
            'Physical tuition class attendance management',
            'Career guidance and educational visit coordination',
            'Student performance improvement tracking'
          ]
        },
        {
          year: language === 'ms' ? 'Fasa 3' : 'Phase 3',
          budget: 0,
          actualSpent: 0,
          percentage: 0,
          reportingPeriod: '1 Oct 2026 - 30 Apr 2027',
          achievements: language === 'ms' ? [
            'Sasaran: Sekurang-kurangnya 90% (792 daripada 880) murid menghadiri sekurang-kurangnya 2 kelas tuisyen fizikal',
            'Sasaran: Sekurang-kurangnya 80% (80 daripada 100) murid mencapai sekurang-kurangnya dua gred naik dalam SPM',
            'Sasaran: Sekurang-kurangnya 70% (70 daripada 100) meneruskan pendidikan lepas menengah selepas menamatkan SPM',
            'Sasaran: Laporan Akhir menyusun semua aktiviti dan objektif projek yang dicapai'
          ] : [
            'Target: At least 90% (792 out of 880) students attend at least 2 physical tuition classes',
            'Target: At least 80% (80 out of 100) students achieve at least two grades up in SPM',
            'Target: At least 70% (70 out of 100) pursue post-secondary education after completing SPM',
            'Target: Final Report compiling all activities and project objectives achieved'
          ],
          challenges: language === 'ms' ? [
            'Persediaan dan prestasi peperiksaan SPM',
            'Bimbingan dan sokongan pendidikan lepas menengah',
            'Penilaian program komprehensif dan pelaporan'
          ] : [
            'SPM examination preparation and performance',
            'Post-secondary education guidance and support',
            'Comprehensive program evaluation and reporting'
          ]
        }
      ];
    } else if (user?.role === 'strategic_hasanah') {
      return [
        {
          year: language === 'ms' ? 'Fasa 1' : 'Phase 1',
          budget: 0,
          actualSpent: 0,
          percentage: 0,
          reportingPeriod: '1 Jan 2026 - 30 Apr 2026',
          achievements: language === 'ms' ? [
            'Sasaran: Sekurang-kurangnya 830 murid Tingkatan 5 dari sekurang-kurangnya 20 sekolah di Johor direkrut',
            'Sasaran: 80% (104 daripada 132) kehadiran bengkel latihan guru',
            'Sasaran: Modul program untuk 3 subjek (Bahasa Melayu, Sejarah, Matematik)',
            'Sasaran: 2 kakitangan program Yayasan Hasanah meningkatkan pengetahuan'
          ] : [
            'Target: At least 830 Form 5 students at least 20 schools in Johor recruited',
            'Target: 80% (104 out of 132) teachers training workshop attendance',
            'Target: Programme modules for 3 subjects (Bahasa Melayu, Sejarah, Mathematics)',
            'Target: 2 Yayasan Hasanah programme staff knowledge increase'
          ],
          challenges: language === 'ms' ? [
            'Pengambilan murid dan penubuhan perkongsian sekolah',
            'Penyelarasan bengkel latihan guru',
            'Pembangunan dan penyampaian modul program'
          ] : [
            'Student recruitment and school partnerships establishment',
            'Teacher training workshop coordination',
            'Programme module development and delivery'
          ]
        },
        {
          year: language === 'ms' ? 'Fasa 2' : 'Phase 2',
          budget: 0,
          actualSpent: 0,
          percentage: 0,
          reportingPeriod: '1 May 2026 - 30 Sep 2026',
          achievements: language === 'ms' ? [
            'Sasaran: Sekurang-kurangnya 90% (792 daripada 880) murid menghadiri sekurang-kurangnya 10 kelas tuisyen fizikal',
            'Sasaran: Sekurang-kurangnya 80% (704 daripada 880) murid menghadiri Ceramah Kerjaya dan Lawatan Pendidikan',
            'Sasaran: Sekurang-kurangnya 80% (704 daripada 880) murid menghadiri bengkel Komunikasi',
            'Sasaran: Sekurang-kurangnya 80% (704 daripada 880) murid mencapai sekurang-kurangnya satu gred naik dalam penilaian pertengahan tahun'
          ] : [
            'Target: At least 90% (792 out of 880) students attend at least 10 physical tuition classes',
            'Target: At least 80% (704 out of 880) students attend Career Talk and Educational Visit',
            'Target: At least 80% (704 out of 880) students attend Communications workshop',
            'Target: At least 80% (704 out of 880) students achieve at least one grade up in mid-year assessment'
          ],
          challenges: language === 'ms' ? [
            'Pengurusan kehadiran kelas tuisyen fizikal',
            'Penyelarasan bimbingan kerjaya dan lawatan pendidikan',
            'Penjejakan peningkatan prestasi murid'
          ] : [
            'Physical tuition class attendance management',
            'Career guidance and educational visit coordination',
            'Student performance improvement tracking'
          ]
        },
        {
          year: language === 'ms' ? 'Fasa 3' : 'Phase 3',
          budget: 0,
          actualSpent: 0,
          percentage: 0,
          reportingPeriod: '1 Oct 2026 - 30 Apr 2027',
          achievements: language === 'ms' ? [
            'Sasaran: Sekurang-kurangnya 90% (792 daripada 880) murid menghadiri sekurang-kurangnya 2 kelas tuisyen fizikal',
            'Sasaran: Sekurang-kurangnya 80% (80 daripada 100) murid mencapai sekurang-kurangnya dua gred naik dalam SPM',
            'Sasaran: Sekurang-kurangnya 70% (70 daripada 100) meneruskan pendidikan lepas menengah selepas menamatkan SPM',
            'Sasaran: Laporan Akhir menyusun semua aktiviti dan objektif projek yang dicapai'
          ] : [
            'Target: At least 90% (792 out of 880) students attend at least 2 physical tuition classes',
            'Target: At least 80% (80 out of 100) students achieve at least two grades up in SPM',
            'Target: At least 70% (70 out of 100) pursue post-secondary education after completing SPM',
            'Target: Final Report compiling all activities and project objectives achieved'
          ],
          challenges: language === 'ms' ? [
            'Persediaan dan prestasi peperiksaan SPM',
            'Bimbingan dan sokongan pendidikan lepas menengah',
            'Penilaian program komprehensif dan pelaporan'
          ] : [
            'SPM examination preparation and performance',
            'Post-secondary education guidance and support',
            'Comprehensive program evaluation and reporting'
          ]
        }
      ];
    }
    return [];
  };

  const kpiData = getKPIData();
  const currentYearData = kpiData.find(data => data.year === selectedYear);

  const getOrganizationName = () => {
    if (user?.role === 'strategic_jcorp') return language === 'ms' ? 'Yayasan JCorp' : 'JCorp Foundation';
    if (user?.role === 'strategic_hasanah') return language === 'ms' ? 'Yayasan Hasanah' : 'Hasanah Foundation';
    return language === 'ms' ? 'Organisasi Strategik' : 'Strategic Organization';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!user || (user.role !== 'strategic_jcorp' && user.role !== 'strategic_hasanah')) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          {language === 'ms' 
            ? 'Akses ditolak. Halaman ini hanya tersedia untuk penonton strategik.'
            : 'Access denied. This page is only available for strategic viewers.'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('kpiDashboard')}</h1>
          <p className="text-gray-600 mt-1">
            {getOrganizationName()} - {language === 'ms' ? 'Petunjuk Prestasi Strategik' : 'Strategic Performance Indicators'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {shouldShowLanguageToggle(user.role) && (
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          )}
          <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
            {language === 'ms' ? 'Tahun Pelaporan:' : 'Reporting Year:'}
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {kpiData.map((data) => (
              <option key={data.year} value={data.year}>
                {data.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentYearData && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{t('targetStudents')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  830
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ms' ? 'Murid Tingkatan 5 (20 sekolah)' : 'Form 5 students (20 schools)'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{t('targetTeachers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  132
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ms' ? 'Peserta bengkel latihan' : 'Training workshop participants'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{t('currentPhase')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {language === 'ms' ? 'Fasa 1' : 'Phase 1'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full bg-orange-600"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {language === 'ms' ? 'Tempoh Program' : 'Programme Duration'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {language === 'ms' ? '16 Bulan' : '16 Months'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Jan 2026 - Apr 2027</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-green-700">
                  🎯 {language === 'ms' ? 'Pencapaian Utama' : 'Key Achievements'} ({selectedYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentYearData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{achievement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-orange-700">
                  ⚠️ {language === 'ms' ? 'Cabaran Utama' : 'Key Challenges'} ({selectedYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentYearData.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{challenge}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3-Phase Implementation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                📅 {language === 'ms' ? 'Garis Masa Pelaksanaan 3-Fasa (Jan 2026 - Apr 2027)' : '3-Phase Implementation Timeline (Jan 2026 - Apr 2027)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        {language === 'ms' ? 'Fasa' : 'Phase'}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        {language === 'ms' ? 'Tempoh' : 'Duration'}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        {t('timeline')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        {t('status')}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        {language === 'ms' ? 'Sasaran Utama' : 'Key Targets'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 bg-orange-50">
                      <td className="py-3 px-4 font-medium">
                        {language === 'ms' ? 'Fasa 1: Pengambilan & Latihan' : 'Phase 1: Recruitment & Training'}
                      </td>
                      <td className="py-3 px-4">{language === 'ms' ? '4 bulan' : '4 months'}</td>
                      <td className="py-3 px-4">Jan 2026 - Apr 2026</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100">
                          {language === 'ms' ? 'Sedia Bermula' : 'Ready to Begin'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {language === 'ms' ? '830 murid, 132 guru, 3 subjek' : '830 students, 132 teachers, 3 subjects'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">
                        {language === 'ms' ? 'Fasa 2: Penyampaian Program' : 'Phase 2: Programme Delivery'}
                      </td>
                      <td className="py-3 px-4">{language === 'ms' ? '5 bulan' : '5 months'}</td>
                      <td className="py-3 px-4">May 2026 - Sep 2026</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                          {language === 'ms' ? 'Menunggu' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {language === 'ms' ? '90% kehadiran, 80% peningkatan gred' : '90% attendance, 80% grade improvement'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">
                        {language === 'ms' ? 'Fasa 3: Persediaan SPM & Penilaian' : 'Phase 3: SPM Preparation & Evaluation'}
                      </td>
                      <td className="py-3 px-4">{language === 'ms' ? '7 bulan' : '7 months'}</td>
                      <td className="py-3 px-4">Oct 2026 - Apr 2027</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                          {language === 'ms' ? 'Menunggu' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {language === 'ms' ? '80% peningkatan SPM, 70% lepas menengah' : '80% SPM improvement, 70% post-secondary'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Phase-Specific KPI Targets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                🎯 {language === 'ms' ? 'Sasaran KPI Khusus Fasa' : 'Phase-Specific KPI Targets'} - {getOrganizationName()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {language === 'ms' ? 'Fasa 1' : 'Phase 1'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {language === 'ms' ? 'Pengambilan & Latihan' : 'Recruitment & Training'}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {language === 'ms' ? (
                      <>
                        • 830 murid Tingkatan 5<br/>
                        • 20 sekolah di Johor<br/>
                        • 132 guru (80% kehadiran)<br/>
                        • 3 modul subjek
                      </>
                    ) : (
                      <>
                        • 830 Form 5 students<br/>
                        • 20 schools in Johor<br/>
                        • 132 teachers (80% attendance)<br/>
                        • 3 subject modules
                      </>
                    )}
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {language === 'ms' ? 'Fasa 2' : 'Phase 2'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {language === 'ms' ? 'Penyampaian Program' : 'Programme Delivery'}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {language === 'ms' ? (
                      <>
                        • 90% kehadiran tuisyen<br/>
                        • 80% penyertaan ceramah kerjaya<br/>
                        • 80% bengkel komunikasi<br/>
                        • 80% peningkatan gred
                      </>
                    ) : (
                      <>
                        • 90% tuition attendance<br/>
                        • 80% career talk participation<br/>
                        • 80% communication workshop<br/>
                        • 80% grade improvement
                      </>
                    )}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {language === 'ms' ? 'Fasa 3' : 'Phase 3'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {language === 'ms' ? 'SPM & Penilaian' : 'SPM & Evaluation'}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {language === 'ms' ? (
                      <>
                        • 90% kehadiran tuisyen SPM<br/>
                        • 80% peningkatan gred SPM<br/>
                        • 70% melanjutkan lepas menengah<br/>
                        • Laporan komprehensif akhir
                      </>
                    ) : (
                      <>
                        • 90% SPM tuition attendance<br/>
                        • 80% SPM grade improvement<br/>
                        • 70% post-secondary pursuit<br/>
                        • Final comprehensive report
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}