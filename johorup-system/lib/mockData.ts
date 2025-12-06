// Mock data untuk prototype (ganti dengan real database nanti)

import { User, School, Student, StudentGrade, Program, Budget, DashboardStats, PPD } from './types';

export const mockPPDs: PPD[] = [
  { id: 1, name: 'PPD Johor Bahru', code: 'JB' },
  { id: 2, name: 'PPD Muar', code: 'MR' },
  { id: 3, name: 'PPD Batu Pahat', code: 'BP' },
];

export const mockSchools: School[] = [
  { id: 1, name: 'SMK Taman Johor Jaya', code: 'JBA001', ppd_id: 1, target_students: 50 },
  { id: 2, name: 'SMK Bandar Baru Uda', code: 'JBA002', ppd_id: 1, target_students: 50 },
  { id: 3, name: 'SMK Tanjung Agas', code: 'MRA001', ppd_id: 2, target_students: 50 },
  { id: 4, name: 'SMK Parit Jawa', code: 'MRA002', ppd_id: 2, target_students: 50 },
];

export const mockStudents: Student[] = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `Murid ${i + 1}`,
  ic_number: `0${(i % 10)}${(i % 12 + 1).toString().padStart(2, '0')}${(i % 28 + 1).toString().padStart(2, '0')}-${(i % 14 + 1).toString().padStart(2, '0')}-${(i % 9000 + 1000)}`,
  school_id: (i % 4) + 1,
  class: `5${String.fromCharCode(65 + (i % 5))}`,
}));

export const mockSubjects = [
  { id: 1, name: 'Bahasa Melayu', code: 'BM' },
  { id: 2, name: 'Sejarah', code: 'SEJ' },
  { id: 3, name: 'Matematik', code: 'MAT' },
];

const grades: ('C' | 'C+' | 'D' | 'E')[] = ['C', 'C+', 'D', 'E'];

export const mockGrades: StudentGrade[] = mockStudents.flatMap(student =>
  mockSubjects.map(subject => ({
    id: student.id * 10 + subject.id,
    student_id: student.id,
    subject_id: subject.id,
    exam_type: 'akhir_tingkatan_4' as const,
    grade: grades[Math.floor(Math.random() * grades.length)],
    year: 2025,
  }))
);

export const mockPrograms: Program[] = [
  {
    id: 1,
    title: 'Program Intensif Bahasa Melayu',
    description: 'Program bimbingan intensif untuk subjek Bahasa Melayu',
    program_type: 'Bimbingan',
    target_subject_id: 1,
    start_date: '2026-01-15',
    end_date: '2026-03-30',
    created_by: 1,
  },
  {
    id: 2,
    title: 'Kem Motivasi Sejarah',
    description: 'Kem motivasi dan pembelajaran Sejarah',
    program_type: 'Kem',
    target_subject_id: 2,
    start_date: '2026-02-10',
    end_date: '2026-02-12',
    created_by: 1,
  },
  {
    id: 3,
    title: 'Kelas Tambahan Matematik',
    description: 'Kelas tambahan hujung minggu untuk Matematik',
    program_type: 'Kelas Tambahan',
    target_subject_id: 3,
    start_date: '2026-01-20',
    end_date: '2026-08-30',
    created_by: 1,
  },
];

export const mockBudget: Budget[] = [
  { id: 1, program_id: 1, amount: 120000, description: 'Bimbingan BM - Gaji tutor, bahan', status: 'approved', approved_by: 4, approved_date: '2026-01-05' },
  { id: 2, program_id: 2, amount: 80000, description: 'Kem Sejarah - Penginapan, makan, aktiviti', status: 'pending_approval' },
  { id: 3, program_id: 3, amount: 150000, description: 'Kelas Matematik - Tutor, bahan, transport', status: 'approved', approved_by: 4, approved_date: '2026-01-05' },
  { id: 4, program_id: 1, amount: 50000, description: 'Tambahan bahan dan transport', status: 'pending_approval' },
];

export const mockDashboardStats: DashboardStats = {
  total_students: 1550,
  total_schools: 22,
  total_budget: 450000,
  spent_budget: 125000,
  programs_count: 12,
  passing_rate: {
    bahasa_melayu: 45.2,
    sejarah: 38.7,
    matematik: 42.1,
  },
};

export const mockUsers: User[] = [
  { id: 1, email: 'sekolah1@moe.gov.my', name: 'Guru Besar SMK TJJ', role: 'school', school_id: 1 },
  { id: 2, email: 'ppd.jb@moe.gov.my', name: 'Pegawai PPD JB', role: 'ppd', ppd_id: 1 },
  { id: 3, email: 'pembelajaran@jpnj.gov.my', name: 'Ketua Sektor Pembelajaran', role: 'sektor_pembelajaran' },
  { id: 4, email: 'perancangan@jpnj.gov.my', name: 'Ketua Sektor Perancangan', role: 'sektor_perancangan' },
  { id: 5, email: 'koordinator@jpnj.gov.my', name: 'Koordinator Program JohorUP', role: 'sektor_perancangan' },
];
