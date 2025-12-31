// Script lengkap untuk reset data dan clear browser cache

const { exec } = require('child_process');

console.log('🚀 JohorUP System - Complete Reset');
console.log('==================================');

async function openBrowserWithClearScript() {
  return new Promise((resolve) => {
    console.log('🌐 Membuka browser dengan auto-clear script...');
    
    // Create HTML page with auto-clear script
    const fs = require('fs');
    const path = require('path');
    
    const autoResetPage = `<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JohorUP - Auto Reset</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .status {
            margin: 10px 0;
            padding: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 5px;
        }
        .success { background: rgba(34, 197, 94, 0.3); }
        .info { background: rgba(59, 130, 246, 0.3); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧹 JohorUP System Reset</h1>
        <div class="spinner"></div>
        <div id="status">Memulakan pembersihan data...</div>
        
        <div class="status info">
            <strong>📋 Login Info Selepas Reset:</strong><br>
            📧 admin@jpnj.gov.my<br>
            🔑 AdminPass123!
        </div>
    </div>

    <script>
        let step = 0;
        const steps = [
            'Membersihkan localStorage...',
            'Membersihkan sessionStorage...',
            'Membersihkan cache data...',
            'Membuang data user lama...',
            'Reset selesai! Mengalihkan ke login...'
        ];
        
        function updateStatus() {
            const statusEl = document.getElementById('status');
            if (step < steps.length) {
                statusEl.textContent = steps[step];
                step++;
                setTimeout(updateStatus, 800);
            } else {
                // Clear all data
                localStorage.clear();
                sessionStorage.clear();
                
                // Clear specific items
                localStorage.removeItem('user');
                localStorage.removeItem('maintenanceMode');
                localStorage.removeItem('dashboardStats');
                
                // Clear IndexedDB if exists
                if ('indexedDB' in window) {
                    indexedDB.databases().then(databases => {
                        databases.forEach(db => {
                            if (db.name) indexedDB.deleteDatabase(db.name);
                        });
                    });
                }
                
                // Clear service worker cache if exists
                if ('caches' in window) {
                    caches.keys().then(names => {
                        names.forEach(name => {
                            caches.delete(name);
                        });
                    });
                }
                
                statusEl.innerHTML = '<div class="status success">✅ Reset selesai! Mengalihkan ke dashboard...</div>';
                
                // Redirect to main app
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        }
        
        // Start the process
        setTimeout(updateStatus, 1000);
    </script>
</body>
</html>`;

    try {
      const resetPagePath = path.join(__dirname, '..', 'public', 'auto-reset.html');
      fs.writeFileSync(resetPagePath, autoResetPage);
      console.log('✅ Auto-reset page telah dicipta');
      
      // Open browser to the reset page
      const platform = process.platform;
      let command;
      
      if (platform === 'win32') {
        command = 'start http://localhost:3000/auto-reset.html';
      } else if (platform === 'darwin') {
        command = 'open http://localhost:3000/auto-reset.html';
      } else {
        command = 'xdg-open http://localhost:3000/auto-reset.html';
      }
      
      exec(command, (error) => {
        if (error) {
          console.log('🔗 Sila buka browser dan pergi ke: http://localhost:3000/auto-reset.html');
        } else {
          console.log('✅ Browser telah dibuka dengan auto-reset page');
        }
        resolve();
      });
      
    } catch (error) {
      console.error('❌ Ralat mencipta reset page:', error.message);
      resolve();
    }
  });
}

async function main() {
  try {
    console.log('🧹 Memulakan complete reset...');
    
    await openBrowserWithClearScript();
    
    console.log('\n🎉 Complete reset telah dimulakan!');
    console.log('\n📋 Langkah seterusnya:');
    console.log('1. Browser akan buka dengan auto-reset page');
    console.log('2. Tunggu proses reset selesai (5-10 saat)');
    console.log('3. Anda akan dialihkan ke dashboard');
    console.log('4. Login dengan maklumat berikut:');
    console.log('   📧 admin@jpnj.gov.my');
    console.log('   🔑 AdminPass123!');
    console.log('\n✨ Semua data mockup telah dibersihkan!');
    
  } catch (error) {
    console.error('❌ Complete reset gagal:', error.message);
    process.exit(1);
  }
}

main();