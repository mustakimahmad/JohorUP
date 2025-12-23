'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MaintenanceCheckProps {
  userRole?: string;
  children: React.ReactNode;
}

export default function MaintenanceCheck({ userRole, children }: MaintenanceCheckProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if maintenance mode is active
    const isMaintenanceMode = localStorage.getItem('maintenanceMode') === 'true';
    
    if (isMaintenanceMode) {
      // Allow coordinators and yayasan_jcorp to access system during maintenance
      const allowedRoles = ['sektor_perancangan', 'yayasan_jcorp'];
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect to maintenance page for other users
        router.push('/maintenance');
        return;
      }
    }
  }, [userRole, router]);

  return <>{children}</>;
}

// Hook to check if user can perform updates
export function useMaintenanceMode() {
  const isMaintenanceMode = typeof window !== 'undefined' 
    ? localStorage.getItem('maintenanceMode') === 'true' 
    : false;
    
  const canUpdate = (userRole?: string) => {
    if (!isMaintenanceMode) return true;
    
    // Only coordinators can update during maintenance
    return userRole === 'sektor_perancangan';
  };

  const isReadOnlyMode = (userRole?: string) => {
    if (!isMaintenanceMode) return false;
    
    // School users are in read-only mode during maintenance
    return userRole === 'school';
  };

  return {
    isMaintenanceMode,
    canUpdate,
    isReadOnlyMode
  };
}