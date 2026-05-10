const invoiceService = require('../services/invoice.service');
const { generateInvoiceSchema, updateStatusSchema } = require('../validators/invoice.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const fs = require('fs');

exports.generateInvoice = async (req, res) => {
  try {
    const validatedData = generateInvoiceSchema.parse(req.body);
    const invoice = await invoiceService.generateInvoice(req.user.id, validatedData);
    return successResponse(res, 'Invoice generated successfully', { 
      invoice,
      downloadUrl: invoice.pdfUrl 
    });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to generate invoice', 400, error);
  }
};

exports.getTripInvoices = async (req, res) => {
  try {
    const data = await invoiceService.getTripInvoices(req.params.tripId, req.user.id, req.query);
    return successResponse(res, 'Trip invoices fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch invoices', 500, error);
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.invoiceId, req.user.id);
    return successResponse(res, 'Invoice details fetched successfully', { invoice });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch invoice', 404, error);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { paymentStatus } = updateStatusSchema.parse(req.body);
    const invoice = await invoiceService.updateStatus(req.params.invoiceId, req.user.id, paymentStatus);
    return successResponse(res, 'Invoice status updated successfully', { invoice });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update status', 400, error);
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    const filePath = await invoiceService.getPDFPath(req.params.invoiceId, req.user.id);
    
    if (!fs.existsSync(filePath)) {
      return errorResponse(res, 'Invoice file not found. Please regenerate.', 404);
    }

    res.download(filePath);
  } catch (error) {
    return errorResponse(res, 'Failed to download invoice', 500, error);
  }
};
