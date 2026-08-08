import api from './axios';

export const listStores   = (params)     => api.get('/user/stores', { params });
export const submitRating = (data)       => api.post('/user/ratings', data);
export const updateRating = (id, data)   => api.patch(`/user/ratings/${id}`, data);
