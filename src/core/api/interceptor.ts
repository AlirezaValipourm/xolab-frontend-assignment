import axios from 'axios';
import { envConfig } from '../../constants/envConfig';

const api = axios.create({
    baseURL: envConfig.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});



// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("inteceptor:error", error)
        const message = error.response?.data?.message || 'An error occurred';
        console.log("message", message)
        return Promise.reject(error);
    }
);

export { api };