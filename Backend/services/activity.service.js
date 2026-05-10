const prisma = require('../lib/prisma');

class ActivityService {
  async createActivity(userId, data) {
    // Validate trip ownership
    const trip = await prisma.trip.findFirst({
      where: { id: data.tripId, userId }
    });
    if (!trip) throw new Error('Trip not found or unauthorized');

    // Validate section ownership if provided
    if (data.sectionId) {
      const section = await prisma.tripSection.findFirst({
        where: { id: data.sectionId, tripId: data.tripId }
      });
      if (!section) throw new Error('Itinerary section not found in this trip');
    }

    return await prisma.activity.create({
      data,
      include: { city: true, section: true }
    });
  }

  async getTripActivities(tripId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { tripId };
    if (query.category) where.category = query.category;

    const sortBy = query.sortBy || 'startTime';
    const sortOrder = query.sortOrder || 'asc';

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { city: true, section: true }
      }),
      prisma.activity.count({ where })
    ]);

    return {
      activities,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async getActivityById(activityId, userId = null) {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        trip: { select: { title: true, userId: true } },
        section: true,
        city: true,
        reviews: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!activity) throw new Error('Activity not found');

    let isSaved = false;
    if (userId) {
      const saved = await prisma.favoriteActivity.findUnique({
        where: { userId_activityId: { userId, activityId } }
      });
      isSaved = !!saved;
    }

    return { ...activity, isSaved };
  }

  async updateActivity(activityId, userId, data) {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { trip: true }
    });

    if (!activity || activity.trip.userId !== userId) {
      throw new Error('Activity not found or unauthorized');
    }

    return await prisma.activity.update({
      where: { id: activityId },
      data,
      include: { city: true, section: true }
    });
  }

  async deleteActivity(activityId, userId) {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { trip: true }
    });

    if (!activity || activity.trip.userId !== userId) {
      throw new Error('Activity not found or unauthorized');
    }

    return await prisma.activity.delete({ where: { id: activityId } });
  }

  async getRecommendedActivities(query) {
    const where = {};
    if (query.cityId) where.cityId = query.cityId;
    if (query.category) where.category = query.category;

    return await prisma.activity.findMany({
      where,
      orderBy: { rating: 'desc' },
      take: 10,
      include: { city: true }
    });
  }

  async getTrendingActivities() {
    return await prisma.activity.findMany({
      orderBy: { saveCount: 'desc' },
      take: 10,
      include: { city: true }
    });
  }

  async saveActivity(userId, activityId) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.favoriteActivity.findUnique({
        where: { userId_activityId: { userId, activityId } }
      });

      if (existing) return existing;

      const fav = await tx.favoriteActivity.create({
        data: { userId, activityId }
      });

      await tx.activity.update({
        where: { id: activityId },
        data: { saveCount: { increment: 1 } }
      });

      return fav;
    });
  }

  async unsaveActivity(userId, activityId) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.favoriteActivity.findUnique({
        where: { userId_activityId: { userId, activityId } }
      });

      if (!existing) return null;

      await tx.favoriteActivity.delete({
        where: { id: existing.id }
      });

      await tx.activity.update({
        where: { id: activityId },
        data: { saveCount: { decrement: 1 } }
      });

      return true;
    });
  }

  async validateOwnership(activityId, userId) {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { trip: true }
    });
    return activity && activity.trip.userId === userId;
  }
}

module.exports = new ActivityService();
