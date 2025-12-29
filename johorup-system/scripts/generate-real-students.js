// Generate students data berdasarkan sekolah sebenar
// Run: node scripts/generate-real-students.js

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Realistic Malaysian names by race and gender
const names = {
  M: {
    L: [
      'Ahmad Bin Abdullah', 'Muhammad Bin Hassan', 'Mohd Farid Bin Omar', 'Ahmad Zaki Bin Rahman', 'Mohd Hafiz Bin Ali',
      'Muhammad Hakim Bin Yusof', 'Ahmad Firdaus Bin Ibrahim', 'Mohd Fikri Bin Ismail', 'Muhammad Azim Bin Mahmud',
      'Ahmad Syafiq Bin Razak', 'Mohd Arif Bin Hashim', 'Muhammad Irfan Bin Kassim', 'Ahmad Danial Bin Salleh',
      'Mohd Aiman Bin Daud', 'Muhammad Aidil Bin Jamil', 'Ahmad Haziq Bin Karim', 'Mohd Azlan Bin Nasir',
      'Muhammad Haikal Bin Rosli', 'Ahmad Izzat Bin Wahab', 'Mohd Ridhwan Bin Zainal', 'Muhammad Luqman Bin Aziz',
      'Ahmad Nazri Bin Hamid', 'Mohd Syahir Bin Latif', 'Muhammad Akmal Bin Ghani', 'Ahmad Zulkifli Bin Mansor',
      'Mohd Faizal Bin Ahmad', 'Muhammad Amin Bin Hassan', 'Ahmad Fauzi Bin Omar', 'Mohd Azri Bin Rahman'
    ],
    P: [
      'Siti Nurhaliza Binti Hassan', 'Nurul Ain Binti Ahmad', 'Siti Aishah Binti Omar', 'Nurul Fatimah Binti Rahman',
      'Siti Zarina Binti Ali', 'Nurul Hidayah Binti Yusof', 'Siti Mariam Binti Ibrahim', 'Nurul Izzah Binti Ismail',
      'Siti Hajar Binti Mahmud', 'Nurul Syafiqah Binti Razak', 'Siti Nadia Binti Hashim', 'Nurul Amirah Binti Kassim',
      'Siti Farah Binti Salleh', 'Nurul Huda Binti Daud', 'Siti Khadijah Binti Jamil', 'Nurul Nabila Binti Karim',
      'Siti Rohani Binti Nasir', 'Nurul Aina Binti Rosli', 'Siti Salina Binti Wahab', 'Nurul Atikah Binti Zainal',
      'Siti Noraini Binti Aziz', 'Nurul Farhana Binti Hamid', 'Siti Rozita Binti Latif', 'Nurul Shahira Binti Ghani',
      'Siti Aminah Binti Mansor', 'Nurul Aisyah Binti Ahmad', 'Siti Fatimah Binti Hassan', 'Nurul Syazana Binti Omar'
    ]
  },
  C: {
    L: [
      'Lim Wei Ming', 'Tan Jun Hao', 'Wong Kar Wai', 'Lee Zhi Wei', 'Chen Ming Xuan', 'Ng Wei Jie', 'Ong Jun Ming',
      'Teo Kai Yang', 'Goh Wei Lun', 'Yap Jun Kiat', 'Chong Wei Bin', 'Sim Jun Wei', 'Low Kai Xin', 'Koh Wei Yang',
      'Ooi Jun Heng', 'Chin Wei Kang', 'Khoo Jun Yao', 'Beh Wei Qiang', 'Yeoh Jun Kai', 'Foo Wei Jian', 'Heng Jun Yu',
      'Saw Wei Loong', 'Chew Jun Xiong', 'Gan Wei Hao', 'Pang Jun Sheng', 'Lau Wei Bin', 'Chua Jun Ming', 'Chia Wei Lun'
    ],
    P: [
      'Tan Mei Ling', 'Lim Siew Choo', 'Wong Li Ying', 'Lee Xin Yi', 'Chen Hui Min', 'Ng Pei Shan', 'Ong Mei Yee',
      'Teo Li Xuan', 'Goh Hui Ling', 'Yap Mei Fong', 'Chong Li Wen', 'Sim Pei Yee', 'Low Xin Ru', 'Koh Li Ning',
      'Ooi Mei Qi', 'Chin Pei Lin', 'Khoo Li Yan', 'Beh Mei Xuan', 'Yeoh Xin Ying', 'Foo Li Hui', 'Heng Mei Chen',
      'Saw Pei Qi', 'Chew Li Fang', 'Gan Mei Yun', 'Pang Xin Wei', 'Lau Pei Shan', 'Chua Li Ying', 'Chia Mei Ling'
    ]
  },
  I: {
    L: [
      'Raj Kumar A/L Suresh', 'Raman A/L Kumar', 'Suresh A/L Raj', 'Kumar A/L Raman', 'Devi A/L Suresh',
      'Krishnan A/L Kumar', 'Murugan A/L Raj', 'Selvam A/L Raman', 'Ganesh A/L Suresh', 'Prakash A/L Kumar',
      'Sanjay A/L Raj', 'Vijay A/L Raman', 'Ashwin A/L Suresh', 'Deepak A/L Kumar', 'Kiran A/L Raj',
      'Mohan A/L Raman', 'Arjun A/L Suresh', 'Rohit A/L Kumar', 'Arun A/L Raj', 'Vinod A/L Raman',
      'Naveen A/L Suresh', 'Ramesh A/L Kumar', 'Dinesh A/L Raj', 'Mahesh A/L Raman', 'Rajesh A/L Suresh'
    ],
    P: [
      'Priya A/P Raman', 'Kavitha A/P Kumar', 'Deepa A/P Raj', 'Sita A/P Suresh', 'Meera A/P Raman',
      'Lakshmi A/P Kumar', 'Devi A/P Raj', 'Kamala A/P Suresh', 'Radha A/P Raman', 'Geetha A/P Kumar',
      'Shanti A/P Raj', 'Prema A/P Suresh', 'Vani A/P Raman', 'Sushma A/P Kumar', 'Nisha A/P Raj',
      'Rekha A/P Suresh', 'Sangeetha A/P Raman', 'Divya A/P Kumar', 'Pooja A/P Raj', 'Anita A/P Suresh',
      'Sunita A/P Raman', 'Malini A/P Kumar', 'Sudha A/P Raj', 'Usha A/P Suresh', 'Vidya A/P Raman'
    ]
  },
  L: {
    L: [
      'John Smith', 'David Johnson', 'Michael Brown', 'James Davis', 'Robert Wilson', 'William Miller', 'Richard Moore',
      'Joseph Taylor', 'Thomas Anderson', 'Christopher Thomas', 'Charles Jackson', 'Daniel White', 'Matthew Harris',
      'Anthony Martin', 'Mark Thompson', 'Donald Garcia', 'Steven Martinez', 'Paul Robinson', 'Andrew Clark',
      'Joshua Rodriguez', 'Kenneth Lewis', 'Kevin Lee', 'Brian Walker', 'George Hall', 'Edward Allen'
    ],
    P: [
      'Mary Smith', 'Patricia Johnson', 'Jennifer Brown', 'Linda Davis', 'Elizabeth Wilson', 'Barbara Miller',
      'Susan Moore', 'Jessica Taylor', 'Sarah Anderson', 'Karen Thomas', 'Nancy Jackson', 'Lisa White',
      'Betty Harris', 'Helen Martin', 'Sandra Thompson', 'Donna Garcia', 'Carol Martinez', 'Ruth Robinson',
      'Sharon Clark', 'Michelle Rodriguez', 'Laura Lewis', 'Sarah Lee', 'Kimberly Walker', 'Deborah Hall',
      'Dorothy Allen'
    ]
  }
};

// Generate students based on real schools data
function generateRealStudents() {
  console.log('👨‍🎓 Generating students for real schools...');
  
  // Read real schools data
  const schoolsWorkbook = XLSX.readFile('data/schools.xlsx');
  const schoolsSheet = schoolsWorkbook.Sheets['Schools'];
  const schools = XLSX.utils.sheet_to_json(schoolsSheet);
  
  console.log(`📚 Found ${schools.length} real schools`);
  
  const students = [];
  let studentId = 1;
  
  // Demographic distribution pattern (exact 60% M, 20% C, 10% I, 10% L)
  const racePattern = [];
  for (let i = 0; i < 40; i++) {
    if (i < 24) racePattern.push('M');      // 24/40 = 60%
    else if (i < 32) racePattern.push('C'); // 8/40 = 20%
    else if (i < 36) racePattern.push('I'); // 4/40 = 10%
    else racePattern.push('L');             // 4/40 = 10%
  }
  
  schools.forEach(school => {
    const targetStudents = school.target_students || 40;
    console.log(`   Generating ${targetStudents} students for ${school.name}`);
    
    for (let j = 1; j <= targetStudents; j++) {
      const kodkaum = racePattern[j - 1];
      const jantina = j % 2 === 1 ? 'L' : 'P';
      
      // Get random name based on race and gender
      const nameList = names[kodkaum][jantina];
      const nameIndex = (j - 1) % nameList.length;
      const name = nameList[nameIndex];
      
      // Generate IC number: 05 + birth_year + school_id + student_number
      const birthYear = j <= 20 ? '05' : '04'; // Form 4 born in 2005, Form 5 born in 2004
      const icNumber = `${birthYear}${String(school.id).padStart(2, '0')}${String(j).padStart(2, '0')}567890`;
      
      // Form and class assignment
      const formLevel = j <= 20 ? 4 : 5;
      let className;
      if (formLevel === 4) {
        className = j <= 10 ? '4 Bestari' : '4 Cemerlang';
      } else {
        className = j <= 30 ? '5 Bestari' : '5 Cemerlang';
      }
      
      students.push({
        id: studentId,
        name: name,
        ic_number: icNumber,
        school_id: school.id,
        form_level: formLevel,
        class_name: className,
        kodkaum: kodkaum,
        jantina: jantina,
        is_target_student: true
      });
      
      studentId++;
    }
  });
  
  return students;
}

// Generate teachers for real schools
function generateRealTeachers() {
  console.log('👩‍🏫 Generating teachers for real schools...');
  
  // Read real schools data
  const schoolsWorkbook = XLSX.readFile('data/schools.xlsx');
  const schoolsSheet = schoolsWorkbook.Sheets['Schools'];
  const schools = XLSX.utils.sheet_to_json(schoolsSheet);
  
  const teachers = [];
  let teacherId = 1;
  
  const teacherNames = {
    M: {
      L: ['Cikgu Ahmad Bin Hassan', 'Cikgu Mohd Farid Bin Omar', 'Cikgu Muhammad Hakim Bin Ali'],
      P: ['Cikgu Siti Aminah Binti Ahmad', 'Cikgu Nurul Ain Binti Hassan', 'Cikgu Siti Zarina Binti Omar']
    },
    C: {
      L: ['Cikgu Lim Wei Ming', 'Cikgu Tan Jun Hao'],
      P: ['Cikgu Wong Li Ying', 'Cikgu Lee Xin Yi']
    },
    I: {
      L: ['Cikgu Raj Kumar'],
      P: ['Cikgu Priya Devi']
    }
  };
  
  const subjects = [1, 2, 3]; // BM, Sejarah, Matematik
  const positions = ['Guru Bahasa Melayu', 'Guru Sejarah', 'Guru Matematik'];
  
  schools.forEach(school => {
    for (let j = 0; j < 6; j++) {
      const subjectId = (j % 3) + 1;
      const race = j < 4 ? 'M' : j < 5 ? 'C' : 'I';
      const gender = j % 2 === 0 ? 'L' : 'P';
      
      const nameList = teacherNames[race][gender];
      const name = nameList[j % nameList.length];
      
      teachers.push({
        id: teacherId,
        name: name,
        email: `${name.toLowerCase().replace(/cikgu\\s+/g, '').replace(/\\s+/g, '.')}${school.id}@moe-dl.edu.my`,
        phone: `019-${String(teacherId + 3000000).padStart(7, '0')}`,
        school_id: school.id,
        subject_id: subjectId,
        position: positions[subjectId - 1],
        experience_years: Math.floor(Math.random() * 15) + 3
      });
      
      teacherId++;
    }
  });
  
  return teachers;
}

// Generate users for real schools
function generateRealUsers() {
  console.log('👤 Generating users for real schools...');
  
  // Read real schools data
  const schoolsWorkbook = XLSX.readFile('data/schools.xlsx');
  const schoolsSheet = schoolsWorkbook.Sheets['Schools'];
  const schools = XLSX.utils.sheet_to_json(schoolsSheet);
  
  const users = [];
  
  // Admin users
  users.push(
    { id: 1, email: 'admin@jpnj.gov.my', name: 'Admin JPNJ', role: 'sektor_perancangan', school_id: null, ppd_id: null, password: 'AdminPass123!' },
    { id: 2, email: 'koordinator@jpnj.gov.my', name: 'Koordinator Program', role: 'sektor_perancangan', school_id: null, ppd_id: null, password: 'AdminPass123!' }
  );
  
  // PPD users (based on unique PPD IDs from schools)
  const uniquePPDs = [...new Set(schools.map(s => s.ppd_id))];
  uniquePPDs.forEach((ppdId, index) => {
    users.push({
      id: 3 + index,
      email: `ppd.${ppdId.toLowerCase()}@moe.gov.my`,
      name: `PPD ${ppdId}`,
      role: 'ppd',
      school_id: null,
      ppd_id: ppdId,
      password: 'AdminPass123!'
    });
  });
  
  // Yayasan JCorp
  users.push({
    id: 3 + uniquePPDs.length,
    email: 'yayasan@jcorp.com.my',
    name: 'Yayasan JCorp',
    role: 'yayasan_jcorp',
    school_id: null,
    ppd_id: null,
    password: 'AdminPass123!'
  });
  
  // School users (first 5 schools as samples)
  for (let i = 0; i < Math.min(5, schools.length); i++) {
    const school = schools[i];
    users.push({
      id: 4 + uniquePPDs.length + i,
      email: school.email,
      name: school.name,
      role: 'school',
      school_id: school.id,
      ppd_id: null,
      password: 'AdminPass123!'
    });
  }
  
  return users;
}

// Main function
function main() {
  console.log('🏗️ JohorUP Real Data Generator');
  console.log('==============================');
  
  try {
    // Generate data
    const students = generateRealStudents();
    const teachers = generateRealTeachers();
    const users = generateRealUsers();
    
    console.log(`\\n✅ Generated data:`);
    console.log(`   - ${students.length} students`);
    console.log(`   - ${teachers.length} teachers`);
    console.log(`   - ${users.length} users`);
    
    // Create workbooks
    const studentsWB = XLSX.utils.book_new();
    const teachersWB = XLSX.utils.book_new();
    const usersWB = XLSX.utils.book_new();
    
    // Create worksheets
    const studentsWS = XLSX.utils.json_to_sheet(students);
    const teachersWS = XLSX.utils.json_to_sheet(teachers);
    const usersWS = XLSX.utils.json_to_sheet(users);
    
    // Add worksheets to workbooks
    XLSX.utils.book_append_sheet(studentsWB, studentsWS, 'Students');
    XLSX.utils.book_append_sheet(teachersWB, teachersWS, 'Teachers');
    XLSX.utils.book_append_sheet(usersWB, usersWS, 'Users');
    
    // Write Excel files
    const studentsFile = 'data/students_real.xlsx';
    const teachersFile = 'data/teachers_real.xlsx';
    const usersFile = 'data/users_real.xlsx';
    
    XLSX.writeFile(studentsWB, studentsFile);
    XLSX.writeFile(teachersWB, teachersFile);
    XLSX.writeFile(usersWB, usersFile);
    
    console.log('\\n📁 Excel files created:');
    console.log(`   - ${studentsFile}`);
    console.log(`   - ${teachersFile}`);
    console.log(`   - ${usersFile}`);
    
    // Generate demographic summary
    const demographics = {};
    students.forEach(student => {
      const key = `${student.kodkaum}_${student.jantina}`;
      demographics[key] = (demographics[key] || 0) + 1;
    });
    
    console.log('\\n📊 Student Demographics:');
    console.log(`   Melayu Lelaki: ${demographics.M_L || 0} (${((demographics.M_L || 0) / students.length * 100).toFixed(1)}%)`);
    console.log(`   Melayu Perempuan: ${demographics.M_P || 0} (${((demographics.M_P || 0) / students.length * 100).toFixed(1)}%)`);
    console.log(`   Cina Lelaki: ${demographics.C_L || 0} (${((demographics.C_L || 0) / students.length * 100).toFixed(1)}%)`);
    console.log(`   Cina Perempuan: ${demographics.C_P || 0} (${((demographics.C_P || 0) / students.length * 100).toFixed(1)}%)`);
    console.log(`   India Lelaki: ${demographics.I_L || 0} (${((demographics.I_L || 0) / students.length * 100).toFixed(1)}%)`);
    console.log(`   India Perempuan: ${demographics.I_P || 0} (${((demographics.I_P || 0) / students.length * 100).toFixed(1)}%)`);
    console.log(`   Lain-lain Lelaki: ${demographics.L_L || 0} (${((demographics.L_L || 0) / students.length * 100).toFixed(1)}%)`);
    console.log(`   Lain-lain Perempuan: ${demographics.L_P || 0} (${((demographics.L_P || 0) / students.length * 100).toFixed(1)}%)`);
    
    console.log('\\n🎉 Real data generation completed successfully!');
    console.log('\\n📋 Next steps:');
    console.log('1. Copy files: copy data\\\\students_real.xlsx data\\\\students.xlsx');
    console.log('2. Copy files: copy data\\\\teachers_real.xlsx data\\\\teachers.xlsx');
    console.log('3. Copy files: copy data\\\\users_real.xlsx data\\\\users.xlsx');
    console.log('4. Validate: node scripts/validate-relationship.js data/schools.xlsx data/students.xlsx');
    
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateRealStudents, generateRealTeachers, generateRealUsers };