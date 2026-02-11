import axios from 'axios';

const API_URL = 'https://dev-vault-n8pu.onrender.com';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// 2. Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Get the URL of the request that failed
        const originalRequestUrl = error.config?.url || '';

        // FIX: Do NOT redirect if the 401 came from logging in or registering.
        // We want the LoginForm to display "Invalid Password" instead of reloading.
        if (
            error.response?.status === 401 &&
            !originalRequestUrl.includes('/auth/login') &&
            !originalRequestUrl.includes('/auth/register')
        ) {
            if (typeof window !== 'undefined') {
                // Token is invalid/expired. Wipe it.
                localStorage.removeItem('token');

                // Only redirect if we aren't already on the login page to avoid loops
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        // Return the error so react-query's onError can show the Toast
        return Promise.reject(error);
    }
);