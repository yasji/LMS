import { getBorrowers, addBorrower, updateBorrower, deleteBorrower } from '../../utils/api.js';
import { showConfirmDialog } from '../../utils/dialog.js';
import { createModal } from '../../components/Modal.js';
import { createBorrowerForm } from '../../components/forms/BorrowerForm.js';
import { createTable } from '../../components/Table.js';

export async function setupBorrowers(container) {
  try {
    const borrowers = await getBorrowers();
    
    const itemsPerPage = 10;
    let currentPage = 1;
    const totalPages = Math.ceil(borrowers.length / itemsPerPage);
    
    function renderTable() {
      const start = (currentPage - 1) * itemsPerPage;
      const paginatedBorrowers = borrowers.slice(start, start + itemsPerPage);
      
      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold tracking-tight">Borrowers Management</h2>
            <button id="add-borrower" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Add Borrower</button>
          </div>
          
          ${createTable({
            headers: ['Name', 'Email', 'Active Loans'],
            rows: paginatedBorrowers.map(borrower => `
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle">${borrower.name}</td>
                <td class="p-4 align-middle">${borrower.email}</td>
                <td class="p-4 align-middle">${borrower.borrowedBooks.length}</td>
                <td class="p-4 align-middle">
                  <div class="flex items-center space-x-2">
                    <button class="edit-borrower text-primary hover:text-primary/80" data-id="${borrower.id}">Edit</button>
                    <button class="delete-borrower text-destructive hover:text-destructive/80" data-id="${borrower.id}">Delete</button>
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
      // Add Borrower
      document.getElementById('add-borrower')?.addEventListener('click', () => {
        const modal = createModal('Add New Borrower', createBorrowerForm());
        const form = modal.querySelector('#borrower-form');
        
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const borrowerData = {
            name: formData.get('name'),
            email: formData.get('email'),
            activeLoans: 0
          };
          
          try {
            await addBorrower(borrowerData);
            modal.remove();
            setupBorrowers(container);
          } catch (error) {
            console.error('Error adding borrower:', error);
            alert('Failed to add borrower. Please try again.');
          }
        });
      });

      // Edit Borrower
      document.querySelectorAll('.edit-borrower').forEach(button => {
        button.addEventListener('click', async (e) => {
          const borrowerId = parseInt(e.target.dataset.id);
          const borrower = borrowers.find(b => b.id === borrowerId);
          
          const modal = createModal('Edit Borrower', createBorrowerForm(borrower));
          const form = modal.querySelector('#borrower-form');
          
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const borrowerData = {
              name: formData.get('name'),
              email: formData.get('email')
            };
            
            try {
              await updateBorrower(borrowerId, borrowerData);
              modal.remove();
              setupBorrowers(container);
            } catch (error) {
              console.error('Error updating borrower:', error);
              alert('Failed to update borrower. Please try again.');
            }
          });
        });
      });

      // Delete Borrower
      document.querySelectorAll('.delete-borrower').forEach(button => {
        button.addEventListener('click', async (e) => {
          console.log('delete borrower');
          const borrowerId = parseInt(e.target.dataset.id);
          console.log(borrowerId);
          if (await showConfirmDialog('Are you sure you want to delete this borrower?')) {
            try {
              await deleteBorrower(borrowerId);
              setupBorrowers(container);
            } catch (error) {
              console.error('Error deleting borrower:', error);
              alert('Failed to delete borrower. Please try again.');
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
    console.error('Error setting up borrowers:', error);
    container.innerHTML = '<p class="text-destructive">Error loading borrowers data</p>';
  }
}