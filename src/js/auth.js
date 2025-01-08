import { getBorrowers } from './utils/api.js';
import { initializeAdminApp, initializeBorrowerApp } from './app.js';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
};

export async function setupAuth() {
  const loginContainer = document.getElementById('login-container');
  const app = document.getElementById('app');

  // Create login form
  loginContainer.innerHTML = `
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-card rounded-lg shadow-xl p-8 border">
          <div class="flex flex-col items-center space-y-2 mb-8">
            <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h2 class="text-2xl font-bold text-card-foreground">Library Management</h2>
            <p class="text-muted-foreground">Sign in to your account</p>
          </div>
          <form id="login-form" class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-card-foreground" for="username">Username</label>
              <input
                type="text"
                id="username"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-card-foreground" for="password">Password</label>
              <input
                type="password"
                id="password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Initialize theme
  setupThemeToggle();

  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      loginContainer.classList.add('hidden');
      app.classList.remove('hidden');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      initializeAdminApp();
      return;
    }

    const borrowers = await getBorrowers();
    const borrower = borrowers.find(b => b.email === username && b.password === password);
    if (borrower) {
      loginContainer.classList.add('hidden');
      app.classList.remove('hidden');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'borrower');
      localStorage.setItem('userId', borrower.id);
      initializeBorrowerApp();
    } else {
      alert('Invalid credentials. Please try again.');
    }
  });

  // Check if user is already authenticated
  if (localStorage.getItem('isAuthenticated') === 'true') {
    loginContainer.classList.add('hidden');
    app.classList.remove('hidden');
    if (localStorage.getItem('userRole') === 'borrower') {
      initializeBorrowerApp();
    } else {
      initializeAdminApp();
    }
  }


  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    console.log('logout');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');

    loginContainer.classList.remove('hidden');
    app.classList.add('hidden');
    // set the window location to the base URL
    window.location.href = '/';
  });
}


function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Initialize theme
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}