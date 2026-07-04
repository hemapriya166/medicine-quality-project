const API_URL = 'http://localhost:5000/api/auth';

// SIGNUP FORM
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully! Please sign in.');
        window.location.href = 'index.html';
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Could not connect to server. Make sure backend is running.');
      console.error(err);
    }
  });
}

// LOGIN FORM
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('loggedInUser', JSON.stringify(data));
        window.location.href = 'dashboard.html';
      } else {
        alert(data.error || 'Invalid username or password');
      }
    } catch (err) {
      alert('Could not connect to server. Make sure backend is running.');
      console.error(err);
    }
  });
}