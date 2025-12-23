'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavigationBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Different navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { href: '/dashboard', label: 'Dashboard' },
    ];

    if (user.role === 'school') {
      return [
        ...baseItems,
        { href: '/dashboard/students', label: 'Senarai Nama Murid' },
        { href: '/dashboard/school/progress', label: 'Analisis Perkembangan Murid' },
        { href: '/dashboard/school/tuition-report', label: 'Laporan' },
      ];
    }

    if (user.role === 'yayasan_jcorp') {
      return [
        ...baseItems,
        { href: '/dashboard/students', label: 'Murid' },
        { href: '/dashboard/teachers', label: 'Guru' },
        { href: '/dashboard/programs', label: 'Program' },
        { href: '/dashboard/calendar', label: 'Kalendar' },
        { href: '/dashboard/tuition-analysis', label: 'Analisis Tuisyen' },
        { href: '/dashboard/budget', label: 'Kewangan' },
        { href: '/dashboard/reports', label: 'Laporan' },
        { href: '/dashboard/yayasan-overview', label: 'Gambaran Keseluruhan' },
      ];
    }

    // For other roles (ppd, sektor_pembelajaran, sektor_perancangan)
    const otherRoleItems = [
      ...baseItems,
      { href: '/dashboard/students', label: 'Murid' },
      { href: '/dashboard/teachers', label: 'Guru' },
      { href: '/dashboard/programs', label: 'Program' },
      { href: '/dashboard/calendar', label: 'Kalendar' },
      { href: '/dashboard/tuition-analysis', label: 'Analisis Tuisyen' },
      { href: '/dashboard/budget', label: 'Kewangan' },
      { href: '/dashboard/reports', label: 'Laporan' },
    ];

    // Add maintenance control for coordinators
    if (user.role === 'sektor_perancangan') {
      otherRoleItems.push({ href: '/dashboard/maintenance-control', label: 'Kawalan Penyelenggaraan' });
    }

    return otherRoleItems;
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
