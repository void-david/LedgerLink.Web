import axios from "axios";

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type' : 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default apiClient;