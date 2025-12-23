#!/usr/bin/env node

/**
 * JohorUP System - Supabase Data Import Script
 * 
 * This script imports production data to Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';
const SALT_ROUNDS = 12;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

// Import PPDs
const importPPDs = async () => {
    log('Importing PPDs...');
    
    const ppds = [
        { id: 1, name: 'PPD Johor Bahru', code: 'JB' },
        { id: 2, name: 'PPD Muar', code: 'MR' },
        { id: 3, name: 'PPD Batu Pahat', code: 'BP' }
    ];
    
    const { data, error: insertError } = await supabase
        .from('ppds')
        .upsert(ppds, { onConflict: 'id' });
    
    if (insertError) {
        error(`Failed to import PPDs: ${insertError.message}`);
    }
    
    log(`✅ Imported ${ppds.length} PPDs`);
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
    
    const { data, error: insertError } = await supabase
        .from('subjects')
        .upsert(subjects, { onConflict: 'id' });
    
    if (insertError) {
        error(`Failed to import subjects: ${insertError.message}`);
    }
    
    log(`✅ Imported ${subjects.length} subjects`);
    return subjects;
};

// Import schools
const importSchools = async () => {
    log('Importing schools...');
    
    const schools = [
        { id: 1, name: 'SMK Taman Johor Jaya', code: 'SMKTJJ', ppd_id: 1, target_students: 44 },
        { id: 2, name: 'SMK Bandar Baru UDA', code: 'SMKBBUDA', ppd_id: 1, target_students: 44 },
        { id: 3, name: 'SMK Taman Universiti', code: 'SMKTU', ppd_id: 1, target_students: 44 },
        { id: 4, name: 'SMK Skudai', code: 'SMKSKUDAI', ppd_id: 1, target_students: 44 },
        { id: 5, name: 'SMK Kulai', code: 'SMKKULAI', ppd_id: 1, target_students: 44 },
        { id: 6, name: 'SMK Senai', code: 'SMKSENAI', ppd_id: 1, target_students: 44 },
        { id: 7, name: 'SMK Gelang Patah', code: 'SMKGP', ppd_id: 1, target_students: 44 },
        { id: 8, name: 'SMK Nusajaya', code: 'SMKNUSAJAYA', ppd_id: 1, target_students: 44 },
        { id: 9, name: 'SMK Muar', code: 'SMKMUAR', ppd_id: 2, target_students: 44 },
        { id: 10, name: 'SMK Tangkak', code: 'SMKTANGKAK', ppd_id: 2, target_students: 44 },
        { id: 11, name: 'SMK Segamat', code: 'SMKSEGAMAT', ppd_id: 2, target_students: 44 },
        { id: 12, name: 'SMK Pagoh', code: 'SMKPAGOH', ppd_id: 2, target_students: 44 },
        { id: 13, name: 'SMK Bukit Gambir', code: 'SMKBG', ppd_id: 2, target_students: 44 },
        { id: 14, name: 'SMK Ledang', code: 'SMKLEDANG', ppd_id: 2, target_students: 44 },
        { id: 15, name: 'SMK Batu Pahat', code: 'SMKBP', ppd_id: 3, target_students: 44 },
        { id: 16, name: 'SMK Yong Peng', code: 'SMKYP', ppd_id: 3, target_students: 44 },
        { id: 17, name: 'SMK Ayer Hitam', code: 'SMKAH', ppd_id: 3, target_students: 44 },
        { id: 18, name: 'SMK Senggarang', code: 'SMKSENGGARANG', ppd_id: 3, target_students: 44 },
        { id: 19, name: 'SMK Rengit', code: 'SMKRENGIT', ppd_id: 3, target_students: 44 },
        { id: 20, name: 'SMK Parit Raja', code: 'SMKPR', ppd_id: 3, target_students: 44 }
    ];
    
    const { data, error: insertError } = await supabase
        .from('schools')
        .upsert(schools, { onConflict: 'id' });
    
    if (insertError) {
        error(`Failed to import schools: ${insertError.message}`);
    }
    
    log(`✅ Imported ${schools.length} schools`);
    return schools;
};

// Import users
const importUsers = async () => {
    log('Importing users...');
    
    const users = [
        {
            id: 1,
            email: 'admin@jpnj.gov.my',
            name: 'System Administrator',
            role: 'sektor_perancangan',
            password_hash: await hashPassword('AdminPass123!'),
            school_id: null,
            ppd_id: null
        },
        {
            id: 2,
            email: 'koordinator@jpnj.gov.my',
            name: 'Koordinator Program',
            role: 'sektor_perancangan',
            password_hash: await hashPassword('KoordinatorPass123!'),
            school_id: null,
            ppd_id: null
        },
        {
            id: 3,
            email: 'pembelajaran@jpnj.gov.my',
            name: 'Pegawai Pembelajaran',
            role: 'sektor_pembelajaran',
            password_hash: await hashPassword('PembelajaranPass123!'),
            school_id: null,
            ppd_id: null
        },
        {
            id: 4,
            email: 'ppd.jb@jpnj.gov.my',
            name: 'Pegawai PPD JB',
            role: 'ppd',
            password_hash: await hashPassword('PPDJBPass123!'),
            school_id: null,
            ppd_id: 1
        },
        {
            id: 5,
            email: 'ppd.muar@jpnj.gov.my',
            name: 'Pegawai PPD Muar',
            role: 'ppd',
            password_hash: await hashPassword('PPDMuarPass123!'),
            school_id: null,
            ppd_id: 2
        },
        {
            id: 6,
            email: 'ppd.bp@jpnj.gov.my',
            name: 'Pegawai PPD Batu Pahat',
            role: 'ppd',
            password_hash: await hashPassword('PPDBPPass123!'),
            school_id: null,
            ppd_id: 3
        },
        {
            id: 7,
            email: 'yayasan@jcorp.com.my',
            name: 'Pegawai Yayasan JCorp',
            role: 'yayasan_jcorp',
            password_hash: await hashPassword('YayasanPass123!'),
            school_id: null,
            ppd_id: null
        }
    ];
    
    // Add school users (8-27)
    for (let i = 1; i <= 20; i++) {
        users.push({
            id: 7 + i,
            email: `sekolah${i}@jpnj.gov.my`,
            name: `Pentadbir SMK ${i}`,
            role: 'school',
            password_hash: await hashPassword('SekolahPass123!'),
            school_id: i,
            ppd_id: null
        });
    }
    
    // Import in batches to avoid timeout
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        
        const { data, error: insertError } = await supabase
            .from('users')
            .upsert(batch, { onConflict: 'id' });
        
        if (insertError) {
            error(`Failed to import users batch ${i}: ${insertError.message}`);
        }
        
        log(`  - Imported users ${i + 1} to ${Math.min(i + batchSize, users.length)}`);
    }
    
    log(`✅ Imported ${users.length} users`);
    return users;
};

// Import teachers
const importTeachers = async () => {
    log('Importing teachers...');
    
    const teachers = [];
    let teacherId = 1;
    
    // Generate 6 teachers per school (120 total)
    for (let schoolId = 1; schoolId <= 20; schoolId++) {
        for (let teacherNum = 1; teacherNum <= 6; teacherNum++) {
            const subjectId = ((teacherNum - 1) % 5) + 1; // Rotate through 5 subjects
            
            teachers.push({
                id: teacherId++,
                name: `Guru ${teacherNum} Sekolah ${schoolId}`,
                ic_number: `${String(schoolId).padStart(2, '0')}${String(teacherNum).padStart(2, '0')}${Math.floor(Math.random() * 900000) + 100000}`,
                school_id: schoolId,
                subject_id: subjectId,
                email: `guru${teacherNum}.sekolah${schoolId}@jpnj.gov.my`,
                phone: `01${Math.floor(Math.random() * 90000000) + 10000000}`,
                years_experience: Math.floor(Math.random() * 20) + 5,
                qualification: Math.random() > 0.5 ? 'Sarjana Pendidikan' : 'Ijazah Sarjana Muda'
            });
        }
    }
    
    // Import in batches
    const batchSize = 20;
    for (let i = 0; i < teachers.length; i += batchSize) {
        const batch = teachers.slice(i, i + batchSize);
        
        const { data, error: insertError } = await supabase
            .from('teachers')
            .upsert(batch, { onConflict: 'id' });
        
        if (insertError) {
            error(`Failed to import teachers batch ${i}: ${insertError.message}`);
        }
        
        log(`  - Imported teachers ${i + 1} to ${Math.min(i + batchSize, teachers.length)}`);
    }
    
    log(`✅ Imported ${teachers.length} teachers`);
    return teachers;
};

// Import students
const importStudents = async () => {
    log('Importing students...');
    
    const students = [];
    let studentId = 1;
    
    // Generate 44 students per school (880 total)
    for (let schoolId = 1; schoolId <= 20; schoolId++) {
        for (let studentNum = 1; studentNum <= 44; studentNum++) {
            const classNum = Math.ceil(studentNum / 11); // 4 classes, ~11 students each
            
            students.push({
                id: studentId++,
                name: `Murid ${studentNum} Sekolah ${schoolId}`,
                ic_number: `${String(schoolId).padStart(2, '0')}${String(studentNum).padStart(2, '0')}${Math.floor(Math.random() * 900000) + 100000}`,
                school_id: schoolId,
                class: `4 Bestari ${classNum}`
            });
        }
    }
    
    // Import in batches
    const batchSize = 50;
    for (let i = 0; i < students.length; i += batchSize) {
        const batch = students.slice(i, i + batchSize);
        
        const { data, error: insertError } = await supabase
            .from('students')
            .upsert(batch, { onConflict: 'id' });
        
        if (insertError) {
            error(`Failed to import students batch ${i}: ${insertError.message}`);
        }
        
        log(`  - Imported students ${i + 1} to ${Math.min(i + batchSize, students.length)}`);
    }
    
    log(`✅ Imported ${students.length} students`);
    return students;
};

// Import programs
const importPrograms = async () => {
    log('Importing programs...');
    
    const programs = [
        {
            id: 1,
            title: 'Program Tuisyen Intensif SPM 2026',
            description: 'Program tuisyen intensif untuk meningkatkan prestasi SPM 2026',
            program_type: 'tuition',
            target_subject_id: 1,
            start_date: '2026-01-15',
            end_date: '2026-10-30',
            created_by: 1,
            target_students: 880
        },
        {
            id: 2,
            title: 'Program Kecemerlangan Matematik',
            description: 'Program khas untuk meningkatkan prestasi Matematik',
            program_type: 'excellence',
            target_subject_id: 3,
            start_date: '2026-02-01',
            end_date: '2026-09-30',
            created_by: 1,
            target_students: 400
        },
        {
            id: 3,
            title: 'Program Pemantapan Sejarah',
            description: 'Program pemantapan untuk mata pelajaran Sejarah',
            program_type: 'remedial',
            target_subject_id: 2,
            start_date: '2026-03-01',
            end_date: '2026-08-31',
            created_by: 1,
            target_students: 300
        }
    ];
    
    const { data, error: insertError } = await supabase
        .from('programs')
        .upsert(programs, { onConflict: 'id' });
    
    if (insertError) {
        error(`Failed to import programs: ${insertError.message}`);
    }
    
    log(`✅ Imported ${programs.length} programs`);
    return programs;
};

// Test database connection
const testConnection = async () => {
    log('Testing Supabase connection...');
    
    const { data, error } = await supabase
        .from('ppds')
        .select('count')
        .limit(1);
    
    if (error) {
        error(`Connection failed: ${error.message}`);
    }
    
    log('✅ Supabase connection successful');
};

// Main import function
const main = async () => {
    try {
        log('=== Starting JohorUP Supabase Data Import ===');
        
        // Check environment variables
        if (!SUPABASE_URL || SUPABASE_URL === 'https://your-project.supabase.co') {
            error('SUPABASE_URL environment variable not set');
        }
        
        if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === 'your-service-key') {
            error('SUPABASE_SERVICE_KEY environment variable not set');
        }
        
        // Test connection
        await testConnection();
        
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
        log('🎉 Your JohorUP system is ready for production!');
        log('');
        log('📋 Summary:');
        log('- 3 PPDs imported');
        log('- 5 subjects imported');
        log('- 20 schools imported');
        log('- 27 users imported (7 admin + 20 schools)');
        log('- 120 teachers imported (6 per school)');
        log('- 880 students imported (44 per school)');
        log('- 3 programs imported');
        log('');
        log('🔑 Login credentials:');
        log('- Admin: admin@jpnj.gov.my / AdminPass123!');
        log('- Koordinator: koordinator@jpnj.gov.my / KoordinatorPass123!');
        log('- School 1: sekolah1@jpnj.gov.my / SekolahPass123!');
        log('- Yayasan JCorp: yayasan@jcorp.com.my / YayasanPass123!');
        log('');
        log('🚀 Next steps:');
        log('1. Deploy your app to Netlify');
        log('2. Set environment variables in Netlify');
        log('3. Test the system with the credentials above');
        log('4. Update passwords for production use');
        
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