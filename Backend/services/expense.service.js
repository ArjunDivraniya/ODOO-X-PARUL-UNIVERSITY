const { prisma } = require('../lib/prisma');
const analyticsService = require('../utils/analytics.service');

class ExpenseService {
  async createExpense(userId, data) {
    const trip = await prisma.trip.findFirst({ where: { id: data.tripId, userId } });
    if (!trip) throw new Error('Trip not found or unauthorized');

    return await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data,
        include: { section: true }
      });

      await tx.trip.update({
        where: { id: data.tripId },
        data: { totalExpense: { increment: data.amount * (data.quantity || 1) } }
      });

      return expense;
    });
  }

  async getTripExpenses(tripId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { tripId };
    if (query.category) where.category = query.category;
    if (query.startDate || query.endDate) {
      where.expenseDate = {};
      if (query.startDate) where.expenseDate.gte = new Date(query.startDate);
      if (query.endDate) where.expenseDate.lte = new Date(query.endDate);
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'expenseDate']: query.sortOrder || 'desc' },
        include: { section: true }
      }),
      prisma.expense.count({ where })
    ]);

    return {
      expenses,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async getExpenseById(expenseId, userId) {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: { trip: true, section: true }
    });

    if (!expense || expense.trip.userId !== userId) {
      throw new Error('Expense not found or unauthorized');
    }

    return expense;
  }

  async updateExpense(expenseId, userId, data) {
    const oldExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: { trip: true }
    });

    if (!oldExpense || oldExpense.trip.userId !== userId) {
      throw new Error('Expense not found or unauthorized');
    }

    return await prisma.$transaction(async (tx) => {
      const updatedExpense = await tx.expense.update({
        where: { id: expenseId },
        data
      });

      if (data.amount || data.quantity) {
        const oldTotal = oldExpense.amount * oldExpense.quantity;
        const newTotal = (data.amount || oldExpense.amount) * (data.quantity || oldExpense.quantity);
        const diff = newTotal - oldTotal;

        await tx.trip.update({
          where: { id: oldExpense.tripId },
          data: { totalExpense: { increment: diff } }
        });
      }

      return updatedExpense;
    });
  }

  async deleteExpense(expenseId, userId) {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: { trip: true }
    });

    if (!expense || expense.trip.userId !== userId) {
      throw new Error('Expense not found or unauthorized');
    }

    return await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id: expense.tripId },
        data: { totalExpense: { decrement: expense.amount * expense.quantity } }
      });

      return await tx.expense.delete({ where: { id: expenseId } });
    });
  }

  async getTripSummary(tripId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { expenses: true }
    });

    if (!trip) throw new Error('Trip not found');

    const totalExpense = trip.totalExpense || 0;
    const estimatedBudget = trip.estimatedBudget || 0;
    const categoryTotals = analyticsService.groupByCategory(trip.expenses);

    return {
      estimatedBudget,
      totalExpense,
      remainingBudget: estimatedBudget - totalExpense,
      budgetUsagePercentage: analyticsService.calculateBudgetUsage(totalExpense, estimatedBudget),
      categoryTotals
    };
  }

  async getChartData(tripId) {
    const expenses = await prisma.expense.findMany({ where: { tripId } });
    
    const categoryTotals = analyticsService.groupByCategory(expenses);
    const dateTotals = analyticsService.groupByDate(expenses);

    return {
      pieChart: analyticsService.formatPieChartData(categoryTotals),
      lineChart: analyticsService.formatLineChartData(dateTotals),
      barChart: analyticsService.formatPieChartData(categoryTotals) // Reuse category data for bar
    };
  }

  async getDailyBreakdown(tripId, query) {
    const where = { tripId };
    if (query.startDate || query.endDate) {
      where.expenseDate = {};
      if (query.startDate) where.expenseDate.gte = new Date(query.startDate);
      if (query.endDate) where.expenseDate.lte = new Date(query.endDate);
    }

    const expenses = await prisma.expense.findMany({ 
      where,
      orderBy: { expenseDate: 'asc' }
    });

    const grouped = expenses.reduce((acc, exp) => {
      const date = exp.expenseDate ? new Date(exp.expenseDate).toISOString().split('T')[0] : 'Unscheduled';
      if (!acc[date]) acc[date] = { date, total: 0, expenses: [] };
      acc[date].total += exp.amount * exp.quantity;
      acc[date].expenses.push(exp);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  async getCategoryBreakdown(tripId) {
    const expenses = await prisma.expense.findMany({ where: { tripId } });
    const categoryTotals = analyticsService.groupByCategory(expenses);
    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }));
  }
}

module.exports = new ExpenseService();
