import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('usuario') || 'null'),
  token: localStorage.getItem('token') || null,
  isLoading: false,

  login: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    // Configurar header global para todas las peticiones futuras
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    
    set({ isAuthenticated: true, user: data.user, token: data.token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    delete axios.defaults.headers.common['Authorization'];
    
    set({ isAuthenticated: false, user: null, token: null });
  },

  updateUser: (newData) => {
    const updatedUser = { ...get().user, ...newData };
    localStorage.setItem('usuario', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  setLoading: (status) => set({ isLoading: status }),

  hasRole: (roleName) => get().user?.roles?.includes(roleName) || false,
}));