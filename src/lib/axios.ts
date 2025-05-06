import axios from 'axios';
import nextConfig from '../../next.config';
import {refreshToken} from "@/api/auth";

const axiosInstance = axios.create({
    baseURL: nextConfig.env.API_BASE_URL,
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                await refreshToken();
                const newToken = localStorage.getItem('accessToken');
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        const status = error.response?.status;
        switch (status) {
            case 401:
            case 403:
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                break;
            case 500:
                alert("서버 오류입니다.");
                break;
            default:
                alert("에러가 발생했습니다.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;