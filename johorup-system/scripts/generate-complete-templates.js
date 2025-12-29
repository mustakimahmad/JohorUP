// Generate complete Excel templates untuk JohorUP System
// Run: node scripts/generate-complete-templates.js

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
      'Ahmad Nazri Bin Hamid', 'Mohd Syahir Bin Latif', 'Muhammad Akmal Bin Ghani', 'Ahmad Zulkifli Bin Mansor'
    ],
    P: [
      'Siti Nurhaliza Binti Hassan', 'Nurul Ain Binti Ahmad', 'Siti Aishah Binti Omar', 'Nurul Fatimah Binti Rahman',
      'Siti Zarina Binti Ali', 'Nurul Hidayah Binti Yusof', 'Siti Mariam Binti Ibrahim', 'Nurul Izzah Binti Ismail',
      'Siti Hajar Binti Mahmud', 'Nurul Syafiqah Binti Razak', 'Siti Nadia Binti Hashim', 'Nurul Amirah Binti Kassim',
      'Siti Farah Binti Salleh', 'Nurul Huda Binti Daud', 'Siti Khadijah Binti Jamil', 'Nurul Nabila Binti Karim',
      'Siti Rohani Binti Nasir', 'Nurul Aina Binti Rosli', 'Siti Salina Binti Wahab', 'Nurul Atikah Binti Zainal',
      'Siti Noraini Binti Aziz', 'Nurul Farhana Binti Hamid', 'Siti Rozita Binti Latif', 'Nurul Shahira Binti Ghani',
      'Siti Aminah Binti Mansor'
    ]
  },
  C: {
    L: [
      'Lim Wei Ming', 'Tan Jun Hao', 'Wong Kar Wai', 'Lee Zhi Wei', 'Chen Ming Xuan', 'Ng Wei Jie', 'Ong Jun Ming',
      'Teo Kai Yang', 'Goh Wei Lun', 'Yap Jun Kiat', 'Chong Wei Bin', 'Sim Jun Wei', 'Low Kai Xin', 'Koh Wei Yang',
      'Ooi Jun Heng', 'Chin Wei Kang', 'Khoo Jun Yao', 'Beh Wei Qiang', 'Yeoh Jun Kai', 'Foo Wei Jian', 'Heng Jun Yu',
      'Saw Wei Loong', 'Chew Jun Xiong', 'Gan Wei Hao', 'Pang Jun Sheng'
    ],
    P: [
      'Tan Mei Ling', 'Lim Siew Choo', 'Wong Li Ying', 'Lee Xin Yi', 'Chen Hui Min', 'Ng Pei Shan', 'Ong Mei Yee',
      'Teo Li Xuan', 'Goh Hui Ling', 'Yap Mei Fong', 'Chong Li Wen', 'Sim Pei Yee', 'Low Xin Ru', 'Koh Li Ning',
      'Ooi Mei Qi', 'Chin Pei Lin', 'Khoo Li Yan', 'Beh Mei Xuan', 'Yeoh Xin Ying', 'Foo Li Hui', 'Heng Mei Chen',
      'Saw Pei Qi', 'Chew Li Fang', 'Gan Mei Yun', 'Pang Xin Wei'
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

// PPD data
const ppds = [
  { id: 1, name: 'PPD Johor Bahru', code: 'JB' },
  { id: 2, name: 'PPD Muar', code: 'MR' },
  { id: 3, name: 'PPD Batu Pahat', code: 'BP' }
];

// Generate realistic schools
function generateSchools() {
  const schools = [];
  
  // PPD Johor Bahru (8 schools)
  const jbSchools = [
    'SMK Taman Johor Jaya', 'SMK Bandar Baru UDA', 'SMK Taman Universiti', 'SMK Skudai',
    'SMK Kulai', 'SMK Senai', 'SMK Gelang Patah', 'SMK Nusajaya'
  ];
  
  // PPD Muar (6 schools)
  const muarSchools = [
    'SMK Muar', 'SMK Tangkak', 'SMK Segamat', 'SMK Pagoh', 'SMK Bukit Gambir', 'SMK Ledang'
  ];
  
  // PPD Batu Pahat (6 schools)
  const bpSchools = [
    'SMK Batu Pahat', 'SMK Yong Peng', 'SMK Ayer Hitam', 'SMK Senggarang', 'SMK Rengit', 'SMK Parit Raja'
  ];
  
  const allSchools = [...jbSchools, ...muarSchools, ...bpSchools];
  const areas = [
    // JB areas
    'Taman Johor Jaya, 81100 Johor Bahru', 'Bandar Baru UDA, 81200 Johor Bahru', 
    'Taman Universiti, 81300 Skudai', 'Skudai, 81300 Johor Bahru',
    'Kulai, 81000 Kulai', 'Senai, 81400 Senai', 'Gelang Patah, 81550 Gelang Patah', 
    'Nusajaya, 79150 Nusajaya',
    // Muar areas
    'Muar, 84000 Muar', 'Tangkak, 84900 Tangkak', 'Segamat, 85000 Segamat',
    'Pagoh, 84600 Pagoh', 'Bukit Gambir, 84800 Bukit Gambir', 'Ledang, 84900 Ledang',
    // BP areas
    'Batu Pahat, 83000 Batu Pahat', 'Yong Peng, 83700 Yong Peng', 'Ayer Hitam, 86100 Ayer Hitam',
    'Senggarang, 83200 Senggarang', 'Rengit, 83300 Rengit', 'Parit Raja, 86400 Parit Raja'
  ];
  
  const principals = [
    'Puan Siti Aminah Binti Ahmad', 'Encik Ahmad Rahman Bin Hassan', 'Puan Noraini Hassan Binti Omar',
    'Encik Mohd Ali Bin Yusof', 'Puan Fatimah Zahra Binti Ibrahim', 'Encik Ibrahim Ismail Bin Ahmad',
    'Puan Rozita Ahmad Binti Mahmud', 'Encik Hassan Abdullah Bin Razak', 'Puan Zainab Mohd Binti Ali',
    'Encik Roslan Yusof Bin Hassan', 'Puan Mariam Salleh Binti Omar', 'Encik Azman Hashim Bin Rahman',
    'Puan Khadijah Omar Binti Yusof', 'Encik Sulaiman Mat Bin Ahmad', 'Puan Rohani Daud Binti Hassan',
    'Encik Kamal Ariffin Bin Omar', 'Puan Norsiah Jamil Binti Ali', 'Encik Razak Mahmud Bin Yusof',
    'Puan Salina Kassim Binti Rahman', 'Encik Hafiz Rahman Bin Hassan'
  ];
  
  for (let i = 0; i < 20; i++) {
    const ppdId = i < 8 ? 1 : i < 14 ? 2 : 3;
    const code = allSchools[i].replace(/SMK\s+/, '').replace(/\s+/g, '').toUpperCase();
    
    schools.push({
      id: i + 1,
      name: allSchools[i],
      code: `SMK${code}`,
      ppd_id: ppdId,
      address: areas[i],
      phone: `07-${String(i + 1).padStart(3, '0')}1234`,
      email: `${code.toLowerCase()}@moe-dl.edu.my`,
      principal_name: principals[i],
      target_students: 44
    });
  }
  
  return schools;
}

// Generate realistic students
function generateStudents() {
  const students = [];
  let studentId = 1;
  
  // Demographic distribution pattern (exact 60% M, 20% C, 10% I, 10% L)
  const racePattern = [];
  for (let i = 0; i < 44; i++) {
    if (i < 26) racePattern.push('M');      // 26/44 = 59.1% ≈ 60%
    else if (i < 35) racePattern.push('C'); // 9/44 = 20.5% ≈ 20%
    else if (i < 40) racePattern.push('I'); // 5/44 = 11.4% ≈ 10%
    else racePattern.push('L');             // 4/44 = 9.1% ≈ 10%
  }
  
  for (let schoolId = 1; schoolId <= 20; schoolId++) {
    for (let j = 1; j <= 44; j++) {
      const kodkaum = racePattern[j - 1];
      const jantina = j % 2 === 1 ? 'L' : 'P';
      
      // Get random name based on race and gender
      const nameList = names[kodkaum][jantina];
      const name = nameList[(j - 1) % nameList.length];
      
      // Generate IC number: 05 + birth_year + school_id + student_number
      const birthYear = j <= 22 ? '05' : '04'; // Form 4 born in 2005, Form 5 born in 2004
      const icNumber = `${birthYear}${String(schoolId).padStart(2, '0')}${String(j).padStart(2, '0')}567890`;
      
      // Form and class assignment
      const formLevel = j <= 22 ? 4 : 5;
      let className;
      if (formLevel === 4) {
        className = j <= 11 ? '4 Bestari' : '4 Cemerlang';
      } else {
        className = j <= 33 ? '5 Bestari' : '5 Cemerlang';
      }
      
      // Generate phone numbers
      const phone = `012-${String(studentId).padStart(7, '0')}`;
      const parentPhone = `019-${String(studentId + 2000000).padStart(7, '0')}`;
      
      // Generate address based on school location
      const schoolAreas = [
        'Taman Johor Jaya', 'Bandar Baru UDA', 'Taman Universiti', 'Skudai', 'Kulai', 'Senai', 
        'Gelang Patah', 'Nusajaya', 'Muar', 'Tangkak', 'Segamat', 'Pagoh', 'Bukit Gambir', 
        'Ledang', 'Batu Pahat', 'Yong Peng', 'Ayer Hitam', 'Senggarang', 'Rengit', 'Parit Raja'
      ];
      
      students.push({
        id: studentId,
        name: name,
        ic_number: icNumber,
        school_id: schoolId,
        form_level: formLevel,
        class_name: className,
        kodkaum: kodkaum,
        jantina: jantina,
        phone: phone,
        parent_phone: parentPhone,
        address: schoolAreas[schoolId - 1],
        is_target_student: true
      });
      
      studentId++;
    }
  }
  
  return students;
}

// Generate teachers (6 per school = 120 total)
function generateTeachers() {
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
  
  for (let schoolId = 1; schoolId <= 20; schoolId++) {
    for (let j = 0; j < 6; j++) {
      const subjectId = (j % 3) + 1;
      const race = j < 4 ? 'M' : j < 5 ? 'C' : 'I';
      const gender = j % 2 === 0 ? 'L' : 'P';
      
      const nameList = teacherNames[race][gender];
      const name = nameList[j % nameList.length];
      
      teachers.push({
        id: teacherId,
        name: name,
        email: `${name.toLowerCase().replace(/cikgu\s+/g, '').replace(/\s+/g, '.')}${schoolId}@moe-dl.edu.my`,
        phone: `019-${String(teacherId + 3000000).padStart(7, '0')}`,
        school_id: schoolId,
        subject_id: subjectId,
        position: positions[subjectId - 1],
        experience_years: Math.floor(Math.random() * 15) + 3
      });
      
      teacherId++;
    }
  }
  
  return teachers;
}

// Generate users (login accounts)
function generateUsers() {
  const users = [];
  
  // Admin users
  users.push(
    { id: 1, email: 'admin@jpnj.gov.my', name: 'Admin JPNJ', role: 'sektor_perancangan', school_id: null, ppd_id: null, password: 'AdminPass123!' },
    { id: 2, email: 'koordinator@jpnj.gov.my', name: 'Koordinator Program', role: 'sektor_perancangan', school_id: null, ppd_id: null, password: 'AdminPass123!' }
  );
  
  // PPD users
  users.push(
    { id: 3, email: 'ppd.jb@moe.gov.my', name: 'PPD Johor Bahru', role: 'ppd', school_id: null, ppd_id: 1, password: 'AdminPass123!' },
    { id: 4, email: 'ppd.muar@moe.gov.my', name: 'PPD Muar', role: 'ppd', school_id: null, ppd_id: 2, password: 'AdminPass123!' },
    { id: 5, email: 'ppd.bp@moe.gov.my', name: 'PPD Batu Pahat', role: 'ppd', school_id: null, ppd_id: 3, password: 'AdminPass123!' }
  );
  
  // Yayasan JCorp
  users.push(
    { id: 6, email: 'yayasan@jcorp.com.my', name: 'Yayasan JCorp', role: 'yayasan_jcorp', school_id: null, ppd_id: null, password: 'AdminPass123!' }
  );
  
  // School users (sample for first 5 schools)
  const schools = generateSchools();
  for (let i = 0; i < 5; i++) {
    const school = schools[i];
    users.push({
      id: 7 + i,
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

// Create Excel files
function createExcelFiles() {
  console.log('📊 Generating complete templates...');
  
  // Create data directory
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Generate data
  const schools = generateSchools();
  const students = generateStudents();
  const teachers = generateTeachers();
  const users = generateUsers();
  
  console.log(`✅ Generated data:`);
  console.log(`   - ${schools.length} schools`);
  console.log(`   - ${students.length} students`);
  console.log(`   - ${teachers.length} teachers`);
  console.log(`   - ${users.length} users`);
  
  // Create workbooks
  const schoolsWB = XLSX.utils.book_new();
  const studentsWB = XLSX.utils.book_new();
  const teachersWB = XLSX.utils.book_new();
  const usersWB = XLSX.utils.book_new();
  
  // Create worksheets
  const schoolsWS = XLSX.utils.json_to_sheet(schools);
  const studentsWS = XLSX.utils.json_to_sheet(students);
  const teachersWS = XLSX.utils.json_to_sheet(teachers);
  const usersWS = XLSX.utils.json_to_sheet(users);
  
  // Add worksheets to workbooks
  XLSX.utils.book_append_sheet(schoolsWB, schoolsWS, 'Schools');
  XLSX.utils.book_append_sheet(studentsWB, studentsWS, 'Students');
  XLSX.utils.book_append_sheet(teachersWB, teachersWS, 'Teachers');
  XLSX.utils.book_append_sheet(usersWB, usersWS, 'Users');
  
  // Write Excel files
  const schoolsFile = path.join(dataDir, 'schools_complete.xlsx');
  const studentsFile = path.join(dataDir, 'students_complete.xlsx');
  const teachersFile = path.join(dataDir, 'teachers_complete.xlsx');
  const usersFile = path.join(dataDir, 'users_complete.xlsx');
  
  XLSX.writeFile(schoolsWB, schoolsFile);
  XLSX.writeFile(studentsWB, studentsFile);
  XLSX.writeFile(teachersWB, teachersFile);
  XLSX.writeFile(usersWB, usersFile);
  
  console.log('\n📁 Excel files created:');
  console.log(`   - ${schoolsFile}`);
  console.log(`   - ${studentsFile}`);
  console.log(`   - ${teachersFile}`);
  console.log(`   - ${usersFile}`);
  
  // Generate demographic summary
  const demographics = {};
  students.forEach(student => {
    const key = `${student.kodkaum}_${student.jantina}`;
    demographics[key] = (demographics[key] || 0) + 1;
  });
  
  console.log('\n📊 Student Demographics:');
  console.log(`   Melayu Lelaki: ${demographics.M_L || 0} (${((demographics.M_L || 0) / students.length * 100).toFixed(1)}%)`);
  console.log(`   Melayu Perempuan: ${demographics.M_P || 0} (${((demographics.M_P || 0) / students.length * 100).toFixed(1)}%)`);
  console.log(`   Cina Lelaki: ${demographics.C_L || 0} (${((demographics.C_L || 0) / students.length * 100).toFixed(1)}%)`);
  console.log(`   Cina Perempuan: ${demographics.C_P || 0} (${((demographics.C_P || 0) / students.length * 100).toFixed(1)}%)`);
  console.log(`   India Lelaki: ${demographics.I_L || 0} (${((demographics.I_L || 0) / students.length * 100).toFixed(1)}%)`);
  console.log(`   India Perempuan: ${demographics.I_P || 0} (${((demographics.I_P || 0) / students.length * 100).toFixed(1)}%)`);
  console.log(`   Lain-lain Lelaki: ${demographics.L_L || 0} (${((demographics.L_L || 0) / students.length * 100).toFixed(1)}%)`);
  console.log(`   Lain-lain Perempuan: ${demographics.L_P || 0} (${((demographics.L_P || 0) / students.length * 100).toFixed(1)}%)`);
  
  // School breakdown
  console.log('\n🏫 Schools by PPD:');
  const schoolsByPPD = {};
  schools.forEach(school => {
    const ppdName = ppds.find(p => p.id === school.ppd_id)?.name || 'Unknown';
    schoolsByPPD[ppdName] = (schoolsByPPD[ppdName] || 0) + 1;
  });
  
  Object.entries(schoolsByPPD).forEach(([ppd, count]) => {
    console.log(`   ${ppd}: ${count} schools (${count * 44} students)`);
  });
  
  return {
    schools: schoolsFile,
    students: studentsFile,
    teachers: teachersFile,
    users: usersFile
  };
}

// Main function
function main() {
  console.log('🏗️ JohorUP Complete Template Generator');
  console.log('=====================================');
  
  try {
    const files = createExcelFiles();
    
    console.log('\n🎉 Template generation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated Excel files');
    console.log('2. Modify data as needed for your schools');
    console.log('3. Validate data: node scripts/validate-relationship.js data/schools_complete.xlsx data/students_complete.xlsx');
    console.log('4. Import to database: node scripts/import-real-data.js');
    
    return files;
  } catch (error) {
    console.error('❌ Template generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { 
  generateSchools, 
  generateStudents, 
  generateTeachers, 
  generateUsers, 
  createExcelFiles 
};