import { getBookDetails } from '../../utils/api.js'; // Assuming this function fetches book details by bookId

export async function createBorrowedBooksSection(borrower, onReturn) {
  if (!borrower.borrowedBooks.length) {
    return '<p class="text-muted-foreground">You have no borrowed books.</p>';
  }

  const borrowedBooksHtml = await Promise.all(borrower.borrowedBooks.map(async book => {
    const bookDetails = await getBookDetails(book.bookId);
    return `
      <div class="bg-card rounded-xl shadow-lg overflow-hidden border" data-id="${book.bookId}">
        <div class="relative h-80">
          <img 
            src=${bookDetails.coverUrl}
            alt="${bookDetails.title}"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6 space-y-3">
          <h3 class="text-xl font-semibold text-card-foreground">${bookDetails.title}</h3>
          <p class="text-sm text-muted-foreground">By ${bookDetails.author}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm ${book.isOverdue ? 'text-destructive' : 'text-muted-foreground'}">
              Due: ${bookDetails.dueDate}
            </span>
            <button 
              class="return-book px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              data-title="${bookDetails.title}"
              data-id="${book.bookId}"
            >
              Return
            </button>
          </div>
        </div>
      </div>
    `;
  }));

  return `
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-foreground">Borrowed Books</h2>
      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        ${borrowedBooksHtml.join('')}
      </div>
    </div>
  `;
}

export function setupBorrowedBooksEvents(onReturn) {
  document.querySelectorAll('.return-book').forEach(button => {
    button.addEventListener('click', async (e) => {
      const title = e.target.dataset.title;
      const id = e.target.dataset.id;
      onReturn(id, title);
    });
  });
}