// Language Utilities for Bilingual Support (Malay/English)

import React, { useState } from 'react';

export type Language = 'ms' | 'en';

export interface LanguageContent {
  ms: string;
  en: string;
}

// Language Context for Strategic Users (Yayasan)
export const translations = {
  // Navigation and Common Terms
  dashboard: { ms: 'Papan Pemuka', en: 'Dashboard' },
  strategicOverview: { ms: 'Gambaran Strategik', en: 'Strategic Overview' },
  impactAnalysis: { ms: 'Analisis Impak', en: 'Impact Analysis' },
  strategicReports: { ms: 'Laporan Strategik', en: 'Strategic Reports' },
  kpiDashboard: { ms: 'Papan Pemuka KPI', en: 'KPI Dashboard' },
  
  // Headers and Titles
  executiveSummary: { ms: 'Ringkasan Eksekutif', en: 'Executive Summary' },
  performanceMetrics: { ms: 'Metrik Prestasi', en: 'Performance Metrics' },
  phaseImplementation: { ms: 'Pelaksanaan Fasa', en: 'Phase Implementation' },
  strategicObjectives: { ms: 'Objektif Strategik', en: 'Strategic Objectives' },
  
  // Phase Information
  phase1: { ms: 'Fasa 1', en: 'Phase 1' },
  phase2: { ms: 'Fasa 2', en: 'Phase 2' },
  phase3: { ms: 'Fasa 3', en: 'Phase 3' },
  currentPhase: { ms: 'Fasa Semasa', en: 'Current Phase' },
  
  // Status and Progress
  status: { ms: 'Status', en: 'Status' },
  progress: { ms: 'Kemajuan', en: 'Progress' },
  pending: { ms: 'Menunggu', en: 'Pending' },
  inProgress: { ms: 'Dalam Proses', en: 'In Progress' },
  completed: { ms: 'Selesai', en: 'Completed' },
  
  // Metrics and Data
  totalStudents: { ms: 'Jumlah Murid', en: 'Total Students' },
  totalTeachers: { ms: 'Jumlah Guru', en: 'Total Teachers' },
  totalSchools: { ms: 'Jumlah Sekolah', en: 'Total Schools' },
  subjects: { ms: 'Subjek', en: 'Subjects' },
  
  // Academic Performance
  tuitionAttendance: { ms: 'Kehadiran Tuisyen', en: 'Tuition Attendance' },
  careerTalks: { ms: 'Ceramah Kerjaya', en: 'Career Talks' },
  gradeImprovement: { ms: 'Peningkatan Gred', en: 'Grade Improvement' },
  spmImprovement: { ms: 'Peningkatan SPM', en: 'SPM Improvement' },
  postSecondaryEducation: { ms: 'Pendidikan Lepas Menengah', en: 'Post-Secondary Education' },
  
  // Timeline and Dates
  timeline: { ms: 'Garis Masa', en: 'Timeline' },
  startDate: { ms: 'Tarikh Mula', en: 'Start Date' },
  endDate: { ms: 'Tarikh Tamat', en: 'End Date' },
  duration: { ms: 'Tempoh', en: 'Duration' },
  
  // Reports and Documentation
  downloadReport: { ms: 'Muat Turun Laporan', en: 'Download Report' },
  generateReport: { ms: 'Jana Laporan', en: 'Generate Report' },
  exportData: { ms: 'Eksport Data', en: 'Export Data' },
  
  // Organizations
  yayasanJcorp: { ms: 'Yayasan JCorp', en: 'JCorp Foundation' },
  yayasanHasanah: { ms: 'Yayasan Hasanah', en: 'Hasanah Foundation' },
  
  // Academic Subjects
  bahasaMelayu: { ms: 'Bahasa Melayu', en: 'Malay Language' },
  sejarah: { ms: 'Sejarah', en: 'History' },
  matematik: { ms: 'Matematik', en: 'Mathematics' },
  
  // Phase Descriptions
  phase1Description: { 
    ms: 'Fasa Persiapan dan Pelaksanaan Awal (Jan-Apr 2026)', 
    en: 'Preparation and Initial Implementation Phase (Jan-Apr 2026)' 
  },
  phase2Description: { 
    ms: 'Fasa Pelaksanaan Penuh (Mei-Sep 2026)', 
    en: 'Full Implementation Phase (May-Sep 2026)' 
  },
  phase3Description: { 
    ms: 'Fasa Penilaian dan Peningkatan (Okt 2026-Apr 2027)', 
    en: 'Evaluation and Enhancement Phase (Oct 2026-Apr 2027)' 
  },
  
  // KPI Targets
  targetStudents: { ms: 'Sasaran Murid', en: 'Target Students' },
  targetTeachers: { ms: 'Sasaran Guru', en: 'Target Teachers' },
  targetSchools: { ms: 'Sasaran Sekolah', en: 'Target Schools' },
  
  // Impact Areas
  academicImpact: { ms: 'Impak Akademik', en: 'Academic Impact' },
  socialImpact: { ms: 'Impak Sosial', en: 'Social Impact' },
  economicImpact: { ms: 'Impak Ekonomi', en: 'Economic Impact' },
  
  // Common Actions
  view: { ms: 'Lihat', en: 'View' },
  edit: { ms: 'Edit', en: 'Edit' },
  save: { ms: 'Simpan', en: 'Save' },
  cancel: { ms: 'Batal', en: 'Cancel' },
  close: { ms: 'Tutup', en: 'Close' },
  
  // Language Toggle
  switchToEnglish: { ms: 'Switch to English', en: 'Tukar ke Bahasa Melayu' },
  currentLanguage: { ms: 'Bahasa Melayu', en: 'English' },
  
  // Months
  january: { ms: 'Januari', en: 'January' },
  february: { ms: 'Februari', en: 'February' },
  march: { ms: 'Mac', en: 'March' },
  april: { ms: 'April', en: 'April' },
  may: { ms: 'Mei', en: 'May' },
  june: { ms: 'Jun', en: 'June' },
  july: { ms: 'Julai', en: 'July' },
  august: { ms: 'Ogos', en: 'August' },
  september: { ms: 'September', en: 'September' },
  october: { ms: 'Oktober', en: 'October' },
  november: { ms: 'November', en: 'November' },
  december: { ms: 'Disember', en: 'December' }
};

// Language Hook for React Components
export function useLanguage() {
  const getStoredLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('yayasan_language');
      return (stored as Language) || 'ms';
    }
    return 'ms';
  };

  const [language, setLanguageState] = useState<Language>(getStoredLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yayasan_language', lang);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'ms' ? 'en' : 'ms';
    setLanguage(newLang);
  };

  const t = (key: keyof typeof translations): string => {
    return translations[key]?.[language] || key;
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    t
  };
}

// Language Toggle Component
export function LanguageToggle({ 
  language, 
  onToggle 
}: { 
  language: Language; 
  onToggle: () => void; 
}): React.JSX.Element {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      title={language === 'ms' ? 'Switch to English' : 'Tukar ke Bahasa Melayu'}
    >
      <div className="flex items-center gap-1">
        {language === 'ms' ? (
          <>
            <span className="text-sm font-medium text-gray-700">🇲🇾 BM</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-sm text-gray-500">EN</span>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-500">BM</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4-4m0 0l-4 4m4-4v12m0-12V5a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h2" />
            </svg>
            <span className="text-sm font-medium text-gray-700">🇬🇧 EN</span>
          </>
        )}
      </div>
    </button>
  );
}

// Utility function to check if user should have language toggle
export function shouldShowLanguageToggle(userRole: string): boolean {
  return userRole === 'strategic_jcorp' || userRole === 'strategic_hasanah';
}

// Format numbers with proper locale
export function formatNumber(num: number, language: Language): string {
  const locale = language === 'ms' ? 'ms-MY' : 'en-US';
  return new Intl.NumberFormat(locale).format(num);
}

// Format dates with proper locale
export function formatDate(date: string | Date, language: Language): string {
  const locale = language === 'ms' ? 'ms-MY' : 'en-US';
  return new Date(date).toLocaleDateString(locale);
}