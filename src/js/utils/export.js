import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { getBooks, getAuthors, getBorrowers, getLoans, getCategories } from './api.js';

export async function exportToPDF(type) {
  const doc = new jsPDF();
  let data;
  let title;

  switch (type) {
    case 'books':
      data = await getBooks();
      title = 'Books Report';
      break;
    case 'authors':
      data = await getAuthors();
      title = 'Authors Report';
      break;
    case 'borrowers':
      data = await getBorrowers();
      title = 'Borrowers Report';
      break;
    case 'loans':
      data = await getLoans();
      title = 'Loans Report';
      break;
    case 'categories':
      data = await getCategories();
      title = 'Categories Report';
      break;
    default:
      throw new Error('Invalid export type');
  }

  doc.text(title, 20, 10);
  
  // Add table headers and data
  const headers = Object.keys(data[0]);
  let yPos = 20;
  
  headers.forEach((header, i) => {
    doc.text(header, 20 + (i * 40), yPos);
  });
  
  yPos += 10;
  
  data.forEach(item => {
    headers.forEach((header, i) => {
      doc.text(String(item[header]), 20 + (i * 40), yPos);
    });
    yPos += 10;
    
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
  });

  doc.save(`${type}_report.pdf`);
}

export async function exportToExcel(type) {
  let data;
  let filename;

  switch (type) {
    case 'books':
      data = await getBooks();
      filename = 'books_report.xlsx';
      break;
    case 'authors':
      data = await getAuthors();
      filename = 'authors_report.xlsx';
      break;
    case 'borrowers':
      data = await getBorrowers();
      filename = 'borrowers_report.xlsx';
      break;
    case 'loans':
      data = await getLoans();
      filename = 'loans_report.xlsx';
      break;
    case 'categories':
      data = await getCategories();
      filename = 'categories_report.xlsx';
      break;
    default:
      throw new Error('Invalid export type');
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, filename);
}