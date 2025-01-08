
// show desctructive dialog
export function showConfirmDialog(message) {
  return new Promise((resolve) => {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center';
    
    confirmModal.innerHTML = `
      <div class="bg-card rounded-lg shadow-lg border w-full max-w-sm mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">${message}</h3>
          <div class="flex justify-end space-x-2">
            <button class="cancel-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Cancel
            </button>
            <button class="confirm-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(confirmModal);

    confirmModal.querySelector('.confirm-btn').addEventListener('click', () => {
      confirmModal.remove();
      resolve(true);
    });

    confirmModal.querySelector('.cancel-btn').addEventListener('click', () => {
      confirmModal.remove();
      resolve(false);
    });

    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) {
        confirmModal.remove();
        resolve(false);
      }
    });
  });
}





// show green dialog

export function showConfirmDialog2(message) {

  return new Promise((resolve) => {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center';
    
    confirmModal.innerHTML = `
      <div class="bg-card rounded-lg shadow-lg border w-full max-w-sm mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">${message}</h3>
          <div class="flex justify-end space-x-2">
            <button class="cancel-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Cancel
            </button>
            <button class="confirm-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-500 text-white hover:bg-green-600 h-10 px-4 py-2">
              Confirm
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(confirmModal);

    confirmModal.querySelector('.confirm-btn').addEventListener('click', () => {
      confirmModal.remove();
      resolve(true);
    });

    confirmModal.querySelector('.cancel-btn').addEventListener('click', () => {
      confirmModal.remove();
      resolve(false);
    });

    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) {
        confirmModal.remove();
        resolve(false);
      }
    });
  });
}