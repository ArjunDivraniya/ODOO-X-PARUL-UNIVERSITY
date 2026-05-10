const { prisma } = require('../lib/prisma');

class AnalyticsService {
  async getUserAnalytics(userId) {
    const [
      totalTrips,
      completedTrips,
      expenses,
      savedCities,
      activitiesCount
    ] = await Promise.all([
      prisma.trip.count({ where: { userId } }),
      prisma.trip.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.expense.findMany({
        where: { trip: { userId } },
        select: { amount: true, quantity: true }
      }),
      prisma.favoriteDestination.count({ where: { userId } }),
      prisma.activity.count({ where: { trip: { userId } } })
    ]);
    const totalSpending = expenses.reduce((sum, expense) => sum + (expense.amount * expense.quantity), 0);

    return {
      trips: { total: totalTrips, completed: completedTrips },
      spending: totalSpending,
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
        _count: { select: { itinerarySections: true } }
      }
    });

    if (!trip) throw new Error('Trip not found or unauthorized');

    const expenseBreakdown = await prisma.expense.groupBy({
      by: ['category'],
      where: { tripId },
      _sum: { amount: true }
    });

    return {
      budgetUsed: trip.expenses.reduce((sum, e) => sum + (e.amount * e.quantity), 0),
      estimatedBudget: trip.estimatedBudget || 0,
      activityCount: trip.activities.length,
      sectionCount: trip._count.itinerarySections,
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
    const trips = await prisma.trip.findMany({
      where: { userId, destination: { not: null } },
      select: { destination: true }
    });

    const counts = trips.reduce((acc, trip) => {
      acc[trip.destination] = (acc[trip.destination] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }
}

module.exports = new AnalyticsService();
