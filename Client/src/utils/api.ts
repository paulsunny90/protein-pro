import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token if you are using local storage (optional backup to cookies)
api.interceptors.request.use(
    (config) => {
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
