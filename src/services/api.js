import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { default: useAuthStore } = await import("../store/authStore");
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
