import fs from 'fs/promises';
import fetch from 'node-fetch';

const booksFilePath = '../data/books.json';

async function fetchBookCover(title, author) {
  const response = await fetch(`https://bookcover.longitood.com/bookcover?book_title=${encodeURIComponent(title)}&author_name=${encodeURIComponent(author)}`);
  const data = await response.json();
  return data.url;
}

async function updateBookCovers() {
  try {
    const booksData = await fs.readFile(booksFilePath, 'utf-8');
    const books = JSON.parse(booksData);

    const updatedBooks = await Promise.all(books.map(async book => {
      const coverUrl = await fetchBookCover(book.title, book.author);
      return { ...book, coverUrl };
    }));

    await fs.writeFile(booksFilePath, JSON.stringify(updatedBooks, null, 2), 'utf-8');
    console.log('Book covers updated successfully.');
  } catch (error) {
    console.error('Error updating book covers:', error);
  }
}

updateBookCovers();