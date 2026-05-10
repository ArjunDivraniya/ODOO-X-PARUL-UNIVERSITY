import api from './axios';

export const getAnalyticsDashboard = () => api.get('/analytics/user');
export const getTripAnalytics = (tripId) => api.get(`/analytics/trip/${tripId}`);
