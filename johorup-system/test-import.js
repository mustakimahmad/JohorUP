// Simple test to import data via API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testImport() {
  try {
    console.log('🔍 Testing database import...');
    
    const response = await fetch('https://johorup.netlify.app/api/import-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: 'AdminPass123!' })
    });
    
    const data = await response.json();
    
    console.log('📊 Import Result:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Import successful!');
      console.log(`📈 Data imported:`);
      console.log(`   PPDs: ${data.data.ppds}`);
      console.log(`   Schools: ${data.data.schools}`);
      console.log(`   Students: ${data.data.students}`);
      console.log(`   Users: ${data.data.users}`);
    } else {
      console.log('❌ Import failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testImport();