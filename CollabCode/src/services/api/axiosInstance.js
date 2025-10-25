// src/services/api/axiosInstance.js
import axios from 'axios';
import { API_BASE, LOCALSTORAGE_TOKEN_KEY } from '../../config/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 100000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;