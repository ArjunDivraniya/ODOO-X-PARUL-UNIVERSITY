const axios = require('axios');
const cacheService = require('./cache.service');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(city) {
    const cacheKey = `weather_current_${city.toLowerCase()}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const weather = {
        city: response.data.name,
        temperature: Math.round(response.data.main.temp),
        condition: response.data.weather[0].main,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        icon: response.data.weather[0].icon
      };

      await cacheService.set(cacheKey, weather, 1800); // 30 min cache
      return weather;
    } catch (error) {
      console.error('Weather API Error:', error.message);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getForecast(city) {
    const cacheKey = `weather_forecast_${city.toLowerCase()}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const forecast = response.data.list
        .filter((_, index) => index % 8 === 0) // Every 24 hours
        .map(item => ({
          date: item.dt_txt.split(' ')[0],
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          icon: item.weather[0].icon
        }));

      await cacheService.set(cacheKey, forecast, 3600); // 1 hour cache
      return forecast;
    } catch (error) {
      console.error('Forecast API Error:', error.message);
      throw new Error('Failed to fetch forecast data');
    }
  }
}

module.exports = new WeatherService();
