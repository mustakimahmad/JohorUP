'use client';

import Logo from './Logo';
import MobileNav from './MobileNav';
import { usePathname } from 'next/navigation';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  user?: any;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export default function DashboardHeader({ 
  title, 
  subtitle, 
  user, 
  onLogout, 
  children 
}: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Logo size="sm" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-600 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {children && (
              <div className="hidden sm:flex gap-2">
                {children}
              </div>
            )}
            
            {user && (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    {user.email.includes('sekolah') ? 'Sekolah' :
                     user.email.includes('ppd') ? 'PPD' :
                     user.email.includes('pembelajaran') ? 'Sektor Pembelajaran' :
                     user.email.includes('perancangan') ? 'Sektor Perancangan' :
                     'Admin'}
                  </p>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-2 sm:px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                  >
                    Log Keluar
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <MobileNav currentPath={pathname} />
        </div>
      </div>
    </header>
  );
}