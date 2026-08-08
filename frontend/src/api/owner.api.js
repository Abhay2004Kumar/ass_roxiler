import api from './axios';

export const getDashboard = () => api.get('/owner/dashboard');
