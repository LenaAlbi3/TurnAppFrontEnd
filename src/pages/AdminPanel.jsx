import { useState } from "react";

const SECCIONES = {
  PROFESIONALES: "profesionales",
  ESPECIALIDADES: "especialidades",
  AGENDA: "agenda",
  USUARIOS: "usuarios",
  TURNOS: "turnos",
  METRICAS: "metricas",
};

const TABS = [
  { key: SECCIONES.PROFESIONALES, label: "Profesionales" },
  { key: SECCIONES.ESPECIALIDADES, label: "Especialidades" },
  { key: SECCIONES.AGENDA, label: "Agenda" },
  { key: SECCIONES.USUARIOS, label: "Usuarios" },
  { key: SECCIONES.TURNOS, label: "Turnos" },
  { key: SECCIONES.METRICAS, label: "Métricas" },
];

export default function AdminPanel() {
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES.PROFESIONALES);

  return (
    <div>
      <h1>Panel de Administración</h1>

      <nav>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSeccionActiva(tab.key)}
            disabled={seccionActiva === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div>
        {seccionActiva === SECCIONES.PROFESIONALES && (
          <div>Sección Profesionales (pendiente)</div>
        )}
        {seccionActiva === SECCIONES.ESPECIALIDADES && (
          <div>Sección Especialidades (pendiente)</div>
        )}
        {seccionActiva === SECCIONES.AGENDA && (
          <div>Sección Agenda (pendiente)</div>
        )}
        {seccionActiva === SECCIONES.USUARIOS && (
          <div>Sección Usuarios (pendiente)</div>
        )}
        {seccionActiva === SECCIONES.TURNOS && (
          <div>Sección Turnos (pendiente)</div>
        )}
        {seccionActiva === SECCIONES.METRICAS && (
          <div>Sección Métricas (pendiente)</div>
        )}
      </div>
    </div>
  );
}
