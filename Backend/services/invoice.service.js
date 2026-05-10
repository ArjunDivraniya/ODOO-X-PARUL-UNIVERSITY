const { prisma } = require('../lib/prisma');
const pdfService = require('./pdf.service');
const path = require('path');

class InvoiceService {
  async generateInvoice(userId, data) {
    const trip = await prisma.trip.findFirst({
      where: { id: data.tripId, userId },
      include: { expenses: true, user: true }
    });

    if (!trip) throw new Error('Trip not found or unauthorized');

    const subtotal = trip.expenses.reduce((sum, exp) => sum + (exp.amount * exp.quantity), 0);
    const taxAmount = (subtotal * (data.tax || 0)) / 100;
    const total = subtotal + taxAmount - (data.discount || 0);

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          tripId: data.tripId,
          userId,
          invoiceNumber,
          subtotal,
          tax: data.tax || 0,
          discount: data.discount || 0,
          total: total > 0 ? total : 0,
          paymentMethod: data.paymentMethod,
          paymentStatus: 'PENDING',
          currency: trip.currency,
          expenses: { connect: trip.expenses.map(e => ({ id: e.id })) }
        }
      });

      // Generate PDF
      const pdfPath = await pdfService.generateInvoicePDF(invoice, trip, trip.user, trip.expenses);
      
      // In a real app, you'd upload this to Cloudinary/S3
      // For now, we'll store the local path or a placeholder
      const pdfUrl = `/api/invoices/download/${invoice.id}`;

      return await tx.invoice.update({
        where: { id: invoice.id },
        data: { pdfUrl }
      });
    });
  }

  async getTripInvoices(tripId, userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: { tripId, userId },
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' }
      }),
      prisma.invoice.count({ where: { tripId, userId } })
    ]);

    return {
      invoices,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async getInvoiceById(invoiceId, userId) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { 
        trip: true, 
        expenses: true,
        user: { select: { firstName: true, lastName: true, email: true } }
      }
    });

    if (!invoice || invoice.userId !== userId) {
      throw new Error('Invoice not found or unauthorized');
    }

    return invoice;
  }

  async updateStatus(invoiceId, userId, status) {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice || invoice.userId !== userId) throw new Error('Invoice not found or unauthorized');

    return await prisma.invoice.update({
      where: { id: invoiceId },
      data: { paymentStatus: status }
    });
  }

  async getPDFPath(invoiceId, userId) {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice || invoice.userId !== userId) throw new Error('Unauthorized');

    return path.join(__dirname, '../temp', `invoice_${invoice.invoiceNumber}.pdf`);
  }
}

module.exports = new InvoiceService();
