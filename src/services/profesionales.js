import api from "./api";

export const getProfesionales = () => api.get("/profesionales");

export const getProfesionalById = (id) => api.get(`/profesionales/${id}`);

export const createProfesional = (data) => api.post("/profesionales", data);

export const updateProfesional = (id, data) =>
  api.put(`/profesionales/${id}`, data);

export const deleteProfesional = (id) => api.delete(`/profesionales/${id}`);

export const asignarEspecialidades = (id, especialidadesIds) =>
  api.put(`/profesionales/${id}/especialidades`, { especialidadesIds });

export const getTurnosByProfesional = (id) =>
  api.get(`/profesionales/${id}/turnos`);
