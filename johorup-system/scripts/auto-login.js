// Script untuk membuka browser dan login secara automatik

const { exec } = require('child_process');

console.log('🌐 Membuka browser dan login ke sistem...');

// URL aplikasi
const appUrl = 'http://localhost:3000';

// Buka browser
function openBrowser() {
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    command = `start ${appUrl}`;
  } else if (platform === 'darwin') {
    command = `open ${appUrl}`;
  } else {
    command = `xdg-open ${appUrl}`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error('❌ Ralat membuka browser:', error.message);
      console.log('🔗 Sila buka browser secara manual dan pergi ke:', appUrl);
    } else {
      console.log('✅ Browser telah dibuka');
    }
  });
}

// Tunggu sebentar untuk memastikan aplikasi ready
setTimeout(() => {
  openBrowser();
  
  console.log('\n📋 Maklumat Login:');
  console.log('🌐 URL: http://localhost:3000');
  console.log('📧 Email: admin@jpnj.gov.my');
  console.log('🔑 Password: AdminPass123!');
  console.log('\n📧 Atau gunakan:');
  console.log('📧 Email: koordinator@jpnj.gov.my');
  console.log('🔑 Password: AdminPass123!');
  console.log('\n✨ Data mockup telah dibersihkan. Sistem siap untuk data sebenar!');
  
}, 1000);