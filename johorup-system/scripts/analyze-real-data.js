// Analyze real students data format and convert if needed
const XLSX = require('xlsx');

try {
  console.log('🔍 ANALYZING REAL STUDENTS DATA FORMAT');
  console.log('=====================================');
  
  const wb = XLSX.readFile('data/students_real.xlsx');
  const students = XLSX.utils.sheet_to_json(wb.Sheets['Students']);
  
  console.log(`📊 Total students: ${students.length}`);
  console.log(`📋 Columns: ${Object.keys(students[0]).join(', ')}`);
  
  // Analyze kodkaum values
  console.log('\n🔍 KODKAUM Analysis:');
  const kodkaumValues = {};
  students.forEach(student => {
    const val = student.kodkaum;
    kodkaumValues[val] = (kodkaumValues[val] || 0) + 1;
  });
  
  console.log('   Unique kodkaum values:');
  Object.entries(kodkaumValues).forEach(([val, count]) => {
    console.log(`     ${val}: ${count} students (${(count/students.length*100).toFixed(1)}%)`);
  });
  
  // Analyze jantina values
  console.log('\n🔍 JANTINA Analysis:');
  const jantinaValues = {};
  students.forEach(student => {
    const val = student.jantina;
    jantinaValues[val] = (jantinaValues[val] || 0) + 1;
  });
  
  console.log('   Unique jantina values:');
  Object.entries(jantinaValues).forEach(([val, count]) => {
    console.log(`     ${val}: ${count} students (${(count/students.length*100).toFixed(1)}%)`);
  });
  
  // Analyze form_level values
  console.log('\n🔍 FORM_LEVEL Analysis:');
  const formValues = {};
  students.forEach(student => {
    const val = student.form_level;
    formValues[val] = (formValues[val] || 0) + 1;
  });
  
  console.log('   Unique form_level values:');
  Object.entries(formValues).forEach(([val, count]) => {
    console.log(`     ${val}: ${count} students`);
  });
  
  // Analyze class_name values
  console.log('\n🔍 CLASS_NAME Analysis:');
  const classValues = {};
  students.forEach(student => {
    const val = student.class_name;
    classValues[val] = (classValues[val] || 0) + 1;
  });
  
  console.log('   Unique class_name values (top 10):');
  const sortedClasses = Object.entries(classValues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  sortedClasses.forEach(([val, count]) => {
    console.log(`     ${val}: ${count} students`);
  });
  
  // Sample students
  console.log('\n📋 SAMPLE STUDENTS (first 5):');
  students.slice(0, 5).forEach((student, i) => {
    console.log(`   ${i+1}. ${student.name}`);
    console.log(`      IC: ${student.ic_number}`);
    console.log(`      School: ${student.school_id}`);
    console.log(`      Form: ${student.form_level}`);
    console.log(`      Class: ${student.class_name}`);
    console.log(`      Kodkaum: ${student.kodkaum}`);
    console.log(`      Jantina: ${student.jantina}`);
    console.log('');
  });
  
  console.log('✅ ANALYSIS COMPLETE!');
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('   1. Data sebenar anda menggunakan format yang berbeza');
  console.log('   2. Kodkaum menggunakan numbers instead of M/C/I/L');
  console.log('   3. Jantina menggunakan full words instead of L/P');
  console.log('   4. Form level menggunakan 200 instead of 4/5');
  console.log('   5. Import script telah di-update untuk handle format ini');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}