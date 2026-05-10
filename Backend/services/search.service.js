const { prisma } = require('../lib/prisma');
const cacheService = require('../utils/cache.service');

class SearchService {
  async globalSearch(params) {
    const { query, limit } = params;
    if (!query || !query.trim()) {
      return { cities: [], activities: [], trips: [], communityPosts: [], topResults: [] };
    }

    const cacheKey = `global_search_${query}_${limit}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [cities, activities, trips, posts] = await Promise.all([
      this.searchCities({ query, limit: 5 }),
      this.searchActivities({ query, limit: 5 }),
      this.searchTrips({ query, limit: 5 }),
      this.searchCommunity({ query, limit: 5 })
    ]);

    const results = {
      cities: cities.cities,
      activities: activities.activities,
      trips: trips.trips,
      communityPosts: posts.posts,
      topResults: [...cities.cities.slice(0, 2), ...activities.activities.slice(0, 2)]
    };

    await cacheService.set(cacheKey, results, 300);
    return results;
  }

  async searchCities(params) {
    const { query, country, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { country: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ],
      ...(country && { country: { contains: country, mode: 'insensitive' } })
    };

    const [cities, total] = await Promise.all([
      prisma.city.findMany({
        where,
        skip,
        take: limit,
        orderBy: { popularityScore: 'desc' }
      }),
      prisma.city.count({ where })
    ]);

    return {
      cities,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async searchActivities(params) {
    const { query, category, cityId, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = {
      title: { contains: query, mode: 'insensitive' },
      ...(category && { category }),
      ...(cityId && { cityId })
    };

    const [activities, total] = await Promise.all([
      prisma.globalActivity.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          ...(category && { category: { contains: category, mode: 'insensitive' } }),
          ...(cityId && { cityId })
        },
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
        include: { city: { select: { name: true } } }
      }),
      prisma.globalActivity.count({ 
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          ...(category && { category: { contains: category, mode: 'insensitive' } }),
          ...(cityId && { cityId })
        }
      })
    ]);

    return {
      activities,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async searchTrips(params) {
    const { query, tripType, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = {
      visibility: 'PUBLIC',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { destination: { contains: query, mode: 'insensitive' } }
      ],
      ...(tripType && { tripType })
    };

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        include: { owner: { select: { firstName: true, lastName: true, profileImage: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.trip.count({ where })
    ]);

    return {
      trips,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async searchCommunity(params) {
    const { query, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = {
      visibility: 'PUBLIC',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ]
    };

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        skip,
        take: limit,
        include: { 
          user: { select: { firstName: true, lastName: true, profileImage: true } },
          _count: { select: { likes: true, comments: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.communityPost.count({ where })
    ]);

    return {
      posts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }
}

module.exports = new SearchService();
