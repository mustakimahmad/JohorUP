'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, LanguageToggle, shouldShowLanguageToggle } from '@/lib/languageUtils';

export default function StrategicReports() {
  const [user, setUser] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState('quarterly');
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getReportData = () => {
    const baseData = {
      quarterly: {
        title: language === 'ms' ? 'Laporan Perancangan Fasa 1' : 'Phase 1 Planning Report',
        period: language === 'ms' ? 'Disember 2025 - Status Semasa' : 'December 2025 - Current Status',
        sections: [
          {
            title: language === 'ms' ? 'Ringkasan Eksekutif' : 'Executive Summary',
            content: user?.role === 'strategic_jcorp' 
              ? (language === 'ms' 
                ? 'Yayasan JCorp telah memulakan pelan pelaksanaan 3-fasa (Dis 2025 - Apr 2027). Kini dalam peringkat Fasa 1: Perancangan & Persediaan dengan rangka kerja strategik yang telah ditetapkan dan sistem pemantauan beroperasi.'
                : 'Yayasan JCorp has initiated the 3-phase implementation plan (Dec 2025 - Apr 2027). Currently in Phase 1: Planning & Setup stage with strategic framework established and monitoring systems operational.')
              : (language === 'ms' 
                ? 'Yayasan Hasanah telah memulakan pelan pelaksanaan 3-fasa (Dis 2025 - Apr 2027). Kini dalam peringkat Fasa 1: Perancangan & Persediaan dengan rangka kerja strategik yang telah ditetapkan dan sistem pemantauan beroperasi.'
                : 'Yayasan Hasanah has initiated the 3-phase implementation plan (Dec 2025 - Apr 2027). Currently in Phase 1: Planning & Setup stage with strategic framework established and monitoring systems operational.')
          },
          {
            title: language === 'ms' ? 'Status Fasa Semasa' : 'Current Phase Status',
            content: language === 'ms' 
              ? 'Fasa 1: Perancangan & Persediaan (Dis 2025 - Jul 2026) | Tempoh: 8 bulan | Kemajuan: 0% | Status: Sedia Bermula'
              : 'Phase 1: Planning & Setup (Dec 2025 - Jul 2026) | Duration: 8 months | Progress: 0% | Status: Ready to Begin'
          },
          {
            title: language === 'ms' ? 'Rangka Kerja Pelaksanaan' : 'Implementation Framework',
            content: language === 'ms' 
              ? 'Pelaksanaan strategik 3-fasa telah ditetapkan: Fasa 1 (Perancangan & Persediaan), Fasa 2 (Pelaksanaan & Pemantauan), Fasa 3 (Penilaian & Pengoptimuman). Jumlah garis masa: 17 bulan.'
              : '3-phase strategic implementation established: Phase 1 (Planning & Setup), Phase 2 (Implementation & Monitoring), Phase 3 (Evaluation & Optimization). Total timeline: 17 months.'
          }
        ]
      },
      annual: {
        title: language === 'ms' ? 'Gambaran Keseluruhan Pelan Pelaksanaan' : 'Implementation Plan Overview',
        period: language === 'ms' ? 'Pelan Strategik 3-Fasa (Dis 2025 - Apr 2027)' : '3-Phase Strategic Plan (Dec 2025 - Apr 2027)',
        sections: [
          {
            title: language === 'ms' ? 'Rangka Kerja Strategik' : 'Strategic Framework',
            content: user?.role === 'strategic_jcorp'
              ? (language === 'ms' 
                ? 'Pelan pelaksanaan 17 bulan Yayasan JCorp berstruktur dalam 3 fasa berbeza dengan hasil yang jelas, garis masa, dan metrik kejayaan untuk pelaksanaan program yang komprehensif.'
                : 'Yayasan JCorp 17-month implementation plan structured in 3 distinct phases with clear deliverables, timelines, and success metrics for comprehensive program execution.')
              : (language === 'ms' 
                ? 'Pelan pelaksanaan 17 bulan Yayasan Hasanah berstruktur dalam 3 fasa berbeza dengan hasil yang jelas, garis masa, dan metrik kejayaan untuk pelaksanaan program yang komprehensif.'
                : 'Yayasan Hasanah 17-month implementation plan structured in 3 distinct phases with clear deliverables, timelines, and success metrics for comprehensive program execution.')
          },
          {
            title: language === 'ms' ? 'Pembahagian Fasa' : 'Phase Distribution',
            content: language === 'ms' 
              ? 'Fasa 1: Perancangan & Persediaan (8 bulan, Dis 2025 - Jul 2026), Fasa 2: Pelaksanaan & Pemantauan (6 bulan, Ogs 2026 - Jan 2027), Fasa 3: Penilaian & Pengoptimuman (3 bulan, Feb 2027 - Apr 2027).'
              : 'Phase 1: Planning & Setup (8 months, Dec 2025 - Jul 2026), Phase 2: Implementation & Monitoring (6 months, Aug 2026 - Jan 2027), Phase 3: Evaluation & Optimization (3 months, Feb 2027 - Apr 2027).'
          },
          {
            title: language === 'ms' ? 'Sistem Pemantauan' : 'Monitoring System',
            content: language === 'ms' 
              ? 'Sistem papan pemuka komprehensif ditetapkan untuk penjejakan masa nyata kemajuan pelaksanaan, pemantauan KPI, penilaian impak, dan pelaporan strategik merentasi semua fasa.'
              : 'Comprehensive dashboard system established for real-time tracking of implementation progress, KPI monitoring, impact assessment, and strategic reporting across all phases.'
          }
        ]
      },
      impact: {
        title: language === 'ms' ? 'Laporan Penilaian Garis Dasar' : 'Baseline Assessment Report',
        period: language === 'ms' ? 'Status Pra-Pelaksanaan (Disember 2025)' : 'Pre-Implementation Status (December 2025)',
        sections: [
          {
            title: language === 'ms' ? 'Status Semasa' : 'Current Status',
            content: user?.role === 'strategic_jcorp'
              ? (language === 'ms' 
                ? 'Garis dasar Yayasan JCorp ditetapkan dengan 0% kemajuan pelaksanaan. Rangka kerja strategik sedia untuk pelaksanaan Fasa 1. Sistem pemantauan beroperasi dan sedia untuk pengumpulan data.'
                : 'Yayasan JCorp baseline established with 0% implementation progress. Strategic framework ready for Phase 1 execution. Monitoring systems operational and ready for data collection.')
              : (language === 'ms' 
                ? 'Garis dasar Yayasan Hasanah ditetapkan dengan 0% kemajuan pelaksanaan. Rangka kerja strategik sedia untuk pelaksanaan Fasa 1. Sistem pemantauan beroperasi dan sedia untuk pengumpulan data.'
                : 'Yayasan Hasanah baseline established with 0% implementation progress. Strategic framework ready for Phase 1 execution. Monitoring systems operational and ready for data collection.')
          },
          {
            title: language === 'ms' ? 'Penilaian Kesediaan' : 'Readiness Assessment',
            content: language === 'ms' 
              ? 'Infrastruktur sistem: Beroperasi, Rangka kerja papan pemuka: Ditetapkan, Struktur pelaporan: Sedia, Penjajaran pihak berkepentingan: Menunggu aktiviti Fasa 1.'
              : 'System infrastructure: Operational, Dashboard framework: Established, Reporting structure: Ready, Stakeholder alignment: Pending Phase 1 activities.'
          },
          {
            title: language === 'ms' ? 'Rangka Kerja Metrik Kejayaan' : 'Success Metrics Framework',
            content: language === 'ms' 
              ? 'Sistem penjejakan KPI ditetapkan, Rangka kerja pengukuran impak disediakan, Alat pemantauan kemajuan beroperasi, Keupayaan pelaporan strategik sedia untuk fasa pelaksanaan.'
              : 'KPI tracking system established, Impact measurement framework prepared, Progress monitoring tools operational, Strategic reporting capabilities ready for implementation phases.'
          }
        ]
      }
    };

    return baseData;
  };

  const reportData = getReportData();
  const currentReport = reportData[selectedReport as keyof typeof reportData];

  const generateReport = () => {
    const orgName = user?.role === 'strategic_jcorp' 
      ? (language === 'ms' ? 'Yayasan JCorp' : 'JCorp Foundation')
      : (language === 'ms' ? 'Yayasan Hasanah' : 'Hasanah Foundation');
    
    const reportContent = `
${currentReport.title}
${currentReport.period}
${orgName}

${currentReport.sections.map(section => `
${section.title}
${section.content}
`).join('\n')}

${language === 'ms' ? 'Dijana pada:' : 'Generated on:'} ${new Date().toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReport.title.replace(/\s+/g, '_')}_${user?.role === 'strategic_jcorp' ? 'JCorp' : 'Hasanah'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('strategicReports')}</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'strategic_jcorp' 
              ? (language === 'ms' ? 'Yayasan JCorp' : 'JCorp Foundation')
              : (language === 'ms' ? 'Yayasan Hasanah' : 'Hasanah Foundation')
            } - {language === 'ms' ? 'Laporan Prestasi Komprehensif' : 'Comprehensive Performance Reports'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {shouldShowLanguageToggle(user.role) && (
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          )}
          <button
            onClick={generateReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            📄 {t('downloadReport')}
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            📊 {language === 'ms' ? 'Pemilihan Laporan' : 'Report Selection'}
          </CardTitle>
          <div className="flex space-x-4 mt-4">
            {Object.entries(reportData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedReport(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedReport === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {data.title}
              </button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Report Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            {currentReport.title}
          </CardTitle>
          <p className="text-gray-600">{currentReport.period}</p>
          <p className="text-sm text-gray-500">
            {user?.role === 'strategic_jcorp' 
              ? (language === 'ms' ? 'Yayasan JCorp' : 'JCorp Foundation')
              : (language === 'ms' ? 'Yayasan Hasanah' : 'Hasanah Foundation')
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentReport.sections.map((section, index) => (
              <div key={index} className="border-l-4 border-l-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            📈 {language === 'ms' ? 'Ringkasan Metrik Utama' : 'Key Metrics Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {language === 'ms' ? 'Fasa 1' : 'Phase 1'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'ms' ? 'Fasa Semasa' : 'Current Phase'}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0%</div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'ms' ? 'Kemajuan Pelaksanaan' : 'Implementation Progress'}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">17</div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'ms' ? 'Jumlah Bulan' : 'Total Months'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'ms' ? 'Fasa Pelaksanaan' : 'Implementation Phases'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            📁 {language === 'ms' ? 'Arkib Laporan' : 'Report Archive'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  {language === 'ms' ? 'Laporan Perancangan Fasa 1' : 'Phase 1 Planning Report'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'ms' ? 'Dijana: 30 Disember 2025' : 'Generated: December 30, 2025'}
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                {language === 'ms' ? 'Muat Turun' : 'Download'}
              </button>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <div className="font-medium text-gray-500">
                  {language === 'ms' ? 'Laporan Pelaksanaan Fasa 2' : 'Phase 2 Implementation Report'}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'ms' ? 'Dijangka: Ogos 2026' : 'Expected: August 2026'}
                </div>
              </div>
              <button className="text-gray-400 text-sm font-medium" disabled>
                {language === 'ms' ? 'Menunggu' : 'Pending'}
              </button>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <div className="font-medium text-gray-500">
                  {language === 'ms' ? 'Laporan Penilaian Fasa 3' : 'Phase 3 Evaluation Report'}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'ms' ? 'Dijangka: April 2027' : 'Expected: April 2027'}
                </div>
              </div>
              <button className="text-gray-400 text-sm font-medium" disabled>
                {language === 'ms' ? 'Menunggu' : 'Pending'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            💡 {language === 'ms' ? 'Wawasan Utama & Cadangan' : 'Key Insights & Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-3">
                ✅ {language === 'ms' ? 'Kesediaan Pelaksanaan' : 'Implementation Readiness'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• {language === 'ms' ? 'Rangka kerja strategik ditetapkan dan beroperasi' : 'Strategic framework established and operational'}</li>
                <li>• {language === 'ms' ? 'Sistem pemantauan papan pemuka dikonfigurasikan' : 'Dashboard monitoring system configured'}</li>
                <li>• {language === 'ms' ? 'Pelan pelaksanaan 3-fasa berstruktur' : '3-phase implementation plan structured'}</li>
                <li>• {language === 'ms' ? 'Keupayaan pelaporan dan penjejakan sedia' : 'Reporting and tracking capabilities ready'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-700 mb-3">
                🎯 {language === 'ms' ? 'Keutamaan Fasa 1' : 'Phase 1 Priorities'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• {language === 'ms' ? 'Penjajaran dan penglibatan pihak berkepentingan' : 'Stakeholder alignment and engagement'}</li>
                <li>• {language === 'ms' ? 'Peruntukan bajet dan perancangan sumber' : 'Budget allocation and resource planning'}</li>
                <li>• {language === 'ms' ? 'Peta jalan pelaksanaan terperinci' : 'Detailed implementation roadmap'}</li>
                <li>• {language === 'ms' ? 'Metrik kejayaan dan finalisasi rangka kerja KPI' : 'Success metrics and KPI framework finalization'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}