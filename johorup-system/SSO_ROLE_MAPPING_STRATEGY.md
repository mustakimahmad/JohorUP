# 🔐 Strategi Role Mapping untuk Google SSO - Sistem JohorUP

## 🎯 Masalah: Macam Mana SSO Bezakan Peranan?

Dalam Google SSO, semua user login dengan Google account yang sama format. Jadi macam mana sistem tahu:
- Siapa tu sekolah vs jabatan vs PPD?
- Sekolah mana yang dia represent?
- PPD mana yang dia handle?

## 💡 **5 Strategi Role Mapping**

### **Strategi 1: Email Pattern Recognition (Recommended)**

#### **A. Structured Email Naming Convention**
```typescript
// lib/auth.ts - Enhanced role detection
function determineUserRole(email: string, name: string) {
  const emailLower = email.toLowerCase();
  
  // 1. SEKOLAH PATTERN
  if (emailLower.includes('smk') || emailLower.includes('sekolah')) {
    // Extract school code from email
    const schoolMatch = emailLower.match(/smk([a-z0-9]+)|sekolah(\d+)/);
    const schoolCode = schoolMatch ? schoolMatch[1] || schoolMatch[2] : null;
    
    return {
      role: 'school',
      school_id: getSchoolIdByCode(schoolCode),
      ppd_id: null
    };
  }
  
  // 2. PPD PATTERN
  if (emailLower.includes('ppd')) {
    // Extract PPD area from email
    if (emailLower.includes('jb') || emailLower.includes('johorbahru')) {
      return { role: 'ppd', ppd_id: 1, school_id: null };
    }
    if (emailLower.includes('muar')) {
      return { role: 'ppd', ppd_id: 2, school_id: null };
    }
    if (emailLower.includes('bp') || emailLower.includes('batupahat')) {
      return { role: 'ppd', ppd_id: 3, school_id: null };
    }
  }
  
  // 3. JABATAN PATTERN
  if (emailLower.includes('admin') || emailLower.includes('pentadbir')) {
    return { role: 'sektor_perancangan', ppd_id: null, school_id: null };
  }
  
  if (emailLower.includes('koordinator') || emailLower.includes('coordinator')) {
    return { role: 'sektor_perancangan', ppd_id: null, school_id: null };
  }
  
  if (emailLower.includes('pembelajaran') || emailLower.includes('academic')) {
    return { role: 'sektor_pembelajaran', ppd_id: null, school_id: null };
  }
  
  // 4. YAYASAN JCORP
  if (emailLower.includes('@jcorp.com.my')) {
    return { role: 'yayasan_jcorp', ppd_id: null, school_id: null };
  }
  
  // 5. DEFAULT - Manual approval required
  return { role: 'pending_approval', ppd_id: null, school_id: null };
}
```

#### **B. Recommended Email Structure**
```
SEKOLAH:
- smktjj@jpnj.gov.my (SMK Taman Johor Jaya)
- smkbbuda@jpnj.gov.my (SMK Bandar Baru UDA)
- sekolah001@jpnj.gov.my (Generic dengan ID)

PPD:
- ppd.jb@jpnj.gov.my (PPD Johor Bahru)
- ppd.muar@jpnj.gov.my (PPD Muar)
- ppd.bp@jpnj.gov.my (PPD Batu Pahat)

JABATAN:
- admin@jpnj.gov.my (System Admin)
- koordinator@jpnj.gov.my (Program Coordinator)
- pembelajaran@jpnj.gov.my (Academic Officer)

YAYASAN:
- officer@jcorp.com.my (Yayasan JCorp)
```

### **Strategi 2: Pre-registration Database**

#### **A. Create User Registration Table**
```sql
CREATE TABLE user_registrations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    school_id INTEGER REFERENCES schools(id),
    ppd_id INTEGER REFERENCES ppds(id),
    registered_by INTEGER REFERENCES users(id),
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pre-populate dengan expected users
INSERT INTO user_registrations (email, name, role, school_id, ppd_id, approved) VALUES
('gurubesar.smktjj@jpnj.gov.my', 'Guru Besar SMK TJJ', 'school', 1, null, true),
('admin.smktjj@jpnj.gov.my', 'Admin SMK TJJ', 'school', 1, null, true),
('pegawai.ppdjb@jpnj.gov.my', 'Pegawai PPD JB', 'ppd', null, 1, true),
('koordinator.program@jpnj.gov.my', 'Koordinator Program', 'sektor_perancangan', null, null, true);
```

#### **B. Enhanced Auth Logic**
```typescript
// lib/auth.ts - Database lookup
async function getUserRoleFromDatabase(email: string) {
  const result = await pool.query(`
    SELECT role, school_id, ppd_id, approved 
    FROM user_registrations 
    WHERE email = $1
  `, [email]);
  
  if (result.rows.length === 0) {
    // User not pre-registered
    return null;
  }
  
  const registration = result.rows[0];
  
  if (!registration.approved) {
    // User registered but not approved yet
    return { role: 'pending_approval' };
  }
  
  return {
    role: registration.role,
    school_id: registration.school_id,
    ppd_id: registration.ppd_id
  };
}
```

### **Strategi 3: Google Workspace Organization Units**

#### **A. Setup Organization Units di Google Workspace**
```
JPNJ Organization Structure:
├── Jabatan Pendidikan Negeri Johor
│   ├── Sektor Perancangan
│   ├── Sektor Pembelajaran
│   └── PPD
│       ├── PPD Johor Bahru
│       ├── PPD Muar
│       └── PPD Batu Pahat
└── Sekolah
    ├── SMK Taman Johor Jaya
    ├── SMK Bandar Baru UDA
    └── ...
```

#### **B. Extract OU from Google Profile**
```typescript
// lib/auth.ts - Google Workspace integration
async function getRoleFromGoogleWorkspace(profile: any) {
  // Google Workspace provides organization unit info
  const orgUnit = profile.hd; // Hosted domain
  const department = profile.department;
  const organization = profile.organization;
  
  if (department?.includes('Sektor Perancangan')) {
    return { role: 'sektor_perancangan' };
  }
  
  if (department?.includes('Sektor Pembelajaran')) {
    return { role: 'sektor_pembelajaran' };
  }
  
  if (organization?.includes('PPD')) {
    const ppdId = extractPPDId(organization);
    return { role: 'ppd', ppd_id: ppdId };
  }
  
  if (organization?.includes('SMK')) {
    const schoolId = extractSchoolId(organization);
    return { role: 'school', school_id: schoolId };
  }
  
  return { role: 'pending_approval' };
}
```

### **Strategi 4: Multi-step Registration Process**

#### **A. First-time Login Flow**
```typescript
// components/RoleSelectionModal.tsx
export default function RoleSelectionModal({ user, onComplete }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedPPD, setSelectedPPD] = useState('');
  
  const handleSubmit = async () => {
    // Submit role selection for admin approval
    await submitRoleRequest({
      email: user.email,
      name: user.name,
      role: selectedRole,
      school_id: selectedSchool,
      ppd_id: selectedPPD
    });
    
    // Redirect to pending approval page
    router.push('/auth/pending-approval');
  };
  
  return (
    <div className="modal">
      <h2>Pilih Peranan Anda</h2>
      
      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
        <option value="">Pilih Peranan</option>
        <option value="school">Sekolah</option>
        <option value="ppd">PPD</option>
        <option value="sektor_pembelajaran">Sektor Pembelajaran</option>
        <option value="sektor_perancangan">Sektor Perancangan</option>
      </select>
      
      {selectedRole === 'school' && (
        <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
          <option value="">Pilih Sekolah</option>
          {schools.map(school => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </select>
      )}
      
      {selectedRole === 'ppd' && (
        <select value={selectedPPD} onChange={(e) => setSelectedPPD(e.target.value)}>
          <option value="">Pilih PPD</option>
          {ppds.map(ppd => (
            <option key={ppd.id} value={ppd.id}>{ppd.name}</option>
          ))}
        </select>
      )}
      
      <button onClick={handleSubmit}>Hantar Permohonan</button>
    </div>
  );
}
```

### **Strategi 5: Admin Management Dashboard**

#### **A. User Management Interface**
```typescript
// app/dashboard/admin/users/page.tsx
export default function UserManagementPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  
  const handleApproveUser = async (userId: number, role: string, schoolId?: number, ppdId?: number) => {
    await approveUser(userId, { role, school_id: schoolId, ppd_id: ppdId });
    // Refresh lists
    loadUsers();
  };
  
  return (
    <div className="admin-dashboard">
      <h1>Pengurusan Pengguna</h1>
      
      {/* Pending Approvals */}
      <section>
        <h2>Permohonan Menunggu Kelulusan</h2>
        {pendingUsers.map(user => (
          <div key={user.id} className="user-card">
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>Peranan diminta: {user.requested_role}</p>
            </div>
            
            <div className="actions">
              <select onChange={(e) => handleApproveUser(user.id, e.target.value)}>
                <option value="">Pilih Peranan</option>
                <option value="school">Sekolah</option>
                <option value="ppd">PPD</option>
                <option value="sektor_pembelajaran">Sektor Pembelajaran</option>
                <option value="sektor_perancangan">Sektor Perancangan</option>
              </select>
              
              <button onClick={() => rejectUser(user.id)}>Tolak</button>
            </div>
          </div>
        ))}
      </section>
      
      {/* Approved Users */}
      <section>
        <h2>Pengguna Diluluskan</h2>
        {approvedUsers.map(user => (
          <div key={user.id} className="user-card">
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>Peranan: {user.role}</p>
              {user.school_name && <p>Sekolah: {user.school_name}</p>}
              {user.ppd_name && <p>PPD: {user.ppd_name}</p>}
            </div>
            
            <div className="actions">
              <button onClick={() => editUser(user.id)}>Edit</button>
              <button onClick={() => suspendUser(user.id)}>Suspend</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
```

## 🎯 **Recommended Implementation**

### **Hybrid Approach (Best Practice)**

```typescript
// lib/auth.ts - Complete role mapping strategy
async function determineUserRole(email: string, name: string, profile: any) {
  // Step 1: Check pre-registered users (highest priority)
  const preRegistered = await getUserRoleFromDatabase(email);
  if (preRegistered) {
    return preRegistered;
  }
  
  // Step 2: Email pattern recognition
  const emailRole = determineRoleFromEmail(email);
  if (emailRole.role !== 'unknown') {
    // Auto-approve for JPNJ domain with clear patterns
    if (email.endsWith('@jpnj.gov.my')) {
      await createUserWithRole(email, name, emailRole);
      return emailRole;
    }
  }
  
  // Step 3: Google Workspace organization (if available)
  if (profile.hd === 'jpnj.gov.my') {
    const workspaceRole = await getRoleFromGoogleWorkspace(profile);
    if (workspaceRole.role !== 'unknown') {
      await createUserWithRole(email, name, workspaceRole);
      return workspaceRole;
    }
  }
  
  // Step 4: Yayasan JCorp auto-approve
  if (email.endsWith('@jcorp.com.my')) {
    const yayasanRole = { role: 'yayasan_jcorp', school_id: null, ppd_id: null };
    await createUserWithRole(email, name, yayasanRole);
    return yayasanRole;
  }
  
  // Step 5: Manual approval required
  await createPendingUser(email, name);
  return { role: 'pending_approval', school_id: null, ppd_id: null };
}
```

### **Implementation Priority**

1. **Phase 1: Email Pattern** (Immediate)
   - Implement structured email naming
   - Auto-detect common patterns
   - 80% coverage untuk JPNJ users

2. **Phase 2: Pre-registration** (Week 2)
   - Setup user registration table
   - Import expected users
   - Admin approval workflow

3. **Phase 3: Google Workspace** (Optional)
   - If JPNJ has Google Workspace
   - Organization unit mapping
   - Department-based roles

4. **Phase 4: Admin Dashboard** (Week 3)
   - User management interface
   - Bulk approval tools
   - Role modification features

## 📋 **Example Email Mapping**

```typescript
// Real-world examples
const emailMappings = {
  // SEKOLAH
  'gurubesar.smktjj@jpnj.gov.my': { role: 'school', school_id: 1 },
  'admin.smkbbuda@jpnj.gov.my': { role: 'school', school_id: 2 },
  'sekolah001@jpnj.gov.my': { role: 'school', school_id: 1 },
  
  // PPD
  'pegawai.ppdjb@jpnj.gov.my': { role: 'ppd', ppd_id: 1 },
  'ketua.ppdmuar@jpnj.gov.my': { role: 'ppd', ppd_id: 2 },
  'admin.ppdbp@jpnj.gov.my': { role: 'ppd', ppd_id: 3 },
  
  // JABATAN
  'koordinator.program@jpnj.gov.my': { role: 'sektor_perancangan' },
  'ketua.pembelajaran@jpnj.gov.my': { role: 'sektor_pembelajaran' },
  'admin.sistem@jpnj.gov.my': { role: 'sektor_perancangan' },
  
  // YAYASAN
  'program.officer@jcorp.com.my': { role: 'yayasan_jcorp' },
  'manager@jcorp.com.my': { role: 'yayasan_jcorp' }
};
```

Adakah anda nak saya implement hybrid approach ini? Ia akan provide flexibility dan security yang diperlukan untuk government system! 🚀