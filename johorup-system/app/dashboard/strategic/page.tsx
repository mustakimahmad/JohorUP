'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, LanguageToggle, shouldShowLanguageToggle } from '@/lib/languageUtils';

export default function StrategicOverview() {
  const [user, setUser] = useState<any>(null);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getOrganizationData = () => {
    if (user?.role === 'strategic_jcorp') {
      return {
        name: language === 'ms' ? 'Yayasan JCorp' : 'JCorp Foundation',
        totalBudget: 0,
        currentSpending: 0,
        studentsTarget: 830,
        studentsAchieved: 0,
        programFocus: language === 'ms' 
          ? '3-Phase KPI Implementation (Jan 2026 - Apr 2027)'
          : '3-Phase KPI Implementation (Jan 2026 - Apr 2027)',
        keyMetrics: [
          { 
            label: language === 'ms' ? 'Fasa 1: Pengambilan' : 'Phase 1: Recruitment', 
            value: language === 'ms' ? 'Sedia' : 'Ready', 
            status: 'attention' 
          },
          { 
            label: language === 'ms' ? 'Fasa 2: Penyampaian Program' : 'Phase 2: Programme Delivery', 
            value: language === 'ms' ? 'Menunggu' : 'Pending', 
            status: 'attention' 
          },
          { 
            label: language === 'ms' ? 'Fasa 3: SPM & Penilaian' : 'Phase 3: SPM & Evaluation', 
            value: language === 'ms' ? 'Menunggu' : 'Pending', 
            status: 'attention' 
          },
          { 
            label: language === 'ms' ? 'Kemajuan Keseluruhan' : 'Overall Progress', 
            value: '0%', 
            status: 'attention' 
          }
        ],
        recentMilestones: language === 'ms' ? [
          'Rangka kerja KPI diselaraskan dengan struktur 3-fasa',
          'Metrik sasaran ditentukan: 830 murid, 132 guru',
          'Objektif khusus fasa ditetapkan',
          'Sedia untuk memulakan Fasa 1: Pengambilan & Latihan'
        ] : [
          'KPI framework aligned with 3-phase structure',
          'Target metrics defined: 830 students, 132 teachers',
          'Phase-specific objectives established',
          'Ready to begin Phase 1: Recruitment & Training'
        ],
        upcomingTargets: language === 'ms' ? [
          'Fasa 1: Ambil 830 murid Tingkatan 5 dari 20 sekolah (Jan-Apr 2026)',
          'Fasa 1: Latih 132 guru dengan sasaran kehadiran 80%',
          'Fasa 2: Capai 90% kehadiran tuisyen, 80% peningkatan gred (Mei-Sep 2026)',
          'Fasa 3: 80% peningkatan SPM, 70% melanjutkan pendidikan lepas menengah (Okt 2026-Apr 2027)'
        ] : [
          'Phase 1: Recruit 830 Form 5 students from 20 schools (Jan-Apr 2026)',
          'Phase 1: Train 132 teachers with 80% attendance target',
          'Phase 2: Achieve 90% tuition attendance, 80% grade improvement (May-Sep 2026)',
          'Phase 3: 80% SPM improvement, 70% post-secondary pursuit (Oct 2026-Apr 2027)'
        ]
      };
    } else if (user?.role === 'strategic_hasanah') {
      return {
        name: language === 'ms' ? 'Yayasan Hasanah' : 'Hasanah Foundation',
        totalBudget: 0,
        currentSpending: 0,
        studentsTarget: 830,
        studentsAchieved: 0,
        programFocus: language === 'ms' 
          ? '3-Phase KPI Implementation (Jan 2026 - Apr 2027)'
          : '3-Phase KPI Implementation (Jan 2026 - Apr 2027)',
        keyMetrics: [
          { 
            label: language === 'ms' ? 'Fasa 1: Pengambilan' : 'Phase 1: Recruitment', 
            value: language === 'ms' ? 'Sedia' : 'Ready', 
            status: 'attention' 
          },
          { 
            label: language === 'ms' ? 'Fasa 2: Penyampaian Program' : 'Phase 2: Programme Delivery', 
            value: language === 'ms' ? 'Menunggu' : 'Pending', 
            status: 'attention' 
          },
          { 
            label: language === 'ms' ? 'Fasa 3: SPM & Penilaian' : 'Phase 3: SPM & Evaluation', 
            value: language === 'ms' ? 'Menunggu' : 'Pending', 
            status: 'attention' 
          },
          { 
            label: language === 'ms' ? 'Kemajuan Keseluruhan' : 'Overall Progress', 
            value: '0%', 
            status: 'attention' 
          }
        ],
        recentMilestones: language === 'ms' ? [
          'Rangka kerja KPI diselaraskan dengan struktur 3-fasa',
          'Metrik sasaran ditentukan: 830 murid, 132 guru',
          'Objektif khusus fasa ditetapkan',
          'Sedia untuk memulakan Fasa 1: Pengambilan & Latihan'
        ] : [
          'KPI framework aligned with 3-phase structure',
          'Target metrics defined: 830 students, 132 teachers',
          'Phase-specific objectives established',
          'Ready to begin Phase 1: Recruitment & Training'
        ],
        upcomingTargets: language === 'ms' ? [
          'Fasa 1: Ambil 830 murid Tingkatan 5 dari 20 sekolah (Jan-Apr 2026)',
          'Fasa 1: Latih 132 guru dengan sasaran kehadiran 80%',
          'Fasa 2: Capai 90% kehadiran tuisyen, 80% peningkatan gred (Mei-Sep 2026)',
          'Fasa 3: 80% peningkatan SPM, 70% melanjutkan pendidikan lepas menengah (Okt 2026-Apr 2027)'
        ] : [
          'Phase 1: Recruit 830 Form 5 students from 20 schools (Jan-Apr 2026)',
          'Phase 1: Train 132 teachers with 80% attendance target',
          'Phase 2: Achieve 90% tuition attendance, 80% grade improvement (May-Sep 2026)',
          'Phase 3: 80% SPM improvement, 70% post-secondary pursuit (Oct 2026-Apr 2027)'
        ]
      };
    }
    return null;
  };

  const orgData = getOrganizationData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'on-track': return 'text-yellow-600 bg-yellow-100';
      case 'attention': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  if (!orgData) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          {language === 'ms' ? 'Memuatkan gambaran strategik...' : 'Loading strategic overview...'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Language Toggle */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{orgData.name}</h1>
            <p className="text-gray-600 mt-1">
              {language === 'ms' 
                ? 'Gambaran Strategik & Papan Pemuka Prestasi'
                : 'Strategic Overview & Performance Dashboard'
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">{orgData.programFocus}</p>
          </div>
          {shouldShowLanguageToggle(user.role) && (
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          )}
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {language === 'ms' ? 'Bajet Program' : 'Program Budget'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">
              {language === 'ms' ? 'Menunggu' : 'Pending'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ms' ? 'Untuk diperuntukkan' : 'To be allocated'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {language === 'ms' ? 'Fasa Pelaksanaan' : 'Implementation Phase'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {language === 'ms' ? 'Fasa 1' : 'Phase 1'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ms' ? 'Perancangan & Persediaan' : 'Planning & Setup'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('targetStudents')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">830</div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ms' ? 'Murid Tingkatan 5 (20 sekolah)' : 'Form 5 students (20 schools)'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('targetTeachers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">132</div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ms' ? 'Peserta latihan (sasaran 80%)' : 'Training participants (80% target)'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            📊 {language === 'ms' ? 'Petunjuk Prestasi Utama' : 'Key Performance Indicators'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orgData.keyMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 rounded-lg border border-gray-200">
                <div className={`text-xl font-bold mb-2 px-3 py-1 rounded-full inline-block ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Implementation Phase Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📅 {language === 'ms' ? 'Garis Masa Pelaksanaan 3-Fasa' : '3-Phase Implementation Timeline'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{language === 'ms' ? 'Kemajuan Keseluruhan' : 'Overall Progress'}</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gray-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-orange-600 font-semibold">
                    {language === 'ms' ? 'Fasa 1' : 'Phase 1'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {language === 'ms' ? 'Perancangan & Persediaan' : 'Planning & Setup'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'ms' ? 'Dis 2025 - Jul 2026' : 'Dec 2025 - Jul 2026'}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 font-semibold">
                    {language === 'ms' ? 'Fasa 2' : 'Phase 2'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {language === 'ms' ? 'Pelaksanaan' : 'Implementation'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'ms' ? 'Ogs 2026 - Jan 2027' : 'Aug 2026 - Jan 2027'}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 font-semibold">
                    {language === 'ms' ? 'Fasa 3' : 'Phase 3'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {language === 'ms' ? 'Penilaian' : 'Evaluation'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'ms' ? 'Feb 2027 - Apr 2027' : 'Feb 2027 - Apr 2027'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              🎯 {language === 'ms' ? 'Fasa Semasa: Perancangan & Persediaan' : 'Current Phase: Planning & Setup'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{language === 'ms' ? 'Kemajuan Fasa 1' : 'Phase 1 Progress'}</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">
                    {language === 'ms' ? 'Tempoh Fasa' : 'Phase Duration'}
                  </div>
                  <div className="font-semibold">
                    {language === 'ms' ? '8 Bulan' : '8 Months'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">{t('status')}</div>
                  <div className="font-semibold text-orange-600">
                    {language === 'ms' ? 'Sedia Bermula' : 'Ready to Begin'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Milestones & Upcoming Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-700">
              ✅ {language === 'ms' ? 'Pencapaian Terkini' : 'Recent Milestones'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orgData.recentMilestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700 leading-relaxed">{milestone}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700">
              🎯 {language === 'ms' ? 'Sasaran Akan Datang' : 'Upcoming Targets'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orgData.upcomingTargets.map((target, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700 leading-relaxed">{target}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            🎯 {language === 'ms' ? 'Pelan Pelaksanaan Strategik 3-Fasa' : '3-Phase Strategic Implementation Plan'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {language === 'ms' ? 'Fasa 1: Pengambilan & Latihan' : 'Phase 1: Recruitment & Training'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {language === 'ms' ? 'Januari 2026 - April 2026 (4 bulan)' : 'January 2026 - April 2026 (4 months)'}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ms' 
                  ? '830 murid Tingkatan 5, 20 sekolah, latihan 132 guru, 3 modul subjek'
                  : '830 Form 5 students, 20 schools, 132 teachers training, 3 subject modules'
                }
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {language === 'ms' ? 'Fasa 2: Penyampaian Program' : 'Phase 2: Programme Delivery'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {language === 'ms' ? 'Mei 2026 - September 2026 (5 bulan)' : 'May 2026 - September 2026 (5 months)'}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ms' 
                  ? '90% kehadiran tuisyen, 80% ceramah kerjaya, 80% bengkel komunikasi, peningkatan gred'
                  : '90% tuition attendance, 80% career talks, 80% communication workshops, grade improvement'
                }
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {language === 'ms' ? 'Fasa 3: SPM & Penilaian' : 'Phase 3: SPM & Evaluation'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {language === 'ms' ? 'Oktober 2026 - April 2027 (7 bulan)' : 'October 2026 - April 2027 (7 months)'}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ms' 
                  ? '80% peningkatan gred SPM, 70% pendidikan lepas menengah, laporan komprehensif akhir'
                  : '80% SPM grade improvement, 70% post-secondary education, final comprehensive report'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}