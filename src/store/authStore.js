import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('usuario')) || null,
  token: localStorage.getItem('token') || null,

  login: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    
    set({ 
      isAuthenticated: true, 
      user: data.user, 
      token: data.token 
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    set({ 
      isAuthenticated: false, 
      user: null, 
      token: null 
    });
  },

  hasRole: (roleName) => {
    const state = useAuthStore.getState();
    return state.user?.roles?.includes(roleName) || false;
  }
}));