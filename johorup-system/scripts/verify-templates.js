// Script untuk verify template data structure
// Run: node scripts/verify-templates.js

const XLSX = require('xlsx');
const path = require('path');

function verifyTemplates() {
  console.log('🔍 Verifying Template Data Structure');
  console.log('====================================');
  
  const dataDir = path.join(__dirname, '../data');
  
  // Verify Schools
  console.log('\n📚 SCHOOLS DATA:');
  const schoolsFile = path.join(dataDir, 'schools_complete.xlsx');
  const schoolsWorkbook = XLSX.readFile(schoolsFile);
  const schoolsSheet = schoolsWorkbook.Sheets['Schools'];
  const schools = XLSX.utils.sheet_to_json(schoolsSheet);
  
  console.log(`   Total Schools: ${schools.length}`);
  console.log(`   Sample School:`, schools[0]);
  
  // PPD breakdown
  const ppdBreakdown = {};
  schools.forEach(school => {
    ppdBreakdown[school.ppd_id] = (ppdBreakdown[school.ppd_id] || 0) + 1;
  });
  console.log(`   PPD Breakdown:`, ppdBreakdown);
  
  // Verify Students
  console.log('\n👨‍🎓 STUDENTS DATA:');
  const studentsFile = path.join(dataDir, 'students_complete.xlsx');
  const studentsWorkbook = XLSX.readFile(studentsFile);
  const studentsSheet = studentsWorkbook.Sheets['Students'];
  const students = XLSX.utils.sheet_to_json(studentsSheet);
  
  console.log(`   Total Students: ${students.length}`);
  console.log(`   Sample Student:`, students[0]);
  
  // Demographic analysis
  const demographics = {};
  const genderCount = { L: 0, P: 0 };
  const raceCount = { M: 0, C: 0, I: 0, L: 0 };
  
  students.forEach(student => {
    const key = `${student.kodkaum}_${student.jantina}`;
    demographics[key] = (demographics[key] || 0) + 1;
    genderCount[student.jantina]++;
    raceCount[student.kodkaum]++;
  });
  
  console.log('\n📊 DEMOGRAPHIC ANALYSIS:');
  console.log('   By Race:');
  console.log(`     Melayu (M): ${raceCount.M} (${(raceCount.M/students.length*100).toFixed(1)}%)`);
  console.log(`     Cina (C): ${raceCount.C} (${(raceCount.C/students.length*100).toFixed(1)}%)`);
  console.log(`     India (I): ${raceCount.I} (${(raceCount.I/students.length*100).toFixed(1)}%)`);
  console.log(`     Lain-lain (L): ${raceCount.L} (${(raceCount.L/students.length*100).toFixed(1)}%)`);
  
  console.log('   By Gender:');
  console.log(`     Lelaki (L): ${genderCount.L} (${(genderCount.L/students.length*100).toFixed(1)}%)`);
  console.log(`     Perempuan (P): ${genderCount.P} (${(genderCount.P/students.length*100).toFixed(1)}%)`);
  
  console.log('   Cross-tabulation:');
  Object.entries(demographics).forEach(([key, count]) => {
    const [race, gender] = key.split('_');
    const raceLabel = { M: 'Melayu', C: 'Cina', I: 'India', L: 'Lain-lain' }[race];
    const genderLabel = { L: 'Lelaki', P: 'Perempuan' }[gender];
    console.log(`     ${raceLabel} ${genderLabel}: ${count} (${(count/students.length*100).toFixed(1)}%)`);
  });
  
  // School distribution
  const schoolDistribution = {};
  students.forEach(student => {
    schoolDistribution[student.school_id] = (schoolDistribution[student.school_id] || 0) + 1;
  });
  
  console.log('\n🏫 STUDENTS PER SCHOOL:');
  Object.entries(schoolDistribution).forEach(([schoolId, count]) => {
    const school = schools.find(s => s.id == schoolId);
    console.log(`   ${school?.name || `School ${schoolId}`}: ${count} students`);
  });
  
  // Verify Teachers
  console.log('\n👩‍🏫 TEACHERS DATA:');
  const teachersFile = path.join(dataDir, 'teachers_complete.xlsx');
  const teachersWorkbook = XLSX.readFile(teachersFile);
  const teachersSheet = teachersWorkbook.Sheets['Teachers'];
  const teachers = XLSX.utils.sheet_to_json(teachersSheet);
  
  console.log(`   Total Teachers: ${teachers.length}`);
  console.log(`   Sample Teacher:`, teachers[0]);
  
  // Teachers per school
  const teachersBySchool = {};
  teachers.forEach(teacher => {
    teachersBySchool[teacher.school_id] = (teachersBySchool[teacher.school_id] || 0) + 1;
  });
  
  console.log('   Teachers per School:');
  Object.entries(teachersBySchool).forEach(([schoolId, count]) => {
    const school = schools.find(s => s.id == schoolId);
    console.log(`     ${school?.name || `School ${schoolId}`}: ${count} teachers`);
  });
  
  // Verify Users
  console.log('\n👤 USERS DATA:');
  const usersFile = path.join(dataDir, 'users_complete.xlsx');
  const usersWorkbook = XLSX.readFile(usersFile);
  const usersSheet = usersWorkbook.Sheets['Users'];
  const users = XLSX.utils.sheet_to_json(usersSheet);
  
  console.log(`   Total Users: ${users.length}`);
  console.log(`   Sample User:`, users[0]);
  
  // Users by role
  const usersByRole = {};
  users.forEach(user => {
    usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
  });
  
  console.log('   Users by Role:');
  Object.entries(usersByRole).forEach(([role, count]) => {
    console.log(`     ${role}: ${count} users`);
  });
  
  console.log('\n✅ Template verification completed!');
  console.log('\n📋 SUMMARY:');
  console.log(`   - ${schools.length} schools across 3 PPDs`);
  console.log(`   - ${students.length} students with demographic data`);
  console.log(`   - ${teachers.length} teachers (6 per school)`);
  console.log(`   - ${users.length} user accounts`);
  console.log(`   - Demographic distribution: ${(raceCount.M/students.length*100).toFixed(1)}% Melayu, ${(raceCount.C/students.length*100).toFixed(1)}% Cina, ${(raceCount.I/students.length*100).toFixed(1)}% India, ${(raceCount.L/students.length*100).toFixed(1)}% Lain-lain`);
  console.log(`   - Gender distribution: ${(genderCount.L/students.length*100).toFixed(1)}% Lelaki, ${(genderCount.P/students.length*100).toFixed(1)}% Perempuan`);
}

// Run verification
verifyTemplates();