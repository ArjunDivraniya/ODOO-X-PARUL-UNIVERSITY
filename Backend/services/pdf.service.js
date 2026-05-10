const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  async generateInvoicePDF(invoice, trip, user, expenses) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `invoice_${invoice.invoiceNumber}.pdf`;
      const filePath = path.join(__dirname, '../temp', filename);

      // Ensure temp directory exists
      if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'));
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('TRAVELOOP', { align: 'right' });
      doc.fontSize(10).text('Smart Travel Planning', { align: 'right' });
      doc.moveDown();

      doc.fontSize(25).text('INVOICE', { underline: true });
      doc.fontSize(10).text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Trip Info
      doc.fontSize(14).text('Trip Details', { underline: true });
      doc.fontSize(10).text(`Trip: ${trip.title}`);
      doc.text(`Destination: ${trip.destination}`);
      doc.text(`Duration: ${trip.startDate.toLocaleDateString()} - ${trip.endDate.toLocaleDateString()}`);
      doc.moveDown();

      // User Info
      doc.fontSize(14).text('Traveler Details', { underline: true });
      doc.fontSize(10).text(`Name: ${user.firstName} ${user.lastName}`);
      doc.text(`Email: ${user.email}`);
      doc.moveDown();

      // Expenses Table
      doc.fontSize(14).text('Expenses Breakdown', { underline: true });
      doc.moveDown(0.5);
      
      const tableTop = doc.y;
      doc.text('Title', 50, tableTop);
      doc.text('Category', 200, tableTop);
      doc.text('Date', 350, tableTop);
      doc.text('Amount', 450, tableTop);
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      
      let y = tableTop + 25;
      expenses.forEach(exp => {
        doc.text(exp.title, 50, y);
        doc.text(exp.category, 200, y);
        doc.text(new Date(exp.expenseDate).toLocaleDateString(), 350, y);
        doc.text(`${exp.amount.toFixed(2)}`, 450, y);
        y += 20;
      });

      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 10;

      // Totals
      doc.text('Subtotal:', 350, y);
      doc.text(`${invoice.subtotal.toFixed(2)}`, 450, y);
      y += 15;
      doc.text(`Tax (${invoice.tax}%):`, 350, y);
      const taxAmount = (invoice.subtotal * invoice.tax) / 100;
      doc.text(`${taxAmount.toFixed(2)}`, 450, y);
      y += 15;
      doc.text('Discount:', 350, y);
      doc.text(`-${invoice.discount.toFixed(2)}`, 450, y);
      y += 20;
      
      doc.fontSize(16).text('TOTAL:', 350, y, { bold: true });
      doc.text(`${invoice.total.toFixed(2)}`, 450, y);

      // Footer
      doc.fontSize(10).text('Thank you for choosing Traveloop!', 50, 700, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }
}

module.exports = new PDFService();
