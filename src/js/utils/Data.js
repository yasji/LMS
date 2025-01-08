import { getBooks, getBorrowers, getLoans, getCategories } from './api.js';

export async function generateDashboardData() {
  const books = await getBooks();
  const borrowers = await getBorrowers();
  const loans = await getLoans();
  const categories = await getCategories();

  // Calculate active loans (assuming loans without a returnDate are active)
  const activeLoans = loans.filter(loan => loan.status !== 'Returned').length;


  const overdueLoans = loans.filter(loan => loan.status === 'Overdue').length;


  // Calculate books by category
  const categoryStats = categories.map(category => ({
    name: category.name,
    count: category.books.length
  }));

  // Calculate monthly loans
  const monthlyLoans = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const count = loans.filter(loan => {
      const loanDate = new Date(loan.borrowedDate);
      return loanDate.getMonth() === date.getMonth() &&
             loanDate.getFullYear() === date.getFullYear();
    }).length;
    return { month, count };
  }).reverse();

  return {
    totalBooks: books.length,
    activeLoans,
    overdueBooks: overdueLoans,
    totalMembers: borrowers.length,
    categories: categoryStats,
    monthlyLoans
  };
}