// src/services/auth.js
import api from "./api";

export const login = (data) => api.post("/auth/login", data);

export const register = (data) => api.post("/auth/register", data);

export const logout = () => api.post("/auth/logout");

export const checkAuth = () => api.get("/auth/check-auth");

export const updateUserRoles = (userId, roleIds) =>
  api.put(`/auth/update-roles/${userId}`, { roleIds });
