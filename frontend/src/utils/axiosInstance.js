import axios from "axios";
import { tokenUtils } from "./tokenUtils";


const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL,
    // withCredentials : true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenUtils.getToken();
        if(token){
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>{
        if(error.response?.status === (401)){
            tokenUtils.clearAuth();
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;