const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All expense routes are protected
router.use(authMiddleware);

// CRUD — specific paths BEFORE wildcard /:tripId
router.post('/', expenseController.createExpense);
router.get('/single/:expenseId', expenseController.getExpenseById);
router.get('/:tripId', expenseController.getTripExpenses);
router.patch('/:expenseId', expenseController.updateExpense);
router.delete('/:expenseId', expenseController.deleteExpense);

// Analytics
router.get('/:tripId/summary', expenseController.getSummary);
router.get('/:tripId/charts', expenseController.getCharts);
router.get('/:tripId/daily-breakdown', expenseController.getDailyBreakdown);
router.get('/:tripId/category-breakdown', expenseController.getCategoryBreakdown);

module.exports = router;
