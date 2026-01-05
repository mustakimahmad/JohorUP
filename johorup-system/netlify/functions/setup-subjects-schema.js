// Setup comprehensive subjects database schema for JohorUP System
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'Database URL not configured'
        })
      };
    }

    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();

    try {
      // Drop existing subjects tables if they exist (in correct order due to dependencies)
      await client.query(`DROP TABLE IF EXISTS subject_timetables CASCADE`);
      await client.query(`DROP TABLE IF EXISTS subject_learning_outcomes CASCADE`);
      await client.query(`DROP TABLE IF EXISTS subject_resources CASCADE`);
      await client.query(`DROP TABLE IF EXISTS subject_performance_analytics CASCADE`);
      await client.query(`DROP TABLE IF EXISTS subject_teachers CASCADE`);
      await client.query(`DROP TABLE IF EXISTS subject_syllabi CASCADE`);
      await client.query(`DROP TABLE IF EXISTS subjects CASCADE`);

      // 1. Create subjects table (master mata pelajaran)
      await client.query(`
        CREATE TABLE subjects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          subject_code VARCHAR(10) UNIQUE NOT NULL,
          subject_name_bm VARCHAR(255) NOT NULL,
          subject_name_en VARCHAR(255) NOT NULL,
          subject_category VARCHAR(50) NOT NULL,
          subject_type VARCHAR(50) NOT NULL,
          
          -- Academic details
          form_levels TEXT[] NOT NULL,
          curriculum_standard VARCHAR(50) NOT NULL,
          total_periods_per_week INTEGER DEFAULT 0,
          
          -- Exam configuration
          has_practical BOOLEAN DEFAULT false,
          paper_count INTEGER DEFAULT 1,
          total_exam_marks INTEGER DEFAULT 100,
          passing_marks INTEGER DEFAULT 40,
          
          -- Grading system
          grade_boundaries JSONB,
          weightage_theory DECIMAL(5,2),
          weightage_practical DECIMAL(5,2),
          weightage_coursework DECIMAL(5,2),
          
          -- Subject hierarchy
          parent_subject_id UUID REFERENCES subjects(id),
          is_active BOOLEAN DEFAULT true,
          display_order INTEGER DEFAULT 0,
          
          -- Metadata
          description TEXT,
          learning_objectives TEXT[],
          prerequisites TEXT[],
          career_pathways TEXT[],
          
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 2. Create subject_syllabi table
      await client.query(`
        CREATE TABLE subject_syllabi (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
          form_level VARCHAR(10) NOT NULL,
          academic_year INTEGER NOT NULL,
          syllabus_version VARCHAR(20) NOT NULL,
          
          -- Syllabus structure
          chapters JSONB NOT NULL,
          learning_standards JSONB,
          assessment_criteria JSONB,
          
          -- Time allocation
          total_teaching_hours INTEGER,
          chapter_time_allocation JSONB,
          
          -- Resources
          textbook_references JSONB,
          supplementary_materials JSONB,
          digital_resources JSONB,
          
          -- Status
          approval_status VARCHAR(20) DEFAULT 'DRAFT',
          approved_by UUID REFERENCES users(id),
          approved_at TIMESTAMP,
          
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 3. Create subject_teachers table
      await client.query(`
        CREATE TABLE subject_teachers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
          subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
          school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
          
          -- Assignment details
          form_levels TEXT[] NOT NULL,
          classes TEXT[],
          academic_year INTEGER NOT NULL,
          
          -- Teaching load
          periods_per_week INTEGER DEFAULT 0,
          total_students INTEGER DEFAULT 0,
          
          -- Specialization
          specialization_areas TEXT[],
          teaching_experience_years INTEGER DEFAULT 0,
          qualification_level VARCHAR(50),
          
          -- Performance tracking
          average_student_performance DECIMAL(5,2),
          improvement_rate DECIMAL(5,2),
          
          -- Status
          assignment_type VARCHAR(20) DEFAULT 'PERMANENT',
          start_date DATE NOT NULL,
          end_date DATE,
          is_active BOOLEAN DEFAULT true,
          
          -- Constraints
          UNIQUE(teacher_id, subject_id, school_id, academic_year),
          
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 4. Create subject_performance_analytics table
      await client.query(`
        CREATE TABLE subject_performance_analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
          school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
          exam_session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
          
          -- Performance metrics
          total_students INTEGER NOT NULL,
          students_passed INTEGER DEFAULT 0,
          students_failed INTEGER DEFAULT 0,
          pass_rate DECIMAL(5,2) GENERATED ALWAYS AS (
            CASE WHEN total_students > 0 THEN (students_passed::DECIMAL / total_students) * 100 ELSE 0 END
          ) STORED,
          
          -- Grade distribution
          grade_a_plus INTEGER DEFAULT 0,
          grade_a INTEGER DEFAULT 0,
          grade_a_minus INTEGER DEFAULT 0,
          grade_b_plus INTEGER DEFAULT 0,
          grade_b INTEGER DEFAULT 0,
          grade_c_plus INTEGER DEFAULT 0,
          grade_c INTEGER DEFAULT 0,
          grade_d INTEGER DEFAULT 0,
          grade_e INTEGER DEFAULT 0,
          grade_g INTEGER DEFAULT 0,
          
          -- Statistical measures
          average_marks DECIMAL(5,2),
          median_marks DECIMAL(5,2),
          highest_marks DECIMAL(5,2),
          lowest_marks DECIMAL(5,2),
          standard_deviation DECIMAL(5,2),
          
          -- Comparison metrics
          national_average DECIMAL(5,2),
          state_average DECIMAL(5,2),
          ppd_average DECIMAL(5,2),
          performance_index DECIMAL(5,2),
          
          -- Analysis period
          analysis_date DATE DEFAULT CURRENT_DATE,
          academic_year INTEGER NOT NULL,
          
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 5. Create subject_resources table
      await client.query(`
        CREATE TABLE subject_resources (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
          resource_title VARCHAR(255) NOT NULL,
          resource_type VARCHAR(50) NOT NULL,
          
          -- Resource details
          author_publisher VARCHAR(255),
          publication_year INTEGER,
          isbn_code VARCHAR(20),
          language VARCHAR(20) DEFAULT 'BM',
          
          -- Applicability
          form_levels TEXT[] NOT NULL,
          curriculum_alignment VARCHAR(50),
          
          -- Access information
          resource_url TEXT,
          file_path TEXT,
          access_type VARCHAR(20) DEFAULT 'FREE',
          
          -- Usage tracking
          download_count INTEGER DEFAULT 0,
          usage_rating DECIMAL(3,2) DEFAULT 0.00,
          
          -- Approval
          approval_status VARCHAR(20) DEFAULT 'PENDING',
          approved_by UUID REFERENCES users(id),
          
          -- Metadata
          description TEXT,
          tags TEXT[],
          file_size_mb DECIMAL(8,2),
          
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 6. Create subject_learning_outcomes table
      await client.query(`
        CREATE TABLE subject_learning_outcomes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
          form_level VARCHAR(10) NOT NULL,
          
          -- Learning outcome details
          outcome_code VARCHAR(20) NOT NULL,
          outcome_description TEXT NOT NULL,
          cognitive_level VARCHAR(20),
          
          -- Curriculum mapping
          chapter_reference VARCHAR(100),
          topic_reference VARCHAR(100),
          subtopic_reference VARCHAR(100),
          
          -- Assessment mapping
          assessment_methods TEXT[],
          weightage_percentage DECIMAL(5,2),
          
          -- Skills development
          thinking_skills TEXT[],
          values_attitudes TEXT[],
          
          -- Status
          is_active BOOLEAN DEFAULT true,
          academic_year INTEGER NOT NULL,
          
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 7. Create subject_timetables table
      await client.query(`
        CREATE TABLE subject_timetables (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
          subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
          teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
          
          -- Class details
          form_level VARCHAR(10) NOT NULL,
          class_name VARCHAR(50) NOT NULL,
          academic_year INTEGER NOT NULL,
          semester VARCHAR(10) DEFAULT 'FULL_YEAR',
          
          -- Schedule details
          day_of_week INTEGER NOT NULL,
          period_number INTEGER NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          duration_minutes INTEGER NOT NULL,
          
          -- Location
          classroom VARCHAR(50),
          laboratory VARCHAR(50),
          special_room VARCHAR(50),
          
          -- Status
          is_active BOOLEAN DEFAULT true,
          effective_date DATE DEFAULT CURRENT_DATE,
          
          -- Constraints
          UNIQUE(school_id, day_of_week, period_number, classroom, academic_year),
          
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create performance indexes
      const indexes = [
        // Subjects indexes
        'CREATE INDEX idx_subjects_code ON subjects(subject_code)',
        'CREATE INDEX idx_subjects_category ON subjects(subject_category)',
        'CREATE INDEX idx_subjects_type ON subjects(subject_type)',
        'CREATE INDEX idx_subjects_active ON subjects(is_active)',
        
        // Subject teachers indexes
        'CREATE INDEX idx_subject_teachers_teacher_id ON subject_teachers(teacher_id)',
        'CREATE INDEX idx_subject_teachers_subject_id ON subject_teachers(subject_id)',
        'CREATE INDEX idx_subject_teachers_school_id ON subject_teachers(school_id)',
        'CREATE INDEX idx_subject_teachers_academic_year ON subject_teachers(academic_year)',
        'CREATE INDEX idx_subject_teachers_active ON subject_teachers(is_active)',
        
        // Performance analytics indexes
        'CREATE INDEX idx_performance_analytics_subject_id ON subject_performance_analytics(subject_id)',
        'CREATE INDEX idx_performance_analytics_school_id ON subject_performance_analytics(school_id)',
        'CREATE INDEX idx_performance_analytics_session_id ON subject_performance_analytics(exam_session_id)',
        'CREATE INDEX idx_performance_analytics_year ON subject_performance_analytics(academic_year)',
        
        // Resources indexes
        'CREATE INDEX idx_subject_resources_subject_id ON subject_resources(subject_id)',
        'CREATE INDEX idx_subject_resources_type ON subject_resources(resource_type)',
        'CREATE INDEX idx_subject_resources_approval ON subject_resources(approval_status)',
        
        // Timetables indexes
        'CREATE INDEX idx_subject_timetables_school_id ON subject_timetables(school_id)',
        'CREATE INDEX idx_subject_timetables_subject_id ON subject_timetables(subject_id)',
        'CREATE INDEX idx_subject_timetables_teacher_id ON subject_timetables(teacher_id)',
        'CREATE INDEX idx_subject_timetables_schedule ON subject_timetables(day_of_week, period_number)',
        
        // Composite indexes for common queries
        'CREATE INDEX idx_subject_teachers_composite ON subject_teachers(school_id, academic_year, is_active)',
        'CREATE INDEX idx_timetables_composite ON subject_timetables(school_id, academic_year, day_of_week)'
      ];

      for (const indexQuery of indexes) {
        await client.query(indexQuery);
      }

      // Standard SPM grade boundaries
      const gradeBoundaries = {
        "A+": {"min": 90, "max": 100, "points": 4.00},
        "A": {"min": 80, "max": 89, "points": 4.00},
        "A-": {"min": 75, "max": 79, "points": 3.67},
        "B+": {"min": 70, "max": 74, "points": 3.33},
        "B": {"min": 65, "max": 69, "points": 3.00},
        "C+": {"min": 60, "max": 64, "points": 2.67},
        "C": {"min": 50, "max": 59, "points": 2.00},
        "D": {"min": 40, "max": 49, "points": 1.00},
        "E": {"min": 30, "max": 39, "points": 0.00},
        "G": {"min": 0, "max": 29, "points": 0.00}
      };

      // Insert core subjects (mata pelajaran teras)
      const coreSubjects = [
        {
          code: 'BM',
          name_bm: 'Bahasa Melayu',
          name_en: 'Malay Language',
          type: 'LANGUAGE',
          papers: 2,
          periods: 6,
          objectives: ['Menguasai kemahiran berkomunikasi', 'Memahami sastera Melayu', 'Mengapresiasi budaya Melayu']
        },
        {
          code: 'BI',
          name_bm: 'Bahasa Inggeris',
          name_en: 'English Language',
          type: 'LANGUAGE',
          papers: 2,
          periods: 5,
          objectives: ['Master communication skills', 'Understand English literature', 'Develop critical thinking']
        },
        {
          code: 'MAT',
          name_bm: 'Matematik',
          name_en: 'Mathematics',
          type: 'SCIENCE',
          papers: 2,
          periods: 5,
          objectives: ['Menguasai konsep matematik asas', 'Membangunkan kemahiran penyelesaian masalah', 'Mengaplikasi matematik dalam kehidupan']
        },
        {
          code: 'SEJ',
          name_bm: 'Sejarah',
          name_en: 'History',
          type: 'ARTS',
          papers: 1,
          periods: 3,
          objectives: ['Memahami sejarah Malaysia', 'Menghargai warisan bangsa', 'Membangunkan patriotisme']
        },
        {
          code: 'SN',
          name_bm: 'Sains',
          name_en: 'Science',
          type: 'SCIENCE',
          papers: 2,
          periods: 4,
          objectives: ['Memahami konsep sains asas', 'Membangunkan kemahiran saintifik', 'Mengaplikasi sains dalam teknologi']
        }
      ];

      let coreSubjectsCreated = 0;
      for (const subject of coreSubjects) {
        await client.query(`
          INSERT INTO subjects (
            subject_code, subject_name_bm, subject_name_en, subject_category, subject_type,
            form_levels, curriculum_standard, total_periods_per_week, paper_count,
            total_exam_marks, passing_marks, grade_boundaries, learning_objectives,
            display_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          subject.code,
          subject.name_bm,
          subject.name_en,
          'CORE',
          subject.type,
          ['Form 4', 'Form 5'],
          'KSSM',
          subject.periods,
          subject.papers,
          100,
          40,
          JSON.stringify(gradeBoundaries),
          subject.objectives,
          coreSubjectsCreated + 1
        ]);
        coreSubjectsCreated++;
      }

      // Insert elective subjects (mata pelajaran elektif)
      const electiveSubjects = [
        {
          code: 'FIZ',
          name_bm: 'Fizik',
          name_en: 'Physics',
          type: 'SCIENCE',
          papers: 3,
          periods: 4,
          practical: true,
          objectives: ['Memahami konsep fizik', 'Membangunkan kemahiran eksperimen', 'Mengaplikasi fizik dalam teknologi']
        },
        {
          code: 'KIM',
          name_bm: 'Kimia',
          name_en: 'Chemistry',
          type: 'SCIENCE',
          papers: 3,
          periods: 4,
          practical: true,
          objectives: ['Memahami konsep kimia', 'Membangunkan kemahiran makmal', 'Mengaplikasi kimia dalam industri']
        },
        {
          code: 'BIO',
          name_bm: 'Biologi',
          name_en: 'Biology',
          type: 'SCIENCE',
          papers: 3,
          periods: 4,
          practical: true,
          objectives: ['Memahami sistem kehidupan', 'Membangunkan kesedaran alam sekitar', 'Mengaplikasi biologi dalam perubatan']
        },
        {
          code: 'GEO',
          name_bm: 'Geografi',
          name_en: 'Geography',
          type: 'ARTS',
          papers: 2,
          periods: 3,
          practical: false,
          objectives: ['Memahami alam sekitar', 'Membangunkan kesedaran global', 'Mengaplikasi geografi dalam perancangan']
        },
        {
          code: 'EKO',
          name_bm: 'Ekonomi',
          name_en: 'Economics',
          type: 'ARTS',
          papers: 2,
          periods: 3,
          practical: false,
          objectives: ['Memahami sistem ekonomi', 'Membangunkan kemahiran analisis', 'Mengaplikasi ekonomi dalam perniagaan']
        }
      ];

      let electiveSubjectsCreated = 0;
      for (const subject of electiveSubjects) {
        await client.query(`
          INSERT INTO subjects (
            subject_code, subject_name_bm, subject_name_en, subject_category, subject_type,
            form_levels, curriculum_standard, total_periods_per_week, paper_count,
            total_exam_marks, passing_marks, grade_boundaries, has_practical,
            learning_objectives, display_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `, [
          subject.code,
          subject.name_bm,
          subject.name_en,
          'ELECTIVE',
          subject.type,
          ['Form 4', 'Form 5'],
          'KSSM',
          subject.periods,
          subject.papers,
          100,
          40,
          JSON.stringify(gradeBoundaries),
          subject.practical,
          subject.objectives,
          coreSubjectsCreated + electiveSubjectsCreated + 1
        ]);
        electiveSubjectsCreated++;
      }

      // Insert additional subjects (mata pelajaran tambahan)
      const additionalSubjects = [
        {
          code: 'MATAM',
          name_bm: 'Matematik Tambahan',
          name_en: 'Additional Mathematics',
          type: 'SCIENCE',
          papers: 2,
          periods: 4,
          objectives: ['Menguasai matematik lanjutan', 'Membangunkan kemahiran analisis', 'Persediaan untuk pengajian tinggi']
        },
        {
          code: 'BC',
          name_bm: 'Bahasa Cina',
          name_en: 'Chinese Language',
          type: 'LANGUAGE',
          papers: 2,
          periods: 3,
          objectives: ['Menguasai bahasa Cina', 'Memahami budaya Cina', 'Membangunkan kemahiran dwibahasa']
        },
        {
          code: 'BT',
          name_bm: 'Bahasa Tamil',
          name_en: 'Tamil Language',
          type: 'LANGUAGE',
          papers: 2,
          periods: 3,
          objectives: ['Menguasai bahasa Tamil', 'Memahami budaya Tamil', 'Membangunkan kemahiran dwibahasa']
        },
        {
          code: 'PI',
          name_bm: 'Pendidikan Islam',
          name_en: 'Islamic Education',
          type: 'RELIGIOUS',
          papers: 1,
          periods: 2,
          objectives: ['Memahami ajaran Islam', 'Membangunkan akhlak mulia', 'Mengaplikasi nilai Islam']
        }
      ];

      let additionalSubjectsCreated = 0;
      for (const subject of additionalSubjects) {
        await client.query(`
          INSERT INTO subjects (
            subject_code, subject_name_bm, subject_name_en, subject_category, subject_type,
            form_levels, curriculum_standard, total_periods_per_week, paper_count,
            total_exam_marks, passing_marks, grade_boundaries, learning_objectives,
            display_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          subject.code,
          subject.name_bm,
          subject.name_en,
          'ADDITIONAL',
          subject.type,
          ['Form 4', 'Form 5'],
          'KSSM',
          subject.periods,
          subject.papers,
          100,
          40,
          JSON.stringify(gradeBoundaries),
          subject.objectives,
          coreSubjectsCreated + electiveSubjectsCreated + additionalSubjectsCreated + 1
        ]);
        additionalSubjectsCreated++;
      }

      // Create sample subject assignments for teachers
      const teachersResult = await client.query(`
        SELECT id, name FROM users WHERE role IN ('Teacher', 'School Admin') LIMIT 5
      `);
      
      const schoolsResult = await client.query('SELECT id FROM schools LIMIT 3');
      const subjectsResult = await client.query('SELECT id, subject_code FROM subjects LIMIT 8');
      
      let assignmentsCreated = 0;
      if (teachersResult.rows.length > 0 && schoolsResult.rows.length > 0 && subjectsResult.rows.length > 0) {
        for (let i = 0; i < Math.min(teachersResult.rows.length, subjectsResult.rows.length); i++) {
          const teacher = teachersResult.rows[i];
          const subject = subjectsResult.rows[i];
          const school = schoolsResult.rows[i % schoolsResult.rows.length];
          
          await client.query(`
            INSERT INTO subject_teachers (
              teacher_id, subject_id, school_id, form_levels, classes,
              academic_year, periods_per_week, total_students,
              specialization_areas, teaching_experience_years, qualification_level,
              assignment_type, start_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          `, [
            teacher.id,
            subject.id,
            school.id,
            ['Form 4', 'Form 5'],
            ['4 Bestari', '4 Cemerlang', '5 Bestari'],
            2026,
            5,
            75,
            [subject.subject_code + ' Specialist'],
            5 + (i * 2),
            'DEGREE',
            'PERMANENT',
            '2026-01-01'
          ]);
          assignmentsCreated++;
        }
      }

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Subjects database schema setup completed successfully',
          tables_created: [
            'subjects',
            'subject_syllabi',
            'subject_teachers',
            'subject_performance_analytics',
            'subject_resources',
            'subject_learning_outcomes',
            'subject_timetables'
          ],
          indexes_created: 16,
          sample_data: {
            core_subjects: coreSubjectsCreated,
            elective_subjects: electiveSubjectsCreated,
            additional_subjects: additionalSubjectsCreated,
            teacher_assignments: assignmentsCreated,
            total_subjects: coreSubjectsCreated + electiveSubjectsCreated + additionalSubjectsCreated
          },
          subjects_summary: {
            core: ['BM', 'BI', 'MAT', 'SEJ', 'SN'],
            elective: ['FIZ', 'KIM', 'BIO', 'GEO', 'EKO'],
            additional: ['MATAM', 'BC', 'BT', 'PI']
          },
          timestamp: new Date().toISOString()
        })
      };

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Subjects schema setup error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Subjects schema setup failed'
      })
    };
  }
};