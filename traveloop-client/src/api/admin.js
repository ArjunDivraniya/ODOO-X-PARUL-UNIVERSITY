import api from './axios';

export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const getAdminTrips = (params) => api.get('/admin/trips', { params });
export const blockAdminUser = (userId, isBlocked) => api.patch(`/admin/users/${userId}/block`, { isBlocked });
export const deleteAdminUser = (userId) => api.delete(`/admin/users/${userId}`);
