const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All invoice routes are protected
router.use(authMiddleware);

router.post('/generate', invoiceController.generateInvoice);
router.get('/:tripId', invoiceController.getTripInvoices);
router.get('/single/:invoiceId', invoiceController.getInvoiceById);
router.patch('/:invoiceId/status', invoiceController.updateStatus);
router.get('/download/:invoiceId', invoiceController.downloadPDF);

module.exports = router;
