// TypeScript types untuk sistem JohorUP

export type UserRole = 
  | 'super_admin_s4pd'      // Sektor Perancangan dan Pengurusan PPD (S4PD) - 3 users
  | 'admin_spb'             // Sektor Pembelajaran (SPB) - 5 users  
  | 'admin_spm'             // Sektor Pembangunan Murid (SPM) - 3 users
  | 'strategic_jcorp'       // Yayasan JCorp - 3 users
  | 'strategic_hasanah'     // Yayasan Hasanah - 2 users
  | 'tactical_ppd'          // Pejabat Pendidikan Daerah - 11 users
  | 'coaching_sisc'         // School Improvement Specialist Coach Plus (SISC+) - 66 users
  | 'operational_school'    // Sekolah - 22 users
  | 'operational_teacher';  // Guru - 132 users

export type UserLevel = 
  | 'Super Admin'           // S4PD - Full system access & management
  | 'Admin'                 // SPB & SPM - Administrative access by sector
  | 'Strategic Viewers'     // Yayasan - View strategic data & reports
  | 'Tactical User'         // PPD - Regional/district operations
  | 'Coaching User'         // SISC+ - Teacher guidance and monitoring
  | 'Operational User';     // School & Teacher - Daily operations

export type UserSector = 
  | 'S4PD'                  // Sektor Perancangan dan Pengurusan PPD
  | 'SPB'                   // Sektor Pembelajaran  
  | 'SPM'                   // Sektor Pembangunan Murid
  | 'JCORP'                 // Yayasan JCorp
  | 'HASANAH'               // Yayasan Hasanah
  | 'PPD'                   // Pejabat Pendidikan Daerah
  | 'SISC'                  // School Improvement Specialist Coach Plus
  | 'SCHOOL'                // Sekolah
  | 'TEACHER';              // Guru

export type ExamType = 
  | 'akhir_tingkatan_4' 
  | 'pertengahan_tahun' 
  | 'percubaan' 
  | 'spm'
  | 'akhir_tahun_2025_tingkatan_4'   // Peperiksaan Akhir Tahun 2025 Tingkatan 4
  | 'pertengahan_tahun_2026'         // Peperiksaan Pertengahan Tahun 2026
  | 'percubaan_spm_2026'             // Peperiksaan Percubaan SPM 2026
  | 'spm_2026';                      // Peperiksaan SPM 2026

export type ExamYear = '2024' | '2025' | '2026';

export type ExamStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E' | 'G' | 'TH';

// =====================================================
// AUDIT TRAIL TYPES
// =====================================================

export type AuditAction = 
  | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED'
  | 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW'
  | 'IMPORT' | 'EXPORT' | 'BACKUP' | 'RESTORE'
  | 'MAINTENANCE_START' | 'MAINTENANCE_END'
  | 'PASSWORD_CHANGE' | 'ROLE_CHANGE'
  | 'DATA_DOWNLOAD' | 'REPORT_GENERATE'
  | 'SYSTEM_CONFIG_CHANGE' | 'SECURITY_POLICY_VIOLATION';

export type AuditStatus = 'SUCCESS' | 'FAILED' | 'ERROR';

export type SystemEventType = 
  | 'MAINTENANCE' | 'BACKUP' | 'IMPORT' | 'EXPORT' 
  | 'SYSTEM_START' | 'SYSTEM_STOP' | 'DATABASE_MIGRATION'
  | 'AUDIT_CLEANUP' | 'DATA_SYNC' | 'SECURITY_SCAN';

export type SystemEventStatus = 'STARTED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type SecurityEventType = 
  | 'UNAUTHORIZED_ACCESS' | 'SUSPICIOUS_ACTIVITY' | 'BRUTE_FORCE'
  | 'DATA_BREACH_ATTEMPT' | 'PRIVILEGE_ESCALATION' | 'MALICIOUS_REQUEST'
  | 'ACCOUNT_LOCKOUT' | 'SECURITY_POLICY_VIOLATION';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuditLog {
  id: number;
  user_id?: number;
  user_email: string;
  user_name?: string;
  user_role?: string;
  action: AuditAction;
  table_name?: string;
  record_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  request_url?: string;
  request_method?: string;
  timestamp: string;
  status: AuditStatus;
  error_message?: string;
  additional_info?: any;
  created_at: string;
}

export interface LoginAttempt {
  id: number;
  email: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
  session_id?: string;
  timestamp: string;
  created_at: string;
}

export interface SystemEvent {
  id: number;
  event_type: SystemEventType;
  description: string;
  initiated_by?: number;
  initiated_by_email?: string;
  status: SystemEventStatus;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  details?: any;
  error_message?: string;
  created_at: string;
}

export interface DataChange {
  id: number;
  audit_log_id: number;
  field_name: string;
  old_value?: string;
  new_value?: string;
  data_type?: string;
  created_at: string;
}

export interface SecurityEvent {
  id: number;
  event_type: SecurityEventType;
  severity: SecuritySeverity;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  description: string;
  details?: any;
  resolved: boolean;
  resolved_by?: number;
  resolved_at?: string;
  created_at: string;
}

// Audit Trail Query Filters
export interface AuditLogFilters {
  user_id?: number;
  user_email?: string;
  action?: AuditAction;
  table_name?: string;
  status?: AuditStatus;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface LoginAttemptFilters {
  email?: string;
  success?: boolean;
  start_date?: string;
  end_date?: string;
  ip_address?: string;
  page?: number;
  limit?: number;
}

export interface SystemEventFilters {
  event_type?: SystemEventType;
  status?: SystemEventStatus;
  initiated_by?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface SecurityEventFilters {
  event_type?: SecurityEventType;
  severity?: SecuritySeverity;
  resolved?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

// Audit Trail Statistics
export interface AuditStatistics {
  total_logs: number;
  successful_actions: number;
  failed_actions: number;
  unique_users: number;
  most_active_user: string;
  most_common_action: AuditAction;
  login_success_rate: number;
  recent_activity_count: number;
}

export interface SecurityStatistics {
  total_events: number;
  critical_events: number;
  unresolved_events: number;
  brute_force_attempts: number;
  unauthorized_access_attempts: number;
  most_targeted_user: string;
  most_suspicious_ip: string;
}

// =====================================================
// EXISTING TYPES (Updated)
// =====================================================

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  level: UserLevel;
  sector: UserSector;
  school_id?: number;
  ppd_id?: number;
  yayasan?: string;
  permissions?: string[];
  created_at?: string;
  last_login?: string;
  is_active?: boolean;
}

export interface School {
  id: number;
  name: string;
  code: string;
  ppd_id: number;
  target_students: number;
  ppd?: PPD;
}

export interface PPD {
  id: number;
  name: string;
  code: string;
}

export interface Student {
  id: number;
  name: string;
  ic_number: string;
  school_id: number;
  class: string;
  school?: School;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface StudentGrade {
  id: number;
  student_id: number;
  subject_id: number;
  exam_type: ExamType;
  grade: Grade;
  year: number;
  marks?: number;
  percentage?: number;
  improvement_from_previous?: number;
  student?: Student;
  subject?: Subject;
}

// New interfaces for 2026 exam analysis
export interface ExamAnalysis2026 {
  id: number;
  exam_type: ExamType;
  exam_date: string;
  total_students: number;
  students_completed: number;
  overall_pass_rate: number;
  subject_analysis: SubjectAnalysis[];
  school_comparison: SchoolComparison[];
  improvement_trends: ImprovementTrend[];
  created_at: string;
}

export interface SubjectAnalysis {
  subject_id: number;
  subject_name: string;
  total_students: number;
  pass_rate: number;
  average_grade: string;
  grade_distribution: GradeDistribution[];
  improvement_from_previous: number;
}

export interface GradeDistribution {
  grade: Grade;
  count: number;
  percentage: number;
}

export interface SchoolComparison {
  school_id: number;
  school_name: string;
  total_students: number;
  pass_rate: number;
  average_performance: number;
  ranking: number;
  improvement_from_previous: number;
}

export interface ImprovementTrend {
  student_id: number;
  student_name: string;
  previous_exam_average: number;
  current_exam_average: number;
  improvement_percentage: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface StudentProgress {
  id: number;
  student_id: number;
  tracking_period: string;
  academic_performance: AcademicPerformance;
  behavioral_development: BehavioralDevelopment;
  co_curricular_participation: CoCurricularParticipation;
  overall_progress_score: number;
  recommendations: string[];
  created_at: string;
  student?: Student;
}

export interface AcademicPerformance {
  current_average: number;
  previous_average: number;
  improvement_rate: number;
  subject_strengths: string[];
  subject_weaknesses: string[];
  exam_readiness_2026: ExamReadiness2026;
}

export interface ExamReadiness2026 {
  pertengahan_tahun: ReadinessLevel;
  percubaan_spm: ReadinessLevel;
  spm_final: ReadinessLevel;
  predicted_grades: PredictedGrade[];
}

export interface ReadinessLevel {
  level: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'critical';
  score: number;
  areas_of_concern: string[];
  recommended_actions: string[];
}

export interface PredictedGrade {
  subject_id: number;
  subject_name: string;
  predicted_grade: Grade;
  confidence_level: number;
  factors_affecting: string[];
}

export interface BehavioralDevelopment {
  attendance_rate: number;
  discipline_record: string;
  leadership_qualities: number;
  teamwork_skills: number;
  communication_skills: number;
  overall_behavior_score: number;
}

export interface CoCurricularParticipation {
  activities: Activity[];
  leadership_roles: string[];
  achievements: Achievement[];
  participation_score: number;
}

export interface Activity {
  name: string;
  category: string;
  participation_level: 'active' | 'moderate' | 'minimal';
  duration_months: number;
}

export interface Achievement {
  title: string;
  category: string;
  level: 'school' | 'district' | 'state' | 'national' | 'international';
  date: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  program_type: string;
  target_subject_id: number;
  start_date: string;
  end_date: string;
  created_by: number;
  target_students?: number; // Bilangan murid disasarkan (optional, diisi oleh Sektor Pembelajaran)
  subject?: Subject;
}

export interface Budget {
  id: number;
  program_id: number;
  amount: number;
  description: string;
  status: 'planned' | 'approved' | 'spent' | 'pending_approval';
  program?: Program;
  approved_by?: number;
  approved_date?: string;
}

export interface Grant {
  id: number;
  program_id: number;
  amount: number;
  disbursed_by: number;
  disbursed_date: string;
  status: 'pending' | 'disbursed';
}

export interface DashboardStats {
  total_students: number;
  total_schools: number;
  total_budget: number;
  spent_budget: number;
  programs_count: number;
  passing_rate: {
    bahasa_melayu: number;
    sejarah: number;
    matematik: number;
  };
}

export interface Teacher {
  id: number;
  name: string;
  ic_number: string;
  school_id: number;
  subject_id: number;
  years_experience: number;
  qualification: string;
  phone: string;
  email: string;
  school?: School;
  subject?: Subject;
}

export interface TeacherKPI {
  id: number;
  teacher_id: number;
  assessment_date: string;
  pdp_score: number; // Skor Pencerapan PdP (0-100)
  assessed_by_ppd: number; // PPD yang menilai
  semester: 'semester_1' | 'semester_2';
  year: number;
  notes?: string;
  teacher?: Teacher;
  ppd?: PPD;
}

export interface ProgramReport {
  id: number;
  program_id: number;
  school_id: number;
  report_date: string;
  session_title: string;
  subject_id: number;
  teacher_name: string;
  duration_hours: number;
  topics_covered: string;
  notes?: string;
  status: 'draft' | 'submitted' | 'approved';
  submitted_by: number;
  submitted_date?: string;
  program?: Program;
  school?: School;
  subject?: Subject;
}

export interface StudentAttendance {
  id: number;
  program_report_id: number;
  student_id: number;
  present: boolean;
  notes?: string;
  student?: Student;
}

export interface ProgramPhoto {
  id: number;
  program_report_id: number;
  photo_url: string;
  caption?: string;
  uploaded_date: string;
}
