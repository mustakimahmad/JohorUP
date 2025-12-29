// Script untuk check data sekolah sebenar
const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('data/schools.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const schools = XLSX.utils.sheet_to_json(sheet);
  
  console.log('📚 DATA SEKOLAH SEBENAR ANDA:');
  console.log('============================');
  console.log(`Total sekolah: ${schools.length}`);
  console.log(`Sheet name: ${sheetName}`);
  
  console.log('\n📋 Sample sekolah pertama:');
  console.log(JSON.stringify(schools[0], null, 2));
  
  console.log('\n🏫 Senarai semua sekolah:');
  schools.forEach((school, i) => {
    console.log(`${i+1}. ${school.name || school.Name || 'No Name'} (ID: ${school.id || school.ID || i+1}, PPD: ${school.ppd_id || school.PPD_ID || 'N/A'})`);
  });
  
  // Check PPD distribution
  const ppdCount = {};
  schools.forEach(school => {
    const ppdId = school.ppd_id || school.PPD_ID || 'Unknown';
    ppdCount[ppdId] = (ppdCount[ppdId] || 0) + 1;
  });
  
  console.log('\n📊 Breakdown by PPD:');
  Object.entries(ppdCount).forEach(([ppd, count]) => {
    console.log(`   PPD ${ppd}: ${count} sekolah`);
  });
  
  // Check required fields
  console.log('\n🔍 Field validation:');
  const requiredFields = ['id', 'name', 'code', 'ppd_id'];
  const alternativeFields = ['ID', 'Name', 'Code', 'PPD_ID'];
  
  requiredFields.forEach((field, index) => {
    const altField = alternativeFields[index];
    const hasField = schools.every(school => school[field] || school[altField]);
    const fieldName = field.toUpperCase();
    console.log(`   ${fieldName}: ${hasField ? '✅' : '❌'} ${hasField ? 'OK' : 'Missing'}`);
  });
  
} catch (error) {
  console.error('❌ Error reading schools.xlsx:', error.message);
  console.log('\n💡 Pastikan file data/schools.xlsx wujud dan format betul');
}