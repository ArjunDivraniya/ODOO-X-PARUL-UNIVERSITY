import api from './axios';

export const getPosts = (params) => api.get('/community/posts', { params });
export const getPost = (postId) => api.get(`/community/posts/${postId}`);
export const createPost = (formData) => api.post('/community/posts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePost = (postId, payload) => api.patch(`/community/posts/${postId}`, payload);
export const deletePost = (postId) => api.delete(`/community/posts/${postId}`);
export const addComment = (postId, payload) => api.post(`/community/posts/${postId}/comment`, payload);
export const toggleLike = (postId) => api.post(`/community/posts/${postId}/like`);
