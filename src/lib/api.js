import axios from 'axios';

// Solo envia la clave del usuario; el token externo nunca llega al navegador.
const api = axios.create();
api.interceptors.request.use(config => {
    const key = localStorage.getItem('key');
    if (key) config.headers.set('key', key);
    return config;
});
export default api;
