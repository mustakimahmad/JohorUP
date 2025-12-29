// Script untuk verify real data yang telah di-generate
const XLSX = require('xlsx');

try {
  console.log('🔍 VERIFYING REAL DATA FOR YOUR SCHOOLS');
  console.log('======================================');
  
  // Read schools
  const schoolsWB = XLSX.readFile('data/schools.xlsx');
  const schools = XLSX.utils.sheet_to_json(schoolsWB.Sheets['Schools']);
  
  // Read students
  const studentsWB = XLSX.readFile('data/students_real.xlsx');
  const students = XLSX.utils.sheet_to_json(studentsWB.Sheets['Students']);
  
  // Read teachers
  const teachersWB = XLSX.readFile('data/teachers_real.xlsx');
  const teachers = XLSX.utils.sheet_to_json(teachersWB.Sheets['Teachers']);
  
  // Read users
  const usersWB = XLSX.readFile('data/users_real.xlsx');
  const users = XLSX.utils.sheet_to_json(usersWB.Sheets['Users']);
  
  console.log(`📊 DATA SUMMARY:`);
  console.log(`   Schools: ${schools.length}`);
  console.log(`   Students: ${students.length}`);
  console.log(`   Teachers: ${teachers.length}`);
  console.log(`   Users: ${users.length}`);
  
  // PPD Analysis
  console.log(`\\n🏢 PPD BREAKDOWN:`);
  const ppdStats = {};
  schools.forEach(school => {
    const ppdId = school.ppd_id;
    if (!ppdStats[ppdId]) {
      ppdStats[ppdId] = { schools: 0, students: 0, teachers: 0 };
    }
    ppdStats[ppdId].schools++;
    ppdStats[ppdId].students += students.filter(s => s.school_id === school.id).length;
    ppdStats[ppdId].teachers += teachers.filter(t => t.school_id === school.id).length;
  });
  
  Object.entries(ppdStats).forEach(([ppd, stats]) => {
    console.log(`   ${ppd}: ${stats.schools} sekolah, ${stats.students} murid, ${stats.teachers} guru`);
  });
  
  // Demographic Analysis
  console.log(`\\n👥 DEMOGRAPHIC ANALYSIS:`);
  const demographics = {};
  const genderCount = { L: 0, P: 0 };
  const raceCount = { M: 0, C: 0, I: 0, L: 0 };
  
  students.forEach(student => {
    const key = `${student.kodkaum}_${student.jantina}`;
    demographics[key] = (demographics[key] || 0) + 1;
    genderCount[student.jantina]++;
    raceCount[student.kodkaum]++;
  });
  
  console.log('   By Race:');
  console.log(`     Melayu (M): ${raceCount.M} (${(raceCount.M/students.length*100).toFixed(1)}%)`);
  console.log(`     Cina (C): ${raceCount.C} (${(raceCount.C/students.length*100).toFixed(1)}%)`);
  console.log(`     India (I): ${raceCount.I} (${(raceCount.I/students.length*100).toFixed(1)}%)`);
  console.log(`     Lain-lain (L): ${raceCount.L} (${(raceCount.L/students.length*100).toFixed(1)}%)`);
  
  console.log('   By Gender:');
  console.log(`     Lelaki (L): ${genderCount.L} (${(genderCount.L/students.length*100).toFixed(1)}%)`);
  console.log(`     Perempuan (P): ${genderCount.P} (${(genderCount.P/students.length*100).toFixed(1)}%)`);
  
  // Sample students by school
  console.log(`\\n👨‍🎓 SAMPLE STUDENTS BY SCHOOL:`);
  schools.slice(0, 3).forEach(school => {
    const schoolStudents = students.filter(s => s.school_id === school.id);
    console.log(`\\n   ${school.name}:`);
    schoolStudents.slice(0, 5).forEach(student => {
      const raceLabel = { M: 'Melayu', C: 'Cina', I: 'India', L: 'Lain-lain' }[student.kodkaum];
      const genderLabel = { L: 'Lelaki', P: 'Perempuan' }[student.jantina];
      console.log(`     - ${student.name} (${raceLabel} ${genderLabel}, Form ${student.form_level})`);
    });
    console.log(`     ... dan ${schoolStudents.length - 5} lagi`);
  });
  
  // User accounts
  console.log(`\\n👤 USER ACCOUNTS:`);
  users.forEach(user => {
    console.log(`   ${user.email} - ${user.name} (${user.role})`);
  });
  
  console.log(`\\n✅ VERIFICATION COMPLETE!`);
  console.log(`\\n📋 READY FOR IMPORT:`);
  console.log(`   1. Close any Excel files that might be open`);
  console.log(`   2. Copy: copy data\\\\students_real.xlsx data\\\\students.xlsx`);
  console.log(`   3. Copy: copy data\\\\teachers_real.xlsx data\\\\teachers.xlsx`);
  console.log(`   4. Copy: copy data\\\\users_real.xlsx data\\\\users.xlsx`);
  console.log(`   5. Import to database when ready`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}