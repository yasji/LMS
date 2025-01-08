import { createBorrowedBooksSection, setupBorrowedBooksEvents } from './borrowedBooks.js';
import { createAvailableBooksSection, setupAvailableBooksEvents } from './availableBooks.js';
import { getBooks, getBorrowers, ReturnBook, BorrowBook } from '../../utils/api.js';
import { showConfirmDialog2 } from '../../utils/dialog.js';

export async function setupBorrowerDashboard(container) {
  const books = await getBooks();
  const borrowers = await getBorrowers();
  const borrower = borrowers.find(b => b.id === Number(localStorage.getItem('userId')));
  
  // Update sidebar for borrower view
  const sidebar = document.querySelector('aside');
  sidebar.innerHTML = `
    <div class="h-full px-3 py-4 overflow-y-auto">
      <ul class="space-y-2 font-medium">
        <li>
          <a href="#available" class="nav-link flex items-center p-2 rounded-lg hover:bg-secondary group">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span class="ml-3">Available Books</span>
          </a>
        </li>
        <li>
          <a href="#borrowed" class="nav-link flex items-center p-2 rounded-lg hover:bg-secondary group">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            <span class="ml-3">Borrowed Books</span>
          </a>
        </li>
      </ul>
    </div>
  `;

  // Update content based on hash
  const updateContent = async () => {
    const hash = window.location.hash || '#available';
    container.innerHTML = `
      <div class="min-h-screen bg-background p-8">
        <div class="max-w-7xl mx-auto space-y-8">
          ${hash === '#available' 
            ? createAvailableBooksSection(books, borrower, handleBorrow)
            : await createBorrowedBooksSection(borrower, handleReturn)}
        </div>
      </div>
    `;

    if (hash === '#available') {
      setupAvailableBooksEvents(borrower, handleBorrow);
    } else {
      setupBorrowedBooksEvents(handleReturn);
    }
  };

  // Handle book borrowing
  const handleBorrow = async (bookId) => {
    await BorrowBook(borrower.id, bookId);
    setupBorrowerDashboard(container);
  };

  // Handle book returns
  const handleReturn = async (bookId) => {
    if (await showConfirmDialog2('Are you sure you want to return this book?')) {
      await ReturnBook(borrower.id, bookId);
      setupBorrowerDashboard(container);
    }
  };

  // Setup navigation
  window.addEventListener('hashchange', updateContent);
  updateContent();
}