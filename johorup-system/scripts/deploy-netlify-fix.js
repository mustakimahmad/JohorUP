#!/usr/bin/env node

/**
 * Deploy to Netlify with database setup
 * This script will deploy the app and test the database connection
 */

const { execSync } = require('child_process');
const https = require('https');

console.log('🚀 Starting Netlify deployment with database setup...\n');

// Step 1: Build the project
console.log('📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Deploy to Netlify
console.log('🌐 Deploying to Netlify...');
try {
  execSync('netlify deploy --prod --dir=.next', { stdio: 'inherit' });
  console.log('✅ Deployment completed successfully\n');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('💡 Make sure you have Netlify CLI installed and logged in');
  console.log('   npm install -g netlify-cli');
  console.log('   netlify login');
  process.exit(1);
}

// Step 3: Test database connection
console.log('🔍 Testing database connection...');
setTimeout(() => {
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
      try {
        const result = JSON.parse(data);
        if (result.status === 'connected') {
          console.log('✅ Database connection successful!');
          console.log(`   Database: ${result.database}`);
          console.log(`   Version: ${result.version}`);
          console.log(`   Query Time: ${result.queryTime}\n`);
          
          // Step 4: Import initial data
          console.log('📊 Setting up initial database data...');
          importInitialData();
        } else {
          console.log('❌ Database connection failed:', result.error);
          console.log('💡 Please check your DATABASE_URL environment variable in Netlify');
        }
      } catch (error) {
        console.log('❌ Failed to parse database response:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Database test request failed:', error.message);
  });

  req.end();
}, 5000); // Wait 5 seconds for deployment to propagate

function importInitialData() {
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
      try {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('✅ Initial data import successful!');
          console.log(`   PPDs: ${result.data.ppds}`);
          console.log(`   Schools: ${result.data.schools}`);
          console.log(`   Students: ${result.data.students}`);
          console.log(`   Users: ${result.data.users}\n`);
          
          console.log('🎉 Deployment completed successfully!');
          console.log('🌐 Your app is live at: https://johorup.netlify.app');
          console.log('🔐 Login page: https://johorup.netlify.app/login.html');
          console.log('📊 Import data: https://johorup.netlify.app/import-data.html');
        } else {
          console.log('❌ Data import failed:', result.error);
        }
      } catch (error) {
        console.log('❌ Failed to parse import response:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Data import request failed:', error.message);
  });

  req.write(postData);
  req.end();
}