import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data?.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(field => row[field] ?? ''));

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = (data, filename = 'export.pdf') => {
  if (!data?.length) return;

  const doc = new jsPDF();
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(field => row[field] ?? ''));

  autoTable(doc, {
    head: [headers],
    body: rows,
    styles: { fontSize: 8 },
    margin: { top: 20 },
  });

  doc.save(filename);
};
