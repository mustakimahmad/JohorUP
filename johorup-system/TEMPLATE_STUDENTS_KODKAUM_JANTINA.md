# 📊 Template Students dengan Kod Kaum & Jantina

## 🆕 **Updated Students Template**

### **Columns Baru:**
- `kodkaum` - Kod kaum murid
- `jantina` - Jantina murid

### **Template Structure:**
```csv
id,name,ic_number,school_id,form_level,class_name,kodkaum,jantina,phone,parent_phone,address,is_target_student
```

## 📋 **Kod Kaum (kodkaum)**

| Kod | Kaum | Contoh Nama |
|-----|------|-------------|
| M | Melayu | Ahmad Bin Abdullah, Siti Nurhaliza Binti Hassan |
| C | Cina | Lim Wei Ming, Tan Mei Ling |
| I | India | Raj Kumar A/L Suresh, Priya A/P Raman |
| L | Lain-lain | John Smith, Mary Johnson |

## 👥 **Jantina (jantina)**

| Kod | Jantina | Contoh |
|-----|---------|--------|
| L | Lelaki | Ahmad, Muhammad, Raj Kumar, Lim Wei Ming |
| P | Perempuan | Siti, Nurul, Priya, Tan Mei Ling |

## 📊 **Contoh Template Lengkap:**

```csv
id,name,ic_number,school_id,form_level,class_name,kodkaum,jantina,phone,parent_phone,address,is_target_student
1,Ahmad Bin Abdullah,050101567890,1,4,4 Bestari,M,L,012-3456789,019-8765432,Taman Johor Jaya,TRUE
2,Siti Nurhaliza Binti Hassan,050102567891,1,4,4 Bestari,M,P,012-3456790,019-8765433,Taman Johor Jaya,TRUE
3,Lim Wei Ming,050103567892,1,4,4 Cemerlang,C,L,012-3456791,019-8765434,Taman Johor Jaya,TRUE
4,Tan Mei Ling,050104567893,1,4,4 Cemerlang,C,P,012-3456792,019-8765435,Taman Johor Jaya,TRUE
5,Raj Kumar A/L Suresh,050105567894,1,5,5 Bestari,I,L,012-3456793,019-8765436,Taman Johor Jaya,TRUE
6,Priya A/P Raman,050106567895,1,5,5 Bestari,I,P,012-3456794,019-8765437,Taman Johor Jaya,TRUE
7,John Smith,050107567896,1,5,5 Cemerlang,L,L,012-3456795,019-8765438,Taman Johor Jaya,TRUE
8,Mary Johnson,050108567897,1,5,5 Cemerlang,L,P,012-3456796,019-8765439,Taman Johor Jaya,TRUE
```

## 📈 **Demographic Distribution (Recommended)**

### **Kod Kaum Distribution:**
- **Melayu (M)**: 60% (~26 students per school)
- **Cina (C)**: 20% (~9 students per school)
- **India (I)**: 10% (~4 students per school)
- **Lain-lain (L)**: 10% (~5 students per school)

### **Jantina Distribution:**
- **Lelaki (L)**: 50% (~22 students per school)
- **Perempuan (P)**: 50% (~22 students per school)

## 🎯 **Pattern untuk Nama Mengikut Kaum:**

### **Melayu (M):**
- **Lelaki**: Ahmad Bin [Nama Bapa], Muhammad Bin [Nama Bapa], Mohd [Nama] Bin [Nama Bapa]
- **Perempuan**: Siti [Nama] Binti [Nama Bapa], Nurul [Nama] Binti [Nama Bapa]

### **Cina (C):**
- **Lelaki**: [Surname] [Given Name] - Lim Wei Ming, Tan Jun Hao, Wong Kar Wai
- **Perempuan**: [Surname] [Given Name] - Tan Mei Ling, Lim Siew Choo, Wong Li Ying

### **India (I):**
- **Lelaki**: [Given Name] A/L [Father Name] - Raj Kumar A/L Suresh, Raman A/L Kumar
- **Perempuan**: [Given Name] A/P [Father Name] - Priya A/P Raman, Kavitha A/P Raj

### **Lain-lain (L):**
- **Lelaki**: [First Name] [Last Name] - John Smith, David Johnson, Michael Brown
- **Perempuan**: [First Name] [Last Name] - Mary Smith, Sarah Johnson, Lisa Brown

## 🔍 **Validation Rules:**

### **Kod Kaum:**
- Must be one of: M, C, I, L
- Case sensitive (uppercase only)
- Required field

### **Jantina:**
- Must be one of: L, P
- Case sensitive (uppercase only)
- Required field

### **Name Pattern Validation:**
- Melayu: Should contain "Bin" (L) or "Binti" (P)
- India: Should contain "A/L" (L) or "A/P" (P)
- Cina & Lain-lain: No specific pattern required

## 📊 **Excel Formula untuk Generate Data:**

### **Kod Kaum (60% M, 20% C, 10% I, 10% L):**
```excel
=IF(MOD(ROW(),10)<=6,"M",IF(MOD(ROW(),10)<=8,"C",IF(MOD(ROW(),10)<=9,"I","L")))
```

### **Jantina (50-50 distribution):**
```excel
=IF(MOD(ROW(),2)=0,"L","P")
```

### **Generate Name based on Kodkaum & Jantina:**
```excel
=IF(AND(kodkaum="M",jantina="L"),"Ahmad Bin Abdullah",
  IF(AND(kodkaum="M",jantina="P"),"Siti Nurhaliza Binti Hassan",
    IF(AND(kodkaum="C",jantina="L"),"Lim Wei Ming",
      IF(AND(kodkaum="C",jantina="P"),"Tan Mei Ling",
        IF(AND(kodkaum="I",jantina="L"),"Raj Kumar A/L Suresh",
          IF(AND(kodkaum="I",jantina="P"),"Priya A/P Raman",
            IF(jantina="L","John Smith","Mary Johnson")))))))
```

## 📈 **Analytics Capabilities:**

### **Demographic Reports:**
- Students by race and gender
- Distribution across schools
- Form level breakdown by demographics
- Class performance by demographics

### **SQL Queries untuk Analytics:**
```sql
-- Count by kodkaum
SELECT kodkaum, COUNT(*) as total,
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage
FROM students 
GROUP BY kodkaum;

-- Count by jantina
SELECT jantina, COUNT(*) as total,
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage
FROM students 
GROUP BY jantina;

-- Cross-tabulation
SELECT kodkaum, jantina, COUNT(*) as total
FROM students 
GROUP BY kodkaum, jantina
ORDER BY kodkaum, jantina;

-- School demographic breakdown
SELECT s.name as school_name,
       st.kodkaum, st.jantina,
       COUNT(*) as student_count
FROM schools s
JOIN students st ON s.id = st.school_id
GROUP BY s.name, st.kodkaum, st.jantina
ORDER BY s.name, st.kodkaum, st.jantina;
```

## 🛠️ **Tools untuk Generate:**

### **Generate Sample Data:**
```bash
# Generate 880 students with realistic demographic distribution
node scripts/validate-relationship.js --generate
```

### **Validate Template:**
```bash
# Validate kodkaum and jantina values
node scripts/validate-relationship.js data/schools.xlsx data/students.xlsx
```

## ✅ **Benefits:**

1. **Demographic Analysis**: Track performance by race and gender
2. **Compliance**: Meet MOE reporting requirements
3. **Planning**: Better resource allocation based on demographics
4. **Monitoring**: Ensure inclusive education practices
5. **Statistics**: Generate accurate demographic reports

## ⚠️ **Important Notes:**

1. **Privacy**: Handle demographic data with care
2. **Accuracy**: Ensure kodkaum and jantina are correctly assigned
3. **Consistency**: Use standard naming conventions
4. **Validation**: Always validate data before import
5. **Backup**: Keep original data safe

---

**Template ini membolehkan sistem generate laporan demografi yang lengkap dan memenuhi keperluan pelaporan MOE.** 📊