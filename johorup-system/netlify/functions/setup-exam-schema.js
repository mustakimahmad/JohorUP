// Setup comprehensive exam and student progress tracking schema
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
      // Drop existing exam tables if they exist (in correct order due to dependencies)
      await client.query(`DROP TABLE IF EXISTS student_interventions CASCADE`);
      await client.query(`DROP TABLE IF EXISTS intervention_programs CASCADE`);
      await client.query(`DROP TABLE IF EXISTS student_progress_tracking CASCADE`);
      await client.query(`DROP TABLE IF EXISTS student_exam_results CASCADE`);
      await client.query(`DROP TABLE IF EXISTS exam_subjects CASCADE`);
      await client.query(`DROP TABLE IF EXISTS exam_sessions CASCADE`);
      await client.query(`DROP TABLE IF EXISTS targeted_students CASCADE`);

      // 1. Create targeted_students table
      await client.query(`
        CREATE TABLE targeted_students (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID REFERENCES students(id) ON DELETE CASCADE,
          school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
          subject VARCHAR(100) NOT NULL,
          target_grade VARCHAR(5) NOT NULL,
          current_grade VARCHAR(5),
          baseline_marks DECIMAL(5,2),
          target_marks DECIMAL(5,2),
          target_year INTEGER NOT NULL,
          target_exam VARCHAR(50) NOT NULL,
          intervention_type VARCHAR(100),
          assigned_teacher_id UUID REFERENCES users(id),
          assigned_sisc_id UUID REFERENCES users(id),
          priority_level VARCHAR(20) DEFAULT 'MEDIUM',
          status VARCHAR(20) DEFAULT 'ACTIVE',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 2. Create exam_sessions table
      await client.query(`
        CREATE TABLE exam_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_name VARCHAR(255) NOT NULL,
          session_code VARCHAR(50) UNIQUE NOT NULL,
          exam_type VARCHAR(50) NOT NULL,
          academic_year INTEGER NOT NULL,
          form_level VARCHAR(10) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          registration_deadline DATE,
          status VARCHAR(20) DEFAULT 'UPCOMING',
          description TEXT,
          created_by UUID REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 3. Create exam_subjects table
      await client.query(`
        CREATE TABLE exam_subjects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
          subject_code VARCHAR(20) NOT NULL,
          subject_name VARCHAR(255) NOT NULL,
          subject_type VARCHAR(50) NOT NULL,
          paper_count INTEGER DEFAULT 1,
          total_marks INTEGER NOT NULL,
          passing_marks INTEGER,
          grade_boundaries JSONB,
          exam_date DATE,
          exam_time TIME,
          duration_minutes INTEGER,
          is_mandatory BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 4. Create student_exam_results table
      await client.query(`
        CREATE TABLE student_exam_results (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID REFERENCES students(id) ON DELETE CASCADE,
          session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
          subject_id UUID REFERENCES exam_subjects(id) ON DELETE CASCADE,
          school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
          paper_1_marks DECIMAL(5,2),
          paper_2_marks DECIMAL(5,2),
          paper_3_marks DECIMAL(5,2),
          total_marks DECIMAL(5,2) NOT NULL,
          percentage DECIMAL(5,2),
          grade VARCHAR(5) NOT NULL,
          grade_point DECIMAL(3,2),
          status VARCHAR(20) DEFAULT 'SUBMITTED',
          is_targeted_student BOOLEAN DEFAULT false,
          improvement_from_baseline DECIMAL(5,2),
          entered_by UUID REFERENCES users(id),
          verified_by UUID REFERENCES users(id),
          entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          verified_at TIMESTAMP,
          UNIQUE(student_id, session_id, subject_id)
        )
      `);

      // 5. Create student_progress_tracking table
      await client.query(`
        CREATE TABLE student_progress_tracking (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID REFERENCES students(id) ON DELETE CASCADE,
          targeted_student_id UUID REFERENCES targeted_students(id) ON DELETE CASCADE,
          subject VARCHAR(100) NOT NULL,
          baseline_session_id UUID REFERENCES exam_sessions(id),
          current_session_id UUID REFERENCES exam_sessions(id),
          baseline_marks DECIMAL(5,2),
          current_marks DECIMAL(5,2),
          baseline_grade VARCHAR(5),
          current_grade VARCHAR(5),
          marks_improvement DECIMAL(5,2),
          percentage_improvement DECIMAL(5,2),
          target_marks DECIMAL(5,2),
          target_grade VARCHAR(5),
          progress_to_target DECIMAL(5,2),
          is_on_track BOOLEAN,
          risk_level VARCHAR(20),
          tracked_date DATE DEFAULT CURRENT_DATE,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 6. Create intervention_programs table
      await client.query(`
        CREATE TABLE intervention_programs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          program_name VARCHAR(255) NOT NULL,
          program_type VARCHAR(50) NOT NULL,
          target_subjects TEXT[],
          target_grades TEXT[],
          description TEXT,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          session_frequency VARCHAR(50),
          session_duration INTEGER,
          max_participants INTEGER,
          assigned_schools UUID[],
          assigned_teachers UUID[],
          assigned_sisc UUID[],
          status VARCHAR(20) DEFAULT 'PLANNED',
          budget_allocated DECIMAL(10,2),
          budget_used DECIMAL(10,2),
          created_by UUID REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 7. Create student_interventions table
      await client.query(`
        CREATE TABLE student_interventions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID REFERENCES students(id) ON DELETE CASCADE,
          targeted_student_id UUID REFERENCES targeted_students(id) ON DELETE CASCADE,
          program_id UUID REFERENCES intervention_programs(id) ON DELETE CASCADE,
          enrollment_date DATE DEFAULT CURRENT_DATE,
          completion_date DATE,
          attendance_rate DECIMAL(5,2),
          participation_status VARCHAR(20) DEFAULT 'ENROLLED',
          pre_intervention_marks DECIMAL(5,2),
          post_intervention_marks DECIMAL(5,2),
          improvement DECIMAL(5,2),
          teacher_feedback TEXT,
          student_feedback TEXT,
          parent_feedback TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create performance indexes
      const indexes = [
        // Targeted students indexes
        'CREATE INDEX idx_targeted_students_student_id ON targeted_students(student_id)',
        'CREATE INDEX idx_targeted_students_school_id ON targeted_students(school_id)',
        'CREATE INDEX idx_targeted_students_subject ON targeted_students(subject)',
        'CREATE INDEX idx_targeted_students_status ON targeted_students(status)',
        
        // Exam results indexes
        'CREATE INDEX idx_exam_results_student_id ON student_exam_results(student_id)',
        'CREATE INDEX idx_exam_results_session_id ON student_exam_results(session_id)',
        'CREATE INDEX idx_exam_results_subject_id ON student_exam_results(subject_id)',
        'CREATE INDEX idx_exam_results_school_id ON student_exam_results(school_id)',
        'CREATE INDEX idx_exam_results_grade ON student_exam_results(grade)',
        
        // Progress tracking indexes
        'CREATE INDEX idx_progress_tracking_student_id ON student_progress_tracking(student_id)',
        'CREATE INDEX idx_progress_tracking_targeted_id ON student_progress_tracking(targeted_student_id)',
        'CREATE INDEX idx_progress_tracking_subject ON student_progress_tracking(subject)',
        
        // Composite indexes
        'CREATE INDEX idx_exam_results_composite ON student_exam_results(school_id, session_id, subject_id)',
        'CREATE INDEX idx_targeted_students_composite ON targeted_students(school_id, subject, status)'
      ];

      for (const indexQuery of indexes) {
        await client.query(indexQuery);
      }

      // Insert sample exam sessions
      const examSessions = [
        {
          name: 'Peperiksaan Akhir Tahun 2025 Tingkatan 4',
          code: 'PAT_2025_T4',
          type: 'AKHIR_TAHUN',
          year: 2025,
          form: 'Form 4',
          start: '2025-10-15',
          end: '2025-10-30'
        },
        {
          name: 'Peperiksaan Pertengahan Tahun 2026',
          code: 'PTT_2026',
          type: 'PERTENGAHAN_TAHUN',
          year: 2026,
          form: 'Form 4',
          start: '2026-06-15',
          end: '2026-06-30'
        },
        {
          name: 'Peperiksaan Percubaan SPM 2026',
          code: 'PERCUBAAN_SPM_2026',
          type: 'PERCUBAAN_SPM',
          year: 2026,
          form: 'Form 5',
          start: '2026-08-15',
          end: '2026-09-15'
        }
      ];

      let sessionsCreated = 0;
      for (const session of examSessions) {
        await client.query(`
          INSERT INTO exam_sessions (session_name, session_code, exam_type, academic_year, form_level, start_date, end_date, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [session.name, session.code, session.type, session.year, session.form, session.start, session.end, 'UPCOMING']);
        sessionsCreated++;
      }

      // Insert sample subjects for each session
      const subjects = [
        { code: 'BM', name: 'Bahasa Melayu', type: 'CORE', marks: 100, papers: 2 },
        { code: 'BI', name: 'Bahasa Inggeris', type: 'CORE', marks: 100, papers: 2 },
        { code: 'MAT', name: 'Matematik', type: 'CORE', marks: 100, papers: 2 },
        { code: 'SEJ', name: 'Sejarah', type: 'CORE', marks: 100, papers: 1 },
        { code: 'SN', name: 'Sains', type: 'CORE', marks: 100, papers: 2 }
      ];

      const gradeBoundaries = {
        "A+": {"min": 90, "max": 100},
        "A": {"min": 80, "max": 89},
        "A-": {"min": 75, "max": 79},
        "B+": {"min": 70, "max": 74},
        "B": {"min": 65, "max": 69},
        "C+": {"min": 60, "max": 64},
        "C": {"min": 50, "max": 59},
        "D": {"min": 40, "max": 49},
        "E": {"min": 30, "max": 39},
        "G": {"min": 0, "max": 29}
      };

      // Get created sessions
      const sessionsResult = await client.query('SELECT id FROM exam_sessions ORDER BY created_at');
      let subjectsCreated = 0;

      for (const sessionRow of sessionsResult.rows) {
        for (const subject of subjects) {
          await client.query(`
            INSERT INTO exam_subjects (session_id, subject_code, subject_name, subject_type, paper_count, total_marks, passing_marks, grade_boundaries)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            sessionRow.id,
            subject.code,
            subject.name,
            subject.type,
            subject.papers,
            subject.marks,
            40, // Passing marks
            JSON.stringify(gradeBoundaries)
          ]);
          subjectsCreated++;
        }
      }

      // Insert sample targeted students
      const studentsResult = await client.query('SELECT id FROM students LIMIT 3');
      const schoolsResult = await client.query('SELECT id FROM schools LIMIT 2');
      
      let targetedStudentsCreated = 0;
      if (studentsResult.rows.length > 0 && schoolsResult.rows.length > 0) {
        const targetedStudentsData = [
          {
            student_id: studentsResult.rows[0].id,
            school_id: schoolsResult.rows[0].id,
            subject: 'Bahasa Melayu',
            target_grade: 'B+',
            current_grade: 'C+',
            baseline_marks: 65.5,
            target_marks: 75.0,
            target_year: 2026,
            target_exam: 'SPM',
            intervention_type: 'TUITION',
            priority_level: 'HIGH'
          },
          {
            student_id: studentsResult.rows[1].id,
            school_id: schoolsResult.rows[0].id,
            subject: 'Matematik',
            target_grade: 'A-',
            current_grade: 'B',
            baseline_marks: 68.0,
            target_marks: 78.0,
            target_year: 2026,
            target_exam: 'SPM',
            intervention_type: 'REMEDIAL',
            priority_level: 'MEDIUM'
          },
          {
            student_id: studentsResult.rows[2].id,
            school_id: schoolsResult.rows[1].id,
            subject: 'Sains',
            target_grade: 'A',
            current_grade: 'B+',
            baseline_marks: 72.0,
            target_marks: 82.0,
            target_year: 2026,
            target_exam: 'SPM',
            intervention_type: 'ENRICHMENT',
            priority_level: 'MEDIUM'
          }
        ];

        for (const targetedStudent of targetedStudentsData) {
          await client.query(`
            INSERT INTO targeted_students (
              student_id, school_id, subject, target_grade, current_grade,
              baseline_marks, target_marks, target_year, target_exam,
              intervention_type, priority_level
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            targetedStudent.student_id,
            targetedStudent.school_id,
            targetedStudent.subject,
            targetedStudent.target_grade,
            targetedStudent.current_grade,
            targetedStudent.baseline_marks,
            targetedStudent.target_marks,
            targetedStudent.target_year,
            targetedStudent.target_exam,
            targetedStudent.intervention_type,
            targetedStudent.priority_level
          ]);
          targetedStudentsCreated++;
        }
      }

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Exam and progress tracking schema setup completed successfully',
          tables_created: [
            'targeted_students',
            'exam_sessions', 
            'exam_subjects',
            'student_exam_results',
            'student_progress_tracking',
            'intervention_programs',
            'student_interventions'
          ],
          indexes_created: 14,
          sample_data: {
            exam_sessions: sessionsCreated,
            exam_subjects: subjectsCreated,
            targeted_students: targetedStudentsCreated
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
    console.error('Exam schema setup error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Exam schema setup failed'
      })
    };
  }
};