import api from "./api";

export const getPacientes = () => api.get("/pacientes");

export const getPacienteById = (id) => api.get(`/pacientes/${id}`);

export const createPaciente = (data) => api.post("/pacientes", data);

export const updatePaciente = (id, data) => api.put(`/pacientes/${id}`, data);

export const deletePaciente = (id) => api.delete(`/pacientes/${id}`);

export const asignarTurnosAPaciente = (id, turnosIds) =>
  api.put(`/pacientes/${id}/turnos`, { turnosIds });

export const getTurnosByPaciente = (id) => api.get(`/pacientes/${id}/turnos`);

export const getTurnosPropios = () =>
  api.get("http://localhost:5000/turnos-propios");
