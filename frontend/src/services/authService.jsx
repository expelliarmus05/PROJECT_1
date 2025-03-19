import axiosInstance from '../api/axiosInstance.jsx';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8080'; // Replace with your Spring Boot backend URL

const authService = {
    login: async (username, password) => {
        const response = await axiosInstance.post(
            `${API_URL}/api/auth/login`,
            {username, password},
            {withCredentials: true} // Send cookies
        );
        return response.data;
    },

    register: async (firstName, lastName, username, email, password) => {
        console.log(firstName, lastName, username, email, password);
        const response = await axiosInstance.post(
            `${API_URL}/api/auth/register`,
            {
                firstName,
                lastName,
                username,
                email,
                password,
            },
            {withCredentials: true} // Send cookies
        );
        console.log(response.data);
        return response.data;
    },

    refreshToken: async () => {
        const response = await axiosInstance.post(
            `${API_URL}/api/auth/refresh`,
            {withCredentials: true} // Send cookies
        );
        return response.data;
    },

    logout: () => {
        Cookies.remove('accessToken', {path: '/'});
        Cookies.remove('refreshToken', {path: '/'});
    },

    getAccessToken: () => {
        return Cookies.get('accessToken');
    },

    isAuthenticated: () => {
        return !!Cookies.get('accessToken');
    },
};

export default authService;