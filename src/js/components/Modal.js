export function createModal(title, content) {
  const modalContainer = document.createElement('div');
  modalContainer.className = 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center';
  
  modalContainer.innerHTML = `
    <div class="relative bg-card rounded-lg shadow-lg border w-full max-w-lg mx-4">
      <div class="flex flex-col space-y-1.5 p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold leading-none tracking-tight">${title}</h3>
          <button class="close-modal text-muted-foreground hover:text-foreground">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="p-6 pt-0">
        ${content}
      </div>
    </div>
  `;

  document.body.appendChild(modalContainer);

  // Close modal when clicking the close button or outside the modal
  modalContainer.querySelector('.close-modal').addEventListener('click', () => {
    modalContainer.remove();
  });

  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      modalContainer.remove();
    }
  });

  return modalContainer;
}