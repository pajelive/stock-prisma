import axios from "axios";

const api = axios.create({
    baseURL: "https://api.stockprisma.com.br/api/v1/",
    timeout: 15000,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 401) {

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;