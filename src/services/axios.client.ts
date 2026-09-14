import axios from 'axios';
import { axiosConfig } from '@/config/axios.config';

export const TOKEN_KEY = 'accessToken';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

const api = axios.create(axiosConfig);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        // Error de validación del servidor; el llamador lo traduce en el mensaje visible
        console.error('Bad Request:', error.response?.data);
        break;
      case 403:
        // Acceso denegado por rol
        console.warn(
          'Forbidden: You are not authorized to perform this action.',
        );
        break;
      case 401:
        // Sesión expirada o token inválido: se limpia la sesión localmente y
        // se notifica a AuthProvider para sincronizar el estado en memoria.
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
        console.warn(
          'Unauthorized: Your session has expired or you are not logged in.',
        );
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
);

export default api;
