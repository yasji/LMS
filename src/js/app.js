import { setupDashboard } from './modules/adminDashboard/dashboard.js';
import { setupBooks } from './modules/adminDashboard/books.js';
import { setupAuthors } from './modules/adminDashboard/authors.js';
import { setupBorrowers } from './modules/adminDashboard/borrowers.js';
import { setupLoans } from './modules/adminDashboard/loans.js';
import { setupCategories } from './modules/adminDashboard/categories.js';
import { setupBorrowerDashboard } from './modules/borrowerDashboard/index.js';



export function initializeAdminApp() {
  const content = document.getElementById('content');
  const navLinks = document.querySelectorAll('.nav-link');

  // Router function
  const router = () => {
    const hash = window.location.hash || '#dashboard';
    content.innerHTML = ''; // Clear content

    switch (hash) {
      case '#dashboard':
        setupDashboard(content);
        break;
      case '#books':
        setupBooks(content);
        break;
      case '#authors':
        setupAuthors(content);
        break;
      case '#borrowers':
        setupBorrowers(content);
        break;
      case '#loans':
        setupLoans(content);
        break;
      case '#categories':
        setupCategories(content);
        break;
      default:
        setupDashboard(content);
        break;
    }
  };

  // Initialize router
  window.addEventListener('hashchange', router);
  router(); // Initial route

  // Highlight active nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('bg-gray-700'));
      link.classList.add('bg-gray-700');
    });
  });
}



export function initializeBorrowerApp() {
  const content = document.getElementById('content');
  const navLinks = document.querySelectorAll('.nav-link');

  content.innerHTML = ''; // Clear content
  setupBorrowerDashboard(content);


  // Initialize router
 // Initial route

  // Highlight active nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('bg-gray-700'));
      link.classList.add('bg-gray-700');
    });
  });
}