const { prisma } = require('../lib/prisma');
const analyticsService = require('../utils/analytics.service');

class AdminService {
  async getDashboardOverview() {
    const [
      userCount,
      tripCount,
      activityCount,
      cityCount,
      aiUsage,
      postCount,
      revenue,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.activity.count(),
      prisma.city.count(),
      prisma.aIChat.count(),
      prisma.communityPost.count(),
      analyticsService.getRevenueStats(),
      prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
    ]);

    return {
      overview: {
        totalUsers: userCount,
        totalTrips: tripCount,
        totalActivities: activityCount,
        totalCities: cityCount,
        aiInteractions: aiUsage,
        totalCommunityPosts: postCount,
        revenue: revenue.totalRevenue
      },
      recentActivity: recentUsers
    };
  }

  async getUsers(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } }
      ];
    }
    if (query.role) where.role = query.role;
    if (query.blocked) where.isBlocked = query.blocked === 'true';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { trips: true, communityPosts: true } }
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async getTrips(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (query.search) where.title = { contains: query.search, mode: 'insensitive' };
    if (query.status) where.status = query.status;
    if (query.visibility) where.visibility = query.visibility;

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { firstName: true, email: true } } }
      }),
      prisma.trip.count({ where })
    ]);

    return {
      trips,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async getActivities(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (query.search) where.title = { contains: query.search, mode: 'insensitive' };
    if (query.category) where.category = query.category;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { trip: { select: { title: true } } }
      }),
      prisma.activity.count({ where })
    ]);

    return {
      activities,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async updateBlockStatus(userId, isBlocked) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isBlocked }
    });
  }

  async deleteUser(userId) {
    return await prisma.user.delete({ where: { id: userId } });
  }

  async getUserAnalytics() {
    const growth = await analyticsService.getGrowthData('user');
    const totalUsers = await prisma.user.count();
    const activeLast24h = await prisma.user.count({
      where: { lastLogin: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
    });

    return { growth, totalUsers, activeLast24h };
  }

  async getTripAnalytics() {
    const stats = await prisma.trip.groupBy({
      by: ['status'],
      _count: { id: true }
    });
    
    const popularDestinations = await prisma.trip.groupBy({
      by: ['destination'],
      _count: { id: true },
      orderBy: { _count: { destination: 'desc' } },
      take: 5
    });

    return { stats, popularDestinations };
  }

  async getCityAnalytics() {
    return await prisma.city.findMany({
      take: 10,
      orderBy: { popularityScore: 'desc' },
      select: { name: true, country: true, popularityScore: true }
    });
  }

  async getRevenueAnalytics() {
    return await analyticsService.getRevenueStats();
  }
}

module.exports = new AdminService();
