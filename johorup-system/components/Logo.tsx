interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Johor State emblem inspired */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg`}>
        <div className="text-white font-bold text-sm">
          {size === 'sm' ? 'J' : size === 'md' ? 'JU' : 'JUP'}
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold text-gray-800 leading-tight`}>
            JohorUP
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-gray-600 leading-tight">
              Program SPM 2026
            </p>
          )}
        </div>
      )}
    </div>
  );
}