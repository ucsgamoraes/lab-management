import axios from 'axios';

const api = axios.create({
  baseURL: 'https://laboratorio-5vcf.onrender.com', // Altere conforme necessário
});

api.interceptors.request.use(
  (config) => {
    const storage = localStorage.getItem('token'); // ou sessionStorage
    const parsed = JSON.parse(storage)
    if (storage) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
