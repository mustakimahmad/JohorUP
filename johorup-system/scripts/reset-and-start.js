// Script lengkap untuk reset data dan start aplikasi

const { exec, spawn } = require('child_process');
const path = require('path');

console.log('🚀 JohorUP System - Reset & Start');
console.log('================================');

async function resetData() {
  return new Promise((resolve, reject) => {
    console.log('🧹 Membersihkan data mockup...');
    
    exec('node scripts/clear-mockup-data.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Ralat membersihkan data:', error.message);
        reject(error);
      } else {
        console.log('✅ Data mockup telah dibersihkan');
        resolve();
      }
    });
  });
}

async function startApp() {
  return new Promise((resolve) => {
    console.log('🌐 Memulakan aplikasi...');
    
    const appProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Tunggu aplikasi ready
    setTimeout(() => {
      console.log('✅ Aplikasi telah dimulakan di http://localhost:3000');
      resolve();
    }, 3000);
  });
}

async function openBrowser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const platform = process.platform;
      let command;
      
      if (platform === 'win32') {
        command = 'start http://localhost:3000';
      } else if (platform === 'darwin') {
        command = 'open http://localhost:3000';
      } else {
        command = 'xdg-open http://localhost:3000';
      }
      
      exec(command, (error) => {
        if (error) {
          console.log('🔗 Sila buka browser dan pergi ke: http://localhost:3000');
        } else {
          console.log('✅ Browser telah dibuka');
        }
        resolve();
      });
    }, 2000);
  });
}

async function main() {
  try {
    await resetData();
    console.log('\n📋 Maklumat Login:');
    console.log('📧 Email: admin@jpnj.gov.my');
    console.log('🔑 Password: AdminPass123!');
    console.log('\n📧 Atau:');
    console.log('📧 Email: koordinator@jpnj.gov.my');
    console.log('🔑 Password: AdminPass123!');
    console.log('\n✨ Sistem siap digunakan!');
    
  } catch (error) {
    console.error('❌ Proses gagal:', error.message);
    process.exit(1);
  }
}

main();