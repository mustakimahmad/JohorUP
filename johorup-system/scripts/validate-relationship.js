// Script untuk validate relationship antara Schools dan Students
// Run: node scripts/validate-relationship.js

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function validateRelationship(schoolsFile, studentsFile) {
  console.log('🔍 Validating Schools ↔ Students Relationship...');
  
  try {
    // Read Schools file
    console.log('📚 Reading schools data...');
    const schoolsWorkbook = XLSX.readFile(schoolsFile);
    const schoolsSheet = schoolsWorkbook.Sheets['Schools'] || schoolsWorkbook.Sheets[schoolsWorkbook.SheetNames[0]];
    const schools = XLSX.utils.sheet_to_json(schoolsSheet);
    
    // Read Students file  
    console.log('👨‍🎓 Reading students data...');
    const studentsWorkbook = XLSX.readFile(studentsFile);
    const studentsSheet = studentsWorkbook.Sheets['Students'] || studentsWorkbook.Sheets[studentsWorkbook.SheetNames[0]];
    const students = XLSX.utils.sheet_to_json(studentsSheet);
    
    console.log(`📊 Found ${schools.length} schools and ${students.length} students`);
    
    // Create school ID map
    const schoolMap = new Map();
    schools.forEach(school => {
      schoolMap.set(school.id, {
        name: school.name,
        code: school.code,
        target_students: school.target_students || 44,
        actual_students: 0
      });
    });
    
    // Validation results
    const results = {
      valid: true,
      errors: [],
      warnings: [],
      summary: {
        total_schools: schools.length,
        total_students: students.length,
        schools_with_students: 0,
        schools_without_students: 0,
        orphaned_students: 0
      }
    };
    
    // Validate each student
    console.log('🔍 Validating student relationships...');
    students.forEach((student, index) => {
      const studentRow = index + 2; // Excel row number (header = 1)
      
      // Check if school_id exists
      if (!student.school_id) {
        results.errors.push(`Row ${studentRow}: Student "${student.name}" missing school_id`);
        results.valid = false;
        results.summary.orphaned_students++;
        return;
      }
      
      // Check if school exists
      if (!schoolMap.has(student.school_id)) {
        results.errors.push(`Row ${studentRow}: Student "${student.name}" has invalid school_id: ${student.school_id}`);
        results.valid = false;
        results.summary.orphaned_students++;
        return;
      }
      
      // Validate kodkaum
      if (student.kodkaum && !['M', 'C', 'I', 'L'].includes(student.kodkaum)) {
        results.errors.push(`Row ${studentRow}: Student "${student.name}" has invalid kodkaum: ${student.kodkaum} (must be M/C/I/L)`);
        results.valid = false;
      }
      
      // Validate jantina
      if (student.jantina && !['L', 'P'].includes(student.jantina)) {
        results.errors.push(`Row ${studentRow}: Student "${student.name}" has invalid jantina: ${student.jantina} (must be L/P)`);
        results.valid = false;
      }
      
      // Count students per school
      const school = schoolMap.get(student.school_id);
      school.actual_students++;
    });
    
    // Validate school targets
    console.log('🏫 Validating school targets...');
    schoolMap.forEach((school, schoolId) => {
      if (school.actual_students === 0) {
        results.warnings.push(`School "${school.name}" (ID: ${schoolId}) has no students`);
        results.summary.schools_without_students++;
      } else {
        results.summary.schools_with_students++;
        
        // Check target vs actual
        if (school.actual_students !== school.target_students) {
          const difference = school.actual_students - school.target_students;
          const message = difference > 0 ? 
            `School "${school.name}" has ${difference} more students than target (${school.actual_students}/${school.target_students})` :
            `School "${school.name}" has ${Math.abs(difference)} fewer students than target (${school.actual_students}/${school.target_students})`;
          
          if (Math.abs(difference) > 5) {
            results.errors.push(message);
            results.valid = false;
          } else {
            results.warnings.push(message);
          }
        }
      }
    });
    
    // Generate report
    console.log('\n📋 VALIDATION REPORT');
    console.log('===================');
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total Schools: ${results.summary.total_schools}`);
    console.log(`   Total Students: ${results.summary.total_students}`);
    console.log(`   Schools with Students: ${results.summary.schools_with_students}`);
    console.log(`   Schools without Students: ${results.summary.schools_without_students}`);
    console.log(`   Orphaned Students: ${results.summary.orphaned_students}`);
    
    if (results.errors.length > 0) {
      console.log(`\n❌ ERRORS (${results.errors.length}):`);
      results.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    if (results.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${results.warnings.length}):`);
      results.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    // School breakdown
    console.log(`\n🏫 School Breakdown:`);
    schoolMap.forEach((school, schoolId) => {
      const status = school.actual_students === school.target_students ? '✅' : 
                    school.actual_students === 0 ? '❌' : '⚠️';
      console.log(`   ${status} ${school.name}: ${school.actual_students}/${school.target_students} students`);
    });
    
    if (results.valid) {
      console.log('\n🎉 VALIDATION PASSED! Relationship is valid.');
    } else {
      console.log('\n💥 VALIDATION FAILED! Please fix errors before importing.');
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    return { valid: false, error: error.message };
  }
}

// Generate sample data for testing
function generateSampleData() {
  console.log('📝 Generating sample relationship data...');
  
  // Create data directory
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Generate schools data
  const schools = [];
  for (let i = 1; i <= 20; i++) {
    const ppdId = i <= 8 ? 1 : i <= 14 ? 2 : 3;
    schools.push({
      id: i,
      name: `SMK Demo ${i}`,
      code: `SMKDEMO${i}`,
      ppd_id: ppdId,
      address: `Alamat Sekolah ${i}`,
      phone: `07-${String(i).padStart(3, '0')}1234`,
      email: `smkdemo${i}@moe-dl.edu.my`,
      principal_name: `Pengetua ${i}`,
      target_students: 44
    });
  }
  
  // Generate students data
  const students = [];
  let studentId = 1;
  
  // Kod kaum distribution (realistic for Malaysia)
  const kodkaumDistribution = ['M', 'M', 'M', 'M', 'M', 'M', 'C', 'C', 'I', 'L']; // 60% Melayu, 20% Cina, 10% India, 10% Lain-lain
  const jantina = ['L', 'P']; // 50-50 distribution
  
  for (let schoolId = 1; schoolId <= 20; schoolId++) {
    for (let j = 1; j <= 44; j++) {
      const kodkaum = kodkaumDistribution[j % kodkaumDistribution.length];
      const gender = jantina[j % 2];
      
      // Generate name based on kodkaum and jantina
      let name = '';
      if (kodkaum === 'M') {
        name = gender === 'L' ? 
          `Ahmad ${['Bin Abdullah', 'Bin Hassan', 'Bin Omar', 'Bin Rahman', 'Bin Ali'][j % 5]}` :
          `Siti ${['Binti Ahmad', 'Binti Hassan', 'Binti Omar', 'Binti Rahman', 'Binti Ali'][j % 5]}`;
      } else if (kodkaum === 'C') {
        name = gender === 'L' ? 
          `${['Lim', 'Tan', 'Wong', 'Lee', 'Chen'][j % 5]} ${['Wei Ming', 'Kar Wai', 'Jun Hao', 'Zhi Wei', 'Ming Xuan'][j % 5]}` :
          `${['Lim', 'Tan', 'Wong', 'Lee', 'Chen'][j % 5]} ${['Mei Ling', 'Siew Choo', 'Li Ying', 'Xin Yi', 'Hui Min'][j % 5]}`;
      } else if (kodkaum === 'I') {
        name = gender === 'L' ? 
          `${['Raj Kumar', 'Suresh', 'Raman', 'Kumar', 'Devi'][j % 5]} A/L ${['Suresh', 'Kumar', 'Raman', 'Raj', 'Devi'][j % 5]}` :
          `${['Priya', 'Kavitha', 'Deepa', 'Sita', 'Meera'][j % 5]} A/P ${['Raman', 'Kumar', 'Raj', 'Suresh', 'Devi'][j % 5]}`;
      } else {
        name = gender === 'L' ? 
          `${['John', 'David', 'Michael', 'James', 'Robert'][j % 5]} ${['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson'][j % 5]}` :
          `${['Mary', 'Sarah', 'Lisa', 'Jennifer', 'Michelle'][j % 5]} ${['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson'][j % 5]}`;
      }
      
      students.push({
        id: studentId,
        name: name,
        ic_number: `05${String(schoolId).padStart(2, '0')}${String(j).padStart(2, '0')}567890`,
        school_id: schoolId,
        form_level: j <= 22 ? 4 : 5,
        class_name: j <= 11 ? '4 Bestari' : j <= 22 ? '4 Cemerlang' : j <= 33 ? '5 Bestari' : '5 Cemerlang',
        kodkaum: kodkaum,
        jantina: gender,
        phone: `012-${String(studentId).padStart(7, '0')}`,
        parent_phone: `019-${String(studentId + 1000000).padStart(7, '0')}`,
        address: `Alamat Murid ${studentId}`,
        is_target_student: true
      });
      studentId++;
    }
  }
  
  // Write to CSV files
  const schoolsCsv = [
    'id,name,code,ppd_id,address,phone,email,principal_name,target_students',
    ...schools.map(s => `${s.id},"${s.name}",${s.code},${s.ppd_id},"${s.address}",${s.phone},${s.email},"${s.principal_name}",${s.target_students}`)
  ].join('\n');
  
  const studentsCsv = [
    'id,name,ic_number,school_id,form_level,class_name,kodkaum,jantina,phone,parent_phone,address,is_target_student',
    ...students.map(s => `${s.id},"${s.name}",${s.ic_number},${s.school_id},${s.form_level},"${s.class_name}",${s.kodkaum},${s.jantina},${s.phone},${s.parent_phone},"${s.address}",${s.is_target_student}`)
  ].join('\n');
  
  fs.writeFileSync(path.join(dataDir, 'schools_sample.csv'), schoolsCsv);
  fs.writeFileSync(path.join(dataDir, 'students_sample.csv'), studentsCsv);
  
  console.log('✅ Sample data generated:');
  console.log(`   - ${dataDir}/schools_sample.csv (${schools.length} schools)`);
  console.log(`   - ${dataDir}/students_sample.csv (${students.length} students)`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--generate') || args.includes('-g')) {
    generateSampleData();
    return;
  }
  
  const schoolsFile = args[0] || 'data/schools.xlsx';
  const studentsFile = args[1] || 'data/students.xlsx';
  
  if (!fs.existsSync(schoolsFile)) {
    console.error(`❌ Schools file not found: ${schoolsFile}`);
    console.log('💡 Usage: node scripts/validate-relationship.js <schools_file> <students_file>');
    console.log('💡 Or generate sample: node scripts/validate-relationship.js --generate');
    return;
  }
  
  if (!fs.existsSync(studentsFile)) {
    console.error(`❌ Students file not found: ${studentsFile}`);
    console.log('💡 Usage: node scripts/validate-relationship.js <schools_file> <students_file>');
    return;
  }
  
  const result = validateRelationship(schoolsFile, studentsFile);
  
  if (!result.valid) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateRelationship, generateSampleData };