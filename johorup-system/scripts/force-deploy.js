#!/usr/bin/env node

/**
 * Force Deploy Script
 * Clears all caches and forces a fresh deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting force deployment...');

try {
  // 1. Clear Next.js cache
  console.log('🧹 Clearing Next.js cache...');
  const nextDir = path.join(__dirname, '../.next');
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ .next directory cleared');
  }

  // 2. Clear node_modules cache
  console.log('🧹 Clearing node_modules cache...');
  const nodeModulesDir = path.join(__dirname, '../node_modules/.cache');
  if (fs.existsSync(nodeModulesDir)) {
    fs.rmSync(nodeModulesDir, { recursive: true, force: true });
    console.log('✅ node_modules cache cleared');
  }

  // 3. Clear Netlify cache
  console.log('🧹 Clearing Netlify cache...');
  const netlifyDir = path.join(__dirname, '../.netlify');
  if (fs.existsSync(netlifyDir)) {
    fs.rmSync(netlifyDir, { recursive: true, force: true });
    console.log('✅ .netlify directory cleared');
  }

  // 4. Reinstall dependencies
  console.log('📦 Reinstalling dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  // 5. Build fresh
  console.log('🔨 Building fresh...');
  execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  // 6. Deploy with cache bypass
  console.log('🚀 Deploying with cache bypass...');
  execSync('netlify deploy --prod --skip-functions-cache', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..') 
  });

  console.log('✅ Force deployment completed successfully!');
  console.log('🌐 Site should be updated at: https://johorup.netlify.app');
  console.log('💡 If still showing old content, try hard refresh (Ctrl+F5)');

} catch (error) {
  console.error('❌ Force deployment failed:', error.message);
  process.exit(1);
}