export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function isOverdue(dueDate) {
  return new Date(dueDate) < new Date();
}

export function calculateDueDate(borrowDate, daysToReturn = 30) {
  const date = new Date(borrowDate);
  date.setDate(date.getDate() + daysToReturn);
  return date.toISOString().split('T')[0];
}