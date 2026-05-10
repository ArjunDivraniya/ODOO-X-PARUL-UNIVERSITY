const prisma = require('../lib/prisma');

class AnalyticsService {
  async getGrowthData(model, dateField = 'createdAt') {
    const now = new Date();
    const last30Days = new Date(now.setDate(now.getDate() - 30));

    return await prisma[model].groupBy({
      by: [dateField],
      _count: { id: true },
      where: {
        [dateField]: { gte: last30Days }
      },
      orderBy: {
        [dateField]: 'asc'
      }
    });
  }

  async getRevenueStats() {
    const aggregate = await prisma.invoice.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: { paymentStatus: 'PAID' }
    });

    return {
      totalRevenue: aggregate._sum.total || 0,
      paidInvoices: aggregate._count.id
    };
  }
}

module.exports = new AnalyticsService();
