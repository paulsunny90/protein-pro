import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || "https://protein-pro-2.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token if you are using local storage (optional backup to cookies)
api.interceptors.request.use(
    (config) => {
        // Let the browser set the boundary for multipart/form-data
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        // If you were using localStorage for tokens:
        // const token = localStorage.getItem('accessToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh (advanced)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Handle 401 errors (unauthorized) - e.g., redirect to login or refresh token
        if (error.response && error.response.status === 401) {
            // Optional: Trigger token refresh here if you are handling it client-side
        }
        return Promise.reject(error);
    }
);

export default api;
