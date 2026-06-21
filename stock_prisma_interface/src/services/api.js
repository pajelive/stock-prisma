import axios from "axios";

const api = axios.create({
    baseURL: "https://api.stockprisma.com.br/api/v1/",
    timeout: 15000,
    withCredentials: true
});

// intercept apenas 401
api.interceptors.response.use(
    (response) => response,
    (error) => {

        const status = error.response?.status;
        const url = error.config?.url || "";

        const isAuthRoute =
            url.includes("/auth/me") ||
            url.includes("/admin/auth/login");

        if (status === 401 && !isAuthRoute) {
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;