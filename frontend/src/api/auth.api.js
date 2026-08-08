import api from './axios';

export const register       = (data) => api.post('/auth/register', data);
export const login          = (data) => api.post('/auth/login', data);
export const changePassword = (data) => api.patch('/auth/change-password', data);
