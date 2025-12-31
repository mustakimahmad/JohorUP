// Script untuk membersihkan browser cache dan localStorage

console.log('🧹 Script untuk membersihkan browser cache dan localStorage');
console.log('===========================================================');

console.log('\n📋 Langkah-langkah untuk membersihkan browser cache:');
console.log('\n1. Buka Developer Tools (F12 atau Ctrl+Shift+I)');
console.log('2. Pergi ke tab "Console"');
console.log('3. Copy dan paste command berikut:');

console.log('\n📝 Command untuk clear localStorage:');
console.log('localStorage.clear(); sessionStorage.clear(); location.reload();');

console.log('\n📝 Command untuk clear semua cache:');
console.log(`
// Clear all storage
localStorage.clear();
sessionStorage.clear();

// Clear IndexedDB (if any)
if ('indexedDB' in window) {
  indexedDB.databases().then(databases => {
    databases.forEach(db => {
      if (db.name) indexedDB.deleteDatabase(db.name);
    });
  });
}

// Clear service worker cache (if any)
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name);
    });
  });
}

// Reload page
location.reload();
`);

console.log('\n🔄 Alternatif - Hard Refresh:');
console.log('• Windows/Linux: Ctrl + F5 atau Ctrl + Shift + R');
console.log('• Mac: Cmd + Shift + R');

console.log('\n🗑️ Alternatif - Clear Browser Data:');
console.log('• Chrome: Ctrl + Shift + Delete');
console.log('• Firefox: Ctrl + Shift + Delete');
console.log('• Edge: Ctrl + Shift + Delete');

console.log('\n✅ Selepas membersihkan cache:');
console.log('1. Refresh halaman (F5)');
console.log('2. Login semula dengan:');
console.log('   📧 admin@jpnj.gov.my');
console.log('   🔑 AdminPass123!');

console.log('\n⚠️ Nota: Data yayasan telah dibuang dari sistem');
console.log('⚠️ Hanya admin dan koordinator sahaja yang boleh login');