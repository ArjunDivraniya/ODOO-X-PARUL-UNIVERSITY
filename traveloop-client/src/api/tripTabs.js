import api from './axios';

export const getTripSections = (tripId) => api.get(`/trip-sections/${tripId}`);
export const createTripSection = (payload) => api.post('/trip-sections', payload);
export const updateTripSection = (sectionId, payload) => api.patch(`/trip-sections/${sectionId}`, payload);
export const deleteTripSection = (sectionId) => api.delete(`/trip-sections/${sectionId}`);
export const reorderTripSections = (payload) => api.patch('/trip-sections/reorder', payload);

export const getActivities = (tripId, category) => {
  const params = category ? `?category=${category}` : '';
  return api.get(`/activities/${tripId}${params}`);
};
export const getActivity = (activityId) => api.get(`/activities/single/${activityId}`);
export const createActivity = (payload) => api.post('/activities', payload);
export const updateActivity = (activityId, payload) => api.patch(`/activities/${activityId}`, payload);
export const deleteActivity = (activityId) => api.delete(`/activities/${activityId}`);

export const getExpenses = (tripId, category) => {
  const params = category ? `?category=${category}` : '';
  return api.get(`/expenses/${tripId}${params}`);
};
export const getExpense = (expenseId) => api.get(`/expenses/single/${expenseId}`);
export const createExpense = (payload) => api.post('/expenses', payload);
export const updateExpense = (expenseId, payload) => api.patch(`/expenses/${expenseId}`, payload);
export const deleteExpense = (expenseId) => api.delete(`/expenses/${expenseId}`);

export const getNotes = (tripId) => api.get(`/notes/${tripId}`);
export const getNote = (noteId) => api.get(`/notes/single/${noteId}`);
export const createNote = (payload) => api.post('/notes', payload);
export const updateNote = (noteId, payload) => api.patch(`/notes/${noteId}`, payload);
export const deleteNote = (noteId) => api.delete(`/notes/${noteId}`);

export const getPackingList = (tripId) => api.get(`/packing-list/${tripId}`);
export const createPackingItem = (payload) => api.post('/packing-list', payload);
export const updatePackingItem = (itemId, payload) => api.patch(`/packing-list/${itemId}`, payload);
export const togglePackingItem = (itemId) => api.patch(`/packing-list/${itemId}/toggle`);
export const deletePackingItem = (itemId) => api.delete(`/packing-list/${itemId}`);

export const getInvoices = (tripId) => api.get(`/invoices/${tripId}`);
export const createInvoice = (payload) => api.post('/invoices/generate', payload);
export const updateInvoiceStatus = (invoiceId, payload) => api.patch(`/invoices/${invoiceId}/status`, payload);
