#!/usr/bin/env node

/**
 * Test Netlify database connection and import data
 */

const https = require('https');

console.log('🔍 Testing Netlify database connection...\n');

// Test database connection
function testDatabase() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'johorup.netlify.app',
      port: 443,
      path: '/.netlify/functions/test-db',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Raw response:', data);
        try {
          const result = JSON.parse(data);
          if (result.status === 'connected') {
            console.log('✅ Database connection successful!');
            console.log(`   Database: ${result.database}`);
            console.log(`   Version: ${result.version}`);
            console.log(`   Query Time: ${result.queryTime}\n`);
            resolve(result);
          } else {
            console.log('❌ Database connection failed:', result.error);
            reject(new Error(result.error));
          }
        } catch (error) {
          console.log('❌ Failed to parse database response:', error.message);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Database test request failed:', error.message);
      reject(error);
    });

    req.end();
  });
}

// Import initial data
function importData() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      password: 'AdminPass123!'
    });

    const options = {
      hostname: 'johorup.netlify.app',
      port: 443,
      path: '/.netlify/functions/import-data',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Import raw response:', data);
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Initial data import successful!');
            console.log(`   PPDs: ${result.data.ppds}`);
            console.log(`   Schools: ${result.data.schools}`);
            console.log(`   Students: ${result.data.students}`);
            console.log(`   Users: ${result.data.users}\n`);
            resolve(result);
          } else {
            console.log('❌ Data import failed:', result.error);
            reject(new Error(result.error));
          }
        } catch (error) {
          console.log('❌ Failed to parse import response:', error.message);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Data import request failed:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    await testDatabase();
    console.log('📊 Setting up initial database data...');
    await importData();
    
    console.log('🎉 All tests completed successfully!');
    console.log('🌐 Your app is live at: https://johorup.netlify.app');
    console.log('🔐 Login page: https://johorup.netlify.app/login.html');
    console.log('📊 Import data: https://johorup.netlify.app/import-data.html');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();