// Comprehensive subjects management for JohorUP System
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
          error: 'Database not configured'
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
      const { action, ...data } = JSON.parse(event.body || '{}');

      switch (action) {
        case 'get_subjects':
          return await getSubjects(client, data, headers);
        
        case 'get_subject_teachers':
          return await getSubjectTeachers(client, data, headers);
        
        case 'assign_teacher_subject':
          return await assignTeacherSubject(client, data, headers);
        
        case 'get_subject_performance':
          return await getSubjectPerformance(client, data, headers);
        
        case 'add_subject_resource':
          return await addSubjectResource(client, data, headers);
        
        case 'get_subject_resources':
          return await getSubjectResources(client, data, headers);
        
        case 'create_timetable':
          return await createTimetable(client, data, headers);
        
        case 'get_timetable':
          return await getTimetable(client, data, headers);
        
        case 'get_subjects_dashboard':
          return await getSubjectsDashboard(client, data, headers);
        
        case 'update_subject_performance':
          return await updateSubjectPerformance(client, data, headers);
        
        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              status: 'error',
              error: 'Invalid action specified'
            })
          };
      }

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Subjects management error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Subjects management failed'
      })
    };
  }
};

// Get subjects with filtering
async function getSubjects(client, data, headers) {
  const { category, subject_type, form_level, curriculum_standard, is_active = true } = data;
  
  let whereConditions = ['s.is_active = $1'];
  let queryParams = [is_active];
  let paramIndex = 2;

  if (category) {
    whereConditions.push(`s.subject_category = $${paramIndex}`);
    queryParams.push(category);
    paramIndex++;
  }

  if (subject_type) {
    whereConditions.push(`s.subject_type = $${paramIndex}`);
    queryParams.push(subject_type);
    paramIndex++;
  }

  if (form_level) {
    whereConditions.push(`$${paramIndex} = ANY(s.form_levels)`);
    queryParams.push(form_level);
    paramIndex++;
  }

  if (curriculum_standard) {
    whereConditions.push(`s.curriculum_standard = $${paramIndex}`);
    queryParams.push(curriculum_standard);
    paramIndex++;
  }

  const query = `
    SELECT 
      s.*,
      COUNT(st.id) as assigned_teachers,
      COUNT(DISTINCT st.school_id) as schools_offering,
      AVG(spa.pass_rate) as average_pass_rate,
      COUNT(sr.id) as available_resources
    FROM subjects s
    LEFT JOIN subject_teachers st ON s.id = st.subject_id AND st.is_active = true
    LEFT JOIN subject_performance_analytics spa ON s.id = spa.subject_id
    LEFT JOIN subject_resources sr ON s.id = sr.subject_id AND sr.approval_status = 'APPROVED'
    WHERE ${whereConditions.join(' AND ')}
    GROUP BY s.id
    ORDER BY s.display_order, s.subject_name_bm
  `;

  const result = await client.query(query, queryParams);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: result.rows,
      total_count: result.rows.length
    })
  };
}

// Get subject teacher assignments
async function getSubjectTeachers(client, data, headers) {
  const { school_id, subject_id, teacher_id, academic_year = 2026, is_active = true } = data;
  
  let whereConditions = ['st.is_active = $1', 'st.academic_year = $2'];
  let queryParams = [is_active, academic_year];
  let paramIndex = 3;

  if (school_id) {
    whereConditions.push(`st.school_id = $${paramIndex}`);
    queryParams.push(school_id);
    paramIndex++;
  }

  if (subject_id) {
    whereConditions.push(`st.subject_id = $${paramIndex}`);
    queryParams.push(subject_id);
    paramIndex++;
  }

  if (teacher_id) {
    whereConditions.push(`st.teacher_id = $${paramIndex}`);
    queryParams.push(teacher_id);
    paramIndex++;
  }

  const query = `
    SELECT 
      st.*,
      u.name as teacher_name,
      u.email as teacher_email,
      s.subject_name_bm,
      s.subject_code,
      s.subject_category,
      sch.name as school_name,
      ppd.name as ppd_name,
      COUNT(ser.id) as students_with_results,
      AVG(ser.total_marks) as average_student_marks
    FROM subject_teachers st
    JOIN users u ON st.teacher_id = u.id
    JOIN subjects s ON st.subject_id = s.id
    JOIN schools sch ON st.school_id = sch.id
    LEFT JOIN ppd ppd ON sch.ppd_id = ppd.id
    LEFT JOIN student_exam_results ser ON st.teacher_id = ser.entered_by AND st.subject_id = ser.subject_id
    WHERE ${whereConditions.join(' AND ')}
    GROUP BY st.id, u.name, u.email, s.subject_name_bm, s.subject_code, s.subject_category, sch.name, ppd.name
    ORDER BY sch.name, u.name, s.subject_name_bm
  `;

  const result = await client.query(query, queryParams);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: result.rows,
      total_count: result.rows.length
    })
  };
}

// Assign teacher to subject
async function assignTeacherSubject(client, data, headers) {
  const {
    teacher_id,
    subject_id,
    school_id,
    form_levels,
    classes,
    academic_year = 2026,
    periods_per_week,
    total_students,
    specialization_areas,
    teaching_experience_years,
    qualification_level,
    assignment_type = 'PERMANENT'
  } = data;

  // Check if assignment already exists
  const existingResult = await client.query(`
    SELECT id FROM subject_teachers 
    WHERE teacher_id = $1 AND subject_id = $2 AND school_id = $3 AND academic_year = $4
  `, [teacher_id, subject_id, school_id, academic_year]);

  if (existingResult.rows.length > 0) {
    client.release();
    await pool.end();
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'Teacher already assigned to this subject for the academic year'
      })
    };
  }

  // Insert new assignment
  const insertResult = await client.query(`
    INSERT INTO subject_teachers (
      teacher_id, subject_id, school_id, form_levels, classes,
      academic_year, periods_per_week, total_students,
      specialization_areas, teaching_experience_years, qualification_level,
      assignment_type, start_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_DATE)
    RETURNING id
  `, [
    teacher_id, subject_id, school_id, form_levels, classes,
    academic_year, periods_per_week, total_students,
    specialization_areas, teaching_experience_years, qualification_level,
    assignment_type
  ]);

  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'Teacher assigned to subject successfully',
      assignment_id: insertResult.rows[0].id
    })
  };
}

// Get subject performance analytics
async function getSubjectPerformance(client, data, headers) {
  const { school_id, subject_id, academic_year = 2026, exam_session_id } = data;
  
  let whereConditions = ['spa.academic_year = $1'];
  let queryParams = [academic_year];
  let paramIndex = 2;

  if (school_id) {
    whereConditions.push(`spa.school_id = $${paramIndex}`);
    queryParams.push(school_id);
    paramIndex++;
  }

  if (subject_id) {
    whereConditions.push(`spa.subject_id = $${paramIndex}`);
    queryParams.push(subject_id);
    paramIndex++;
  }

  if (exam_session_id) {
    whereConditions.push(`spa.exam_session_id = $${paramIndex}`);
    queryParams.push(exam_session_id);
    paramIndex++;
  }

  const query = `
    SELECT 
      spa.*,
      s.subject_name_bm,
      s.subject_code,
      s.subject_category,
      sch.name as school_name,
      ppd.name as ppd_name,
      es.session_name,
      es.exam_type,
      CASE 
        WHEN spa.pass_rate >= 80 THEN 'EXCELLENT'
        WHEN spa.pass_rate >= 60 THEN 'GOOD'
        WHEN spa.pass_rate >= 40 THEN 'SATISFACTORY'
        ELSE 'NEEDS_IMPROVEMENT'
      END as performance_category
    FROM subject_performance_analytics spa
    JOIN subjects s ON spa.subject_id = s.id
    JOIN schools sch ON spa.school_id = sch.id
    LEFT JOIN ppd ppd ON sch.ppd_id = ppd.id
    LEFT JOIN exam_sessions es ON spa.exam_session_id = es.id
    WHERE ${whereConditions.join(' AND ')}
    ORDER BY spa.pass_rate DESC, spa.average_marks DESC
  `;

  const result = await client.query(query, queryParams);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: result.rows,
      total_count: result.rows.length
    })
  };
}

// Add subject resource
async function addSubjectResource(client, data, headers) {
  const {
    subject_id,
    resource_title,
    resource_type,
    author_publisher,
    publication_year,
    isbn_code,
    language = 'BM',
    form_levels,
    curriculum_alignment,
    resource_url,
    file_path,
    access_type = 'FREE',
    description,
    tags,
    file_size_mb
  } = data;

  const insertResult = await client.query(`
    INSERT INTO subject_resources (
      subject_id, resource_title, resource_type, author_publisher,
      publication_year, isbn_code, language, form_levels,
      curriculum_alignment, resource_url, file_path, access_type,
      description, tags, file_size_mb
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id
  `, [
    subject_id, resource_title, resource_type, author_publisher,
    publication_year, isbn_code, language, form_levels,
    curriculum_alignment, resource_url, file_path, access_type,
    description, tags, file_size_mb
  ]);

  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'Subject resource added successfully',
      resource_id: insertResult.rows[0].id
    })
  };
}

// Get subject resources
async function getSubjectResources(client, data, headers) {
  const { subject_id, resource_type, form_level, approval_status = 'APPROVED' } = data;
  
  let whereConditions = ['sr.approval_status = $1'];
  let queryParams = [approval_status];
  let paramIndex = 2;

  if (subject_id) {
    whereConditions.push(`sr.subject_id = $${paramIndex}`);
    queryParams.push(subject_id);
    paramIndex++;
  }

  if (resource_type) {
    whereConditions.push(`sr.resource_type = $${paramIndex}`);
    queryParams.push(resource_type);
    paramIndex++;
  }

  if (form_level) {
    whereConditions.push(`$${paramIndex} = ANY(sr.form_levels)`);
    queryParams.push(form_level);
    paramIndex++;
  }

  const query = `
    SELECT 
      sr.*,
      s.subject_name_bm,
      s.subject_code,
      u.name as approved_by_name
    FROM subject_resources sr
    JOIN subjects s ON sr.subject_id = s.id
    LEFT JOIN users u ON sr.approved_by = u.id
    WHERE ${whereConditions.join(' AND ')}
    ORDER BY sr.usage_rating DESC, sr.resource_title
  `;

  const result = await client.query(query, queryParams);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: result.rows,
      total_count: result.rows.length
    })
  };
}

// Create timetable entry
async function createTimetable(client, data, headers) {
  const {
    school_id,
    subject_id,
    teacher_id,
    form_level,
    class_name,
    academic_year = 2026,
    semester = 'FULL_YEAR',
    day_of_week,
    period_number,
    start_time,
    end_time,
    duration_minutes,
    classroom,
    laboratory,
    special_room
  } = data;

  // Check for conflicts
  const conflictResult = await client.query(`
    SELECT id FROM subject_timetables 
    WHERE school_id = $1 AND day_of_week = $2 AND period_number = $3 
    AND classroom = $4 AND academic_year = $5 AND is_active = true
  `, [school_id, day_of_week, period_number, classroom, academic_year]);

  if (conflictResult.rows.length > 0) {
    client.release();
    await pool.end();
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'Timetable conflict: Classroom already occupied at this time'
      })
    };
  }

  const insertResult = await client.query(`
    INSERT INTO subject_timetables (
      school_id, subject_id, teacher_id, form_level, class_name,
      academic_year, semester, day_of_week, period_number,
      start_time, end_time, duration_minutes, classroom,
      laboratory, special_room
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id
  `, [
    school_id, subject_id, teacher_id, form_level, class_name,
    academic_year, semester, day_of_week, period_number,
    start_time, end_time, duration_minutes, classroom,
    laboratory, special_room
  ]);

  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'Timetable entry created successfully',
      timetable_id: insertResult.rows[0].id
    })
  };
}

// Get timetable
async function getTimetable(client, data, headers) {
  const { school_id, teacher_id, form_level, academic_year = 2026, day_of_week } = data;
  
  let whereConditions = ['st.academic_year = $1', 'st.is_active = true'];
  let queryParams = [academic_year];
  let paramIndex = 2;

  if (school_id) {
    whereConditions.push(`st.school_id = $${paramIndex}`);
    queryParams.push(school_id);
    paramIndex++;
  }

  if (teacher_id) {
    whereConditions.push(`st.teacher_id = $${paramIndex}`);
    queryParams.push(teacher_id);
    paramIndex++;
  }

  if (form_level) {
    whereConditions.push(`st.form_level = $${paramIndex}`);
    queryParams.push(form_level);
    paramIndex++;
  }

  if (day_of_week) {
    whereConditions.push(`st.day_of_week = $${paramIndex}`);
    queryParams.push(day_of_week);
    paramIndex++;
  }

  const query = `
    SELECT 
      st.*,
      s.subject_name_bm,
      s.subject_code,
      u.name as teacher_name,
      sch.name as school_name,
      CASE st.day_of_week
        WHEN 1 THEN 'Isnin'
        WHEN 2 THEN 'Selasa'
        WHEN 3 THEN 'Rabu'
        WHEN 4 THEN 'Khamis'
        WHEN 5 THEN 'Jumaat'
        WHEN 6 THEN 'Sabtu'
        WHEN 7 THEN 'Ahad'
      END as day_name
    FROM subject_timetables st
    JOIN subjects s ON st.subject_id = s.id
    JOIN users u ON st.teacher_id = u.id
    JOIN schools sch ON st.school_id = sch.id
    WHERE ${whereConditions.join(' AND ')}
    ORDER BY st.day_of_week, st.period_number, st.form_level, st.class_name
  `;

  const result = await client.query(query, queryParams);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: result.rows,
      total_count: result.rows.length
    })
  };
}

// Get subjects dashboard statistics
async function getSubjectsDashboard(client, data, headers) {
  const { school_id, academic_year = 2026 } = data;
  
  let schoolFilter = '';
  let queryParams = [academic_year];
  
  if (school_id) {
    schoolFilter = 'AND st.school_id = $2';
    queryParams.push(school_id);
  }

  const dashboardQuery = `
    SELECT 
      COUNT(DISTINCT s.id) as total_subjects,
      COUNT(DISTINCT CASE WHEN s.subject_category = 'CORE' THEN s.id END) as core_subjects,
      COUNT(DISTINCT CASE WHEN s.subject_category = 'ELECTIVE' THEN s.id END) as elective_subjects,
      COUNT(DISTINCT CASE WHEN s.subject_category = 'ADDITIONAL' THEN s.id END) as additional_subjects,
      COUNT(DISTINCT st.teacher_id) as total_teachers,
      COUNT(DISTINCT st.school_id) as schools_offering,
      AVG(spa.pass_rate) as overall_pass_rate,
      COUNT(DISTINCT sr.id) as total_resources
    FROM subjects s
    LEFT JOIN subject_teachers st ON s.id = st.subject_id AND st.academic_year = $1 AND st.is_active = true ${schoolFilter}
    LEFT JOIN subject_performance_analytics spa ON s.id = spa.subject_id AND spa.academic_year = $1
    LEFT JOIN subject_resources sr ON s.id = sr.subject_id AND sr.approval_status = 'APPROVED'
    WHERE s.is_active = true
  `;

  const dashboardResult = await client.query(dashboardQuery, queryParams);
  
  // Get subject performance breakdown
  const performanceQuery = `
    SELECT 
      s.subject_category,
      COUNT(spa.id) as schools_analyzed,
      AVG(spa.pass_rate) as avg_pass_rate,
      AVG(spa.average_marks) as avg_marks,
      COUNT(CASE WHEN spa.pass_rate >= 80 THEN 1 END) as excellent_schools,
      COUNT(CASE WHEN spa.pass_rate >= 60 AND spa.pass_rate < 80 THEN 1 END) as good_schools,
      COUNT(CASE WHEN spa.pass_rate < 60 THEN 1 END) as needs_improvement_schools
    FROM subjects s
    LEFT JOIN subject_performance_analytics spa ON s.id = spa.subject_id AND spa.academic_year = $1
    WHERE s.is_active = true
    GROUP BY s.subject_category
    ORDER BY s.subject_category
  `;

  const performanceResult = await client.query(performanceQuery, [academic_year]);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: {
        overview: dashboardResult.rows[0],
        performance_by_category: performanceResult.rows
      }
    })
  };
}

// Update subject performance analytics
async function updateSubjectPerformance(client, data, headers) {
  const {
    subject_id,
    school_id,
    exam_session_id,
    total_students,
    students_passed,
    students_failed,
    grade_distribution,
    average_marks,
    median_marks,
    highest_marks,
    lowest_marks,
    standard_deviation,
    national_average,
    state_average,
    ppd_average,
    academic_year = 2026
  } = data;

  // Calculate performance index
  const performanceIndex = national_average > 0 ? (average_marks / national_average) * 100 : 0;

  const insertResult = await client.query(`
    INSERT INTO subject_performance_analytics (
      subject_id, school_id, exam_session_id, total_students,
      students_passed, students_failed, grade_a_plus, grade_a, grade_a_minus,
      grade_b_plus, grade_b, grade_c_plus, grade_c, grade_d, grade_e, grade_g,
      average_marks, median_marks, highest_marks, lowest_marks, standard_deviation,
      national_average, state_average, ppd_average, performance_index, academic_year
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
    ON CONFLICT (subject_id, school_id, exam_session_id) 
    DO UPDATE SET
      total_students = EXCLUDED.total_students,
      students_passed = EXCLUDED.students_passed,
      students_failed = EXCLUDED.students_failed,
      grade_a_plus = EXCLUDED.grade_a_plus,
      grade_a = EXCLUDED.grade_a,
      grade_a_minus = EXCLUDED.grade_a_minus,
      grade_b_plus = EXCLUDED.grade_b_plus,
      grade_b = EXCLUDED.grade_b,
      grade_c_plus = EXCLUDED.grade_c_plus,
      grade_c = EXCLUDED.grade_c,
      grade_d = EXCLUDED.grade_d,
      grade_e = EXCLUDED.grade_e,
      grade_g = EXCLUDED.grade_g,
      average_marks = EXCLUDED.average_marks,
      median_marks = EXCLUDED.median_marks,
      highest_marks = EXCLUDED.highest_marks,
      lowest_marks = EXCLUDED.lowest_marks,
      standard_deviation = EXCLUDED.standard_deviation,
      national_average = EXCLUDED.national_average,
      state_average = EXCLUDED.state_average,
      ppd_average = EXCLUDED.ppd_average,
      performance_index = EXCLUDED.performance_index,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id
  `, [
    subject_id, school_id, exam_session_id, total_students,
    students_passed, students_failed,
    grade_distribution?.a_plus || 0, grade_distribution?.a || 0, grade_distribution?.a_minus || 0,
    grade_distribution?.b_plus || 0, grade_distribution?.b || 0, grade_distribution?.c_plus || 0,
    grade_distribution?.c || 0, grade_distribution?.d || 0, grade_distribution?.e || 0, grade_distribution?.g || 0,
    average_marks, median_marks, highest_marks, lowest_marks, standard_deviation,
    national_average, state_average, ppd_average, performanceIndex, academic_year
  ]);

  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'Subject performance analytics updated successfully',
      analytics_id: insertResult.rows[0].id
    })
  };
}