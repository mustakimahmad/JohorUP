#!/usr/bin/env node

/**
 * Export Production Data Script
 * Downloads all data from production Neon database
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKUP_DIR = path.join(__dirname, '../backups');
const DATA_DIR = path.join(__dirname, '../data');

// Ensure directories exist
[BACKUP_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper functions
const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

const error = (message) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
};

// Database connection
const createPool = (connectionString) => {
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
};

// Export table to CSV
const exportTableToCSV = async (pool, tableName, outputPath) => {
  try {
    log(`Exporting ${tableName}...`);
    
    const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id`);
    
    if (result.rows.length === 0) {
      log(`  No data found in ${tableName}`);
      return 0;
    }
    
    // Get column names
    const columns = Object.keys(result.rows[0]);
    
    // Create CSV content
    let csvContent = columns.join(',') + '\n';
    
    result.rows.forEach(row => {
      const values = columns.map(col => {
        let value = row[col];
        
        // Handle null values
        if (value === null || value === undefined) {
          return '';
        }
        
        // Handle dates
        if (value instanceof Date) {
          value = value.toISOString();
        }
        
        // Handle strings with commas or quotes
        if (typeof value === 'string') {
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = '"' + value.replace(/"/g, '""') + '"';
          }
        }
        
        return value;
      });
      
      csvContent += values.join(',') + '\n';
    });
    
    // Write to file
    fs.writeFileSync(outputPath, csvContent);
    log(`  Exported ${result.rows.length} rows to ${outputPath}`);
    
    return result.rows.length;
    
  } catch (err) {
    error(`Failed to export ${tableName}: ${err.message}`);
    return 0;
  }
};

// Export database schema
const exportSchema = async (pool, outputPath) => {
  try {
    log('Exporting database schema...');
    
    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    let schemaSQL = '-- JohorUP Database Schema Export\n';
    schemaSQL += `-- Generated on: ${new Date().toISOString()}\n\n`;
    
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      // Get table structure
      const structureResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      schemaSQL += `-- Table: ${tableName}\n`;
      schemaSQL += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      
      const columns = structureResult.rows.map(col => {
        let line = `  ${col.column_name} ${col.data_type.toUpperCase()}`;
        
        if (col.is_nullable === 'NO') {
          line += ' NOT NULL';
        }
        
        if (col.column_default) {
          line += ` DEFAULT ${col.column_default}`;
        }
        
        return line;
      });
      
      schemaSQL += columns.join(',\n');
      schemaSQL += '\n);\n\n';
    }
    
    fs.writeFileSync(outputPath, schemaSQL);
    log(`Schema exported to ${outputPath}`);
    
  } catch (err) {
    error(`Failed to export schema: ${err.message}`);
  }
};

// Main export function
const exportProductionData = async () => {
  const productionURL = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!productionURL) {
    error('Production database URL not found!');
    console.log('Set PROD_DATABASE_URL or DATABASE_URL environment variable');
    console.log('Example: PROD_DATABASE_URL="postgresql://user:pass@host/db" node scripts/export-production-data.js');
    process.exit(1);
  }
  
  log('=== JohorUP Production Data Export ===');
  log(`Database: ${productionURL.replace(/\/\/.*@/, '//***:***@')}`);
  
  const pool = createPool(productionURL);
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    log('✅ Database connection successful');
    
    // Create timestamp for this export
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    
    // Export schema
    const schemaPath = path.join(BACKUP_DIR, `schema_${timestamp}.sql`);
    await exportSchema(pool, schemaPath);
    
    // Tables to export
    const tables = [
      'users',
      'schools', 
      'students',
      'teachers',
      'subjects',
      'ppds',
      'programs',
      'program_reports',
      'student_attendance',
      'program_photos',
      'audit_logs'
    ];
    
    let totalRecords = 0;
    
    // Export each table
    for (const table of tables) {
      try {
        const csvPath = path.join(DATA_DIR, `${table}_${timestamp}.csv`);
        const count = await exportTableToCSV(pool, table, csvPath);
        totalRecords += count;
      } catch (err) {
        log(`  Skipping ${table}: ${err.message}`);
      }
    }
    
    // Create full database dump
    log('Creating full database dump...');
    const dumpPath = path.join(BACKUP_DIR, `full_backup_${timestamp}.sql`);
    
    // Note: This requires pg_dump to be available
    const { spawn } = require('child_process');
    
    const pgDump = spawn('pg_dump', [productionURL], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    const writeStream = fs.createWriteStream(dumpPath);
    pgDump.stdout.pipe(writeStream);
    
    pgDump.on('close', (code) => {
      if (code === 0) {
        log(`Full backup created: ${dumpPath}`);
      } else {
        log('pg_dump not available or failed - CSV exports still available');
      }
    });
    
    // Create export summary
    const summaryPath = path.join(BACKUP_DIR, `export_summary_${timestamp}.json`);
    const summary = {
      timestamp: new Date().toISOString(),
      database: productionURL.replace(/\/\/.*@/, '//***:***@'),
      totalRecords,
      tables: tables.length,
      files: {
        schema: `schema_${timestamp}.sql`,
        fullBackup: `full_backup_${timestamp}.sql`,
        csvFiles: tables.map(t => `${t}_${timestamp}.csv`)
      }
    };
    
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    log('=== Export Complete ===');
    log(`Total records exported: ${totalRecords}`);
    log(`Files created in: ${BACKUP_DIR} and ${DATA_DIR}`);
    log(`Summary: ${summaryPath}`);
    
  } catch (err) {
    error(`Export failed: ${err.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run export if called directly
if (require.main === module) {
  exportProductionData();
}

module.exports = { exportProductionData };