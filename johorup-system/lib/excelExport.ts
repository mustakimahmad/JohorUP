import * as XLSX from 'xlsx';
import { mockStudents, mockGrades, mockSchools, mockSubjects, mockPrograms } from './mockData';

// Utility function to export students data to Excel
export const exportStudentsToExcel = (schoolId?: number) => {
  const students = schoolId 
    ? mockStudents.filter(s => s.school_id === schoolId)
    : mockStudents;

  const data = students.map(student => {
    const school = mockSchools.find(s => s.id === student.school_id);
    const grades = mockGrades.filter(g => g.student_id === student.id);
    const bmGrade = grades.find(g => g.subject_id === 1);
    const sejGrade = grades.find(g => g.subject_id === 2);
    const matGrade = grades.find(g => g.subject_id === 3);

    const gradeValues: { [key: string]: number } = {
      'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
    };

    const avgGrade = grades.reduce((sum, g) => sum + (gradeValues[g.grade] || 0), 0) / grades.length;

    return {
      'Bil': students.indexOf(student) + 1,
      'Nama': student.name,
      'No. IC': student.ic_number,
      'Sekolah': school?.name || '',
      'Kelas': student.class,
      'Bahasa Melayu': bmGrade?.grade || '-',
      'Sejarah': sejGrade?.grade || '-',
      'Matematik': matGrade?.grade || '-',
      'Purata': avgGrade.toFixed(1),
      'Status': avgGrade >= 80 ? 'Cemerlang' : avgGrade >= 65 ? 'Baik' : avgGrade >= 50 ? 'Sederhana' : 'Perlu Perhatian'
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Senarai Murid');

  const fileName = schoolId 
    ? `Senarai_Murid_${mockSchools.find(s => s.id === schoolId)?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
    : `Senarai_Murid_Semua_${new Date().toISOString().split('T')[0]}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};

// Utility function to export progress analysis to Excel
export const exportProgressToExcel = (schoolId?: number) => {
  const students = schoolId 
    ? mockStudents.filter(s => s.school_id === schoolId)
    : mockStudents;

  const progressData = students.map(student => {
    const school = mockSchools.find(s => s.id === student.school_id);
    const grades = mockGrades.filter(g => g.student_id === student.id);
    
    const gradeValues: { [key: string]: number } = {
      'A+': 100, 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'C+': 70, 'C': 65, 'D': 50, 'E': 40, 'G': 20
    };
    
    const tingkatan4Avg = grades.reduce((sum, g) => sum + (gradeValues[g.grade] || 0), 0) / grades.length;
    const midYearAvg = tingkatan4Avg + Math.random() * 15 + 5;
    const trialAvg = Math.min(midYearAvg + Math.random() * 10 + 3, 100);
    const improvement = ((trialAvg - tingkatan4Avg) / tingkatan4Avg * 100);

    return {
      'Bil': students.indexOf(student) + 1,
      'Nama': student.name,
      'No. IC': student.ic_number,
      'Sekolah': school?.name || '',
      'Kelas': student.class,
      'Tingkatan 4 (%)': tingkatan4Avg.toFixed(1),
      'Pertengahan Tahun (%)': midYearAvg.toFixed(1),
      'Percubaan SPM (%)': trialAvg.toFixed(1),
      'Peningkatan (%)': improvement.toFixed(1),
      'Status': trialAvg >= 80 ? 'Cemerlang' : trialAvg >= 65 ? 'Baik' : trialAvg >= 50 ? 'Sederhana' : 'Perlu Perhatian'
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(progressData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Analisis Perkembangan');

  const fileName = schoolId 
    ? `Analisis_Perkembangan_${mockSchools.find(s => s.id === schoolId)?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
    : `Analisis_Perkembangan_Semua_${new Date().toISOString().split('T')[0]}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};

// Export program summary with target students
export const exportProgramSummaryToExcel = () => {
  const programData = mockPrograms.map(program => {
    const subject = mockSubjects.find(s => s.id === program.target_subject_id);
    return {
      'Bil': mockPrograms.indexOf(program) + 1,
      'Nama Program': program.title,
      'Jenis Program': program.program_type,
      'Subjek': subject?.name || '',
      'Tarikh Mula': new Date(program.start_date).toLocaleDateString('ms-MY'),
      'Tarikh Tamat': new Date(program.end_date).toLocaleDateString('ms-MY'),
      'Murid Disasarkan': program.target_students || 0,
      'Penerangan': program.description
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(programData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ringkasan Program');

  const fileName = `Ringkasan_Program_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};