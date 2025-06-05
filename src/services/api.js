import axios from 'axios';

const api = axios.create({
  baseURL: 'https://laboratorio-5vcf.onrender.com', // Altere conforme necessário
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ou sessionStorage
    if (!token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
