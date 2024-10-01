import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      
      // You might also want to redirect to the login page or dispatch a logout action
      // For example:
      // window.location.href = '/login';
      // or if you're using React Router:
      // history.push('/login');
      // or if you're using Redux:
      // store.dispatch(logoutAction());
    }
    return Promise.reject(error);
  }
);

export default instance;