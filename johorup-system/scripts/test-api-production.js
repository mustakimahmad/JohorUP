#!/usr/bin/env node

/**
 * Test Production API Functions
 * This script tests the deployed API functions on Netlify
 */

const https = require('https');

async function testAPI(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'johorup.netlify.app',
      port: 443,
      path: `/.netlify/functions/${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: responseData,
            error: 'Failed to parse JSON'
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Production API Functions...');
  console.log('=====================================');
  
  try {
    // Test 1: User Hierarchy
    console.log('1️⃣ Testing get-user-hierarchy...');
    const hierarchyTest = await testAPI('get-user-hierarchy', {
      userEmail: 'admin@s4pd.gov.my',
      userRole: 'super_admin_s4pd'
    });
    
    console.log(`Status: ${hierarchyTest.statusCode}`);
    if (hierarchyTest.statusCode === 200) {
      console.log('✅ User hierarchy API working');
      console.log(`Data keys: ${Object.keys(hierarchyTest.data)}`);
    } else {
      console.log('❌ User hierarchy API failed');
      console.log('Error:', hierarchyTest.data);
    }
    
    // Test 2: User Data
    console.log('\n2️⃣ Testing get-user-data...');
    const userDataTest = await testAPI('get-user-data', {
      userEmail: 'admin@s4pd.gov.my',
      userRole: 'super_admin_s4pd',
      dataType: 'dashboard_stats'
    });
    
    console.log(`Status: ${userDataTest.statusCode}`);
    if (userDataTest.statusCode === 200) {
      console.log('✅ User data API working');
      console.log(`Data keys: ${Object.keys(userDataTest.data)}`);
    } else {
      console.log('❌ User data API failed');
      console.log('Error:', userDataTest.data);
    }
    
    // Test 3: Admin User Management
    console.log('\n3️⃣ Testing admin-user-management...');
    const adminTest = await testAPI('admin-user-management', {
      action: 'get_hierarchy_options',
      adminEmail: 'admin@s4pd.gov.my',
      adminRole: 'super_admin_s4pd'
    });
    
    console.log(`Status: ${adminTest.statusCode}`);
    if (adminTest.statusCode === 200) {
      console.log('✅ Admin user management API working');
      console.log(`Data keys: ${Object.keys(adminTest.data)}`);
    } else {
      console.log('❌ Admin user management API failed');
      console.log('Error:', adminTest.data);
    }
    
    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();