import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.stockprisma.com.br',
    timeout: 5000
})

export default api;