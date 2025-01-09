import { readJsonFile, writeJsonFile } from './storage.js';

// Books
export async function getBooks() {
  return readJsonFile('books.json');
}

export async function getBookDetails(id) {
  const books = await getBooks();
  const loans = await getLoans();
  const book = books.find(book => book.id === id);
  const loan = loans.find(l => l.bookId === id);
  if (book) {
    return {
      ...book,
      dueDate: loan ? loan.dueDate : null
    };
  }
  throw new Error('Book not found');
}

export async function addBook(book) {
  const books = await getBooks();
  const authors = await getAuthors();
  const categories = await getCategories();
  const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
  const newBook = { id: newId , ...book };
  const author = book.author;
  const category = book.genre;
  const authorIndex = authors.findIndex(a => a.name === author);
  const categoriesIndex = categories.findIndex(c => c.name === category);

  if (authorIndex !== -1) {
    authors[authorIndex].books.push(newId);
    await writeJsonFile('authors.json', authors);
  }
  else {
    const newAuthor = { id: authors.length + 1, name: author, books: [newId] };
    authors.push(newAuthor);
    await writeJsonFile('authors.json', authors);
  }

  categories[categoriesIndex].books.push(newId);
  await writeJsonFile('categories.json', categories);




  books.push(newBook);
  await writeJsonFile('books.json', books);
  return newBook;
}

export async function updateBook(id, updates) {
  const books = await getBooks();
  const index = books.findIndex(book => book.id === id);
  if (index !== -1) {
    books[index] = { ...books[index], ...updates };
    await writeJsonFile('books.json', books);
    return books[index];
  }
  throw new Error('Book not found');
}


async function removeBookFromCtaegories(category,bookId){
  // remove the book from the author's books array
  const categories = await getCategories();
  const categoryIndex = categories.findIndex(c => c.name === category);
  if (categoryIndex !== -1) {
    const bookIndex = categories[categoryIndex].books.findIndex(b => b === bookId);
    if (bookIndex !== -1) {
      categories[categoryIndex].books.splice(bookIndex, 1);
      await writeJsonFile('categories.json', categories);
    }
  }
}

async function removeBookFromAuthors(author,bookId){
  // remove the book from the author's books array
  const authors = await getAuthors();
  const authorIndex = authors.findIndex(a => a.name === author);
  if (authorIndex !== -1) {
    const bookIndex = authors[authorIndex].books.findIndex(b => b === bookId);
    if (bookIndex !== -1) {
      authors[authorIndex].books.splice(bookIndex, 1);
      await writeJsonFile('authors.json', authors);
    }
  }
}

export async function deleteBook(id, author, category) {
  const books = await getBooks();
  const index = books.findIndex(book => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    await writeJsonFile('books.json', books);
  }
  await removeBookFromAuthors(author, id);
  await removeBookFromCtaegories(category, id);
}

// Authors
export async function getAuthors() {
  return readJsonFile('authors.json');
}

export async function getAuthor_books() {
  authors = await getAuthors();

}

export async function addAuthor(author) {
  const authors = await getAuthors();
  const newId = authors.length > 0 ? Math.max(...authors.map(a => a.id)) + 1 : 1;
  const newAuthor = { ...author, id: newId, books: [] };
  authors.push(newAuthor);
  await writeJsonFile('authors.json', authors);
  return newAuthor;
}

export async function updateAuthor(id, updates) {
  const authors = await getAuthors();
  const index = authors.findIndex(author => author.id === Number(id));
  if (index !== -1) {
    authors[index] = { ...authors[index], ...updates };
    await writeJsonFile('authors.json', authors);
    return authors[index];
  }
  throw new Error('Author not found');
}

export async function deleteAuthor(id) {
  const authors = await getAuthors();
  const index = authors.findIndex(author => author.id === Number(id));
  if (index !== -1) {
    authors.splice(index, 1);
    await writeJsonFile('authors.json', authors);
  }
}

// Borrowers
export async function getBorrowers() {
  return readJsonFile('borrowers.json');
}

export async function addBorrower(borrower) {
  const borrowers = await getBorrowers();
  const newId = borrowers.length > 0 ? Math.max(...borrowers.map(b => b.id)) + 1 : 1;
  const newBorrower = { ...borrower, id: newId, borrowedBooks: [] };
  borrowers.push(newBorrower);
  await writeJsonFile('borrowers.json', borrowers);
  return newBorrower;
}

export async function updateBorrower(id, updates) {
  const borrowers = await getBorrowers();
  const index = borrowers.findIndex(borrower => borrower.id === Number(id));
  if (index !== -1) {
    borrowers[index] = { ...borrowers[index], ...updates };
    await writeJsonFile('borrowers.json', borrowers);
    return borrowers[index];
  }
  throw new Error('Borrower not found');
}

export async function BorrowBook(borrowerId, bookId) {
  const borrowers = await getBorrowers();
  const books = await getBooks();
  const borrowerIndex = borrowers.findIndex(borrower => borrower.id === borrowerId);
  const bookIndex = books.findIndex(book => book.id === bookId);

  if (borrowerIndex !== -1 && bookIndex !== -1) {
    // Update borrower's borrowed books
    borrowers[borrowerIndex].borrowedBooks.push({ bookId, isOverdue: false });
    await writeJsonFile('borrowers.json', borrowers);

    // Create a new loan using addLoan function
    const newLoan = await addLoan({
      borrowerId: borrowerId,
      bookId: bookId,
      bookTitle: books[bookIndex].title,
      borrowerName: borrowers[borrowerIndex].name,
      status: "On Loan"
    });

    // Subtract 1 from available copies of the book
    if (books[bookIndex].availableCopies > 0) {
      books[bookIndex].availableCopies -= 1;
      await writeJsonFile('books.json', books);
    } else {
      throw new Error('No available copies of the book');
    }

    return newLoan;
  } else {
    throw new Error('Borrower or Book not found');
  }
}

export async function ReturnBook(borrowerId, bookId) {
  const borrowers = await getBorrowers();
  const books = await getBooks();
  const loans = await getLoans();

  const borrowerIndex = borrowers.findIndex(borrower => borrower.id === Number(borrowerId));
  const bookIndex = books.findIndex(book => book.id === Number(bookId));
  const loanIndex = loans.findIndex(loan => loan.bookId === Number(bookId) && loan.borrowerId === Number(borrowerId));

  if (borrowerIndex !== -1 && bookIndex !== -1 && loanIndex !== -1) {
    // Update borrower's borrowed books
    borrowers[borrowerIndex].borrowedBooks = borrowers[borrowerIndex].borrowedBooks.filter(b => b.bookId !== Number(bookId));
    await writeJsonFile('borrowers.json', borrowers);

    // Update loan status to "Returned"
    loans[loanIndex].status = "Returned";
    await writeJsonFile('loans.json', loans);

    // Add 1 to available copies of the book
    books[bookIndex].availableCopies += 1;
    await writeJsonFile('books.json', books);
  } else {
    throw new Error('Borrower, Book, or Loan not found');
  }
}

export async function deleteBorrower(id) {
  const borrowers = await getBorrowers();
  const index = borrowers.findIndex(borrower => borrower.id === Number(id));
  if (index !== -1) {
    borrowers.splice(index, 1);
    await writeJsonFile('borrowers.json', borrowers);
  }
}


// check loans duddate

export async function checkLoansDueDate(id) {
  //first check if teh status is on loan
  const loans = await getLoans();
  const borrowers = await getBorrowers();
  const index = loans.findIndex(loan => loan.Id === Number(id));
  const borrowerId = loans[index].borrowerId;
  const bookId = loans[index].bookId;
  if (index !== -1) {
    if(loans[index].status === "On Loan"){
      const today = new Date();
      const dueDate = new Date(loans[index].dueDate);
      if(today > dueDate){
        // edit the loan status to overdue
        loans[index].status = "Overdue";
        await writeJsonFile('loans.json', loans);
        // edit the borrower borrowedBooks status to overdue
        const borrowerIndex = borrowers.findIndex(borrower => borrower.id === borrowerId);
        const bookIndex = borrowers[borrowerIndex].borrowedBooks.findIndex(book => book.bookId === bookId);
        borrowers[borrowerIndex].borrowedBooks[bookIndex].isOverdue = true;
        await writeJsonFile('borrowers.json', borrowers);

      }

    }
  }
  else{
    throw new Error('Loan not found');
  }
}


// Loans
export async function getLoans() {
  const loans = await readJsonFile('loans.json');
  const borrowers = await getBorrowers();
  const books = await getBooks();

  return loans.map(loan => {
    const borrower = borrowers.find(b => b.id === loan.borrowerId);
    const book = books.find(b => b.id === loan.bookId);
    return {
      ...loan,
      borrowedDate: loan.borrowedDate,
      dueDate: loan.dueDate
    };
  });
}


export async function addLoan(loan) {
  const loans = await getLoans();
  const newId = loans.length > 0 ? Math.max(...loans.map(l => l.Id)) + 1 : 1;
  const newLoan = { 
    Id: newId,
    borrowedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ...loan
  };
  loans.push(newLoan);
  await writeJsonFile('loans.json', loans);
  return newLoan;
}


export async function updateLoan(id, updates) {
  const loans = await getLoans();
  const index = loans.findIndex(loan => loan.id === Number(id));
  if (index !== -1) {
    loans[index] = { ...loans[index], ...updates };
    await writeJsonFile('loans.json', loans);
    return loans[index];
  }
  throw new Error('Loan not found');
}

export async function deleteLoan(id) {
  const loans = await getLoans();
  const index = loans.findIndex(loan => loan.Id === Number(id));
  console.log(index);
  if (index !== -1) {
    console.log('deleteLoan2');
    loans.splice(index, 1);
    await writeJsonFile('loans.json', loans);
  }
}

// Categories
export async function getCategories() {
  return readJsonFile('categories.json');
}

export async function addCategory(category) {
  const categories = await getCategories();
  const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
  const newCategory = {id: newId, ...category, books: [] };
  categories.push(newCategory);
  await writeJsonFile('categories.json', categories);
  return newCategory;
}

export async function updateCategory(id, updates) {
  const categories = await getCategories();
  const index = categories.findIndex(category => category.id === Number(id));
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    await writeJsonFile('categories.json', categories);
    return categories[index];
  }
  throw new Error('Category not found');
}

export async function deleteCategory(id) {
  const categories = await getCategories();
  const index = categories.findIndex(category => category.id === Number(id));
  if (index !== -1) {
    categories.splice(index, 1);
    await writeJsonFile('categories.json', categories);
  }
}


