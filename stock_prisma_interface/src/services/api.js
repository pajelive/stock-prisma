import axios from "axios";

const api = axios.create({
    baseURL: "https://api.stockprisma.com.br/api/v1/",
    timeout: 15000,
    withCredentials: true
});

{/*adicionar a correção para não buscar autenticação em rotas publicas*/}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthMe = error.config?.url?.includes("/auth/me");
        const isLogin = error.config?.url?.includes("/auth/login");

        if (error.response?.status === 401 && !isAuthMe && !isLogin) {
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;