import api from "./api";

export const getEspecialidades = () => api.get("/especialidad");

export const getEspecialidadById = (id) => api.get(`/especialidad/${id}`);

export const createEspecialidad = (data) => api.post("/especialidad", data);

export const updateEspecialidad = (id, data) =>
  api.put(`/especialidad/${id}`, data);

export const deleteEspecialidad = (id) => api.delete(`/especialidad/${id}`);
