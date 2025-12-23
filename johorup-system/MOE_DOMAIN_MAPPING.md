# 🔐 MOE Domain Mapping untuk Google SSO - Sistem JohorUP

## 🎯 Official MOE Domain Structure

### **Domain Separation**
- **Sekolah**: `@moe-dl.edu.my` (MOE Digital Learning)
- **PPD & Jabatan**: `@moe.gov.my` (MOE Government)
- **Yayasan JCorp**: `@jcorp.com.my`

### **Benefits Domain-Based Mapping**
- ✅ **Clear separation** antara sekolah dan jabatan
- ✅ **Automatic role detection** based on official domains
- ✅ **Enhanced security** - prevent unauthorized access
- ✅ **MOE compliance** - follow official structure

## 💡 **Enhanced Role Detection Strategy**

### **Domain-Based Role Mapping**
```typescript
// lib/auth.ts - MOE Domain-based role detection
function determineUserRole(email: string, name: string) {
  const emailLower = email.toLowerCase();
  const domain = emailLower.split('@')[1];
  
  // 1. SEKOLAH DOMAIN (@moe-dl.edu.my)
  if (domain === 'moe-dl.edu.my') {
    return determineSchoolRole(emailLower);
  }
  
  // 2. PPD & JABATAN DOMAIN (@moe.gov.my)
  if (domain === 'moe.gov.my') {
    return determineGovRole(emailLower);
  }
  
  // 3. YAYASAN JCORP DOMAIN (@jcorp.com.my)
  if (domain === 'jcorp.com.my') {
    return {
      role: 'yayasan_jcorp',
      school_id: null,
      ppd_id: null
    };
  }
  
  // 4. UNAUTHORIZED DOMAIN
  return {
    role: 'unauthorized',
    school_id: null,
    ppd_id: null
  };
}

function determineSchoolRole(email: string) {
  // All @moe-dl.edu.my users are school users
  let schoolId = null;
  
  // Extract school identifier from email
  if (email.includes('smktjj') || email.includes('taman.johor.jaya')) {
    schoolId = 1; // SMK Taman Johor Jaya
  } else if (email.includes('smkbbuda') || email.includes('bandar.baru.uda')) {
    schoolId = 2; // SMK Bandar Baru UDA
  } else if (email.includes('smktu') || email.includes('taman.universiti')) {
    schoolId = 3; // SMK Taman Universiti
  } else if (email.includes('smkskudai') || email.includes('skudai')) {
    schoolId = 4; // SMK Skudai
  } else if (email.includes('smkkulai') || email.includes('kulai')) {
    schoolId = 5; // SMK Kulai
  } else if (email.includes('smksenai') || email.includes('senai')) {
    schoolId = 6; // SMK Senai
  } else if (email.includes('smkgp') || email.includes('gelang.patah')) {
    schoolId = 7; // SMK Gelang Patah
  } else if (email.includes('smknusajaya') || email.includes('nusajaya')) {
    schoolId = 8; // SMK Nusajaya
  } else if (email.includes('smkmuar') || email.includes('muar')) {
    schoolId = 9; // SMK Muar
  } else if (email.includes('smktangkak') || email.includes('tangkak')) {
    schoolId = 10; // SMK Tangkak
  } else if (email.includes('smksegamat') || email.includes('segamat')) {
    schoolId = 11; // SMK Segamat
  } else if (email.includes('smkpagoh') || email.includes('pagoh')) {
    schoolId = 12; // SMK Pagoh
  } else if (email.includes('smkbg') || email.includes('bukit.gambir')) {
    schoolId = 13; // SMK Bukit Gambir
  } else if (email.includes('smkledang') || email.includes('ledang')) {
    schoolId = 14; // SMK Ledang
  } else if (email.includes('smkbp') || email.includes('batu.pahat')) {
    schoolId = 15; // SMK Batu Pahat
  } else if (email.includes('smkyp') || email.includes('yong.peng')) {
    schoolId = 16; // SMK Yong Peng
  } else if (email.includes('smkah') || email.includes('ayer.hitam')) {
    schoolId = 17; // SMK Ayer Hitam
  } else if (email.includes('smksenggarang') || email.includes('senggarang')) {
    schoolId = 18; // SMK Senggarang
  } else if (email.includes('smkrengit') || email.includes('rengit')) {
    schoolId = 19; // SMK Rengit
  } else if (email.includes('smkpr') || email.includes('parit.raja')) {
    schoolId = 20; // SMK Parit Raja
  } else {
    // Try to extract numeric school ID
    const schoolMatch = email.match(/smk(\d+)|sekolah(\d+)/);
    if (schoolMatch) {
      const extractedId = parseInt(schoolMatch[1] || schoolMatch[2]);
      if (extractedId >= 1 && extractedId <= 20) {
        schoolId = extractedId;
      }
    }
  }
  
  return {
    role: 'school',
    school_id: schoolId || 1, // Default to first school
    ppd_id: null
  };
}

function determineGovRole(email: string) {
  // PPD DETECTION
  if (email.includes('ppd')) {
    let ppdId = null;
    
    if (email.includes('jb') || email.includes('johor.bahru') || email.includes('johorbahru')) {
      ppdId = 1; // PPD Johor Bahru
    } else if (email.includes('muar')) {
      ppdId = 2; // PPD Muar
    } else if (email.includes('bp') || email.includes('batu.pahat') || email.includes('batupahat')) {
      ppdId = 3; // PPD Batu Pahat
    }
    
    return {
      role: 'ppd',
      school_id: null,
      ppd_id: ppdId || 1 // Default to first PPD
    };
  }
  
  // JABATAN DETECTION
  if (email.includes('jpnj') || email.includes('jabatan')) {
    // Determine specific role within Jabatan
    if (email.includes('koordinator') || email.includes('coordinator') || 
        email.includes('admin') || email.includes('pentadbir')) {
      return {
        role: 'sektor_perancangan',
        school_id: null,
        ppd_id: null
      };
    }
    
    if (email.includes('pembelajaran') || email.includes('academic') || 
        email.includes('kurikulum') || email.includes('curriculum')) {
      return {
        role: 'sektor_pembelajaran',
        school_id: null,
        ppd_id: null
      };
    }
    
    // Default jabatan role
    return {
      role: 'sektor_perancangan',
      school_id: null,
      ppd_id: null
    };
  }
  
  // If @moe.gov.my but not clearly PPD or Jabatan, default to PPD
  return {
    role: 'ppd',
    school_id: null,
    ppd_id: 1 // Default to first PPD
  };
}
```

## 📋 **Email Pattern Examples**

### **Sekolah (@moe-dl.edu.my)**
```
Format: [position].[schoolcode]@moe-dl.edu.my

Examples:
- gurubesar.smktjj@moe-dl.edu.my → SMK Taman Johor Jaya (ID: 1)
- admin.smkbbuda@moe-dl.edu.my → SMK Bandar Baru UDA (ID: 2)
- teacher1.smktu@moe-dl.edu.my → SMK Taman Universiti (ID: 3)
- clerk.smkskudai@moe-dl.edu.my → SMK Skudai (ID: 4)
- gurubesar.smkkulai@moe-dl.edu.my → SMK Kulai (ID: 5)
```

### **PPD (@moe.gov.my)**
```
Format: ppd.[area]@moe.gov.my

Examples:
- ppd.jb@moe.gov.my → PPD Johor Bahru (ID: 1)
- ppd.muar@moe.gov.my → PPD Muar (ID: 2)
- ppd.bp@moe.gov.my → PPD Batu Pahat (ID: 3)
- pegawai.ppdjb@moe.gov.my → PPD Johor Bahru (ID: 1)
- ketua.ppdmuar@moe.gov.my → PPD Muar (ID: 2)
```

### **Jabatan (@moe.gov.my)**
```
Format: [position].jpnj@moe.gov.my

Examples:
- koordinator.jpnj@moe.gov.my → Sektor Perancangan
- pembelajaran.jpnj@moe.gov.my → Sektor Pembelajaran
- admin.jpnj@moe.gov.my → Sektor Perancangan
- ketua.jpnj@moe.gov.my → Sektor Perancangan
- kurikulum.jpnj@moe.gov.my → Sektor Pembelajaran
```

### **Yayasan (@jcorp.com.my)**
```
Format: [position]@jcorp.com.my

Examples:
- program.officer@jcorp.com.my → Yayasan JCorp
- manager@jcorp.com.my → Yayasan JCorp
- director@jcorp.com.my → Yayasan JCorp
```

## 🔐 **Security Implementation**

### **Domain Validation**
```typescript
// Strict domain checking
const allowedDomains = [
  'moe-dl.edu.my',    // Sekolah only
  'moe.gov.my',       // PPD & Jabatan only
  'jcorp.com.my'      // Yayasan JCorp only
];

function validateDomain(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  return allowedDomains.includes(domain);
}
```

### **Role-Based Access Control**
```typescript
// Access matrix based on domain and role
const accessMatrix = {
  'school': {
    domain: 'moe-dl.edu.my',
    access: ['school-dashboard', 'tuition-report', 'student-list']
  },
  'ppd': {
    domain: 'moe.gov.my',
    access: ['ppd-dashboard', 'school-oversight', 'tuition-analysis']
  },
  'sektor_perancangan': {
    domain: 'moe.gov.my',
    access: ['admin-dashboard', 'user-management', 'system-config']
  },
  'sektor_pembelajaran': {
    domain: 'moe.gov.my',
    access: ['academic-dashboard', 'curriculum-oversight', 'teacher-management']
  },
  'yayasan_jcorp': {
    domain: 'jcorp.com.my',
    access: ['yayasan-overview', 'investment-tracking', 'program-monitoring']
  }
};
```

## 📊 **Login Flow Examples**

### **Sekolah User Login**
```
1. User: gurubesar.smktjj@moe-dl.edu.my
2. Domain: moe-dl.edu.my → SEKOLAH DETECTED
3. School: smktjj → SMK Taman Johor Jaya (ID: 1)
4. Role: school, school_id: 1, ppd_id: null
5. Access: School dashboard, tuition reports, student management
```

### **PPD User Login**
```
1. User: ppd.jb@moe.gov.my
2. Domain: moe.gov.my → GOVERNMENT DETECTED
3. Pattern: ppd.jb → PPD Johor Bahru (ID: 1)
4. Role: ppd, school_id: null, ppd_id: 1
5. Access: PPD dashboard, schools under JB, analysis reports
```

### **Jabatan User Login**
```
1. User: koordinator.jpnj@moe.gov.my
2. Domain: moe.gov.my → GOVERNMENT DETECTED
3. Pattern: koordinator.jpnj → Jabatan Coordinator
4. Role: sektor_perancangan, school_id: null, ppd_id: null
5. Access: Full system access, user management, system config
```

### **Yayasan User Login**
```
1. User: program.officer@jcorp.com.my
2. Domain: jcorp.com.my → YAYASAN DETECTED
3. Role: yayasan_jcorp, school_id: null, ppd_id: null
4. Access: Investment overview, program monitoring, reports
```

## 🎯 **Implementation Benefits**

### **Security Benefits**
- ✅ **Domain-level validation** - Only official MOE domains allowed
- ✅ **Automatic role assignment** - No manual intervention needed
- ✅ **Clear access boundaries** - Sekolah vs Government separation
- ✅ **Audit compliance** - Follow MOE structure

### **User Experience Benefits**
- ✅ **Single sign-on** - Use existing MOE Google accounts
- ✅ **No password management** - Google handles authentication
- ✅ **Automatic provisioning** - Users get correct access immediately
- ✅ **Mobile-friendly** - Works seamlessly on all devices

### **Administrative Benefits**
- ✅ **Reduced support** - No password resets or account issues
- ✅ **Centralized control** - MOE IT manages user accounts
- ✅ **Scalable solution** - Easy to add new schools/users
- ✅ **Cost-effective** - No additional licensing costs

## 🚀 **Deployment Strategy**

### **Phase 1: Core Implementation**
1. Update auth.ts dengan MOE domain logic
2. Test dengan sample accounts
3. Deploy to staging environment

### **Phase 2: School Integration**
1. Coordinate dengan MOE IT untuk school accounts
2. Provide email naming guidelines
3. Bulk test dengan multiple schools

### **Phase 3: Government Integration**
1. Setup PPD dan Jabatan accounts
2. Configure role-based access
3. Train administrators

### **Phase 4: Production Rollout**
1. Full system deployment
2. User training sessions
3. Support documentation

---

**Kesimpulan**: MOE domain-based mapping memberikan security, compliance, dan user experience yang optimal untuk sistem JohorUP! 🎯