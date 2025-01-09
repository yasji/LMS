import { getLoans, updateLoan, deleteLoan, checkLoansDueDate } from '../../utils/api.js';
import { showConfirmDialog } from '../../utils/dialog.js';
import { createTable } from '../../components/Table.js';

export async function setupLoans(container) {
  try {
    const loans = await getLoans();

    // Check due date for each loan
    for (const loan of loans) {
      await checkLoansDueDate(loan.Id);
    }

    const itemsPerPage = 10;
    let currentPage = 1;
    const totalPages = Math.ceil(loans.length / itemsPerPage);

    async function renderTable() {
      const start = (currentPage - 1) * itemsPerPage;
      const paginatedLoans = loans.slice(start, start + itemsPerPage);

      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold tracking-tight">Loans Management</h2>
          </div>
          
          ${createTable({
            headers: ['Book', 'Borrower', 'Borrowed Date', 'Due Date', 'Status'],
            rows: paginatedLoans.map(loan => `
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle">${loan.bookTitle}</td>
                <td class="p-4 align-middle">${loan.borrowerName}</td>
                <td class="p-4 align-middle">${loan.borrowedDate}</td>
                <td class="p-4 align-middle">${loan.dueDate}</td>
                <td class="p-4 align-middle">
                  <span class="px-2 py-1 text-sm rounded ${
                    loan.status === 'Returned' ? 'bg-green-100 text-green-800' :
                    loan.status === 'On Loan' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }">
                    ${loan.status}
                  </span>
                </td>
                <td class="p-4 align-middle">
                  <div class="flex items-center space-x-2">
                    <button class="delete-loan text-destructive hover:text-destructive/80" data-id="${loan.Id}">Delete</button>
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
      // Return Book
      document.querySelectorAll('.return-book').forEach(button => {
        button.addEventListener('click', async (e) => {
          const loanId = e.target.dataset.id;
          try {
            await updateLoan(loanId, { status: 'Returned' });
            setupLoans(container);
          } catch (error) {
            console.error('Error returning loan:', error);
            alert('Failed to return loan. Please try again.');
          }
        });
      });

      // Delete Loan
      document.querySelectorAll('.delete-loan').forEach(button => {
        button.addEventListener('click', async (e) => {
          const loanId = parseInt(e.target.dataset.id);
          if (await showConfirmDialog('Are you sure you want to delete this loan record?')) {
            try {
              await deleteLoan(loanId);
              setupLoans(container);
            } catch (error) {
              console.error('Error deleting loan:', error);
              alert('Failed to delete loan. Please try again.');
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

    // Render the table after checking loan due dates
    await renderTable();
  } catch (error) {
    console.error('Error setting up loans:', error);
    container.innerHTML = '<p class="text-destructive">Error loading loans data</p>';
  }
}