// src/utils/axiosInstance.ts
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://aquasentinel-dashboard.up.railway.app",
});

// Add a request interceptor to include JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log("Token not found");
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
