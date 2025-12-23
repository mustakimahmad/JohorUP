// Mock data untuk prototype (ganti dengan real database nanti)

import { User, School, Student, StudentGrade, Program, Budget, DashboardStats, PPD, Teacher, TeacherKPI, ProgramReport, StudentAttendance, ProgramPhoto } from './types';

export const mockPPDs: PPD[] = [
  { id: 1, name: 'PPD Johor Bahru', code: 'JB' },
  { id: 2, name: 'PPD Muar', code: 'MR' },
  { id: 3, name: 'PPD Batu Pahat', code: 'BP' },
];

export const mockSchools: School[] = [
  { id: 1, name: 'SMK Taman Johor Jaya', code: 'JBA001', ppd_id: 1, target_students: 44 },
  { id: 2, name: 'SMK Bandar Baru Uda', code: 'JBA002', ppd_id: 1, target_students: 44 },
  { id: 3, name: 'SMK Tanjung Agas', code: 'MRA001', ppd_id: 2, target_students: 44 },
  { id: 4, name: 'SMK Parit Jawa', code: 'MRA002', ppd_id: 2, target_students: 44 },
  { id: 5, name: 'SMK Dato Bentara Luar', code: 'BPA001', ppd_id: 3, target_students: 44 },
  { id: 6, name: 'SMK Seri Gading', code: 'BPA002', ppd_id: 3, target_students: 44 },
  { id: 7, name: 'SMK Bukit Besar', code: 'JBA003', ppd_id: 1, target_students: 44 },
  { id: 8, name: 'SMK Permas Jaya', code: 'JBA004', ppd_id: 1, target_students: 44 },
  { id: 9, name: 'SMK Bakri', code: 'MRA003', ppd_id: 2, target_students: 44 },
  { id: 10, name: 'SMK Pagoh', code: 'MRA004', ppd_id: 2, target_students: 44 },
  { id: 11, name: 'SMK Yong Peng', code: 'BPA003', ppd_id: 3, target_students: 44 },
  { id: 12, name: 'SMK Ayer Hitam', code: 'BPA004', ppd_id: 3, target_students: 44 },
  { id: 13, name: 'SMK Masai', code: 'JBA005', ppd_id: 1, target_students: 44 },
  { id: 14, name: 'SMK Pasir Gudang', code: 'JBA006', ppd_id: 1, target_students: 44 },
  { id: 15, name: 'SMK Tangkak', code: 'MRA005', ppd_id: 2, target_students: 44 },
  { id: 16, name: 'SMK Segamat', code: 'MRA006', ppd_id: 2, target_students: 44 },
  { id: 17, name: 'SMK Rengit', code: 'BPA005', ppd_id: 3, target_students: 44 },
  { id: 18, name: 'SMK Senggarang', code: 'BPA006', ppd_id: 3, target_students: 44 },
  { id: 19, name: 'SMK Gelang Patah', code: 'JBA007', ppd_id: 1, target_students: 44 },
  { id: 20, name: 'SMK Nusajaya', code: 'JBA008', ppd_id: 1, target_students: 44 },
];

export const mockStudents: Student[] = Array.from({ length: 880 }, (_, i) => ({
  id: i + 1,
  name: `Murid ${i + 1}`,
  ic_number: `0${(i % 10)}${(i % 12 + 1).toString().padStart(2, '0')}${(i % 28 + 1).toString().padStart(2, '0')}-${(i % 14 + 1).toString().padStart(2, '0')}-${(i % 9000 + 1000)}`,
  school_id: (i % 20) + 1,
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
    target_students: 45, // Diisi oleh Sektor Pembelajaran
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
    target_students: 60, // Diisi oleh Sektor Pembelajaran
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
    target_students: 50, // Diisi oleh Sektor Pembelajaran
  },
];

export const mockBudget: Budget[] = [
  { id: 1, program_id: 1, amount: 120000, description: 'Bimbingan BM - Gaji tutor, bahan', status: 'approved', approved_by: 4, approved_date: '2026-01-05' },
  { id: 2, program_id: 2, amount: 80000, description: 'Kem Sejarah - Penginapan, makan, aktiviti', status: 'pending_approval' },
  { id: 3, program_id: 3, amount: 150000, description: 'Kelas Matematik - Tutor, bahan, transport', status: 'approved', approved_by: 4, approved_date: '2026-01-05' },
  { id: 4, program_id: 1, amount: 50000, description: 'Tambahan bahan dan transport', status: 'pending_approval' },
];

export const mockDashboardStats: DashboardStats = {
  total_students: 880,
  total_schools: 20,
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
  { id: 6, email: 'yayasan@jcorp.com.my', name: 'Pegawai Yayasan JCorp', role: 'yayasan_jcorp' },
];

// Mock data untuk 120 guru (6 guru per sekolah x 20 sekolah = 120 guru)
// Setiap sekolah ada 2 guru BM, 2 guru Sejarah, 2 guru Matematik
const teacherNames = [
  'Ahmad bin Abdullah', 'Siti Nurhaliza binti Hassan', 'Muhammad Hafiz bin Ismail', 
  'Nurul Ain binti Yusof', 'Khairul Anuar bin Razak', 'Fatimah binti Ibrahim',
  'Mohd Rizal bin Hamid', 'Zainab binti Mahmud', 'Azman bin Ali', 'Noraini binti Omar',
  'Faizal bin Karim', 'Haslinda binti Sulaiman', 'Roslan bin Daud', 'Mariam binti Taib',
  'Ismail bin Yaacob', 'Noor Azlina binti Rahman', 'Hafiz bin Osman', 'Salmah binti Hashim',
  'Razali bin Mohd', 'Azizah binti Ahmad', 'Kamal bin Saad', 'Rohani binti Idris',
];

export const mockTeachers: Teacher[] = Array.from({ length: 120 }, (_, i) => {
  const schoolId = Math.floor(i / 6) + 1; // 6 guru per sekolah
  const subjectIndex = i % 3; // Rotate antara 3 subjek
  const subjectId = subjectIndex + 1;
  const nameIndex = i % teacherNames.length;
  
  return {
    id: i + 1,
    name: teacherNames[nameIndex],
    ic_number: `${(i % 90 + 10).toString().padStart(2, '0')}${(i % 12 + 1).toString().padStart(2, '0')}${(i % 28 + 1).toString().padStart(2, '0')}-${(i % 14 + 1).toString().padStart(2, '0')}-${(i % 9000 + 1000)}`,
    school_id: schoolId > 20 ? ((i % 20) + 1) : schoolId,
    subject_id: subjectId,
    years_experience: Math.floor(Math.random() * 20) + 3,
    qualification: Math.random() > 0.5 ? 'Sarjana Muda Pendidikan' : 'Sarjana Pendidikan',
    phone: `01${Math.floor(Math.random() * 9)}${Math.random().toString().slice(2, 10)}`,
    email: `guru${i + 1}@moe.gov.my`,
  };
});

// Mock KPI data untuk guru (Skor Pencerapan PdP)
export const mockTeacherKPIs: TeacherKPI[] = mockTeachers.flatMap(teacher => {
  const ppdId = mockSchools.find(s => s.id === teacher.school_id)?.ppd_id || 1;
  
  return [
    {
      id: teacher.id * 10 + 1,
      teacher_id: teacher.id,
      assessment_date: '2025-06-15',
      pdp_score: Math.floor(Math.random() * 30) + 60, // Score 60-90
      assessed_by_ppd: ppdId,
      semester: 'semester_1',
      year: 2025,
      notes: 'Pencerapan PdP Semester 1',
    },
    {
      id: teacher.id * 10 + 2,
      teacher_id: teacher.id,
      assessment_date: '2025-11-20',
      pdp_score: Math.floor(Math.random() * 30) + 65, // Score 65-95
      assessed_by_ppd: ppdId,
      semester: 'semester_2',
      year: 2025,
      notes: 'Pencerapan PdP Semester 2',
    },
  ];
});
// Mock data untuk Program Reports (Laporan Tuisyen Sekolah)
export const mockProgramReports: ProgramReport[] = [
  {
    id: 1,
    program_id: 1,
    school_id: 1,
    report_date: '2026-01-20',
    session_title: 'Sesi Bimbingan BM - Karangan Argumentatif',
    subject_id: 1,
    teacher_name: 'Cikgu Ahmad bin Abdullah',
    duration_hours: 2,
    topics_covered: 'Teknik penulisan karangan argumentatif, penggunaan hujah yang kuat, struktur karangan yang betul',
    notes: 'Murid menunjukkan peningkatan dalam penulisan. Perlu lebih fokus pada tatabahasa.',
    status: 'submitted',
    submitted_by: 1,
    submitted_date: '2026-01-20',
  },
  {
    id: 2,
    program_id: 1,
    school_id: 1,
    report_date: '2026-01-22',
    session_title: 'Sesi Bimbingan BM - Pemahaman Teks',
    subject_id: 1,
    teacher_name: 'Cikgu Siti Nurhaliza',
    duration_hours: 1.5,
    topics_covered: 'Teknik menjawab soalan pemahaman, analisis teks, mencari maklumat tersurat dan tersirat',
    notes: 'Murid lebih yakin dalam menjawab soalan pemahaman.',
    status: 'draft',
    submitted_by: 1,
  },
  {
    id: 3,
    program_id: 2,
    school_id: 2,
    report_date: '2026-02-11',
    session_title: 'Kem Sejarah - Zaman Kesultanan Melayu',
    subject_id: 2,
    teacher_name: 'Cikgu Muhammad Hafiz',
    duration_hours: 3,
    topics_covered: 'Kesultanan Melaka, sistem pemerintahan, perdagangan, faktor kejatuhan',
    notes: 'Aktiviti kem sangat menarik. Murid aktif bertanya dan berdiskusi.',
    status: 'approved',
    submitted_by: 2,
    submitted_date: '2026-02-11',
  },
];

// Mock data untuk Student Attendance
export const mockStudentAttendance: StudentAttendance[] = [
  // Report 1 attendance
  { id: 1, program_report_id: 1, student_id: 1, present: true },
  { id: 2, program_report_id: 1, student_id: 2, present: true },
  { id: 3, program_report_id: 1, student_id: 3, present: false, notes: 'Sakit' },
  { id: 4, program_report_id: 1, student_id: 4, present: true },
  { id: 5, program_report_id: 1, student_id: 5, present: true },
  
  // Report 2 attendance
  { id: 6, program_report_id: 2, student_id: 1, present: true },
  { id: 7, program_report_id: 2, student_id: 2, present: false, notes: 'Urusan keluarga' },
  { id: 8, program_report_id: 2, student_id: 3, present: true },
  { id: 9, program_report_id: 2, student_id: 4, present: true },
  { id: 10, program_report_id: 2, student_id: 5, present: true },
  
  // Report 3 attendance
  { id: 11, program_report_id: 3, student_id: 45, present: true },
  { id: 12, program_report_id: 3, student_id: 46, present: true },
  { id: 13, program_report_id: 3, student_id: 47, present: true },
  { id: 14, program_report_id: 3, student_id: 48, present: false, notes: 'Demam' },
  { id: 15, program_report_id: 3, student_id: 49, present: true },
];

// Mock data untuk Program Photos
export const mockProgramPhotos: ProgramPhoto[] = [
  // Report 1 photos
  {
    id: 1,
    program_report_id: 1,
    photo_url: '/images/tuition/report1_photo1.jpg',
    caption: 'Murid sedang menulis karangan argumentatif',
    uploaded_date: '2026-01-20',
  },
  {
    id: 2,
    program_report_id: 1,
    photo_url: '/images/tuition/report1_photo2.jpg',
    caption: 'Cikgu Ahmad menerangkan struktur karangan',
    uploaded_date: '2026-01-20',
  },
  {
    id: 3,
    program_report_id: 1,
    photo_url: '/images/tuition/report1_photo3.jpg',
    caption: 'Suasana kelas yang kondusif',
    uploaded_date: '2026-01-20',
  },
  
  // Report 3 photos
  {
    id: 4,
    program_report_id: 3,
    photo_url: '/images/tuition/report3_photo1.jpg',
    caption: 'Aktiviti kumpulan semasa kem sejarah',
    uploaded_date: '2026-02-11',
  },
  {
    id: 5,
    program_report_id: 3,
    photo_url: '/images/tuition/report3_photo2.jpg',
    caption: 'Pembentangan hasil diskusi murid',
    uploaded_date: '2026-02-11',
  },
  {
    id: 6,
    program_report_id: 3,
    photo_url: '/images/tuition/report3_photo3.jpg',
    caption: 'Sesi soal jawab dengan fasilitator',
    uploaded_date: '2026-02-11',
  },
];