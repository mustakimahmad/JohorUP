-- JohorUP Audit Trail Database Schema
-- Created: December 2025
-- Purpose: Comprehensive audit logging for government system compliance

-- =====================================================
-- AUDIT LOGS TABLE - Main audit trail
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    user_role VARCHAR(100),
    action VARCHAR(100) NOT NULL, -- LOGIN, LOGOUT, CREATE, UPDATE, DELETE, VIEW, IMPORT, EXPORT
    table_name VARCHAR(100), -- students, schools, programs, users, etc
    record_id INTEGER, -- ID of affected record
    old_values JSONB, -- Previous data (for updates/deletes)
    new_values JSONB, -- New data (for creates/updates)
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    request_url TEXT,
    request_method VARCHAR(10), -- GET, POST, PUT, DELETE
    timestamp TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'SUCCESS', -- SUCCESS, FAILED, ERROR
    error_message TEXT,
    additional_info JSONB, -- Extra context data
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- LOGIN ATTEMPTS TABLE - Security monitoring
-- =====================================================
CREATE TABLE IF NOT EXISTS login_attempts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    session_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SYSTEM EVENTS TABLE - System-level operations
-- =====================================================
CREATE TABLE IF NOT EXISTS system_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- MAINTENANCE, BACKUP, IMPORT, EXPORT, SYSTEM_START, SYSTEM_STOP
    description TEXT NOT NULL,
    initiated_by INTEGER, -- user_id who initiated
    initiated_by_email VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'STARTED', -- STARTED, COMPLETED, FAILED, CANCELLED
    start_time TIMESTAMP DEFAULT NOW(),
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    details JSONB, -- Additional event details
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- DATA CHANGES TABLE - Detailed data change tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS data_changes (
    id SERIAL PRIMARY KEY,
    audit_log_id INTEGER REFERENCES audit_logs(id),
    field_name VARCHAR(255) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    data_type VARCHAR(50), -- string, number, boolean, date, json
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SECURITY EVENTS TABLE - Security-specific logging
-- =====================================================
CREATE TABLE IF NOT EXISTS security_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- UNAUTHORIZED_ACCESS, SUSPICIOUS_ACTIVITY, BRUTE_FORCE, etc
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    description TEXT NOT NULL,
    details JSONB,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by INTEGER,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_email ON audit_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_session_id ON audit_logs(session_id);

-- Login attempts indexes
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_timestamp ON login_attempts(timestamp);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);

-- System events indexes
CREATE INDEX IF NOT EXISTS idx_system_events_type ON system_events(event_type);
CREATE INDEX IF NOT EXISTS idx_system_events_status ON system_events(status);
CREATE INDEX IF NOT EXISTS idx_system_events_start_time ON system_events(start_time);
CREATE INDEX IF NOT EXISTS idx_system_events_initiated_by ON system_events(initiated_by);

-- Security events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);

-- Data changes indexes
CREATE INDEX IF NOT EXISTS idx_data_changes_audit_log_id ON data_changes(audit_log_id);
CREATE INDEX IF NOT EXISTS idx_data_changes_field_name ON data_changes(field_name);

-- =====================================================
-- VIEWS for Common Queries
-- =====================================================

-- Recent audit activities view
CREATE OR REPLACE VIEW recent_audit_activities AS
SELECT 
    al.id,
    al.user_email,
    al.user_name,
    al.action,
    al.table_name,
    al.record_id,
    al.timestamp,
    al.status,
    al.ip_address
FROM audit_logs al
WHERE al.timestamp >= NOW() - INTERVAL '7 days'
ORDER BY al.timestamp DESC;

-- Failed login attempts view
CREATE OR REPLACE VIEW failed_login_attempts AS
SELECT 
    la.email,
    la.ip_address,
    la.failure_reason,
    la.timestamp,
    COUNT(*) OVER (PARTITION BY la.email, la.ip_address) as attempt_count
FROM login_attempts la
WHERE la.success = FALSE
    AND la.timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY la.timestamp DESC;

-- System health view
CREATE OR REPLACE VIEW system_health_summary AS
SELECT 
    event_type,
    COUNT(*) as total_events,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as successful_events,
    COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_events,
    MAX(start_time) as last_event_time
FROM system_events
WHERE start_time >= NOW() - INTERVAL '30 days'
GROUP BY event_type
ORDER BY last_event_time DESC;

-- =====================================================
-- FUNCTIONS for Audit Operations
-- =====================================================

-- Function to log audit entry
CREATE OR REPLACE FUNCTION log_audit_entry(
    p_user_id INTEGER,
    p_user_email VARCHAR(255),
    p_user_name VARCHAR(255),
    p_user_role VARCHAR(100),
    p_action VARCHAR(100),
    p_table_name VARCHAR(100),
    p_record_id INTEGER,
    p_old_values JSONB,
    p_new_values JSONB,
    p_ip_address INET,
    p_user_agent TEXT,
    p_session_id VARCHAR(255),
    p_additional_info JSONB DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    audit_id INTEGER;
BEGIN
    INSERT INTO audit_logs (
        user_id, user_email, user_name, user_role, action, table_name, 
        record_id, old_values, new_values, ip_address, user_agent, 
        session_id, additional_info
    ) VALUES (
        p_user_id, p_user_email, p_user_name, p_user_role, p_action, 
        p_table_name, p_record_id, p_old_values, p_new_values, 
        p_ip_address, p_user_agent, p_session_id, p_additional_info
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old audit logs (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(retention_days INTEGER DEFAULT 365) 
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete audit logs older than retention period
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the cleanup operation
    INSERT INTO system_events (event_type, description, status, details)
    VALUES (
        'AUDIT_CLEANUP',
        'Automated cleanup of old audit logs',
        'COMPLETED',
        jsonb_build_object('deleted_count', deleted_count, 'retention_days', retention_days)
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS for Automatic Audit Logging
-- =====================================================

-- Note: Triggers will be added for specific tables as needed
-- Example trigger function for users table
CREATE OR REPLACE FUNCTION audit_users_changes() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Log user creation
        PERFORM log_audit_entry(
            NEW.id,
            NEW.email,
            NEW.name,
            NEW.role,
            'CREATE',
            'users',
            NEW.id,
            NULL,
            to_jsonb(NEW),
            NULL, -- IP will be set by application
            NULL, -- User agent will be set by application
            NULL  -- Session ID will be set by application
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log user updates
        PERFORM log_audit_entry(
            NEW.id,
            NEW.email,
            NEW.name,
            NEW.role,
            'UPDATE',
            'users',
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW),
            NULL,
            NULL,
            NULL
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Log user deletion
        PERFORM log_audit_entry(
            OLD.id,
            OLD.email,
            OLD.name,
            OLD.role,
            'DELETE',
            'users',
            OLD.id,
            to_jsonb(OLD),
            NULL,
            NULL,
            NULL,
            NULL
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS for Documentation
-- =====================================================

COMMENT ON TABLE audit_logs IS 'Main audit trail table for tracking all user actions and system changes';
COMMENT ON TABLE login_attempts IS 'Security table for monitoring login attempts and detecting brute force attacks';
COMMENT ON TABLE system_events IS 'System-level events like maintenance, backups, imports, exports';
COMMENT ON TABLE data_changes IS 'Detailed field-level changes for audit logs';
COMMENT ON TABLE security_events IS 'Security-specific events and incidents';

COMMENT ON COLUMN audit_logs.action IS 'Type of action performed: LOGIN, LOGOUT, CREATE, UPDATE, DELETE, VIEW, IMPORT, EXPORT';
COMMENT ON COLUMN audit_logs.status IS 'Result of the action: SUCCESS, FAILED, ERROR';
COMMENT ON COLUMN audit_logs.old_values IS 'JSON representation of data before change (for UPDATE/DELETE)';
COMMENT ON COLUMN audit_logs.new_values IS 'JSON representation of data after change (for CREATE/UPDATE)';

-- =====================================================
-- SAMPLE DATA for Testing (Optional)
-- =====================================================

-- Insert sample system event
INSERT INTO system_events (event_type, description, initiated_by_email, status, details)
VALUES (
    'AUDIT_SYSTEM_INIT',
    'Audit trail system initialized',
    'system@jpnj.gov.my',
    'COMPLETED',
    '{"version": "1.0", "tables_created": 5, "indexes_created": 15}'
);

-- =====================================================
-- GRANTS and PERMISSIONS
-- =====================================================

-- Grant permissions to application user (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON audit_logs TO johorup_app;
-- GRANT SELECT, INSERT ON login_attempts TO johorup_app;
-- GRANT SELECT, INSERT, UPDATE ON system_events TO johorup_app;
-- GRANT SELECT, INSERT ON data_changes TO johorup_app;
-- GRANT SELECT, INSERT, UPDATE ON security_events TO johorup_app;

-- Grant sequence permissions
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO johorup_app;

-- =====================================================
-- END OF AUDIT SCHEMA
-- =====================================================

-- To apply this schema:
-- 1. Connect to your PostgreSQL database
-- 2. Run: \i audit_schema.sql
-- 3. Verify tables: \dt
-- 4. Check indexes: \di
-- 5. Test functions: SELECT log_audit_entry(...);