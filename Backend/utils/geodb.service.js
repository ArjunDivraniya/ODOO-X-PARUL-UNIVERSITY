const axios = require('axios');
const cacheService = require('./cache.service');

class GeoDBService {
  constructor() {
    this.apiKey = process.env.GEODB_API_KEY;
    this.baseUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
  }

  async searchCities(query) {
    if (!query) return [];
    
    const cacheKey = `geodb:search:${query.toLowerCase()}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    if (!this.apiKey) {
      // Fallback for missing API key: simulate response or return empty
      console.warn('GEODB_API_KEY is missing. Returning empty city results.');
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/cities`, {
        params: { namePrefix: query, limit: 10, sort: '-population' },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
      });

      const cities = response.data.data.map(city => ({
        name: city.city,
        country: city.country,
        countryCode: city.countryCode,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone
      }));

      await cacheService.set(cacheKey, cities, 3600 * 24 * 7); // Cache for 1 week
      return cities;
    } catch (error) {
      console.error('GeoDB Search Error:', error.message);
      return [];
    }
  }
}

module.exports = new GeoDBService();
