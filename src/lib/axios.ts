import axios from 'axios';
import nextConfig from '../../next.config';

const axiosInstance = axios.create({
    baseURL: nextConfig.env.API_BASE_URL,
    timeout: 5000,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        switch (status) {
            case 401:
                alert("인증이 필요합니다.");
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