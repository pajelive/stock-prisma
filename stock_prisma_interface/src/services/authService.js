import api from './api';

api.interceptors.request.use((config) => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario?.token) {
        config.headers.Authorization = `Bearer ${usuario.token}`;
    }

    return config;
});
