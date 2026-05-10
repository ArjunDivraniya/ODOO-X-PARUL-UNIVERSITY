import api from './axios';

export const searchGlobal = (query) => api.get('/search/global', { params: { q: query } });
export const searchCities = (query) => api.get('/search/cities', { params: { q: query } });
export const searchActivities = (query) => api.get('/search/activities', { params: { q: query } });
export const searchTrips = (query) => api.get('/search/trips', { params: { q: query } });
export const searchCommunity = (query) => api.get('/search/community', { params: { q: query } });

export const getRecommendations = (type) => api.get(`/recommendations/${type}`);
export const getCities = (params) => api.get('/cities', { params });
export const getCity = (cityId) => api.get(`/cities/${cityId}`);

export const getWeather = (city) => api.get(`/weather/${city}`);
export const getWeatherForecast = (city) => api.get(`/weather/${city}/forecast`);
