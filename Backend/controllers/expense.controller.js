const expenseService = require('../services/expense.service');
const { expenseSchema, updateExpenseSchema } = require('../validators/expense.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createExpense = async (req, res) => {
  try {
    const validatedData = expenseSchema.parse(req.body);
    const expense = await expenseService.createExpense(req.user.id, validatedData);
    return successResponse(res, 'Expense created successfully', { expense });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create expense', 400, error);
  }
};

exports.getTripExpenses = async (req, res) => {
  try {
    const data = await expenseService.getTripExpenses(req.params.tripId, req.query);
    return successResponse(res, 'Trip expenses fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch expenses', 500, error);
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.expenseId, req.user.id);
    return successResponse(res, 'Expense details fetched successfully', { expense });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch expense details', 404, error);
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const validatedData = updateExpenseSchema.parse(req.body);
    const expense = await expenseService.updateExpense(req.params.expenseId, req.user.id, validatedData);
    return successResponse(res, 'Expense updated successfully', { expense });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update expense', 400, error);
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await expenseService.deleteExpense(req.params.expenseId, req.user.id);
    return successResponse(res, 'Expense deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete expense', 400, error);
  }
};

exports.getSummary = async (req, res) => {
  try {
    const summary = await expenseService.getTripSummary(req.params.tripId);
    return successResponse(res, 'Expense summary fetched successfully', { summary });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch summary', 500, error);
  }
};

exports.getCharts = async (req, res) => {
  try {
    const data = await expenseService.getChartData(req.params.tripId);
    return successResponse(res, 'Chart data fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch chart data', 500, error);
  }
};

exports.getDailyBreakdown = async (req, res) => {
  try {
    const dailyBreakdown = await expenseService.getDailyBreakdown(req.params.tripId, req.query);
    return successResponse(res, 'Daily breakdown fetched successfully', { dailyBreakdown });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch daily breakdown', 500, error);
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const categories = await expenseService.getCategoryBreakdown(req.params.tripId);
    return successResponse(res, 'Category breakdown fetched successfully', { categories });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch category breakdown', 500, error);
  }
};
