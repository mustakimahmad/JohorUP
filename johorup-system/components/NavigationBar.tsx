'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavigationBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Different navigation items based on user role and level
  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { href: '/dashboard', label: 'Dashboard' },
    ];

    // Super Admin (S4PD) - Full system access
    if (user.role === 'super_admin_s4pd') {
      return [
        ...baseItems,
        { href: '/dashboard/super-admin', label: '👑 Super Admin' },
        { href: '/dashboard/admin/user-management', label: 'User Management' },
        { href: '/dashboard/admin/audit-trail', label: '🔍 Audit Trail' },
        { href: '/dashboard/students', label: 'Murid' },
        { href: '/dashboard/teachers', label: 'Guru' },
        { href: '/dashboard/programs', label: 'Program' },
        { href: '/dashboard/calendar', label: 'Kalendar' },
        { href: '/dashboard/tuition-analysis', label: 'Analisis Tuisyen' },
        { href: '/dashboard/budget', label: 'Kewangan' },
        { href: '/dashboard/reports', label: 'Laporan' },
        { href: '/dashboard/maintenance-control', label: 'Kawalan Penyelenggaraan' },
      ];
    }

    // Admin SPB - Learning focused with student monitoring
    if (user.role === 'admin_spb') {
      return [
        ...baseItems,
        { href: '/dashboard/students', label: '👥 Senarai Murid' },
        { href: '/dashboard/teachers', label: 'Guru' },
        { href: '/dashboard/programs', label: 'Program' },
        { href: '/dashboard/calendar', label: '📅 Kalendar Program' },
        { href: '/dashboard/student-progress', label: '📈 Perkembangan Murid' },
        { href: '/dashboard/exam-analysis-2026', label: '📊 Analisis Peperiksaan 2026' },
        { href: '/dashboard/tuition-analysis', label: 'Analisis Tuisyen' },
      ];
    }

    // Admin SPM - Student development focused with exam monitoring
    if (user.role === 'admin_spm') {
      return [
        ...baseItems,
        { href: '/dashboard/students', label: '👥 Senarai Murid' },
        { href: '/dashboard/programs', label: 'Program' },
        { href: '/dashboard/calendar', label: '📅 Kalendar Program' },
        { href: '/dashboard/student-progress', label: '📈 Perkembangan Murid' },
        { href: '/dashboard/exam-analysis-2026', label: '📊 Analisis Peperiksaan 2026' },
        { href: '/dashboard/character-building', label: 'Pembinaan Sahsiah' },
      ];
    }

    // Strategic Viewers (Yayasan) - View only strategic data
    if (user.role === 'strategic_jcorp' || user.role === 'strategic_hasanah') {
      return [
        ...baseItems,
        { href: '/dashboard/strategic', label: '📊 Strategic Overview' },
        { href: '/dashboard/impact', label: 'Impact Analysis' },
        { href: '/dashboard/reports/strategic', label: 'Strategic Reports' },
        { href: '/dashboard/kpi', label: 'KPI Dashboard' },
      ];
    }

    // Tactical PPD - District level operations
    if (user.role === 'tactical_ppd') {
      return [
        ...baseItems,
        { href: '/dashboard/district', label: '🏛️ Pengurusan Daerah' },
        { href: '/dashboard/schools', label: 'Sekolah' },
        { href: '/dashboard/teachers', label: 'Guru' },
        { href: '/dashboard/programs', label: 'Program' },
        { href: '/dashboard/reports/district', label: 'Laporan Daerah' },
      ];
    }

    // Coaching SISC+ - Teacher guidance and monitoring (District-focused)
    if (user.role === 'coaching_sisc') {
      return [
        ...baseItems,
        { href: '/dashboard/teacher-monitoring', label: 'Pencerapan Guru' },
        { href: '/dashboard/students', label: 'Senarai Murid' },
        { href: '/dashboard/student-progress', label: 'Analisis Perkembangan Murid' },
        { href: '/dashboard/tuition-reports', label: 'Laporan Tuisyen' },
      ];
    }

    // Operational School - School level operations
    if (user.role === 'operational_school') {
      return [
        ...baseItems,
        { href: '/dashboard/school', label: '🏫 Pengurusan Sekolah' },
        { href: '/dashboard/students', label: 'Murid' },
        { href: '/dashboard/teachers', label: 'Guru' },
        { href: '/dashboard/school/progress', label: 'Analisis Perkembangan Murid' },
        { href: '/dashboard/school/tuition-report', label: 'Laporan' },
      ];
    }

    // Operational Teacher - Classroom level operations (Streamlined)
    if (user.role === 'operational_teacher') {
      return [
        ...baseItems,
        { href: '/dashboard/students', label: 'Murid Saya' },
        { href: '/dashboard/attendance', label: 'Kehadiran' },
        { href: '/dashboard/tuition-report', label: 'Laporan Tuisyen' },
      ];
    }

    // Default fallback
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                pathname === item.href
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
