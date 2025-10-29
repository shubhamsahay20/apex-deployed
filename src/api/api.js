import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


API.interceptors.request.use((config) => {
 
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
  
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 440)
    ) {

      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  },
);

export default API;
