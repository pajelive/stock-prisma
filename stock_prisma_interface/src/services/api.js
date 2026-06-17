import axios from "axios";

const api = axios.create({
    baseURL: "https://api.stockprisma.com.br/api/v1/",
    timeout: 15000
});

api.interceptors.request.use((config) => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario?.token) {
        config.headers.Authorization = `Bearer ${usuario.token}`;
    }

    return config;
});

export default api;