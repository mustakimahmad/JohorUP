'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MobileNavProps {
  currentPath: string;
}

export default function MobileNav({ currentPath }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
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

    // For other roles (ppd, sektor_pembelajaran, etc)
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

    // Add maintenance control for admin
    if (user.role === 'admin') {
      otherRoleItems.push({ href: '/dashboard/maintenance-control', label: 'Kawalan Penyelenggaraan' });
    }

    return otherRoleItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden z-50">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 text-sm font-medium border-l-4 ${
                  currentPath === item.href
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-4 text-sm font-medium border-b-2 ${
              currentPath === item.href
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
