const { prisma } = require('../lib/prisma');

class ReviewService {
  async createReview(userId, data) {
    // Prevent duplicate reviews for same trip/activity by same user
    const existing = await prisma.review.findFirst({
      where: {
        userId,
        tripId: data.tripId,
        activityId: data.activityId
      }
    });

    if (existing) throw new Error('You have already reviewed this item');

    return await prisma.review.create({
      data: { ...data, userId },
      include: { user: { select: { firstName: true, profileImage: true } } }
    });
  }

  async getReviews(tripId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { tripId };

    const [reviews, total, aggregate] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
        include: { user: { select: { firstName: true, lastName: true, profileImage: true } } }
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { id: true }
      })
    ]);

    return {
      reviews,
      averageRating: aggregate._avg.rating || 0,
      totalReviews: aggregate._count.id,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async updateReview(reviewId, userId, data) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== userId) throw new Error('Review not found or unauthorized');

    return await prisma.review.update({
      where: { id: reviewId },
      data,
      include: { user: { select: { firstName: true } } }
    });
  }

  async deleteReview(reviewId, userId) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== userId) throw new Error('Review not found or unauthorized');

    return await prisma.review.delete({ where: { id: reviewId } });
  }
}

module.exports = new ReviewService();
