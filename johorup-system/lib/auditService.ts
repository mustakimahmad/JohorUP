// JohorUP Audit Trail Service
// Comprehensive audit logging for government system compliance

import { 
  AuditLog, 
  AuditAction, 
  AuditStatus, 
  LoginAttempt, 
  SystemEvent, 
  SystemEventType, 
  SystemEventStatus,
  SecurityEvent,
  SecurityEventType,
  SecuritySeverity,
  User 
} from './types';

export class AuditService {
  
  // =====================================================
  // MAIN AUDIT LOGGING
  // =====================================================
  
  static async logAction(params: {
    user?: User | null;
    user_id?: number;
    user_email: string;
    user_name?: string;
    user_role?: string;
    action: AuditAction;
    table_name?: string;
    record_id?: number;
    old_values?: any;
    new_values?: any;
    request_url?: string;
    request_method?: string;
    additional_info?: any;
    status?: AuditStatus;
    error_message?: string;
  }): Promise<number | null> {
    try {
      const auditLog: Partial<AuditLog> = {
        user_id: params.user?.id || params.user_id,
        user_email: params.user?.email || params.user_email,
        user_name: params.user?.name || params.user_name,
        user_role: params.user?.role || params.user_role,
        action: params.action,
        table_name: params.table_name,
        record_id: params.record_id,
        old_values: params.old_values,
        new_values: params.new_values,
        ip_address: this.getClientIP(),
        user_agent: this.getUserAgent(),
        session_id: this.getSessionId(),
        request_url: params.request_url || this.getCurrentUrl(),
        request_method: params.request_method || 'UNKNOWN',
        timestamp: new Date().toISOString(),
        status: params.status || 'SUCCESS',
        error_message: params.error_message,
        additional_info: params.additional_info,
        created_at: new Date().toISOString()
      };

      // Save to database via API
      const auditId = await this.saveAuditLog(auditLog);
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Audit Log:', {
          id: auditId,
          user: auditLog.user_email,
          action: auditLog.action,
          table: auditLog.table_name,
          status: auditLog.status
        });
      }
      
      return auditId;
      
    } catch (error) {
      console.error('❌ Audit logging failed:', error);
      // Don't throw - audit failure shouldn't break main functionality
      return null;
    }
  }

  // =====================================================
  // LOGIN/LOGOUT LOGGING
  // =====================================================
  
  static async logLogin(
    email: string, 
    success: boolean, 
    failureReason?: string,
    user?: User | null
  ): Promise<void> {
    try {
      // Log login attempt
      const loginAttempt: Partial<LoginAttempt> = {
        email,
        ip_address: this.getClientIP(),
        user_agent: this.getUserAgent(),
        success,
        failure_reason: failureReason,
        session_id: this.getSessionId(),
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      await this.saveLoginAttempt(loginAttempt);
      
      // Also log to main audit trail
      await this.logAction({
        user,
        user_email: email,
        action: success ? 'LOGIN' : 'LOGIN_FAILED',
        status: success ? 'SUCCESS' : 'FAILED',
        error_message: failureReason,
        additional_info: { 
          login_method: 'email_password',
          failure_reason: failureReason 
        }
      });

      // Check for suspicious login patterns
      if (!success) {
        await this.checkSuspiciousLoginActivity(email);
      }

    } catch (error) {
      console.error('❌ Login audit logging failed:', error);
    }
  }

  static async logLogout(user: User): Promise<void> {
    try {
      await this.logAction({
        user,
        user_email: user.email,
        action: 'LOGOUT',
        additional_info: {
          logout_method: 'manual',
          session_duration: this.getSessionDuration()
        }
      });
    } catch (error) {
      console.error('❌ Logout audit logging failed:', error);
    }
  }

  // =====================================================
  // SYSTEM EVENT LOGGING
  // =====================================================
  
  static async logSystemEvent(params: {
    event_type: SystemEventType;
    description: string;
    initiated_by?: User | null;
    details?: any;
    status?: SystemEventStatus;
  }): Promise<number | null> {
    try {
      const systemEvent: Partial<SystemEvent> = {
        event_type: params.event_type,
        description: params.description,
        initiated_by: params.initiated_by?.id,
        initiated_by_email: params.initiated_by?.email,
        status: params.status || 'STARTED',
        start_time: new Date().toISOString(),
        details: params.details,
        created_at: new Date().toISOString()
      };

      const eventId = await this.saveSystemEvent(systemEvent);
      
      // Also log to main audit trail
      await this.logAction({
        user: params.initiated_by,
        user_email: params.initiated_by?.email || 'system@jpnj.gov.my',
        action: 'SYSTEM_CONFIG_CHANGE',
        additional_info: {
          system_event_id: eventId,
          event_type: params.event_type,
          description: params.description
        }
      });

      return eventId;
      
    } catch (error) {
      console.error('❌ System event logging failed:', error);
      return null;
    }
  }

  static async completeSystemEvent(
    eventId: number, 
    status: SystemEventStatus, 
    errorMessage?: string
  ): Promise<void> {
    try {
      const endTime = new Date().toISOString();
      
      await fetch('/api/audit/system-event/complete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: eventId,
          status,
          end_time: endTime,
          error_message: errorMessage
        })
      });
      
    } catch (error) {
      console.error('❌ System event completion failed:', error);
    }
  }

  // =====================================================
  // SECURITY EVENT LOGGING
  // =====================================================
  
  static async logSecurityEvent(params: {
    event_type: SecurityEventType;
    severity: SecuritySeverity;
    description: string;
    user_email?: string;
    details?: any;
  }): Promise<void> {
    try {
      const securityEvent: Partial<SecurityEvent> = {
        event_type: params.event_type,
        severity: params.severity,
        user_email: params.user_email,
        ip_address: this.getClientIP(),
        user_agent: this.getUserAgent(),
        description: params.description,
        details: params.details,
        resolved: false,
        created_at: new Date().toISOString()
      };

      await this.saveSecurityEvent(securityEvent);
      
      // Also log to main audit trail
      await this.logAction({
        user_email: params.user_email || 'unknown@unknown.com',
        action: 'SECURITY_POLICY_VIOLATION',
        status: 'FAILED',
        additional_info: {
          security_event_type: params.event_type,
          severity: params.severity,
          description: params.description
        }
      });

      // Auto-escalate critical events
      if (params.severity === 'CRITICAL') {
        await this.escalateCriticalSecurityEvent(securityEvent);
      }
      
    } catch (error) {
      console.error('❌ Security event logging failed:', error);
    }
  }

  // =====================================================
  // DATA OPERATION HELPERS
  // =====================================================
  
  static async logDataCreate(
    user: User, 
    tableName: string, 
    recordId: number, 
    data: any
  ): Promise<void> {
    await this.logAction({
      user,
      user_email: user.email,
      action: 'CREATE',
      table_name: tableName,
      record_id: recordId,
      new_values: data,
      additional_info: { operation: 'create', record_count: 1 }
    });
  }

  static async logDataUpdate(
    user: User, 
    tableName: string, 
    recordId: number, 
    oldData: any, 
    newData: any
  ): Promise<void> {
    await this.logAction({
      user,
      user_email: user.email,
      action: 'UPDATE',
      table_name: tableName,
      record_id: recordId,
      old_values: oldData,
      new_values: newData,
      additional_info: { operation: 'update', changes: this.getChangedFields(oldData, newData) }
    });
  }

  static async logDataDelete(
    user: User, 
    tableName: string, 
    recordId: number, 
    data: any
  ): Promise<void> {
    await this.logAction({
      user,
      user_email: user.email,
      action: 'DELETE',
      table_name: tableName,
      record_id: recordId,
      old_values: data,
      additional_info: { operation: 'delete', record_count: 1 }
    });
  }

  static async logDataView(
    user: User, 
    tableName: string, 
    recordId?: number,
    additionalInfo?: any
  ): Promise<void> {
    await this.logAction({
      user,
      user_email: user.email,
      action: 'VIEW',
      table_name: tableName,
      record_id: recordId,
      additional_info: { 
        operation: 'view', 
        view_type: recordId ? 'detail' : 'list',
        ...additionalInfo 
      }
    });
  }

  static async logBulkOperation(
    user: User,
    action: AuditAction,
    tableName: string,
    recordCount: number,
    additionalInfo?: any
  ): Promise<void> {
    await this.logAction({
      user,
      user_email: user.email,
      action,
      table_name: tableName,
      additional_info: {
        operation: 'bulk',
        record_count: recordCount,
        ...additionalInfo
      }
    });
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================
  
  private static getClientIP(): string {
    if (typeof window !== 'undefined') {
      // Client-side: try to get IP from various sources
      return 'client-ip'; // Placeholder - actual IP detection would need server-side
    }
    return '127.0.0.1';
  }

  private static getUserAgent(): string {
    if (typeof window !== 'undefined') {
      return window.navigator.userAgent;
    }
    return 'Server/NodeJS';
  }

  private static getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = this.generateSessionId();
        localStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    }
    return 'server-session-' + Date.now();
  }

  private static getCurrentUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'server-request';
  }

  private static generateSessionId(): string {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private static getSessionDuration(): number {
    const sessionStart = localStorage.getItem('sessionStart');
    if (sessionStart) {
      return Date.now() - parseInt(sessionStart);
    }
    return 0;
  }

  private static getChangedFields(oldData: any, newData: any): string[] {
    const changes: string[] = [];
    
    if (!oldData || !newData) return changes;
    
    Object.keys(newData).forEach(key => {
      if (oldData[key] !== newData[key]) {
        changes.push(key);
      }
    });
    
    return changes;
  }

  // =====================================================
  // SECURITY MONITORING
  // =====================================================
  
  private static async checkSuspiciousLoginActivity(email: string): Promise<void> {
    try {
      // Check for brute force attempts
      const response = await fetch(`/api/audit/security/check-brute-force?email=${email}`);
      const data = await response.json();
      
      if (data.is_suspicious) {
        await this.logSecurityEvent({
          event_type: 'BRUTE_FORCE',
          severity: 'HIGH',
          description: `Multiple failed login attempts detected for ${email}`,
          user_email: email,
          details: {
            attempt_count: data.attempt_count,
            time_window: data.time_window,
            ip_addresses: data.ip_addresses
          }
        });
      }
    } catch (error) {
      console.error('❌ Suspicious activity check failed:', error);
    }
  }

  private static async escalateCriticalSecurityEvent(event: Partial<SecurityEvent>): Promise<void> {
    try {
      // Log escalation
      console.error('🚨 CRITICAL SECURITY EVENT:', event);
      
      // In production, this would:
      // 1. Send alerts to security team
      // 2. Create incident tickets
      // 3. Trigger automated responses
      // 4. Log to external SIEM systems
      
      await this.logSystemEvent({
        event_type: 'SECURITY_SCAN',
        description: `Critical security event escalated: ${event.event_type}`,
        details: {
          original_event: event,
          escalation_time: new Date().toISOString(),
          auto_escalated: true
        }
      });
      
    } catch (error) {
      console.error('❌ Security event escalation failed:', error);
    }
  }

  // =====================================================
  // API COMMUNICATION
  // =====================================================
  
  private static async saveAuditLog(auditLog: Partial<AuditLog>): Promise<number> {
    const response = await fetch('/api/audit/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditLog)
    });
    
    if (!response.ok) {
      throw new Error(`Audit log save failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.audit_id;
  }

  private static async saveLoginAttempt(loginAttempt: Partial<LoginAttempt>): Promise<void> {
    const response = await fetch('/api/audit/login-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginAttempt)
    });
    
    if (!response.ok) {
      throw new Error(`Login attempt save failed: ${response.statusText}`);
    }
  }

  private static async saveSystemEvent(systemEvent: Partial<SystemEvent>): Promise<number> {
    const response = await fetch('/api/audit/system-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(systemEvent)
    });
    
    if (!response.ok) {
      throw new Error(`System event save failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.event_id;
  }

  private static async saveSecurityEvent(securityEvent: Partial<SecurityEvent>): Promise<void> {
    const response = await fetch('/api/audit/security-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(securityEvent)
    });
    
    if (!response.ok) {
      throw new Error(`Security event save failed: ${response.statusText}`);
    }
  }

  // =====================================================
  // PUBLIC QUERY METHODS
  // =====================================================
  
  static async getAuditLogs(filters: any = {}): Promise<{ data: AuditLog[], pagination: any }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await fetch(`/api/audit/log?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getLoginAttempts(filters: any = {}): Promise<{ data: LoginAttempt[], pagination: any }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await fetch(`/api/audit/login-attempt?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch login attempts: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getSystemEvents(filters: any = {}): Promise<{ data: SystemEvent[], pagination: any }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await fetch(`/api/audit/system-event?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch system events: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getSecurityEvents(filters: any = {}): Promise<{ data: SecurityEvent[], pagination: any }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await fetch(`/api/audit/security-event?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch security events: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// =====================================================
// AUDIT DECORATORS (Advanced Usage)
// =====================================================

export function auditAction(action: AuditAction, tableName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const user = args.find((arg: any) => arg?.email);
      
      try {
        const result = await method.apply(this, args);
        
        await AuditService.logAction({
          user,
          user_email: user?.email || 'unknown@unknown.com',
          action,
          table_name: tableName,
          additional_info: {
            method: propertyName,
            args_count: args.length,
            success: true
          }
        });
        
        return result;
      } catch (error) {
        await AuditService.logAction({
          user,
          user_email: user?.email || 'unknown@unknown.com',
          action,
          table_name: tableName,
          status: 'ERROR',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          additional_info: {
            method: propertyName,
            args_count: args.length,
            success: false
          }
        });
        
        throw error;
      }
    };
  };
}

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default AuditService;