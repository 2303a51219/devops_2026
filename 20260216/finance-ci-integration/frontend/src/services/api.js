import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const financeService = {
  getDashboard: () => api.get('/dashboard'),
  getExpenses: () => api.get('/expenses'),
  getIncome: () => api.get('/income'),
  addExpense: (data) => api.post('/expenses', data),
  addIncome: (data) => api.post('/income', data),
};

export default api;
