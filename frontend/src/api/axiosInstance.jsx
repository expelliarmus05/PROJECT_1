// src/api/axiosInstance.jsx
import axios from 'axios';
import authService from '../services/authService';

const API_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
const getCsrfToken = () => {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    console.log(decodeURIComponent(match[1]));
    return match ? decodeURIComponent(match[1]) : null;
};

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = authService.getAccessToken();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
        return config;

    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newTokens = await authService.refreshToken();
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error(err);
                authService.logout();
                window.location.href = '/login'; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;