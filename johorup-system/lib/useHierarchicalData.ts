import { useState, useEffect } from 'react';

interface User {
  name: string;
  role: string;
  ppd_name?: string;
  school_name?: string;
  subject?: string;
}

interface HierarchicalData {
  students?: any[];
  teachers?: any[];
  schools?: any[];
  ppd?: any[];
  dashboard_stats?: any;
}

interface UseHierarchicalDataResult {
  data: HierarchicalData | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHierarchicalData(dataType: string): UseHierarchicalDataResult {
  const [data, setData] = useState<HierarchicalData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user from session
      const userSession = sessionStorage.getItem('currentUser');
      if (!userSession) {
        throw new Error('User not logged in');
      }

      const currentUser = JSON.parse(userSession);
      
      const response = await fetch('/api/get-user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser.email,
          userRole: currentUser.role,
          dataType
        })
      });

      // Get the raw response text first
      const responseText = await response.text();
      console.log('API Response Status:', response.status);
      console.log('API Response Text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`JSON Parse Error: ${parseError.message}. Raw response: ${responseText.substring(0, 200)}...`);
      }
      
      if (result.status === 'success') {
        setData({ [dataType]: result.data });
        setUser(result.user_info);
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataType]);

  return {
    data,
    user,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for dashboard statistics
export function useDashboardStats() {
  return useHierarchicalData('dashboard_stats');
}

// Hook for students data
export function useStudentsData() {
  return useHierarchicalData('students');
}

// Hook for teachers data
export function useTeachersData() {
  return useHierarchicalData('teachers');
}

// Hook for schools data
export function useSchoolsData() {
  return useHierarchicalData('schools');
}

// Hook for PPD data
export function usePPDData() {
  return useHierarchicalData('ppd');
}

// Utility function to check user permissions
export function getUserPermissions(userRole: string) {
  return {
    canViewAll: ['super_admin_s4pd', 'admin_spb', 'admin_spm'].includes(userRole),
    canEditStudents: ['super_admin_s4pd', 'admin_spb', 'admin_spm', 'tactical_ppd', 'coaching_sisc', 'operational_school', 'operational_teacher'].includes(userRole),
    canManageUsers: ['super_admin_s4pd', 'admin_spb', 'admin_spm'].includes(userRole),
    scope: userRole.includes('super_admin') ? 'all' : 
           userRole.includes('tactical_ppd') ? 'ppd' :
           userRole.includes('coaching_sisc') ? 'ppd_subject' :
           userRole.includes('operational_school') ? 'school' :
           userRole.includes('operational_teacher') ? 'school' : 'summary'
  };
}

// Utility function to get role display name
export function getRoleDisplayName(role: string): string {
  const names: { [key: string]: string } = {
    'super_admin_s4pd': 'Super Admin S4PD',
    'admin_spb': 'Admin SPB',
    'admin_spm': 'Admin SPM',
    'strategic_jcorp': 'Strategic JCorp',
    'strategic_hasanah': 'Strategic Hasanah',
    'tactical_ppd': 'Tactical PPD',
    'coaching_sisc': 'SISC+',
    'operational_school': 'Sekolah',
    'operational_teacher': 'Guru'
  };
  return names[role] || role;
}

// Utility function to get scope description
export function getScopeDescription(userRole: string, user: User | null): string {
  if (!user) return '';
  
  switch (userRole) {
    case 'super_admin_s4pd':
    case 'admin_spb':
    case 'admin_spm':
      return 'Seluruh sistem';
    case 'tactical_ppd':
    case 'coaching_sisc':
      return user.ppd_name ? `PPD ${user.ppd_name}` : 'PPD';
    case 'operational_school':
    case 'operational_teacher':
      return user.school_name ? `${user.school_name}` : 'Sekolah';
    case 'strategic_jcorp':
      return 'JCorp Strategic View';
    case 'strategic_hasanah':
      return 'Hasanah Strategic View';
    default:
      return 'Terhad';
  }
}