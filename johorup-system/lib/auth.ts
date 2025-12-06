// Simple authentication helper (untuk prototype)
// Dalam production, guna proper authentication library

import { User } from './types';
import { mockUsers } from './mockData';

export function authenticateUser(email: string, password: string): User | null {
  // Mock authentication - dalam production guna bcrypt untuk password
  const user = mockUsers.find(u => u.email === email);
  
  if (user && password === 'demo123') {
    return user;
  }
  
  return null;
}

export function getUserRole(user: User) {
  return user.role;
}

export function canAccessSchoolData(user: User, schoolId: number): boolean {
  if (user.role === 'sektor_perancangan') return true;
  if (user.role === 'sektor_pembelajaran') return true;
  if (user.role === 'school' && user.school_id === schoolId) return true;
  // PPD can access schools in their district
  if (user.role === 'ppd') return true;
  
  return false;
}
