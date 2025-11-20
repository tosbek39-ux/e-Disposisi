// Debug script untuk login issues
// Buka browser console dan jalankan script ini

console.log('=== LOGIN DEBUG SCRIPT ===');

// Check localStorage
console.log('1. Checking localStorage...');
console.log('users:', localStorage.getItem('users'));
console.log('currentUser:', localStorage.getItem('currentUser'));

// Check users data
try {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  console.log('2. Parsed users:', users);
  console.log('3. Available usernames:', users.map(u => u.username));
  console.log('4. Passwords:', users.map(u => ({ username: u.username, password: u.password })));
} catch (error) {
  console.error('5. Error parsing users:', error);
}

// Check current user
try {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  console.log('6. Current user:', currentUser);
} catch (error) {
  console.error('7. Error parsing current user:', error);
}

// Test login function
console.log('8. Testing login function...');
const testLogin = (username, password) => {
  try {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let foundUser = users.find(u => u.username === username && u.password === password);
    console.log(`Login test for "${username}":`, foundUser ? 'SUCCESS' : 'FAILED');
    return foundUser ? true : false;
  } catch (error) {
    console.error('Login test error:', error);
    return false;
  }
};

// Test with default users
['kpa', 'sekretaris', 'superadmin'].forEach(user => {
  testLogin(user, 'password');
  if (user === 'superadmin') {
    testLogin(user, 'admin');
  }
});

console.log('=== END DEBUG ===');

// Function to fix common issues
window.fixLoginIssues = function() {
  // Remove corrupted data
  localStorage.removeItem('users');
  localStorage.removeItem('currentUser');
  
  // Reload page to recreate default users
  console.log('Data removed. Reloading page...');
  setTimeout(() => window.location.reload(), 1000);
  
  console.log('Run window.fixLoginIssues() to fix common login issues');
};