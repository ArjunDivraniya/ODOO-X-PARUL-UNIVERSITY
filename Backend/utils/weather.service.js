const axios = require('axios');
const cacheService = require('./cache.service');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCityWeather(city) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    if (!this.apiKey) return null;

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: { q: city, appid: this.apiKey, units: 'metric' }
      });

      const weather = {
        temp: response.data.main.temp,
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      };

      await cacheService.set(cacheKey, weather, 3600 * 3); // Cache for 3 hours
      return weather;
    } catch (error) {
      console.error('Weather API Error:', error.message);
      return null;
    }
  }
}

module.exports = new WeatherService();
