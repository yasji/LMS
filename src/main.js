import './styles/main.css';

import { setupAuth } from './js/auth.js';
import { setupI18n } from './js/i18n.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  await setupI18n();
  setupAuth();
});