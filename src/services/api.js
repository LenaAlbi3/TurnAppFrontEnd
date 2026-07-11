import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Importación directa

const api = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Obtenemos el token desde el estado de Zustand
  const token = useAuthStore.getState().token; 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde 401, cerramos la sesión y limpiamos el store
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Opcional: podrías redirigir al login aquí si usas un router
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  },
);

export default api;