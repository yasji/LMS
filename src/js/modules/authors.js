import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from '../utils/api.js';
import { showConfirmDialog } from '../utils/dialog.js';
import { createModal } from '../components/Modal.js';
import { createAuthorForm } from '../components/forms/AuthorForm.js';
import { createTable } from '../components/Table.js';

export async function setupAuthors(container) {
  try {
    const authors = await getAuthors();
    
    const itemsPerPage = 10;
    let currentPage = 1;
    const totalPages = Math.ceil(authors.length / itemsPerPage);
    
    function renderTable() {
      const start = (currentPage - 1) * itemsPerPage;
      const paginatedAuthors = authors.slice(start, start + itemsPerPage);
      
      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold tracking-tight">Authors Management</h2>
            <button id="add-author" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Add Author</button>
          </div>
          
          ${createTable({
            headers: ['Name', 'Books Count'],
            rows: paginatedAuthors.map(author => `
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle">${author.name}</td>
                <td class="p-4 align-middle">${author.books.length}</td>
                <td class="p-4 align-middle">
                  <div class="flex items-center space-x-2">
                    <button class="edit-author text-primary hover:text-primary/80" data-id="${author.id}">Edit</button>
                    <button class="delete-author text-destructive hover:text-destructive/80" data-id="${author.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')
          })}
          
          <div class="flex justify-end items-center space-x-2">
            <span class="flex items-center justify-center text-sm font-medium">Page ${currentPage} of ${totalPages}</span>
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
      
      setupEventListeners();
      setupPaginationButtons();
    }
    
    function setupEventListeners() {
      // Add Author
      document.getElementById('add-author')?.addEventListener('click', () => {
        const modal = createModal('Add New Author', createAuthorForm());
        const form = modal.querySelector('#author-form');
        
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const authorData = {
            name: formData.get('name'),
            booksCount: 0
          };
          
          try {
            await addAuthor(authorData);
            modal.remove();
            setupAuthors(container);
          } catch (error) {
            console.error('Error adding author:', error);
            alert('Failed to add author. Please try again.');
          }
        });
      });

      // Edit Author
      document.querySelectorAll('.edit-author').forEach(button => {
        button.addEventListener('click', async (e) => {
          const authorId = parseInt(e.target.dataset.id);
          const author = authors.find(a => a.id === authorId);
          
          const modal = createModal('Edit Author', createAuthorForm(author));
          const form = modal.querySelector('#author-form');
          
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const authorData = {
              name: formData.get('name')
            };
            
            try {
              await updateAuthor(authorId, authorData);
              modal.remove();
              setupAuthors(container);
            } catch (error) {
              console.error('Error updating author:', error);
              alert('Failed to update author. Please try again.');
            }
          });
        });
      });

      // Delete Author
      document.querySelectorAll('.delete-author').forEach(button => {
        button.addEventListener('click', async (e) => {
          const authorId = parseInt(e.target.dataset.id);
          if (await showConfirmDialog('Are you sure you want to delete this author?')) {
            try {
              await deleteAuthor(authorId);
              setupAuthors(container);
            } catch (error) {
              console.error('Error deleting author:', error);
              alert('Failed to delete author. Please try again.');
            }
          }
        });
      });
    }

    function setupPaginationButtons() {
      const prevButton = document.getElementById('prev-page');
      const nextButton = document.getElementById('next-page');

      if (!prevButton || !nextButton) return;

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

      // Disable buttons appropriately
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages;
    }
    
    renderTable();
  } catch (error) {
    console.error('Error setting up authors:', error);
    container.innerHTML = '<p class="text-destructive">Error loading authors data</p>';
  }
}