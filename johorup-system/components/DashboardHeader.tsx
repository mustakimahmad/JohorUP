import Logo from './Logo';

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
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {children}
            
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    {user.email.includes('sekolah') ? 'Sekolah' :
                     user.email.includes('ppd') ? 'PPD' :
                     user.email.includes('pembelajaran') ? 'Sektor Pembelajaran' :
                     user.email.includes('perancangan') ? 'Sektor Perancangan' :
                     'Koordinator'}
                  </p>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Log Keluar
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}