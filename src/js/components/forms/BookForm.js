export function createBookForm(book = null, categories) {
  const genreOptions = Array.from(new Set(categories.map(c => c.name)))
    .map(genre => `<option value="${genre}" ${book?.genre === genre ? 'selected' : ''}>${genre}</option>`)
    .join('');

  return `
    <form id="book-form" class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-card-foreground" for="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value="${book?.title || ''}"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-card-foreground" for="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value="${book?.author || ''}"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-card-foreground" for="genre">Genre</label>
        <select
          id="genre"
          name="genre"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          <option value="">Select Genre</option>
          ${genreOptions}
        </select>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-card-foreground" for="publishedYear">Published Year</label>
        <input
          type="number"
          id="publishedYear"
          name="publishedYear"
          value="${book?.publishedYear || ''}"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-card-foreground" for="totalCopies">Total Copies</label>
        <input
          type="number"
          id="totalCopies"
          name="totalCopies"
          value="${book?.totalCopies || ''}"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-card-foreground" for="availableCopies">Available Copies</label>
        <input
          type="number"
          id="availableCopies"
          name="availableCopies"
          value="${book?.availableCopies || ''}"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div class="flex justify-end space-x-2">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          ${book ? 'Update' : 'Add'} Book
        </button>
      </div>
    </form>
  `;
}