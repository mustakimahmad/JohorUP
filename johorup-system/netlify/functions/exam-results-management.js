// Comprehensive exam results and progress tracking management
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
        case 'get_targeted_students':
          return await getTargetedStudents(client, data, headers);
        
        case 'add_exam_result':
          return await addExamResult(client, data, headers);
        
        case 'get_exam_results':
          return await getExamResults(client, data, headers);
        
        case 'update_progress_tracking':
          return await updateProgressTracking(client, data, headers);
        
        case 'get_progress_analysis':
          return await getProgressAnalysis(client, data, headers);
        
        case 'get_intervention_recommendations':
          return await getInterventionRecommendations(client, data, headers);
        
        case 'get_exam_sessions':
          return await getExamSessions(client, data, headers);
        
        case 'get_dashboard_stats':
          return await getDashboardStats(client, data, headers);
        
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
    console.error('Exam results management error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Exam results management failed'
      })
    };
  }
};

// Get targeted students with current progress
async function getTargetedStudents(client, data, headers) {
  const { school_id, subject, priority_level, status = 'ACTIVE' } = data;
  
  let whereConditions = ['ts.status = $1'];
  let queryParams = [status];
  let paramIndex = 2;

  if (school_id) {
    whereConditions.push(`ts.school_id = $${paramIndex}`);
    queryParams.push(school_id);
    paramIndex++;
  }

  if (subject) {
    whereConditions.push(`ts.subject = $${paramIndex}`);
    queryParams.push(subject);
    paramIndex++;
  }

  if (priority_level) {
    whereConditions.push(`ts.priority_level = $${paramIndex}`);
    queryParams.push(priority_level);
    paramIndex++;
  }

  const query = `
    SELECT 
      ts.*,
      s.name as student_name,
      s.ic_number,
      s.class_level,
      s.class_name,
      sch.name as school_name,
      ppd.name as ppd_name,
      pt.current_marks,
      pt.marks_improvement,
      pt.percentage_improvement,
      pt.progress_to_target,
      pt.risk_level,
      pt.is_on_track,
      u_teacher.name as teacher_name,
      u_sisc.name as sisc_name
    FROM targeted_students ts
    JOIN students s ON ts.student_id = s.id
    JOIN schools sch ON ts.school_id = sch.id
    LEFT JOIN ppd ppd ON sch.ppd_id = ppd.id
    LEFT JOIN student_progress_tracking pt ON ts.id = pt.targeted_student_id
    LEFT JOIN users u_teacher ON ts.assigned_teacher_id = u_teacher.id
    LEFT JOIN users u_sisc ON ts.assigned_sisc_id = u_sisc.id
    WHERE ${whereConditions.join(' AND ')}
    ORDER BY 
      CASE ts.priority_level 
        WHEN 'HIGH' THEN 1 
        WHEN 'MEDIUM' THEN 2 
        WHEN 'LOW' THEN 3 
      END,
      pt.progress_to_target ASC NULLS LAST,
      s.name
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

// Add exam result for a student
async function addExamResult(client, data, headers) {
  const {
    student_id,
    session_id,
    subject_id,
    school_id,
    paper_1_marks,
    paper_2_marks,
    paper_3_marks,
    total_marks,
    grade,
    entered_by
  } = data;

  // Calculate percentage
  const subjectResult = await client.query(
    'SELECT total_marks FROM exam_subjects WHERE id = $1',
    [subject_id]
  );
  
  if (subjectResult.rows.length === 0) {
    client.release();
    await pool.end();
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'Invalid subject ID'
      })
    };
  }

  const maxMarks = subjectResult.rows[0].total_marks;
  const percentage = (total_marks / maxMarks) * 100;

  // Check if student is targeted
  const targetedCheck = await client.query(`
    SELECT id FROM targeted_students 
    WHERE student_id = $1 AND school_id = $2 AND status = 'ACTIVE'
  `, [student_id, school_id]);

  const isTargeted = targetedCheck.rows.length > 0;

  // Insert exam result
  const insertResult = await client.query(`
    INSERT INTO student_exam_results (
      student_id, session_id, subject_id, school_id,
      paper_1_marks, paper_2_marks, paper_3_marks, total_marks,
      percentage, grade, is_targeted_student, entered_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id
  `, [
    student_id, session_id, subject_id, school_id,
    paper_1_marks, paper_2_marks, paper_3_marks, total_marks,
    percentage, grade, isTargeted, entered_by
  ]);

  // If student is targeted, update progress tracking
  if (isTargeted) {
    await updateStudentProgress(client, student_id, session_id, total_marks, grade);
  }

  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'Exam result added successfully',
      result_id: insertResult.rows[0].id,
      is_targeted_student: isTargeted
    })
  };
}

// Update student progress tracking
async function updateStudentProgress(client, studentId, sessionId, currentMarks, currentGrade) {
  // Get targeted student info
  const targetedResult = await client.query(`
    SELECT id, baseline_marks, target_marks, target_grade, subject
    FROM targeted_students 
    WHERE student_id = $1 AND status = 'ACTIVE'
  `, [studentId]);

  if (targetedResult.rows.length === 0) return;

  const targeted = targetedResult.rows[0];
  
  // Calculate improvements and progress
  const marksImprovement = currentMarks - targeted.baseline_marks;
  const percentageImprovement = targeted.baseline_marks > 0 
    ? ((currentMarks - targeted.baseline_marks) / targeted.baseline_marks) * 100 
    : 0;
  
  const progressToTarget = targeted.target_marks > targeted.baseline_marks
    ? ((currentMarks - targeted.baseline_marks) / (targeted.target_marks - targeted.baseline_marks)) * 100
    : 100;

  const isOnTrack = currentMarks >= targeted.target_marks;
  
  let riskLevel = 'LOW';
  if (!isOnTrack) {
    if (currentMarks < (targeted.baseline_marks + (targeted.target_marks - targeted.baseline_marks) * 0.5)) {
      riskLevel = 'HIGH';
    } else {
      riskLevel = 'MEDIUM';
    }
  }

  // Insert or update progress tracking
  await client.query(`
    INSERT INTO student_progress_tracking (
      student_id, targeted_student_id, subject, current_session_id,
      baseline_marks, current_marks, baseline_grade, current_grade,
      marks_improvement, percentage_improvement, target_marks, target_grade,
      progress_to_target, is_on_track, risk_level
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    ON CONFLICT (student_id, targeted_student_id, subject) 
    DO UPDATE SET
      current_session_id = EXCLUDED.current_session_id,
      current_marks = EXCLUDED.current_marks,
      current_grade = EXCLUDED.current_grade,
      marks_improvement = EXCLUDED.marks_improvement,
      percentage_improvement = EXCLUDED.percentage_improvement,
      progress_to_target = EXCLUDED.progress_to_target,
      is_on_track = EXCLUDED.is_on_track,
      risk_level = EXCLUDED.risk_level,
      updated_at = CURRENT_TIMESTAMP
  `, [
    studentId, targeted.id, targeted.subject, sessionId,
    targeted.baseline_marks, currentMarks, 'C+', currentGrade,
    marksImprovement, percentageImprovement, targeted.target_marks, targeted.target_grade,
    progressToTarget, isOnTrack, riskLevel
  ]);
}

// Get exam results with filtering
async function getExamResults(client, data, headers) {
  const { school_id, session_id, subject_id, student_id, targeted_only } = data;
  
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  if (school_id) {
    whereConditions.push(`ser.school_id = $${paramIndex}`);
    queryParams.push(school_id);
    paramIndex++;
  }

  if (session_id) {
    whereConditions.push(`ser.session_id = $${paramIndex}`);
    queryParams.push(session_id);
    paramIndex++;
  }

  if (subject_id) {
    whereConditions.push(`ser.subject_id = $${paramIndex}`);
    queryParams.push(subject_id);
    paramIndex++;
  }

  if (student_id) {
    whereConditions.push(`ser.student_id = $${paramIndex}`);
    queryParams.push(student_id);
    paramIndex++;
  }

  if (targeted_only) {
    whereConditions.push('ser.is_targeted_student = true');
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      ser.*,
      s.name as student_name,
      s.ic_number,
      s.class_level,
      s.class_name,
      sch.name as school_name,
      es.session_name,
      es.exam_type,
      subj.subject_name,
      subj.subject_code,
      u_entered.name as entered_by_name,
      u_verified.name as verified_by_name
    FROM student_exam_results ser
    JOIN students s ON ser.student_id = s.id
    JOIN schools sch ON ser.school_id = sch.id
    JOIN exam_sessions es ON ser.session_id = es.id
    JOIN exam_subjects subj ON ser.subject_id = subj.id
    LEFT JOIN users u_entered ON ser.entered_by = u_entered.id
    LEFT JOIN users u_verified ON ser.verified_by = u_verified.id
    ${whereClause}
    ORDER BY s.name, subj.subject_name
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

// Get progress analysis for targeted students
async function getProgressAnalysis(client, data, headers) {
  const { school_id, subject, risk_level } = data;
  
  let whereConditions = ['ts.status = $1'];
  let queryParams = ['ACTIVE'];
  let paramIndex = 2;

  if (school_id) {
    whereConditions.push(`ts.school_id = $${paramIndex}`);
    queryParams.push(school_id);
    paramIndex++;
  }

  if (subject) {
    whereConditions.push(`ts.subject = $${paramIndex}`);
    queryParams.push(subject);
    paramIndex++;
  }

  if (risk_level) {
    whereConditions.push(`pt.risk_level = $${paramIndex}`);
    queryParams.push(risk_level);
    paramIndex++;
  }

  const query = `
    SELECT 
      ts.subject,
      COUNT(ts.id) as total_targeted,
      COUNT(pt.id) as students_with_progress,
      COUNT(CASE WHEN pt.is_on_track = true THEN 1 END) as on_track_count,
      COUNT(CASE WHEN pt.risk_level = 'HIGH' THEN 1 END) as high_risk_count,
      COUNT(CASE WHEN pt.risk_level = 'MEDIUM' THEN 1 END) as medium_risk_count,
      COUNT(CASE WHEN pt.risk_level = 'LOW' THEN 1 END) as low_risk_count,
      AVG(pt.marks_improvement) as avg_improvement,
      AVG(pt.percentage_improvement) as avg_percentage_improvement,
      AVG(pt.progress_to_target) as avg_progress_to_target
    FROM targeted_students ts
    LEFT JOIN student_progress_tracking pt ON ts.id = pt.targeted_student_id
    WHERE ${whereConditions.join(' AND ')}
    GROUP BY ts.subject
    ORDER BY ts.subject
  `;

  const result = await client.query(query, queryParams);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: result.rows
    })
  };
}

// Get intervention recommendations
async function getInterventionRecommendations(client, data, headers) {
  const query = `
    SELECT 
      s.name as student_name,
      s.ic_number,
      ts.subject,
      ts.priority_level,
      pt.risk_level,
      pt.current_marks,
      pt.target_marks,
      pt.progress_to_target,
      CASE 
        WHEN pt.risk_level = 'HIGH' AND pt.progress_to_target < 25 THEN 'Intensive remedial program required'
        WHEN pt.risk_level = 'HIGH' THEN 'Additional tuition recommended'
        WHEN pt.risk_level = 'MEDIUM' AND pt.progress_to_target < 50 THEN 'Regular monitoring and support'
        WHEN pt.risk_level = 'MEDIUM' THEN 'Peer tutoring program'
        ELSE 'Continue current approach'
      END as recommendation,
      sch.name as school_name
    FROM targeted_students ts
    JOIN students s ON ts.student_id = s.id
    JOIN schools sch ON ts.school_id = sch.id
    LEFT JOIN student_progress_tracking pt ON ts.id = pt.targeted_student_id
    WHERE ts.status = 'ACTIVE' AND pt.risk_level IN ('HIGH', 'MEDIUM')
    ORDER BY 
      CASE pt.risk_level WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END,
      pt.progress_to_target ASC
  `;

  const result = await client.query(query);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: result.rows,
      total_recommendations: result.rows.length
    })
  };
}

// Get exam sessions
async function getExamSessions(client, data, headers) {
  const { academic_year, exam_type, status } = data;
  
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  if (academic_year) {
    whereConditions.push(`academic_year = $${paramIndex}`);
    queryParams.push(academic_year);
    paramIndex++;
  }

  if (exam_type) {
    whereConditions.push(`exam_type = $${paramIndex}`);
    queryParams.push(exam_type);
    paramIndex++;
  }

  if (status) {
    whereConditions.push(`status = $${paramIndex}`);
    queryParams.push(status);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      es.*,
      COUNT(subj.id) as subject_count,
      COUNT(ser.id) as results_count
    FROM exam_sessions es
    LEFT JOIN exam_subjects subj ON es.id = subj.session_id
    LEFT JOIN student_exam_results ser ON es.id = ser.session_id
    ${whereClause}
    GROUP BY es.id
    ORDER BY es.start_date DESC
  `;

  const result = await client.query(query, queryParams);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: result.rows
    })
  };
}

// Get dashboard statistics
async function getDashboardStats(client, data, headers) {
  const { school_id } = data;
  
  let schoolFilter = '';
  let queryParams = [];
  
  if (school_id) {
    schoolFilter = 'WHERE ts.school_id = $1';
    queryParams = [school_id];
  }

  const statsQuery = `
    SELECT 
      COUNT(DISTINCT ts.id) as total_targeted_students,
      COUNT(DISTINCT CASE WHEN pt.is_on_track = true THEN ts.id END) as on_track_students,
      COUNT(DISTINCT CASE WHEN pt.risk_level = 'HIGH' THEN ts.id END) as high_risk_students,
      COUNT(DISTINCT CASE WHEN pt.risk_level = 'MEDIUM' THEN ts.id END) as medium_risk_students,
      COUNT(DISTINCT CASE WHEN pt.risk_level = 'LOW' THEN ts.id END) as low_risk_students,
      AVG(pt.marks_improvement) as avg_improvement,
      AVG(pt.progress_to_target) as avg_progress_to_target,
      COUNT(DISTINCT ser.id) as total_exam_results
    FROM targeted_students ts
    LEFT JOIN student_progress_tracking pt ON ts.id = pt.targeted_student_id
    LEFT JOIN student_exam_results ser ON ts.student_id = ser.student_id AND ser.is_targeted_student = true
    ${schoolFilter}
  `;

  const statsResult = await client.query(statsQuery, queryParams);
  
  client.release();
  await pool.end();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      data: statsResult.rows[0]
    })
  };
}