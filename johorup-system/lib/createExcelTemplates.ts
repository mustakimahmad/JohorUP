import * as XLSX from 'xlsx';

// Function to create Excel templates for database import
export const createDatabaseTemplates = () => {
  const workbook = XLSX.utils.book_new();

  // 1. PPD Template
  const ppdData = [
    ['id', 'name', 'code'],
    [1, 'PPD Johor Bahru', 'JB'],
    [2, 'PPD Muar', 'MR'],
    [3, 'PPD Batu Pahat', 'BP'],
    [4, 'PPD Kluang', 'KL'],
    [5, 'PPD Pontian', 'PT'],
    ['', '(Tambah PPD lain di sini)', '']
  ];
  const ppdSheet = XLSX.utils.aoa_to_sheet(ppdData);
  XLSX.utils.book_append_sheet(workbook, ppdSheet, 'PPD');

  // 2. Schools Template
  const schoolsData = [
    ['id', 'name', 'code', 'ppd_id', 'target_students'],
    [1, 'SMK Taman Johor Jaya', 'JBA001', 1, 50],
    [2, 'SMK Bandar Baru Uda', 'JBA002', 1, 45],
    [3, 'SMK Tanjung Agas', 'MRA001', 2, 60],
    ['', '(Tambah sekolah lain di sini)', '', '', '']
  ];
  const schoolsSheet = XLSX.utils.aoa_to_sheet(schoolsData);
  XLSX.utils.book_append_sheet(workbook, schoolsSheet, 'Schools');

  // 3. Students Template
  const studentsData = [
    ['id', 'name', 'ic_number', 'school_id', 'class'],
    [1, 'Ahmad Bin Ali', '051234-56-7890', 1, '5A'],
    [2, 'Siti Fatimah', '060987-65-4321', 1, '5A'],
    [3, 'Muhammad Hafiz', '050555-44-3333', 2, '5B'],
    ['', '(Tambah murid lain di sini)', '', '', '']
  ];
  const studentsSheet = XLSX.utils.aoa_to_sheet(studentsData);
  XLSX.utils.book_append_sheet(workbook, studentsSheet, 'Students');

  // 4. Subjects Template (Fixed data)
  const subjectsData = [
    ['id', 'name', 'code'],
    [1, 'Bahasa Melayu', 'BM'],
    [2, 'Sejarah', 'SEJ'],
    [3, 'Matematik', 'MAT'],
    ['', '(JANGAN UBAH DATA INI)', '']
  ];
  const subjectsSheet = XLSX.utils.aoa_to_sheet(subjectsData);
  XLSX.utils.book_append_sheet(workbook, subjectsSheet, 'Subjects');

  // 5. StudentGrades Template
  const gradesData = [
    ['id', 'student_id', 'subject_id', 'exam_type', 'grade', 'year'],
    [1, 1, 1, 'akhir_tingkatan_4', 'C+', 2025],
    [2, 1, 2, 'akhir_tingkatan_4', 'D', 2025],
    [3, 1, 3, 'akhir_tingkatan_4', 'C', 2025],
    [4, 1, 1, 'pertengahan_tahun', 'B', 2026],
    [5, 1, 2, 'pertengahan_tahun', 'C+', 2026],
    ['', '(Tambah markah lain di sini)', '', '', '', ''],
    ['', 'Exam Types: akhir_tingkatan_4, pertengahan_tahun, percubaan, spm', '', '', '', ''],
    ['', 'Grades: A+, A, A-, B+, B, C+, C, D, E, G, TH', '', '', '', '']
  ];
  const gradesSheet = XLSX.utils.aoa_to_sheet(gradesData);
  XLSX.utils.book_append_sheet(workbook, gradesSheet, 'StudentGrades');

  // 6. Users Template
  const usersData = [
    ['id', 'email', 'name', 'role', 'school_id', 'ppd_id'],
    [1, 'sekolah1@moe.gov.my', 'Guru Besar SMK TJJ', 'school', 1, ''],
    [2, 'ppd.jb@moe.gov.my', 'Pegawai PPD JB', 'ppd', '', 1],
    [3, 'pembelajaran@jpnj.gov.my', 'Ketua Sektor Pembelajaran', 'sektor_pembelajaran', '', ''],
    [4, 'perancangan@jpnj.gov.my', 'Ketua Sektor Perancangan', 'sektor_perancangan', '', ''],
    ['', '(Tambah pengguna lain di sini)', '', '', '', ''],
    ['', 'Roles: school, ppd, sektor_pembelajaran, sektor_perancangan', '', '', '', '']
  ];
  const usersSheet = XLSX.utils.aoa_to_sheet(usersData);
  XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users');

  // 7. Programs Template
  const programsData = [
    ['id', 'title', 'description', 'program_type', 'target_subject_id', 'start_date', 'end_date', 'created_by', 'target_students'],
    [1, 'Program Intensif Bahasa Melayu', 'Program bimbingan intensif untuk subjek BM', 'Bimbingan', 1, '2026-01-15', '2026-03-30', 1, 45],
    [2, 'Kem Motivasi Sejarah', 'Kem motivasi dan pembelajaran Sejarah', 'Kem', 2, '2026-02-10', '2026-02-12', 1, 60],
    [3, 'Kelas Tambahan Matematik', 'Kelas tambahan hujung minggu untuk Matematik', 'Kelas Tambahan', 3, '2026-01-20', '2026-08-30', 1, 50],
    ['', '(Tambah program lain di sini)', '', '', '', '', '', '', ''],
    ['', 'Program Types: Bimbingan, Kem, Kelas Tambahan, Workshop, Seminar', '', '', '', '', '', '', ''],
    ['', 'Date Format: YYYY-MM-DD', '', '', '', '', '', '', '']
  ];
  const programsSheet = XLSX.utils.aoa_to_sheet(programsData);
  XLSX.utils.book_append_sheet(workbook, programsSheet, 'Programs');

  // 8. Teachers Template
  const teachersData = [
    ['id', 'name', 'ic_number', 'school_id', 'subject_id', 'years_experience', 'qualification', 'phone', 'email'],
    [1, 'Ahmad bin Abdullah', '801234-56-7890', 1, 1, 15, 'Sarjana Muda Pendidikan', '0123456789', 'ahmad.guru@moe.gov.my'],
    [2, 'Siti Nurhaliza binti Hassan', '850987-65-4321', 1, 2, 12, 'Sarjana Pendidikan', '0198765432', 'siti.guru@moe.gov.my'],
    [3, 'Muhammad Hafiz bin Ismail', '790555-44-3333', 2, 3, 18, 'Sarjana Muda Pendidikan', '0167894561', 'hafiz.guru@moe.gov.my'],
    ['', '(Tambah guru lain di sini)', '', '', '', '', '', '', ''],
    ['', 'Subject IDs: 1=Bahasa Melayu, 2=Sejarah, 3=Matematik', '', '', '', '', '', '', ''],
    ['', 'Qualifications: Sarjana Muda Pendidikan, Sarjana Pendidikan, Diploma Pendidikan', '', '', '', '', '', '', '']
  ];
  const teachersSheet = XLSX.utils.aoa_to_sheet(teachersData);
  XLSX.utils.book_append_sheet(workbook, teachersSheet, 'Teachers');

  // 9. TeacherKPIs Template
  const teacherKPIsData = [
    ['id', 'teacher_id', 'assessment_date', 'pdp_score', 'assessed_by_ppd', 'semester', 'year', 'notes'],
    [1, 1, '2025-06-15', 85, 1, 'semester_1', 2025, 'Pencerapan PdP yang baik'],
    [2, 1, '2025-11-20', 88, 1, 'semester_2', 2025, 'Peningkatan dari semester 1'],
    [3, 2, '2025-06-15', 75, 1, 'semester_1', 2025, 'Perlu penambahbaikan'],
    [4, 2, '2025-11-20', 82, 1, 'semester_2', 2025, 'Menunjukkan peningkatan'],
    ['', '(Tambah KPI guru lain di sini)', '', '', '', '', '', ''],
    ['', 'PDP Score: 0-100 (Skor Pencerapan PdP)', '', '', '', '', '', ''],
    ['', 'Semester: semester_1, semester_2', '', '', '', '', '', ''],
    ['', 'Date Format: YYYY-MM-DD', '', '', '', '', '', '']
  ];
  const teacherKPIsSheet = XLSX.utils.aoa_to_sheet(teacherKPIsData);
  XLSX.utils.book_append_sheet(workbook, teacherKPIsSheet, 'TeacherKPIs');

  // 10. Budget Template
  const budgetData = [
    ['id', 'program_id', 'amount', 'description', 'status', 'approved_by', 'approved_date'],
    [1, 1, 120000, 'Gaji tutor dan bahan pembelajaran', 'approved', 4, '2026-01-05'],
    [2, 2, 80000, 'Penginapan dan makan peserta kem', 'pending_approval', '', ''],
    [3, 3, 150000, 'Tutor, bahan, dan transport', 'approved', 4, '2026-01-05'],
    ['', '(Tambah budget lain di sini)', '', '', '', '', ''],
    ['', 'Status: planned, approved, spent, pending_approval', '', '', '', '', ''],
    ['', 'Date Format: YYYY-MM-DD', '', '', '', '', '']
  ];
  const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData);
  XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Budget');

  // Save the workbook
  const fileName = `JohorUP_Database_Template_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  console.log(`✅ Template Excel created: ${fileName}`);
  return fileName;
};