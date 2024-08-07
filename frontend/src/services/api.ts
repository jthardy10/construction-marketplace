import axios from 'axios';
import { store } from '../store';

const api = axios.create({
  baseURL: 'https://13.54.75.212/api',
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
