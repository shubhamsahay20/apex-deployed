// // api.js
// import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ,
//   headers:{
//     "Content-Type":'application/json'
//   }
//   // withCredentials: true
// });

// export default API;

// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor: set Content-Type dynamically
API.interceptors.request.use((config) => {
  // If the data is FormData, let Axios set multipart boundary automatically
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    // Default for JSON APIs
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
      // Session expired → clear localStorage and redirect
      localStorage.removeItem('user');
      window.location.href = '/login'; // redirect to login
    }
    return Promise.reject(error);
  },
);

export default API;
