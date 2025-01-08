import { createModal } from '../components/Modal.js';
import { getCategories, getBooks, addBook, updateBook, deleteBook } from '../utils/api.js';
import { showConfirmDialog } from '../utils/dialog.js';
import { createBookForm } from '../components/forms/BookForm.js';
import { createTable } from '../components/Table.js';

export async function setupBooks(container) {
  try {
    const [books, categories] = await Promise.all([getBooks(), getCategories()]);
    
    const itemsPerPage = 10;
    let currentPage = 1;
    const totalPages = Math.ceil(books.length / itemsPerPage);
    
    function renderTable() {
      const start = (currentPage - 1) * itemsPerPage;
      const paginatedBooks = books.slice(start, start + itemsPerPage);
      
      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-3xl font-bold tracking-tight">Books Management</h2>
            <div class="flex items-center space-x-2">
              <button id="add-book" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Add Book
              </button>
              <button id="export-pdf" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                Export PDF
              </button>
            </div>
          </div>
          
          ${createTable({
            headers: ['Title', 'Author', 'Genre', 'Published Year', 'Total Copies','Available Copies'],
            rows: paginatedBooks.map(book => `
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle">${book.title}</td>
                <td class="p-4 align-middle">${book.author}</td>
                <td class="p-4 align-middle">${book.genre}</td>
                <td class="p-4 align-middle">${book.publishedYear}</td>
                <td class="p-4 align-middle">${book.totalCopies}</td>
                <td class="p-4 align-middle">${book.availableCopies}</td>

                <td class="p-4 align-middle">
                  <div class="flex items-center space-x-2">
                    <button class="edit-book text-primary hover:text-primary/80" data-id="${book.id}">Edit</button>
                    <button class="delete-book text-destructive hover:text-destructive/80" data-id="${book.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')
          })}
          
          <div class="flex justify-end items-center space-x-2">
            <span class="flex w-[100px] items-center justify-center text-sm font-medium">Page ${currentPage} of ${totalPages}</span>
            <button id="prev-page" class="inline-flex items-center justify-center rounded-md text-xs font-medium bg-transparent border border-secondary text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 h-8 w-8" aria-label="Previous Page">
              <!-- Lucide Chevron Left Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button id="next-page" class="inline-flex items-center justify-center rounded-md text-xs font-medium bg-transparent border border-secondary text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 h-8 w-8" aria-label="Next Page">
              <!-- Lucide Chevron Right Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      `;
      
      setupEventListeners(categories, books);
      setupPaginationButtons();
    }
    
    function setupEventListeners(categories, books) {
      // Add Book
      document.getElementById('add-book')?.addEventListener('click', () => {
        const modal = createModal('Add New Book', createBookForm(null, categories));
        const form = modal.querySelector('#book-form');
        
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          try {
            const formData = new FormData(form);
            const bookData = {
              title: formData.get('title'),
              author: formData.get('author'),
              genre: formData.get('genre'),
              publishedYear: parseInt(formData.get('publishedYear')),
              totalCopies: parseInt(formData.get('totalCopies')) || 4, // Default to 4 copies if not provided
              availableCopies: parseInt(formData.get('availableCopies')) || 4
            };
            
            await addBook(bookData);
            modal.remove();
            setupBooks(container);
          } catch (error) {
            console.error('Error adding book:', error);
            alert('Failed to add book. Please try again.');
          }
        });
      });

      // Edit Book
      document.querySelectorAll('.edit-book').forEach(button => {
        button.addEventListener('click', async (e) => {
          try {
            const bookId = parseInt(e.target.dataset.id);
            const book = books.find(b => b.id === bookId);
            
            if (!book) {
              throw new Error('Book not found');
            }

            const modal = createModal('Edit Book', createBookForm(book, categories));
            const form = modal.querySelector('#book-form');
            
            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              try {
                const formData = new FormData(form);
                const bookData = {
                  title: formData.get('title'),
                  author: formData.get('author'),
                  genre: formData.get('genre'),
                  publishedYear: parseInt(formData.get('publishedYear')),
                  totalCopies: parseInt(formData.get('totalCopies')) || book.totalCopies,
                  availableCopies: parseInt(formData.get('availableCopies')) || book.availableCopies
                };
                
                await updateBook(bookId, bookData);
                modal.remove();
                setupBooks(container);
              } catch (error) {
                console.error('Error updating book:', error);
                alert('Failed to update book. Please try again.');
              }
            });
          } catch (error) {
            console.error('Error setting up edit form:', error);
            alert('Failed to load book data. Please try again.');
          }
        });
      });

      // Delete Book
      document.querySelectorAll('.delete-book').forEach(button => {
        button.addEventListener('click', async (e) => {
          try {
            const bookId = parseInt(e.target.dataset.id);
            const book = books.find(b => b.id === bookId);
            
            if (await showConfirmDialog('Are you sure you want to delete this book?')) {
              await deleteBook(bookId, book.author, book.genre);
              setupBooks(container);
            }
          } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book. Please try again.');
          }
        });
      });
    }

    function setupPaginationButtons() {
      const prevButton = document.getElementById('prev-page');
      const nextButton = document.getElementById('next-page');

      // Disable Previous button on first page
      prevButton.disabled = currentPage === 1;

      // Disable Next button on last page
      nextButton.disabled = currentPage === totalPages;

      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      });

      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderTable();
        }
      });
    }
    
    renderTable();
  } catch (error) {
    console.error('Error setting up books:', error);
    container.innerHTML = '<p class="text-destructive">Error loading books data</p>';
  }
}