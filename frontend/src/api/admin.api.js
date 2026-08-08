import api from './axios';

export const getDashboard  = ()           => api.get('/admin/dashboard');

export const createUser    = (data)       => api.post('/admin/users', data);
export const listUsers     = (params)     => api.get('/admin/users', { params });
export const getUserDetail = (id)         => api.get(`/admin/users/${id}`);

export const createStore   = (data)       => api.post('/admin/stores', data);
export const listStores    = (params)     => api.get('/admin/stores', { params });
