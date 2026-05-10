const axios = require('axios');
const cacheService = require('./cache.service');

class FoursquareService {
  constructor() {
    this.apiKey = process.env.FOURSQUARE_API_KEY;
    this.baseUrl = 'https://api.foursquare.com/v3/places';
  }

  async getActivities(city, category = '', limit = 15, offset = 0) {
    const cacheKey = `foursquare:activities:${city.toLowerCase()}:${category.toLowerCase()}:${limit}:${offset}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    if (!this.apiKey) {
      console.warn('FOURSQUARE_API_KEY is missing.');
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          near: city,
          categories: this._getCategoryIds(category),
          limit: limit,
          offset: offset,
          sort: 'POPULARITY',
          fields: 'fsq_id,name,description,rating,photos,location,categories'
        },
        headers: {
          Authorization: this.apiKey
        }
      });

      const activities = response.data.results.map(place => ({
        fsq_id: place.fsq_id,
        title: place.name,
        description: place.description || '',
        category: place.categories[0]?.name || 'Activity',
        rating: place.rating || 0,
        location: place.location.formatted_address,
        image: place.photos[0] ? `${place.photos[0].prefix}original${place.photos[0].suffix}` : null
      }));

      await cacheService.set(cacheKey, activities, 3600 * 24 * 3); // Cache for 3 days
      return activities;
    } catch (error) {
      console.error('Foursquare API Error:', error.message);
      return [];
    }
  }

  _getCategoryIds(category) {
    const mapping = {
      'Adventure': '19000', // Attractions
      'Food': '13000',      // Dining and Drinking
      'Culture': '10000',   // Arts and Entertainment
      'Nightlife': '10008', // Nightlife Spots
      'Nature': '16000',    // Landmarks and Outdoors
      'Relaxation': '11000' // Business and Professional Services -> Spas? No, 11045
    };
    return mapping[category] || '';
  }
}

module.exports = new FoursquareService();
