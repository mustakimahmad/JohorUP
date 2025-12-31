# Struktur Peranan Pengguna - Sistem JohorUP

## 📊 Ringkasan Pengguna

**Jumlah Pengguna Dijangka: 181 pengguna**

| Level Pengguna | Sektor/PPD/Sekolah/Guru/Yayasan | Bilangan ID |
|----------------|----------------------------------|-------------|
| Super Admin | Sektor Perancangan dan Pengurusan PPD (S4PD) | 3 |
| Admin | Sektor Pembelajaran (SPB) | 5 |
| Admin | Sektor Pembangunan Murid (SPM) | 3 |
| Strategic Viewers | Yayasan JCorp | 3 |
| Strategic Viewers | Yayasan Hasanah | 2 |
| Tactical User | Pejabat Pendidikan Daerah | 11 |
| Operational User | Sekolah | 22 |
| Operational User | Guru | 132 |

## 🏗️ Hierarki Organisasi

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN (S4PD)                      │
│           Sektor Perancangan dan Pengurusan PPD            │
│                        3 pengguna                          │
│  • Full system access & management                         │
│  • Policy planning & PPD management                        │
│  • System configuration & user management                  │
└─────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
┌───────────────▼────┐ ┌────────▼────────┐ ┌───▼──────────────┐
│   ADMIN (SPB)      │ │   ADMIN (SPM)   │ │ STRATEGIC VIEWERS │
│ Sektor Pembelajaran│ │Sektor Pembangunan│ │    Yayasan       │
│    5 pengguna      │ │     Murid       │ │   JCorp (3)      │
│                    │ │    3 pengguna   │ │  Hasanah (2)     │
└────────────────────┘ └─────────────────┘ └──────────────────┘
                │               │
                └───────────────┼───────────────┘
                                │
                ┌───────────────▼───────────────┐
                │        TACTICAL USER          │
                │   Pejabat Pendidikan Daerah   │
                │         11 pengguna           │
                └───────────────────────────────┘
                                │
                ┌───────────────▼───────────────┐
                │      OPERATIONAL USER         │
                │    Sekolah (22) + Guru (132)  │
                │         154 pengguna          │
                └───────────────────────────────┘
```

## 👥 Peranan dan Tanggungjawab

### 1. **Super Admin (S4PD)** - 3 pengguna
**Sektor Perancangan dan Pengurusan PPD**

#### Akses Penuh:
- ✅ System configuration dan settings
- ✅ User management (create, edit, delete users)
- ✅ Audit trail management
- ✅ Database management dan backup
- ✅ Policy planning dan strategic decisions
- ✅ PPD management dan oversight
- ✅ All reports dan analytics
- ✅ System maintenance control

#### Fungsi Utama:
- Strategic planning untuk program JohorUP
- Pengurusan dan monitoring PPD
- System administration
- Policy formulation dan implementation
- Budget planning dan allocation
- Performance monitoring semua level

---

### 2. **Admin (SPB)** - 5 pengguna
**Sektor Pembelajaran**

#### Akses:
- ✅ Learning program management
- ✅ Teacher performance tracking
- ✅ Student academic progress
- ✅ Educational resource allocation
- ✅ Tuition analysis dan monitoring
- ❌ System configuration
- ❌ User management (limited)
- ❌ Curriculum development
- ❌ Learning reports generation

#### Fungsi Utama:
- Program pembelajaran design dan implementation
- Teacher training coordination
- Academic performance monitoring
- Learning resource management
- Tuition program oversight

---

### 3. **Admin (SPM)** - 3 pengguna
**Sektor Pembangunan Murid**

#### Akses:
- ✅ Student development programs
- ✅ Co-curricular activity management
- ✅ Student welfare monitoring
- ✅ Character development tracking
- ✅ Student support services
- ✅ Development analytics dan reports
- ❌ System configuration
- ❌ User management (limited)

#### Fungsi Utama:
- Student holistic development programs
- Co-curricular activity coordination
- Student welfare dan support services
- Character building initiatives
- Student leadership development

---

### 4. **Strategic Viewers (Yayasan JCorp)** - 3 pengguna
**Yayasan JCorp**

#### Akses:
- ✅ Strategic dashboard view
- ✅ High-level analytics dan KPIs
- ✅ Program impact reports
- ✅ Budget utilization reports
- ✅ Overall performance metrics
- ❌ Data entry atau modification
- ❌ Operational details
- ❌ System configuration

#### Fungsi Utama:
- Strategic oversight dan monitoring
- Investment impact assessment
- Program effectiveness evaluation
- High-level decision support
- Stakeholder reporting

---

### 5. **Strategic Viewers (Yayasan Hasanah)** - 2 pengguna
**Yayasan Hasanah**

#### Akses:
- ✅ Strategic dashboard view
- ✅ Program impact analytics
- ✅ Community development metrics
- ✅ Social impact reports
- ✅ Sustainability indicators
- ❌ Data entry atau modification
- ❌ Operational details
- ❌ System configuration

#### Fungsi Utama:
- Social impact monitoring
- Community development oversight
- Sustainability assessment
- Strategic partnership evaluation
- Impact measurement dan reporting

---

### 6. **Tactical User (PPD)** - 11 pengguna
**Pejabat Pendidikan Daerah**

#### Akses:
- ✅ District-level data management
- ✅ School performance monitoring
- ✅ Teacher supervision
- ✅ Regional program coordination
- ✅ District analytics dan reports
- ✅ Resource allocation within district
- ❌ System-wide configuration
- ❌ Cross-district data access

#### Fungsi Utama:
- District education management
- School supervision dan support
- Teacher professional development
- Regional program implementation
- Performance monitoring dan improvement

---

### 7. **Operational User (Sekolah)** - 22 pengguna
**Sekolah**

#### Akses:
- ✅ School-specific data entry
- ✅ Student information management
- ✅ School program tracking
- ✅ Teacher coordination
- ✅ School-level reports
- ✅ Parent communication tools
- ❌ Other schools' data
- ❌ District-wide configuration

#### Fungsi Utama:
- Daily school operations
- Student data management
- Program implementation at school level
- Teacher coordination
- Parent dan community engagement

---

### 8. **Operational User (Guru)** - 132 pengguna
**Guru**

#### Akses:
- ✅ Class dan student management
- ✅ Academic progress tracking
- ✅ Assignment dan assessment tools
- ✅ Student attendance
- ✅ Individual student reports
- ✅ Teaching resource access
- ❌ School-wide configuration
- ❌ Other teachers' classes (unless shared)

#### Fungsi Utama:
- Classroom management
- Student academic tracking
- Individual student development
- Teaching dan learning activities
- Student assessment dan feedback

## 🔐 Matriks Kebenaran Akses

| Fungsi | S4PD | SPB | SPM | JCorp | Hasanah | PPD | Sekolah | Guru |
|--------|------|-----|-----|-------|---------|-----|---------|------|
| System Config | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| User Management | ✅ | 🔶 | 🔶 | ❌ | ❌ | 🔶 | ❌ | ❌ |
| Audit Trail | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Strategic Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | 🔶 | ❌ | ❌ |
| Program Management | ✅ | ✅ | ✅ | ❌ | ❌ | 🔶 | 🔶 | ❌ |
| Student Data | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | 🔶 |
| Teacher Data | ✅ | ✅ | 🔶 | ❌ | ❌ | ✅ | ✅ | 🔶 |
| School Data | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | 🔶 | ❌ |
| Reports (All) | ✅ | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 |
| Data Export | ✅ | 🔶 | 🔶 | ❌ | ❌ | 🔶 | 🔶 | ❌ |

**Legend:**
- ✅ Full Access
- 🔶 Limited/Scoped Access  
- ❌ No Access

## 📧 Contoh Struktur Email

### Format Email Pengguna:
```
S4PD: s4pd.admin1@jpnj.gov.my, s4pd.admin2@jpnj.gov.my, s4pd.admin3@jpnj.gov.my
SPB:  spb.admin1@jpnj.gov.my, spb.admin2@jpnj.gov.my, ..., spb.admin5@jpnj.gov.my
SPM:  spm.admin1@jpnj.gov.my, spm.admin2@jpnj.gov.my, spm.admin3@jpnj.gov.my
JCorp: jcorp.viewer1@jcorp.com.my, jcorp.viewer2@jcorp.com.my, jcorp.viewer3@jcorp.com.my
Hasanah: hasanah.viewer1@yayasanhasanah.org, hasanah.viewer2@yayasanhasanah.org
PPD: ppd.jb1@moe.gov.my, ppd.muar1@moe.gov.my, ..., (11 PPD users)
Sekolah: smk.tmnjj@moe.gov.my, smk.bandarraya@moe.gov.my, ..., (22 school users)
Guru: guru.ahmad@moe.gov.my, guru.siti@moe.gov.my, ..., (132 teacher users)
```

## 🎯 Objektif Setiap Level

### **Strategic Level** (S4PD, Yayasan)
- Policy formulation dan strategic planning
- High-level performance monitoring
- Investment dan resource allocation decisions
- Stakeholder reporting dan accountability

### **Administrative Level** (SPB, SPM)
- Program design dan implementation
- Sector-specific management
- Performance optimization
- Resource coordination

### **Tactical Level** (PPD)
- Regional implementation
- District-level coordination
- Performance monitoring
- Local resource management

### **Operational Level** (Sekolah, Guru)
- Daily operations
- Direct service delivery
- Individual student support
- Frontline implementation

## 📊 Metrics dan KPIs by Level

### **S4PD Metrics:**
- Overall program success rate
- Budget utilization efficiency
- PPD performance rankings
- System-wide KPIs

### **SPB/SPM Metrics:**
- Sector-specific outcomes
- Program effectiveness
- Resource utilization
- Target achievement

### **PPD Metrics:**
- District performance
- School improvement rates
- Teacher development progress
- Regional targets

### **Sekolah/Guru Metrics:**
- Student progress
- Class performance
- Individual achievements
- Teaching effectiveness

---

**Dicipta**: Disember 2025  
**Status**: PRODUCTION READY  
**Total Pengguna**: 181  
**Struktur**: 4 Level, 8 Peranan