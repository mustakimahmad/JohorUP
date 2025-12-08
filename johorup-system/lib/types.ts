// TypeScript types untuk sistem JohorUP

export type UserRole = 'school' | 'ppd' | 'sektor_pembelajaran' | 'sektor_perancangan';

export type ExamType = 'akhir_tingkatan_4' | 'pertengahan_tahun' | 'percubaan' | 'spm';

export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E' | 'G' | 'TH';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  school_id?: number;
  ppd_id?: number;
}

export interface School {
  id: number;
  name: string;
  code: string;
  ppd_id: number;
  target_students: number;
  ppd?: PPD;
}

export interface PPD {
  id: number;
  name: string;
  code: string;
}

export interface Student {
  id: number;
  name: string;
  ic_number: string;
  school_id: number;
  class: string;
  school?: School;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface StudentGrade {
  id: number;
  student_id: number;
  subject_id: number;
  exam_type: ExamType;
  grade: Grade;
  year: number;
  student?: Student;
  subject?: Subject;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  program_type: string;
  target_subject_id: number;
  start_date: string;
  end_date: string;
  created_by: number;
  target_students?: number; // Bilangan murid disasarkan (optional, diisi oleh Sektor Pembelajaran)
  subject?: Subject;
}

export interface Budget {
  id: number;
  program_id: number;
  amount: number;
  description: string;
  status: 'planned' | 'approved' | 'spent' | 'pending_approval';
  program?: Program;
  approved_by?: number;
  approved_date?: string;
}

export interface Grant {
  id: number;
  program_id: number;
  amount: number;
  disbursed_by: number;
  disbursed_date: string;
  status: 'pending' | 'disbursed';
}

export interface DashboardStats {
  total_students: number;
  total_schools: number;
  total_budget: number;
  spent_budget: number;
  programs_count: number;
  passing_rate: {
    bahasa_melayu: number;
    sejarah: number;
    matematik: number;
  };
}
