const { prisma } = require('../lib/prisma');
const weatherService = require('../utils/weather.service');
const foursquareService = require('../utils/foursquare.service');
const aiService = require('../utils/ai.service');

class CityService {
  async getCities(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { country: { contains: query.search, mode: 'insensitive' } }
      ];
    }
    if (query.country) where.country = query.country;
    if (query.budget) where.averageBudget = { lte: parseFloat(query.budget) };

    const sortBy = query.sortBy || 'popularityScore';
    const sortOrder = query.sortOrder || 'desc';
    const orderBy = { [sortBy]: sortOrder };

    const [cities, total] = await Promise.all([
      prisma.city.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: { activities: true, sections: true, savedByUsers: true }
          }
        }
      }),
      prisma.city.count({ where })
    ]);

    return {
      cities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getCityById(cityId) {
    const city = await prisma.city.findUnique({
      where: { id: cityId },
      include: {
        _count: {
          select: { activities: true, sections: true, savedByUsers: true }
        },
        globalActivities: {
          take: 5,
          orderBy: { rating: 'desc' }
        }
      }
    });

    if (!city) throw new Error('City not found');

    // Increment search count
    await prisma.city.update({
      where: { id: cityId },
      data: { searchCount: { increment: 1 } }
    }).catch(() => {});

    return city;
  }

  async getPopularCities() {
    return await prisma.city.findMany({
      orderBy: [
        { popularityScore: 'desc' },
        { savedByUsers: { _count: 'desc' } }
      ],
      take: 10,
      include: {
        _count: { select: { savedByUsers: true } }
      }
    });
  }

  async getTrendingCities() {
    // Trending based on high search count and recent activity
    return await prisma.city.findMany({
      where: { isTrending: true },
      orderBy: { searchCount: 'desc' },
      take: 10
    });
  }

  async getRecommendedCities(userId = null) {
    if (!userId) {
      return await this.getPopularCities();
    }

    // Recommendation based on user's favorite cities' countries or budget ranges
    const favorites = await prisma.favoritePlace.findMany({
      where: { userId },
      include: { city: true }
    });

    if (favorites.length === 0) return await this.getPopularCities();

    const preferredCountries = [...new Set(favorites.map(f => f.city.country))];
    const avgBudget = favorites.reduce((sum, f) => sum + (f.city.averageBudget || 0), 0) / favorites.length;

    return await prisma.city.findMany({
      where: {
        OR: [
          { country: { in: preferredCountries } },
          { averageBudget: { gte: avgBudget * 0.7, lte: avgBudget * 1.3 } }
        ],
        id: { notIn: favorites.map(f => f.cityId) }
      },
      take: 10,
      orderBy: { popularityScore: 'desc' }
    });
  }

  async getCityActivities(cityId, query) {
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) throw new Error('City not found');

    const limit = parseInt(query.limit) || 10;
    const page = parseInt(query.page) || 1;
    const offset = (page - 1) * limit;

    // Try Foursquare via utility
    const activities = await foursquareService.getActivities(city.name, query.category || '', limit, offset);
    
    return activities;
  }

  async getCityWeather(cityId) {
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) throw new Error('City not found');

    return await weatherService.getCityWeather(city.name);
  }

  async getBudgetInsights(cityId) {
    const city = await prisma.city.findUnique({ 
      where: { id: cityId },
      include: {
        sections: {
          include: { expenses: true }
        }
      }
    });

    if (!city) throw new Error('City not found');

    // Aggregate real data if available
    const expenses = city.sections.flatMap(s => s.expenses);
    
    let insights = {};
    if (expenses.length > 0) {
      const totals = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        acc.total += exp.amount;
        return acc;
      }, { total: 0 });

      insights = {
        averageDailyBudget: totals.total / (city.sections.length || 1),
        breakdown: totals,
        source: 'community-data'
      };
    } else {
      // Use AI for estimates if no real data
      const prompt = `Provide travel budget insights for ${city.name}, ${city.country}. 
      Include average costs for: Hotel (per night), Food (per day), Transport (local), and 3 budget tips.
      Return JSON: {"hotel": 0, "food": 0, "transport": 0, "tips": []}`;
      
      const aiResponse = await aiService._callAI(prompt);
      insights = {
        ...aiResponse,
        averageDailyBudget: (aiResponse?.hotel || 0) + (aiResponse?.food || 0) + (aiResponse?.transport || 0),
        source: 'ai-estimate'
      };
    }

    return insights;
  }
}

module.exports = new CityService();
