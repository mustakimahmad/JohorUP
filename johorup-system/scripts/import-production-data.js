#!/usr/bin/env node

/**
 * JohorUP System - Production Data Import Script
 * 
 * This script imports initial data for production deployment:
 * - Users (administrators, coordinators, schools, PPD)
 * - Schools and PPD data
 * - Teachers
 * - Initial programs
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');

// Mock database - replace with actual database connection
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// Configuration
const DATA_DIR = path.join(__dirname, '../data');
const SALT_ROUNDS = 12;

// Utility functions
const log = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};

const error = (message) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
    process.exit(1);
};

// Hash password function
const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// Read CSV file
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        
        if (!fs.existsSync(filePath)) {
            reject(new Error(`File not found: ${filePath}`));
            return;
        }
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
};

// Import PPD data
const importPPDs = async () => {
    log('Importing PPD data...');
    
    const ppds = [
        { id: 1, name: 'PPD Johor Bahru', code: 'JB' },
        { id: 2, name: 'PPD Muar', code: 'MR' },
        { id: 3, name: 'PPD Batu Pahat', code: 'BP' }
    ];
    
    for (const ppd of ppds) {
        // Replace with actual database insert
        log(`  - Creating PPD: ${ppd.name}`);
        // await prisma.ppd.create({ data: ppd });
    }
    
    log(`Imported ${ppds.length} PPDs`);
    return ppds;
};

// Import subjects
const importSubjects = async () => {
    log('Importing subjects...');
    
    const subjects = [
        { id: 1, name: 'Bahasa Melayu', code: 'BM' },
        { id: 2, name: 'Sejarah', code: 'SEJ' },
        { id: 3, name: 'Matematik', code: 'MAT' },
        { id: 4, name: 'Sains', code: 'SN' },
        { id: 5, name: 'Bahasa Inggeris', code: 'BI' }
    ];
    
    for (const subject of subjects) {
        log(`  - Creating subject: ${subject.name}`);
        // await prisma.subject.create({ data: subject });
    }
    
    log(`Imported ${subjects.length} subjects`);
    return subjects;
};

// Import schools
const importSchools = async () => {
    log('Importing schools...');
    
    const schoolsFile = path.join(DATA_DIR, 'schools.csv');
    
    // Create sample schools data if file doesn't exist
    if (!fs.existsSync(schoolsFile)) {
        log('Creating sample schools.csv file...');
        
        const sampleSchools = [
            'id,name,code,ppd_id,target_students',
            '1,SMK Taman Johor Jaya,SMKTJJ,1,44',
            '2,SMK Bandar Baru UDA,SMKBBUDA,1,44',
            '3,SMK Taman Universiti,SMKTU,1,44',
            '4,SMK Skudai,SMKSKUDAI,1,44',
            '5,SMK Kulai,SMKKULAI,1,44',
            '6,SMK Senai,SMKSENAI,1,44',
            '7,SMK Gelang Patah,SMKGP,1,44',
            '8,SMK Nusajaya,SMKNUSAJAYA,1,44',
            '9,SMK Muar,SMKMUAR,2,44',
            '10,SMK Tangkak,SMKTANGKAK,2,44',
            '11,SMK Segamat,SMKSEGAMAT,2,44',
            '12,SMK Pagoh,SMKPAGOH,2,44',
            '13,SMK Bukit Gambir,SMKBG,2,44',
            '14,SMK Ledang,SMKLEDANG,2,44',
            '15,SMK Batu Pahat,SMKBP,3,44',
            '16,SMK Yong Peng,SMKYP,3,44',
            '17,SMK Ayer Hitam,SMKAH,3,44',
            '18,SMK Senggarang,SMKSENGGARANG,3,44',
            '19,SMK Rengit,SMKRENGIT,3,44',
            '20,SMK Parit Raja,SMKPR,3,44'
        ].join('\n');
        
        fs.writeFileSync(schoolsFile, sampleSchools);
    }
    
    const schools = await readCSV(schoolsFile);
    
    for (const school of schools) {
        log(`  - Creating school: ${school.name}`);
        // await prisma.school.create({
        //     data: {
        //         id: parseInt(school.id),
        //         name: school.name,
        //         code: school.code,
        //         ppd_id: parseInt(school.ppd_id),
        //         target_students: parseInt(school.target_students)
        //     }
        // });
    }
    
    log(`Imported ${schools.length} schools`);
    return schools;
};

// Import users
const importUsers = async () => {
    log('Importing users...');
    
    const usersFile = path.join(DATA_DIR, 'users.csv');
    
    // Create sample users data if file doesn't exist
    if (!fs.existsSync(usersFile)) {
        log('Creating sample users.csv file...');
        
        const sampleUsers = [
            'email,name,role,school_id,ppd_id,password',
            'admin@jpnj.gov.my,System Administrator,sektor_perancangan,,,AdminPass123!',
            'koordinator@jpnj.gov.my,Koordinator Program,sektor_perancangan,,,KoordinatorPass123!',
            'pembelajaran@jpnj.gov.my,Pegawai Pembelajaran,sektor_pembelajaran,,,PembelajaranPass123!',
            'ppd.jb@jpnj.gov.my,Pegawai PPD JB,ppd,,1,PPDJBPass123!',
            'ppd.muar@jpnj.gov.my,Pegawai PPD Muar,ppd,,2,PPDMuarPass123!',
            'ppd.bp@jpnj.gov.my,Pegawai PPD Batu Pahat,ppd,,3,PPDBPPass123!',
            'yayasan@jcorp.com.my,Pegawai Yayasan JCorp,yayasan_jcorp,,,YayasanPass123!',
            // Add school users (1-20)
            ...Array.from({length: 20}, (_, i) => {
                const schoolId = i + 1;
                return `sekolah${schoolId}@jpnj.gov.my,Pentadbir SMK ${schoolId},school,${schoolId},,SekolahPass123!`;
            })
        ].join('\n');
        
        fs.writeFileSync(usersFile, sampleUsers);
    }
    
    const users = await readCSV(usersFile);
    
    for (const user of users) {
        const hashedPassword = await hashPassword(user.password);
        
        log(`  - Creating user: ${user.email} (${user.role})`);
        
        // await prisma.user.create({
        //     data: {
        //         email: user.email,
        //         name: user.name,
        //         role: user.role,
        //         password: hashedPassword,
        //         school_id: user.school_id ? parseInt(user.school_id) : null,
        //         ppd_id: user.ppd_id ? parseInt(user.ppd_id) : null
        //     }
        // });
    }
    
    log(`Imported ${users.length} users`);
    return users;
};

// Import teachers
const importTeachers = async () => {
    log('Importing teachers...');
    
    const teachersFile = path.join(DATA_DIR, 'teachers.csv');
    
    // Create sample teachers data if file doesn't exist
    if (!fs.existsSync(teachersFile)) {
        log('Creating sample teachers.csv file...');
        
        const sampleTeachers = ['name,ic_number,school_id,subject_id,email,phone,years_experience,qualification'];
        
        // Generate 6 teachers per school (120 total)
        for (let schoolId = 1; schoolId <= 20; schoolId++) {
            for (let teacherNum = 1; teacherNum <= 6; teacherNum++) {
                const subjectId = ((teacherNum - 1) % 5) + 1; // Rotate through 5 subjects
                const teacher = [
                    `Guru ${teacherNum} Sekolah ${schoolId}`,
                    `${String(schoolId).padStart(2, '0')}${String(teacherNum).padStart(2, '0')}${Math.floor(Math.random() * 900000) + 100000}`,
                    schoolId,
                    subjectId,
                    `guru${teacherNum}.sekolah${schoolId}@jpnj.gov.my`,
                    `01${Math.floor(Math.random() * 90000000) + 10000000}`,
                    Math.floor(Math.random() * 20) + 5, // 5-25 years experience
                    Math.random() > 0.5 ? 'Sarjana Pendidikan' : 'Ijazah Sarjana Muda'
                ].join(',');
                
                sampleTeachers.push(teacher);
            }
        }
        
        fs.writeFileSync(teachersFile, sampleTeachers.join('\n'));
    }
    
    const teachers = await readCSV(teachersFile);
    
    for (const teacher of teachers) {
        log(`  - Creating teacher: ${teacher.name} at School ${teacher.school_id}`);
        
        // await prisma.teacher.create({
        //     data: {
        //         name: teacher.name,
        //         ic_number: teacher.ic_number,
        //         school_id: parseInt(teacher.school_id),
        //         subject_id: parseInt(teacher.subject_id),
        //         email: teacher.email,
        //         phone: teacher.phone,
        //         years_experience: parseInt(teacher.years_experience),
        //         qualification: teacher.qualification
        //     }
        // });
    }
    
    log(`Imported ${teachers.length} teachers`);
    return teachers;
};

// Import students
const importStudents = async () => {
    log('Importing students...');
    
    const studentsFile = path.join(DATA_DIR, 'students.csv');
    
    // Create sample students data if file doesn't exist
    if (!fs.existsSync(studentsFile)) {
        log('Creating sample students.csv file...');
        
        const sampleStudents = ['name,ic_number,school_id,class'];
        
        // Generate 44 students per school (880 total)
        for (let schoolId = 1; schoolId <= 20; schoolId++) {
            for (let studentNum = 1; studentNum <= 44; studentNum++) {
                const classNum = Math.ceil(studentNum / 11); // 4 classes, ~11 students each
                const student = [
                    `Murid ${studentNum} Sekolah ${schoolId}`,
                    `${String(schoolId).padStart(2, '0')}${String(studentNum).padStart(2, '0')}${Math.floor(Math.random() * 900000) + 100000}`,
                    schoolId,
                    `4 Bestari ${classNum}`
                ].join(',');
                
                sampleStudents.push(student);
            }
        }
        
        fs.writeFileSync(studentsFile, sampleStudents.join('\n'));
    }
    
    const students = await readCSV(studentsFile);
    
    for (const student of students) {
        // await prisma.student.create({
        //     data: {
        //         name: student.name,
        //         ic_number: student.ic_number,
        //         school_id: parseInt(student.school_id),
        //         class: student.class
        //     }
        // });
    }
    
    log(`Imported ${students.length} students`);
    return students;
};

// Import initial programs
const importPrograms = async () => {
    log('Importing initial programs...');
    
    const programs = [
        {
            title: 'Program Tuisyen Intensif SPM 2026',
            description: 'Program tuisyen intensif untuk meningkatkan prestasi SPM 2026',
            program_type: 'tuition',
            target_subject_id: 1, // Bahasa Melayu
            start_date: '2026-01-15',
            end_date: '2026-10-30',
            created_by: 1, // Admin user
            target_students: 880
        },
        {
            title: 'Program Kecemerlangan Matematik',
            description: 'Program khas untuk meningkatkan prestasi Matematik',
            program_type: 'excellence',
            target_subject_id: 3, // Matematik
            start_date: '2026-02-01',
            end_date: '2026-09-30',
            created_by: 1,
            target_students: 400
        },
        {
            title: 'Program Pemantapan Sejarah',
            description: 'Program pemantapan untuk mata pelajaran Sejarah',
            program_type: 'remedial',
            target_subject_id: 2, // Sejarah
            start_date: '2026-03-01',
            end_date: '2026-08-31',
            created_by: 1,
            target_students: 300
        }
    ];
    
    for (const program of programs) {
        log(`  - Creating program: ${program.title}`);
        // await prisma.program.create({ data: program });
    }
    
    log(`Imported ${programs.length} programs`);
    return programs;
};

// Main import function
const main = async () => {
    try {
        log('=== Starting JohorUP Production Data Import ===');
        
        // Create data directory if it doesn't exist
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        
        // Import data in order (due to foreign key constraints)
        await importPPDs();
        await importSubjects();
        await importSchools();
        await importUsers();
        await importTeachers();
        await importStudents();
        await importPrograms();
        
        log('=== Data import completed successfully! ===');
        log('');
        log('Next steps:');
        log('1. Review the generated CSV files in the data/ directory');
        log('2. Modify the data as needed for your specific requirements');
        log('3. Uncomment the database operations in this script');
        log('4. Run the script again to import into your production database');
        log('');
        log('Sample login credentials:');
        log('- Admin: admin@jpnj.gov.my / AdminPass123!');
        log('- Koordinator: koordinator@jpnj.gov.my / KoordinatorPass123!');
        log('- School 1: sekolah1@jpnj.gov.my / SekolahPass123!');
        
    } catch (err) {
        error(`Import failed: ${err.message}`);
    }
};

// Run the import
if (require.main === module) {
    main();
}

module.exports = {
    importPPDs,
    importSubjects,
    importSchools,
    importUsers,
    importTeachers,
    importStudents,
    importPrograms
};