const { prisma } = require('../lib/prisma');

class FavoriteService {
  async addFavorite(userId, cityId) {
    // Check if city exists
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) throw new Error('City not found');

    // Prevent duplicates
    const existing = await prisma.favoritePlace.findFirst({
      where: { userId, cityId }
    });
    if (existing) return existing;

    return await prisma.favoritePlace.create({
      data: { userId, cityId },
      include: { city: true }
    });
  }

  async getFavorites(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.favoritePlace.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
        include: { 
          city: {
            select: {
              id: true,
              name: true,
              country: true,
              heroImage: true,
              averageBudget: true,
              popularityScore: true,
              description: true
            }
          }
        }
      }),
      prisma.favoritePlace.count({ where: { userId } })
    ]);

    return {
      favorites,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  async removeFavorite(favoriteId, userId) {
    const favorite = await prisma.favoritePlace.findUnique({ where: { id: favoriteId } });
    if (!favorite || favorite.userId !== userId) {
      throw new Error('Favorite not found or unauthorized');
    }

    return await prisma.favoritePlace.delete({ where: { id: favoriteId } });
  }

  async isFavorited(userId, cityId) {
    const favorite = await prisma.favoritePlace.findFirst({
      where: { userId, cityId }
    });
    return !!favorite;
  }
}

module.exports = new FavoriteService();
