// Simple localStorage-based authentication utilities (telah dibersihkan)

import { AuditService } from './auditService';
import { User } from './types';

// Demo users untuk sistem (struktur pengguna sebenar)
export const demoUsers: User[] = [
  // Super Admin (S4PD) - 3 users
  { 
    id: 1, 
    email: 's4pd.admin1@jpnj.gov.my', 
    name: 'Dato\' Ahmad bin Abdullah', 
    role: 'super_admin_s4pd',
    level: 'Super Admin',
    sector: 'S4PD'
  },
  { 
    id: 2, 
    email: 'spb.admin1@jpnj.gov.my', 
    name: 'Dr. Faridah binti Ismail', 
    role: 'admin_spb',
    level: 'Admin',
    sector: 'SPB'
  },
  { 
    id: 3, 
    email: 'spm.admin1@jpnj.gov.my', 
    name: 'Puan Aminah binti Yusof', 
    role: 'admin_spm',
    level: 'Admin',
    sector: 'SPM'
  },
  { 
    id: 4, 
    email: 'jcorp.viewer1@jcorp.com.my', 
    name: 'Tan Sri Mohd Bakke bin Salleh', 
    role: 'strategic_jcorp',
    level: 'Strategic Viewers',
    sector: 'JCORP'
  },
  { 
    id: 5, 
    email: 'hasanah.viewer1@yayasanhasanah.org', 
    name: 'Dato\' Shahril Ridza bin Ridzuan', 
    role: 'strategic_hasanah',
    level: 'Strategic Viewers',
    sector: 'HASANAH'
  },
  { 
    id: 6, 
    email: 'ppd.jb1@moe.gov.my', 
    name: 'Encik Azman bin Othman', 
    role: 'tactical_ppd',
    level: 'Tactical User',
    sector: 'PPD',
    ppd_id: 1
  },
  { 
    id: 7, 
    email: 'sisc.bahasamelayu@moe.gov.my', 
    name: 'Dr. Siti Hajar binti Rahman', 
    role: 'coaching_sisc',
    level: 'Coaching User',
    sector: 'SISC'
  },
  { 
    id: 8, 
    email: 'sisc.sejarah@moe.gov.my', 
    name: 'Encik Mohd Faiz bin Abdullah', 
    role: 'coaching_sisc',
    level: 'Coaching User',
    sector: 'SISC'
  },
  { 
    id: 9, 
    email: 'sisc.matematik@moe.gov.my', 
    name: 'Puan Noor Azlina binti Yusof', 
    role: 'coaching_sisc',
    level: 'Coaching User',
    sector: 'SISC'
  },
  { 
    id: 10, 
    email: 'smk.tmnjj@moe.gov.my', 
    name: 'Encik Halim bin Yaacob', 
    role: 'operational_school',
    level: 'Operational User',
    sector: 'SCHOOL',
    school_id: 1,
    ppd_id: 1
  },
  { 
    id: 11, 
    email: 'guru.ahmad@moe.gov.my', 
    name: 'Cikgu Ahmad bin Mahmud', 
    role: 'operational_teacher',
    level: 'Operational User',
    sector: 'TEACHER',
    school_id: 1,
    ppd_id: 1
  },
];

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
}

// Login user with email and password
export function loginUser(email: string, password: string): User | null {
  const user = demoUsers.find(u => u.email === email);
  
  if (user && password === 'AdminPass123!') {
    // Set session start time for audit
    localStorage.setItem('sessionStart', Date.now().toString());
    localStorage.setItem('user', JSON.stringify(user));
    
    // Log successful login
    AuditService.logLogin(email, true, undefined, user);
    
    return user;
  } else {
    // Log failed login
    const failureReason = user ? 'Invalid password' : 'User not found';
    AuditService.logLogin(email, false, failureReason);
    
    return null;
  }
}

// Logout user
export function logoutUser(): void {
  const user = getCurrentUser();
  
  if (user) {
    // Log logout before clearing data
    AuditService.logLogout(user);
  }
  
  localStorage.removeItem('user');
  localStorage.removeItem('sessionStart');
  localStorage.removeItem('sessionId');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Check if user has specific role
export function hasRole(allowedRoles: string[]): boolean {
  const user = getCurrentUser();
  return user ? allowedRoles.includes(user.role) : false;
}

// Redirect to login if not authenticated
export function requireAuth(): User | null {
  const user = getCurrentUser();
  if (!user && typeof window !== 'undefined') {
    window.location.href = '/login';
    return null;
  }
  return user;
}
