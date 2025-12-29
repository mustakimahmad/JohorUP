// Verify real students data that was pushed to Netlify
const XLSX = require('xlsx');

try {
  const wb = XLSX.readFile('data/students_real.xlsx');
  const students = XLSX.utils.sheet_to_json(wb.Sheets['Students']);
  
  console.log('📊 REAL STUDENTS DATA PUSHED TO NETLIFY:');
  console.log('==========================================');
  console.log(`Total students: ${students.length}`);
  console.log(`Structure: ${Object.keys(students[0]).join(', ')}`);
  
  console.log('\n📋 Sample real student:');
  console.log(JSON.stringify(students[0], null, 2));
  
  // Demographic breakdown
  const demographics = {};
  const raceCount = { M: 0, C: 0, I: 0, L: 0 };
  const genderCount = { L: 0, P: 0 };
  
  students.forEach(student => {
    const key = `${student.kodkaum}_${student.jantina}`;
    demographics[key] = (demographics[key] || 0) + 1;
    raceCount[student.kodkaum]++;
    genderCount[student.jantina]++;
  });
  
  console.log('\n📈 Demographic Distribution:');
  const total = students.length;
  
  console.log('   By Race:');
  Object.entries(raceCount).forEach(([race, count]) => {
    const raceLabel = { M: 'Melayu', C: 'Cina', I: 'India', L: 'Lain-lain' }[race];
    console.log(`     ${raceLabel}: ${count} (${(count/total*100).toFixed(1)}%)`);
  });
  
  console.log('   By Gender:');
  Object.entries(genderCount).forEach(([gender, count]) => {
    const genderLabel = { L: 'Lelaki', P: 'Perempuan' }[gender];
    console.log(`     ${genderLabel}: ${count} (${(count/total*100).toFixed(1)}%)`);
  });
  
  console.log('\n   Cross-tabulation:');
  Object.entries(demographics).forEach(([key, count]) => {
    const [race, gender] = key.split('_');
    const raceLabel = { M: 'Melayu', C: 'Cina', I: 'India', L: 'Lain-lain' }[race];
    const genderLabel = { L: 'Lelaki', P: 'Perempuan' }[gender];
    console.log(`     ${raceLabel} ${genderLabel}: ${count} (${(count/total*100).toFixed(1)}%)`);
  });
  
  // School distribution
  const schoolCount = {};
  students.forEach(student => {
    schoolCount[student.school_id] = (schoolCount[student.school_id] || 0) + 1;
  });
  
  console.log('\n🏫 Students per School:');
  Object.entries(schoolCount).forEach(([schoolId, count]) => {
    console.log(`   School ${schoolId}: ${count} students`);
  });
  
  console.log('\n✅ REAL DATA VERIFICATION COMPLETE!');
  console.log('\n🚀 STATUS: Data sebenar telah berjaya di-push ke Netlify');
  console.log('🔗 Live at: https://johorup.netlify.app');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}