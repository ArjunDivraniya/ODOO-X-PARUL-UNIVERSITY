const { prisma } = require('../lib/prisma');

class AnalyticsService {
  async getUserAnalytics(userId) {
    const [
      totalTrips,
      completedTrips,
      totalExpenses,
      savedCities,
      activitiesCount
    ] = await Promise.all([
      prisma.trip.count({ where: { userId } }),
      prisma.trip.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.expense.aggregate({
        where: { trip: { userId } },
        _sum: { amount: true }
      }),
      prisma.favoriteDestination.count({ where: { userId } }),
      prisma.activity.count({ where: { trip: { userId } } })
    ]);

    return {
      trips: { total: totalTrips, completed: completedTrips },
      spending: totalExpenses._sum.amount || 0,
      favorites: savedCities,
      activities: activitiesCount,
      travelTrend: await this.getTravelTrends(userId)
    };
  }

  async getTripAnalytics(tripId, userId) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: {
        expenses: true,
        activities: true,
        _count: { select: { sections: true } }
      }
    });

    if (!trip) throw new Error('Trip not found or unauthorized');

    const expenseBreakdown = await prisma.expense.groupBy({
      by: ['category'],
      where: { tripId },
      _sum: { amount: true }
    });

    return {
      budgetUsed: trip.expenses.reduce((sum, e) => sum + e.amount, 0),
      estimatedBudget: trip.budget,
      activityCount: trip.activities.length,
      sectionCount: trip._count.sections,
      expenseBreakdown
    };
  }

  async getCommunityAnalytics() {
    const [posts, likes, comments] = await Promise.all([
      prisma.communityPost.count(),
      prisma.postLike.count(),
      prisma.postComment.count()
    ]);

    const trendingPosts = await prisma.communityPost.findMany({
      take: 5,
      include: { _count: { select: { likes: true, comments: true } } },
      orderBy: { likes: { _count: 'desc' } }
    });

    return {
      stats: { posts, likes, comments },
      trendingPosts
    };
  }

  async getTravelTrends(userId) {
    return await prisma.trip.groupBy({
      by: ['destination'],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 3
    });
  }
}

module.exports = new AnalyticsService();
