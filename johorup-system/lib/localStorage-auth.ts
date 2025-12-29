// Simple localStorage-based authentication utilities

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  school_id?: number | null;
  ppd_id?: number | null;
}

// Demo users for the system
export const demoUsers: User[] = [
  { id: 1, email: 'admin@jpnj.gov.my', name: 'Admin JPNJ', role: 'sektor_perancangan', school_id: null, ppd_id: null },
  { id: 2, email: 'koordinator@jpnj.gov.my', name: 'Koordinator', role: 'sektor_perancangan', school_id: null, ppd_id: null },
  { id: 3, email: 'ppd.jb@moe.gov.my', name: 'PPD Johor Bahru', role: 'ppd', school_id: null, ppd_id: 1 },
  { id: 4, email: 'sekolah@moe-dl.edu.my', name: 'Sekolah Demo', role: 'school', school_id: 1, ppd_id: null },
  { id: 5, email: 'yayasan@jcorp.com.my', name: 'Yayasan JCorp', role: 'yayasan_jcorp', school_id: null, ppd_id: null }
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
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
}

// Logout user
export function logoutUser(): void {
  localStorage.removeItem('user');
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