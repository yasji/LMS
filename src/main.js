import './styles/main.css';

import { setupAuth } from './js/auth.js';


// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  setupAuth();
});