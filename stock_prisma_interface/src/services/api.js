import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.stockprisma.com.br/api/v1/',
    timeout: 15000
})

export default api;