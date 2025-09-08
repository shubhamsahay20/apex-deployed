import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ---------------- Existing functions (unchanged) ----------------
export const exportProductionPDF = (customers) => {
  const doc = new jsPDF();
  const headers = [['Name', 'Phone', 'Sales Person', 'Email', 'Location']];
  const rows = customers.map(row => [
    row.name || '',
    row.phone || '',
    row.salesPersonId?.name || '',
    row.email || '',
    row.location?.map(item => item.city).join(', ') || ''
  ]);

  doc.setFontSize(14);
  doc.text('Customer Report', 14, 10);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  });

  doc.save('customer_report.pdf');
};

export const printProductionPDF = (customers) => {
  const doc = new jsPDF();
  const headers = [['Name', 'Phone', 'Sales Person', 'Email', 'Location']];
  const rows = customers.map(row => [
    row.name || '',
    row.phone || '',
    row.salesPersonId?.name || '',
    row.email || '',
    row.location?.map(item => item.city).join(', ') || ''
  ]);

  doc.setFontSize(14);
  doc.text('Customer Report', 14, 10);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  });

  window.open(doc.output('bloburl'), '_blank').print();
};

export const printQRCodePDF = async (qrData, selectedProduction, productData) => {
  try {
    const doc = new jsPDF();

    const qrCodes = Array.isArray(qrData)
      ? qrData.filter(prod => prod._id === selectedProduction).flatMap(prod => prod.qrCodes || [])
      : qrData?.qrCodes || [];

    if (qrCodes.length === 0) {
      throw new Error('No QR codes available');
    }

    doc.setFontSize(16);
    doc.text('QR Code Labels', 14, 20);

    const selectedProd = productData.find(p => p._id === selectedProduction);
    if (selectedProd) {
      doc.setFontSize(12);
      doc.text(`Production: ${selectedProd.productionNo}`, 14, 35);
      doc.text(`Factory: ${selectedProd.factory?.name || 'N/A'}`, 14, 45);
    }

    const headers = [['Article', 'Size', 'Color', 'Type', 'Date']];
    const rows = qrCodes.map(qr => [
      qr.article || 'N/A',
      qr.size || 'N/A',
      qr.color || 'N/A',
      qr.type || 'N/A',
      new Date().toLocaleDateString()
    ]);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 55
    });

    return doc;
  } catch (error) {
    console.error('PDF generation error:', error);
    return null;
  }
};

// ---------------- ✅ NEW Sales Table Functions ----------------
export const exportSalesPDF = (tableData) => {
  const doc = new jsPDF();
  const headers = [['Date', 'Article', 'Customer', 'Size', 'Color', 'Sell', 'Quantity', 'Status']];
  const rows = tableData.map(row => [
    row.date || '',
    row.article || '',
    row.customer || '',
    row.size || '',
    row.color || '',
    row.sell || '',
    row.quantity || '',
    row.status || ''
  ]);

  doc.setFontSize(14);
  doc.text('Sales Report', 14, 10);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  });

  doc.save('sales_report.pdf');
};

export const printSalesPDF = (tableData) => {
  const doc = new jsPDF();
  const headers = [['Date', 'Article', 'Customer', 'Size', 'Color', 'Sell', 'Quantity', 'Status']];
  const rows = tableData.map(row => [
    row.date || '',
    row.article || '',
    row.customer || '',
    row.size || '',
    row.color || '',
    row.sell || '',
    row.quantity || '',
    row.status || ''
  ]);

  doc.setFontSize(14);
  doc.text('Sales Report', 14, 10);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  });

  window.open(doc.output('bloburl'), '_blank').print();
};
