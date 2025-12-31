
// Auto-clear browser data script
(function() {
  console.log('🧹 Auto-clearing browser data...');
  
  // Clear localStorage and sessionStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
    console.log('✅ localStorage cleared');
  }
  
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
  }
  
  // Clear any cached user data
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('maintenanceMode');
    localStorage.removeItem('dashboardStats');
    console.log('✅ User data cleared');
  }
  
  console.log('🎉 Browser data cleared successfully!');
  
  // Force reload after clearing
  setTimeout(() => {
    window.location.reload();
  }, 1000);
})();
