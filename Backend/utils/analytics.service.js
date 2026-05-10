class AnalyticsService {
  formatPieChartData(categoryTotals) {
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  }

  formatLineChartData(dailyExpenses) {
    // Expects dailyExpenses as { '2023-10-01': 500, '2023-10-02': 300 }
    return Object.entries(dailyExpenses)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, amount]) => ({
        date,
        amount
      }));
  }

  calculateBudgetUsage(total, budget) {
    if (!budget || budget === 0) return 0;
    return Math.round((total / budget) * 100);
  }

  groupByCategory(expenses) {
    return expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + (exp.amount * exp.quantity);
      return acc;
    }, {});
  }

  groupByDate(expenses) {
    return expenses.reduce((acc, exp) => {
      const date = exp.expenseDate ? new Date(exp.expenseDate).toISOString().split('T')[0] : 'Unscheduled';
      acc[date] = (acc[date] || 0) + (exp.amount * exp.quantity);
      return acc;
    }, {});
  }
}

module.exports = new AnalyticsService();
