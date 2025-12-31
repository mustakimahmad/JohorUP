# Cadangan Implementasi Audit Trail - Sistem JohorUP

## 🎯 Objektif
Menambah sistem audit trail yang komprehensif untuk memenuhi keperluan governance dan security sistem kerajaan.

## 📋 STATUS SEMASA
- ❌ **TIADA** audit trail system
- ❌ **TIADA** user activity logging
- ❌ **TIADA** data change tracking
- ❌ **TIADA** security event monitoring

## 🏗️ CADANGAN IMPLEMENTASI

### 1. Database Schema - Audit Tables

```sql
-- Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- LOGIN, LOGOUT, CREATE, UPDATE, DELETE, VIEW
    table_name VARCHAR(100), -- students, schools, programs, etc
    record_id INTEGER, -- ID of affected record
    old_values JSONB, -- Previous data (for updates/deletes)
    new_values JSONB, -- New data (for creates/updates)
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'SUCCESS', -- SUCCESS, FAILED, ERROR
    error_message TEXT,
    additional_info JSONB -- Extra context data
);

-- Login Attempts Table
CREATE TABLE login_attempts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN,
    failure_reason VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- System Events Table
CREATE TABLE system_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100), -- MAINTENANCE, BACKUP, IMPORT, EXPORT
    description TEXT,
    initiated_by INTEGER REFERENCES users(id),
    status VARCHAR(20), -- STARTED, COMPLETED, FAILED
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    details JSONB
);
```

### 2. TypeScript Interfaces

```typescript
// lib/types.ts - Add these interfaces

export interface AuditLog {
  id: number;
  user_id?: number;
  user_email: string;
  action: AuditAction;
  table_name?: string;
  record_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'ERROR';
  error_message?: string;
  additional_info?: any;
}

export type AuditAction = 
  | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED'
  | 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW'
  | 'IMPORT' | 'EXPORT' | 'BACKUP'
  | 'MAINTENANCE_START' | 'MAINTENANCE_END'
  | 'PASSWORD_CHANGE' | 'ROLE_CHANGE';

export interface LoginAttempt {
  id: number;
  email: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
  timestamp: string;
}

export interface SystemEvent {
  id: number;
  event_type: string;
  description: string;
  initiated_by?: number;
  status: 'STARTED' | 'COMPLETED' | 'FAILED';
  start_time: string;
  end_time?: string;
  details?: any;
}
```

### 3. Audit Service

```typescript
// lib/auditService.ts

export class AuditService {
  
  static async logAction(params: {
    user_id?: number;
    user_email: string;
    action: AuditAction;
    table_name?: string;
    record_id?: number;
    old_values?: any;
    new_values?: any;
    additional_info?: any;
  }) {
    try {
      const auditLog: Partial<AuditLog> = {
        ...params,
        ip_address: this.getClientIP(),
        user_agent: this.getUserAgent(),
        session_id: this.getSessionId(),
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      };

      // Save to database
      await this.saveAuditLog(auditLog);
      
      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Audit Log:', auditLog);
      }
      
    } catch (error) {
      console.error('❌ Audit logging failed:', error);
      // Don't throw - audit failure shouldn't break main functionality
    }
  }

  static async logLogin(email: string, success: boolean, failureReason?: string) {
    const loginAttempt: Partial<LoginAttempt> = {
      email,
      ip_address: this.getClientIP(),
      user_agent: this.getUserAgent(),
      success,
      failure_reason: failureReason,
      timestamp: new Date().toISOString()
    };

    await this.saveLoginAttempt(loginAttempt);
    
    // Log to audit as well
    await this.logAction({
      user_email: email,
      action: success ? 'LOGIN' : 'LOGIN_FAILED',
      additional_info: { failure_reason: failureReason }
    });
  }

  static async logSystemEvent(params: {
    event_type: string;
    description: string;
    initiated_by?: number;
    details?: any;
  }) {
    const systemEvent: Partial<SystemEvent> = {
      ...params,
      status: 'STARTED',
      start_time: new Date().toISOString()
    };

    return await this.saveSystemEvent(systemEvent);
  }

  // Helper methods
  private static getClientIP(): string {
    // Implementation to get client IP
    return '127.0.0.1'; // Placeholder
  }

  private static getUserAgent(): string {
    if (typeof window !== 'undefined') {
      return window.navigator.userAgent;
    }
    return 'Server';
  }

  private static getSessionId(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionId') || 'unknown';
    }
    return 'server-session';
  }

  private static async saveAuditLog(auditLog: Partial<AuditLog>) {
    // Implementation to save to database
    const response = await fetch('/api/audit/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditLog)
    });
    return response.json();
  }

  private static async saveLoginAttempt(loginAttempt: Partial<LoginAttempt>) {
    // Implementation to save login attempt
    const response = await fetch('/api/audit/login-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginAttempt)
    });
    return response.json();
  }

  private static async saveSystemEvent(systemEvent: Partial<SystemEvent>) {
    // Implementation to save system event
    const response = await fetch('/api/audit/system-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(systemEvent)
    });
    return response.json();
  }
}
```

### 4. API Endpoints

```typescript
// app/api/audit/log/route.ts
export async function POST(request: NextRequest) {
  try {
    const auditData = await request.json();
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    const query = `
      INSERT INTO audit_logs (
        user_id, user_email, action, table_name, record_id,
        old_values, new_values, ip_address, user_agent, session_id,
        timestamp, status, error_message, additional_info
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `;

    const values = [
      auditData.user_id,
      auditData.user_email,
      auditData.action,
      auditData.table_name,
      auditData.record_id,
      JSON.stringify(auditData.old_values),
      JSON.stringify(auditData.new_values),
      auditData.ip_address,
      auditData.user_agent,
      auditData.session_id,
      auditData.timestamp,
      auditData.status,
      auditData.error_message,
      JSON.stringify(auditData.additional_info)
    ];

    const result = await pool.query(query, values);
    await pool.end();

    return NextResponse.json({ 
      success: true, 
      audit_id: result.rows[0].id 
    });

  } catch (error) {
    console.error('Audit log save error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save audit log' 
    }, { status: 500 });
  }
}

// GET endpoint for retrieving audit logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const user_id = searchParams.get('user_id');
    const action = searchParams.get('action');
    const table_name = searchParams.get('table_name');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (user_id) {
      whereConditions.push(`user_id = $${paramIndex}`);
      queryParams.push(user_id);
      paramIndex++;
    }

    if (action) {
      whereConditions.push(`action = $${paramIndex}`);
      queryParams.push(action);
      paramIndex++;
    }

    if (table_name) {
      whereConditions.push(`table_name = $${paramIndex}`);
      queryParams.push(table_name);
      paramIndex++;
    }

    if (start_date) {
      whereConditions.push(`timestamp >= $${paramIndex}`);
      queryParams.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      whereConditions.push(`timestamp <= $${paramIndex}`);
      queryParams.push(end_date);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const offset = (page - 1) * limit;
    queryParams.push(limit, offset);

    const query = `
      SELECT * FROM audit_logs 
      ${whereClause}
      ORDER BY timestamp DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM audit_logs ${whereClause}
    `;

    const [logsResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
    ]);

    await pool.end();

    return NextResponse.json({
      success: true,
      data: logsResult.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Audit log fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch audit logs' 
    }, { status: 500 });
  }
}
```

### 5. Integration Points

#### A. Authentication (lib/localStorage-auth.ts)
```typescript
// Update loginUser function
export function loginUser(email: string, password: string): User | null {
  const user = demoUsers.find(u => u.email === email);
  
  if (user && password === 'AdminPass123!') {
    localStorage.setItem('user', JSON.stringify(user));
    
    // Log successful login
    AuditService.logLogin(email, true);
    
    return user;
  } else {
    // Log failed login
    AuditService.logLogin(email, false, 'Invalid credentials');
    return null;
  }
}

// Update logoutUser function
export function logoutUser(): void {
  const user = getCurrentUser();
  if (user) {
    AuditService.logAction({
      user_email: user.email,
      action: 'LOGOUT'
    });
  }
  localStorage.removeItem('user');
}
```

#### B. Data Operations
```typescript
// Example: When creating a student
const createStudent = async (studentData: Student) => {
  try {
    // Save student to database
    const newStudent = await saveStudent(studentData);
    
    // Log the action
    await AuditService.logAction({
      user_id: currentUser.id,
      user_email: currentUser.email,
      action: 'CREATE',
      table_name: 'students',
      record_id: newStudent.id,
      new_values: studentData,
      additional_info: { source: 'manual_entry' }
    });
    
    return newStudent;
  } catch (error) {
    // Log the error
    await AuditService.logAction({
      user_id: currentUser.id,
      user_email: currentUser.email,
      action: 'CREATE',
      table_name: 'students',
      status: 'ERROR',
      error_message: error.message,
      additional_info: { attempted_data: studentData }
    });
    throw error;
  }
};
```

### 6. Audit Dashboard Component

```typescript
// components/AuditDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { AuditLog } from '@/lib/types';

export default function AuditDashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    table_name: '',
    start_date: '',
    end_date: '',
    page: 1
  });

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/audit/log?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setAuditLogs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Trail</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            value={filters.action} 
            onChange={(e) => setFilters({...filters, action: e.target.value})}
            className="border rounded px-3 py-2"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>
          
          <select 
            value={filters.table_name} 
            onChange={(e) => setFilters({...filters, table_name: e.target.value})}
            className="border rounded px-3 py-2"
          >
            <option value="">All Tables</option>
            <option value="students">Students</option>
            <option value="schools">Schools</option>
            <option value="programs">Programs</option>
            <option value="users">Users</option>
          </select>
          
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters({...filters, start_date: e.target.value})}
            className="border rounded px-3 py-2"
            placeholder="Start Date"
          />
          
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({...filters, end_date: e.target.value})}
            className="border rounded px-3 py-2"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Table
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.user_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.action === 'LOGIN' ? 'bg-green-100 text-green-800' :
                    log.action === 'LOGOUT' ? 'bg-blue-100 text-blue-800' :
                    log.action === 'CREATE' ? 'bg-purple-100 text-purple-800' :
                    log.action === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                    log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.table_name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                    log.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.ip_address || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 7. Navigation Integration

```typescript
// Update NavigationBar.tsx to include audit trail for admin
if (user.role === 'admin') {
  return [
    ...baseItems,
    { href: '/dashboard/super-admin', label: '👑 Super Admin' },
    { href: '/dashboard/admin/user-management', label: 'User Management' },
    { href: '/dashboard/admin/audit-trail', label: '🔍 Audit Trail' }, // NEW
    // ... other items
  ];
}
```

## 🎯 FAEDAH IMPLEMENTASI

### 1. **Compliance**
- Memenuhi keperluan audit kerajaan
- Dokumentasi lengkap untuk setiap tindakan
- Transparency dalam operasi sistem

### 2. **Security**
- Monitor unauthorized access
- Track suspicious activities
- Forensic investigation capabilities

### 3. **Accountability**
- Setiap tindakan dapat dikesan
- Responsibility tracking
- Performance monitoring

### 4. **Data Integrity**
- Complete change history
- Rollback capabilities
- Data validation tracking

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup
- [ ] Create audit_logs table
- [ ] Create login_attempts table  
- [ ] Create system_events table
- [ ] Add indexes for performance

### Phase 2: Core Services
- [ ] Implement AuditService class
- [ ] Create API endpoints
- [ ] Add TypeScript interfaces
- [ ] Integration with existing auth

### Phase 3: UI Components
- [ ] Audit Dashboard component
- [ ] Filtering and search
- [ ] Export functionality
- [ ] Real-time monitoring

### Phase 4: Integration
- [ ] Update all CRUD operations
- [ ] Add to navigation
- [ ] Testing and validation
- [ ] Documentation

## 🚀 NEXT STEPS

1. **Approval** - Dapatkan kelulusan untuk implementasi
2. **Database Migration** - Setup audit tables
3. **Core Implementation** - AuditService dan API
4. **UI Development** - Dashboard dan components
5. **Integration** - Connect dengan existing features
6. **Testing** - Comprehensive testing
7. **Documentation** - User guides dan technical docs
8. **Training** - Admin user training

---

**Anggaran Masa**: 2-3 minggu untuk implementasi penuh
**Keperluan**: Database access, development time, testing environment
**Faedah**: Compliance, security, accountability, data integrity

**Status**: CADANGAN - Menunggu kelulusan untuk implementasi