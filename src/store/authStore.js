import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null, // Aquí podrías guardar { nombre, roles: ["Admin", "User"], etc. }
  
  // Funciones de ejemplo para simular login/logout
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));