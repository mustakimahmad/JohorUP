// Demo authentication data for development
export const demoUsers = [
  {
    id: 1,
    email: 'admin@s4pd.gov.my',
    name: 'Admin S4PD',
    password: 'admin123',
    role: 'sektor_perancangan',
    school_id: null,
    ppd_id: null,
    school_name: null,
    ppd_name: null,
    is_active: true
  },
  {
    id: 2,
    email: 'spb.admin@jpnj.gov.my',
    name: 'Admin SPB',
    password: 'spb123',
    role: 'sektor_pembelajaran',
    school_id: null,
    ppd_id: null,
    school_name: null,
    ppd_name: null,
    is_active: true
  },
  {
    id: 3,
    email: 'spm.admin@jpnj.gov.my',
    name: 'Admin SPM',
    password: 'spm123',
    role: 'sektor_pembelajaran',
    school_id: null,
    ppd_id: null,
    school_name: null,
    ppd_name: null,
    is_active: true
  },
  {
    id: 4,
    email: 'strategic@jcorp.com.my',
    name: 'Strategic Viewer JCorp',
    password: 'jcorp123',
    role: 'yayasan_jcorp',
    school_id: null,
    ppd_id: null,
    school_name: null,
    ppd_name: null,
    is_active: true
  },
  {
    id: 5,
    email: 'strategic@hasanah.com.my',
    name: 'Strategic Viewer Hasanah',
    password: 'hasanah123',
    role: 'yayasan_jcorp',
    school_id: null,
    ppd_id: null,
    school_name: null,
    ppd_name: null,
    is_active: true
  },
  {
    id: 6,
    email: 'ppd.jb@jpnj.gov.my',
    name: 'PPD Johor Bahru',
    password: 'ppd123',
    role: 'ppd',
    school_id: null,
    ppd_id: 1,
    school_name: null,
    ppd_name: 'PPD Johor Bahru',
    is_active: true
  },
  {
    id: 7,
    email: 'school.demo@jpnj.gov.my',
    name: 'Sekolah Demo',
    password: 'school123',
    role: 'school',
    school_id: 1,
    ppd_id: null,
    school_name: 'SMK Demo',
    ppd_name: null,
    is_active: true
  },
  {
    id: 8,
    email: 'teacher.math@jpnj.gov.my',
    name: 'Guru Matematik',
    password: 'teacher123',
    role: 'school',
    school_id: 1,
    ppd_id: null,
    school_name: 'SMK Demo',
    ppd_name: null,
    is_active: true
  },
  {
    id: 9,
    email: 'sisc.math@jpnj.gov.my',
    name: 'SISC+ Matematik',
    password: 'sisc123',
    role: 'ppd',
    school_id: null,
    ppd_id: 1,
    school_name: null,
    ppd_name: 'PPD Johor Bahru',
    is_active: true
  }
];

export function findUserByEmail(email: string) {
  return demoUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function validatePassword(user: any, password: string) {
  return user.password === password;
}