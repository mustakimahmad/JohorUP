// Mock data untuk prototype (telah dibersihkan)

import { User, School, Student, StudentGrade, Program, Budget, DashboardStats, PPD, Teacher, TeacherKPI, ProgramReport, StudentAttendance, ProgramPhoto } from './types';

export const mockPPDs: PPD[] = [
  { id: 1, name: 'PPD Johor Bahru', code: 'JB' },
  { id: 2, name: 'PPD Muar', code: 'MR' },
  { id: 3, name: 'PPD Batu Pahat', code: 'BP' },
];

export const mockSchools: School[] = [];

export const mockStudents: Student[] = [];

export const mockSubjects = [
  { id: 1, name: 'Bahasa Melayu', code: 'BM' },
  { id: 2, name: 'Sejarah', code: 'SEJ' },
  { id: 3, name: 'Matematik', code: 'MAT' },
];

export const mockGrades: StudentGrade[] = [];

export const mockPrograms: Program[] = [];

export const mockBudget: Budget[] = [];

export const mockDashboardStats: DashboardStats = {
  total_students: 0,
  total_schools: 0,
  total_budget: 0,
  spent_budget: 0,
  programs_count: 0,
  passing_rate: {
    bahasa_melayu: 0,
    sejarah: 0,
    matematik: 0,
  },
};

export const mockUsers: User[] = [
  // Super Admin (S4PD) - 3 users
  { 
    id: 1, 
    email: 's4pd.admin1@jpnj.gov.my', 
    name: 'Dato\' Ahmad bin Abdullah', 
    role: 'super_admin_s4pd',
    level: 'Super Admin',
    sector: 'S4PD',
    permissions: ['all'],
    is_active: true
  },
  { 
    id: 2, 
    email: 's4pd.admin2@jpnj.gov.my', 
    name: 'Datin Siti Nurhaliza', 
    role: 'super_admin_s4pd',
    level: 'Super Admin',
    sector: 'S4PD',
    permissions: ['all'],
    is_active: true
  },
  { 
    id: 3, 
    email: 's4pd.admin3@jpnj.gov.my', 
    name: 'Encik Mohd Razak bin Hassan', 
    role: 'super_admin_s4pd',
    level: 'Super Admin',
    sector: 'S4PD',
    permissions: ['all'],
    is_active: true
  },

  // Admin SPB - 5 users
  { 
    id: 4, 
    email: 'spb.admin1@jpnj.gov.my', 
    name: 'Dr. Faridah binti Ismail', 
    role: 'admin_spb',
    level: 'Admin',
    sector: 'SPB',
    permissions: ['learning_management', 'student_monitoring', 'teacher_tracking', 'program_calendar', 'student_progress', 'exam_analysis_2026', 'tuition_analysis'],
    is_active: true
  },
  { 
    id: 5, 
    email: 'spb.admin2@jpnj.gov.my', 
    name: 'Prof. Madya Dr. Rahman bin Ali', 
    role: 'admin_spb',
    level: 'Admin',
    sector: 'SPB',
    permissions: ['learning_management', 'student_monitoring', 'teacher_tracking', 'program_calendar', 'student_progress', 'exam_analysis_2026', 'tuition_analysis'],
    is_active: true
  },

  // Admin SPM - 3 users  
  { 
    id: 6, 
    email: 'spm.admin1@jpnj.gov.my', 
    name: 'Puan Aminah binti Yusof', 
    role: 'admin_spm',
    level: 'Admin',
    sector: 'SPM',
    permissions: ['student_development', 'student_monitoring', 'program_calendar', 'student_progress', 'exam_analysis_2026', 'welfare_monitoring', 'character_building'],
    is_active: true
  },

  // Strategic Viewers - Yayasan JCorp (3 users)
  { 
    id: 7, 
    email: 'strategic.viewer1@jcorp.com.my', 
    name: 'Tan Sri Mohd Bakke bin Salleh', 
    role: 'strategic_jcorp',
    level: 'Strategic Viewers',
    sector: 'JCORP',
    yayasan: 'Yayasan JCorp',
    permissions: ['strategic_view', 'reports_view'],
    is_active: true
  },

  // Strategic Viewers - Yayasan Hasanah (2 users)
  { 
    id: 8, 
    email: 'strategic.viewer1@yayasanhasanah.org', 
    name: 'Dato\' Shahril Ridza bin Ridzuan', 
    role: 'strategic_hasanah',
    level: 'Strategic Viewers',
    sector: 'HASANAH',
    yayasan: 'Yayasan Hasanah',
    permissions: ['strategic_view', 'impact_reports'],
    is_active: true
  },

  // Tactical User - PPD (sample of 11)
  { 
    id: 9, 
    email: 'ppd.jb1@moe.gov.my', 
    name: 'Encik Azman bin Othman', 
    role: 'tactical_ppd',
    level: 'Tactical User',
    sector: 'PPD',
    ppd_id: 1,
    permissions: ['district_management', 'school_monitoring'],
    is_active: true
  },
  { 
    id: 10, 
    email: 'ppd.muar1@moe.gov.my', 
    name: 'Puan Rokiah binti Ahmad', 
    role: 'tactical_ppd',
    level: 'Tactical User',
    sector: 'PPD',
    ppd_id: 2,
    permissions: ['district_management', 'school_monitoring'],
    is_active: true
  },

  // Operational User - Sekolah (sample of 22)
  { 
    id: 11, 
    email: 'smk.tmnjj@moe.gov.my', 
    name: 'Encik Halim bin Yaacob', 
    role: 'operational_school',
    level: 'Operational User',
    sector: 'SCHOOL',
    school_id: 1,
    ppd_id: 1,
    permissions: ['school_data_entry', 'student_management'],
    is_active: true
  },
  { 
    id: 12, 
    email: 'smk.bandarraya@moe.gov.my', 
    name: 'Puan Zainab binti Ibrahim', 
    role: 'operational_school',
    level: 'Operational User',
    sector: 'SCHOOL',
    school_id: 2,
    ppd_id: 1,
    permissions: ['school_data_entry', 'student_management'],
    is_active: true
  },

  // Operational User - Guru (sample of 132)
  { 
    id: 13, 
    email: 'guru.ahmad@moe.gov.my', 
    name: 'Cikgu Ahmad bin Mahmud', 
    role: 'operational_teacher',
    level: 'Operational User',
    sector: 'TEACHER',
    school_id: 1,
    ppd_id: 1,
    permissions: ['class_management', 'student_tracking'],
    is_active: true
  },
  { 
    id: 14, 
    email: 'guru.siti@moe.gov.my', 
    name: 'Cikgu Siti Hajar binti Mohd', 
    role: 'operational_teacher',
    level: 'Operational User',
    sector: 'TEACHER',
    school_id: 1,
    ppd_id: 1,
    permissions: ['class_management', 'student_tracking'],
    is_active: true
  },
];

export const mockTeachers: Teacher[] = [];

export const mockTeacherKPIs: TeacherKPI[] = [];

export const mockProgramReports: ProgramReport[] = [];

export const mockStudentAttendance: StudentAttendance[] = [];

export const mockProgramPhotos: ProgramPhoto[] = [];
