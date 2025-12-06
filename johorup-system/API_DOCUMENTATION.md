# API Documentation - JohorUP System

## Base URL
```
Development: http://localhost:3000/api
Production: https://johorup.jpnj.gov.my/api
```

## Authentication

Semua API endpoints memerlukan JWT token dalam header:
```
Authorization: Bearer <token>
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@moe.gov.my",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@moe.gov.my",
    "name": "User Name",
    "role": "school"
  }
}
```

## Students API

### Get All Students
```http
GET /api/students
Authorization: Bearer <token>

Query Parameters:
- school_id (optional): Filter by school
- search (optional): Search by name or IC
- page (optional): Page number
- limit (optional): Items per page

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Ahmad bin Ali",
      "ic_number": "091234-01-1234",
      "school_id": 1,
      "class": "5A",
      "school": {
        "id": 1,
        "name": "SMK Taman Johor Jaya"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1550
  }
}
```

### Get Student by ID
```http
GET /api/students/:id
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "name": "Ahmad bin Ali",
  "ic_number": "091234-01-1234",
  "school_id": 1,
  "class": "5A",
  "grades": [
    {
      "subject": "Bahasa Melayu",
      "exam_type": "akhir_tingkatan_4",
      "grade": "C",
      "year": 2025
    }
  ]
}
```

### Update Student
```http
PUT /api/students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ahmad bin Ali",
  "class": "5A"
}

Response:
{
  "message": "Student updated successfully",
  "data": { ... }
}
```

## Grades API

### Get Student Grades
```http
GET /api/students/:id/grades
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": 1,
      "subject_id": 1,
      "subject_name": "Bahasa Melayu",
      "exam_type": "akhir_tingkatan_4",
      "grade": "C",
      "year": 2025
    }
  ]
}
```

### Add/Update Grade
```http
POST /api/grades
Authorization: Bearer <token>
Content-Type: application/json

{
  "student_id": 1,
  "subject_id": 1,
  "exam_type": "pertengahan_tahun",
  "grade": "B",
  "year": 2026
}

Response:
{
  "message": "Grade saved successfully",
  "data": { ... }
}
```

## Programs API

### Get All Programs
```http
GET /api/programs
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": 1,
      "title": "Program Intensif Bahasa Melayu",
      "description": "...",
      "program_type": "Bimbingan",
      "target_subject_id": 1,
      "start_date": "2026-01-15",
      "end_date": "2026-03-30",
      "budget": {
        "amount": 120000,
        "status": "approved"
      }
    }
  ]
}
```

### Create Program
```http
POST /api/programs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Program Intensif Bahasa Melayu",
  "description": "Program bimbingan intensif",
  "program_type": "Bimbingan",
  "target_subject_id": 1,
  "start_date": "2026-01-15",
  "end_date": "2026-03-30",
  "budget_amount": 120000
}

Response:
{
  "message": "Program created successfully",
  "data": { ... }
}
```

### Update Program
```http
PUT /api/programs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### Delete Program
```http
DELETE /api/programs/:id
Authorization: Bearer <token>

Response:
{
  "message": "Program deleted successfully"
}
```

## Budget API

### Get Budget Summary
```http
GET /api/budget/summary
Authorization: Bearer <token>

Response:
{
  "total_budget": 450000,
  "allocated": 350000,
  "spent": 125000,
  "remaining": 100000,
  "by_subject": {
    "bahasa_melayu": 120000,
    "sejarah": 80000,
    "matematik": 150000
  }
}
```

### Get Budget Details
```http
GET /api/budget
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": 1,
      "program_id": 1,
      "program_title": "Program Intensif BM",
      "amount": 120000,
      "description": "Gaji tutor, bahan",
      "status": "approved"
    }
  ]
}
```

### Update Budget Status
```http
PUT /api/budget/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "spent"
}

Response:
{
  "message": "Budget status updated",
  "data": { ... }
}
```

## Reports API

### Get Dashboard Stats
```http
GET /api/reports/dashboard
Authorization: Bearer <token>

Response:
{
  "total_students": 1550,
  "total_schools": 22,
  "total_budget": 450000,
  "spent_budget": 125000,
  "programs_count": 12,
  "passing_rate": {
    "bahasa_melayu": 45.2,
    "sejarah": 38.7,
    "matematik": 42.1
  }
}
```

### Get School Performance
```http
GET /api/reports/schools
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "school_id": 1,
      "school_name": "SMK Taman Johor Jaya",
      "total_students": 50,
      "passing_rate": 43.5,
      "by_subject": {
        "bahasa_melayu": 48.0,
        "sejarah": 40.0,
        "matematik": 42.5
      }
    }
  ]
}
```

### Get Student Progress
```http
GET /api/reports/progress/:student_id
Authorization: Bearer <token>

Response:
{
  "student": { ... },
  "progress": [
    {
      "exam_type": "akhir_tingkatan_4",
      "date": "2025-11-15",
      "grades": {
        "bahasa_melayu": "C",
        "sejarah": "D",
        "matematik": "C"
      }
    },
    {
      "exam_type": "pertengahan_tahun",
      "date": "2026-05-20",
      "grades": {
        "bahasa_melayu": "B",
        "sejarah": "C",
        "matematik": "B"
      }
    }
  ]
}
```

### Export Report
```http
GET /api/reports/export
Authorization: Bearer <token>

Query Parameters:
- format: pdf | excel | csv
- type: students | programs | budget | performance
- school_id (optional): Filter by school
- start_date (optional): Date range start
- end_date (optional): Date range end

Response: File download
```

## Schools API

### Get All Schools
```http
GET /api/schools
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": 1,
      "name": "SMK Taman Johor Jaya",
      "code": "JBA001",
      "ppd_id": 1,
      "ppd_name": "PPD Johor Bahru",
      "target_students": 50,
      "current_students": 50
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "field": "email",
    "issue": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Webhooks (Future)

Untuk notifikasi real-time:
- Student grade updated
- Program created/updated
- Budget threshold reached
- Report generated

## Notes

- Semua dates dalam format ISO 8601: `YYYY-MM-DD`
- Semua timestamps dalam format ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Pagination default: 50 items per page
- Maximum page size: 100 items
