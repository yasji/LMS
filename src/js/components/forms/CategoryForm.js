export function createCategoryForm(category = null) {
    return `
      <form id="category-form" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-card-foreground" for="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value="${category?.name || ''}"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            ${category ? 'Update' : 'Add'} category
          </button>
        </div>
      </form>
    `;
  }