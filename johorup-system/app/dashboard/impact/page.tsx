'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, LanguageToggle, shouldShowLanguageToggle } from '@/lib/languageUtils';

export default function ImpactAnalysis() {
  const [user, setUser] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState('academic');
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getImpactData = () => {
    if (user?.role === 'strategic_jcorp') {
      return {
        organization: language === 'ms' ? 'Yayasan JCorp' : 'JCorp Foundation',
        totalBeneficiaries: 830,
        schoolsReached: 20,
        teachersTrained: 132,
        impactMetrics: {
          academic: {
            title: language === 'ms' ? 'Sasaran Impak Akademik' : 'Academic Impact Targets',
            metrics: [
              { 
                label: language === 'ms' ? 'Fasa 1: Pengambilan Murid' : 'Phase 1: Student Recruitment', 
                value: language === 'ms' ? '830 murid' : '830 students', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Fasa 2: Peningkatan Gred' : 'Phase 2: Grade Improvement', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Fasa 3: Prestasi SPM' : 'Phase 3: SPM Performance', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Pendidikan Lepas Menengah' : 'Post-Secondary Education', 
                value: '70%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              }
            ]
          },
          social: {
            title: language === 'ms' ? 'Sasaran Penglibatan' : 'Engagement Targets',
            metrics: [
              { 
                label: language === 'ms' ? 'Kehadiran Kelas Tuisyen' : 'Tuition Class Attendance', 
                value: '90%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Penyertaan Ceramah Kerjaya' : 'Career Talk Participation', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Bengkel Komunikasi' : 'Communication Workshop', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Kehadiran Latihan Guru' : 'Teacher Training Attendance', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              }
            ]
          },
          economic: {
            title: language === 'ms' ? 'Kecekapan Program' : 'Programme Efficiency',
            metrics: [
              { 
                label: language === 'ms' ? 'Penyertaan Sekolah' : 'Schools Participation', 
                value: language === 'ms' ? '20 sekolah' : '20 schools', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Liputan Subjek' : 'Subject Coverage', 
                value: language === 'ms' ? '3 subjek' : '3 subjects', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Tempoh Program' : 'Programme Duration', 
                value: language === 'ms' ? '16 bulan' : '16 months', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Pembahagian Fasa' : 'Phase Distribution', 
                value: language === 'ms' ? '4+5+7 bulan' : '4+5+7 months', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              }
            ]
          }
        },
        successStories: language === 'ms' ? [
          {
            title: 'Fasa 1: Strategi Pengambilan Komprehensif',
            description: 'Pengambilan sistematik 830 murid Tingkatan 5 merentasi 20 sekolah di Johor, dengan program latihan guru berstruktur untuk 132 pendidik.',
            impact: 'Asas kejayaan program'
          },
          {
            title: 'Fasa 2: Penyampaian Program Multi-Modal',
            description: 'Pendekatan bersepadu menggabungkan kelas tuisyen, bimbingan kerjaya, dan bengkel komunikasi dengan sasaran penyertaan 80-90%.',
            impact: 'Pembangunan murid holistik'
          },
          {
            title: 'Fasa 3: Kecemerlangan SPM & Kesediaan Masa Depan',
            description: 'Fokus pada peningkatan prestasi SPM dan bimbingan pendidikan lepas menengah, menyasarkan 80% peningkatan gred dan 70% melanjutkan pendidikan.',
            impact: 'Impak pendidikan jangka panjang'
          }
        ] : [
          {
            title: 'Phase 1: Comprehensive Recruitment Strategy',
            description: 'Systematic recruitment of 830 Form 5 students across 20 schools in Johor, with structured teacher training programme for 132 educators.',
            impact: 'Foundation for programme success'
          },
          {
            title: 'Phase 2: Multi-Modal Programme Delivery',
            description: 'Integrated approach combining tuition classes, career guidance, and communication workshops with 80-90% participation targets.',
            impact: 'Holistic student development'
          },
          {
            title: 'Phase 3: SPM Excellence & Future Readiness',
            description: 'Focus on SPM performance improvement and post-secondary education guidance, targeting 80% grade improvement and 70% further education pursuit.',
            impact: 'Long-term educational impact'
          }
        ]
      };
    } else if (user?.role === 'strategic_hasanah') {
      return {
        organization: language === 'ms' ? 'Yayasan Hasanah' : 'Hasanah Foundation',
        totalBeneficiaries: 830,
        schoolsReached: 20,
        teachersTrained: 132,
        impactMetrics: {
          academic: {
            title: language === 'ms' ? 'Sasaran Impak Akademik' : 'Academic Impact Targets',
            metrics: [
              { 
                label: language === 'ms' ? 'Fasa 1: Pengambilan Murid' : 'Phase 1: Student Recruitment', 
                value: language === 'ms' ? '830 murid' : '830 students', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Fasa 2: Peningkatan Gred' : 'Phase 2: Grade Improvement', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Fasa 3: Prestasi SPM' : 'Phase 3: SPM Performance', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Pendidikan Lepas Menengah' : 'Post-Secondary Education', 
                value: '70%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              }
            ]
          },
          social: {
            title: language === 'ms' ? 'Sasaran Penglibatan' : 'Engagement Targets',
            metrics: [
              { 
                label: language === 'ms' ? 'Kehadiran Kelas Tuisyen' : 'Tuition Class Attendance', 
                value: '90%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Penyertaan Ceramah Kerjaya' : 'Career Talk Participation', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Bengkel Komunikasi' : 'Communication Workshop', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Kehadiran Latihan Guru' : 'Teacher Training Attendance', 
                value: '80%', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              }
            ]
          },
          economic: {
            title: language === 'ms' ? 'Kecekapan Program' : 'Programme Efficiency',
            metrics: [
              { 
                label: language === 'ms' ? 'Penyertaan Sekolah' : 'Schools Participation', 
                value: language === 'ms' ? '20 sekolah' : '20 schools', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Liputan Subjek' : 'Subject Coverage', 
                value: language === 'ms' ? '3 subjek' : '3 subjects', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Tempoh Program' : 'Programme Duration', 
                value: language === 'ms' ? '16 bulan' : '16 months', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              },
              { 
                label: language === 'ms' ? 'Pembahagian Fasa' : 'Phase Distribution', 
                value: language === 'ms' ? '4+5+7 bulan' : '4+5+7 months', 
                change: language === 'ms' ? 'Sasaran' : 'Target' 
              }
            ]
          }
        },
        successStories: language === 'ms' ? [
          {
            title: 'Fasa 1: Strategi Pengambilan Komprehensif',
            description: 'Pengambilan sistematik 830 murid Tingkatan 5 merentasi 20 sekolah di Johor, dengan program latihan guru berstruktur untuk 132 pendidik.',
            impact: 'Asas kejayaan program'
          },
          {
            title: 'Fasa 2: Penyampaian Program Multi-Modal',
            description: 'Pendekatan bersepadu menggabungkan kelas tuisyen, bimbingan kerjaya, dan bengkel komunikasi dengan sasaran penyertaan 80-90%.',
            impact: 'Pembangunan murid holistik'
          },
          {
            title: 'Fasa 3: Kecemerlangan SPM & Kesediaan Masa Depan',
            description: 'Fokus pada peningkatan prestasi SPM dan bimbingan pendidikan lepas menengah, menyasarkan 80% peningkatan gred dan 70% melanjutkan pendidikan.',
            impact: 'Impak pendidikan jangka panjang'
          }
        ] : [
          {
            title: 'Phase 1: Comprehensive Recruitment Strategy',
            description: 'Systematic recruitment of 830 Form 5 students across 20 schools in Johor, with structured teacher training programme for 132 educators.',
            impact: 'Foundation for programme success'
          },
          {
            title: 'Phase 2: Multi-Modal Programme Delivery',
            description: 'Integrated approach combining tuition classes, career guidance, and communication workshops with 80-90% participation targets.',
            impact: 'Holistic student development'
          },
          {
            title: 'Phase 3: SPM Excellence & Future Readiness',
            description: 'Focus on SPM performance improvement and post-secondary education guidance, targeting 80% grade improvement and 70% further education pursuit.',
            impact: 'Long-term educational impact'
          }
        ]
      };
    }
    return null;
  };

  const impactData = getImpactData();

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600';
    if (change.startsWith('-') && !change.includes('Cost')) return 'text-red-600';
    if (change.startsWith('-') && change.includes('Cost')) return 'text-green-600'; // Cost reduction is good
    if (change === 'New') return 'text-blue-600';
    return 'text-gray-600';
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

  if (!impactData) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          {language === 'ms' ? 'Memuatkan analisis impak...' : 'Loading impact analysis...'}
        </div>
      </div>
    );
  }

  const currentMetrics = impactData.impactMetrics[selectedMetric as keyof typeof impactData.impactMetrics];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('impactAnalysis')}</h1>
            <p className="text-gray-600 mt-1">
              {impactData.organization} - {language === 'ms' ? 'Penilaian Impak Program' : 'Program Impact Assessment'}
            </p>
          </div>
          {shouldShowLanguageToggle(user.role) && (
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          )}
        </div>
      </div>

      {/* Impact Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {language === 'ms' ? 'Sasaran Penerima Manfaat' : 'Target Beneficiaries'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              830
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ms' ? 'Murid Tingkatan 5 (sasaran Fasa 1)' : 'Form 5 students (Phase 1 target)'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {language === 'ms' ? 'Sasaran Sekolah' : 'Schools Target'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              20
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ms' ? 'Sekolah di Johor' : 'Schools in Johor'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {language === 'ms' ? 'Sasaran Guru' : 'Teachers Target'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              132
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ms' ? 'Peserta latihan' : 'Training participants'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {language === 'ms' ? 'Tempoh Program' : 'Programme Duration'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {language === 'ms' ? '16 Bulan' : '16 Months'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Jan 2026 - Apr 2027</p>
          </CardContent>
        </Card>
      </div>

      {/* Impact Metrics Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            📊 {language === 'ms' ? 'Analisis Metrik Impak' : 'Impact Metrics Analysis'}
          </CardTitle>
          <div className="flex space-x-4 mt-4">
            {Object.entries(impactData.impactMetrics).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {data.title}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentMetrics.metrics.map((metric, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {metric.label}
                </div>
                <div className={`text-xs font-medium ${getChangeColor(metric.change)}`}>
                  {metric.change} {language === 'ms' ? 'dari garis dasar' : 'from baseline'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            🌟 {language === 'ms' ? 'Kisah Kejayaan & Kajian Kes' : 'Success Stories & Case Studies'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {impactData.successStories.map((story, index) => (
              <div key={index} className="border-l-4 border-l-blue-500 pl-6 py-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {story.title}
                </h3>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {story.description}
                </p>
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {story.impact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📈 {language === 'ms' ? 'Kemajuan Pelaksanaan 3-Fasa' : '3-Phase Implementation Progress'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'ms' ? 'Fasa 1: Perancangan & Persediaan' : 'Phase 1: Planning & Setup'}
                </span>
                <span className="text-sm font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-orange-600 h-3 rounded-full" style={{ width: '0%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'ms' ? 'Fasa 2: Pelaksanaan' : 'Phase 2: Implementation'}
                </span>
                <span className="text-sm font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gray-400 h-3 rounded-full" style={{ width: '0%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'ms' ? 'Fasa 3: Penilaian' : 'Phase 3: Evaluation'}
                </span>
                <span className="text-sm font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gray-400 h-3 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              🗓️ {language === 'ms' ? 'Garis Masa Pelaksanaan' : 'Implementation Timeline'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <div className="text-2xl font-bold text-orange-600">8</div>
                <div className="text-sm text-gray-600 mt-1">
                  {language === 'ms' ? 'Bulan - Fasa 1' : 'Months - Phase 1'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'ms' ? 'Dis 2025 - Jul 2026' : 'Dec 2025 - Jul 2026'}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-400">6</div>
                <div className="text-sm text-gray-600 mt-1">
                  {language === 'ms' ? 'Bulan - Fasa 2' : 'Months - Phase 2'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'ms' ? 'Ogs 2026 - Jan 2027' : 'Aug 2026 - Jan 2027'}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-400">3</div>
                <div className="text-sm text-gray-600 mt-1">
                  {language === 'ms' ? 'Bulan - Fasa 3' : 'Months - Phase 3'}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'ms' ? 'Feb 2027 - Apr 2027' : 'Feb 2027 - Apr 2027'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Long-term Implementation Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            🔮 {language === 'ms' ? 'Unjuran Pelaksanaan 3-Fasa (Dis 2025 - Apr 2027)' : '3-Phase Implementation Projections (Dec 2025 - Apr 2027)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {language === 'ms' ? 'Fasa 1: Perancangan' : 'Phase 1: Planning'}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'ms' 
                  ? 'Perancangan strategik, peruntukan sumber, dan penubuhan rangka kerja'
                  : 'Strategic planning, resource allocation, and framework establishment'
                }
              </p>
              <div className="text-lg font-bold text-orange-600">
                {language === 'ms' ? 'Dis 2025 - Jul 2026' : 'Dec 2025 - Jul 2026'}
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {language === 'ms' ? 'Fasa 2: Pelaksanaan' : 'Phase 2: Implementation'}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'ms' 
                  ? 'Pelaksanaan program, sistem pemantauan, dan penjejakan prestasi'
                  : 'Program execution, monitoring systems, and performance tracking'
                }
              </p>
              <div className="text-lg font-bold text-gray-600">
                {language === 'ms' ? 'Ogs 2026 - Jan 2027' : 'Aug 2026 - Jan 2027'}
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {language === 'ms' ? 'Fasa 3: Penilaian' : 'Phase 3: Evaluation'}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'ms' 
                  ? 'Penilaian impak, penilaian hasil, dan perancangan kemampanan'
                  : 'Impact assessment, outcome evaluation, and sustainability planning'
                }
              </p>
              <div className="text-lg font-bold text-gray-600">
                {language === 'ms' ? 'Feb 2027 - Apr 2027' : 'Feb 2027 - Apr 2027'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}