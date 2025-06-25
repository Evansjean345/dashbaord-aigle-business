import axios from 'axios';
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
// const baseURL = "http://192.168.1.10:3333/api";

const api = axios.create({
    baseURL: baseURL,
});

const resetPasswordApi = axios.create({
    baseURL: baseURL,
});

resetPasswordApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('ResetPasswordToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                Cookies.remove('auth_token')
                localStorage.removeItem("auth-storage")
                localStorage.removeItem("organisation-storage")
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
)

resetPasswordApi.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                Cookies.remove('opt-confirmation')
                localStorage.removeItem("auth-storage")
                localStorage.removeItem("organisation-storage")
                localStorage.removeItem("ResetPasswordToken")
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
)


export {api, resetPasswordApi};
