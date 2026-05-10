const { prisma } = require('../lib/prisma');
const geodbService = require('../utils/geodb.service');
const foursquareService = require('../utils/foursquare.service');
const weatherService = require('../utils/weather.service');
const aiService = require('../utils/ai.service');

class RecommendationService {
  async getDashboardRecommendations(userId = null) {
    // 1. Trending Destinations (from DB)
    const trendingDestinations = await prisma.city.findMany({
      where: { isTrending: true },
      take: 6,
      orderBy: { popularityScore: 'desc' }
    });

    // 2. AI Picks (static or semi-dynamic for dashboard)
    const aiRecommendations = await aiService.findHiddenGems() || [];

    // 3. Budget Friendly (from DB)
    const budgetTrips = await prisma.city.findMany({
      where: { averageBudget: { lte: 50000 } }, // Example threshold
      take: 6,
      orderBy: { averageBudget: 'asc' }
    });

    // 4. Popular Activities (from DB or cached GlobalActivity)
    const popularActivities = await prisma.globalActivity.findMany({
      take: 6,
      orderBy: { rating: 'desc' }
    });

    return {
      trendingDestinations,
      aiRecommendations,
      budgetTrips,
      popularActivities
    };
  }

  async searchCities(query) {
    // 1. Check DB first
    const dbCities = await prisma.city.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 5
    });

    // 2. Fetch from GeoDB for more results
    const externalCities = await geodbService.searchCities(query);

    // 3. Merge and Save new cities to DB (async)
    this._saveNewCities(externalCities);

    return {
      cities: [...dbCities, ...externalCities].filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
    };
  }

  async getActivities(cityName, category) {
    // 1. Check GlobalActivity cache in DB
    const cachedActivities = await prisma.globalActivity.findMany({
      where: {
        city: { name: { equals: cityName, mode: 'insensitive' } },
        ...(category && { category: { contains: category, mode: 'insensitive' } })
      },
      take: 10
    });

    if (cachedActivities.length > 0) return cachedActivities;

    // 2. Fetch from Foursquare
    const externalActivities = await foursquareService.getActivities(cityName, category);

    // 3. Cache them (async)
    this._saveNewActivities(cityName, externalActivities);

    return externalActivities;
  }

  async getTrending() {
    const [trendingCities, trendingTrips] = await Promise.all([
      prisma.city.findMany({ orderBy: { searchCount: 'desc' }, take: 10 }),
      prisma.trip.findMany({ 
        where: { visibility: 'PUBLIC' },
        orderBy: { createdAt: 'desc' }, // Should ideally be 'savesCount' or similar
        take: 10,
        include: { owner: { select: { firstName: true, lastName: true } } }
      })
    ]);

    return { trendingCities, trendingTrips };
  }

  async getWeatherBased(weatherCondition) {
    // This requires a weather-to-city mapping or AI logic
    // For now, let's use AI to suggest cities based on weather
    const prompt = `Suggest 5 popular travel destinations that currently have ${weatherCondition} weather.
    Return a valid JSON array of objects: [{"name": "", "country": "", "description": ""}]`;
    
    return await aiService._callAI(prompt);
  }

  async explore() {
    const categories = ['Adventure', 'Food', 'Culture', 'Nightlife', 'Nature', 'Relaxation'];
    const [trending, seasonal] = await Promise.all([
      this.getTrending(),
      this.getSeasonalRecommendations()
    ]);

    return {
      categories,
      trending,
      seasonal
    };
  }

  async getSeasonalRecommendations(season = null) {
    if (!season) {
      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'autumn';
      else season = 'winter';
    }

    const prompt = `Recommend 5 best travel destinations for the ${season} season.
    Return a valid JSON array of objects: [{"name": "", "country": "", "description": ""}]`;
    
    return await aiService._callAI(prompt);
  }

  async _saveNewCities(cities) {
    for (const cityData of cities) {
      await prisma.city.upsert({
        where: { name_country: { name: cityData.name, country: cityData.country } }, // Assumes unique constraint exists or just use upsert with find
        update: { searchCount: { increment: 1 } },
        create: {
          name: cityData.name,
          country: cityData.country,
          countryCode: cityData.countryCode,
          latitude: cityData.latitude,
          longitude: cityData.longitude,
          timezone: cityData.timezone
        }
      }).catch(() => {});
    }
  }

  async _saveNewActivities(cityName, activities) {
    const city = await prisma.city.findFirst({ where: { name: { equals: cityName, mode: 'insensitive' } } });
    if (!city) return;

    for (const act of activities) {
      await prisma.globalActivity.upsert({
        where: { foursquareId: act.fsq_id },
        update: { rating: act.rating },
        create: {
          foursquareId: act.fsq_id,
          title: act.title,
          description: act.description,
          category: act.category,
          location: act.location,
          rating: act.rating,
          image: act.image,
          cityId: city.id
        }
      }).catch(() => {});
    }
  }
}

module.exports = new RecommendationService();
