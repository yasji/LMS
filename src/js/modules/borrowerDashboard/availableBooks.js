import { getBooks } from '../../utils/api.js';
import { showConfirmDialog2 } from '../../utils/dialog.js';

export function createAvailableBooksSection(books, borrower, onBorrow) {
  // Sort books by available copies in descending order
  const sortedBooks = books.sort((a, b) => b.availableCopies - a.availableCopies);

  return `
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-foreground">Available Books</h2>
      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        ${sortedBooks
          .filter(book => !borrower.borrowedBooks.some(b => b.bookId === book.id))
          .map(book => `
            <div class="bg-card rounded-xl shadow-lg overflow-hidden border group">
              <div class="relative h-80">
                <img 
                  src=${book.coverUrl}
                  alt="${book.title}"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    class="borrow-book px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    data-book-id="${book.id}"
                    ${book.availableCopies === 0 ? 'disabled' : ''}
                  >
                    ${book.availableCopies === 0 ? 'Unavailable' : 'Borrow'}
                  </button>
                </div>
              </div>
              <div class="p-4 space-y-2">
                <h3 class="text-lg font-semibold text-card-foreground">${book.title}</h3>
                <p class="text-sm text-muted-foreground">By ${book.author}</p>
                <p class="text-sm text-muted-foreground">Genre: ${book.genre}</p>
                <p class="text-sm text-muted-foreground">Available Copies: ${book.availableCopies}</p>
              </div>
            </div>
          `).join('')}
      </div>
    </div>
  `;
}

export function setupAvailableBooksEvents(borrower, onBorrow) {
  document.querySelectorAll('.borrow-book').forEach(button => {
    button.addEventListener('click', async (e) => {
      const bookId = Number(e.target.dataset.bookId);
      const books = await getBooks();
      const book = books.find(b => b.id === bookId);
      
      if (book.availableCopies > 0 && await showConfirmDialog2(`Would you like to borrow "${book.title}"?`)) {
        onBorrow(bookId);
      }
    });
  });
}