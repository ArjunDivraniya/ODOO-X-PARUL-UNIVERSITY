import api from './axios';

export const getAIHistory = () => api.get('/ai/history');
export const getAIHistoryForTrip = (tripId) => api.get(`/ai/history/${tripId}`);
export const sendAIMessage = (payload) => api.post('/ai/chat', payload);
export const deleteAIHistoryItem = (chatId) => api.delete(`/ai/history/${chatId}`);
